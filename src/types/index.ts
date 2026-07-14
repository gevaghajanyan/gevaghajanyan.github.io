export interface WorkItem {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  isPresent: boolean;
  details?: string[];
}

export interface Skill {
  id: string;
  title: string;
  code: string;
}

export interface IndustryKnowledge {
  id: string;
  title: string;
  code?: string;
}

export interface Tool {
  id: string;
  title: string;
  code: string;
  description: string;
}

export interface Interest {
  id: string;
  title: string;
  code: string;
}

export interface Responsibility {
  id: string;
  title: string;
}

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  fullName: string;
  jobTitle: string;
  birthDay: string;
  address: string;
  email: string;
  phone: string;
  skype: string;
  languages: string[];
}

export interface UserInfoData {
  personalInfo: PersonalInfo;
  workExperience: WorkItem[];
  education: WorkItem[];
  skills: Skill[];
  industryKnowledge: IndustryKnowledge[];
  toolsAndTechnologies: Tool[];
  interest: Interest[];
  responsibility: Responsibility[];
}

export interface UserState {
  loading: boolean;
  data: UserInfoData | null;
}
