'use client';

import { FaGithub } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          {/* 제작자 크레딧 */}
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <span>Built with</span>
            <span>using</span>
            <a
              href="https://github.com/g-hyeong/Portfolio-Website-Template"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
            >
              Portfolio Website Template
            </a>
            <span>by</span>
            <a
              href="https://github.com/g-hyeong"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors flex items-center space-x-1"
            >
              <FaGithub className="w-4 h-4" />
              <span>g-hyeong</span>
            </a>
          </div>
          
          {/* 기술 스택 */}
          <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-500">
            <span>Next.js</span>
            <span>•</span>
            <span>TypeScript</span>
            <span>•</span>
            <span>Tailwind CSS</span>
            <span>•</span>
            <span>Framer Motion</span>
          </div>
          
          {/* 라이센스 */}
          <div className="text-xs text-gray-500 dark:text-gray-500">
            © 2025 Portfolio Website Template By g-hyeong
          </div>
        </div>
      </div>
    </footer>
  );
}