import React from 'react';
import classNames from 'classnames';

import { myCv } from '../../../data';

import styles from './personalInfo.module.css';

export const PersonalInfo = () => (
  <section className={classNames([styles.content, 'container'])}>
    <figure className={styles.imageContent}></figure>
    <div className={styles.title}></div>
    <section className={styles.personalDetails}>
      {[
        'birthDay',
        'address',
        'email',
        'phone',
        'languages',
      ].map(key => (
        <div
          className={styles.info}
          key={key}
        >
          <div className={styles.desc}>
            {myCv.personal[key]}
          </div>
          <div className={styles.label}>
            {key}
          </div>
        </div>
      ))}
    </section>
  </section>
);
