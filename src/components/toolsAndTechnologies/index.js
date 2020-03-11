import React from 'react';

import { SkillCircle } from '../skillCircle';
import { myCv } from '../../../data';

import styles from './toolsAndTechnologies.module.css';
import { getImagePathByCode } from './util';

export const ToolsAndTechnologies = () => (
  <section className={styles.content}>
    <header className={styles.header}>
      <h3>
        TOOLS AND TECHNOLOGIES
      </h3>
    </header>
    <div className={styles.main}>
      {myCv.toolsAndTechnologies.map(({
        title,
        id,
        code,
      }) => (
        <SkillCircle
          title={title}
          key={id}
          imagePath={getImagePathByCode(code)}
        />
      ))}
    </div>
  </section>
);
