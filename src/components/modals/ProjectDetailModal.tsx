'use client';

import { Project } from '@/types/portfolio';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { FaExternalLinkAlt, FaGithub, FaSitemap, FaTimes, FaBookOpen } from 'react-icons/fa';
import { useKnowledgeGraph } from '@/contexts/KnowledgeGraphContext';
import { useEffect } from 'react';
import { disableBodyScroll, enableBodyScroll } from '@/utils/scrollLock';

interface ProjectDetailModalProps {
  selectedProject: Project | null;
  onClose: () => void;
  getProjectNotePost?: (projectId: string) => string | undefined;
  onArchitectureClick?: () => void;
  onImageClick?: (imagePath: string) => void;
  isImageModalOpen?: boolean;
}

const ProjectDetailModal = ({ 
  selectedProject, 
  onClose, 
  getProjectNotePost,
  onArchitectureClick,
  onImageClick,
  isImageModalOpen = false
}: ProjectDetailModalProps) => {
  const { openNote } = useKnowledgeGraph();

  // ESC 키로 모달 닫기 및 스크롤 방지
  useEffect(() => {
    if (!selectedProject || isImageModalOpen) return;

    // 스크롤 비활성화
    disableBodyScroll();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      // 스크롤 활성화
      enableBodyScroll();
    };
  }, [selectedProject, onClose, isImageModalOpen]);

  return (
    <AnimatePresence>
      {selectedProject && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-surface rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto relative border border-border shadow-heavy"
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 모달 헤더 */}
            <div className="sticky top-0 bg-surface border-b border-border p-4 sm:p-6 rounded-t-2xl z-10">
              <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
                <div className="flex-1">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground leading-tight">
                    {selectedProject.title}
                  </h3>
                  <p className="text-sm sm:text-base text-opal-primary font-semibold mt-1">
                    {selectedProject.role} | {selectedProject.period}
                  </p>
                </div>
                
                {/* 상단 버튼들 - 모바일에서는 세로 배치 */}
                <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 md:space-x-3">
                  {getProjectNotePost && getProjectNotePost(selectedProject.projectId) && (
                    <button
                      onClick={() => {
                        const noteSlug = getProjectNotePost(selectedProject.projectId);
                        if (noteSlug) openNote(noteSlug, selectedProject.title);
                      }}
                      className="flex items-center justify-center px-3 py-2 bg-success text-white rounded-lg hover:bg-success/80 transition-colors text-sm shadow-light hover:shadow-medium"
                    >
                      <FaBookOpen className="mr-2" />
                      <span className="whitespace-nowrap">자세한 글</span>
                    </button>
                  )}
                  
                  {selectedProject.githubUrl && (
                    <a
                      href={selectedProject.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center px-3 py-2 bg-foreground text-background rounded-lg hover:bg-foreground-secondary transition-colors text-sm shadow-light hover:shadow-medium"
                    >
                      <FaGithub className="mr-2" />
                      <span className="whitespace-nowrap">GitHub</span>
                    </a>
                  )}
                  
                  {selectedProject.architectureUrl && onArchitectureClick && (
                    <button
                      onClick={onArchitectureClick}
                      className="flex items-center justify-center px-3 py-2 bg-opal-primary text-white rounded-lg hover:bg-opal-primary-hover transition-colors text-sm shadow-light hover:shadow-medium"
                    >
                      <FaSitemap className="mr-2" />
                      <span className="whitespace-nowrap">Architecture</span>
                    </button>
                  )}
                  
                  {selectedProject.demoUrl && (
                    <a
                      href={selectedProject.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center px-3 py-2 bg-opal-accent text-white rounded-lg hover:bg-opal-accent-light transition-colors text-sm shadow-light hover:shadow-medium"
                    >
                      <FaExternalLinkAlt className="mr-2" />
                      <span className="whitespace-nowrap">Live Demo</span>
                    </a>
                  )}
                </div>
                
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 hover:bg-surface-secondary rounded-full transition-colors md:static md:top-auto md:right-auto"
                >
                  <FaTimes className="w-5 h-5 text-foreground-muted" />
                </button>
              </div>
            </div>

            {/* 모달 컨텐츠 */}
            <div className="p-4 sm:p-6">
              {selectedProject.subTitle && (
                <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-surface-secondary border-l-4 border-warning rounded">
                  <p className="text-sm sm:text-base text-foreground font-medium whitespace-pre-line leading-relaxed">
                    {selectedProject.subTitle}
                  </p>
                </div>
              )}

              {/* 프로젝트 이미지들 */}
              <div className="mb-4 sm:mb-6">
                <div className="grid grid-cols-1 gap-3 sm:gap-4">
                  {selectedProject.imagePaths.map((imagePath, imgIndex) => (
                    imagePath ? (
                      <div key={imgIndex} className="relative w-full flex justify-center">
                        <div className="relative max-w-2xl w-full">
                          <Image
                            src={imagePath}
                            alt={`${selectedProject.title} ${imgIndex + 1}`}
                            width={800}
                            height={400}
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 90vw, 800px"
                            className="w-full h-auto max-h-80 sm:max-h-96 object-contain rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
                            onClick={() => onImageClick?.(imagePath)}
                          />
                        </div>
                      </div>
                    ) : (
                      <div key={imgIndex} className="relative w-full flex justify-center">
                        <div className="relative max-w-2xl w-full h-64 sm:h-96 flex items-center justify-center bg-surface-secondary rounded-lg border border-border">
                          <p className="text-sm sm:text-base text-foreground-muted">이미지를 불러올 수 없습니다</p>
                        </div>
                      </div>
                    )
                  ))}
                </div>
              </div>

              {/* 프로젝트 요약 */}
              <div className="mb-4 sm:mb-6">
                <h4 className="text-lg sm:text-xl font-semibold text-foreground mb-3">프로젝트 개요</h4>
                <p className="text-sm sm:text-base text-foreground-secondary leading-relaxed whitespace-pre-line">
                  {selectedProject.summary}
                </p>
              </div>

              {/* 주요 기능 */}
              <div className="mb-4 sm:mb-6">
                <h4 className="text-lg sm:text-xl font-semibold text-foreground mb-3">주요 기능</h4>
                <ul className="space-y-2 sm:space-y-3">
                  {selectedProject.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start text-sm sm:text-base text-foreground-secondary">
                      <span className="w-2 h-2 bg-opal-accent rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 구현 내용 */}
              <div className="mb-4 sm:mb-6">
                <h4 className="text-lg sm:text-xl font-semibold text-foreground mb-3">구현 내용</h4>
                <ul className="space-y-2 sm:space-y-3">
                  {selectedProject.implementations.map((impl, implIndex) => (
                    <li key={implIndex} className="flex items-start text-sm sm:text-base text-foreground-secondary">
                      <span className="w-2 h-2 bg-opal-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="whitespace-pre-line leading-relaxed">{impl}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 기술 스택 */}
              <div className="mb-4 sm:mb-6">
                <h4 className="text-lg sm:text-xl font-semibold text-foreground mb-3">사용 기술</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.techStack.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="px-2 py-1 sm:px-3 sm:py-1 bg-gradient-to-r from-opal-primary to-opal-accent text-white text-xs sm:text-sm rounded-full font-medium shadow-light"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProjectDetailModal;