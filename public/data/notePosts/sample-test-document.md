# 샘플 테스트 문서

이 문서는 마크다운 전처리 시스템을 테스트하기 위한 샘플 문서입니다.

## 주요 기능

### 1. 마크다운 문법 테스트

다양한 마크다운 문법이 제대로 HTML로 변환되는지 확인합니다:

- **굵은 글씨** 처리
- *기울임* 처리  
- `코드 스팬` 처리
- [링크](https://example.com) 처리

### 2. 코드 블록

```javascript
function testMarkdown() {
  console.log("마크다운 전처리가 잘 되고 있나요?");
  return "성공!";
}
```

```python  
def hello_world():
    print("Python 코드도 하이라이팅이 될까요?")
    return True

# 클래스와 함수 정의
class DataProcessor:
    def __init__(self, data):
        self.data = data
    
    def process(self):
        """데이터를 처리하는 함수"""
        result = []
        for item in self.data:
            if isinstance(item, str):
                result.append(item.upper())
        return result
```

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

const fetchUser = async (id: number): Promise<User> => {
  const response = await fetch(`/api/users/${id}`);
  const user: User = await response.json();
  return user;
};

// React Hook 예시
const useUser = (id: number) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchUser(id).then(setUser).finally(() => setLoading(false));
  }, [id]);
  
  return { user, loading };
};
```

### 3. 목록 처리 (계층적 테스트)

#### 순서가 있는 목록
1. 첫 번째 항목
   1. 하위 항목 1-1
   2. 하위 항목 1-2
      1. 더 깊은 항목 1-2-1
      2. 더 깊은 항목 1-2-2
         1. 최대 깊이 항목 1-2-2-1
2. 두 번째 항목
   1. 하위 항목 2-1
3. 세 번째 항목

#### 순서가 없는 목록
- 항목 A
  - 하위 항목 A-1
  - 하위 항목 A-2
    - 더 깊은 항목 A-2-1
    - 더 깊은 항목 A-2-2
      - 최대 깊이 항목 A-2-2-1
- 항목 B
  - 하위 항목 B-1
- 항목 C

### 4. 인용문 및 코드 스팬 테스트

> 이것은 인용문입니다. 
> 마크다운 전처리 시스템이 제대로 작동한다면
> 이 텍스트가 스타일이 적용된 인용문으로 표시될 것입니다.

인라인 코드 예시: `console.log("Hello World")`, `npm install`, `useState`, `async/await`

더 많은 인라인 코드: `React.useState()`, `document.querySelector(".class")`, `Object.keys(data)`, `Array.map()` 등을 테스트해보세요.

> **중요한 노트**: 이것은 중요한 인용문입니다. 
> `코드 스팬`도 인용문 안에서 잘 작동해야 합니다.

### 5. 표

| 항목 | 설명 | 상태 |
|------|------|------|
| 전처리 | 마크다운→HTML 변환 | ✅ |
| 렌더링 | HTML 직접 표시 | ✅ |
| 최적화 | ReactMarkdown 제거 | ✅ |

## 결론

이 문서를 통해 다음 사항들을 확인할 수 있습니다:

1. **unified** 라이브러리를 통한 마크다운→HTML 변환
2. **빌드 시점 전처리**로 런타임 성능 최적화
3. **개별 HTML 파일** 생성 및 정적 서빙
4. **ReactMarkdown 제거**로 번들 크기 감소

모든 기능이 정상 작동한다면 마크다운 전처리 시스템 구현이 성공적으로 완료된 것입니다! 🎉