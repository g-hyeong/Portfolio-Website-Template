import { IMarkdownService } from '../../core/interfaces/PortfolioRepository';

export class MarkdownService implements IMarkdownService {
  async loadMarkdownContent(slug: string): Promise<string> {
    try {
      const response = await fetch(`/data/notePosts/${slug}.md`);
      if (!response.ok) {
        throw new Error(`Failed to load markdown file: ${slug}.md`);
      }
      return await response.text();
    } catch (error) {
      console.error('Error loading markdown content:', error);
      return `# 콘텐츠를 불러올 수 없습니다

죄송합니다. **${slug}** 포스트의 내용을 불러오는 중 오류가 발생했습니다.

잠시 후 다시 시도해 주세요.`;
    }
  }
}