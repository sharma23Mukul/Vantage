import redis.asyncio as redis
from .config import get_settings

settings = get_settings()

redis_client: redis.Redis | None = None


async def init_redis():
    global redis_client
    redis_client = redis.from_url(settings.REDIS_URL, decode_responses=True)


async def close_redis():
    global redis_client
    if redis_client:
        await redis_client.aclose()
        redis_client = None


def get_redis() -> redis.Redis:
    if redis_client is None:
        raise RuntimeError("Redis not initialized")
    return redis_client
