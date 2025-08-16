'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NotePost } from '@/types/portfolio';
import { getCategoryColor, getCategoryLabel } from '@/utils/categoryHelpers';
import { FiTag } from 'react-icons/fi';
import { useTheme } from '@/hooks/useTheme';

interface KnowledgePreviewTooltipProps {
  notes: NotePost[];
  isVisible: boolean;
  mousePosition: { x: number; y: number };
  onClose: () => void;
}

export default function KnowledgePreviewTooltip({ 
  notes, 
  isVisible, 
  mousePosition 
}: KnowledgePreviewTooltipProps) {
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const { isDark } = useTheme();

  useEffect(() => {
    if (!isVisible || notes.length === 0) return;

    const tooltipWidth = 320;
    const tooltipHeight = 200;
    const margin = 16;

    let x = mousePosition.x + 16;
    let y = mousePosition.y - tooltipHeight / 2;

    // 화면 오른쪽 경계 체크
    if (x + tooltipWidth > window.innerWidth - margin) {
      x = mousePosition.x - tooltipWidth - 16;
    }

    // 화면 상단/하단 경계 체크
    if (y < margin) {
      y = margin;
    } else if (y + tooltipHeight > window.innerHeight - margin) {
      y = window.innerHeight - tooltipHeight - margin;
    }

    setTooltipPosition({ x, y });
  }, [isVisible, mousePosition, notes.length]);

  if (!isVisible || notes.length === 0) return null;

  const primaryNote = notes[0];
  const additionalCount = notes.length - 1;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 10 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="fixed z-[70] pointer-events-none"
        style={{
          left: tooltipPosition.x,
          top: tooltipPosition.y,
        }}
      >
        <div 
          className={`w-80 rounded-2xl shadow-2xl border border-opal-primary/40 overflow-hidden ${isDark ? 'bg-surface/80' : 'bg-white/85'}`}
          style={{
            backdropFilter: 'blur(25px) saturate(1.6) brightness(1.1)',
            boxShadow: isDark 
              ? 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 20px 40px rgba(0, 0, 0, 0.2)'
              : 'inset 0 1px 0 rgba(255, 255, 255, 0.3), 0 20px 40px rgba(0, 0, 0, 0.1)',
          }}
        >
          {/* Header */}
          <div 
            className={`p-4 border-b border-opal-primary/30 ${isDark ? 'bg-surface-secondary/30' : 'bg-white/40'}`}
            style={{
              backdropFilter: 'blur(15px)',
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${getCategoryColor(primaryNote.category)}`}>
                {getCategoryLabel(primaryNote.category)}
              </span>
              {additionalCount > 0 && (
                <span className="text-xs text-foreground-muted bg-surface-secondary px-2 py-1 rounded-full border border-border">
                  +{additionalCount} more
                </span>
              )}
            </div>
            <h3 className="text-sm font-bold text-foreground leading-tight line-clamp-2">
              {primaryNote.title}
            </h3>
          </div>

          {/* Content */}
          <div className="p-4">
            <p className="text-xs text-foreground-secondary leading-relaxed line-clamp-3 mb-3">
              {primaryNote.summary}
            </p>

            {/* Tags */}
            <div className="flex items-center space-x-2">
              <FiTag className="w-3 h-3 text-foreground-muted" />
              <div className="flex flex-wrap gap-1">
                {primaryNote.tags.slice(0, 3).map((tag, index) => (
                  <span 
                    key={index} 
                    className="inline-block bg-surface-secondary/50 text-foreground-secondary text-xs px-2 py-0.5 rounded border border-border/30"
                  >
                    {tag}
                  </span>
                ))}
                {primaryNote.tags.length > 3 && (
                  <span className="text-xs text-foreground-muted">
                    +{primaryNote.tags.length - 3}
                  </span>
                )}
              </div>
            </div>

            {/* Action hint */}
            <div className="mt-3 pt-2 border-t border-border/30">
              <p className="text-xs text-foreground-muted">
                클릭하여 자세히 보기
              </p>
            </div>
          </div>

          {/* Arrow pointer */}
          <div 
            className={`absolute w-3 h-3 ${isDark ? 'bg-surface/80' : 'bg-white/85'} border-l border-t border-opal-primary/40 transform rotate-45`}
            style={{
              left: tooltipPosition.x > mousePosition.x ? 'calc(100% - 6px)' : '-6px',
              top: '50%',
              marginTop: '-6px',
              backdropFilter: 'blur(15px)',
            }}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}