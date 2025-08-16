import { IMarkdownService } from '../../core/interfaces/PortfolioRepository';

interface CacheEntry {
  content: string;
  timestamp: number;
  expiresAt: number;
}

export class CachedMarkdownService implements IMarkdownService {
  private cache = new Map<string, CacheEntry>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5분 캐시

  async loadMarkdownContent(slug: string): Promise<string> {
    // 캐시 확인
    const cached = this.cache.get(slug);
    const now = Date.now();

    if (cached && now < cached.expiresAt) {
      console.log(`Cache hit for ${slug}`);
      return cached.content;
    }

    // 캐시 미스 - 새로 로드
    try {
      console.log(`Loading ${slug} from source`);
      const response = await fetch(`/data/notePosts/${slug}.md`);
      if (!response.ok) {
        throw new Error(`Failed to load markdown file: ${slug}.md`);
      }

      const content = await response.text();

      // 캐시에 저장
      this.cache.set(slug, {
        content,
        timestamp: now,
        expiresAt: now + this.CACHE_DURATION
      });

      // 캐시 정리 (오래된 항목 제거)
      this.cleanupExpiredCache();

      return content;
    } catch (error) {
      console.error('Error loading markdown content:', error);
      return `# 콘텐츠를 불러올 수 없습니다

죄송합니다. **${slug}** 포스트의 내용을 불러오는 중 오류가 발생했습니다.

잠시 후 다시 시도해 주세요.`;
    }
  }

  private cleanupExpiredCache(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now >= entry.expiresAt) {
        this.cache.delete(key);
      }
    }
  }

  // 개발용 메서드들
  clearCache(): void {
    this.cache.clear();
  }

  getCacheSize(): number {
    return this.cache.size;
  }

  getCacheInfo(): Array<{ slug: string; timestamp: number; expiresAt: number }> {
    return Array.from(this.cache.entries()).map(([slug, entry]) => ({
      slug,
      timestamp: entry.timestamp,
      expiresAt: entry.expiresAt
    }));
  }
}