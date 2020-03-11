import React from 'react';

import styles from './skillCircle.module.css';

export const SkillCircle = ({
  title = 'Skill',
  imagePath,
}) => (
  <svg className={styles.svg}>
    <linearGradient
      id='linearColors'
      x1='0'
      y1='0'
      x2='1'
      y2='1'
    >
      <stop offset='0%' stopColor='#569DA1' />
      <stop offset='100%' stopColor='#44374A' />
    </linearGradient>
    <circle
      className={styles.externalCircle}
      r='75'
      cx='85'
      cy='85'
      strokeWidth='10'
      fill='none'
      stroke='url(#linearColors)'
    >
      <animateTransform
        attributeName='transform'
        type='rotate'
        from='0'
        to='360'
        begin='0s'
        dur='3s'
        cx='85'
        cy='85'
        repeatCount='indefinite'
      />
    </circle>
    <text
      className={styles.text}
      x='85'
      y='200'
      textAnchor='middle'
    >
      {title}
    </text>
    <image
      href={imagePath}
      height='100'
      width='100'
      x='35'
      y='35'
    />
  </svg>
);
