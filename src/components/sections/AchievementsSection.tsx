'use client';

import { Achievement, Project } from '@/types/portfolio';
import { motion } from 'framer-motion';
import AutoLinkText from '@/components/knowledge/AutoLinkText';

interface AchievementsSectionProps {
  achievements: Achievement[];
  projects: Project[];
  onProjectSelect: (project: Project) => void;
}

export default function AchievementsSection({ achievements, projects, onProjectSelect }: AchievementsSectionProps) {
  const handleProjectClick = (relatedProjectId: string) => {
    const project = projects.find(p => p.projectId === relatedProjectId);
    if (project) {
      onProjectSelect(project);
    }
  };

  return (
    <AutoLinkText>
      <section id="achievements" className="py-20 bg-surface">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Achievements
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-opal-primary to-opal-accent mx-auto mb-6"></div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="glass-card-vibrant rounded-lg overflow-hidden"
        >
          {/* 데스크톱 테이블 뷰 */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-opal-primary to-opal-accent text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                    성과
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                    기관
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                    날짜
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                    프로젝트
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {achievements.map((achievement, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="hover:bg-surface-secondary transition-colors duration-200"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div>
                          <div className="font-semibold text-foreground mb-1">
                            {achievement.title}
                          </div>
                          <div className="text-sm text-foreground-secondary">
                            {achievement.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-foreground-secondary font-medium">
                      {achievement.organization}
                    </td>
                    <td className="px-6 py-4 text-foreground-muted">
                      {achievement.date}
                    </td>
                    <td className="px-6 py-4">
                      {achievement.relatedProject && (
                        <button
                          onClick={() => handleProjectClick(achievement.relatedProject!)}
                          className="inline-flex items-center px-3 py-2 bg-opal-primary text-white text-sm rounded-lg hover:bg-opal-primary-hover transition-colors duration-200 font-medium"
                        >
                          {achievement.relatedProject}
                        </button>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 모바일 카드 뷰 */}
          <div className="lg:hidden space-y-4 p-4">
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-surface-secondary rounded-lg p-4 border border-border hover:shadow-md transition-shadow duration-200"
              >
                <div className="space-y-3">
                  {/* 성과 제목 및 설명 */}
                  <div>
                    <h4 className="font-semibold text-foreground text-base mb-2">
                      {achievement.title}
                    </h4>
                    <p className="text-sm text-foreground-secondary leading-relaxed">
                      {achievement.description}
                    </p>
                  </div>
                  
                  {/* 메타 정보 */}
                  <div className="flex flex-col space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-foreground-muted font-medium">기관:</span>
                      <span className="text-foreground-secondary">{achievement.organization}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-foreground-muted font-medium">날짜:</span>
                      <span className="text-foreground-muted">{achievement.date}</span>
                    </div>
                  </div>
                  
                  {/* 관련 프로젝트 버튼 */}
                  {achievement.relatedProject && (
                    <div className="pt-2">
                      <button
                        onClick={() => handleProjectClick(achievement.relatedProject!)}
                        className="w-full inline-flex items-center justify-center px-4 py-2 bg-opal-primary text-white text-sm rounded-lg hover:bg-opal-primary-hover transition-colors duration-200 font-medium"
                      >
                        관련 프로젝트: {achievement.relatedProject}
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
    </AutoLinkText>
  );
}


