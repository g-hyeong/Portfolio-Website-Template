export interface HeroData {
  name: string;
  title: string;
  highlights: string[];
  profileImage: {
    src: string;
    alt: string;
  };
  interests: string[];
  socialLinks: {
    github?: string;
    linkedin?: string;
    email?: string;
  };
  backgroundElements: Array<{
    width: number;
    height: number;
    top: number;
    left: number;
  }>;
  cta: {
    primaryText: string;
    primaryAction: string;
  };
}

export const heroData: HeroData = {
  name: "홍길동",
  title: "안녕하세요, 사용자 경험을 중시하며 깔끔한 코드를 작성하는 개발자",
  highlights: [
    "사용자 중심의 직관적인 인터페이스 설계에 관심이 많습니다.",
    "효율적이고 유지보수가 쉬운 코드 작성을 지향합니다.",
    "새로운 기술 학습과 팀 협업을 통한 성장을 즐깁니다.",
    "문제 해결 과정에서 창의적인 접근 방식을 찾아내는 것을 좋아합니다."
  ],
  profileImage: {
    src: "/assets/images/sample_image.png",
    alt: "Profile"
  },
  interests: [
    "Web Development",
    "Mobile Apps", 
    "UI/UX Design",
    "Cloud Computing"
  ],
  socialLinks: {
    github: "https://github.com/yourusername",
    linkedin: "https://linkedin.com/in/yourprofile",
    email: "mailto:your.email@example.com"
  },
  backgroundElements: [
    { width: 319, height: 192, top: 17, left: 45 },
    { width: 262, height: 319, top: 53, left: 65 },
    { width: 354, height: 268, top: 23, left: 82 },
    { width: 270, height: 261, top: 81, left: 26 },
    { width: 241, height: 361, top: 32, left: 34 }
  ],
  cta: {
    primaryText: "프로젝트 보기",
    primaryAction: "projects"
  }
};