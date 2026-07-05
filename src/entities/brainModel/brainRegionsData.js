/**
 * Brain region configuration for the new stylized brain model.
 * All colors are REALISTIC FLESH — same pinkish-grey for every lobe.
 * Lobe distinction comes from the Voronoi fissure gaps, not color.
 *
 * Geometry coordinate space (from GLTF):
 *   X: -0.034 to 0.034
 *   Y: -0.049 to 0.049
 *   Z:  0.000 to 0.088
 */
export const BRAIN_REGIONS = [
  {
    id: 'prefrontal',
    name: 'Prefrontal Cortex',
    biology: 'Executive function, planning, decision-making, complex reasoning',
    skillTitle: 'System Architecture',
    skillDescription:
      'Designing scalable systems, planning codebases, making critical technical decisions, and breaking down complex problems into elegant solutions.',
    position: [0.0, 0.015, 0.072],
    popDirection: [0.0, 0.004, 0.015],
    color: '#c8a098',
    innerColor: '#6b3835',
  },
  {
    id: 'parietal',
    name: 'Parietal Lobe',
    biology: 'Spatial reasoning, mathematical thinking, logic, sensory integration',
    skillTitle: 'Technical Engineering',
    skillDescription:
      'React, Three.js, WebGL, GSAP, Node.js — deep fluency across the modern web stack. Algorithms, data structures, and state management.',
    position: [0.0, 0.038, 0.045],
    popDirection: [0.0, 0.015, 0.0],
    color: '#c8a098',
    innerColor: '#6b3835',
  },
  {
    id: 'occipital',
    name: 'Occipital Lobe',
    biology: 'Visual processing, pattern recognition, depth perception',
    skillTitle: 'Design & Visual Craft',
    skillDescription:
      'UI/UX design, CSS architecture, micro-animations, color theory, and layout composition. Pixel-perfect, emotionally resonant interfaces.',
    position: [0.0, 0.015, 0.008],
    popDirection: [0.0, 0.003, -0.015],
    color: '#c8a098',
    innerColor: '#6b3835',
  },
  {
    id: 'temporal',
    name: 'Temporal Lobe',
    biology: 'Memory, language processing, learning, auditory comprehension',
    skillTitle: 'Communication & Learning',
    skillDescription:
      'Technical writing, cross-team collaboration, mentoring, and rapidly absorbing new technologies. Translating complex ideas into clear language.',
    position: [0.028, -0.008, 0.045],
    popDirection: [0.015, 0.0, 0.002],
    color: '#c8a098',
    innerColor: '#6b3835',
  },
  {
    id: 'cerebellum',
    name: 'Cerebellum',
    biology: 'Fine motor control, coordination, precision, timing',
    skillTitle: 'Attention to Detail',
    skillDescription:
      'Code quality, systematic debugging, performance optimization, and pixel-perfect implementation. The last 5% that separates good from great.',
    position: [0.0, -0.035, 0.012],
    popDirection: [0.0, -0.01, -0.008],
    color: '#c8a098',
    innerColor: '#6b3835',
  },
];
