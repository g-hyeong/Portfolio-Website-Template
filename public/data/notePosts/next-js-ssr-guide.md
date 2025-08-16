# Next.js SSR 완벽 가이드

Next.js의 Server-Side Rendering(SSR)에 대한 상세한 가이드와 실무 적용 사례를 다룹니다.

## SSR vs CSR vs SSG

### Server-Side Rendering (SSR)
- 서버에서 HTML을 생성하여 클라이언트에 전송
- SEO에 유리하고 초기 로딩이 빠름
- 서버 부하가 있을 수 있음

### Client-Side Rendering (CSR)
- 클라이언트에서 JavaScript로 DOM을 생성
- 인터랙티브한 사용자 경험
- 초기 로딩이 느릴 수 있음

### Static Site Generation (SSG)
- 빌드 시점에 HTML을 미리 생성
- 가장 빠른 로딩 속도
- 동적 데이터 처리에 제한

## getServerSideProps 활용

```jsx
export async function getServerSideProps(context) {
  const { req, res, query } = context;
  
  // 서버에서 데이터 패칭
  const data = await fetchData(query.id);
  
  // 404 처리
  if (!data) {
    return {
      notFound: true,
    };
  }
  
  // 리다이렉트
  if (data.redirectTo) {
    return {
      redirect: {
        destination: data.redirectTo,
        permanent: false,
      },
    };
  }
  
  return {
    props: {
      data,
    },
  };
}
```

## 데이터 패칭 최적화

### SWR 사용
```jsx
import useSWR from 'swr';

function Profile() {
  const { data, error } = useSWR('/api/user', fetcher);
  
  if (error) return <div>Failed to load</div>;
  if (!data) return <div>Loading...</div>;
  
  return <div>Hello {data.name}!</div>;
}
```

### React Query 사용
```jsx
import { useQuery } from 'react-query';

function Posts() {
  const { data, isLoading, error } = useQuery('posts', fetchPosts);
  
  if (isLoading) return 'Loading...';
  if (error) return 'An error occurred';
  
  return (
    <ul>
      {data.map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
```

## 성능 최적화

### 동적 라우팅
```jsx
// pages/posts/[id].js
export async function getServerSideProps({ params }) {
  const post = await getPost(params.id);
  
  return {
    props: {
      post,
    },
  };
}
```

### 캐싱 전략
```jsx
export async function getServerSideProps({ res }) {
  // 캐시 헤더 설정
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=10, stale-while-revalidate=59'
  );
  
  const data = await fetchData();
  
  return {
    props: {
      data,
    },
  };
}
```

## 실무 팁

1. **API 라우트 활용**: `/pages/api` 디렉토리를 활용하여 백엔드 API 구축
2. **미들웨어 사용**: 인증, 로깅 등을 위한 미들웨어 구성
3. **환경변수 관리**: `.env.local` 파일을 통한 환경변수 관리
4. **타입스크립트 적용**: 타입 안정성을 위한 TypeScript 사용

## 결론

Next.js의 SSR은 SEO와 성능을 동시에 만족시킬 수 있는 강력한 기능입니다. 프로젝트의 요구사항에 맞게 적절한 렌더링 전략을 선택하는 것이 중요합니다.