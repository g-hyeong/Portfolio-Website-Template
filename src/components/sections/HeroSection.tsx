'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import { heroData } from '@/data/hero';

const HeroSection = () => {

  return (
    <>
      <section id="about" className="min-h-screen bg-gradient-to-br from-opal-primary/20 via-opal-primary/25 to-opal-primary/15 relative overflow-hidden">
      {/* 배경 애니메이션 요소들 */}
      <div className="absolute inset-0 overflow-hidden mobile-hide-bg-animation">
        {heroData.backgroundElements.map((element, i) => (
          <motion.div
            key={i}
            className="absolute bg-opal-primary/10 rounded-full"
            style={{
              width: element.width,
              height: element.height,
              top: element.top + '%',
              left: element.left + '%',
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, 20, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* 메인 컨텐츠 */}
      <div className="min-h-screen flex items-center justify-center relative z-10">
        <div className="container mx-auto px-7 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-14 items-center">
              {/* 왼쪽: 텍스트 컨텐츠 */}
              <motion.div
                className="text-center lg:text-left space-y-6 md:space-y-9"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                {/* 메인 타이틀 */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <h1 className="text-xl md:text-2xl lg:text-2xl font-bold text-foreground mb-4 md:mb-5 leading-tight">
                    {heroData.title}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-opal-primary to-opal-accent"> {heroData.name}</span>.
                  </h1>
                </motion.div>

                {/* 전문 분야 */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  <ul className="space-y-2 md:space-y-3 text-sm md:text-base text-foreground-secondary">
                    {heroData.highlights.map((highlight, index) => (
                      <li key={index} className="flex items-start justify-center lg:justify-start">
                        <span className="w-2.5 h-2.5 bg-opal-accent rounded-full mt-2 mr-3.5 flex-shrink-0"></span>
                        <span className="text-center lg:text-left">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>

                {/* 관심 분야
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  <h3 className="text-xl font-semibold text-gray-800 mb-3.5 flex items-center justify-center lg:justify-start">
                    <span className="mr-2.5 text-xl">💫</span>
                    관심 분야
                  </h3>
                  <div className="flex flex-wrap gap-3.5 justify-center lg:justify-start">
                    {[
                      'Data Engineering',
                      'LLM Engineering',
                      'System Architecture',
                      'Backend Engineering',
                    ].map((interest, index) => (
                      <motion.span
                        key={index}
                        className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-sm font-medium shadow-md"
                        whileHover={{ scale: 1.05 }}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.1 + 0.8 }}
                      >
                        {interest}
                      </motion.span>
                    ))}
                  </div>
                </motion.div> */}

                {/* 소셜 링크 & CTA */}
                <motion.div
                  className="space-y-7"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1.0 }}
                >
                  {/* 소셜 링크 */}
                  <div className="flex justify-center lg:justify-start space-x-4 md:space-x-7">
                    {heroData.socialLinks.github && (
                      <motion.a
                        href={heroData.socialLinks.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-4 bg-surface rounded-full shadow-medium hover:shadow-heavy transition-all duration-300 border border-border touch-target no-touch-hover"
                        whileHover={{ scale: 1.1, y: -5 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FaGithub className="w-5 h-5 md:w-6 md:h-6 text-foreground" />
                      </motion.a>
                    )}
                    
                    {heroData.socialLinks.linkedin && (
                      <motion.a
                        href={heroData.socialLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-4 bg-surface rounded-full shadow-medium hover:shadow-heavy transition-all duration-300 border border-border touch-target no-touch-hover"
                        whileHover={{ scale: 1.1, y: -5 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FaLinkedin className="w-5 h-5 md:w-6 md:h-6 text-foreground" />
                      </motion.a>
                    )}
                    
                    {heroData.socialLinks.email && (
                      <motion.a
                        href={heroData.socialLinks.email}
                        className="p-4 bg-surface rounded-full shadow-medium hover:shadow-heavy transition-all duration-300 border border-border touch-target no-touch-hover"
                        whileHover={{ scale: 1.1, y: -5 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FaEnvelope className="w-5 h-5 md:w-6 md:h-6 text-foreground" />
                      </motion.a>
                    )}

                    {/* <motion.a
                      href="https://www.linkedin.com/in/g-hyeong/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3.5 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                      whileHover={{ scale: 1.1, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaLinkedin className="w-6 h-6 text-blue-600" />
                    </motion.a> */}
                    
                    {/* <motion.a
                      href="mailto:rjsgud538@gmail.com"
                      className="p-3.5 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                      whileHover={{ scale: 1.1, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaEnvelope className="w-6 h-6 text-red-500" />
                    </motion.a> */}
                  </div>

                  {/* CTA 버튼 */}
                  <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-3 sm:space-y-0 sm:space-x-4">
                    <motion.button
                      onClick={() => document.getElementById(heroData.cta.primaryAction)?.scrollIntoView({ behavior: 'smooth' })}
                      className="px-8 py-4 md:px-9 md:py-3.5 bg-gradient-to-r from-opal-primary to-opal-accent text-white font-semibold rounded-full shadow-medium hover:shadow-heavy transition-all duration-300 touch-target no-touch-hover text-sm md:text-base"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {heroData.cta.primaryText}
                    </motion.button>
                    
                    {/* <motion.button
                      onClick={() => window.open('/chatgpt-analysis', '_blank')}
                      className="px-9 py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      ChatGPT가 설명한 나
                    </motion.button> */}
                  </div>
                </motion.div>
              </motion.div>

              {/* 오른쪽: 프로필 이미지 & 특성 카드 */}
              <motion.div
                className="flex flex-col items-center space-y-6 md:space-y-9"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                {/* 프로필 이미지 */}
                <motion.div
                  className="relative"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-72 h-72 md:w-88 md:h-88 rounded-full bg-gradient-to-br from-opal-primary to-opal-accent p-2">
                    <div className="w-full h-full rounded-full overflow-hidden bg-surface flex items-center justify-center border border-border">
                      <Image
                        src={heroData.profileImage.src}
                        alt={heroData.profileImage.alt}
                        width={280}
                        height={280}
                        sizes="(max-width: 768px) 280px, 330px"
                        className="rounded-full object-cover"
                        priority
                      />
                    </div>
                  </div>
                  
                  {/* 플로팅 기술 태그들 - 모바일에서는 하단으로 이동 */}
                  {/* 플로팅 기술 태그들 - 동적 생성 */}
                  {heroData.interests.map((interest, index) => {
                    const positions = [
                      { className: "absolute -top-5 -right-5", animate: { y: [0, -10, 0] }, colorClass: "text-opal-primary" },
                      { className: "absolute -bottom-5 -left-5", animate: { y: [0, 10, 0] }, colorClass: "text-opal-accent" },
                      { className: "absolute top-1/2 -left-9", animate: { x: [0, -10, 0] }, colorClass: "text-success" },
                      { className: "absolute top-1/2 -right-9", animate: { x: [0, 10, 0] }, colorClass: "text-warning" }
                    ];
                    const position = positions[index % positions.length];
                    
                    return (
                      <motion.div
                        key={interest}
                        className={`${position.className} bg-surface px-3.5 py-1.5 rounded-full shadow-medium text-sm font-semibold ${position.colorClass} border border-border mobile-floating-adjust`}
                        animate={position.animate}
                        transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                      >
                        {interest}
                      </motion.div>
                    );
                  })}
                </motion.div>

                {/* 모바일에서 플로팅 태그들을 여기에 표시 */}
                <div className="md:hidden flex flex-wrap justify-center gap-2">
                  {heroData.interests.map((interest, index) => {
                    const colorClasses = ["text-opal-primary", "text-opal-accent", "text-success", "text-warning"];
                    const colorClass = colorClasses[index % colorClasses.length];
                    
                    return (
                      <span key={interest} className={`bg-surface px-3 py-1.5 rounded-full shadow-medium text-xs font-semibold ${colorClass} border border-border`}>
                        {interest}
                      </span>
                    );
                  })}
                </div>
                
                {/* 특성 카드들 */}
                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4 w-full max-w-md"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1.2 }}
                >
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* 스크롤 인디케이터 */}
      <motion.div
        className="absolute bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-5 h-8 md:w-6 md:h-10 border-2 border-foreground-muted rounded-full flex justify-center">
          <div className="w-1 h-2 md:h-3 bg-foreground-muted rounded-full mt-1.5 md:mt-2"></div>
        </div>
      </motion.div>
    </section>
    </>
  );
};

export default HeroSection; 