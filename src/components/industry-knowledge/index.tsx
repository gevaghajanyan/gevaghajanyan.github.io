import React from 'react';
import { useUserService } from '../../hooks/useUserService';
import styles from './industry-knowledge.module.css';

export const IndustryKnowledge: React.FC = () => {
  const { industryKnowledge } = useUserService();

  return (
    <section id='INDUSTRY_KNOWLEDGE' className={styles.section}>
      <div className='container'>
        <div className={styles.label}>Industry Knowledge</div>
        <div className={styles.grid}>
          {industryKnowledge.map(({ id, title }, i) => (
            <div key={id} className={styles.item}>
              <span className={styles.num}>{String(i + 1).padStart(2, '0')}</span>
              <span className={styles.title}>{title}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
