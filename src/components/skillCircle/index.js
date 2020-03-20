import React from 'react';

import styles from './skillCircle.module.css';

export const SkillCircle = ({
  title = 'Skill',
  description,
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
    <defs>
      <clipPath id="clipPath">
        <circle
          className={styles.externalCircle}
          r='75'
          cx='85'
          cy='85'
        />
      </clipPath>
    </defs>
    <g
      className={styles.g}
      height='100'
      width='100'
      clipPath='url(#clipPath)'
    >
      <image
        className={styles.image}
        href={imagePath}
        height='100'
        width='100'
        x='35'
        y='35'
      />
      <text
        className={styles.percent}
        x='85'
        y='88'
        fill='red'
        height='100'
        width='100'
        textAnchor='middle'
        dominantBaseline="middle"
      >
        {description}
      </text>
    </g>
  </svg>
);
