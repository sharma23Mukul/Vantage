import uuid
from sqlalchemy import String, ForeignKey, Integer
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .base import Base


class Scene(Base):
    __tablename__ = "scenes"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    product_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    gltf_url: Mapped[str] = mapped_column(String(500), nullable=False)
    texture_urls: Mapped[dict | None] = mapped_column(JSONB, default=list)
    camera_default_position: Mapped[dict | None] = mapped_column(JSONB, default=list)
    regions: Mapped[dict | None] = mapped_column(JSONB, default=list)
    lod_tier: Mapped[int | None] = mapped_column(Integer, default=0)

    product: Mapped["Product"] = relationship(back_populates="scenes")
    materials: Mapped[list["Material"]] = relationship(back_populates="scene", cascade="all, delete-orphan")
    analytics_events: Mapped[list["AnalyticsEvent"]] = relationship(back_populates="scene")
