import React from 'react';
import classNames from 'classnames';

import { myCv } from '../../../data';

import styles from './personalInfo.module.css';

export const PersonalInfo = () => (
  <section className={classNames([styles.content, 'container'])}>
    <figure className={styles.imageContent}>
      <img src="/assets/my.jpg" alt="my" className={styles.image} />
    </figure>
    <div className={styles.title}>
      <div className={styles.name}>
        {myCv.personal.fullName}
      </div>
      <div className={styles.jobTitle}>
        {myCv.personal.jobTitle}
      </div>
    </div>
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
