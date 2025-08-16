import * as fs from 'fs';
import * as path from 'path';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeClassNames from 'rehype-class-names';
import rehypeHighlight from 'rehype-highlight';
import rehypeStringify from 'rehype-stringify';
import { portfolioData } from '../src/data';

// ReactMarkdown과 동일한 스타일 클래스 매핑
const classNameMap = {
  h1: 'text-2xl font-bold text-foreground mt-8 mb-4 first:mt-0',
  h2: 'text-xl font-bold text-foreground mt-6 mb-3',
  h3: 'text-lg font-semibold text-foreground mt-4 mb-2',
  h4: 'text-base font-semibold text-foreground mt-3 mb-2',
  h5: 'text-sm font-semibold text-foreground mt-2 mb-1',
  h6: 'text-xs font-semibold text-foreground mt-2 mb-1',
  p: 'text-foreground-secondary leading-relaxed mb-4',
  ul: 'list-disc list-inside text-foreground-secondary mb-4 space-y-1',
  ol: 'list-decimal list-inside text-foreground-secondary mb-4 space-y-1',
  li: 'text-foreground-secondary',
  blockquote: 'border-l-4 border-opal-primary pl-4 italic text-foreground-muted my-4 py-2 rounded-r bg-surface-secondary',
  pre: 'rounded-lg overflow-x-auto mb-4 bg-surface text-foreground p-4',
  code: 'text-foreground px-2 py-1 rounded text-sm bg-surface-secondary border border-border',
  '.hljs': 'bg-surface text-foreground p-4 rounded-lg overflow-x-auto',
  table: 'min-w-full border-collapse border border-border rounded-lg overflow-hidden mb-4',
  thead: 'bg-surface-secondary',
  th: 'border border-border px-4 py-2 text-left font-semibold text-foreground',
  td: 'border border-border px-4 py-2 text-foreground-secondary',
  tr: 'border-b border-border last:border-b-0',
  a: 'text-opal-primary hover:underline',
  strong: 'font-bold text-foreground',
  em: 'italic text-foreground-secondary',
  img: 'rounded-lg shadow-lg max-w-full h-auto mx-auto block my-6'
};

// 마크다운을 ReactMarkdown과 동일한 스타일로 HTML 변환
function convertMarkdownToHTML(content: string): string {
  try {
    const result = unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkBreaks)
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeRaw)
      .use(rehypeHighlight, {
        detect: true,
        subset: ['javascript', 'python', 'typescript', 'jsx', 'tsx', 'css', 'html', 'json', 'markdown', 'bash', 'sql']
      })
      .use(rehypeClassNames, classNameMap)
      .use(rehypeStringify)
      .processSync(content);
    
    return String(result);
  } catch (error) {
    console.error('Error converting markdown to HTML:', error);
    return `<div class="text-red-500">마크다운 변환 중 오류가 발생했습니다.</div>`;
  }
}

function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

// 이미지 태그 처리 함수
function processImages(htmlContent: string): string {
  // 이미지 태그를 찾아서 경로와 스타일을 수정
  return htmlContent.replace(
    /<img([^>]*?)src="([^"]*?)"([^>]*?)>/g,
    (match, beforeSrc, src, afterSrc) => {
      // 절대 경로가 아닌 경우 noteImages 경로 추가
      const imageSrc = src.startsWith('/') ? src : `/assets/noteImages/${src}`;
      return `<img${beforeSrc}src="${imageSrc}"${afterSrc}>`;
    }
  );
}

// 마크다운 파일들을 개별 HTML 파일로 변환하여 저장
async function preprocessMarkdownFiles() {
  const markdownDir = path.join(process.cwd(), 'public', 'data', 'notePosts');
  const outputDir = path.join(process.cwd(), 'public', 'data', 'generated', 'html');
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // 기존 JSON 파일이 있다면 제거
  const oldJsonFile = path.join(outputDir, 'processed-markdown.json');
  if (fs.existsSync(oldJsonFile)) {
    fs.unlinkSync(oldJsonFile);
    console.log('✓ 기존 processed-markdown.json 제거');
  }

  // 모든 노트의 마크다운 파일을 개별 HTML 파일로 처리
  for (const note of portfolioData.notes) {
    const markdownPath = path.join(markdownDir, `${note.slug}.md`);
    const htmlOutputPath = path.join(outputDir, `${note.slug}.html`);
    
    try {
      if (fs.existsSync(markdownPath)) {
        const markdownContent = fs.readFileSync(markdownPath, 'utf-8');
        let htmlContent = convertMarkdownToHTML(markdownContent);
        
        // 이미지 경로 처리
        htmlContent = processImages(htmlContent);
        
        // 개별 HTML 파일로 저장
        fs.writeFileSync(htmlOutputPath, htmlContent);
        console.log(`✓ Processed: ${note.slug}.md → ${note.slug}.html`);
      } else {
        console.warn(`⚠ Missing markdown file: ${markdownPath}`);
        const errorHtml = `<div class="text-red-500">마크다운 파일을 찾을 수 없습니다: ${note.slug}.md</div>`;
        fs.writeFileSync(htmlOutputPath, errorHtml);
      }
    } catch (error) {
      console.error(`✗ Error processing ${note.slug}.md:`, error);
      const errorHtml = `<div class="text-red-500">파일 처리 중 오류가 발생했습니다: ${note.slug}.md</div>`;
      fs.writeFileSync(htmlOutputPath, errorHtml);
    }
  }
  
  console.log(`✓ 마크다운 전처리 완료: ${outputDir}`);
  return outputDir;
}

// 타입스크립트 모듈로 마크다운 콘텐츠 생성
function generateMarkdownModule() {
  const markdownDir = path.join(process.cwd(), 'public', 'data', 'notePosts');
  const outputFile = path.join(process.cwd(), 'src', 'data', 'generated', 'markdown-content.ts');
  
  const outputDir = path.dirname(outputFile);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  let moduleContent = '// 자동 생성된 마크다운 콘텐츠 모듈\n\n';
  moduleContent += 'export const markdownContent: Record<string, string> = {\n';

  for (const note of portfolioData.notes) {
    const markdownPath = path.join(markdownDir, `${note.slug}.md`);
    
    try {
      if (fs.existsSync(markdownPath)) {
        const content = fs.readFileSync(markdownPath, 'utf-8');
        const escapedContent = JSON.stringify(content);
        moduleContent += `  "${note.slug}": ${escapedContent},\n`;
      } else {
        const errorContent = `# 콘텐츠를 불러올 수 없습니다\\n\\n죄송합니다. **${note.slug}** 포스트의 내용을 불러오는 중 오류가 발생했습니다.`;
        moduleContent += `  "${note.slug}": ${JSON.stringify(errorContent)},\n`;
      }
    } catch (error) {
      const errorContent = `# 파일 처리 오류\\n\\n**${note.slug}** 파일을 처리하는 중 오류가 발생했습니다.`;
      moduleContent += `  "${note.slug}": ${JSON.stringify(errorContent)},\n`;
    }
  }

  moduleContent += '};\n';
  
  fs.writeFileSync(outputFile, moduleContent);
  console.log(`✓ 마크다운 모듈 생성 완료: ${outputFile}`);
  return outputFile;
}

// 빌드 시 실행될 메인 함수
export async function buildMarkdown() {
  await preprocessMarkdownFiles();
  generateMarkdownModule();
}

// 스크립트로 직접 실행될 때
if (require.main === module) {
  buildMarkdown();
}