import React, { useEffect } from 'react';
import type { AppProps } from 'next/app';

import '../styles/colorScheme.css';
import '../styles/main.css';

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('s-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.07, rootMargin: '0px 0px -40px 0px' }
    );

    const sections = document.querySelectorAll('section');
    sections.forEach(s => {
      s.classList.add('s-reveal');
      observer.observe(s);
    });

    return () => observer.disconnect();
  }, []);

  return <Component {...pageProps} />;
}
