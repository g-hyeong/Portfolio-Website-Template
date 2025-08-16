'use client';

import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, useMotionValueEvent, useScroll } from 'framer-motion';
// Knowledge Graph 기능은 필요시 import
import { FiExternalLink, FiMenu, FiX } from 'react-icons/fi';

// 스크롤 관련 유틸리티 함수들
const scrollUtils = {
  // 헤더 높이를 동적으로 계산
  getHeaderHeight: (headerRef: React.RefObject<HTMLElement | null>) => {
    return headerRef.current?.offsetHeight || 0;
  },

  // 섹션의 절대 위치 계산
  getSectionPosition: (sectionId: string, headerHeight: number) => {
    const element = document.getElementById(sectionId);
    if (!element) return 0;
    return element.getBoundingClientRect().top + window.scrollY - headerHeight;
  },

  // 현재 스크롤 위치에서 활성 섹션 감지
  getActiveSection: (sectionIds: string[], headerHeight: number) => {
    const lastSectionId = sectionIds[sectionIds.length - 1];
    const otherSections = sectionIds.slice(0, -1); // 마지막 섹션 제외
    
    // 완전 끝인지 확인 (마지막 섹션 특별 처리)
    const isAtBottom = Math.ceil(window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight;
    if (isAtBottom) {
      return lastSectionId; // 완전 끝에서만 마지막 섹션
    }

    // 마지막 섹션이 아닌 다른 섹션들에서 찾기
    const scrollPosition = window.scrollY + headerHeight + 50; // 50px 여유값
    
    for (let i = otherSections.length - 1; i >= 0; i--) {
      const element = document.getElementById(otherSections[i]);
      if (element) {
        const sectionTop = element.offsetTop;
        if (scrollPosition >= sectionTop) {
          return otherSections[i];
        }
      }
    }
    
    return sectionIds[0]; // 기본값은 첫 번째 섹션
  },

  // 부드러운 스크롤 실행
  smoothScrollToSection: (sectionId: string, headerHeight: number, sectionIds: string[]) => {
    const lastSectionId = sectionIds[sectionIds.length - 1];
    
    // 마지막 섹션인 경우 페이지 최하단으로 스크롤
    if (sectionId === lastSectionId) {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth'
      });
    } else {
      // 다른 섹션들은 해당 섹션의 상단으로 스크롤
      const targetPosition = scrollUtils.getSectionPosition(sectionId, headerHeight);
      window.scrollTo({
        top: Math.max(0, targetPosition),
        behavior: 'smooth'
      });
    }
  }
};

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('about');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const headerRef = useRef<HTMLElement | null>(null);
  const router = useRouter();
  // Knowledge Graph 기능은 필요시 추가
  const { scrollY } = useScroll();

  const sectionIds = useMemo(() => ['about', 'career', 'activities', 'projects', 'achievements', 'skills'], []);

  // Framer Motion 기반 스크롤 감지
  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
    
    const headerHeight = scrollUtils.getHeaderHeight(headerRef);
    const newActiveSection = scrollUtils.getActiveSection(sectionIds, headerHeight);
    setActiveSection(newActiveSection);
  });

  // 초기 활성 섹션 설정
  useEffect(() => {
    const headerHeight = scrollUtils.getHeaderHeight(headerRef);
    const newActiveSection = scrollUtils.getActiveSection(sectionIds, headerHeight);
    setActiveSection(newActiveSection);
  }, [sectionIds]);


  // 섹션 데이터를 단일 소스에서 관리
  const navItems = sectionIds.map(id => ({
    id,
    label: id.charAt(0).toUpperCase() + id.slice(1)
  }));

  const scrollToSection = useCallback((sectionId: string) => {
    const headerHeight = scrollUtils.getHeaderHeight(headerRef);
    scrollUtils.smoothScrollToSection(sectionId, headerHeight, sectionIds);
    setActiveSection(sectionId);
    setIsMobileMenuOpen(false); // 모바일 메뉴 닫기
  }, [sectionIds]);

  // 애니메이션 variants
  const headerVariants = {
    visible: {
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 200,
        when: "beforeChildren",
        staggerChildren: 0.05
      }
    },
    hidden: {
      y: -100,
      transition: {
        when: "afterChildren",
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    }
  };

  const itemVariants = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 400
      }
    },
    hidden: {
      opacity: 0,
      y: -20
    }
  };

  const mobileMenuVariants = {
    open: {
      opacity: 1,
      backdropFilter: "blur(20px) saturate(180%)",
      transition: {
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94],
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    },
    closed: {
      opacity: 0,
      backdropFilter: "blur(0px) saturate(100%)",
      transition: {
        duration: 0.2,
        ease: [0.25, 0.46, 0.45, 0.94],
        when: "afterChildren",
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    }
  };

  const mobileItemVariants = {
    open: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 400
      }
    },
    closed: {
      opacity: 0,
      y: 50
    }
  };

  return (
    <>
      <motion.header
        ref={headerRef}
        initial="hidden"
        animate="visible"
        variants={headerVariants}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
          isScrolled 
            ? 'bg-background/85 backdrop-blur-xl backdrop-saturate-180 border-b border-border shadow-sm dark:shadow-lg' 
            : 'bg-transparent'
        }`}
      >
        <nav className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            {/* 로고 */}
            <motion.div
              variants={itemVariants}
              className="text-xl font-black bg-gradient-to-r from-foreground to-opal-primary bg-clip-text text-transparent cursor-pointer select-none tracking-tighter"
              onClick={() => scrollToSection('about')}
              whileHover={{ 
                scale: 1.05,
                filter: "brightness(1.1)"
              }}
              whileTap={{ scale: 0.95 }}
              style={{
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
              }}
            >
              Name
            </motion.div>

            {/* 데스크톱 네비게이션 */}
            <motion.div 
              variants={itemVariants}
              className="hidden md:flex items-center relative"
            >
              <div className="flex items-center space-x-1 rounded-full px-3 py-2 shadow-lg glass-card-vibrant">
                {navItems.map((item) => (
                  <motion.button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    onHoverStart={() => setHoveredItem(item.id)}
                    onHoverEnd={() => setHoveredItem(null)}
                    className="relative px-4 py-2 text-sm font-medium text-foreground-secondary rounded-full transition-all duration-300 z-10"
                    whileHover={{ 
                      scale: 1.02,
                      y: -1
                    }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
                      letterSpacing: '-0.01em'
                    }}
                  >
                    {/* 활성 상태 배경 */}
                    {activeSection === item.id && (
                      <motion.div
                        layoutId="activeBackground"
                        className="absolute inset-0 rounded-full border border-border shadow-lg bg-opal-primary/20"
                        style={{
                          background: 'linear-gradient(135deg, var(--opal-primary) 0%, var(--opal-accent) 100%)',
                          opacity: 0.15,
                          boxShadow: '0 2px 8px var(--shadow-light), 0 1px 3px var(--shadow-medium), inset 0 1px 0 rgba(255,255,255,0.1)'
                        }}
                        transition={{
                          type: "spring",
                          damping: 25,
                          stiffness: 400
                        }}
                      />
                    )}
                    
                    {/* 호버 상태 배경 */}
                    {hoveredItem === item.id && activeSection !== item.id && (
                      <motion.div
                        className="absolute inset-0 rounded-full bg-opal-primary/10"
                        style={{
                          background: 'linear-gradient(135deg, var(--opal-primary) 0%, var(--opal-accent) 100%)',
                          opacity: 0.08,
                          boxShadow: '0 1px 4px var(--shadow-light), inset 0 1px 0 rgba(255,255,255,0.05)'
                        }}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{
                          duration: 0.2,
                          ease: [0.25, 0.46, 0.45, 0.94]
                        }}
                      />
                    )}
                    
                    <span className={`relative z-10 transition-colors duration-200 ${
                      activeSection === item.id ? 'text-foreground font-semibold' : 'text-foreground-secondary'
                    }`}>
                      {item.label}
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Notes 버튼 */}
            <motion.button
              variants={itemVariants}
              onClick={() => router.push('/notes')}
              className="hidden md:flex items-center space-x-1.5 px-4 py-2 text-sm font-medium text-foreground-secondary glass-card rounded-full hover:glass-card-vibrant transition-all duration-300"
              style={{ 
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
                letterSpacing: '-0.01em'
              }}
              whileHover={{ 
                scale: 1.02, 
                y: -1,
                boxShadow: "0 4px 12px var(--shadow-light), 0 2px 4px var(--shadow-medium)"
              }}
              whileTap={{ scale: 0.98 }}
            >
              <span>Notes</span>
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.2 }}
              >
                <FiExternalLink className="w-3.5 h-3.5" />
              </motion.div>
            </motion.button>

            {/* 모바일 메뉴 버튼 */}
            <motion.div 
              variants={itemVariants}
              className="md:hidden"
            >
              <motion.button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-full text-foreground-secondary hover:text-foreground glass-card hover:glass-card-vibrant transition-all duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <AnimatePresence mode="wait">
                  {isMobileMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <FiX className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <FiMenu className="w-5 h-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </motion.div>
          </div>
        </nav>
      </motion.header>

      {/* 모바일 풀스크린 메뉴 */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={mobileMenuVariants}
            className="fixed inset-0 z-40 bg-background/90 backdrop-blur-xl backdrop-saturate-180"
          >
            <div className="flex flex-col items-center justify-center h-full space-y-8 px-6">
              {navItems.map((item) => (
                <motion.button
                  key={item.id}
                  variants={mobileItemVariants}
                  onClick={() => scrollToSection(item.id)}
                  className={`text-3xl font-medium transition-colors duration-300 ${
                    activeSection === item.id
                      ? 'text-foreground'
                      : 'text-foreground-secondary'
                  }`}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
                    letterSpacing: '-0.02em'
                  }}
                >
                  {item.label}
                  {activeSection === item.id && (
                    <motion.div
                      className="w-8 h-1.5 rounded-full mx-auto mt-3"
                      style={{
                        background: 'linear-gradient(90deg, var(--opal-primary) 0%, var(--opal-accent) 50%, var(--opal-primary) 100%)'
                      }}
                      initial={{ scaleX: 0, opacity: 0 }}
                      animate={{ scaleX: 1, opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                    />
                  )}
                </motion.button>
              ))}
              
              <motion.div
                variants={mobileItemVariants}
                className="pt-8"
              >
                <motion.button
                  onClick={() => {
                    router.push('/notes');
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 px-6 py-3 text-lg font-medium text-foreground-secondary glass-card-vibrant rounded-full"
                  style={{ 
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
                    letterSpacing: '-0.01em'
                  }}
                  whileHover={{ 
                    scale: 1.02, 
                    y: -1,
                    boxShadow: "0 4px 12px var(--shadow-light), 0 2px 4px var(--shadow-medium)"
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>Notes</span>
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FiExternalLink className="w-5 h-5" />
                  </motion.div>
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header; 