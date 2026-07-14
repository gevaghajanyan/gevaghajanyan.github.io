import React from 'react';
import { Navigation } from '../navigation';
import { PersonalInfo } from '../personalInfo';

export const Header: React.FC = () => (
  <>
    <Navigation />
    <PersonalInfo />
  </>
);
