import React from 'react';

import { ProfileSection } from '../profileSection';

import { myCv } from '../../../data';

import styles from './main.module.css';

export const Main = () => (
  <section className={styles.content}>
    <ProfileSection
      title='WORK EXPERIENCE'
      data={myCv.workExperience}
      icon={(
        <img
          src='/assets/portfolio.svg'
          alt='portfolio'
        />
      )}
    />
    <ProfileSection
      title='EDUCATION'
      data={myCv.education}
      icon={(
        <img
          src='/assets/mortarboard.svg'
          alt='portfolio'
        />
      )}
    />
  </section>
);
