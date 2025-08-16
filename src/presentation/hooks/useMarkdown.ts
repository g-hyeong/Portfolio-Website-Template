'use client';

import { useState, useEffect } from 'react';
import { container } from '../../infrastructure/di/Container';

export const useMarkdown = (slug: string, isOpen: boolean = true) => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !slug) return;

    const loadContent = async () => {
      try {
        setLoading(true);
        setError(null);
        const markdownService = container.getMarkdownService();
        
        // 이미지 마크다운을 HTML div로 변환하여 p 태그 문제 해결
        const rawContent = await markdownService.loadMarkdownContent(slug);
        const processedContent = rawContent.replace(
          /!\[([^\]]*)\]\(([^)]+)\)/g,
          '<div class="image-container my-6"><img src="$2" alt="$1" class="rounded-lg shadow-lg max-w-full h-auto mx-auto block" /><em class="block text-sm text-foreground-muted mt-2 text-center">$1</em></div>'
        );
        
        setContent(processedContent);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load markdown content';
        setError(errorMessage);
        setContent(`# 오류가 발생했습니다\n\n${errorMessage}`);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [slug, isOpen]);

  return { content, loading, error };
};