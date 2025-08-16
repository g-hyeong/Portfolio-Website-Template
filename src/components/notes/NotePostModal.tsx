'use client';

import { NotePost } from '@/types/portfolio';
import NoteModal from '@/components/shared/NoteModal';

interface NotePostModalProps {
  post: NotePost;
  isOpen: boolean;
  onClose: () => void;
  allNotes?: NotePost[];
  onNoteClick?: (note: NotePost) => void;
}

export default function NotePostModal({ 
  post, 
  isOpen, 
  onClose, 
  allNotes, 
  onNoteClick 
}: NotePostModalProps) {
  return (
    <NoteModal 
      post={post} 
      isOpen={isOpen} 
      onClose={onClose} 
      variant="large"
      allNotes={allNotes}
      onNoteClick={onNoteClick}
    />
  );
}