'use client';

import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiLink, FiEye, FiBookOpen } from 'react-icons/fi';
import { useKnowledgeGraph } from '@/contexts/KnowledgeGraphContext';
import { getCategoryColor, getCategoryLabel } from '@/utils/categoryHelpers';

interface InteractiveLinkTextProps {
  children: ReactNode;
  className?: string;
  hoverEffect?: 'subtle' | 'glow' | 'underline' | 'highlight' | 'none';
  interactionMode?: 'click' | 'hover' | 'both';
  showPreview?: boolean;
  previewDelay?: number;
  as?: 'span' | 'div' | 'h1' | 'h2' | 'h3' | 'p';
}

// 호버 프리뷰 카드 컴포넌트
interface HoverPreviewProps {
  text: string;
  isVisible: boolean;
  position: { x: number; y: number };
}

function HoverPreview({ text, isVisible, position }: HoverPreviewProps) {
  const { getLinkedNotesForText, getVisualizationData } = useKnowledgeGraph();
  const notes = getLinkedNotesForText(text);
  const vizData = getVisualizationData(text);

  if (!isVisible || notes.length === 0) return null;

  const primaryNote = notes[0];
  const hasMultipleNotes = notes.length > 1;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 10 }}
        className="fixed z-[100] pointer-events-none"
        style={{
          left: Math.min(position.x, window.innerWidth - 320),
          top: Math.max(position.y - 10, 10),
        }}
      >
        <div className="rounded-xl p-4 shadow-2xl border border-opal-primary/10 max-w-[300px]" style={{
          background: 'linear-gradient(135deg, rgba(139, 127, 184, 0.08) 0%, rgba(169, 159, 193, 0.05) 50%, rgba(255, 255, 255, 0.12) 100%)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 20px 40px -12px rgba(139, 127, 184, 0.2), 0 0 0 1px rgba(139, 127, 184, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
        }}>
          {/* 링크 강도 인디케이터 */}
          <div className="flex items-center space-x-2 mb-3">
            <div className="flex items-center space-x-1">
              <FiLink className="w-4 h-4 text-opal-primary" />
              <span className="text-xs text-foreground-muted">
                {hasMultipleNotes ? `${notes.length}개 연결` : '1개 연결'}
              </span>
            </div>
            <div className="flex-1 bg-surface-secondary rounded-full h-1.5 overflow-hidden">
              <div 
                className="h-full bg-opal-primary rounded-full transition-all duration-300"
                style={{ width: `${Math.min(vizData.linkStrengths[primaryNote.id] || 0, 100)}%` }}
              />
            </div>
          </div>

          {/* 기본 노트 정보 */}
          <div className="mb-3">
            <div className="flex items-center space-x-2 mb-2">
              <div 
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: primaryNote.color || '#8B5CF6' }}
              />
              <span className={`text-xs px-2 py-0.5 rounded-full ${getCategoryColor(primaryNote.category)}`}>
                {getCategoryLabel(primaryNote.category)}
              </span>
            </div>
            
            <h4 className="font-semibold text-foreground text-sm leading-tight mb-1">
              {primaryNote.title}
            </h4>
            
            <p className="text-xs text-foreground-secondary leading-relaxed line-clamp-2">
              {primaryNote.summary}
            </p>
            
            
          </div>

          {/* 다중 노트 인디케이터 */}
          {hasMultipleNotes && (
            <div className="border-t border-border/30 pt-2">
              <div className="flex items-center space-x-2">
                <FiBookOpen className="w-3 h-3 text-foreground-muted" />
                <span className="text-xs text-foreground-muted">
                  +{notes.length - 1}개 추가 글
                </span>
              </div>
              <div className="flex space-x-1 mt-1">
                {notes.slice(1, 4).map((note) => (
                  <div
                    key={note.id}
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: note.color || '#8B5CF6' }}
                  />
                ))}
                {notes.length > 4 && (
                  <span className="text-xs text-foreground-muted">...</span>
                )}
              </div>
            </div>
          )}

          {/* 액션 힌트 */}
          <div className="border-t border-border/30 pt-2 mt-2">
            <div className="flex items-center space-x-2 text-xs text-foreground-muted">
              <FiEye className="w-3 h-3" />
              <span>클릭하여 {hasMultipleNotes ? '모든 글' : '글'} 보기</span>
            </div>
          </div>
        </div>
        
        {/* 포인터 화살표 */}
        <div 
          className="absolute w-3 h-3 border-l border-b border-opal-primary/10 transform rotate-45 -translate-x-1.5"
          style={{ 
            left: Math.min(20, Math.max(10, position.x - (Math.min(position.x, window.innerWidth - 320)))),
            top: -6,
            background: 'linear-gradient(135deg, rgba(139, 127, 184, 0.08) 0%, rgba(255, 255, 255, 0.12) 100%)',
            backdropFilter: 'blur(20px)',
          }}
        />
      </motion.div>
    </AnimatePresence>
  );
}

export default function InteractiveLinkText({ 
  children, 
  className = '',
  hoverEffect = 'subtle',
  interactionMode = 'both',
  showPreview = true,
  previewDelay = 500,
  as: Component = 'span'
}: InteractiveLinkTextProps) {
  const { 
    isTextLinked, 
    openNoteFromText, 
    getLinkedNotesForText,
    prefetchNote 
  } = useKnowledgeGraph();
  
  const [isHovered, setIsHovered] = useState(false);
  const [showHoverPreview, setShowHoverPreview] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [pressState, setPressState] = useState<'idle' | 'pressing' | 'long-press'>('idle');
  
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pressTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // children이 string인 경우에만 클릭 가능 여부 확인
  const text = typeof children === 'string' ? children : '';
  const isLinked = text && isTextLinked(text);
  const linkedNotes = isLinked ? getLinkedNotesForText(text) : [];
  const hasMultipleNotes = linkedNotes.length > 1;

  // 호버 시작
  const handleMouseEnter = (e: React.MouseEvent) => {
    if (!isLinked || !showPreview) return;
    
    setIsHovered(true);
    setMousePosition({ x: e.clientX, y: e.clientY });
    
    // 프리페칭
    linkedNotes.forEach(note => prefetchNote(note.id));
    
    if (interactionMode === 'hover' || interactionMode === 'both') {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      hoverTimeoutRef.current = setTimeout(() => {
        setShowHoverPreview(true);
      }, previewDelay);
    }
  };

  // 호버 끝
  const handleMouseLeave = () => {
    setIsHovered(false);
    setShowHoverPreview(false);
    
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
  };

  // 마우스 이동
  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  // 클릭 시작
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isLinked) return;
    
    setPressState('pressing');
    
    // 롱 프레스 감지
    if (pressTimeoutRef.current) {
      clearTimeout(pressTimeoutRef.current);
    }
    pressTimeoutRef.current = setTimeout(() => {
      setPressState('long-press');
      // 롱 프레스 시 프리뷰 강제 표시
      if (!showHoverPreview) {
        setMousePosition({ x: e.clientX, y: e.clientY });
        setShowHoverPreview(true);
      }
    }, 500);
  };

  // 클릭 끝
  const handleMouseUp = () => {
    if (pressTimeoutRef.current) {
      clearTimeout(pressTimeoutRef.current);
    }
    
    if (pressState === 'pressing') {
      // 일반 클릭
      handleClick();
    }
    
    setPressState('idle');
  };

  // 클릭 핸들러
  const handleClick = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    if (isLinked && (interactionMode === 'click' || interactionMode === 'both')) {
      openNoteFromText(text);
    }
  };

  // 키보드 핸들러
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  // 클린업
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
      if (pressTimeoutRef.current) clearTimeout(pressTimeoutRef.current);
    };
  }, []);

  // 스타일 계산
  const getBaseStyles = () => {
    if (!isLinked) return '';
    return 'relative inline-block text-opal-primary cursor-pointer transition-all duration-200';
  };

  const getHoverStyles = () => {
    if (!isLinked) return '';
    
    const baseHover = 'hover:text-opal-primary-hover';
    
    switch (hoverEffect) {
      case 'glow':
        return `${baseHover} hover:drop-shadow-[0_0_8px_rgba(180,165,230,0.6)]`;
      case 'underline':
        return `${baseHover} hover:underline`;
      case 'highlight':
        return `${baseHover} hover:bg-opal-primary/10 hover:px-1 hover:py-0.5 hover:rounded`;
      case 'subtle':
        return `${baseHover} hover:scale-[1.02]`;
      case 'none':
        return '';
      default:
        return baseHover;
    }
  };

  const getPressStyles = () => {
    if (!isLinked) return '';
    
    if (pressState === 'pressing') {
      return 'scale-95 brightness-110';
    } else if (pressState === 'long-press') {
      return 'scale-105 brightness-125';
    }
    
    return '';
  };

  // 링크되지 않은 텍스트는 일반 컴포넌트로 렌더링
  if (!isLinked) {
    return <Component className={className}>{children}</Component>;
  }

  return (
    <>
      <Component
        className={`
          ${getBaseStyles()}
          ${getHoverStyles()}
          ${getPressStyles()}
          ${className}
          group
        `}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-label={`${text}에 대한 ${hasMultipleNotes ? `${linkedNotes.length}개의 글` : '글'} 보기`}
        title={`클릭하면 "${text}"에 대한 자세한 글을 볼 수 있습니다`}
      >
        <span className="relative">
          {children}
          
          {/* 언더라인 효과 */}
          <span className="absolute bottom-0 left-0 w-full h-[1px] bg-opal-primary/30 group-hover:bg-opal-primary-hover/50 transition-all duration-200" />
          <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-opal-primary-hover group-hover:w-full transition-all duration-300" />
          
          {/* 다중 링크 인디케이터 */}
          {hasMultipleNotes && (
            <motion.span
              className="absolute -top-1 -right-1 w-2 h-2 bg-opal-primary rounded-full text-[8px] text-white flex items-center justify-center font-bold"
              initial={{ scale: 0 }}
              animate={{ scale: isHovered ? 1.2 : 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {linkedNotes.length}
            </motion.span>
          )}
          
          {/* 호버 시 강도 인디케이터 */}
          {isHovered && hoverEffect !== 'none' && (
            <motion.div
              className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-opal-primary to-transparent rounded-full"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              exit={{ scaleX: 0 }}
              transition={{ duration: 0.2 }}
            />
          )}
        </span>
      </Component>

      {/* 호버 프리뷰 */}
      <HoverPreview
        text={text}
        isVisible={showHoverPreview}
        position={mousePosition}
      />
    </>
  );
}