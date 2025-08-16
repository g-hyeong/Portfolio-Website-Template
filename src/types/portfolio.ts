// 경력 세부 항목 타입
export interface CareerItem {
  title: string;
  details?: string[];
}

// 경력 정보 타입
export interface Career {
  company: string;
  role: string;
  period: string;
  logoPath: string;
  descriptions: CareerItem[];
  techStacks: string[];
}

// 활동 정보 타입
export interface Activity {
  title: string;
  period: string;
  logoPath: string;
  descriptions: string[];
}

// 프로젝트 정보 타입
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

// 기술 스택 타입
export interface TechStack {
  familiar: string[];
  experienced: string[];
}

// 업적(수상) 정보 타입
export interface Achievement {
  title: string;
  organization: string;
  date: string;
  description: string;
  relatedProject?: string; // 연관된 프로젝트명 (옵션)
}

// 링크된 텍스트 정보 타입
export interface LinkedText {
  text: string | RegExp; // 정확한 텍스트 또는 정규식 패턴
  strength: number; // 연결 강도 (1-100)
  context?: string; // 컨텍스트 정보 (선택적)
}

// 노트 포스트 타입
export interface NotePost {
  id: string;
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  category: 'work' | 'project' | 'theory' | 'design' | 'experience' | 'retrospective' | 'record' | 'achievement' | 'etc';
  // 새로운 필드들
  linkedTexts: LinkedText[]; // 이 노트가 연결될 텍스트들
  priority: number; // 우선순위 (1-100, 높을수록 우선)
  relatedNotes: string[]; // 연관된 다른 노트 ID들
  color?: string; // 커스텀 테마 색상 (hex)
}

// 전체 포트폴리오 데이터 타입
export interface PortfolioData {
  careers: Career[];
  activities: Activity[];
  projects: Project[];
  achievements: Achievement[];
  techStacks: Record<string, TechStack>;
  notes: NotePost[];
} 