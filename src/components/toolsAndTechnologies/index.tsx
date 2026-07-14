import React from 'react';
import { SkillCircle } from '../skillCircle';
import { useUserService } from '../../hooks/useUserService';
import styles from './toolsAndTechnologies.module.css';

export const ToolsAndTechnologies: React.FC = () => {
  const { toolsAndTechnologies } = useUserService();

  return (
    <section id='TOOLS_AND_TECHNOLOGIES' className={styles.section}>
      <div className='container'>
        <div className={styles.label}>Skills</div>
        <div className={styles.grid}>
          {toolsAndTechnologies.map(({ id, code, title }) => (
            <SkillCircle key={id} code={code} title={title} />
          ))}
          <div className={styles.filler}>
            <span className={styles.fillerNum}>8+</span>
            <span className={styles.fillerLabel}>years of experience</span>
          </div>
        </div>
      </div>
    </section>
  );
};
