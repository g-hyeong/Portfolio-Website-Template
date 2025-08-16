import { Portfolio, Project, NotePost } from '../entities/Portfolio';
import { IPortfolioRepository, INoteService } from '../interfaces/PortfolioRepository';

export class GetPortfolioDataUseCase {
  constructor(private portfolioRepository: IPortfolioRepository) {}

  async execute(): Promise<Portfolio> {
    return await this.portfolioRepository.getPortfolio();
  }
}

export class GetProjectsUseCase {
  constructor(private portfolioRepository: IPortfolioRepository) {}

  async execute(): Promise<Project[]> {
    return await this.portfolioRepository.getProjects();
  }

  async getProjectsByType(type: 'team' | 'personal'): Promise<Project[]> {
    const projects = await this.execute();
    return projects.filter(project => project.projectType === type);
  }
}

export class GetNotesUseCase {
  constructor(private portfolioRepository: IPortfolioRepository) {}

  async execute(): Promise<NotePost[]> {
    return await this.portfolioRepository.getNotes();
  }

  async getNotesByCategory(category: string): Promise<NotePost[]> {
    const notes = await this.execute();
    return category === 'all' 
      ? notes 
      : notes.filter(note => note.category === category);
  }
}

export class GetProjectNoteUseCase {
  constructor(
    private portfolioRepository: IPortfolioRepository,
    private noteService: INoteService
  ) {}

  async execute(projectId: string): Promise<string | undefined> {
    return this.noteService.getProjectNotePostMapping(projectId);
  }
}