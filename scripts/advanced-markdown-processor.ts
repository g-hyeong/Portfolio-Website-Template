import * as fs from 'fs';
import * as path from 'path';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
import rehypeStringify from 'rehype-stringify';
import { visit } from 'unist-util-visit';
import { portfolioData } from '../src/data';

// ReactMarkdown 스타일 Components 매핑 (실제 ReactMarkdown에서 따온 로직)
interface ComponentMapping {
  [tagName: string]: string;
}

const componentClassMap: ComponentMapping = {
  h1: 'text-2xl font-bold text-foreground mt-8 mb-4 first:mt-0 border-b-2 border-border pb-2',
  h2: 'text-xl font-bold text-foreground mt-6 mb-3 border-b border-border pb-1',
  h3: 'text-lg font-semibold text-foreground mt-4 mb-2',
  h4: 'text-base font-semibold text-foreground mt-3 mb-2',
  h5: 'text-sm font-semibold text-foreground mt-2 mb-1',
  h6: 'text-xs font-semibold text-foreground mt-2 mb-1',
  p: 'text-foreground-secondary leading-relaxed mb-4',
  ul: 'list-disc list-outside text-foreground-secondary mb-4 space-y-1 pl-6',
  ol: 'list-decimal list-outside text-foreground-secondary mb-4 space-y-1 pl-6',
  li: 'text-foreground-secondary',
  blockquote: 'border-l-4 border-opal-primary pl-4 italic text-foreground-muted my-4 py-2 rounded-r bg-surface-secondary',
  pre: 'rounded-lg overflow-x-auto mb-4 border border-border bg-surface p-4 font-mono',
  code: 'text-foreground px-2 py-1 rounded text-sm bg-surface-secondary border border-border font-mono',
  table: 'w-full border-collapse border border-border rounded-lg overflow-hidden mb-4',
  thead: 'bg-surface-secondary',
  th: 'border border-border px-4 py-2 text-left font-semibold text-foreground',
  td: 'border border-border px-4 py-2 text-foreground-secondary',
  tr: 'border-b border-border last:border-b-0',
  a: 'text-opal-primary hover:underline transition-colors hover:text-opal-primary-hover',
  strong: 'font-bold text-foreground',
  em: 'italic text-foreground-secondary',
  img: 'rounded-lg shadow-lg max-w-full h-auto mx-auto block my-6'
};

// ReactMarkdown의 defaultUrlTransform 로직 구현
function safeUrlTransform(url: string, key: string): string {
  const safeProtocol = /^(https?|ircs?|mailto|xmpp)$/i;
  const colon = url.indexOf(':');
  const questionMark = url.indexOf('?');
  const numberSign = url.indexOf('#');
  const slash = url.indexOf('/');

  if (
    // If there is no protocol, it's relative.
    colon === -1 ||
    // If the first colon is after a `?`, `#`, or `/`, it's not a protocol.
    (slash !== -1 && colon > slash) ||
    (questionMark !== -1 && colon > questionMark) ||
    (numberSign !== -1 && colon > numberSign) ||
    // It is a protocol, it should be allowed.
    safeProtocol.test(url.slice(0, colon))
  ) {
    return url;
  }

  return '';
}

// 커스텀 rehype 플러그인: 클래스 추가 및 URL 변환
function rehypeAddClasses() {
  return function (tree: any) {
    visit(tree, 'element', (node: any) => {
      // 클래스 추가
      if (componentClassMap[node.tagName]) {
        node.properties = node.properties || {};
        node.properties.className = componentClassMap[node.tagName];
      }

      // URL 변환 및 보안 처리
      if (node.properties) {
        // href 속성 처리 (링크)
        if (node.properties.href) {
          node.properties.href = safeUrlTransform(node.properties.href, 'href');
        }
        
        // src 속성 처리 (이미지)
        if (node.properties.src) {
          const src = node.properties.src;
          // 절대 경로가 아닌 경우 noteImages 경로 추가
          if (typeof src === 'string' && !src.startsWith('/') && !src.startsWith('http')) {
            node.properties.src = `/assets/noteImages/${src}`;
          }
          // URL 보안 검사
          node.properties.src = safeUrlTransform(node.properties.src, 'src');
        }
      }

      // 특별한 처리들
      if (node.tagName === 'code' && node.properties?.className) {
        // 인라인 코드가 아닌 경우 (pre > code)
        const parent = node.parent;
        if (!parent || parent.tagName !== 'pre') {
          // 인라인 코드 스타일 적용
          node.properties.className = 'text-red-600 bg-surface-secondary px-1.5 py-0.5 rounded text-sm font-mono font-semibold border border-red-200';
        }
      }

      // Task list 지원 (GFM)
      if (node.tagName === 'ul' && node.properties?.className?.includes('contains-task-list')) {
        node.properties.className += ' list-none pl-0';
      }
      
      if (node.tagName === 'li' && node.properties?.className?.includes('task-list-item')) {
        node.properties.className += ' flex items-start space-x-2';
      }
    });
  };
}

// ReactMarkdown과 동일한 마크다운→HTML 변환 (고도화)
function convertMarkdownToHTML(content: string): string {
  try {
    const result = unified()
      .use(remarkParse)
      .use(remarkGfm) // GitHub Flavored Markdown
      .use(remarkBreaks) // Line breaks
      .use(remarkRehype, { 
        allowDangerousHtml: true,
        footnoteLabel: '주석',
        footnoteBackLabel: '본문으로 돌아가기'
      })
      .use(rehypeRaw) // Raw HTML 지원
      .use(rehypeHighlight, {
        detect: true,
        subset: ['javascript', 'python', 'typescript', 'jsx', 'tsx', 'css', 'html', 'json', 'markdown', 'bash', 'sql', 'java', 'go', 'rust']
      })
      .use(rehypeAddClasses) // 커스텀 클래스 및 URL 처리
      .use(rehypeStringify, {
        allowDangerousHtml: true,
        closeSelfClosing: true,
        omitOptionalTags: false
      })
      .processSync(content);
    
    return String(result);
  } catch (error) {
    console.error('Error converting markdown to HTML:', error);
    return `<div class="text-red-500 border border-red-300 rounded p-4">
      <h3 class="font-bold mb-2">마크다운 변환 오류</h3>
      <p>마크다운을 HTML로 변환하는 중 오류가 발생했습니다.</p>
      <details class="mt-2">
        <summary class="cursor-pointer font-semibold">오류 세부사항</summary>
        <pre class="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">${error}</pre>
      </details>
    </div>`;
  }
}

// 고도화된 마크다운 전처리 함수
export async function advancedMarkdownPreprocessing() {
  const markdownDir = path.join(process.cwd(), 'public', 'data', 'notePosts');
  const outputDir = path.join(process.cwd(), 'public', 'data', 'generated', 'html');
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // 기존 파일들 정리
  const existingFiles = fs.readdirSync(outputDir);
  existingFiles.forEach(file => {
    if (file.endsWith('.html')) {
      fs.unlinkSync(path.join(outputDir, file));
    }
  });

  console.log('🚀 고도화된 마크다운 전처리 시작...\n');

  // 통계 정보
  let successCount = 0;
  let errorCount = 0;
  const processedFiles: string[] = [];

  // 모든 노트의 마크다운 파일을 개별 HTML 파일로 처리
  for (const note of portfolioData.notes) {
    const markdownPath = path.join(markdownDir, `${note.slug}.md`);
    const htmlOutputPath = path.join(outputDir, `${note.slug}.html`);
    
    try {
      if (fs.existsSync(markdownPath)) {
        const markdownContent = fs.readFileSync(markdownPath, 'utf-8');
        const htmlContent = convertMarkdownToHTML(markdownContent);
        
        // HTML 파일 저장
        fs.writeFileSync(htmlOutputPath, htmlContent);
        
        // 파일 크기 정보
        const stats = fs.statSync(htmlOutputPath);
        const fileSizeKB = (stats.size / 1024).toFixed(2);
        
        console.log(`✅ ${note.slug}.md → ${note.slug}.html (${fileSizeKB}KB)`);
        successCount++;
        processedFiles.push(note.slug);
      } else {
        console.warn(`⚠️  누락된 마크다운 파일: ${markdownPath}`);
        const errorHtml = `<div class="text-amber-600 bg-amber-50 border border-amber-200 rounded p-4">
          <h3 class="font-bold mb-2">파일을 찾을 수 없음</h3>
          <p>마크다운 파일을 찾을 수 없습니다: <code>${note.slug}.md</code></p>
        </div>`;
        fs.writeFileSync(htmlOutputPath, errorHtml);
        errorCount++;
      }
    } catch (error) {
      console.error(`❌ ${note.slug}.md 처리 중 오류:`, error);
      const errorHtml = `<div class="text-red-600 bg-red-50 border border-red-200 rounded p-4">
        <h3 class="font-bold mb-2">파일 처리 오류</h3>
        <p>파일 처리 중 오류가 발생했습니다: <code>${note.slug}.md</code></p>
        <details class="mt-2">
          <summary class="cursor-pointer font-semibold">오류 세부사항</summary>
          <pre class="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">${error}</pre>
        </details>
      </div>`;
      fs.writeFileSync(htmlOutputPath, errorHtml);
      errorCount++;
    }
  }

  // 처리 결과 요약
  console.log('\n📊 처리 결과 요약:');
  console.log(`✅ 성공: ${successCount}개 파일`);
  console.log(`❌ 오류: ${errorCount}개 파일`);
  console.log(`📁 출력 디렉터리: ${outputDir}`);
  
  if (processedFiles.length > 0) {
    console.log('🎯 처리된 파일들:', processedFiles.join(', '));
  }
  
  console.log('\n✨ 고도화된 마크다운 전처리 완료!');
  return outputDir;
}

// 스크립트로 직접 실행될 때
if (require.main === module) {
  advancedMarkdownPreprocessing();
}