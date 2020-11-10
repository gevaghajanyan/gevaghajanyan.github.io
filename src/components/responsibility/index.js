import React from 'react';
import classNames from 'classnames';

import { useUserService } from '../../hooks/useUserService';

import styles from './responsibility.module.css';

export const Responsibility = () => {
  const { responsibility } = useUserService();
  return (
    <section className={styles.content}>
      <ul className={classNames([styles.main, 'container'])}>
        {responsibility.map(({
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
};
