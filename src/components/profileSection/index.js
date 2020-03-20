import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { ProfileSectionItem } from './profileSectionItem';

import styles from './profileSection.module.css';

export const ProfileSection = ({
  title,
  icon = null,
  data = [],
  id,
}) => (
  <article id={id} className={classNames([styles.content, 'container'])}>
    <header className={styles.header}>
      <div className={styles.icon}>
        {icon}
      </div>
      <div className={styles.title}>
        {title}
      </div>
    </header>
    <section className={styles.main}>
      <div className={styles.sectionLine} />
      <div className={styles.paper}>
        {data.map(elem => (
          <ProfileSectionItem
            key={elem.id}
            {...elem}
          />
        ))}
      </div>
    </section>
  </article>
);

ProfileSection.propTypes = {
  title: PropTypes.string,
};
