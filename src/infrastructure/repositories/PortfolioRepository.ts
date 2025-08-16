import { Portfolio, Project, Career, NotePost } from '../../core/entities/Portfolio';
import { IPortfolioRepository } from '../../core/interfaces/PortfolioRepository';

// 현재 정적 데이터를 사용하지만, 향후 API로 쉽게 교체 가능
import { portfolioData as staticPortfolioData } from '../../data';

export class StaticPortfolioRepository implements IPortfolioRepository {
  async getPortfolio(): Promise<Portfolio> {
    // 정적 데이터를 Promise로 래핑하여 비동기 인터페이스 유지
    return Promise.resolve(staticPortfolioData);
  }

  async getProjects(): Promise<Project[]> {
    return Promise.resolve(staticPortfolioData.projects);
  }

  async getCareers(): Promise<Career[]> {
    return Promise.resolve(staticPortfolioData.careers);
  }

  async getNotes(): Promise<NotePost[]> {
    return Promise.resolve(staticPortfolioData.notes);
  }

  async getProjectById(id: string): Promise<Project | null> {
    const project = staticPortfolioData.projects.find(p => p.projectId === id);
    return Promise.resolve(project || null);
  }

  async getNotePostBySlug(slug: string): Promise<NotePost | null> {
    const note = staticPortfolioData.notes.find(n => n.slug === slug);
    return Promise.resolve(note || null);
  }
}