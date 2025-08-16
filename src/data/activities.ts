import { Activity } from '@/types/portfolio';

export const activities: Activity[] = [
  {
    title: '개발자 커뮤니티 DevCorp',
    period: '2023.03 - 현재',
    logoPath: '/assets/icons/sample_logo.png',
    descriptions: [
      'React/Next.js 스터디 그룹 운영',
      '월간 개발 세미나 기획 및 발표',
      '신입 개발자 멘토링 프로그램 참여'
    ],
  },
  {
    title: '오픈소스 기여단',
    period: '2022.06 - 2023.12', 
    logoPath: '/assets/icons/sample_logo.png',
    descriptions: [
      '인기 오픈소스 프로젝트 기여',
      '버그 수정 및 새로운 기능 개발',
      '코드 리뷰 및 문서화 작업'
    ],
  },
];