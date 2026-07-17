import React from 'react';
import { ProfileSectionItem } from './profile-section-item';
import { WorkItem } from '../../types';
import styles from './profile-section.module.css';

interface ProfileSectionProps {
  id: string;
  label: string;
  data?: WorkItem[];
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({
  id,
  label,
  data = [],
}) => (
  <section id={id} className={styles.section}>
    <div className='container'>
      <div className={styles.label}>{label}</div>
      <div className={styles.list}>
        {data.map(item => <ProfileSectionItem key={item.id} {...item} />)}
      </div>
    </div>
  </section>
);
