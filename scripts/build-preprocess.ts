#!/usr/bin/env ts-node

import { buildLinkedTexts } from './preprocess-linked-texts';
import { advancedMarkdownPreprocessing } from './advanced-markdown-processor';
import { buildMarkdown } from './preprocess-markdown';

async function main() {
  console.log('🚀 Starting build-time preprocessing...\n');
  
  try {
    // LinkedTexts 전처리
    console.log('📝 Processing LinkedTexts...');
    buildLinkedTexts();
    console.log('');
    
    // 마크다운 전처리  
    console.log('📄 Processing Markdown files with advanced processor...');
    await advancedMarkdownPreprocessing();
    console.log('');
    
    // 마크다운 모듈 생성
    console.log('📦 Generating markdown content module...');
    await buildMarkdown();
    console.log('');
    
    console.log('✅ All preprocessing completed successfully!');
  } catch (error) {
    console.error('❌ Error during preprocessing:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}