'use client';

import React from 'react';
import { motion, PanInfo } from 'framer-motion';
import { FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { NoteTab } from '@/contexts/KnowledgeGraphContext';
import { NotePost } from '@/types/portfolio';
import { notes } from '@/data/notes';
import NoteModal from '@/components/shared/NoteModal';

interface TabStackModalProps {
  tabs: NoteTab[];
  activeTabId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onTabClose: (tabId: string) => void;
  onTabSwitch: (tabId: string) => void;
  onNoteClick?: (note: NotePost) => void;
  mousePosition?: { x: number; y: number } | null;
}

// 개별 탭 컴포넌트 - 프로젝트 디자인 시스템에 맞춘 div 구조
function TabButton({ tab, isActive, onSelect, onClose }: {
  tab: NoteTab;
  isActive: boolean;
  onSelect: () => void;
  onClose: (e: React.MouseEvent) => void;
}) {
  return (
    <motion.div
      className={`group relative flex-shrink-0 px-3 py-2 rounded-full transition-all duration-200 ease-out min-w-0 cursor-pointer ${
        !isActive ? 'hover:bg-opal-primary/8' : ''
      }`}
      whileTap={{ scale: 0.97 }}
    >
      {/* 활성 탭 인디케이터 - 세련된 대비 */}
      {isActive && (
        <motion.div
          layoutId="active-tab-indicator"
          className="absolute inset-0 rounded-full tab-active-indicator"
          transition={{ type: 'spring', stiffness: 500, damping: 35 }}
        />
      )}
      
      <div className="relative z-10 flex items-center min-w-0">
        {/* Tab Color Indicator */}
        <span
          className="w-2 h-2 rounded-full mr-2 flex-shrink-0"
          style={{ backgroundColor: tab.note.color || 'var(--opal-primary)' }}
        />
        
        {/* Tab Title - 클릭 가능한 영역 */}
        <span 
          onClick={onSelect}
          className={`text-sm font-bold truncate max-w-[100px] cursor-pointer ${
            isActive ? 'text-foreground' : 'text-foreground-secondary'
          }`}
        >
          {tab.note.title}
        </span>
        
        {/* Close Button - 별도 버튼 */}
        <button
          onClick={onClose}
          className={`ml-2 p-1 rounded-full transition-all duration-200 ${
            isActive 
              ? 'opacity-60 hover:opacity-100 hover:bg-opal-primary/10' 
              : 'opacity-0 group-hover:opacity-60 hover:!opacity-100 hover:bg-opal-primary/10'
          }`}
        >
          <FiX className="w-3 h-3 text-foreground-secondary" />
        </button>
      </div>
    </motion.div>
  );
}

export default function TabStackModal({ 
  tabs, 
  activeTabId, 
  isOpen, 
  onClose, 
  onTabClose, 
  onTabSwitch,
  onNoteClick,
  mousePosition
}: TabStackModalProps) {
  const [scrollPosition, setScrollPosition] = React.useState(0);
  const [isMobile, setIsMobile] = React.useState(false);
  const tabContainerRef = React.useRef<HTMLDivElement>(null);
  
  const activeTab = tabs.find(tab => tab.id === activeTabId);
  const activeIndex = activeTab ? tabs.findIndex(tab => tab.id === activeTabId) : -1;

  // 탭 네비게이션 함수들
  const switchToNextTab = React.useCallback(() => {
    if (activeIndex < tabs.length - 1) {
      onTabSwitch(tabs[activeIndex + 1].id);
    }
  }, [activeIndex, tabs, onTabSwitch]);

  const switchToPrevTab = React.useCallback(() => {
    if (activeIndex > 0) {
      onTabSwitch(tabs[activeIndex - 1].id);
    }
  }, [activeIndex, tabs, onTabSwitch]);

  // 스크롤 네비게이션
  const scrollTabs = (direction: 'left' | 'right') => {
    if (tabContainerRef.current) {
      const scrollAmount = 120;
      const newPosition = direction === 'left' 
        ? Math.max(0, scrollPosition - scrollAmount)
        : scrollPosition + scrollAmount;
      
      tabContainerRef.current.scrollTo({ left: newPosition, behavior: 'smooth' });
      setScrollPosition(newPosition);
    }
  };

  // 모바일 감지
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 키보드 단축키 지원 - Hook 순서를 보장하기 위해 조건부 return 전에 배치
  React.useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;
      
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        switchToPrevTab();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        switchToNextTab();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, switchToPrevTab, switchToNextTab, onClose]);

  // 스와이프 제스처 핸들링
  const handlePanEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 100;
    if (Math.abs(info.offset.x) > threshold) {
      if (info.offset.x > 0 && activeIndex > 0) {
        switchToPrevTab();
      } else if (info.offset.x < 0 && activeIndex < tabs.length - 1) {
        switchToNextTab();
      }
    }
  };

  if (!isOpen || !activeTab) return null;

  const shouldShowTabs = tabs.length > 1;

  return (
    <>
      {/* 프로젝트 디자인 시스템에 맞춘 탭 바 */}
      {shouldShowTabs && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-[60] w-full max-w-5xl px-4">
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="tab-container px-2 py-2 flex items-center justify-between"
          >
            {/* 왼쪽 화살표 */}
            <button
              onClick={() => {
                switchToPrevTab();
                scrollTabs('left');
              }}
              disabled={activeIndex === 0}
              className="p-2 rounded-full hover:bg-opal-primary/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
              title="이전 탭"
            >
              <FiChevronLeft className="w-4 h-4 text-foreground-secondary" />
            </button>

            {/* 탭 컨테이너 */}
            <div className="flex-1 overflow-hidden mx-2">
              <div 
                ref={tabContainerRef}
                className="flex items-center space-x-1 overflow-x-auto scrollbar-hide scroll-smooth"
                onScroll={(e) => setScrollPosition(e.currentTarget.scrollLeft)}
              >
                {tabs.map((tab) => (
                  <TabButton
                    key={tab.id}
                    tab={tab}
                    isActive={tab.id === activeTabId}
                    onSelect={() => onTabSwitch(tab.id)}
                    onClose={(e) => {
                      e.stopPropagation();
                      onTabClose(tab.id);
                    }}
                  />
                ))}
              </div>
            </div>

            {/* 오른쪽 화살표 */}
            <button
              onClick={() => {
                switchToNextTab();
                scrollTabs('right');
              }}
              disabled={activeIndex === tabs.length - 1}
              className="p-2 rounded-full hover:bg-opal-primary/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
              title="다음 탭"
            >
              <FiChevronRight className="w-4 h-4 text-foreground-secondary" />
            </button>

            {/* 구분선 */}
            <div className="w-px h-6 bg-border mx-2 flex-shrink-0" />
            
            {/* 전체 닫기 버튼 */}
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-opal-primary/10 transition-colors flex-shrink-0"
              title="모든 탭 닫기"
            >
              <FiX className="w-4 h-4 text-foreground-muted" />
            </button>
          </motion.div>
        </div>
      )}

      {/* Note Modal with swipe gesture - 브라우저 스타일 탭 전환 */}
      <motion.div
        drag={shouldShowTabs && !isMobile ? "x" : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.1}
        onPanEnd={handlePanEnd}
      >
        <NoteModal 
          post={activeTab.note} 
          isOpen={isOpen} 
          onClose={onClose} 
          variant="large" 
          mousePosition={mousePosition}
          allNotes={notes}
          onNoteClick={onNoteClick}
          key="persistent-note-modal"
        />
      </motion.div>
    </>
  );
}