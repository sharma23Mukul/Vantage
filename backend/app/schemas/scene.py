import uuid
from pydantic import BaseModel
from .material import MaterialResponse


class SceneResponse(BaseModel):
    id: uuid.UUID
    product_id: uuid.UUID
    gltf_url: str
    texture_urls: list | None = None
    camera_default_position: list | None = None
    regions: list | None = None
    lod_tier: int | None = 0
    materials: list[MaterialResponse] = []

    model_config = {"from_attributes": True}
