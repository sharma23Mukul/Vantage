[![CI](https://github.com/sharma23Mukul/Vantage/actions/workflows/ci.yml/badge.svg)](https://github.com/sharma23Mukul/Vantage/actions/workflows/ci.yml)

# Dimension

<!-- TODO: add live demo link once deployed -->
<!-- **[Live Demo →](https://your-domain.com)** -->

An interactive 3D portfolio that maps developer skills onto a realistic brain model — click on brain regions to explore competencies like system architecture, visual craft, and technical engineering. Built as a single-page React app with real-time WebGL rendering, scroll-driven camera animation, and a terracotta-and-sand poster aesthetic that breaks from the typical dark-mode developer portfolio.

<!-- TODO: add demo GIF or screenshot at docs/demo.gif — capture the brain model with a hotspot tooltip open -->

## Stack

| Layer | Technologies |
|-------|-------------|
| **Build** | Vite |
| **UI** | React 19, Tailwind CSS |
| **3D** | Three.js, React Three Fiber, Drei |
| **Animation** | GSAP + ScrollTrigger |
| **State** | Zustand |
| **Testing** | Vitest, React Testing Library |
| **CI** | GitHub Actions |

> **Animation note:** GSAP + ScrollTrigger drives all scroll-linked camera movement and page-level timeline sequences. Framer Motion is listed as a dependency but is not currently imported in the source — all motion is handled by GSAP and CSS keyframes.

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
| `npm run test` | Run Vitest test suite |
| `npm run preview` | Preview production build |
