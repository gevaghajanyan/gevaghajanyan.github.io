const images = {
  TYPESCRIPT: '/assets/languages/typescript.svg',
  NEXT_JS: '/assets/languages/nextjs.svg',
  REDUX: '/assets/languages/redux.svg',
  VERSION_CONTROL_GIT: '/assets/languages/git.svg',
  HTML5: '/assets/languages/html5.svg',
  NODE_JS: '/assets/languages/nodejs.svg',
  MONGO_DB: '/assets/languages/mongodb.svg',
  CSS3: '/assets/languages/css3.svg',
  SASS: '/assets/languages/sass.svg',
  LESS: '/assets/languages/less.svg',
  DOCKER: '/assets/languages/docker.svg',
  WEBPACK: '/assets/languages/webpack.svg',
};

export const getImagePathByCode = (code) => images[code];
