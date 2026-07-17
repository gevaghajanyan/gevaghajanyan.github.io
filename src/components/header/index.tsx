import React from 'react';
import { Navigation } from '../navigation';
import { PersonalInfo } from '../personal-info';

export const Header: React.FC = () => (
  <>
    <Navigation />
    <PersonalInfo />
  </>
);
