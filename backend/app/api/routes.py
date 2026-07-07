import json
import uuid
from fastapi import APIRouter, Depends, BackgroundTasks, Query, HTTPException
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from ..core.database import get_db
from ..core.redis import get_redis
from ..models.product import Product
from ..models.scene import Scene
from ..models.material import Material
from ..models.analytics_event import AnalyticsEvent, EventType
from ..schemas.product import ProductResponse, ProductListResponse
from ..schemas.scene import SceneResponse
from ..schemas.material import MaterialResponse
from ..schemas.analytics import AnalyticsEventCreate

router = APIRouter(prefix="/api")

CACHE_TTL = 600  # 10 minutes


# ── Helpers ──
async def _write_analytics_event(db_session_factory, event_data: AnalyticsEventCreate):
    """Background task: write analytics event without blocking the response."""
    from ..core.database import async_session
    async with async_session() as session:
        event = AnalyticsEvent(
            scene_id=event_data.scene_id,
            event_type=EventType(event_data.event_type),
            payload=event_data.payload,
        )
        session.add(event)
        await session.commit()


# ── 1. GET /api/products ──
@router.get("/products", response_model=ProductListResponse)
async def list_products(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    redis = get_redis()
    cache_key = f"products:page:{page}:limit:{limit}"

    cached = await redis.get(cache_key)
    if cached:
        return json.loads(cached)

    offset = (page - 1) * limit
    total_q = await db.execute(select(func.count(Product.id)))
    total = total_q.scalar_one()

    result = await db.execute(
        select(Product).order_by(Product.created_at.desc()).offset(offset).limit(limit)
    )
    products = result.scalars().all()

    response = ProductListResponse(
        items=[ProductResponse.model_validate(p) for p in products],
        total=total,
        page=page,
        limit=limit,
    )
    await redis.setex(cache_key, CACHE_TTL, response.model_dump_json())
    return response


# ── 2. GET /api/products/{id}/scene ──
@router.get("/products/{product_id}/scene", response_model=SceneResponse)
async def get_product_scene(
    product_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
):
    redis = get_redis()
    cache_key = f"product:{product_id}:scene"

    cached = await redis.get(cache_key)
    if cached:
        return json.loads(cached)

    result = await db.execute(
        select(Scene)
        .where(Scene.product_id == product_id)
        .options(selectinload(Scene.materials))
        .limit(1)
    )
    scene = result.scalar_one_or_none()
    if not scene:
        raise HTTPException(status_code=404, detail="Scene not found for this product")

    response = SceneResponse.model_validate(scene)
    await redis.setex(cache_key, CACHE_TTL, response.model_dump_json())
    return response


# ── 3. GET /api/materials/{scene_id} ──
@router.get("/materials/{scene_id}", response_model=list[MaterialResponse])
async def get_scene_materials(
    scene_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Material).where(Material.scene_id == scene_id)
    )
    materials = result.scalars().all()
    return [MaterialResponse.model_validate(m) for m in materials]


# ── 4. POST /api/analytics/event ──
@router.post("/analytics/event", status_code=202)
async def create_analytics_event(
    event: AnalyticsEventCreate,
    background_tasks: BackgroundTasks,
):
    background_tasks.add_task(_write_analytics_event, None, event)
    return {"status": "accepted"}
