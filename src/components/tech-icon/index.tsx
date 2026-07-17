import React from 'react';
import {
  SiJavascript, SiTypescript, SiReact, SiNextdotjs, SiExpo,
  SiRedux, SiReactivex, SiHtml5, SiCss, SiSass, SiLess,
  SiNodedotjs, SiMongodb, SiDocker, SiWebpack, SiGit, SiMobx,
  SiGithub, SiGithubactions, SiVite, SiGraphql,
  SiTailwindcss, SiPostcss, SiWebassembly, SiVercel,
  SiGoogletagmanager,
} from 'react-icons/si';
import { FaCode, FaMusic, FaGamepad, FaBicycle } from 'react-icons/fa';
import type { IconType } from 'react-icons';

const ICONS: Record<string, IconType> = {
  JAVASCRIPT:          SiJavascript,
  TYPESCRIPT:          SiTypescript,
  REACTJS:             SiReact,
  REACT_NATIVE:        SiReact,
  EXPO:                SiExpo,
  NEXT_JS:             SiNextdotjs,
  REDUX:               SiRedux,
  RX_JS:               SiReactivex,
  HTML5:               SiHtml5,
  CSS3:                SiCss,
  SASS:                SiSass,
  LESS:                SiLess,
  NODE_JS:             SiNodedotjs,
  MONGO_DB:            SiMongodb,
  DOCKER:              SiDocker,
  WEBPACK:             SiWebpack,
  VITE:                SiVite,
  VERSION_CONTROL_GIT: SiGit,
  GITHUB:              SiGithub,
  GITHUB_ACTIONS:      SiGithubactions,
  MOBX:                SiMobx,
  GRAPHQL:             SiGraphql,
  TAILWIND:            SiTailwindcss,
  POSTCSS:             SiPostcss,
  WASM:                SiWebassembly,
  VERCEL:              SiVercel,
  GTM:                 SiGoogletagmanager,
  CODING:              FaCode,
  MUSIC:               FaMusic,
  GAMING:              FaGamepad,
  BICYCLE_RIDING:      FaBicycle,
};

const COLORS: Record<string, string> = {
  JAVASCRIPT:          '#F7DF1E',
  TYPESCRIPT:          '#3178C6',
  REACTJS:             '#61DAFB',
  REACT_NATIVE:        '#61DAFB',
  EXPO:                '#000020',
  NEXT_JS:             '#000000',
  REDUX:               '#764ABC',
  RX_JS:               '#B7178C',
  HTML5:               '#E34F26',
  CSS3:                '#1572B6',
  SASS:                '#CC6699',
  LESS:                '#1D365D',
  NODE_JS:             '#339933',
  MONGO_DB:            '#47A248',
  DOCKER:              '#2496ED',
  WEBPACK:             '#8DD6F9',
  VITE:                '#646CFF',
  VERSION_CONTROL_GIT: '#F05032',
  GITHUB:              '#181717',
  GITHUB_ACTIONS:      '#2088FF',
  MOBX:                '#FF7A00',
  GRAPHQL:             '#E10098',
  TAILWIND:            '#06B6D4',
  POSTCSS:             '#DD3A0A',
  WASM:                '#654FF0',
  VERCEL:              '#000000',
  GTM:                 '#246FDB',
};

interface TechIconProps {
  code: string;
  size?: number;
  colored?: boolean;
}

export const TechIcon: React.FC<TechIconProps> = ({ code, size = 20, colored = true }) => {
  const Icon = ICONS[code];
  if (!Icon) return null;
  return <Icon size={size} color={colored ? (COLORS[code] ?? 'currentColor') : 'currentColor'} />;
};
