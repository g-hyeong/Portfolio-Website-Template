'use client';

import React from 'react';
import { motion, AnimatePresence, LazyMotion, domAnimation } from 'framer-motion';
import { FiTag } from 'react-icons/fi';
import { NotePost } from '@/types/portfolio';

interface MotionComponentsProps {
  filteredPosts: NotePost[];
  categories: Array<{ key: string; label: string }>;
  onPostClick: (post: NotePost) => void;
  getCategoryColor: (category: string) => string;
}

export default function MotionComponents({
  filteredPosts,
  categories,
  onPostClick,
  getCategoryColor
}: MotionComponentsProps) {
  return (
    <LazyMotion features={domAnimation}>
      <motion.div 
        className="grid gap-6 md:grid-cols-2"
        layout
      >
        <AnimatePresence mode="popLayout">
          {filteredPosts.map((post, index) => (
            <motion.article
              key={post.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                transition: {
                  duration: 0.3,
                  delay: index * 0.05,
                  ease: "easeOut"
                }
              }}
              exit={{ 
                opacity: 0, 
                y: -20,
                transition: { duration: 0.2 }
              }}
              transition={{ layout: { duration: 0.3 } }}
              className="bg-surface rounded-lg shadow-medium border border-border overflow-hidden hover:shadow-heavy cursor-pointer"
              onClick={() => onPostClick(post)}
              whileHover={{ 
                y: -4,
                transition: { duration: 0.2 }
              }}
              whileTap={{ 
                scale: 0.98,
                transition: { duration: 0.1 }
              }}
            >
              <div className="p-6">
                <div className="flex items-center mb-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(post.category)}`}>
                    {categories.find(c => c.key === post.category)?.label}
                  </span>
                </div>
                
                <h2 className="text-lg font-bold text-foreground mb-2 line-clamp-2">
                  {post.title}
                </h2>
                
                <p className="text-foreground-secondary text-sm mb-4 line-clamp-3">
                  {post.summary}
                </p>
                
                <div className="flex items-center space-x-2">
                  <FiTag className="w-4 h-4 text-foreground-muted" />
                  <div className="flex flex-wrap gap-1">
                    {post.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="inline-block bg-surface-secondary text-foreground-secondary text-xs px-2 py-1 rounded border border-border">
                        {tag}
                      </span>
                    ))}
                    {post.tags.length > 3 && (
                      <span className="text-xs text-foreground-muted">+{post.tags.length - 3}</span>
                    )}
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>
    </LazyMotion>
  );
}