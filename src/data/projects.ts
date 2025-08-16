import { Project } from '@/types/portfolio';

export const projects: Project[] = [
  {
    projectId: 'EcommercePlatform',
    title: 'E-commerce Platform',
    subTitle: '🏆 우수 프로젝트 선정',
    role: 'Full Stack Developer',
    period: '2023.06 - 2023.12',
    summary: '현대적인 기술 스택을 활용한 완전한 전자상거래 플랫폼입니다. 사용자 친화적인 UI/UX와 안전한 결제 시스템을 제공하며, 관리자 대시보드를 통한 효율적인 상품 및 주문 관리가 가능합니다.',
    imagePaths: ['/assets/images/sample_image.png'],
    architectureUrl: '/assets/images/sample_image.png',
    features: [
      '반응형 웹 디자인으로 모든 디바이스 지원',
      '실시간 재고 관리 시스템',
      '안전한 결제 처리 (Stripe 연동)',
      '고급 검색 및 필터링 기능',
      '관리자 대시보드 및 분석 도구'
    ],
    implementations: [
      'Next.js와 TypeScript로 프론트엔드 개발',
      'Node.js/Express 백엔드 API 구축',
      'MongoDB를 사용한 데이터베이스 설계',
      'JWT 기반 인증 시스템 구현',
      'AWS S3를 활용한 이미지 업로드 시스템',
      'Docker를 사용한 컨테이너화 및 배포'
    ],
    techStack: ['Next.js', 'TypeScript', 'Node.js', 'MongoDB', 'AWS', 'Docker'],
    githubUrl: 'https://github.com/example/ecommerce-platform',
    demoUrl: 'https://demo-ecommerce.example.com',
    projectType: 'team',
  },
  {
    projectId: 'TaskManagementApp',
    title: 'Task Management App',
    subTitle: '팀 협업을 위한 효율적인 태스크 관리 도구',
    role: 'Frontend Developer',
    period: '2023.01 - 2023.05',
    summary: '팀의 생산성 향상을 위한 직관적인 태스크 관리 애플리케이션입니다. 드래그 앤 드롭 기능과 실시간 협업 기능을 제공하여 팀원들이 효율적으로 작업을 관리할 수 있습니다.',
    imagePaths: ['/assets/images/sample_image.png'],
    architectureUrl: '/assets/images/sample_image.png',
    features: [
      '칸반 보드 스타일의 태스크 관리',
      '실시간 협업 및 알림 시스템',
      '프로젝트별 팀원 권한 관리',
      '태스크 진행 상황 시각화',
      '파일 첨부 및 댓글 기능'
    ],
    implementations: [
      'React와 Redux를 활용한 상태 관리',
      'Socket.io를 사용한 실시간 통신',
      'Material-UI로 일관된 디자인 시스템 구축',
      'React Beautiful DnD로 드래그 앤 드롭 구현',
      'PWA 기능으로 모바일 앱 같은 경험 제공'
    ],
    techStack: ['React', 'Redux', 'Socket.io', 'Material-UI', 'PWA'],
    githubUrl: 'https://github.com/example/task-management',
    demoUrl: 'https://demo-taskapp.example.com',
    projectType: 'team',
  },
  {
    projectId: 'WeatherDashboard',
    title: 'Weather Dashboard',
    subTitle: '개인 프로젝트',
    role: 'Full Stack Developer',
    period: '2022.11 - 2022.12',
    summary: '다양한 날씨 API를 활용한 종합 날씨 대시보드입니다. 현재 날씨뿐만 아니라 예보, 날씨 맵, 그리고 개인화된 알림 기능을 제공합니다.',
    imagePaths: ['/assets/images/sample_image.png'],
    architectureUrl: '/assets/images/sample_image.png',
    features: [
      '실시간 날씨 정보 및 7일 예보',
      '인터랙티브 날씨 지도',
      '위치 기반 자동 날씨 정보',
      '개인화된 날씨 알림 설정',
      '날씨 데이터 히스토리 차트'
    ],
    implementations: [
      'Vue.js로 반응형 사용자 인터페이스 개발',
      '여러 날씨 API 통합 및 데이터 정규화',
      'Chart.js를 활용한 데이터 시각화',
      'Leaflet을 사용한 인터랙티브 지도 구현',
      'Service Worker로 오프라인 기능 지원'
    ],
    techStack: ['Vue.js', 'Chart.js', 'Leaflet', 'Express.js', 'SQLite'],
    githubUrl: 'https://github.com/example/weather-dashboard',
    demoUrl: 'https://demo-weather.example.com',
    projectType: 'personal',
  },
  {
    projectId: 'BlogPlatform',
    title: 'Personal Blog Platform',
    subTitle: '개인 블로그 플랫폼',
    role: 'Full Stack Developer',
    period: '2022.08 - 2022.10',
    summary: '개발자를 위한 개인 블로그 플랫폼입니다. 마크다운 지원, 코드 하이라이팅, SEO 최적화 등 개발 블로그에 필요한 모든 기능을 포함합니다.',
    imagePaths: ['/assets/images/sample_image.png'],
    architectureUrl: '/assets/images/sample_image.png',
    features: [
      '마크다운 에디터 및 실시간 미리보기',
      '코드 블록 문법 하이라이팅',
      'SEO 최적화 및 사이트맵 자동 생성',
      '태그 기반 포스트 분류',
      '댓글 시스템 및 소셜 공유'
    ],
    implementations: [
      'Next.js로 정적 사이트 생성',
      'MDX를 활용한 마크다운 처리',
      'Prisma ORM으로 데이터베이스 관리',
      'NextAuth.js로 소셜 로그인 구현',
      'Vercel을 통한 자동 배포 설정'
    ],
    techStack: ['Next.js', 'MDX', 'Prisma', 'PostgreSQL', 'Vercel'],
    githubUrl: 'https://github.com/example/blog-platform',
    demoUrl: 'https://myblog.example.com',
    projectType: 'personal',
  },
];