import React from 'react';
import { useUserService } from '../../hooks/useUserService';
import styles from './personalInfo.module.css';

export const PersonalInfo: React.FC = () => {
  const { personalInfo } = useUserService();
  const { fullName, jobTitle, address, email, phone } = personalInfo;

  const contacts = [
    { label: 'Location', value: address },
    { label: 'Email',    value: email   },
    { label: 'Phone',    value: phone   },
  ];

  return (
    <div className={styles.hero}>
      <img src='/assets/my.jpg' alt={fullName} className={styles.photo} />
      <div className={styles.info}>
        {/*<div className={styles.badge}>*/}
        {/*  <span className={styles.dot} />*/}
        {/*  Available for opportunities*/}
        {/*</div>*/}
        <h1 className={styles.name}>{fullName}</h1>
        <p className={styles.role}>{jobTitle}</p>
        <div className={styles.contactGrid}>
          {contacts.map(({ label, value }) => (
            <React.Fragment key={label}>
              <span className={styles.contactKey}>{label}</span>
              <span className={styles.contactVal}>{value}</span>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};
