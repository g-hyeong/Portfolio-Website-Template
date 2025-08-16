// 전처리된 마크다운 콘텐츠를 사용하는 최적화된 로더

let markdownContentCache: Record<string, string> | null = null;

// 전처리된 마크다운 콘텐츠 로드 (빌드 시 생성된 모듈 사용)
async function loadPreprocessedMarkdown(): Promise<Record<string, string>> {
  if (markdownContentCache) return markdownContentCache;
  
  try {
    // 빌드 시 생성된 마크다운 모듈 import
    const { markdownContent } = await import('@/data/generated/markdown-content');
    markdownContentCache = markdownContent;
    return markdownContentCache;
  } catch (error) {
    console.error('Failed to load preprocessed markdown content:', error);
    // 폴백: 빈 객체 반환
    return {};
  }
}

// 최적화된 마크다운 콘텐츠 로더
export async function loadMarkdownContentOptimized(slug: string): Promise<string> {
  const contentMap = await loadPreprocessedMarkdown();
  
  if (contentMap[slug]) {
    return contentMap[slug];
  }
  
  // 폴백: 기존 네트워크 기반 로딩
  console.warn(`Fallback to network loading for: ${slug}`);
  try {
    const { loadMarkdownContent } = await import('./loadMarkdown');
    return await loadMarkdownContent(slug);
  } catch (error) {
    console.error('Error loading markdown content:', error);
    return `# 콘텐츠를 불러올 수 없습니다

죄송합니다. **${slug}** 포스트의 내용을 불러오는 중 오류가 발생했습니다.

잠시 후 다시 시도해 주세요.`;
  }
}

// 마크다운 콘텐츠를 즉시 동기적으로 가져오기 (빌드된 경우)
export function getMarkdownContentSync(slug: string): string | null {
  if (!markdownContentCache) {
    return null; // 아직 로드되지 않음
  }
  
  return markdownContentCache[slug] || null;
}

// 모든 마크다운 콘텐츠가 준비되었는지 확인
export function isMarkdownContentReady(): boolean {
  return markdownContentCache !== null;
}

// 캐시 프리로딩 (앱 시작 시 호출)
export async function preloadMarkdownContent(): Promise<void> {
  await loadPreprocessedMarkdown();
}