import React from 'react';
import classNames from 'classnames';

import { getImagePathByCode } from './util';

import { myCv } from '../../../data';

import styles from './skills.module.css';

export const Skills = () => (
  <section className={styles.content}>
    <header className={styles.header}>
      <h3>
        SKILLS
      </h3>
    </header>
    <section className={classNames(styles.main, 'container')}>
      {myCv.skills.map(({
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
