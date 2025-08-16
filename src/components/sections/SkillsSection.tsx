'use client';

import { portfolioData } from '@/data';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import AutoLinkText from '@/components/knowledge/AutoLinkText';

const SkillsSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

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

  const skillVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
      },
    },
  };

  return (
    <AutoLinkText>
      <section id="skills" className="py-12 bg-surface">
      <div className="container mx-auto px-6">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {/* 섹션 제목 */}
          <motion.div
            className="text-center mb-10"
            variants={itemVariants}
          >
                      <h2 className="text-4xl font-bold text-foreground mb-4">
            Skills
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-opal-primary to-opal-accent mx-auto mb-6"></div>
          </motion.div>

          {/* 기술 스택 그리드 */}
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {Object.entries(portfolioData.techStacks).map(([category, skills], categoryIndex) => (
                <motion.div
                  key={category}
                  variants={itemVariants}
                  className="mb-2"
                >
                  <div className="glass-card-vibrant rounded-xl p-4 h-full transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:-translate-y-1">
                    {/* 카테고리 제목 */}
                    <motion.h3
                      className="text-xl font-bold text-foreground mb-4 text-center relative z-20"
                      initial={{ opacity: 0, y: 20 }}
                      animate={inView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
                    >
                      {category}
                    </motion.h3>

                    <div className="space-y-3">
                    {/* Familiar 기술들 */}
                    {skills.familiar.length > 0 && (
                      <div>
                        <motion.h4
                          className="text-sm font-semibold text-opal-primary mb-2 flex items-center"
                          initial={{ opacity: 0, x: -20 }}
                          animate={inView ? { opacity: 1, x: 0 } : {}}
                          transition={{ duration: 0.5, delay: categoryIndex * 0.1 + 0.2 }}
                        >
                          <div className="w-2 h-2 bg-opal-primary rounded-full mr-2"></div>
                          Familiar
                        </motion.h4>
                        <div className="flex flex-wrap gap-1">
                          {skills.familiar.map((skill, skillIndex) => (
                            <motion.span
                              key={skillIndex}
                              variants={skillVariants}
                              initial="hidden"
                              animate={inView ? "visible" : "hidden"}
                              transition={{ 
                                duration: 0.4, 
                                delay: categoryIndex * 0.1 + skillIndex * 0.05 + 0.3 
                              }}
                              className="px-2 py-0.5 bg-opal-primary text-white rounded-full text-xs font-medium shadow-medium cursor-default border border-opal-primary-hover"
                              whileHover={{ 
                                scale: 1.05,
                                boxShadow: "0 8px 25px rgba(59, 130, 246, 0.4)"
                              }}
                            >
                                                              {skill}
                            </motion.span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Experienced 기술들 */}
                    {skills.experienced.length > 0 && (
                      <div>
                        <motion.h4
                          className="text-sm font-semibold text-opal-accent mb-2 flex items-center"
                          initial={{ opacity: 0, x: -20 }}
                          animate={inView ? { opacity: 1, x: 0 } : {}}
                          transition={{ duration: 0.5, delay: categoryIndex * 0.1 + 0.4 }}
                        >
                          <div className="w-2 h-2 bg-opal-accent rounded-full mr-2"></div>
                          Experienced
                        </motion.h4>
                        <div className="flex flex-wrap gap-1">
                          {skills.experienced.map((skill, skillIndex) => (
                            <motion.span
                              key={skillIndex}
                              variants={skillVariants}
                              initial="hidden"
                              animate={inView ? "visible" : "hidden"}
                              transition={{ 
                                duration: 0.4, 
                                delay: categoryIndex * 0.1 + skillIndex * 0.05 + 0.5 
                              }}
                              className="px-2 py-0.5 bg-opal-accent text-white rounded-full text-xs font-medium shadow-medium cursor-default border border-opal-accent-light"
                              whileHover={{ 
                                scale: 1.05,
                                boxShadow: "0 8px 25px rgba(147, 51, 234, 0.4)"
                              }}
                            >
                                                              {skill}
                            </motion.span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 빈 카테고리인 경우 */}
                    {skills.familiar.length === 0 && skills.experienced.length === 0 && (
                      <div className="text-center py-8">
                        <p className="text-foreground-muted italic">업데이트 예정</p>
                      </div>
                    )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
    </AutoLinkText>
  );
};

export default SkillsSection; 