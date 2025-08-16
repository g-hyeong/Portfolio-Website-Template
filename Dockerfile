# Node.js 20 기반의 개발용 Dockerfile
FROM node:20

# 작업 디렉토리 설정
WORKDIR /app

# 모든 파일 복사
COPY . .

# 의존성 설치
RUN npm install

# 포트 노출
EXPOSE 3000

# 개발 서버 실행 (hot reload 지원)
CMD ["npm", "run", "dev"] 