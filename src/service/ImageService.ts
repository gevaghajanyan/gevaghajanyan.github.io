type ImageCode =
  | 'TYPESCRIPT' | 'NEXT_JS' | 'REDUX' | 'VERSION_CONTROL_GIT'
  | 'HTML5' | 'NODE_JS' | 'MONGO_DB' | 'CSS3' | 'SASS' | 'LESS'
  | 'DOCKER' | 'WEBPACK' | 'RX_JS' | 'JAVASCRIPT' | 'REACTJS'
  | 'REACT_NATIVE' | 'CODING' | 'MUSIC' | 'GAMING' | 'BICYCLE_RIDING'
  | 'BRACKET' | 'PORTFOLIO' | 'CALENDAR' | 'MOBX';

class ImageService {
  private images: Record<ImageCode, string> = {
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
    RX_JS: '/assets/languages/rxjs.svg',
    JAVASCRIPT: '/assets/languages/javascript.svg',
    REACTJS: '/assets/languages/react.svg',
    REACT_NATIVE: '/assets/languages/react.svg',
    CODING: '/assets/interests/coding.svg',
    MUSIC: '/assets/interests/audio.svg',
    GAMING: '/assets/interests/joystick.svg',
    BICYCLE_RIDING: '/assets/interests/bike.svg',
    BRACKET: '/assets/bracket.svg',
    PORTFOLIO: '/assets/portfolio.svg',
    CALENDAR: '/assets/calendar.svg',
    MOBX: '/assets/languages/mobx.svg',
  };

  getImagePathByCode = (code: string): string =>
    this.images[code as ImageCode] ?? '';
}

export const imageService = new ImageService();
