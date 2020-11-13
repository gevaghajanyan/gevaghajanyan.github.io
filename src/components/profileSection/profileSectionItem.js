import React from 'react';
import PropTypes from 'prop-types'

import { imageService } from '../../service/ImageService';
import { getDate } from '../../helpers/date';

import styles from './profileSection.module.css';

export const ProfileSectionItem = ({
  title,
  description,
  startDate,
  endDate,
  isPresent = false,
}) => {
  const { getImagePathByCode } = imageService;
  return (
    <div className={styles.item}>
      <div className={styles.itemDate}>
        <div className={styles.itemIcon}>
          <img
            className={styles.calendar}
            src={getImagePathByCode('CALENDAR')}
            alt='calendar'
          />
        </div>
        <div className={styles.itemDateDetails}>
          {`${getDate(startDate)} - ${!isPresent ? getDate(endDate) : 'Present'}`}
        </div>
      </div>
      <div className={styles.itemMain}>
        <div className={styles.itemTitle}>
          {title}
        </div>
        <div className={styles.itemDescription}>
          {description}
        </div>
      </div>
    </div>
  );
};

ProfileSectionItem.propTypes = {
  startDate: PropTypes.string,
  endDate: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  isPresent: PropTypes.bool,
};
