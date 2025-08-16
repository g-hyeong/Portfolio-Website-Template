'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight, FiFileText } from 'react-icons/fi';
import { NotePost } from '@/types/portfolio';
import { getCategoryColor, getCategoryLabel } from '@/utils/categoryHelpers';

interface RelatedNotesProps {
  relatedNoteIds: string[];
  allNotes: NotePost[];
  onNoteClick: (note: NotePost) => void;
  isLarge?: boolean;
}

export default function RelatedNotes({ 
  relatedNoteIds, 
  allNotes, 
  onNoteClick,
  isLarge = false 
}: RelatedNotesProps) {
  if (!relatedNoteIds || relatedNoteIds.length === 0) {
    return null;
  }

  const relatedNotes = relatedNoteIds
    .map(id => allNotes.find(note => note.id === id))
    .filter(Boolean) as NotePost[];

  if (relatedNotes.length === 0) {
    return null;
  }

  return (
    <div className={`mt-8 ${isLarge ? 'glass-modal-content' : 'bg-surface-secondary border border-border'} rounded-xl p-6`}>
      <div className="flex items-center mb-4">
        <FiFileText className="w-5 h-5 text-foreground-muted mr-2" />
        <h3 className="text-lg font-semibold text-foreground">관련 노트</h3>
      </div>
      
      <div className="space-y-3">
        {relatedNotes.map((note, index) => (
          <motion.div
            key={note.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.3, 
              delay: index * 0.1,
              ease: "easeOut"
            }}
            onClick={() => onNoteClick(note)}
            className={`
              group relative overflow-hidden rounded-lg cursor-pointer transition-all duration-200
              ${isLarge 
                ? 'bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20' 
                : 'bg-surface hover:bg-surface-secondary border border-border hover:border-opal-primary/30'
              }
              hover:shadow-lg hover:shadow-opal-primary/5 hover:-translate-y-0.5
            `}
          >
            {/* Background gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-opal-primary/0 via-opal-primary/5 to-opal-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="relative p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  {/* Category badge */}
                  <div className="mb-2">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${getCategoryColor(note.category)}`}>
                      {getCategoryLabel(note.category)}
                    </span>
                  </div>
                  
                  {/* Title */}
                  <h4 className="text-base font-semibold text-foreground group-hover:text-opal-primary transition-colors duration-200 leading-tight mb-2">
                    {note.title}
                  </h4>
                  
                  {/* Summary - truncated */}
                  <p className="text-sm text-foreground-muted leading-relaxed line-clamp-2">
                    {note.summary}
                  </p>
                  
                  {/* Tags */}
                  {note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {note.tags.slice(0, 3).map((tag, tagIndex) => (
                        <span 
                          key={tagIndex}
                          className="inline-block text-xs px-2 py-0.5 rounded-full bg-opal-primary/10 text-opal-primary border border-opal-primary/20"
                        >
                          {tag}
                        </span>
                      ))}
                      {note.tags.length > 3 && (
                        <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-surface-secondary text-foreground-muted">
                          +{note.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Arrow icon */}
                <motion.div
                  className="ml-4 flex-shrink-0"
                  initial={{ x: 0 }}
                  whileHover={{ x: 3 }}
                  transition={{ duration: 0.2 }}
                >
                  <FiArrowRight className="w-5 h-5 text-foreground-muted group-hover:text-opal-primary transition-colors duration-200" />
                </motion.div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Bottom decoration */}
      <div className="mt-4 pt-4 border-t border-border/50">
        <p className="text-xs text-foreground-muted text-center">
          관련된 {relatedNotes.length}개의 노트
        </p>
      </div>
    </div>
  );
}