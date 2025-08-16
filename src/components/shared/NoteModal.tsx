'use client';

import React, { useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiTag } from 'react-icons/fi';
import { NotePost } from '@/types/portfolio';
// 전처리된 HTML을 사용하므로 마크다운 로더 불필요
// import { loadMarkdownContentOptimized, getMarkdownContentSync, isMarkdownContentReady } from '@/utils/optimizedMarkdownLoader';
import { getCategoryColor, getCategoryLabel } from '@/utils/categoryHelpers';
import { disableBodyScroll, enableBodyScroll } from '@/utils/scrollLock';
import MarkdownRenderer from './MarkdownRenderer';
import RelatedNotesDropdown from './RelatedNotesDropdown';

interface NoteModalProps {
  post: NotePost;
  isOpen: boolean;
  onClose: () => void;
  variant?: 'default' | 'large';
  mousePosition?: { x: number; y: number } | null;
  allNotes?: NotePost[];
  onNoteClick?: (note: NotePost) => void;
}

function NoteModal({ 
  post, 
  isOpen, 
  onClose, 
  variant = 'default', 
  allNotes = [], 
  onNoteClick
}: NoteModalProps) {
  // 전처리된 HTML을 사용하므로 로딩 상태 관리 불필요
  // const [content, setContent] = useState<string>('');
  // const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      // 스크롤 비활성화
      disableBodyScroll();
    } else {
      // 모달이 닫힐 때 스크롤 활성화
      enableBodyScroll();
    }
    
    // cleanup 함수에서도 스크롤 활성화
    return () => {
      if (isOpen) {
        enableBodyScroll();
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const isLarge = variant === 'large';
  const maxWidth = 'max-w-5xl'; // 모든 모달 크기 통일
  
  // 클릭 시에는 항상 화면 중앙에 표시 (더 큰 크기와 강한 glassmorphism)
  const modalPosition = { justifyContent: 'center', alignItems: 'center' };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.1 }}
      className="fixed inset-0 z-50 flex pt-20 sm:pt-24 px-4 pb-4 modal-backdrop"
      onClick={onClose}
      style={{
        backgroundColor: 'var(--glass-overlay)',
        backdropFilter: 'var(--glass-blur-strong)',
        justifyContent: modalPosition.justifyContent,
        alignItems: modalPosition.alignItems,
      }}
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.5, opacity: 0 }}
        transition={{ 
          type: "spring",
          duration: 0.4,
          ease: "easeOut",
          bounce: 0.1
        }}
        className={`${maxWidth} w-full max-h-[calc(100vh-6rem)] sm:max-h-[calc(100vh-7rem)] overflow-hidden ${isLarge 
          ? 'rounded-3xl glass-modal' 
          : 'rounded-lg shadow-heavy border border-border bg-surface'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Header */}
        <div 
          className={`sticky top-0 z-20 ${isLarge 
            ? 'glass-modal-content' 
            : 'bg-surface border-b border-border'
          }`}
          style={isLarge ? {
            borderBottom: '1px solid rgba(139, 127, 184, 0.15)',
          } : {}}
        >
          <div className="flex items-start justify-between p-4">
            {/* Left Side - Category Badge + Related Notes */}
            <div className="flex items-center space-x-3 mt-1">
              {/* Category Badge */}
              <AnimatePresence mode="wait">
                <motion.div 
                  key={post.slug + '-category'}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium ${getCategoryColor(post.category)}`}>
                    {getCategoryLabel(post.category)}
                  </span>
                </motion.div>
              </AnimatePresence>
              
              {/* Related Notes Dropdown */}
              {post.relatedNotes && post.relatedNotes.length > 0 && allNotes.length > 0 && onNoteClick && (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={post.slug + '-related-notes'}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2, delay: 0.1 }}
                  >
                    <RelatedNotesDropdown
                      relatedNoteIds={post.relatedNotes}
                      allNotes={allNotes}
                      onNoteClick={onNoteClick}
                    />
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 hover:bg-surface-secondary rounded-full transition-colors"
            >
              <FiX className="w-5 h-5 text-foreground-muted" />
            </button>
          </div>

          {/* Title */}
          <div className="px-6 pb-4">
            <AnimatePresence mode="wait">
              <motion.h1 
                key={post.slug + '-title'}
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                transition={{ duration: 0.2 }}
                className={`font-bold text-foreground mb-4 leading-tight ${isLarge ? 'text-2xl sm:text-4xl' : 'text-xl sm:text-2xl'}`}
              >
                {post.title}
              </motion.h1>
            </AnimatePresence>

            {/* Tags */}
            <AnimatePresence mode="wait">
              <motion.div 
                key={post.slug + '-tags'}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2, delay: 0.1 }}
                className="flex items-center space-x-2"
              >
                <FiTag className="w-4 h-4 text-foreground-muted" />
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <span 
                      key={index} 
                      className="inline-block bg-surface-secondary text-foreground-secondary text-sm px-3 py-1 rounded-full border border-border hover:bg-opal-primary/10 transition-colors cursor-pointer"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(100vh-20rem)] sm:max-h-[calc(100vh-22rem)] modal-scroll-container">
          <AnimatePresence mode="wait">
            <motion.div 
              key={post.slug + '-content'}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25, delay: 0.1 }}
              className="p-6"
            >
              {/* Summary */}
              <div 
                className={`p-4 rounded-xl mb-6 ${isLarge 
                  ? 'glass-modal-content' 
                  : 'bg-surface-secondary border-border border'
                }`}
              >
                <h2 className="text-base font-semibold text-foreground mb-3">요약</h2>
                <p className="text-foreground-secondary leading-relaxed">
                  {post.summary}
                </p>
              </div>

              {/* Content */}
              <div className="relative">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <MarkdownRenderer slug={post.slug} isLarge={isLarge} />
                </motion.div>
              </div>

            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default memo(NoteModal);