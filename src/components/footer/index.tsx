import React from 'react';
import styles from './footer.module.css';

export const Footer: React.FC = () => (
  <footer className={styles.footer}>
    <div className={styles.inner}>
      <span className={styles.copy}>© 2025 Gevorg Aghajanyan</span>
      <div className={styles.links}>
        <a
          href='https://github.com/gevaghajanyan'
          target='_blank'
          rel='noreferrer'
          className={styles.link}
        >
          GitHub
        </a>
        <a
          href='https://www.linkedin.com/in/gevorg-aghajanyan-31a809144/'
          target='_blank'
          rel='noreferrer'
          className={styles.link}
        >
          LinkedIn
        </a>
      </div>
    </div>
  </footer>
);
