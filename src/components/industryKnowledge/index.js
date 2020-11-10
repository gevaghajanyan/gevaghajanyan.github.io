import React from 'react';
import classNames from 'classnames';

import { imageService } from '../../service/ImageService';
import { useUserService } from '../../hooks/useUserService';

import styles from './industryKnowledge.module.css'


export const IndustryKnowledge = () => {
  const { industryKnowledge } = useUserService();
  const { getImagePathByCode } = imageService;

  return (
    <section
      id='INDUSTRY_KNOWLEDGE'
      className={styles.content}
    >
      <header className={styles.header}>
        <h3>
          INDUSTRY KNOWLEDGE
        </h3>
      </header>
      <div className={styles.main}>
        {industryKnowledge.map(({
          id,
          title
        }) => (
          <div
            key={id}
            className={styles.item}
          >
            <img
              className={classNames([styles.image, styles.rotate])}
              src={getImagePathByCode('BRACKET')}
              alt='bracket'
            />
            {title}
            <img
              className={styles.image}
              src={getImagePathByCode('BRACKET')}
              alt='bracket'
            />
          </div>
        ))}
      </div>
    </section>
  );
};
