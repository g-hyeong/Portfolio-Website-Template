// 전처리된 linkedTexts 데이터를 사용하는 최적화된 유틸리티

let preprocessedData: {
  simpleMap: Record<string, Array<{ noteId: string; priority: number; strength: number }>>;
  regexPatterns: Array<{ pattern: string; noteId: string; priority: number; strength: number }>;
  trie: unknown;
} | null = null;

// 전처리된 데이터 로드 (런타임에 한 번만 실행)
async function loadPreprocessedData() {
  if (preprocessedData) return preprocessedData;
  
  // 개발 환경에서는 전처리된 데이터 사용하지 않고 실시간 처리
  if (process.env.NODE_ENV === 'development') {
    return null;
  }
  
  try {
    // 프로덕션 환경에서만 전처리된 데이터 로드
    const { default: data } = await import('@/data/generated/linked-texts.json');
    preprocessedData = data;
    return preprocessedData;
  } catch {
    console.warn('Preprocessed linked texts data not found, falling back to runtime processing');
    // 폴백: 기존 방식 사용
    return null;
  }
}

// 최적화된 링크 매칭 함수
export async function findLinkedNotesOptimized(text: string): Promise<Array<{
  noteId: string;
  priority: number;
  strength: number;
  matchedText: string;
}>> {
  const data = await loadPreprocessedData();
  if (!data) {
    // 폴백: 기존 knowledgeGraph 사용
    const { findLinkedNotes } = await import('./knowledgeGraph');
    return findLinkedNotes(text);
  }

  const matches: Array<{
    noteId: string;
    priority: number;
    strength: number;
    matchedText: string;
  }> = [];

  const normalizedText = text.toLowerCase().trim();

  // 1. 간단한 맵에서 검색 (O(1))
  if (data.simpleMap[normalizedText]) {
    data.simpleMap[normalizedText].forEach(match => {
      matches.push({
        ...match,
        matchedText: text
      });
    });
  }

  // 2. 정규식 패턴 검색 (미리 정렬되어 있음)
  for (const regexPattern of data.regexPatterns) {
    try {
      const pattern = new RegExp(regexPattern.pattern.slice(1, -2), 'i'); // /pattern/i에서 패턴 추출
      if (pattern.test(text)) {
        matches.push({
          noteId: regexPattern.noteId,
          priority: regexPattern.priority,
          strength: regexPattern.strength,
          matchedText: text
        });
      }
    } catch {
      console.warn('Invalid regex pattern:', regexPattern.pattern);
    }
  }

  // 이미 전처리 단계에서 정렬되어 있지만, 다시 한 번 정렬
  return matches.sort((a, b) => {
    if (a.priority !== b.priority) {
      return b.priority - a.priority;
    }
    return b.strength - a.strength;
  });
}

// 최적화된 linkedTexts 맵 생성
export async function getOptimizedLinkedTextsMap(): Promise<Map<string, Array<{
  noteId: string;
  priority: number;
  strength: number;
}>>> {
  const data = await loadPreprocessedData();
  if (!data) {
    // 폴백: 기존 방식 사용
    const { getAllLinkedTextsMap } = await import('./knowledgeGraph');
    const originalMap = getAllLinkedTextsMap();
    const convertedMap = new Map<string, Array<{
      noteId: string;
      priority: number;
      strength: number;
    }>>();
    
    for (const [key, matches] of originalMap) {
      convertedMap.set(key, matches.map(match => ({
        noteId: match.noteId,
        priority: match.priority,
        strength: match.strength
      })));
    }
    
    return convertedMap;
  }

  const map = new Map<string, Array<{
    noteId: string;
    priority: number;
    strength: number;
  }>>();

  // 전처리된 simpleMap을 Map으로 변환
  for (const [key, matches] of Object.entries(data.simpleMap)) {
    map.set(key, matches);
  }

  // 정규식 패턴도 추가 (원본 형태로)
  for (const regexPattern of data.regexPatterns) {
    map.set(regexPattern.pattern, [{
      noteId: regexPattern.noteId,
      priority: regexPattern.priority,
      strength: regexPattern.strength
    }]);
  }

  return map;
}

// 텍스트가 링크 가능한지 빠르게 확인
export async function isTextLinkedOptimized(text: string): Promise<boolean> {
  const matches = await findLinkedNotesOptimized(text);
  return matches.length > 0;
}

// 최고 우선순위 노트 빠르게 가져오기
export async function getPrimaryNoteForTextOptimized(text: string) {
  const matches = await findLinkedNotesOptimized(text);
  if (matches.length === 0) return null;

  const primaryMatch = matches[0];
  // 노트 데이터는 필요시 별도로 로드
  const { portfolioData } = await import('@/data');
  return portfolioData.notes.find(note => note.id === primaryMatch.noteId) || null;
}