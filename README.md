# 포트폴리오 템플릿

Next.js와 TypeScript로 구축된 현대적이고 인터랙티브한 포트폴리오 웹사이트 템플릿입니다.

> **English Documentation**: [README-EN.md](./README-EN.md)


## 빠른 시작

### 방법 1: 템플릿으로 사용
1. 레포 클론
2. 의존성 설치: `npm install`
3. 개발 서버 실행: `npm run dev`
4. `src/data/` 폴더에서 데이터 커스터마이징

### 방법 2: Fork 및 Clone
```bash
git clone https://github.com/g-hyeong/Portfolio-Website-Template.git
cd Portfolio-Website-Template
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000)에서 포트폴리오를 확인하세요.

## 기술 스택

- Framework: Next.js 15 with App Router
- Language: TypeScript
- Styling: Tailwind CSS 4
- Animations: Framer Motion
- Icons: React Icons
- Deployment: Static Export for GitHub Pages

## 프로젝트 구조

```
portfolio-template/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── globals.css         # 전역 스타일
│   │   ├── layout.tsx          # 루트 레이아웃
│   │   └── page.tsx            # 메인 페이지
│   ├── components/             # 재사용 가능한 컴포넌트
│   │   ├── layout/             # 레이아웃 컴포넌트
│   │   │   ├── Header.tsx      # 네비게이션 헤더
│   │   │   └── Footer.tsx      # 크레딧 포함 푸터
│   │   └── sections/           # 페이지 섹션
│   │       ├── HeroSection.tsx        # 히어로/소개 섹션
│   │       ├── CareerSection.tsx      # 경력 및 경험
│   │       ├── ProjectsSection.tsx    # 프로젝트 쇼케이스
│   │       ├── SkillsSection.tsx      # 기술 및 테크놀로지
│   │       └── AchievementsSection.tsx # 수상 및 성취
│   ├── data/                   # 정적 데이터
│   │   ├── careers.ts          # 경력 정보
│   │   ├── projects.ts         # 프로젝트 포트폴리오
│   │   ├── skills.ts           # 기술 스킬
│   │   ├── achievements.ts     # 수상 및 자격증
│   │   ├── activities.ts       # 활동 및 참여
│   │   ├── notes.ts            # 블로그 포스트 및 노트
│   │   └── hero.ts             # 히어로 섹션 데이터
│   └── types/                  # TypeScript 정의
│       └── portfolio.ts        # 타입 정의
├── public/                     # 정적 자산
│   └── assets/                 # 이미지, 아이콘 등
├── .github/workflows/          # GitHub Actions
│   └── deploy.yml              # 배포 워크플로우
└── README.md                   # 문서
```

## GitHub Pages 배포

이 템플릿은 GitHub Actions를 사용한 GitHub Pages **자동 배포**로 구성되어 있습니다.

### 원클릭 설정

1. **GitHub Pages 활성화**:
   - 저장소 Settings로 이동
   - "Pages" 섹션으로 이동
   - Source: "GitHub Actions" 선택

2. **도메인 설정 (선택사항)**:
   - 저장소 Settings → Environments → github-pages
   - `CUSTOM_DOMAIN` 변수에 도메인 이름 추가
   - DNS A 레코드를 GitHub Pages IP로 업데이트:
     ```
     185.199.108.153
     185.199.109.153
     185.199.110.153
     185.199.111.153
     ```

3. **자동 배포**:
   - `main` 브랜치로 푸시하면 자동 빌드 및 배포 실행

### 수동 배포

```bash
# 프로덕션 빌드
npm run build

# 'out' 디렉터리에 결과물 생성
# 정적 호스팅 서비스에 콘텐츠 업로드
```

## 커스터마이징 가이드

### 1. 개인 정보 업데이트

`src/data/` 의 데이터 파일들을 편집하세요:

```typescript
// src/data/hero.ts
export const heroData: HeroData = {
  name: "당신의 이름",
  title: "당신의 직업 소개",
  highlights: [
    "주요 특징 1",
    "주요 특징 2",
    // ... 더 많은 특징들
  ],
  socialLinks: {
    github: "https://github.com/yourusername",
    linkedin: "https://linkedin.com/in/yourprofile",
    email: "mailto:your.email@example.com"
  }
};
```

```typescript
// src/data/careers.ts
export const careers: Career[] = [
  {
    company: '회사명',
    role: '역할',
    period: '2023.01 - 현재',
    logoPath: '/assets/icons/your-logo.png',
    descriptions: [
      {
        title: '담당 업무',
        details: ['성과 1', '성과 2']
      }
    ],
    techStacks: ['React', 'TypeScript', 'Node.js']
  }
];
```

### 2. 프로젝트 추가

```typescript
// src/data/projects.ts
const newProject: Project = {
  projectId: 'unique-id',
  title: '프로젝트 제목',
  subTitle: '간단한 설명',
  role: '담당 역할',
  period: '2023.01 - 2023.06',
  summary: '상세한 프로젝트 설명...',
  imagePaths: ['/assets/images/project-image.png'],
  architectureUrl: '/assets/images/architecture.png',
  features: ['기능 1', '기능 2'],
  implementations: ['기술 세부사항 1', '기술 세부사항 2'],
  techStack: ['React', 'Node.js'],
  githubUrl: 'https://github.com/username/project',
  demoUrl: 'https://demo.example.com',
  projectType: 'team' // 또는 'personal'
};
```

### 3. 메타데이터 업데이트

```typescript
// src/app/layout.tsx
export const metadata: Metadata = {
  title: "이름 - 포트폴리오",
  description: "전문 분야 설명",
  keywords: "키워드, 키워드2",
  authors: [{ name: "이름" }],
};
```

### 4. 새 노트 포스트 추가

#### 📝 기본 추가 과정

1. **Markdown 파일 생성**:
   `public/data/notePosts/` 디렉터리에 `.md` 파일을 새로 만듭니다.

   ```
   public/data/notePosts/my-new-post.md
   ```

2. **노트 메타데이터 추가**:
   `src/data/notes.ts` 파일의 `notes` 배열에 새 노트 정보를 추가합니다.

   ```typescript
   // src/data/notes.ts
   export const notes: NotePost[] = [
     // ... 기존 노트들
     {
       id: 'my-new-post',           // 파일명과 동일해야 함 (확장자 제외)
       slug: 'my-new-post',         // URL 슬러그 (보통 id와 동일)
       title: '새 포스트 제목',      // 표시될 제목
       summary: '포스트 요약...',    // 카드에 표시될 요약
       tags: ['React', 'TypeScript'], // 태그 배열
       category: 'theory',          // 카테고리 (아래 참조)
       priority: 85,                // 우선순위 (1-100, 높을수록 우선)
       linkedTexts: [               // 연결 텍스트 (선택사항)
         { text: '성능 최적화', strength: 85 },
       ],
       relatedNotes: ['other-post-id'], // 연관 노트 ID들
       color: '#3B82F6'             // 커스텀 색상 (선택사항)
     },
   ];
   ```

3. **빌드 확인**:
   `npm run dev` 실행 시 자동으로 전처리되어 HTML로 변환됩니다.

#### 📂 NotePost 타입 상세 설명

**필수 필드들:**
- `id`: 고유 식별자, 파일명과 일치해야 함
- `slug`: URL에 사용될 슬러그
- `title`: 노트 제목
- `summary`: 노트 카드에 표시될 요약 설명
- `tags`: 검색 및 필터링용 태그들
- `category`: 노트 분류 (아래 카테고리 참조)
- `priority`: 표시 우선순위 (1-100)

**고급 기능 필드들:**
- `linkedTexts`: 다른 노트에서 이 노트로 연결될 텍스트들
  - `text`: 연결될 텍스트 (문자열 또는 정규식)
  - `strength`: 연결 강도 (1-100)
  - `context`: 추가 컨텍스트 (선택사항)
- `relatedNotes`: 연관된 다른 노트들의 ID 배열
- `color`: 노트 카드의 커스텀 색상 (hex 코드)

#### 📚 카테고리 종류

```typescript
category: 'work'          // 업무 관련
       | 'project'        // 프로젝트 관련
       | 'theory'         // 이론 및 학습
       | 'design'         // 디자인 관련
       | 'experience'     // 경험 공유
       | 'retrospective'  // 회고 및 반성
       | 'record'         // 기록
       | 'achievement'    // 성과 및 성취
       | 'etc'            // 기타 (※ /notes 탭에서 보이지 않음)
```

> **참고**: `etc` 카테고리는 특별한 용도로, 포트폴리오의 `/notes` 탭에서는 표시되지 않습니다. 개인적인 메모나 임시 노트에 사용하세요.

#### 🖼️ 이미지 추가 방법

1. **이미지 파일 저장**:
   ```
   public/assets/noteImages/my-image.png
   ```

2. **Markdown에서 이미지 참조**:
   ```markdown
   ![이미지 설명](my-image.png)
   
   <!-- 파일명만 쓰면 자동으로 /assets/noteImages/ 경로에서 찾습니다 -->
   ![다른 이미지](diagram.jpg)
   ```

3. **권장 이미지 규칙**:
   - 파일명: 영문, 소문자, 하이픈 사용
   - 포맷: PNG, JPG, WebP
   - 크기: 적절한 해상도로 최적화
   - **경로 자동 처리**: 전처리 시스템이 자동으로 올바른 경로로 변환

#### 🔗 LinkedTexts 시스템

다른 노트에서 특정 텍스트를 클릭했을 때 이 노트로 연결되도록 하는 기능입니다.

```typescript
linkedTexts: [
  { 
    text: '성능 최적화',        // 정확한 텍스트 매칭
    strength: 85              // 우선순위 (높을수록 우선)
  },
  { 
    text: /React.*성능/,       // 정규식 패턴도 가능
    strength: 70,
    context: 'React 관련'      // 추가 컨텍스트
  }
]
```

#### 📝 Markdown 작성 팁

1. **표준 Markdown 지원**:
   - 제목: `# ## ###`
   - 목록: `- * +`
   - 코드: `` `code` `` 또는 ``` 
   - 링크: `[텍스트](URL)`

2. **GitHub Flavored Markdown 지원**:
   ```markdown
   # 테이블
   | 컬럼1 | 컬럼2 |
   |-------|-------|
   | 데이터1 | 데이터2 |
   
   # 체크리스트
   - [x] 완료된 작업
   - [ ] 미완료 작업
   
   # 코드 블록 (언어 지정)
   ```javascript
   const example = 'syntax highlighting';
   ```

3. **권장 구조**:
   ```markdown
   # 노트 제목
   
   간단한 서론...
   
   ## 주요 내용 1
   
   내용...
   
   ## 주요 내용 2
   
   내용...
   
   ## 결론
   
   마무리...
   ```

#### ⚡ 전처리 시스템

노트를 추가하면 다음 과정이 자동으로 실행됩니다:

1. **linkedTexts 최적화**: 빠른 검색을 위해 Trie 구조로 변환
2. **Markdown → HTML**: 전체 스타일링이 적용된 HTML로 변환
3. **이미지 최적화**: 경로 검증 및 최적화
4. **코드 하이라이팅**: 언어별 문법 강조 적용

#### 🎨 스타일 커스터마이징

노트별로 고유한 색상을 지정할 수 있습니다:

```typescript
{
  // ... 다른 필드들
  color: '#3B82F6'  // 파란색
  color: '#10B981'  // 초록색
  color: '#8B5CF6'  // 보라색
  color: '#F59E0B'  // 주황색
  color: '#EF4444'  // 빨간색
}
```

## 고급 커스터마이징

### 스타일링 및 테마

```css
/* src/app/globals.css - 커스텀 CSS 변수 */
:root {
  --primary-color: #3b82f6;
  --secondary-color: #8b5cf6;
  --accent-color: #06b6d4;
}
```

### 애니메이션 커스터마이징

```typescript
// Framer Motion variants 예시
const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};
```

### 새 섹션 추가

1. `src/components/sections/`에 컴포넌트 생성
2. `src/app/page.tsx`에 메인 페이지에 추가
3. `src/types/portfolio.ts`에서 타입 업데이트
4. `src/data/`에 데이터 파일 추가

## 개발

### 로컬 개발

```bash
# 의존성 설치
npm install

# 개발 서버 시작 (자동 전처리 포함)
npm run dev

# 프로덕션 빌드 (자동 전처리 포함)
npm run build

# 프로덕션 빌드 미리보기
npm start

# 수동 전처리 실행
npm run preprocess
```

### 자동 전처리 시스템

이 프로젝트는 개발 및 빌드 시 자동으로 실행되는 노트 매핑 및 마크다운 전처리 프로세스를 포함합니다:

#### 🔄 자동 실행
- `npm run dev` 실행 시 전처리가 자동으로 선행됩니다
- `npm run build` 실행 시에도 동일하게 전처리가 실행됩니다
- 별도의 수동 작업이 필요하지 않습니다

#### 📝 노트 연결 텍스트 최적화
- **소스**: `src/data/notes.ts`의 `linkedTexts` 정보
- **처리**: 트라이(Trie) 구조로 변환하여 빠른 텍스트 매칭 구현
- **출력**: `src/data/generated/linked-texts.json`
- **효과**: 런타임 검색 성능 대폭 향상

#### 📄 마크다운 사전 변환
- **소스**: `public/data/notePosts/*.md` 파일들
- **처리**: unified/remark/rehype 파이프라인으로 완전 스타일링된 HTML 생성
- **특징**:
  - GitHub Flavored Markdown 지원 (테이블, 체크리스트 등)
  - 코드 하이라이팅 (highlight.js)
  - 프로젝트 테마에 맞는 CSS 클래스 자동 적용
  - 이미지 경로 자동 최적화
  - URL 안전성 검증
- **출력**: `public/data/generated/html/*.html`
- **효과**: 런타임 마크다운 파싱 불필요, 빠른 페이지 로딩

#### ⚡ 성능 최적화
- **빌드 타임 처리**: 무거운 작업을 런타임에서 빌드 타임으로 이동
- **번들 크기 감소**: 클라이언트 사이드 처리 로직 최소화
- **일관된 스타일링**: 모든 마크다운이 프로젝트 테마로 일관되게 스타일링

#### 📁 자동 생성 파일들
```
src/data/generated/
└── linked-texts.json       # 최적화된 텍스트 링크 데이터

public/data/generated/html/
├── note1.html              # 사전 렌더링된 HTML 파일들
├── note2.html
└── ...
```

> **참고**: 생성된 파일들은 자동으로 만들어지므로 직접 편집하지 마세요.

### 환경 설정

```bash
# 환경 템플릿 복사
cp .env.example .env.local

# 환경 변수 추가
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```
### 분석 통합

```typescript
// Google Analytics를 위해 src/app/layout.tsx에 추가
<Script
  src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
  strategy="afterInteractive"
/>
```

## Support

ghyeongk@gmail.com

---

[g-hyeong](https://github.com/g-hyeong) 제작
