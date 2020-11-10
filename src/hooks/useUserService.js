import { useEffect, useState } from 'react';

import { userService } from '../service/UserService';

export const useUserService = () => {
  const [userInfo, setUserInfo] = useState(userService.userInfo.getValue());

  useEffect(() => {
    userService.userInfo.subscribe(setUserInfo);
  }, []);

  return {
    get loading() {
      return userInfo.loading
    },
    get personalInfo() {
      return userInfo?.data?.personalInfo;
    },

    get workExperience() {
      return userInfo?.data?.workExperience;
    },

    get education() {
      return userInfo?.data?.education;
    },

    get skills() {
      return userInfo?.data?.skills;
    },

    get industryKnowledge() {
      return userInfo?.data?.industryKnowledge;
    },

    get toolsAndTechnologies() {
      return userInfo?.data?.toolsAndTechnologies;
    },

    get interest() {
      return userInfo?.data?.interest;
    },

    get responsibility() {
      return userInfo?.data?.responsibility;
    },
  }
};
