import React from 'react';
import classNames from 'classnames';

import { useUserService } from '../../hooks/useUserService';
import { imageService } from '../../service/ImageService';

import styles from './skills.module.css';

export const Skills = () => {
  const { skills } = useUserService();
  const { getImagePathByCode } = imageService;
  return (
    <section
      id='SKILLS'
      className={styles.content}
    >
      <header className={styles.header}>
        <h3>
          SKILLS
        </h3>
      </header>
      <section className={classNames(styles.main, 'container')}>
        {skills.map(({
          id,
          title,
          code,
        }) => (
          <div
            className={styles.skill}
            key={id}
          >
            <img
              className={styles.skillImage}
              src={getImagePathByCode(code)}
              alt={code}
            />
            {title}
          </div>
        ))}
      </section>
    </section>
  );
};
