import React from 'react';
import styles from './footer.module.css';

interface Props { onGame(): void }

export const Footer: React.FC<Props> = ({ onGame }) => (
  <footer className={styles.footer}>
    <div className={styles.inner}>
      <span className={styles.copy}>
        © 2025 Gevorg Aghajanyan
        <button onClick={onGame} className={styles.egg} aria-label='Easter egg' title='🚀'>🚀</button>
      </span>
      <div className={styles.links}>
        <a href='https://github.com/gevaghajanyan' target='_blank' rel='noreferrer' className={styles.link}>GitHub</a>
        <a href='https://www.linkedin.com/in/gevorg-aghajanyan-31a809144/' target='_blank' rel='noreferrer' className={styles.link}>LinkedIn</a>
      </div>
    </div>
  </footer>
);
