# React 성능 최적화 기법

React 애플리케이션의 성능을 향상시키기 위한 다양한 최적화 기법들을 정리해보겠습니다.

## 1. React.memo와 useMemo

불필요한 리렌더링을 방지하기 위해 React.memo와 useMemo를 활용할 수 있습니다.

```jsx
// React.memo 사용
const ExpensiveComponent = React.memo(({ data }) => {
  return <div>{data.map(item => <Item key={item.id} data={item} />)}</div>;
});

// useMemo 사용
const expensiveValue = useMemo(() => {
  return data.filter(item => item.active).map(item => item.value);
}, [data]);
```

## 2. 가상화 (Virtualization)

대량의 데이터를 렌더링할 때는 가상화 기법을 사용하여 성능을 개선할 수 있습니다.

```jsx
import { FixedSizeList as List } from 'react-window';

const VirtualizedList = ({ items }) => (
  <List
    height={600}
    itemCount={items.length}
    itemSize={35}
  >
    {({ index, style }) => (
      <div style={style}>
        {items[index].name}
      </div>
    )}
  </List>
);
```

## 3. 코드 분할 (Code Splitting)

동적 import를 사용하여 번들 크기를 줄이고 초기 로딩 시간을 개선할 수 있습니다.

```jsx
const LazyComponent = React.lazy(() => import('./LazyComponent'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyComponent />
    </Suspense>
  );
}
```

## 4. 이미지 최적화

Next.js의 Image 컴포넌트를 사용하여 이미지를 최적화할 수 있습니다.

```jsx
import Image from 'next/image';

<Image
  src="/path/to/image.jpg"
  alt="Description"
  width={500}
  height={300}
  priority
  placeholder="blur"
/>
```

## 결론

React 성능 최적화는 단순히 하나의 기법만으로는 해결되지 않습니다. 애플리케이션의 특성에 맞는 적절한 최적화 기법들을 조합하여 사용하는 것이 중요합니다.