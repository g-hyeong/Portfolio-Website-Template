import { Career } from '@/types/portfolio';

export const careers: Career[] = [
  {
    company: 'TechCorp',
    role: 'Full Stack Developer',
    period: '2023.03 - 현재',
    logoPath: '/assets/icons/sample_logo.png',
    descriptions: [
      {
        title: '웹 애플리케이션 개발',
        details: [
          'React/Next.js 기반 프론트엔드 개발',
          'Node.js/Express 백엔드 API 개발',
          'MongoDB 데이터베이스 설계 및 관리',
          'RESTful API 설계 및 구현',
          'JWT 기반 인증 시스템 구축',
        ],
      },
      {
        title: 'DevOps 및 배포',
        details: [
          'Docker 컨테이너화',
          'AWS EC2/S3 인프라 관리',
          'CI/CD 파이프라인 구축',
          'Nginx 웹서버 설정',
        ],
      },
    ],
    techStacks: [
      'React',
      'Next.js',
      'Node.js',
      'MongoDB',
      'AWS',
      'Docker'
    ],
  },
  {
    company: 'StartupCo',
    role: 'Backend Developer',
    period: '2022.06 - 2023.02',
    logoPath: '/assets/icons/sample_logo.png',
    descriptions: [
      {
        title: '백엔드 시스템 개발',
        details: [
          'Spring Boot 기반 REST API 개발',
          'MySQL 데이터베이스 설계',
          'Redis 캐싱 시스템 구축',
          'Spring Security 인증/인가 구현',
          'JPA/Hibernate ORM 활용',
        ],
      },
      {
        title: '시스템 최적화',
        details: [
          '쿼리 성능 최적화',
          '비동기 처리 시스템 구축',
          '로그 모니터링 시스템 도입',
        ],
      },
    ],
    techStacks: [
      'Spring Boot',
      'MySQL',
      'Redis',
      'JPA',
      'AWS'
    ],
  },
];