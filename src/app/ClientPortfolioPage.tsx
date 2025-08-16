'use client';

import AchievementsSection from '@/components/sections/AchievementsSection';
import { Project, Achievement } from '@/core/entities/Portfolio';
import { useState, useEffect } from 'react';
import { LazyMotion, domAnimation, AnimatePresence, motion } from 'framer-motion';
import { container } from '@/infrastructure/di/Container';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

// 동적 import로 모달 컴포넌트들 지연 로딩
const ProjectDetailModal = dynamic(() => import('@/components/modals/ProjectDetailModal'), {
  ssr: false,
  loading: () => null
});

const ArchitectureModal = dynamic(() => import('@/components/modals/ArchitectureModal'), {
  ssr: false,
  loading: () => null
});

interface ClientPortfolioPageProps {
  achievements: Achievement[];
  projects: Project[];
}

export default function ClientPortfolioPage({ achievements, projects }: ClientPortfolioPageProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showArchitecture, setShowArchitecture] = useState<boolean>(false);
  const [showImageModal, setShowImageModal] = useState<boolean>(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);

  const handleArchitectureClick = () => {
    setShowArchitecture(true);
  };

  const handleImageClick = (imagePath: string) => {
    if (selectedProject) {
      const imageIndex = selectedProject.imagePaths.indexOf(imagePath);
      setSelectedImageIndex(imageIndex);
      setShowImageModal(true);
    }
  };


  // 키보드 단축키 지원 (이미지 모달)
  useEffect(() => {
    if (!showImageModal) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;
      
      if (e.key === 'Escape') {
        e.preventDefault();
        setShowImageModal(false);
      } else if (e.key === 'ArrowLeft' && selectedProject) {
        e.preventDefault();
        setSelectedImageIndex(prev => 
          prev === 0 ? selectedProject.imagePaths.length - 1 : prev - 1
        );
      } else if (e.key === 'ArrowRight' && selectedProject) {
        e.preventDefault();
        setSelectedImageIndex(prev => 
          prev === selectedProject.imagePaths.length - 1 ? 0 : prev + 1
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showImageModal, selectedProject]);

  return (
    <LazyMotion features={domAnimation}>
      <AchievementsSection 
        achievements={achievements} 
        projects={projects}
        onProjectSelect={setSelectedProject}
      />

      {/* 모달 컴포넌트들 */}
      <ProjectDetailModal
        selectedProject={selectedProject}
        onClose={() => setSelectedProject(null)}
        getProjectNotePost={(projectId: string) => {
          const noteService = container.getNoteService();
          return noteService.getProjectNotePostMapping(projectId);
        }}
        onArchitectureClick={handleArchitectureClick}
        onImageClick={handleImageClick}
        isImageModalOpen={showImageModal}
      />

      <ArchitectureModal
        isOpen={showArchitecture}
        onClose={() => setShowArchitecture(false)}
        architectureUrl={selectedProject?.architectureUrl || ''}
        title={selectedProject?.title || ''}
      />

      {/* 이미지 갤러리 모달 */}
      <AnimatePresence>
        {showImageModal && selectedProject && selectedProject.imagePaths[selectedImageIndex] && (
          <motion.div
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowImageModal(false)}
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
                onClick={() => setShowImageModal(false)}
                className="absolute top-4 right-4 z-10 p-3 bg-surface/90 hover:bg-surface rounded-full transition-colors shadow-lg"
              >
                <FaTimes className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
              </button>

              {/* 이전 이미지 버튼 */}
              {selectedProject.imagePaths.length > 1 && (
                <button
                  onClick={() => setSelectedImageIndex(prev => 
                    prev === 0 ? selectedProject.imagePaths.length - 1 : prev - 1
                  )}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-surface/90 hover:bg-surface rounded-full transition-colors shadow-lg"
                >
                  <FaChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
                </button>
              )}

              {/* 다음 이미지 버튼 */}
              {selectedProject.imagePaths.length > 1 && (
                <button
                  onClick={() => setSelectedImageIndex(prev => 
                    prev === selectedProject.imagePaths.length - 1 ? 0 : prev + 1
                  )}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-surface/90 hover:bg-surface rounded-full transition-colors shadow-lg"
                >
                  <FaChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
                </button>
              )}
              
              {/* 현재 선택된 이미지 */}
              <div className="relative w-full h-full flex items-center justify-center">
                {selectedProject.imagePaths[selectedImageIndex] ? (
                  <Image
                    src={selectedProject.imagePaths[selectedImageIndex]}
                    alt={`${selectedProject.title} ${selectedImageIndex + 1}`}
                    width={1200}
                    height={800}
                    sizes="(max-width: 640px) 95vw, (max-width: 1024px) 90vw, 1200px"
                    className="w-full h-full object-contain rounded-lg shadow-2xl"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-surface rounded-lg">
                    <p className="text-foreground-muted">이미지를 불러올 수 없습니다</p>
                  </div>
                )}
              </div>

              {/* 이미지 인디케이터 */}
              {selectedProject.imagePaths.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center space-x-2 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full">
                  <span className="text-white text-sm font-medium">
                    {selectedImageIndex + 1} / {selectedProject.imagePaths.length}
                  </span>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </LazyMotion>
  );
}