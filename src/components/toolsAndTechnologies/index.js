import React from 'react';

import { SkillCircle } from '../skillCircle';
import { myCv } from '../../../data';

import styles from './toolsAndTechnologies.module.css';
import { getImagePathByCode } from './util';

export const ToolsAndTechnologies = () => (
  <section
    id='TOOLS_AND_TECHNOLOGIES'
    className={styles.content}
  >
    <div className='container'>
      <header className={styles.header}>
        <h3>
          TOOLS AND TECHNOLOGIES
        </h3>
      </header>
      <div className={styles.main}>
        {myCv.toolsAndTechnologies.map(({
          id,
          code,
          title,
          description,
        }) => (
          <SkillCircle
            title={title}
            key={id}
            description={description}
            imagePath={getImagePathByCode(code)}
          />
        ))}
      </div>
    </div>
  </section>
);
