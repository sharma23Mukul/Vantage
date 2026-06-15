# Dimension

Interactive 3D product showcase platform built with React, Three.js, and GSAP.

## Stack

- **Build:** Vite
- **UI:** React 18, Tailwind CSS, Framer Motion
- **3D:** Three.js, React Three Fiber, Drei
- **Animation:** GSAP + ScrollTrigger
- **State:** Zustand

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
