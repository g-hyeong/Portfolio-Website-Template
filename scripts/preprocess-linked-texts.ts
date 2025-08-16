import * as fs from 'fs';
import * as path from 'path';
import { portfolioData } from '../src/data';

// 빌드 시 linkedTexts를 트라이 구조로 전처리
interface TrieNode {
  isEnd: boolean;
  matches: Array<{
    noteId: string;
    priority: number;
    strength: number;
    originalText: string;
  }>;
  children: Map<string, TrieNode>;
}

class LinkedTextsTrie {
  private root: TrieNode;

  constructor() {
    this.root = {
      isEnd: false,
      matches: [],
      children: new Map()
    };
  }

  insert(text: string, match: { noteId: string; priority: number; strength: number; originalText: string }) {
    let node = this.root;
    const normalizedText = text.toLowerCase().trim();
    
    for (const char of normalizedText) {
      if (!node.children.has(char)) {
        node.children.set(char, {
          isEnd: false,
          matches: [],
          children: new Map()
        });
      }
      node = node.children.get(char)!;
    }
    
    node.isEnd = true;
    node.matches.push(match);
    
    // 우선순위와 강도로 정렬
    node.matches.sort((a, b) => {
      if (a.priority !== b.priority) {
        return b.priority - a.priority;
      }
      return b.strength - a.strength;
    });
  }

  search(text: string): Array<{ noteId: string; priority: number; strength: number; originalText: string }> {
    let node = this.root;
    const normalizedText = text.toLowerCase().trim();
    
    for (const char of normalizedText) {
      if (!node.children.has(char)) {
        return [];
      }
      node = node.children.get(char)!;
    }
    
    return node.isEnd ? node.matches : [];
  }

  // Trie를 직렬화 가능한 객체로 변환
  serialize(): any {
    function serializeNode(node: TrieNode): any {
      return {
        isEnd: node.isEnd,
        matches: node.matches,
        children: Object.fromEntries(
          Array.from(node.children.entries()).map(([key, child]) => [
            key,
            serializeNode(child)
          ])
        )
      };
    }
    
    return serializeNode(this.root);
  }
}

// linkedTexts 전처리 함수
function preprocessLinkedTexts() {
  const trie = new LinkedTextsTrie();
  const simpleMap = new Map<string, Array<{ noteId: string; priority: number; strength: number }>>();
  
  // 정규식 패턴들을 별도로 저장
  const regexPatterns: Array<{
    pattern: string;
    noteId: string;
    priority: number;
    strength: number;
  }> = [];

  portfolioData.notes.forEach(note => {
    note.linkedTexts.forEach(linkedText => {
      const match = {
        noteId: note.id,
        priority: note.priority,
        strength: linkedText.strength,
        originalText: typeof linkedText.text === 'string' ? linkedText.text : linkedText.text.source
      };

      if (typeof linkedText.text === 'string') {
        // 일반 문자열은 트라이와 Map 둘 다에 추가
        trie.insert(linkedText.text, match);
        
        const key = linkedText.text.toLowerCase();
        if (!simpleMap.has(key)) {
          simpleMap.set(key, []);
        }
        simpleMap.get(key)!.push({
          noteId: match.noteId,
          priority: match.priority,
          strength: match.strength
        });
      } else {
        // 정규식 패턴은 별도 배열에 저장
        regexPatterns.push({
          pattern: linkedText.text.toString(),
          noteId: match.noteId,
          priority: match.priority,
          strength: match.strength
        });
      }
    });
  });

  // Map의 각 값들을 정렬
  for (const [key, matches] of simpleMap) {
    matches.sort((a, b) => {
      if (a.priority !== b.priority) {
        return b.priority - a.priority;
      }
      return b.strength - a.strength;
    });
  }

  return {
    trie: trie.serialize(),
    simpleMap: Object.fromEntries(simpleMap),
    regexPatterns: regexPatterns.sort((a, b) => {
      if (a.priority !== b.priority) {
        return b.priority - a.priority;
      }
      return b.strength - a.strength;
    })
  };
}

// 전처리된 데이터를 파일로 저장
function generateLinkedTextsData() {
  const preprocessedData = preprocessLinkedTexts();
  
  const outputDir = path.join(process.cwd(), 'src', 'data', 'generated');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputFile = path.join(outputDir, 'linked-texts.json');
  fs.writeFileSync(outputFile, JSON.stringify(preprocessedData, null, 2));
  
  console.log(`✓ LinkedTexts 전처리 완료: ${outputFile}`);
  return outputFile;
}

// 빌드 시 실행될 메인 함수
export function buildLinkedTexts() {
  return generateLinkedTextsData();
}

// 스크립트로 직접 실행될 때
if (require.main === module) {
  buildLinkedTexts();
}