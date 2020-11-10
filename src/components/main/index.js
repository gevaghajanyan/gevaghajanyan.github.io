import React from 'react';

import { ProfileSection } from '../profileSection';
import { imageService } from '../../service/ImageService';
import { useUserService } from '../../hooks/useUserService';

import styles from './main.module.css';

export const Main = () => {
  const {
    workExperience,
    education,
  } = useUserService();
  const { getImagePathByCode } = imageService;
  return (
    <section className={styles.content}>
      <ProfileSection
        id='WORK_EXPERIENCE'
        title='WORK EXPERIENCE'
        data={workExperience}
        icon={(
          <img
            src={getImagePathByCode('PORTFOLIO')}
            alt='portfolio'
          />
        )}
      />
      <ProfileSection
        id='EDUCATION'
        title='EDUCATION'
        data={education}
        icon={(
          <img
            src={getImagePathByCode('PORTFOLIO')}
            alt='portfolio'
          />
        )}
      />
    </section>
  );
};
