import React from 'react';

import { Navigation } from '../navigation';

import styles from './header.module.css';
import { PersonalInfo } from '../personalInfo';

export const Header = () => (
  <header className={styles.header}>
    <Navigation />
    <PersonalInfo />
  </header>
);
