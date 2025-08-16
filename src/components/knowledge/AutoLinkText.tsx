'use client';

import React, { useMemo, memo, useState, useEffect } from 'react';
import { getOptimizedLinkedTextsMap } from '@/utils/optimizedKnowledgeGraph';
import { useKnowledgeGraph } from '@/contexts/KnowledgeGraphContext';

interface AutoLinkTextProps {
  children: React.ReactNode;
  className?: string;
}

// 최적화된 텍스트 노드 처리 함수
function processTextNode(
  textContent: string, 
  linkedTextsMap: Map<string, Array<{ noteId: string; priority: number; strength: number }>>, 
  openNoteFromText: (text: string, mousePosition?: { x: number; y: number }) => void,
  showPreview: (text: string, mousePosition: { x: number; y: number }) => void,
  hidePreview: () => void
): React.ReactNode[] {
  
  // 빠른 검색을 위한 패턴 구분
  const stringPatterns = new Set<string>();
  const regexPatterns: Array<{ pattern: RegExp, key: string }> = [];
  
  for (const [key] of linkedTextsMap) {
    if (key.startsWith('/') && key.endsWith('/i')) {
      // 정규식 패턴
      try {
        const regexPattern = new RegExp(key.slice(1, -2), 'i');
        regexPatterns.push({ pattern: regexPattern, key });
      } catch {
        console.warn('Invalid regex pattern:', key);
      }
    } else {
      // 일반 문자열 패턴 - 대소문자 무시
      stringPatterns.add(key.toLowerCase());
    }
  }
  
  if (stringPatterns.size === 0 && regexPatterns.length === 0) {
    return [textContent];
  }
  
  const trimmedText = textContent.trim();
  const trimmedLower = trimmedText.toLowerCase();
  
  // 1. 빠른 문자열 매칭 먼저 확인 (O(1))
  if (stringPatterns.has(trimmedLower)) {
    return [
      <span
        key="autolink-0"
        className="text-opal-primary hover:text-opal-primary-hover cursor-pointer underline decoration-opal-primary/30 hover:decoration-opal-primary transition-all duration-200"
        onMouseEnter={(e) => {
          const mousePosition = { x: e.clientX, y: e.clientY };
          showPreview(trimmedText, mousePosition);
        }}
        onMouseLeave={hidePreview}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          hidePreview();
          openNoteFromText(trimmedText);
        }}
      >
        {textContent}
      </span>
    ];
  }
  
  // 2. 정규식 패턴 매칭 (더 무거운 작업이므로 나중에)
  for (const { pattern } of regexPatterns) {
    const match = trimmedText.match(pattern);
    if (match && match[0] === trimmedText) {
      return [
        <span
          key="autolink-regex-0"
          className="text-opal-primary hover:text-opal-primary-hover cursor-pointer underline decoration-opal-primary/30 hover:decoration-opal-primary transition-all duration-200"
          onMouseEnter={(e) => {
            const mousePosition = { x: e.clientX, y: e.clientY };
            showPreview(trimmedText, mousePosition);
          }}
          onMouseLeave={hidePreview}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            hidePreview();
            openNoteFromText(trimmedText);
          }}
        >
          {textContent}
        </span>
      ];
    }
  }
  
  // 매칭되지 않음
  return [textContent];
}

// React 노드를 재귀적으로 처리하는 함수
function processNode(
  node: React.ReactNode, 
  linkedTextsMap: Map<string, Array<{ noteId: string; priority: number; strength: number }>>, 
  openNoteFromText: (text: string, mousePosition?: { x: number; y: number }) => void,
  showPreview: (text: string, mousePosition: { x: number; y: number }) => void,
  hidePreview: () => void
): React.ReactNode {
  if (typeof node === 'string') {
    return processTextNode(node, linkedTextsMap, openNoteFromText, showPreview, hidePreview);
  }
  
  if (React.isValidElement(node)) {
    // 이미 링크 컴포넌트인 경우 처리하지 않음
    if (node.type === 'a' || 
        (typeof node.type === 'function' && node.type.name === 'InteractiveLinkText')) {
      return node;
    }
    
    // 자식들을 재귀적으로 처리
    const processedChildren = React.Children.map(
      (node.props as { children?: React.ReactNode }).children, 
      child => processNode(child, linkedTextsMap, openNoteFromText, showPreview, hidePreview)
    );
    
    return React.cloneElement(node as React.ReactElement<{ children?: React.ReactNode }>, {}, processedChildren);
  }
  
  return node;
}

function AutoLinkText({ children, className }: AutoLinkTextProps) {
  const { openNoteFromText, showPreview, hidePreview } = useKnowledgeGraph();
  const [linkedTextsMap, setLinkedTextsMap] = useState<Map<string, Array<{ noteId: string; priority: number; strength: number }>> | null>(null);
  
  // 최적화된 linkedTexts 로드
  useEffect(() => {
    getOptimizedLinkedTextsMap().then(setLinkedTextsMap);
  }, []);
  
  const processedChildren = useMemo(() => {
    if (!linkedTextsMap) {
      // 아직 로드되지 않음 - 원본 텍스트 반환
      return children;
    }
    
    return React.Children.map(children, child => 
      processNode(child, linkedTextsMap, openNoteFromText, showPreview, hidePreview)
    );
  }, [children, linkedTextsMap, openNoteFromText, showPreview, hidePreview]);
  
  return (
    <div className={className}>
      {processedChildren}
    </div>
  );
}

// React.memo로 최적화
export default memo(AutoLinkText);