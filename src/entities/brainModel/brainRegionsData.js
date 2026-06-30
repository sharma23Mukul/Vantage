/**
 * Brain region configuration — maps real neuroscience to personal skills.
 * Each region defines its geometry, position, pop-out direction, color, and content.
 */
export const BRAIN_REGIONS = [
  {
    id: 'prefrontal',
    name: 'Prefrontal Cortex',
    biology: 'Executive function, planning, decision-making, complex reasoning',
    skillTitle: 'System Architecture & Problem Solving',
    skillDescription:
      'Designing scalable systems with Feature-Sliced Design, planning codebases, making critical technical decisions, and breaking down complex problems into elegant solutions.',
    // Geometry config
    position: [0, 0.15, 0.55],
    scale: [0.72, 0.68, 0.52],
    // Direction the lobe slides out when active
    popDirection: [0, 0.1, 0.6],
    color: '#b8a9e8', // lavender — logic/planning
    sectionId: 'section-prefrontal',
  },
  {
    id: 'parietal',
    name: 'Parietal Lobe',
    biology: 'Spatial reasoning, mathematical thinking, logic, sensory integration',
    skillTitle: 'Technical Engineering',
    skillDescription:
      'React, Three.js, WebGL, GSAP, Node.js — deep fluency across the modern web stack. Algorithms, data structures, and state management designed for performance.',
    position: [0, 0.55, -0.1],
    scale: [0.62, 0.42, 0.62],
    popDirection: [0, 0.6, 0],
    color: '#7eb8da', // blue — technical/spatial
    sectionId: 'section-parietal',
  },
  {
    id: 'occipital',
    name: 'Occipital Lobe',
    biology: 'Visual processing, pattern recognition, depth perception',
    skillTitle: 'Design & Visual Craft',
    skillDescription:
      'UI/UX design, CSS architecture, micro-animations, color theory, and layout composition. Turning wireframes into pixel-perfect, emotionally resonant interfaces.',
    position: [0, 0.1, -0.65],
    scale: [0.48, 0.48, 0.38],
    popDirection: [0, 0, -0.6],
    color: '#e8a0b4', // pink/coral — visual/creative
    sectionId: 'section-occipital',
  },
  {
    id: 'temporal',
    name: 'Temporal Lobe',
    biology: 'Memory, language processing, learning, auditory comprehension',
    skillTitle: 'Communication & Learning',
    skillDescription:
      'Technical writing, cross-team collaboration, mentoring junior developers, and rapidly absorbing new technologies. Translating complex ideas into clear language.',
    position: [-0.58, -0.12, 0.08],
    scale: [0.34, 0.42, 0.56],
    // Second mesh for the right side
    mirrorPosition: [0.58, -0.12, 0.08],
    mirrorScale: [0.34, 0.42, 0.56],
    popDirection: [-0.6, 0, 0],
    mirrorPopDirection: [0.6, 0, 0],
    color: '#7ecab4', // teal — language/memory
    sectionId: 'section-temporal',
  },
  {
    id: 'cerebellum',
    name: 'Cerebellum',
    biology: 'Fine motor control, coordination, precision, timing',
    skillTitle: 'Attention to Detail',
    skillDescription:
      'Code quality, systematic debugging, performance optimization, accessibility audits, and pixel-perfect implementation. The last 5% that separates good from great.',
    position: [0, -0.48, -0.48],
    scale: [0.46, 0.3, 0.34],
    popDirection: [0, -0.5, -0.4],
    color: '#dbb978', // amber/gold — precision
    sectionId: 'section-cerebellum',
  },
];
