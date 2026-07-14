import React from 'react';
import { useUserService } from '../../hooks/useUserService';
import styles from './responsibility.module.css';

export const Responsibility: React.FC = () => {
  const { responsibility } = useUserService();

  return (
    <section className={styles.section}>
      <div className='container'>
        <div className={styles.label}>Core Expertise</div>
        <div className={styles.list}>
          {responsibility.map(({ id, title }) => (
            <div key={id} className={styles.item}>{title}</div>
          ))}
        </div>
      </div>
    </section>
  );
};
