'use client';

import { motion } from 'framer-motion';
import { FiExternalLink } from 'react-icons/fi';
import { useKnowledgeGraph } from '@/contexts/KnowledgeGraphContext';
import { ReactNode } from 'react';

interface ClickableTextProps {
  children: ReactNode;
  noteSlug: string;
  className?: string;
  showIcon?: boolean;
  hoverEffect?: 'underline' | 'glow' | 'subtle' | 'none';
}

export default function ClickableText({ 
  children, 
  noteSlug, 
  className = '',
  showIcon = false,
  hoverEffect = 'subtle'
}: ClickableTextProps) {
  const { openNote } = useKnowledgeGraph();

  const getHoverStyles = () => {
    switch (hoverEffect) {
      case 'underline':
        return 'hover:underline hover:decoration-blue-500 hover:decoration-2 hover:underline-offset-4';
      case 'glow':
        return 'hover:text-blue-600 hover:drop-shadow-sm';
      case 'subtle':
        return 'hover:text-blue-600 hover:opacity-90';
      case 'none':
        return '';
      default:
        return 'hover:text-blue-600 hover:opacity-90';
    }
  };

  return (
    <motion.span
      className={`
        inline-flex items-center gap-1 
        cursor-pointer 
        transition-all duration-200 
        ${getHoverStyles()} 
        ${className}
      `}
      onClick={() => openNote(noteSlug)}
      whileHover={{ scale: showIcon ? 1.02 : 1.01 }}
      whileTap={{ scale: 0.98 }}
      title="클릭하면 자세한 글을 볼 수 있습니다"
    >
      {children}
      {showIcon && (
        <motion.span
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          initial={{ opacity: 0, x: -5 }}
          whileHover={{ opacity: 0.7, x: 0 }}
        >
          <FiExternalLink className="w-3 h-3 text-blue-500" />
        </motion.span>
      )}
    </motion.span>
  );
}