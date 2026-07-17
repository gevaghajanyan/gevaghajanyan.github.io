import React from 'react';
import { TechIcon } from '../tech-icon';
import styles from './skill-circle.module.css';

interface SkillCircleProps {
  title?: string;
  code?: string;
}

export const SkillCircle: React.FC<SkillCircleProps> = ({
  title = '',
  code = '',
}) => (
  <div className={styles.card}>
    <TechIcon code={code} size={20} colored />
    <span className={styles.name}>{title}</span>
  </div>
);
