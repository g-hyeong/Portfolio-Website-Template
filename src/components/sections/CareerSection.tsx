'use client';

import { portfolioData } from '@/data';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useInView } from 'react-intersection-observer';
import AutoLinkText from '@/components/knowledge/AutoLinkText';

const CareerSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
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

  return (
    <AutoLinkText>
      <section id="career" className="py-20 bg-surface">
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
            Career
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-opal-primary to-opal-accent mx-auto mb-6"></div>
          </motion.div>

          {/* 경력 카드들 */}
          <div className="max-w-4xl mx-auto">
            {portfolioData.careers.map((career, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="relative mb-6 last:mb-0"
              >
                {/* 타임라인 라인 */}
                {index < portfolioData.careers.length - 1 && (
                  <div className="absolute left-4 md:left-6 top-16 md:top-20 w-0.5 h-full bg-gradient-to-b from-opal-primary to-opal-accent z-0"></div>
                )}
                
                <div className="flex items-start space-x-4 md:space-x-6">
                  {/* 회사 로고 */}
                  <motion.div
                    className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-surface rounded-full shadow-medium flex items-center justify-center z-10 border-4 border-opal-primary/20 no-touch-hover"
                    whileHover={{ scale: 1.1 }}
                  >
                    <div className="w-6 h-6 md:w-8 md:h-8">
                      <Image
                        src={career.logoPath}
                        alt={career.company}
                        width={24}
                        height={24}
                        sizes="(max-width: 768px) 24px, 32px"
                        className="w-full h-full rounded-full object-cover"
                        priority={index < 2}
                      />
                    </div>
                  </motion.div>

                  {/* 경력 정보 카드 */}
                  <motion.div
                    className="flex-1 glass-card-vibrant rounded-xl p-4 md:p-6 no-touch-hover"
                    whileHover={{ 
                      scale: 1.02,
                      y: -5,
                      boxShadow: "0 25px 50px rgba(0,0,0,0.15), 0 10px 30px rgba(139, 127, 184, 0.2)" 
                    }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    {/* 헤더 */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3 md:mb-4">
                      <div>
                        <h3 className="text-xl md:text-2xl font-bold text-foreground mb-1">
                            {career.company}
                        </h3>
                        <p className="text-base md:text-lg text-opal-primary font-semibold">
                            {career.role}
                        </p>
                      </div>
                      <div className="mt-2 md:mt-0">
                        <span className="inline-block px-3 md:px-4 py-1.5 md:py-2 bg-gradient-to-r from-opal-primary/10 to-opal-accent/10 text-opal-primary rounded-full text-xs md:text-sm font-medium border border-opal-primary/20">
                          {career.period}
                        </span>
                      </div>
                    </div>

                    {/* 업무 내용 */}
                    <div className="mb-4 md:mb-6">
                      <h4 className="text-base md:text-lg font-semibold text-foreground-secondary mb-2 md:mb-3">
                        주요 업무
                      </h4>
                      <ul className="space-y-1.5 md:space-y-2">
                        {career.descriptions.map((item, descIndex) => (
                          <motion.li
                            key={descIndex}
                            className="flex items-start text-foreground-secondary text-sm md:text-base"
                            initial={{ opacity: 0, x: -20 }}
                            animate={inView ? { opacity: 1, x: 0 } : {}}
                            transition={{ 
                              duration: 0.5, 
                              delay: descIndex * 0.1 + 0.5 
                            }}
                          >
                            <span className="w-2 h-2 bg-opal-accent rounded-full mt-2 mr-3 flex-shrink-0"></span>
                            <div className="leading-relaxed">
                              <div className="font-medium text-sm md:text-base">
                                                                  {item.title}
                              </div>
                              {item.details && item.details.map((detail, detailIndex) => (
                                <div key={detailIndex} className="text-foreground-muted mt-1 ml-4 text-xs md:text-sm">
                                  • {detail}
                                </div>
                              ))}
                            </div>
                          </motion.li>
                        ))}
                      </ul>
                    </div>

                    {/* 기술 스택 */}
                    <div>
                      <div className="flex flex-wrap gap-2">
                        {career.techStacks.map((tech, techIndex) => (
                          <motion.span
                            key={techIndex}
                            className="px-2.5 md:px-3 py-1 bg-gradient-to-r from-opal-primary to-opal-accent text-white text-xs md:text-sm rounded-full font-medium shadow-light"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={inView ? { opacity: 1, scale: 1 } : {}}
                            transition={{ 
                              duration: 0.3, 
                              delay: techIndex * 0.05 + 0.8 
                            }}
                            whileHover={{ 
                              scale: 1.05,
                              boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
                            }}
                          >
                                                          {tech}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* 활동 섹션 */}
          <motion.div
            id="activities"
            className="mt-12 md:mt-20"
            variants={itemVariants}
          >
            <h3 className="text-4xl font-bold text-foreground text-center mb-12">
              Activity
            </h3>
            
            <div className="space-y-3 max-w-4xl mx-auto">
              {portfolioData.activities.map((activity, index) => (
                <motion.div
                  key={index}
                  className="bg-surface rounded-xl shadow-medium p-6 border border-border"
                  whileHover={{ 
                    scale: 1.02, 
                    boxShadow: "0 15px 30px rgba(0,0,0,0.1)" 
                  }}
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.1 + 1 }}
                >
                  <div className="flex items-center mb-3">
                    <div className="w-15 h-15 mr-5 flex-shrink-0">
                      <Image
                        src={activity.logoPath}
                        alt={activity.title}
                        width={60}
                        height={60}
                        className="w-full h-full rounded-full object-cover"
                        priority={index === 0}
                      />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-foreground">
                                                  {activity.title}
                      </h4>
                      <p className="text-lg text-opal-primary font-medium">
                        {activity.period}
                      </p>
                    </div>
                  </div>
                  
                  <ul className="space-y-2">
                    {activity.descriptions.map((desc, descIndex) => (
                      <li key={descIndex} className="text-base text-foreground-secondary flex items-start">
                        <span className="w-2 h-2 bg-opal-accent rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        {desc}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
    </AutoLinkText>
  );
};

export default CareerSection; 