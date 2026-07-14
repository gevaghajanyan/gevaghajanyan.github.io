import React from 'react';
import { getDate } from '../../helpers/date';
import styles from './profileSection.module.css';

interface ProfileSectionItemProps {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  isPresent?: boolean;
  details?: string[];
}

export const ProfileSectionItem: React.FC<ProfileSectionItemProps> = ({
  title,
  description,
  startDate,
  endDate,
  isPresent = false,
  details,
}) => (
  <div className={styles.item}>
    <div className={styles.dateCol}>
      <div className={styles.dateRange}>
        {getDate(startDate)} — {isPresent ? '' : getDate(endDate)}
      </div>
      {isPresent && <span className={styles.badge}>Present</span>}
    </div>
    <div className={styles.bodyCol}>
      <p className={styles.company}>{title}</p>
      <p className={styles.role}>{description}</p>
      {details && details.length > 0 && (
        <ul className={styles.details}>
          {details.map((d, i) => <li key={i}>{d}</li>)}
        </ul>
      )}
    </div>
  </div>
);
