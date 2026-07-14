import { useEffect, useState } from 'react';
import { userService } from '../service/UserService';
import { UserState, PersonalInfo, WorkItem, Skill, IndustryKnowledge, Tool, Interest, Responsibility } from '../types';

export const useUserService = () => {
  const [userInfo, setUserInfo] = useState<UserState>(userService.userInfo.getValue());

  useEffect(() => {
    const sub = userService.userInfo.subscribe(setUserInfo);
    return () => sub.unsubscribe();
  }, []);

  return {
    get loading(): boolean {
      return userInfo.loading;
    },
    get personalInfo(): PersonalInfo {
      return userInfo.data!.personalInfo;
    },
    get workExperience(): WorkItem[] {
      return userInfo.data?.workExperience ?? [];
    },
    get education(): WorkItem[] {
      return userInfo.data?.education ?? [];
    },
    get skills(): Skill[] {
      return userInfo.data?.skills ?? [];
    },
    get industryKnowledge(): IndustryKnowledge[] {
      return userInfo.data?.industryKnowledge ?? [];
    },
    get toolsAndTechnologies(): Tool[] {
      return userInfo.data?.toolsAndTechnologies ?? [];
    },
    get interest(): Interest[] {
      return userInfo.data?.interest ?? [];
    },
    get responsibility(): Responsibility[] {
      return userInfo.data?.responsibility ?? [];
    },
  };
};
