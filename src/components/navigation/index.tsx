import React from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useDarkMode } from '../../hooks/useDarkMode';
import styles from './navigation.module.css';

const NAV = [
  { label: 'Work',     id: 'WORK_EXPERIENCE'      },
  { label: 'Education',id: 'EDUCATION'             },
  { label: 'Skills',   id: 'TOOLS_AND_TECHNOLOGIES'},
  { label: 'Industry', id: 'INDUSTRY_KNOWLEDGE'    },
];

export const Navigation: React.FC = () => {
  const { dark, toggle } = useDarkMode();

  return (
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
        <div className={styles.actions}>
          <button onClick={toggle} className={styles.themeBtn} aria-label='Toggle theme'>
            {dark ? <FiSun size={15} /> : <FiMoon size={15} />}
          </button>
          <a href='/gevorg.aghajanyan.cv.pdf' target='_blank' className={styles.cvBtn}>
            Download CV
          </a>
        </div>
      </div>
    </nav>
  );
};
