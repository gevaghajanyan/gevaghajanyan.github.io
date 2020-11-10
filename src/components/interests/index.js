import React from 'react';
import classNames from 'classnames';

import { imageService } from '../../service/ImageService';
import { useUserService } from '../../hooks/useUserService';

import styles from './interests.module.css';

export const Interests = ({}) => {
  const { interest } = useUserService();
  const { getImagePathByCode } = imageService;

  return (
    <section className={styles.content}>
      <div className={classNames([styles.parent, 'container'])}>
        <header className={styles.header}>
          <h3 className={styles.title}>
            INTERESTS
          </h3>
        </header>
        <div className={styles.main}>
          {interest.map(({
            id,
            code,
            title,
          }) => (
            <div
              key={id}
              className={styles.interest}
            >
              <img
                className={styles.image}
                src={getImagePathByCode(code)}
                alt={code}
              />
              {title}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
