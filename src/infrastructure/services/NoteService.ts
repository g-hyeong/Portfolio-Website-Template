import { INoteService } from '../../core/interfaces/PortfolioRepository';

export class NoteService implements INoteService {
  private readonly noteMapping: Record<string, string> = {
    'patturning': 'ai-prompt-system',
    'respect-zone': 'toss-backend-optimization',
    'ddobak': 'startup-cto-experience'
  };

  getProjectNotePostMapping(projectId: string): string | undefined {
    return this.noteMapping[projectId];
  }

  // 향후 확장: 동적 매핑 추가 등
  addMapping(projectId: string, noteSlug: string): void {
    this.noteMapping[projectId] = noteSlug;
  }

  removeMapping(projectId: string): void {
    delete this.noteMapping[projectId];
  }
}