// 마크다운 콘텐츠 캐시
const markdownCache = new Map<string, string>();

export async function loadMarkdownContent(slug: string): Promise<string> {
  // 캐시된 콘텐츠가 있으면 즉시 반환
  if (markdownCache.has(slug)) {
    return markdownCache.get(slug)!;
  }

  try {
    // 동적 import를 사용하여 마크다운 파일을 텍스트로 로드
    const response = await fetch(`/data/notePosts/${slug}.md`);
    if (!response.ok) {
      throw new Error(`Failed to load markdown file: ${slug}.md`);
    }
    const content = await response.text();
    
    // 캐시에 저장
    markdownCache.set(slug, content);
    
    return content;
  } catch (error) {
    console.error('Error loading markdown content:', error);
    const errorContent = `# 콘텐츠를 불러올 수 없습니다

죄송합니다. **${slug}** 포스트의 내용을 불러오는 중 오류가 발생했습니다.

잠시 후 다시 시도해 주세요.`;
    
    // 에러 콘텐츠도 캐시하여 반복 요청 방지
    markdownCache.set(slug, errorContent);
    
    return errorContent;
  }
}

// 캐시 무효화 함수 (필요시 사용)
export function clearMarkdownCache(): void {
  markdownCache.clear();
}