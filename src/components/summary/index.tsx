import React from 'react';
import styles from './summary.module.css';

export const Summary: React.FC = () => (
  <section className={styles.section}>
    <div className='container'>
      <p className={styles.text}>
        Senior Software Engineer with extensive experience in web and mobile engineering across the full software
        development lifecycle. Expert in the JavaScript and TypeScript ecosystems, with specialized depth in React,
        React Native, and Expo. Proven track record of architecting high-performance web applications using advanced
        browser APIs (WASM, Web Workers), designing Node.js microservice gateways, and engineering real-time 2D game
        mechanics. Strong technical foundation in data structures, design patterns, SOLID principles, and leadership.
      </p>
    </div>
  </section>
);
