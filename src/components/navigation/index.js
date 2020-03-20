import React from 'react';

import styles from './navigation.module.css';

export const Navigation = () => (
  <nav className={styles.navigation}>
    {[
      'WORK EXPERIENCE',
      'EDUCATION',
      'SKILLS',
      'TOOLS AND TECHNOLOGIES',
      'INDUSTRY KNOWLEDGE',
    ].map(menuItem => (
      <a
        className={styles.menuItem}
        key={menuItem}
        href={`#${menuItem.replace(/\s/g, '_')}`}
      >
        {menuItem}
      </a>
    ))}
    <a
      href='#'
      className={styles.cv}
    >
      CV
    </a>
  </nav>
);
