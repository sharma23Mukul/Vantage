# Dimension

Interactive 3D product showcase platform built with React, Three.js, and GSAP.

## Stack

- **Build:** Vite
- **UI:** React 18, Tailwind CSS, Framer Motion
- **3D:** Three.js, React Three Fiber, Drei
- **Animation:** GSAP + ScrollTrigger
- **State:** Zustand

## Features

- **Interactive 3D Rendering:** High-fidelity GLTF model loading via React Three Fiber.
- **Mouse Responsive Parallax:** The 3D model subtly tracks user cursor movements for an immersive feel.
- **Scrollytelling:** Deep integration with GSAP ScrollTrigger to tie camera movements to user scroll velocity.
- **Spatial UI Hotspots:** 2D interactive tooltips perfectly mapped to 3D mesh coordinates.
- **Dynamic Material Switcher:** Real-time Zustand-powered state management to instantly change 3D materials.
- **Video Texture Projection:** Stream and project video directly onto the surface of 3D objects.
- **Feature-Sliced Design:** Architected using FSD principles for massive scalability and maintainability.

## Getting Started

```bash
npm install
npm run dev
```

## Architecture

Feature-Sliced Design (FSD):

```
src/
├── app/          # App shell, providers, global styles
├── pages/        # Route entry points
├── widgets/      # Composed UI blocks
├── features/     # Isolated feature slices
├── entities/     # Domain objects
└── shared/       # Reusable utilities, hooks, components
```

### Rules

- Features can't import from other features
- Widgets compose features — no raw logic
- Pages only mount widgets
- Shared code has zero business logic

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview production build |
