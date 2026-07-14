import React from 'react';
import styles from './navigation.module.css';

const NAV = [
  { label: 'Work',     id: 'WORK_EXPERIENCE'      },
  { label: 'Education',id: 'EDUCATION'             },
  { label: 'Skills',   id: 'TOOLS_AND_TECHNOLOGIES'},
  { label: 'Industry', id: 'INDUSTRY_KNOWLEDGE'    },
];

export const Navigation: React.FC = () => (
  <nav className={styles.nav}>
    <div className={styles.inner}>
      <a href='#' className={styles.logo}>
        <img src='/assets/logo-400.png' alt='GA' className={styles.logoImg} />
      </a>
      <div className={styles.links}>
        {NAV.map(({ label, id }) => (
          <a key={id} href={`#${id}`} className={styles.link}>{label}</a>
        ))}
      </div>
      <a href='/gevorg.aghajanyan.cv.pdf' target='_blank' className={styles.cvBtn}>
        Download CV
      </a>
    </div>
  </nav>
);
