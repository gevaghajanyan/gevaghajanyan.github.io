import React from 'react';

import { SkillCircle } from '../skillCircle';
import { imageService } from '../../service/ImageService';
import { useUserService } from '../../hooks/useUserService';

import styles from './toolsAndTechnologies.module.css';

export const ToolsAndTechnologies = () => {
  const { toolsAndTechnologies } = useUserService();
  const { getImagePathByCode } = imageService;

  return (
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
          {toolsAndTechnologies.map(({
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
};
