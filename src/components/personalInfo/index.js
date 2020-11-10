import React from 'react';
import classNames from 'classnames';

import { useUserService } from '../../hooks/useUserService';

import styles from './personalInfo.module.css';

export const PersonalInfo = () => {
  const {
    personalInfo: {
      fullName,
      jobTitle,
      ...personalInfo
    }
  } = useUserService();
  return (
    <section className={classNames([styles.content, 'container'])}>
      <figure className={styles.imageContent}>
        <img src="/assets/my.jpg" alt="my" className={styles.image} />
      </figure>
      <div className={styles.title}>
        <div className={styles.name}>
          {fullName}
        </div>
        <div className={styles.jobTitle}>
          {jobTitle}
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
              {personalInfo[key]}
            </div>
            <div className={styles.label}>
              {key}
            </div>
          </div>
        ))}
      </section>
    </section>
  );
};
