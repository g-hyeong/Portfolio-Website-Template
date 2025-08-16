import { TechStack } from '@/types/portfolio';

export const techStacks: Record<string, TechStack> = {
  'Language': {
    familiar: ['JavaScript', 'TypeScript', 'Python'],
    experienced: ['Java', 'Go'],
  },
  'Frontend': {
    familiar: ['React', 'Next.js', 'Vue.js'],
    experienced: ['HTML', 'CSS', 'Tailwind CSS'],
  },
  'Backend': {
    familiar: ['Node.js', 'Express.js', 'Spring Boot'],
    experienced: ['NestJS', 'FastAPI'],
  },
  'Database': {
    familiar: ['PostgreSQL', 'MongoDB', 'Redis'],
    experienced: ['MySQL', 'SQLite'],
  },
  'DevOps': {
    familiar: ['Docker', 'AWS', 'Vercel'],
    experienced: ['Kubernetes', 'CI/CD'],
  },
  'Tools': {
    familiar: ['Git', 'VS Code', 'Postman'],
    experienced: ['Figma', 'Notion'],
  },
};