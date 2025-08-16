'use client';

import { useState, useEffect } from 'react';
import { Portfolio, Project, NotePost } from '../../core/entities/Portfolio';
import { container } from '../../infrastructure/di/Container';

export const usePortfolio = () => {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPortfolio = async () => {
      try {
        setLoading(true);
        const portfolioUseCase = container.getPortfolioDataUseCase();
        const data = await portfolioUseCase.execute();
        setPortfolio(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load portfolio');
      } finally {
        setLoading(false);
      }
    };

    loadPortfolio();
  }, []);

  return { portfolio, loading, error };
};

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        const projectsUseCase = container.getProjectsUseCase();
        const data = await projectsUseCase.execute();
        setProjects(data);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  const getProjectsByType = (type: 'team' | 'personal') => {
    return projects.filter(project => project.projectType === type);
  };

  return { projects, loading, getProjectsByType };
};

export const useNotes = () => {
  const [notes, setNotes] = useState<NotePost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNotes = async () => {
      try {
        setLoading(true);
        const notesUseCase = container.getNotesUseCase();
        const data = await notesUseCase.execute();
        setNotes(data);
      } finally {
        setLoading(false);
      }
    };

    loadNotes();
  }, []);

  const getNotesByCategory = (category: string) => {
    return category === 'all' 
      ? notes 
      : notes.filter(note => note.category === category);
  };

  return { notes, loading, getNotesByCategory };
};

export const useProjectNote = () => {
  const getProjectNotePost = async (projectId: string): Promise<string | undefined> => {
    const projectNoteUseCase = container.getProjectNoteUseCase();
    return await projectNoteUseCase.execute(projectId);
  };

  return { getProjectNotePost };
};