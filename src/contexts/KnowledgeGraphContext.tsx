'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { NotePost } from '@/types/portfolio';
import { 
  findLinkedNotes, 
  getAllLinkedNotesForText, 
  generateLinkVisualization 
} from '@/utils/knowledgeGraph';
import { portfolioData } from '@/data';

// 탭 상태 정보
export interface NoteTab {
  id: string;
  note: NotePost;
  isActive: boolean;
  triggerText?: string; // 어떤 텍스트를 클릭해서 열린 탭인지
  openedAt: number;
}

// 히스토리 엔트리
export interface HistoryEntry {
  id: string;
  action: 'open' | 'close' | 'switch';
  noteId: string;
  triggerText?: string;
  timestamp: number;
}

// 마우스 위치 정보
interface MousePosition {
  x: number;
  y: number;
}

// Knowledge Graph Context 타입
interface KnowledgeGraphContextType {
  // 탭 관리
  tabs: NoteTab[];
  activeTabId: string | null;
  isModalOpen: boolean;
  mousePosition: MousePosition | null;
  
  // 호버 미리보기 상태
  isPreviewVisible: boolean;
  previewNotes: NotePost[];
  previewMousePosition: MousePosition | null;
  
  // 핵심 액션
  openNoteFromText: (text: string, mousePosition?: MousePosition) => void;
  openNote: (noteId: string, triggerText?: string, mousePosition?: MousePosition) => void;
  closeTab: (tabId: string) => void;
  switchToTab: (tabId: string) => void;
  closeAllTabs: () => void;
  
  // 호버 미리보기 액션
  showPreview: (text: string, mousePosition: MousePosition) => void;
  hidePreview: () => void;
  
  // 유틸리티
  isTextLinked: (text: string) => boolean;
  getLinkedNotesForText: (text: string) => NotePost[];
  getVisualizationData: (text: string) => ReturnType<typeof generateLinkVisualization>;
  
  // 히스토리
  history: HistoryEntry[];
  canGoBack: boolean;
  canGoForward: boolean;
  goBack: () => void;
  goForward: () => void;
  
  // 프리페칭
  prefetchNote: (noteId: string) => void;
  prefetchedNotes: Set<string>;
}

const KnowledgeGraphContext = createContext<KnowledgeGraphContextType | undefined>(undefined);

interface KnowledgeGraphProviderProps {
  children: ReactNode;
}

export function KnowledgeGraphProvider({ children }: KnowledgeGraphProviderProps) {
  const [tabs, setTabs] = useState<NoteTab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState<MousePosition | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [prefetchedNotes, setPrefetchedNotes] = useState<Set<string>>(new Set());
  
  // 호버 미리보기 상태
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [previewNotes, setPreviewNotes] = useState<NotePost[]>([]);
  const [previewMousePosition, setPreviewMousePosition] = useState<MousePosition | null>(null);

  // 히스토리에 엔트리 추가
  const addToHistory = useCallback((action: HistoryEntry['action'], noteId: string, triggerText?: string) => {
    const entry: HistoryEntry = {
      id: `${Date.now()}-${Math.random()}`,
      action,
      noteId,
      triggerText,
      timestamp: Date.now()
    };
    
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(entry);
      return newHistory;
    });
    setHistoryIndex(prev => prev + 1);
  }, [historyIndex]);

  // 텍스트로부터 노트 열기 (다중 노트 지원) - 최적화됨
  const openNoteFromText = useCallback((text: string, mousePosition?: MousePosition) => {
    // 즉시 모달 열기 (로딩 상태로)
    setIsModalOpen(true);
    
    // 비동기로 노트 데이터 로드
    const loadAndOpenNote = async () => {
      const linkedNotes = getAllLinkedNotesForText(text);
      
      if (linkedNotes.length === 0) {
        console.warn(`No notes found for text: "${text}"`);
        setIsModalOpen(false); // 노트가 없으면 모달 닫기
        return;
      }

      // 마우스 위치 저장
      if (mousePosition) {
        setMousePosition(mousePosition);
      }

      // 기존에 이미 열려있는 탭들을 찾기
      const existingTabs = tabs.filter(tab => 
        linkedNotes.some(note => note.id === tab.note.id)
      );

      if (existingTabs.length > 0) {
        // 이미 열린 탭이 있으면 해당 탭으로 전환
        const firstExistingTab = existingTabs[0];
        setActiveTabId(firstExistingTab.id);
        return;
      }

      // 새로운 탭들 생성
      const newTabs: NoteTab[] = linkedNotes.map((note, index) => ({
        id: `${note.id}-${Date.now()}-${index}`,
        note,
        isActive: index === 0,
        triggerText: text,
        openedAt: Date.now()
      }));

      setTabs(prev => {
        // 기존 탭들의 활성 상태 해제
        const updatedTabs = prev.map(tab => ({ ...tab, isActive: false }));
        return [...updatedTabs, ...newTabs];
      });

      if (newTabs.length > 0) {
        setActiveTabId(newTabs[0].id);
        addToHistory('open', newTabs[0].note.id, text);
      }
    };

    // 다음 틱에 실행하여 UI 블로킹 방지
    setTimeout(loadAndOpenNote, 0);
  }, [tabs, addToHistory]);

  // 특정 노트 열기
  const openNote = useCallback((noteId: string, triggerText?: string, mousePosition?: MousePosition) => {
    const note = portfolioData.notes.find(n => n.id === noteId);
    if (!note) {
      console.warn(`Note not found: ${noteId}`);
      return;
    }

    // 마우스 위치 저장
    if (mousePosition) {
      setMousePosition(mousePosition);
    }

    // 이미 열린 탭 확인
    const existingTab = tabs.find(tab => tab.note.id === noteId);
    if (existingTab) {
      setActiveTabId(existingTab.id);
      setIsModalOpen(true);
      return;
    }

    const newTab: NoteTab = {
      id: `${noteId}-${Date.now()}`,
      note,
      isActive: true,
      triggerText,
      openedAt: Date.now()
    };

    setTabs(prev => {
      const updatedTabs = prev.map(tab => ({ ...tab, isActive: false }));
      return [...updatedTabs, newTab];
    });

    setActiveTabId(newTab.id);
    setIsModalOpen(true);
    addToHistory('open', noteId, triggerText);
  }, [tabs, addToHistory]);

  // 탭 닫기
  const closeTab = useCallback((tabId: string) => {
    const tabToClose = tabs.find(tab => tab.id === tabId);
    if (!tabToClose) return;

    setTabs(prev => {
      const filteredTabs = prev.filter(tab => tab.id !== tabId);
      
      // 닫힌 탭이 활성 탭이었다면 다른 탭을 활성화
      if (tabToClose.isActive && filteredTabs.length > 0) {
        const newActiveTab = filteredTabs[filteredTabs.length - 1];
        newActiveTab.isActive = true;
        setActiveTabId(newActiveTab.id);
      } else if (filteredTabs.length === 0) {
        setActiveTabId(null);
        setIsModalOpen(false);
      }
      
      return filteredTabs;
    });

    addToHistory('close', tabToClose.note.id);
  }, [tabs, addToHistory]);

  // 탭 전환
  const switchToTab = useCallback((tabId: string) => {
    const targetTab = tabs.find(tab => tab.id === tabId);
    if (!targetTab) return;

    setTabs(prev => prev.map(tab => ({
      ...tab,
      isActive: tab.id === tabId
    })));

    setActiveTabId(tabId);
    addToHistory('switch', targetTab.note.id);
  }, [tabs, addToHistory]);

  // 모든 탭 닫기
  const closeAllTabs = useCallback(() => {
    setTabs([]);
    setActiveTabId(null);
    setIsModalOpen(false);
  }, []);

  // 텍스트 링크 확인
  const isTextLinked = useCallback((text: string) => {
    return findLinkedNotes(text).length > 0;
  }, []);

  // 텍스트에 연결된 노트들 가져오기
  const getLinkedNotesForText = useCallback((text: string) => {
    return getAllLinkedNotesForText(text);
  }, []);

  // 시각화 데이터 생성
  const getVisualizationData = useCallback((text: string) => {
    return generateLinkVisualization(text);
  }, []);

  // 히스토리 네비게이션
  const canGoBack = historyIndex > 0;
  const canGoForward = historyIndex < history.length - 1;

  const goBack = useCallback(() => {
    if (!canGoBack) return;
    
    const prevEntry = history[historyIndex - 1];
    if (prevEntry.action === 'open') {
      openNote(prevEntry.noteId, prevEntry.triggerText);
    }
    setHistoryIndex(prev => prev - 1);
  }, [canGoBack, history, historyIndex, openNote]);

  const goForward = useCallback(() => {
    if (!canGoForward) return;
    
    const nextEntry = history[historyIndex + 1];
    if (nextEntry.action === 'open') {
      openNote(nextEntry.noteId, nextEntry.triggerText);
    }
    setHistoryIndex(prev => prev + 1);
  }, [canGoForward, history, historyIndex, openNote]);

  // 프리페칭
  const prefetchNote = useCallback((noteId: string) => {
    setPrefetchedNotes(prev => new Set([...prev, noteId]));
  }, []);

  // 호버 미리보기 표시
  const showPreview = useCallback((text: string, mousePosition: MousePosition) => {
    const linkedNotes = getAllLinkedNotesForText(text);
    if (linkedNotes.length === 0) return;

    setPreviewNotes(linkedNotes);
    setPreviewMousePosition(mousePosition);
    setIsPreviewVisible(true);
  }, []);

  // 호버 미리보기 숨기기
  const hidePreview = useCallback(() => {
    setIsPreviewVisible(false);
    setPreviewNotes([]);
    setPreviewMousePosition(null);
  }, []);

  // 키보드 단축키
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + W: 현재 탭 닫기
      if ((e.metaKey || e.ctrlKey) && e.key === 'w' && activeTabId) {
        e.preventDefault();
        closeTab(activeTabId);
      }
      
      // Cmd/Ctrl + 숫자: 탭 전환
      if ((e.metaKey || e.ctrlKey) && e.key >= '1' && e.key <= '9') {
        e.preventDefault();
        const index = parseInt(e.key) - 1;
        if (tabs[index]) {
          switchToTab(tabs[index].id);
        }
      }
      
      // Escape: 모든 탭 닫기
      if (e.key === 'Escape' && isModalOpen) {
        closeAllTabs();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTabId, tabs, isModalOpen, closeTab, switchToTab, closeAllTabs]);

  const value: KnowledgeGraphContextType = {
    tabs,
    activeTabId,
    isModalOpen,
    mousePosition,
    isPreviewVisible,
    previewNotes,
    previewMousePosition,
    openNoteFromText,
    openNote,
    closeTab,
    switchToTab,
    closeAllTabs,
    showPreview,
    hidePreview,
    isTextLinked,
    getLinkedNotesForText,
    getVisualizationData,
    history,
    canGoBack,
    canGoForward,
    goBack,
    goForward,
    prefetchNote,
    prefetchedNotes
  };

  return (
    <KnowledgeGraphContext.Provider value={value}>
      {children}
    </KnowledgeGraphContext.Provider>
  );
}

export function useKnowledgeGraph() {
  const context = useContext(KnowledgeGraphContext);
  if (context === undefined) {
    throw new Error('useKnowledgeGraph must be used within a KnowledgeGraphProvider');
  }
  return context;
}

// 레거시 호환성을 위한 alias
export const useOpenNotePost = useKnowledgeGraph;