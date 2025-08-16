'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { FaTimes } from 'react-icons/fa';
import { useEffect } from 'react';
import { disableBodyScroll, enableBodyScroll } from '@/utils/scrollLock';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
  architectureUrl: string;
  title: string;
}

const ArchitectureModal = ({ isOpen, onClose, architectureUrl, title }: ArchitectureModalProps) => {
  // 스크롤 방지 효과
  useEffect(() => {
    if (isOpen) {
      disableBodyScroll();
      return () => {
        enableBodyScroll();
      };
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="relative w-full h-full max-w-[95vw] max-h-[95vh] flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 닫기 버튼 */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 bg-surface/90 hover:bg-surface rounded-full transition-colors shadow-medium border border-border"
            >
              <FaTimes className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
            </button>
            
            {/* 아키텍처 이미지 */}
            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src={architectureUrl}
                alt={`${title} Architecture`}
                width={1200}
                height={800}
                sizes="(max-width: 640px) 95vw, (max-width: 1024px) 90vw, 85vw"
                className="w-full h-full object-contain rounded-lg shadow-2xl"
                priority
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ArchitectureModal;