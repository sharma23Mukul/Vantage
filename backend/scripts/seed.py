"""Seed the database with data from the frontend's hardcoded brainRegionsData and variants."""
import asyncio
import uuid
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from sqlalchemy import select
from app.core.database import engine, async_session
from app.models.base import Base
from app.models.product import Product
from app.models.scene import Scene
from app.models.material import Material

# ── Data from frontend src/entities/brainModel/brainRegionsData.js ──
BRAIN_REGIONS = [
    {
        "id": "prefrontal",
        "name": "Prefrontal Cortex",
        "biology": "Executive function, planning, decision-making, complex reasoning",
        "skillTitle": "System Architecture",
        "skillDescription": "Designing scalable systems, planning codebases, making critical technical decisions, and breaking down complex problems into elegant solutions.",
        "position": [0.0, 0.015, 0.072],
        "popDirection": [0.0, 0.004, 0.015],
        "color": "#c8a098",
        "innerColor": "#6b3835",
    },
    {
        "id": "parietal",
        "name": "Parietal Lobe",
        "biology": "Spatial reasoning, mathematical thinking, logic, sensory integration",
        "skillTitle": "Technical Engineering",
        "skillDescription": "React, Three.js, WebGL, GSAP, Node.js — deep fluency across the modern web stack. Algorithms, data structures, and state management.",
        "position": [0.0, 0.038, 0.045],
        "popDirection": [0.0, 0.015, 0.0],
        "color": "#c8a098",
        "innerColor": "#6b3835",
    },
    {
        "id": "occipital",
        "name": "Occipital Lobe",
        "biology": "Visual processing, pattern recognition, depth perception",
        "skillTitle": "Design & Visual Craft",
        "skillDescription": "UI/UX design, CSS architecture, micro-animations, color theory, and layout composition. Pixel-perfect, emotionally resonant interfaces.",
        "position": [0.0, 0.015, 0.008],
        "popDirection": [0.0, 0.003, -0.015],
        "color": "#c8a098",
        "innerColor": "#6b3835",
    },
    {
        "id": "temporal",
        "name": "Temporal Lobe",
        "biology": "Memory, language processing, learning, auditory comprehension",
        "skillTitle": "Communication & Learning",
        "skillDescription": "Technical writing, cross-team collaboration, mentoring, and rapidly absorbing new technologies. Translating complex ideas into clear language.",
        "position": [0.028, -0.008, 0.045],
        "popDirection": [0.015, 0.0, 0.002],
        "color": "#c8a098",
        "innerColor": "#6b3835",
    },
    {
        "id": "cerebellum",
        "name": "Cerebellum",
        "biology": "Fine motor control, coordination, precision, timing",
        "skillTitle": "Attention to Detail",
        "skillDescription": "Code quality, systematic debugging, performance optimization, and pixel-perfect implementation. The last 5% that separates good from great.",
        "position": [0.0, -0.035, 0.012],
        "popDirection": [0.0, -0.01, -0.008],
        "color": "#c8a098",
        "innerColor": "#6b3835",
    },
]

# ── Data from frontend src/features/variantSwitcher/ui/VariantSelector.jsx ──
MATERIAL_VARIANTS = [
    {"name": "Classic Yellow", "base_color": "#ffcc00", "roughness": 0.5, "metalness": 0.0},
    {"name": "Crimson Red", "base_color": "#e63946", "roughness": 0.5, "metalness": 0.0},
]


async def seed():
    async with async_session() as session:
        # Check if already seeded
        existing = await session.execute(select(Product).limit(1))
        if existing.scalar_one_or_none():
            print("Database already seeded. Skipping.")
            return

        product_id = uuid.uuid4()
        scene_id = uuid.uuid4()

        product = Product(
            id=product_id,
            name="Stylized Brain",
            description="A 3D interactive portfolio brain model. Each region maps to a real skill.",
            category="portfolio",
        )
        session.add(product)

        scene = Scene(
            id=scene_id,
            product_id=product_id,
            gltf_url="/models/stylizedbrain/scene.gltf",
            texture_urls=[],
            camera_default_position=[0, 0, 4.5],
            regions=BRAIN_REGIONS,
            lod_tier=0,
        )
        session.add(scene)

        for variant in MATERIAL_VARIANTS:
            material = Material(
                id=uuid.uuid4(),
                scene_id=scene_id,
                name=variant["name"],
                base_color=variant["base_color"],
                roughness=variant["roughness"],
                metalness=variant["metalness"],
            )
            session.add(material)

        await session.commit()
        print(f"Seeded: product={product_id}, scene={scene_id}")
        print(f"  - {len(BRAIN_REGIONS)} brain regions")
        print(f"  - {len(MATERIAL_VARIANTS)} material variants")


if __name__ == "__main__":
    asyncio.run(seed())
