import uuid
from sqlalchemy import String, Float, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .base import Base


class Material(Base):
    __tablename__ = "materials"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    scene_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("scenes.id", ondelete="CASCADE"), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    base_color: Mapped[str] = mapped_column(String(7), nullable=False)
    roughness: Mapped[float] = mapped_column(Float, default=0.5)
    metalness: Mapped[float] = mapped_column(Float, default=0.0)

    scene: Mapped["Scene"] = relationship(back_populates="materials")
