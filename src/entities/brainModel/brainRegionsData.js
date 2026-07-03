/**
 * Brain region configuration — ultra-realistic anatomical palette.
 * Real brain tissue is pinkish-grey with visible blood vessels.
 * The differences between lobes are VERY subtle in reality.
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
    color: '#c8a098',       // warm pinkish cortex
    innerColor: '#8a4842',  // deep red-brown interior
    attenuationColor: '#d04040', // blood-red subsurface
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
    color: '#c09898',       // slightly cooler pink-grey
    innerColor: '#7a3e40',  // deep red-brown interior
    attenuationColor: '#c83838',
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
    color: '#b89490',       // deeper pink-grey
    innerColor: '#6e3835',  // deep red-brown interior
    attenuationColor: '#b83030',
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
    color: '#c4a090',       // warm beige-pink
    innerColor: '#7e4238',  // deep red-brown interior
    attenuationColor: '#c04038',
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
    color: '#b09088',       // slightly darker warm grey-pink
    innerColor: '#6a3830',  // deep red-brown interior
    attenuationColor: '#a83028',
  },
];
