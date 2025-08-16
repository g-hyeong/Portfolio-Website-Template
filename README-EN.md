# Portfolio Template

A modern and interactive portfolio website template built with Next.js and TypeScript.

> **Korean Documentation**: [README.md](./README.md)


## Quick Start

### Method 1: Use as a Template
1. Clone the repository
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
4. Customize data in the `src/data/` folder

### Method 2: Fork and Clone
```bash
git clone https://github.com/g-hyeong/Portfolio-Website-Template.git
cd Portfolio-Website-Template
npm install
npm run dev
```

Check your portfolio at [http://localhost:3000](http://localhost:3000).

## Tech Stack

- Framework: Next.js 15 with App Router
- Language: TypeScript
- Styling: Tailwind CSS 4
- Animations: Framer Motion
- Icons: React Icons
- Deployment: Static Export for GitHub Pages

## Project Structure

```
portfolio-template/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── globals.css         # Global styles
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Main page
│   ├── components/             # Reusable components
│   │   ├── layout/             # Layout components
│   │   │   ├── Header.tsx      # Navigation header
│   │   │   └── Footer.tsx      # Footer with credits
│   │   └── sections/           # Page sections
│   │       ├── HeroSection.tsx        # Hero/intro section
│   │       ├── CareerSection.tsx      # Career and experience
│   │       ├── ProjectsSection.tsx    # Project showcase
│   │       ├── SkillsSection.tsx      # Skills and technologies
│   │       └── AchievementsSection.tsx # Awards and achievements
│   ├── data/                   # Static data
│   │   ├── careers.ts          # Career information
│   │   ├── projects.ts         # Project portfolio
│   │   ├── skills.ts           # Technical skills
│   │   ├── achievements.ts     # Awards and certifications
│   │   ├── activities.ts       # Activities and involvement
│   │   ├── notes.ts            # Blog posts and notes
│   │   └── hero.ts             # Hero section data
│   └── types/                  # TypeScript definitions
│       └── portfolio.ts        # Type definitions
├── public/                     # Static assets
│   └── assets/                 # Images, icons, etc.
├── .github/workflows/          # GitHub Actions
│   └── deploy.yml              # Deployment workflow
└── README.md                   # Documentation
```

## GitHub Pages Deployment

This template is configured for **automatic deployment** to GitHub Pages using GitHub Actions.

### One-Click Setup

1. **Enable GitHub Pages**:
   - Go to your repository Settings
   - Navigate to the "Pages" section
   - Select Source: "GitHub Actions"

2. **Set Domain (Optional)**:
   - Go to repository Settings → Environments → github-pages
   - Add your domain name to the `CUSTOM_DOMAIN` variable
   - Update your DNS A records to the GitHub Pages IPs:
     ```
     185.199.108.153
     185.199.109.153
     185.199.110.153
     185.199.111.153
     ```

3. **Automatic Deployment**:
   - Pushing to the `main` branch will automatically trigger a build and deployment.

### Manual Deployment

```bash
# Production build
npm run build

# Generates output in the 'out' directory
# Upload the contents to your static hosting service
```

## Customization Guide

### 1. Update Personal Information

Edit the data files in `src/data/`:

```typescript
// src/data/hero.ts
export const heroData: HeroData = {
  name: "Your Name",
  title: "Your Job Title",
  highlights: [
    "Key feature 1",
    "Key feature 2",
    // ... more features
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
    company: 'Company Name',
    role: 'Your Role',
    period: '2023.01 - Present',
    logoPath: '/assets/icons/your-logo.png',
    descriptions: [
      {
        title: 'Responsibilities',
        details: ['Achievement 1', 'Achievement 2']
      }
    ],
    techStacks: ['React', 'TypeScript', 'Node.js']
  }
];
```

### 2. Add a Project

```typescript
// src/data/projects.ts
const newProject: Project = {
  projectId: 'unique-id',
  title: 'Project Title',
  subTitle: 'Brief description',
  role: 'Your Role',
  period: '2023.01 - 2023.06',
  summary: 'Detailed project description...',
  imagePaths: ['/assets/images/project-image.png'],
  architectureUrl: '/assets/images/architecture.png',
  features: ['Feature 1', 'Feature 2'],
  implementations: ['Technical detail 1', 'Technical detail 2'],
  techStack: ['React', 'Node.js'],
  githubUrl: 'https://github.com/username/project',
  demoUrl: 'https://demo.example.com',
  projectType: 'team' // or 'personal'
};
```

### 3. Update Metadata

```typescript
// src/app/layout.tsx
export const metadata: Metadata = {
  title: "Name - Portfolio",
  description: "Description of your expertise",
  keywords: "keyword1, keyword2",
  authors: [{ name: "Your Name" }],
};
```

### 4. Add a New Note Post

#### 📝 Basic Adding Process

1.  **Create a Markdown File**:
    Create a new `.md` file in the `public/data/notePosts/` directory.

    ```
    public/data/notePosts/my-new-post.md
    ```

2.  **Add Note Metadata**:
    Add information about the new note to the `notes` array in the `src/data/notes.ts` file.

    ```typescript
    // src/data/notes.ts
    export const notes: NotePost[] = [
      // ... existing notes
      {
        id: 'my-new-post',           // Must be the same as the filename (without extension)
        slug: 'my-new-post',         // URL slug (usually the same as id)
        title: 'New Post Title',      // Display title
        summary: 'Post summary...',    // Summary to display on cards
        tags: ['React', 'TypeScript'], // Array of tags
        category: 'theory',          // Category (see below)
        priority: 85,                // Priority (1-100, higher is more important)
        linkedTexts: [               // Linked texts (optional)
          { text: 'Performance Optimization', strength: 85 },
        ],
        relatedNotes: ['other-post-id'], // IDs of related notes
        color: '#3B82F6'             // Custom color (optional)
      },
    ];
    ```

3.  **Check the Build**:
    Running `npm run dev` will automatically preprocess and convert the new note to HTML.

#### 📂 NotePost Type Details

**Required Fields:**
-   `id`: Unique identifier, must match the filename
-   `slug`: Slug used in the URL
-   `title`: Note title
-   `summary`: Summary description for note cards
-   `tags`: Tags for searching and filtering
-   `category`: Note classification (see categories below)
-   `priority`: Display priority (1-100)

**Advanced Feature Fields:**
-   `linkedTexts`: Texts that link to this note from other notes
    -   `text`: Text to link (string or regex)
    -   `strength`: Link strength (1-100)
    -   `context`: Additional context (optional)
-   `relatedNotes`: Array of IDs of other related notes
-   `color`: Custom color for the note card (hex code)

#### 📚 Category Types

```typescript
category: 'work'          // Work-related
       | 'project'        // Project-related
       | 'theory'         // Theory and learning
       | 'design'         // Design-related
       | 'experience'     // Sharing experiences
       | 'retrospective'  // Retrospectives and reflections
       | 'record'         // Records
       | 'achievement'    // Accomplishments and achievements
       | 'etc'            // Other (※ Not shown in the /notes tab)
```

> **Note**: The `etc` category is for special purposes and will not be displayed in the `/notes` tab of the portfolio. Use it for personal memos or temporary notes.

#### 🖼️ How to Add Images

1.  **Save the Image File**:
    ```
    public/assets/noteImages/my-image.png
    ```

2.  **Reference the Image in Markdown**:
    ```markdown
    ![Image description](my-image.png)
    
    <!-- Using just the filename automatically finds it in the /assets/noteImages/ path -->
    ![Another image](diagram.jpg)
    ```

3.  **Recommended Image Rules**:
    -   Filename: English, lowercase, use hyphens
    -   Format: PNG, JPG, WebP
    -   Size: Optimize for an appropriate resolution
    -   **Automatic Path Handling**: The preprocessing system automatically converts to the correct path.

#### 🔗 LinkedTexts System

A feature that allows linking to this note when specific text is clicked in other notes.

```typescript
linkedTexts: [
  { 
    text: 'Performance Optimization', // Exact text match
    strength: 85              // Priority (higher is more important)
  },
  { 
    text: /React.*performance/, // Regex patterns are also possible
    strength: 70,
    context: 'React-related'      // Additional context
  }
]
```

#### 📝 Markdown Writing Tips

1.  **Standard Markdown Support**:
    -   Headings: `# ## ###`
    -   Lists: `- * +`
    -   Code: `` `code` `` or ```
    -   Links: `[Text](URL)`

2.  **GitHub Flavored Markdown Support**:
    ```markdown
    # Table
    | Column 1 | Column 2 |
    |----------|----------|
    | Data 1   | Data 2   |
    
    # Checklist
    - [x] Completed task
    - [ ] Incomplete task
    
    # Code Block (with language specification)
    ```javascript
    const example = 'syntax highlighting';
    ```

3.  **Recommended Structure**:
    ```markdown
    # Note Title
    
    A brief introduction...
    
    ## Main Content 1
    
    Content...
    
    ## Main Content 2
    
    Content...
    
    ## Conclusion
    
    Wrap-up...
    ```

#### ⚡ Preprocessing System

When you add a note, the following processes run automatically:

1.  **linkedTexts Optimization**: Converts to a Trie structure for fast searching
2.  **Markdown → HTML**: Converts to fully styled HTML
3.  **Image Optimization**: Path validation and optimization
4.  **Code Highlighting**: Applies syntax highlighting for different languages

#### 🎨 Style Customization

You can assign a unique color to each note:

```typescript
{
  // ... other fields
  color: '#3B82F6'  // Blue
  color: '#10B981'  // Green
  color: '#8B5CF6'  // Purple
  color: '#F59E0B'  // Orange
  color: '#EF4444'  // Red
}
```

## Advanced Customization

### Styling and Theme

```css
/* src/app/globals.css - Custom CSS variables */
:root {
  --primary-color: #3b82f6;
  --secondary-color: #8b5cf6;
  --accent-color: #06b6d4;
}
```

### Animation Customization

```typescript
// Framer Motion variants example
const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};
```

### Adding a New Section

1. Create a component in `src/components/sections/`
2. Add it to the main page in `src/app/page.tsx`
3. Update types in `src/types/portfolio.ts`
4. Add a data file in `src/data/`

## Development

### Local Development

```bash
# Install dependencies
npm install

# Start development server (with automatic preprocessing)
npm run dev

# Production build (with automatic preprocessing)
npm run build

# Preview production build
npm start

# Run preprocessing manually
npm run preprocess
```

### Automatic Preprocessing System

This project includes a note mapping and Markdown preprocessing system that runs automatically during development and builds:

#### 🔄 Automatic Execution
- Preprocessing runs automatically before `npm run dev`
- It also runs before `npm run build`
- No separate manual steps are required

#### 📝 Note Linked Text Optimization
- **Source**: `linkedTexts` info in `src/data/notes.ts`
- **Processing**: Converts to a Trie structure for fast text matching
- **Output**: `src/data/generated/linked-texts.json`
- **Effect**: Significantly improves runtime search performance

#### 📄 Markdown Pre-conversion
- **Source**: `public/data/notePosts/*.md` files
- **Processing**: Generates fully styled HTML using a unified/remark/rehype pipeline
- **Features**:
  - GitHub Flavored Markdown support (tables, checklists, etc.)
  - Code highlighting (highlight.js)
  - Automatic application of CSS classes matching the project theme
  - Automatic image path optimization
  - URL safety validation
- **Output**: `public/data/generated/html/*.html`
- **Effect**: No runtime Markdown parsing needed, leading to faster page loads

#### ⚡ Performance Optimization
- **Build-Time Processing**: Moves heavy tasks from runtime to build time
- **Bundle Size Reduction**: Minimizes client-side processing logic
- **Consistent Styling**: All Markdown is styled consistently with the project theme

#### 📁 Automatically Generated Files
```
src/data/generated/
└── linked-texts.json       # Optimized text link data

public/data/generated/html/
├── note1.html              # Pre-rendered HTML files
├── note2.html
└── ...
```

> **Note**: Do not edit the generated files directly as they are created automatically.

### Environment Configuration

```bash
# Copy the environment template
cp .env.example .env.local

# Add environment variables
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```
### Analytics Integration

```typescript
// Add to src/app/layout.tsx for Google Analytics
<Script
  src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
  strategy="afterInteractive"
/>
```

## Support

ghyeongk@gmail.com

---

Created by [g-hyeong](https://github.com/g-hyeong)