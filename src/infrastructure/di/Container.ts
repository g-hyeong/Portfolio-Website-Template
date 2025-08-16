// 의존성 주입 컨테이너: 모든 의존성을 관리
import { IPortfolioRepository, IMarkdownService, INoteService } from '../../core/interfaces/PortfolioRepository';
import { GetPortfolioDataUseCase, GetProjectsUseCase, GetNotesUseCase, GetProjectNoteUseCase } from '../../core/use-cases/GetPortfolioData';
import { StaticPortfolioRepository } from '../repositories/PortfolioRepository';
import { CachedMarkdownService } from '../services/CachedMarkdownService';
import { NoteService } from '../services/NoteService';

class DIContainer {
  private instances = new Map<string, unknown>();

  // Repository
  getPortfolioRepository(): IPortfolioRepository {
    if (!this.instances.has('portfolioRepository')) {
      this.instances.set('portfolioRepository', new StaticPortfolioRepository());
    }
    return this.instances.get('portfolioRepository') as IPortfolioRepository;
  }

  // Services
  getMarkdownService(): IMarkdownService {
    if (!this.instances.has('markdownService')) {
      this.instances.set('markdownService', new CachedMarkdownService());
    }
    return this.instances.get('markdownService') as IMarkdownService;
  }

  getNoteService(): INoteService {
    if (!this.instances.has('noteService')) {
      this.instances.set('noteService', new NoteService());
    }
    return this.instances.get('noteService') as INoteService;
  }

  // Use Cases
  getPortfolioDataUseCase(): GetPortfolioDataUseCase {
    if (!this.instances.has('portfolioDataUseCase')) {
      this.instances.set('portfolioDataUseCase', new GetPortfolioDataUseCase(this.getPortfolioRepository()));
    }
    return this.instances.get('portfolioDataUseCase') as GetPortfolioDataUseCase;
  }

  getProjectsUseCase(): GetProjectsUseCase {
    if (!this.instances.has('projectsUseCase')) {
      this.instances.set('projectsUseCase', new GetProjectsUseCase(this.getPortfolioRepository()));
    }
    return this.instances.get('projectsUseCase') as GetProjectsUseCase;
  }

  getNotesUseCase(): GetNotesUseCase {
    if (!this.instances.has('notesUseCase')) {
      this.instances.set('notesUseCase', new GetNotesUseCase(this.getPortfolioRepository()));
    }
    return this.instances.get('notesUseCase') as GetNotesUseCase;
  }

  getProjectNoteUseCase(): GetProjectNoteUseCase {
    if (!this.instances.has('projectNoteUseCase')) {
      this.instances.set('projectNoteUseCase', new GetProjectNoteUseCase(
        this.getPortfolioRepository(),
        this.getNoteService()
      ));
    }
    return this.instances.get('projectNoteUseCase') as GetProjectNoteUseCase;
  }
}

export const container = new DIContainer();