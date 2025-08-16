'use client';

import React, { useState, useEffect, memo } from 'react';
import styles from './MarkdownStyles.module.css';

// highlight.js 스타일 동적 로드 (클라이언트에서만)
const loadHighlightStyles = () => {
  if (typeof window !== 'undefined' && !document.querySelector('#highlight-css')) {
    const link = document.createElement('link');
    link.id = 'highlight-css';
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/github-dark.min.css';
    document.head.appendChild(link);
  }
};

interface MarkdownRendererProps {
  slug?: string;  // slug를 받아서 해당 HTML 파일 로드
  content?: string;  // 대체용 컨텐트 (optional)
  isLarge?: boolean;
}

// 전처리된 HTML을 사용하는 렌더러
function PreprocessedRenderer({ slug, isLarge = false }: MarkdownRendererProps & { slug: string }) {
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // highlight.js 스타일 로드
    loadHighlightStyles();
    
    async function loadPreprocessedHTML() {
      try {
        setLoading(true);
        setError(null);
        
        // 전처리된 HTML 파일 로드
        const response = await fetch(`/data/generated/html/${slug}.html?t=${Date.now()}`, {
          cache: 'no-cache',
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        if (!response.ok) {
          console.error(`Failed to fetch HTML file: ${slug}.html`, response.status, response.statusText);
          throw new Error(`HTML 파일을 찾을 수 없습니다: ${slug}.html (Status: ${response.status})`);
        }
        
        const html = await response.text();
        setHtmlContent(html);
      } catch (error) {
        console.error('Error loading preprocessed HTML:', error);
        setError(`전처리된 HTML을 불러오는 중 오류가 발생했습니다: ${slug}`);
      } finally {
        setLoading(false);
      }
    }

    loadPreprocessedHTML();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-opal-primary"></div>
        <span className="ml-3 text-foreground-secondary text-sm">HTML을 로딩하는 중...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4 border border-red-300 rounded">
        {error}
      </div>
    );
  }

  return (
    <div 
      className={`${styles.markdownContent} ${isLarge ? 'text-lg' : ''}`}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}

// 메인 마크다운 렌더러 컴포넌트
function MarkdownRenderer({ slug, content, isLarge = false }: MarkdownRendererProps) {
  // slug가 있으면 전처리된 HTML 사용, 없으면 content를 그대로 표시
  if (slug) {
    return <PreprocessedRenderer slug={slug} isLarge={isLarge} />;
  }
  
  if (content) {
    // content만 있는 경우 간단히 표시 (전처리 없이)
    return (
      <div className="text-foreground-secondary leading-relaxed">
        {content}
      </div>
    );
  }
  
  return (
    <div className="text-red-500">
      slug 또는 content가 필요합니다.
    </div>
  );
}

export default memo(MarkdownRenderer);