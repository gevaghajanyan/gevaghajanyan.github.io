import React from 'react';
import { ProfileSection } from '../profileSection';
import { useUserService } from '../../hooks/useUserService';

export const Main: React.FC = () => {
  const { workExperience, education } = useUserService();

  return (
    <>
      <ProfileSection id='WORK_EXPERIENCE' label='Work Experience' data={workExperience} />
      <ProfileSection id='EDUCATION' label='Education' data={education} />
    </>
  );
};
