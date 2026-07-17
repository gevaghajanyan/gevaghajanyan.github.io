import React, { useState } from 'react';
import { useUserService } from '../../hooks/useUserService';
import styles from './personal-info.module.css';

const CopyButton: React.FC<{ value: string }> = ({ value }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button className={styles.copyBtn} onClick={handleCopy} aria-label='Copy'>
      {copied ? (
        <svg width='13' height='13' viewBox='0 0 13 13' fill='none'>
          <path d='M2 6.5L5.5 10L11 3' stroke='currentColor' strokeWidth='1.6' strokeLinecap='round' strokeLinejoin='round' />
        </svg>
      ) : (
        <svg width='13' height='13' viewBox='0 0 13 13' fill='none'>
          <rect x='4.5' y='0.5' width='8' height='8' rx='1.2' stroke='currentColor' strokeWidth='1.2' />
          <path d='M1 4H0.5A0.5 0.5 0 0 0 0 4.5V12.5A0.5 0.5 0 0 0 0.5 13H8.5A0.5 0.5 0 0 0 9 12.5V12' stroke='currentColor' strokeWidth='1.2' strokeLinecap='round' />
        </svg>
      )}
    </button>
  );
};

export const PersonalInfo: React.FC = () => {
  const { personalInfo } = useUserService();
  const { fullName, jobTitle, address, email, phone } = personalInfo;

  return (
    <div className={styles.hero}>
      <img src='/assets/my.jpg' alt={fullName} className={styles.photo} />
      <div className={styles.info}>
        <h1 className={styles.name}>{fullName}</h1>
        <p className={styles.role}>{jobTitle}</p>
        <div className={styles.contactGrid}>
          <span className={styles.contactKey}>Location</span>
          <span className={styles.contactVal}>{address}</span>

          <span className={styles.contactKey}>Email</span>
          <span className={styles.contactVal}>
            <a href={`mailto:${email}`} className={styles.contactLink}>{email}</a>
            <CopyButton value={email} />
          </span>

          <span className={styles.contactKey}>Phone</span>
          <span className={styles.contactVal}>
            <a href={`tel:${phone}`} className={styles.contactLink}>{phone}</a>
            <CopyButton value={phone} />
          </span>
        </div>
      </div>
    </div>
  );
};
