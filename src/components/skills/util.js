const images = {
  JAVASCRIPT: '/assets/languages/javascript.svg',
  REACTJS: '/assets/languages/react.svg',
  REACT_NATIVE: '/assets/languages/react.svg',
};

export const getImagePathByCode = (code) => images[code];
