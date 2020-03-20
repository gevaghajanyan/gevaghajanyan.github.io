import React from 'react';
import classNames from 'classnames';

import styles from './responsibility.module.css';
import { myCv } from '../../../data';

export const Responsibility = () => (
  <section className={styles.content}>
    <ul className={classNames([styles.main, 'container'])}>
      {myCv.responsibility.map(({
        id,
        title,
      }) => (
        <li
          key={id}
          className={styles.item}
        >
          {title}
        </li>
      ))}
    </ul>
  </section>
);
