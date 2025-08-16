import { NotePost } from '@/types/portfolio';

export const notes: NotePost[] = [
  {
    id: 'react-performance-optimization',
    slug: 'react-performance-optimization',
    title: 'React 성능 최적화 기법',
    summary: 'React 애플리케이션의 성능을 향상시키기 위한 다양한 최적화 기법들을 정리한 글입니다.',
    tags: ['React', '성능 최적화', 'Frontend'],
    category: 'theory',
    priority: 90,
    linkedTexts: [
      { text: '성능 최적화', strength: 85 },
    ],
    relatedNotes: ['next-js-ssr-guide'],
    color: '#3B82F6'
  },
  {
    id: 'next-js-ssr-guide',
    slug: 'next-js-ssr-guide',
    title: 'Next.js SSR 완벽 가이드',
    summary: 'Next.js의 Server-Side Rendering에 대한 상세한 가이드와 실무 적용 사례를 다룹니다.',
    tags: ['Next.js', 'SSR', 'React'],
    category: 'project',
    priority: 85,
    linkedTexts: [
      { text: '웹 애플리케이션 개발', strength: 95 },
    ],
    relatedNotes: ['react-performance-optimization'],
    color: '#10B981'
  },
  {
    id: 'database-design-patterns',
    slug: 'database-design-patterns',
    title: '데이터베이스 설계 패턴',
    summary: '효율적인 데이터베이스 설계를 위한 다양한 패턴과 모범 사례들을 정리했습니다.',
    tags: ['Database', 'Design Patterns', 'Backend'],
    category: 'theory',
    priority: 80,
    linkedTexts: [
      { text: '데이터베이스 설계', strength: 85 },
    ],
    relatedNotes: [],
    color: '#8B5CF6'
  },
  {
    id: 'docker-deployment-guide',
    slug: 'docker-deployment-guide',
    title: 'Docker를 활용한 배포 전략',
    summary: 'Docker 컨테이너를 활용한 효율적인 애플리케이션 배포 방법과 CI/CD 파이프라인 구축에 대해 설명합니다.',
    tags: ['Docker', 'DevOps', 'CI/CD'],
    category: 'experience',
    priority: 75,
    linkedTexts: [
      { text: 'DevOps 및 배포', strength: 80 },
    ],
    relatedNotes: [],
    color: '#F59E0B'
  },
  {
    id: 'aws-architecture-decisions',
    slug: 'aws-architecture-decisions',
    title: 'AWS 아키텍처 설계 회고',
    summary: '대규모 웹 애플리케이션을 위한 AWS 클라우드 아키텍처 설계 과정과 배운 점들을 정리했습니다.',
    tags: ['AWS', 'Architecture', 'Cloud'],
    category: 'retrospective',
    priority: 70,
    linkedTexts: [
      { text: 'Personal Blog Platform', strength: 80 },
    ],
    relatedNotes: [],
    color: '#EF4444'
  },
];