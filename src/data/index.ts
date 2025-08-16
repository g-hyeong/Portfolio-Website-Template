import { PortfolioData } from '@/types/portfolio';
import { careers } from './careers';
import { activities } from './activities';
import { projects } from './projects';
import { achievements } from './achievements';
import { techStacks } from './skills';
import { notes } from './notes';
import { heroData } from './hero';

export const portfolioData: PortfolioData = {
  careers,
  activities,
  projects,
  achievements,
  techStacks,
  notes,
};

// Export individual data for direct use
export { careers, activities, projects, achievements, techStacks, notes, heroData };