// Each item is a simple video-style track. Scroll progress plays the keyframes.
// Use x/y as viewport percentages, width as viewport width, and opacity from 0 to 1.
export const sceneLayers = [
  {
    id: 'frog',
    src: '/images/scene/character-or-avatar 1.png',
    alt: 'Frog paper puppet',
    z: 4,
    keyframes: [
      { progress: 0, x: 31, y: 58, width: 15, opacity: 1 },
      { progress: 0.5, x: -69, y: 58, width: 15, opacity: 1 },
      { progress: 1, x: 31, y: 58, width: 15, opacity: 1 }
    ]
  },
  {
    id: 'cat',
    src: '/images/scene/decorative-item-1.png',
    alt: '',
    z: 3,
    keyframes: [
      { progress: 0, x: 140, y: 48, width: 18, opacity: 0 },
      { progress: 0.5, x: 64, y: 48, width: 18, opacity: 1 },
      { progress: 1, x: 140, y: 48, width: 18, opacity: 0 }
    ]
  },
  {
    id: 'grass-row',
    src: '/images/scene/decorative-item-2.png',
    alt: '',
    z: 5,
    keyframes: [
      { progress: 0, x: 50, y: 91, width: 138, opacity: 1 },
      { progress: 0.5, x: -50, y: 91, width: 138, opacity: 1 },
      { progress: 1, x: 50, y: 91, width: 138, opacity: 1 }
    ]
  },
  {
    id: 'cloud',
    src: '/images/scene/decorative-item-3.png',
    alt: '',
    z: 2,
    keyframes: [
      { progress: 0, x: 23, y: 17, width: 13, opacity: 1 },
      { progress: 0.5, x: -77, y: 17, width: 13, opacity: 1 },
      { progress: 1, x: 23, y: 17, width: 13, opacity: 1 }
    ]
  },
  {
    id: 'welcome-text',
    src: '/images/scene/textfloating-item-1.png',
    alt: 'Welcome to my portfolio',
    z: 6,
    keyframes: [
      { progress: 0, x: 43, y: 34, width: 24, opacity: 1 },
      { progress: 0.5, x: -57, y: 34, width: 24, opacity: 1 },
      { progress: 1, x: 43, y: 34, width: 24, opacity: 1 }
    ]
  },
  {
    id: 'intro-text',
    src: '/images/scene/textfloating-item-2.png',
    alt: 'Short personal introduction',
    z: 6,
    keyframes: [
      { progress: 0, x: 67, y: 43, width: 22, opacity: 1 },
      { progress: 0.5, x: -33, y: 43, width: 22, opacity: 1 },
      { progress: 1, x: 67, y: 43, width: 22, opacity: 1 }
    ]
  }
];

export const backgroundTrack = {
  keyframes: [
    { progress: 0, x: 0 },
    { progress: 0.5, x: -100 },
    { progress: 1, x: 0 }
  ]
};
