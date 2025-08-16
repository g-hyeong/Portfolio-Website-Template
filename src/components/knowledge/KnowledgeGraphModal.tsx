'use client';

import { useKnowledgeGraph } from '@/contexts/KnowledgeGraphContext';
import { NotePost } from '@/types/portfolio';
import TabStackModal from './TabStackModal';
import KnowledgePreviewTooltip from './KnowledgePreviewTooltip';

export default function KnowledgeGraphModal() {
  const { 
    tabs, 
    activeTabId, 
    isModalOpen, 
    mousePosition,
    isPreviewVisible,
    previewNotes,
    previewMousePosition,
    closeAllTabs, 
    closeTab, 
    switchToTab,
    openNote,
    hidePreview
  } = useKnowledgeGraph();

  const handleNoteClick = (note: NotePost) => {
    openNote(note.id, '관련 노트');
  };

  return (
    <>
      {/* 호버 미리보기 툴팁 */}
      {isPreviewVisible && previewMousePosition && (
        <KnowledgePreviewTooltip
          notes={previewNotes}
          isVisible={isPreviewVisible}
          mousePosition={previewMousePosition}
          onClose={hidePreview}
        />
      )}
      
      {/* 클릭 시 나타나는 Note Modal */}
      <TabStackModal
        tabs={tabs}
        activeTabId={activeTabId}
        isOpen={isModalOpen}
        onClose={closeAllTabs}
        onTabClose={closeTab}
        onTabSwitch={switchToTab}
        onNoteClick={handleNoteClick}
        mousePosition={mousePosition}
      />
    </>
  );
}