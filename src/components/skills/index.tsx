import React from 'react';
import { useUserService } from '../../hooks/useUserService';
import { TechIcon } from '../tech-icon';
import styles from './skills.module.css';

export const Skills: React.FC = () => {
  const { skills } = useUserService();

  return (
    <section id='SKILLS' className={styles.section}>
      <div className='container'>
        <div className={styles.label}>Skills</div>
        <div className={styles.grid}>
          {skills.map(({ id, title, code }) => (
            <div key={id} className={styles.card}>
              <TechIcon code={code} size={18} colored />
              <span className={styles.name}>{title}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
