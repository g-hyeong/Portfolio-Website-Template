'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiFileText, FiChevronDown, FiArrowRight } from 'react-icons/fi';
import { NotePost } from '@/types/portfolio';
import { getCategoryColor, getCategoryLabel } from '@/utils/categoryHelpers';

interface RelatedNotesDropdownProps {
  relatedNoteIds: string[];
  allNotes: NotePost[];
  onNoteClick: (note: NotePost) => void;
}

export default function RelatedNotesDropdown({ 
  relatedNoteIds, 
  allNotes, 
  onNoteClick
}: RelatedNotesDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 시 드롭다운 닫기 - Hook을 조건문 이전에 배치
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 조건부 렌더링을 위한 체크
  if (!relatedNoteIds || relatedNoteIds.length === 0) {
    return null;
  }

  const relatedNotes = relatedNoteIds
    .map(id => allNotes.find(note => note.id === id))
    .filter(Boolean) as NotePost[];

  if (relatedNotes.length === 0) {
    return null;
  }

  const handleNoteSelect = (note: NotePost) => {
    setIsOpen(false);
    onNoteClick(note);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* 관련 노트 버튼 */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center space-x-2 px-3 py-2 rounded-full transition-all duration-200
          ${isOpen 
            ? 'bg-opal-primary text-white border-opal-primary shadow-md' 
            : 'bg-opal-primary/15 text-opal-primary border-opal-primary/40 hover:bg-opal-primary/25 hover:border-opal-primary/60'
          }
          border shadow-sm hover:shadow-md
        `}
        whileTap={{ scale: 0.95 }}
      >
        <FiFileText className="w-4 h-4" />
        <span className="text-sm font-medium">관련 노트</span>
        <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
          isOpen 
            ? 'bg-white/20 text-white' 
            : 'bg-white text-opal-primary'
        }`}>
          {relatedNotes.length}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <FiChevronDown className="w-3 h-3" />
        </motion.div>
      </motion.button>

      {/* 드롭다운 메뉴 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={`
              absolute top-full mt-2 left-0 z-50 min-w-[320px] max-w-[400px]
              bg-surface border border-border shadow-2xl
              rounded-xl overflow-hidden
            `}
          >
            {/* 헤더 */}
            <div className="px-4 py-3 border-b border-border bg-surface-secondary">
              <h3 className="text-sm font-semibold text-foreground">관련 노트</h3>
            </div>

            {/* 노트 목록 */}
            <div className="max-h-[300px] overflow-y-auto">
              {relatedNotes.map((note, index) => (
                <motion.button
                  key={note.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  onClick={() => handleNoteSelect(note)}
                  className="w-full text-left p-4 transition-all duration-200 group hover:bg-surface-secondary border-b border-border last:border-b-0"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      {/* 카테고리 배지 */}
                      <div className="mb-2">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${getCategoryColor(note.category)}`}>
                          {getCategoryLabel(note.category)}
                        </span>
                      </div>
                      
                      {/* 제목 */}
                      <h4 className="text-sm font-semibold text-foreground group-hover:text-opal-primary transition-colors duration-200 leading-tight mb-2">
                        {note.title}
                      </h4>
                      
                      {/* 요약 - 짧게 */}
                      <p className="text-xs text-foreground-muted leading-relaxed line-clamp-2">
                        {note.summary}
                      </p>
                      
                      {/* 태그 - 간소화 */}
                      {note.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {note.tags.slice(0, 2).map((tag, tagIndex) => (
                            <span 
                              key={tagIndex}
                              className="inline-block text-xs px-1.5 py-0.5 rounded bg-opal-primary/10 text-opal-primary"
                            >
                              {tag}
                            </span>
                          ))}
                          {note.tags.length > 2 && (
                            <span className="inline-block text-xs px-1.5 py-0.5 rounded bg-surface-secondary text-foreground-muted">
                              +{note.tags.length - 2}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {/* 화살표 아이콘 */}
                    <motion.div
                      className="ml-3 flex-shrink-0 mt-1"
                      initial={{ x: 0 }}
                      whileHover={{ x: 3 }}
                      transition={{ duration: 0.2 }}
                    >
                      <FiArrowRight className="w-4 h-4 text-foreground-muted group-hover:text-opal-primary transition-colors duration-200" />
                    </motion.div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}