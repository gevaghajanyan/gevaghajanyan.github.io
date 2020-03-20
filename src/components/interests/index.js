import React from 'react';
import classNames from 'classnames';

import { myCv } from '../../../data';

import styles from './interests.module.css';
import { getImagePathByCode } from './util';

export const Interests = ({}) => (
  <section className={styles.content}>
    <div className={classNames([styles.parent, 'container'])}>
      <header className={styles.header}>
        <h3 className={styles.title}>
          INTERESTS
        </h3>
      </header>
      <div className={styles.main}>
        {myCv.interest.map(({
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
