'use client';

import { portfolioData } from '@/data';
import { Project } from '@/types/portfolio';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { FaExternalLinkAlt, FaGithub, FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useInView } from 'react-intersection-observer';
import AutoLinkText from '@/components/knowledge/AutoLinkText';
import ProjectDetailModal from '@/components/modals/ProjectDetailModal';

const ProjectsSection = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showArchitecture, setShowArchitecture] = useState<boolean>(false);
  const [showImageModal, setShowImageModal] = useState<boolean>(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const teamScrollRef = useRef<HTMLDivElement>(null);
  const personalScrollRef = useRef<HTMLDivElement>(null);

  const teamProjects = portfolioData.projects.filter(project => project.projectType === 'team');
  const personalProjects = portfolioData.projects.filter(project => project.projectType === 'personal');
  const allProjects = useMemo(() => [...teamProjects, ...personalProjects], [teamProjects, personalProjects]);

  const scrollLeft = (scrollRef: React.RefObject<HTMLDivElement | null>) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -400, behavior: 'smooth' });
    }
  };

  const scrollRight = (scrollRef: React.RefObject<HTMLDivElement | null>) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 400, behavior: 'smooth' });
    }
  };

  // 프로젝트 네비게이션 함수들
  const switchToNextProject = useCallback(() => {
    if (!selectedProject) return;
    
    const currentIndex = allProjects.findIndex(p => p.projectId === selectedProject.projectId);
    if (currentIndex < allProjects.length - 1) {
      setSelectedProject(allProjects[currentIndex + 1]);
    }
  }, [selectedProject, allProjects]);

  const switchToPrevProject = useCallback(() => {
    if (!selectedProject) return;
    
    const currentIndex = allProjects.findIndex(p => p.projectId === selectedProject.projectId);
    if (currentIndex > 0) {
      setSelectedProject(allProjects[currentIndex - 1]);
    }
  }, [selectedProject, allProjects]);

  // 키보드 단축키 지원 (프로젝트 모달) - 이미지 모달이 열려있지 않을 때만
  useEffect(() => {
    if (!selectedProject || showImageModal) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;
      
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        switchToPrevProject();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        switchToNextProject();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setSelectedProject(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedProject, showImageModal, switchToPrevProject, switchToNextProject]);

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  const ProjectCard = ({ project }: { project: Project }) => (
    <motion.div
      variants={itemVariants}
      className="bg-surface rounded-xl shadow-medium hover:shadow-heavy transition-all duration-300 overflow-hidden cursor-pointer group h-[520px] md:h-[520px] flex flex-col border border-border no-touch-hover"
      whileHover={{ y: -5 }}
      onClick={() => setSelectedProject(project)}
    >
      {/* 프로젝트 이미지 - 4:3 비율 고정 */}
      <div className="relative w-full h-56 overflow-hidden flex-shrink-0">
        <div className="relative w-full h-full bg-surface-secondary">
          <Image
            src={project.imagePaths[0]}
            alt={project.title}
            fill
            className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

        {/* 기술 스택 - 이미지 위 오버레이 */}
        <div className="absolute bottom-3 md:bottom-4 left-3 md:left-4 flex flex-wrap gap-1.5 md:gap-2 max-w-[80%]">
          {project.techStack.slice(0, 3).map((tech, techIndex) => (
            <span
              key={techIndex}
              className="px-2 py-1 bg-surface/90 backdrop-blur-sm text-foreground text-xs rounded-full font-medium border border-border/50 mobile-text-scale"
            >
                              {tech}
            </span>
          ))}
          {project.techStack.length > 3 && (
            <span className="px-2 py-1 bg-surface/90 backdrop-blur-sm text-foreground text-xs rounded-full border border-border/50">
              +{project.techStack.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* 프로젝트 정보 */}
      <div className="p-4 md:p-3 flex flex-col flex-1">
        {/* 제목 */}
        <h3 className="text-base md:text-lg font-bold text-foreground mb-1 line-clamp-1">
            {project.title}
        </h3>

        {/* 부제목 (수상내역 등) - 고정 높이 */}
        <div className="h-5 mb-1">
          {project.subTitle && (
            <p className="text-xs md:text-sm text-warning font-medium line-clamp-1">
              {project.subTitle}
            </p>
          )}
        </div>

        {/* 기간 */}
        <div className="mb-1">
          <span className="text-xs md:text-sm text-foreground-muted">
            {project.period}
          </span>
        </div>

        {/* 역할 */}
        <div className="mb-2">
          <span className="text-xs md:text-sm text-opal-primary font-semibold bg-opal-primary/10 px-2.5 md:px-3 py-1 rounded-full border border-opal-primary/20">
            {project.role}
          </span>
        </div>

        {/* 요약 - 고정 높이 4줄 */}
        <div className="mb-3 h-20">
          <p className="text-foreground-secondary text-xs md:text-sm leading-4 md:leading-5 line-clamp-4">
            {project.summary}
          </p>
        </div>

        {/* 액션 버튼 */}
        <div className="flex items-center gap-2 pt-4 border-t border-border mt-auto">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center px-2.5 md:px-3 py-2 bg-foreground text-background rounded-lg hover:bg-foreground-secondary transition-colors text-xs md:text-sm touch-target"
            >
              <FaGithub className="mr-1" />
              GitHub
            </a>
          )}
          
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center px-2.5 md:px-3 py-2 bg-opal-accent text-white rounded-lg hover:bg-opal-accent-light transition-colors text-xs md:text-sm touch-target"
            >
              <FaExternalLinkAlt className="mr-1" />
              Demo
            </a>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedProject(project);
            }}
            className="ml-auto flex items-center px-2.5 md:px-3 py-2 bg-opal-primary text-white rounded-lg hover:bg-opal-primary-hover transition-colors text-xs md:text-sm touch-target"
          >
            자세히 보기
          </button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <AutoLinkText>
      <section id="projects" className="py-20 bg-gradient-to-br from-background to-surface-secondary">
      <div className="container mx-auto px-6">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {/* 섹션 제목 */}
          <motion.div
            className="text-center mb-16"
            variants={itemVariants}
          >
                      <h2 className="text-4xl font-bold text-foreground mb-4">
            Projects
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-opal-primary to-opal-accent mx-auto mb-6"></div>
          </motion.div>

          {/* 팀 프로젝트 섹션 */}
          <motion.div
            variants={itemVariants}
            className="mb-20"
          >
            <div className="flex items-center mb-8">
              <span className="text-2xl mr-4">🔷</span>
              <h3 className="text-2xl font-bold text-foreground">Team Projects</h3>
              <div className="ml-4 flex-1 h-px bg-gradient-to-r from-opal-primary/50 to-transparent"></div>
            </div>
            
            {/* 슬라이더 컨테이너 */}
            <div className="relative group">
              {/* 왼쪽 화살표 버튼 */}
              <button
                onClick={() => scrollLeft(teamScrollRef)}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-surface/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-200 border border-border opacity-0 group-hover:opacity-100 hover:bg-surface hover:scale-110"
                aria-label="Previous team projects"
              >
                <FaChevronLeft className="text-foreground text-lg" />
              </button>
              
              {/* 오른쪽 화살표 버튼 */}
              <button
                onClick={() => scrollRight(teamScrollRef)}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-surface/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-200 border border-border opacity-0 group-hover:opacity-100 hover:bg-surface hover:scale-110"
                aria-label="Next team projects"
              >
                <FaChevronRight className="text-foreground text-lg" />
              </button>

              <div 
                ref={teamScrollRef}
                className="flex overflow-x-auto scrollbar-hide space-x-4 md:space-x-6 pb-4 px-8 md:px-12"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {teamProjects.map((project, index) => (
                  <div key={`team-${index}`} className="flex-shrink-0 w-80">
                    <ProjectCard project={project} />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* 개인 프로젝트 섹션 */}
          <motion.div
            variants={itemVariants}
          >
            <div className="flex items-center mb-8">
              <span className="text-2xl mr-4">🔸</span>
              <h3 className="text-2xl font-bold text-foreground">Personal Projects</h3>
              <div className="ml-4 flex-1 h-px bg-gradient-to-r from-opal-accent/50 to-transparent"></div>
            </div>
            
            {/* 슬라이더 컨테이너 */}
            <div className="relative group">
              {/* 왼쪽 화살표 버튼 */}
              <button
                onClick={() => scrollLeft(personalScrollRef)}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-surface/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-200 border border-border opacity-0 group-hover:opacity-100 hover:bg-surface hover:scale-110"
                aria-label="Previous personal projects"
              >
                <FaChevronLeft className="text-foreground text-lg" />
              </button>
              
              {/* 오른쪽 화살표 버튼 */}
              <button
                onClick={() => scrollRight(personalScrollRef)}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-surface/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-200 border border-border opacity-0 group-hover:opacity-100 hover:bg-surface hover:scale-110"
                aria-label="Next personal projects"
              >
                <FaChevronRight className="text-foreground text-lg" />
              </button>

              <div 
                ref={personalScrollRef}
                className="flex overflow-x-auto scrollbar-hide space-x-4 md:space-x-6 pb-4 px-8 md:px-12"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {personalProjects.map((project, index) => (
                  <div key={`personal-${index}`} className="flex-shrink-0 w-80">
                    <ProjectCard project={project} />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* 프로젝트 상세 모달 */}
      <ProjectDetailModal
        selectedProject={selectedProject}
        onClose={() => setSelectedProject(null)}
        onArchitectureClick={() => setShowArchitecture(true)}
        onImageClick={(imagePath) => {
          const imageIndex = selectedProject?.imagePaths.indexOf(imagePath) ?? 0;
          setSelectedImageIndex(imageIndex);
          setShowImageModal(true);
        }}
        isImageModalOpen={showImageModal}
      />

      {/* 아키텍처 이미지 팝업 */}
      <AnimatePresence>
        {showArchitecture && selectedProject?.architectureUrl && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowArchitecture(false)}
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
                onClick={() => setShowArchitecture(false)}
                className="absolute top-4 right-4 z-10 p-3 bg-surface/90 hover:bg-surface rounded-full transition-colors shadow-lg touch-target"
              >
                <FaTimes className="w-5 h-5 text-foreground" />
              </button>
              
              {/* 아키텍처 이미지 */}
              <div className="relative w-full h-full flex items-center justify-center">
                {selectedProject.architectureUrl ? (
                  <Image
                    src={selectedProject.architectureUrl}
                    alt={`${selectedProject.title} Architecture`}
                    width={1200}
                    height={800}
                    sizes="(max-width: 640px) 95vw, (max-width: 1024px) 90vw, 1200px"
                    className="w-full h-full object-contain rounded-lg shadow-2xl"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-surface rounded-lg">
                    <p className="text-foreground-muted">아키텍처 이미지를 불러올 수 없습니다</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
                className="absolute top-4 right-4 z-10 p-4 bg-surface/90 hover:bg-surface rounded-full transition-colors shadow-lg touch-target"
              >
                <FaTimes className="w-5 h-5 text-foreground" />
              </button>

              {/* 이전 이미지 버튼 */}
              {selectedProject.imagePaths.length > 1 && (
                <button
                  onClick={() => setSelectedImageIndex(prev => 
                    prev === 0 ? selectedProject.imagePaths.length - 1 : prev - 1
                  )}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 p-4 bg-surface/90 hover:bg-surface rounded-full transition-colors shadow-lg touch-target"
                >
                  <FaChevronLeft className="w-5 h-5 text-foreground" />
                </button>
              )}

              {/* 다음 이미지 버튼 */}
              {selectedProject.imagePaths.length > 1 && (
                <button
                  onClick={() => setSelectedImageIndex(prev => 
                    prev === selectedProject.imagePaths.length - 1 ? 0 : prev + 1
                  )}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 p-4 bg-surface/90 hover:bg-surface rounded-full transition-colors shadow-lg touch-target"
                >
                  <FaChevronRight className="w-5 h-5 text-foreground" />
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
    </section>
    </AutoLinkText>
  );
};

export default ProjectsSection;