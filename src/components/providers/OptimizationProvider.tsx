'use client';

import React, { useEffect } from 'react';
import { preloadMarkdownContent } from '@/utils/optimizedMarkdownLoader';
import { getOptimizedLinkedTextsMap } from '@/utils/optimizedKnowledgeGraph';

interface OptimizationProviderProps {
  children: React.ReactNode;
}

export function OptimizationProvider({ children }: OptimizationProviderProps) {
  useEffect(() => {
    // 앱 시작 시 백그라운드에서 최적화된 데이터 프리로드
    const preloadData = async () => {
      try {
        // 마크다운 콘텐츠 프리로드 (병렬 실행)
        const markdownPromise = preloadMarkdownContent();
        
        // LinkedTexts 맵 프리로드
        const linkedTextsPromise = getOptimizedLinkedTextsMap();
        
        // 두 작업을 병렬로 실행
        await Promise.all([markdownPromise, linkedTextsPromise]);
        
        console.log('✓ 최적화된 데이터 프리로드 완료');
      } catch (error) {
        console.warn('⚠ 데이터 프리로드 중 오류:', error);
        // 에러가 발생해도 앱은 정상 동작해야 함
      }
    };

    // 브라우저가 유휴 상태일 때 실행
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      (window as typeof window & { requestIdleCallback: (callback: () => void, options?: { timeout: number }) => void }).requestIdleCallback(preloadData, { timeout: 5000 });
    } else {
      // requestIdleCallback이 없는 브라우저에서는 setTimeout 사용
      setTimeout(preloadData, 100);
    }
  }, []);

  return <>{children}</>;
}