# Docker를 활용한 배포 전략

Docker 컨테이너를 활용한 효율적인 애플리케이션 배포 방법과 CI/CD 파이프라인 구축에 대해 설명합니다.

## Docker 기본 개념

### 컨테이너 vs 가상머신
- **컨테이너**: OS 커널을 공유하여 가벼운 가상화
- **가상머신**: 하드웨어를 가상화하여 완전한 OS 실행

### Dockerfile 작성
```dockerfile
# Next.js 애플리케이션 Dockerfile
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

## Docker Compose 활용

### 개발 환경 구성
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://user:password@db:5432/myapp
    depends_on:
      - db
      - redis
    volumes:
      - .:/app
      - /app/node_modules

  db:
    image: postgres:15
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

### 프로덕션 환경 구성
```yaml
version: '3.8'

services:
  app:
    image: myapp:latest
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
    deploy:
      replicas: 3
      resources:
        limits:
          memory: 512M
        reservations:
          memory: 256M

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    restart: unless-stopped
```

## CI/CD 파이프라인

### GitHub Actions 워크플로우
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v2
    
    - name: Login to DockerHub
      uses: docker/login-action@v2
      with:
        username: ${{ secrets.DOCKERHUB_USERNAME }}
        password: ${{ secrets.DOCKERHUB_TOKEN }}
    
    - name: Build and push Docker image
      uses: docker/build-push-action@v4
      with:
        context: .
        push: true
        tags: myapp:${{ github.sha }},myapp:latest
        cache-from: type=gha
        cache-to: type=gha,mode=max
    
    - name: Deploy to production
      uses: appleboy/ssh-action@v0.1.5
      with:
        host: ${{ secrets.HOST }}
        username: ${{ secrets.USERNAME }}
        key: ${{ secrets.PRIVATE_KEY }}
        script: |
          docker pull myapp:latest
          docker-compose down
          docker-compose up -d
          docker system prune -f
```

## 배포 전략

### Blue-Green 배포
```bash
#!/bin/bash

# 현재 활성 환경 확인
CURRENT=$(docker-compose ps -q app | wc -l)

if [ $CURRENT -eq 0 ]; then
    # 첫 배포
    docker-compose up -d
else
    # Blue-Green 배포
    docker-compose -f docker-compose.blue.yml up -d
    
    # 헬스 체크
    sleep 30
    if curl -f http://localhost:3001/health; then
        # 트래픽 전환
        docker-compose down
        docker-compose -f docker-compose.blue.yml down
        mv docker-compose.blue.yml docker-compose.yml
        docker-compose up -d
    else
        echo "Deployment failed"
        docker-compose -f docker-compose.blue.yml down
        exit 1
    fi
fi
```

### Rolling 업데이트
```yaml
version: '3.8'

services:
  app:
    image: myapp:latest
    deploy:
      replicas: 3
      update_config:
        parallelism: 1
        delay: 10s
        failure_action: rollback
        order: start-first
      rollback_config:
        parallelism: 1
        delay: 5s
```

## 모니터링과 로깅

### 로그 수집
```yaml
services:
  app:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

### 헬스 체크
```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1
```

## 보안 고려사항

### 멀티스테이지 빌드
- 프로덕션 이미지에서 개발 의존성 제거
- 최소한의 런타임 환경 구성

### 비루트 사용자
```dockerfile
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs
```

### 시크릿 관리
```yaml
services:
  app:
    secrets:
      - db_password
      - api_key

secrets:
  db_password:
    external: true
  api_key:
    external: true
```

## 결론

Docker를 활용한 배포는 일관된 환경, 확장성, 그리고 효율적인 리소스 관리를 제공합니다. 적절한 CI/CD 파이프라인과 함께 사용하면 안정적이고 빠른 배포가 가능합니다.