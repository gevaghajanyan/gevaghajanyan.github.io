import React from 'react';
import classNames from 'classnames';

import { myCv } from '../../../data';

import styles from './industryKnowledge.module.css'

export const IndustryKnowledge = () => (
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
      {myCv.industryKnowledge.map(({
        id,
        code,
        title
      }) => (
        <div
          key={id}
          className={styles.item}
        >
          <img
            className={classNames([styles.image, styles.rotate])}
            src='/assets/bracket.svg'
            alt='bracket'
          />
          {title}
          <img
            className={styles.image}
            src='/assets/bracket.svg'
            alt='bracket'
          />
        </div>
      ))}
    </div>
  </section>
);
