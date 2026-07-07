import uuid
from pydantic import BaseModel


class MaterialResponse(BaseModel):
    id: uuid.UUID
    scene_id: uuid.UUID
    name: str
    base_color: str
    roughness: float
    metalness: float

    model_config = {"from_attributes": True}
