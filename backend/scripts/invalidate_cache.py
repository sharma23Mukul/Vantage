"""Manually invalidate Redis cache keys."""
import asyncio
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

import redis.asyncio as aioredis
from app.core.config import get_settings

settings = get_settings()


async def invalidate(pattern: str = "product:*"):
    r = aioredis.from_url(settings.REDIS_URL, decode_responses=True)
    keys = []
    async for key in r.scan_iter(match=pattern):
        keys.append(key)
    if keys:
        await r.delete(*keys)
        print(f"Invalidated {len(keys)} keys matching '{pattern}': {keys}")
    else:
        print(f"No keys found matching '{pattern}'")
    await r.aclose()


if __name__ == "__main__":
    pat = sys.argv[1] if len(sys.argv) > 1 else "product:*"
    asyncio.run(invalidate(pat))
