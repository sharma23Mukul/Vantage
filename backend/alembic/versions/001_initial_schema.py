"""initial schema

Revision ID: 001
Revises:
Create Date: 2025-07-07
"""
import uuid
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import JSONB, UUID

revision = "001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "products",
        sa.Column("id", UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("description", sa.Text, nullable=True),
        sa.Column("category", sa.String(100), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )

    op.create_table(
        "scenes",
        sa.Column("id", UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column("product_id", UUID(as_uuid=True), sa.ForeignKey("products.id", ondelete="CASCADE"), nullable=False),
        sa.Column("gltf_url", sa.String(500), nullable=False),
        sa.Column("texture_urls", JSONB, nullable=True),
        sa.Column("camera_default_position", JSONB, nullable=True),
        sa.Column("regions", JSONB, nullable=True),
        sa.Column("lod_tier", sa.Integer, default=0),
    )

    op.create_table(
        "materials",
        sa.Column("id", UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column("scene_id", UUID(as_uuid=True), sa.ForeignKey("scenes.id", ondelete="CASCADE"), nullable=False),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("base_color", sa.String(7), nullable=False),
        sa.Column("roughness", sa.Float, default=0.5),
        sa.Column("metalness", sa.Float, default=0.0),
    )

    op.create_table(
        "analytics_events",
        sa.Column("id", sa.Integer, primary_key=True, autoincrement=True),
        sa.Column("scene_id", UUID(as_uuid=True), sa.ForeignKey("scenes.id", ondelete="SET NULL"), nullable=True),
        sa.Column("event_type", sa.Enum("load_time", "fps_sample", "interaction", name="eventtype"), nullable=False),
        sa.Column("payload", JSONB, nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )


def downgrade():
    op.drop_table("analytics_events")
    op.drop_table("materials")
    op.drop_table("scenes")
    op.drop_table("products")
    op.execute("DROP TYPE IF EXISTS eventtype")
