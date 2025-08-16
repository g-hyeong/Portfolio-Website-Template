// 핵심 비즈니스 엔티티: 포트폴리오 도메인의 핵심 개념들

export interface Career {
  company: string;
  role: string;
  period: string;
  logoPath: string;
  descriptions: CareerItem[];
  techStacks: string[];
}

export interface CareerItem {
  title: string;
  details?: string[];
}

export interface Activity {
  title: string;
  period: string;
  logoPath: string;
  descriptions: string[];
}

export interface Project {
  projectId: string;
  title: string;
  subTitle: string;
  role: string;
  period: string;
  summary: string;
  imagePaths: string[];
  architectureUrl: string;
  descriptions?: string[];
  features: string[];
  implementations: string[];
  techStack: string[];
  githubUrl: string;
  demoUrl: string;
  projectType: 'team' | 'personal';
}

export interface Achievement {
  title: string;
  organization: string;
  date: string;
  description: string;
  relatedProject?: string;
}

export interface TechStack {
  familiar: string[];
  experienced: string[];
}

export interface NotePost {
  id: string;
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  category: 'work' | 'project' | 'theory' | 'design' | 'experience' | 'retrospective' | 'record' | 'achievement' | 'etc';
}

export interface Portfolio {
  careers: Career[];
  activities: Activity[];
  projects: Project[];
  achievements: Achievement[];
  techStacks: Record<string, TechStack>;
  notes: NotePost[];
}