import { NotePost } from '@/types/portfolio';
import { portfolioData } from '@/data';

// 링킹 매치 결과
export interface LinkMatch {
  noteId: string;
  priority: number;
  strength: number;
  matchedText: string;
  context?: string;
}

// 텍스트와 매칭되는 모든 노트들을 찾기
export function findLinkedNotes(text: string): LinkMatch[] {
  const matches: LinkMatch[] = [];
  
  portfolioData.notes.forEach(note => {
    note.linkedTexts.forEach(linkedText => {
      let isMatch = false;
      let matchedText = text;
      
      if (linkedText.text instanceof RegExp) {
        // 정규식 매칭
        const regexMatch = text.match(linkedText.text);
        if (regexMatch) {
          isMatch = true;
          matchedText = regexMatch[0];
        }
      } else {
        // 정확한 문자열 매칭
        isMatch = text === linkedText.text;
      }
      
      if (isMatch) {
        matches.push({
          noteId: note.id,
          priority: note.priority,
          strength: linkedText.strength,
          matchedText,
          context: linkedText.context
        });
      }
    });
  });
  
  // 우선순위와 강도 기준으로 정렬
  return matches.sort((a, b) => {
    if (a.priority !== b.priority) {
      return b.priority - a.priority; // 높은 우선순위 먼저
    }
    return b.strength - a.strength; // 같은 우선순위면 높은 강도 먼저
  });
}

// 텍스트가 클릭 가능한지 확인
export function isTextLinked(text: string): boolean {
  return findLinkedNotes(text).length > 0;
}

// 특정 텍스트에 대한 최고 우선순위 노트 가져오기
export function getPrimaryNoteForText(text: string): NotePost | null {
  const matches = findLinkedNotes(text);
  if (matches.length === 0) return null;
  
  const primaryMatch = matches[0];
  return portfolioData.notes.find(note => note.id === primaryMatch.noteId) || null;
}

// 특정 텍스트에 대한 모든 연결된 노트들 가져오기
export function getAllLinkedNotesForText(text: string): NotePost[] {
  const matches = findLinkedNotes(text);
  return matches
    .map(match => portfolioData.notes.find(note => note.id === match.noteId))
    .filter(note => note !== undefined) as NotePost[];
}

// 노트들 간의 관련도 점수 계산
export function calculateRelatedness(note1: NotePost, note2: NotePost): number {
  let score = 0;
  
  // 직접적인 관련 노트 관계
  if (note1.relatedNotes.includes(note2.id) || note2.relatedNotes.includes(note1.id)) {
    score += 50;
  }
  
  // 공통 태그 수
  const commonTags = note1.tags.filter(tag => note2.tags.includes(tag));
  score += commonTags.length * 10;
  
  // 같은 카테고리
  if (note1.category === note2.category) {
    score += 20;
  }
  
  // 공통 링크된 텍스트
  const note1Texts = note1.linkedTexts.map(lt => 
    typeof lt.text === 'string' ? lt.text : lt.text.source
  );
  const note2Texts = note2.linkedTexts.map(lt => 
    typeof lt.text === 'string' ? lt.text : lt.text.source
  );
  const commonTexts = note1Texts.filter(text => note2Texts.includes(text));
  score += commonTexts.length * 15;
  
  return Math.min(score, 100); // 최대 100점
}

// 텍스트에 대한 링크 시각화 데이터 생성
export function generateLinkVisualization(text: string) {
  const matches = findLinkedNotes(text);
  const notes = getAllLinkedNotesForText(text);
  
  return {
    centerText: text,
    totalMatches: matches.length,
    primaryNote: notes[0],
    secondaryNotes: notes.slice(1),
    linkStrengths: matches.reduce((acc, match) => {
      acc[match.noteId] = match.strength;
      return acc;
    }, {} as Record<string, number>),
    priorities: matches.reduce((acc, match) => {
      acc[match.noteId] = match.priority;
      return acc;
    }, {} as Record<string, number>)
  };
}

// 검색을 위한 전체 텍스트 인덱스 생성
export function buildSearchIndex(): Record<string, LinkMatch[]> {
  const index: Record<string, LinkMatch[]> = {};
  
  portfolioData.notes.forEach(note => {
    note.linkedTexts.forEach(linkedText => {
      if (typeof linkedText.text === 'string') {
        const key = linkedText.text.toLowerCase();
        if (!index[key]) {
          index[key] = [];
        }
        index[key].push({
          noteId: note.id,
          priority: note.priority,
          strength: linkedText.strength,
          matchedText: linkedText.text,
          context: linkedText.context
        });
      }
    });
  });
  
  // 각 키에 대해 우선순위로 정렬
  Object.keys(index).forEach(key => {
    index[key].sort((a, b) => {
      if (a.priority !== b.priority) {
        return b.priority - a.priority;
      }
      return b.strength - a.strength;
    });
  });
  
  return index;
}

// 캐시된 linkedTexts Map
let cachedLinkedTextsMap: Map<string, LinkMatch[]> | null = null;

// 모든 linkedTexts를 Map으로 반환 (AutoLinkText 컴포넌트용) - 캐싱됨
export function getAllLinkedTextsMap(): Map<string, LinkMatch[]> {
  // 이미 캐시된 결과가 있으면 즉시 반환
  if (cachedLinkedTextsMap) {
    return cachedLinkedTextsMap;
  }
  
  const map = new Map<string, LinkMatch[]>();
  
  portfolioData.notes.forEach(note => {
    note.linkedTexts.forEach(linkedText => {
      const key = typeof linkedText.text === 'string' 
        ? linkedText.text 
        : linkedText.text.toString();
      
      if (!map.has(key)) {
        map.set(key, []);
      }
      map.get(key)!.push({
        noteId: note.id,
        strength: linkedText.strength,
        priority: note.priority,
        matchedText: key
      });
    });
  });
  
  // 결과를 캐시
  cachedLinkedTextsMap = map;
  return map;
}

// 캐시 무효화 함수 (필요시 사용)
export function clearLinkedTextsCache(): void {
  cachedLinkedTextsMap = null;
}