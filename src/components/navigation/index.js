import React from 'react';

import styles from './navigation.module.css';

export const Navigation = () => (
  <nav className={styles.navigation}>
    {['EDUCATION', 'INTERSHIP', 'WORK EXPERIENCE', 'INTERESTES'].map(menuItem => (
      <a
        className={styles.menuItem}
        key={menuItem}
        href="#"
      >
        {menuItem}
      </a>
    ))}
    <div className={styles.cv}>
      CV
    </div>
  </nav>
);
