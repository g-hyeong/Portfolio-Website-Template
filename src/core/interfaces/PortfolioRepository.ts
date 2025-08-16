import { Portfolio, Project, Career, NotePost } from '../entities/Portfolio';

// 포트: 외부와의 소통을 위한 인터페이스
export interface IPortfolioRepository {
  getPortfolio(): Promise<Portfolio>;
  getProjects(): Promise<Project[]>;
  getCareers(): Promise<Career[]>;
  getNotes(): Promise<NotePost[]>;
  getProjectById(id: string): Promise<Project | null>;
  getNotePostBySlug(slug: string): Promise<NotePost | null>;
}

export interface IMarkdownService {
  loadMarkdownContent(slug: string): Promise<string>;
}

export interface INoteService {
  getProjectNotePostMapping(projectId: string): string | undefined;
}