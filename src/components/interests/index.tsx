import React from 'react';
import { useUserService } from '../../hooks/useUserService';
import { TechIcon } from '../tech-icon';
import styles from './interests.module.css';

export const Interests: React.FC = () => {
  const { interest } = useUserService();

  return (
    <section className={styles.section}>
      <div className='container'>
        <div className={styles.label}>Interests</div>
        <div className={styles.grid}>
          {interest.map(({ id, code, title }) => (
            <div key={id} className={styles.item}>
              <TechIcon code={code} size={20} colored={false} />
              <span className={styles.name}>{title}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
