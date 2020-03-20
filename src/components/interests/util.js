const images = {
  CODING: '/assets/interests/coding.svg',
  MUSIC: '/assets/interests/audio.svg',
  GAMING: '/assets/interests/joystick.svg',
  BICYCLE_RIDING: '/assets/interests/bike.svg',
};

export const getImagePathByCode = (code) => images[code];
