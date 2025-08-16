'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiArrowLeft, FiTag } from 'react-icons/fi';
import { notes } from '@/data/notes';
import { NotePost } from '@/types/portfolio';
import NotePostModal from '@/components/notes/NotePostModal';

// 카테고리 함수
function getNotesPageCategories() {
  const categories = [{ key: 'all', label: '전체' }];
  const noteCategories = Array.from(new Set(notes.map(note => note.category)))
    .filter(category => category !== 'etc'); // etc 카테고리 제외
  noteCategories.forEach(category => {
    categories.push({
      key: category,
      label: category
    });
  });
  return categories;
}

// 카테고리 색상
function getCategoryColor(category: string) {
  const colors: { [key: string]: string } = {
    'optimization': 'bg-blue-100 text-blue-800',
    'default': 'bg-gray-100 text-gray-800'
  };
  return colors[category] || colors.default;
}

export default function NotesPage() {
  const router = useRouter();
  const [selectedPost, setSelectedPost] = useState<NotePost | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredPosts = selectedCategory === 'all' 
    ? notes.filter(post => post.category !== 'etc') // 전체에서도 etc 제외
    : notes.filter(post => post.category === selectedCategory);

  const categories = getNotesPageCategories();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-surface shadow-medium sticky top-0 z-40 border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/')}
                className="flex items-center space-x-2 text-foreground-muted hover:text-foreground transition-colors"
              >
                <FiArrowLeft className="w-5 h-5" />
                <span>메인으로</span>
              </button>
              <div className="h-6 w-px bg-border" />
              <h1 className="text-xl font-bold text-foreground">Notes</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category.key}
                onClick={() => setSelectedCategory(category.key)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.key
                    ? 'bg-foreground text-background'
                    : 'bg-surface text-foreground-muted hover:bg-surface-secondary border border-border'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Blog Posts Grid - 간단한 버전 */}
        <div className="grid gap-6 md:grid-cols-2">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              className="bg-surface rounded-lg shadow-medium border border-border overflow-hidden hover:shadow-heavy cursor-pointer transition-shadow"
              onClick={() => setSelectedPost(post)}
            >
              <div className="p-6">
                <div className="flex items-center mb-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(post.category)}`}>
                    {categories.find(c => c.key === post.category)?.label}
                  </span>
                </div>
                
                <h2 className="text-lg font-bold text-foreground mb-2 line-clamp-2">
                  {post.title}
                </h2>
                
                <p className="text-foreground-secondary text-sm mb-4 line-clamp-3">
                  {post.summary}
                </p>
                
                <div className="flex items-center space-x-2">
                  <FiTag className="w-4 h-4 text-foreground-muted" />
                  <div className="flex flex-wrap gap-1">
                    {post.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="inline-block bg-surface-secondary text-foreground-secondary text-xs px-2 py-1 rounded border border-border">
                        {tag}
                      </span>
                    ))}
                    {post.tags.length > 3 && (
                      <span className="text-xs text-foreground-muted">+{post.tags.length - 3}</span>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Empty State */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-foreground-muted">해당 카테고리에 노트가 없습니다.</p>
          </div>
        )}
      </main>

      {/* 노트 모달 */}
      {selectedPost && (
        <NotePostModal
          post={selectedPost}
          isOpen={!!selectedPost}
          onClose={() => setSelectedPost(null)}
          allNotes={notes}
          onNoteClick={setSelectedPost}
        />
      )}
    </div>
  );
}