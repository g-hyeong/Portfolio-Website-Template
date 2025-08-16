'use client';

import { ThemeProvider } from 'next-themes';
import { KnowledgeGraphProvider } from '@/contexts/KnowledgeGraphContext';
import { OptimizationProvider } from '@/components/providers/OptimizationProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="data-theme"
      defaultTheme="system"
      enableSystem={true}
      disableTransitionOnChange={false}
      storageKey="portfolio-theme"
      themes={['light', 'dark', 'system']}
    >
      <KnowledgeGraphProvider>
        <OptimizationProvider>
          {children}
        </OptimizationProvider>
      </KnowledgeGraphProvider>
    </ThemeProvider>
  );
}