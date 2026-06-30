/**
 * Brain region configuration.
 * The Voronoi shader automatically assigns every point on the brain
 * to the nearest region center — no gaps, no overlap.
 */
export const BRAIN_REGIONS = [
  {
    id: 'prefrontal',
    name: 'Prefrontal Cortex',
    biology: 'Executive function, planning, decision-making, complex reasoning',
    skillTitle: 'System Architecture',
    skillDescription:
      'Designing scalable systems, planning codebases, making critical technical decisions, and breaking down complex problems into elegant solutions.',
    position: [0, 65, 55],
    popDirection: [0, 15, 45],
    color: '#00e5ff',
  },
  {
    id: 'parietal',
    name: 'Parietal Lobe',
    biology: 'Spatial reasoning, mathematical thinking, logic, sensory integration',
    skillTitle: 'Technical Engineering',
    skillDescription:
      'React, Three.js, WebGL, GSAP, Node.js — deep fluency across the modern web stack. Algorithms, data structures, and state management.',
    position: [0, 90, -15],
    popDirection: [0, 45, 0],
    color: '#448aff',
  },
  {
    id: 'occipital',
    name: 'Occipital Lobe',
    biology: 'Visual processing, pattern recognition, depth perception',
    skillTitle: 'Design & Visual Craft',
    skillDescription:
      'UI/UX design, CSS architecture, micro-animations, color theory, and layout composition. Pixel-perfect, emotionally resonant interfaces.',
    position: [0, 55, -70],
    popDirection: [0, 10, -45],
    color: '#ff4081',
  },
  {
    id: 'temporal',
    name: 'Temporal Lobe',
    biology: 'Memory, language processing, learning, auditory comprehension',
    skillTitle: 'Communication & Learning',
    skillDescription:
      'Technical writing, cross-team collaboration, mentoring, and rapidly absorbing new technologies. Translating complex ideas into clear language.',
    position: [65, 25, 10],
    popDirection: [45, 0, 8],
    color: '#00e676',
  },
  {
    id: 'cerebellum',
    name: 'Cerebellum',
    biology: 'Fine motor control, coordination, precision, timing',
    skillTitle: 'Attention to Detail',
    skillDescription:
      'Code quality, systematic debugging, performance optimization, and pixel-perfect implementation. The last 5% that separates good from great.',
    position: [0, -5, -55],
    popDirection: [0, -30, -30],
    color: '#ffab00',
  },
];
