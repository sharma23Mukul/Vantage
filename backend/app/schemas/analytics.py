import uuid
from pydantic import BaseModel


class AnalyticsEventCreate(BaseModel):
    scene_id: uuid.UUID | None = None
    event_type: str
    payload: dict | None = None
