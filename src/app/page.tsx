import Header from '@/components/layout/Header';
import CareerSection from '@/components/sections/CareerSection';
import HeroSection from '@/components/sections/HeroSection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import SkillsSection from '@/components/sections/SkillsSection';
import ClientPortfolioPage from './ClientPortfolioPage';
import ServerPortfolioProvider from './ServerPortfolioProvider';

// 서버 컴포넌트로 변환
export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <ServerPortfolioProvider>
        {(portfolio) => (
          <>
            <CareerSection />
            <ProjectsSection />
            <ClientPortfolioPage 
              achievements={portfolio.achievements} 
              projects={portfolio.projects}
            />
            <SkillsSection />
          </>
        )}
      </ServerPortfolioProvider>
    </main>
  );
}
