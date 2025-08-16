# 데이터베이스 설계 패턴

효율적인 데이터베이스 설계를 위한 다양한 패턴과 모범 사례들을 정리했습니다.

## 1. 정규화와 비정규화

### 정규화 (Normalization)
데이터 중복을 최소화하고 데이터 무결성을 보장하는 과정입니다.

```sql
-- 정규화된 테이블 구조
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL
);
```

### 비정규화 (Denormalization)
성능 향상을 위해 의도적으로 중복을 허용하는 기법입니다.

```sql
-- 비정규화된 테이블 (리포팅용)
CREATE TABLE user_order_summary (
    user_id INTEGER,
    user_name VARCHAR(100),
    total_orders INTEGER,
    total_amount DECIMAL(12,2),
    last_order_date TIMESTAMP
);
```

## 2. 인덱싱 전략

### 기본 인덱스
```sql
-- 기본 키는 자동으로 인덱스 생성
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2),
    category_id INTEGER
);

-- 외래 키에 인덱스 추가
CREATE INDEX idx_products_category ON products(category_id);

-- 복합 인덱스
CREATE INDEX idx_products_category_price ON products(category_id, price);
```

### 부분 인덱스
```sql
-- 조건부 인덱스
CREATE INDEX idx_active_users ON users(email) WHERE status = 'active';
```

## 3. 관계 설계 패턴

### One-to-Many
```sql
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category_id INTEGER REFERENCES categories(id)
);
```

### Many-to-Many
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

CREATE TABLE user_roles (
    user_id INTEGER REFERENCES users(id),
    role_id INTEGER REFERENCES roles(id),
    PRIMARY KEY (user_id, role_id)
);
```

## 4. 성능 최적화 패턴

### 파티셔닝
```sql
-- 날짜 기반 파티셔닝
CREATE TABLE orders (
    id SERIAL,
    user_id INTEGER,
    created_at DATE,
    amount DECIMAL(10,2)
) PARTITION BY RANGE (created_at);

CREATE TABLE orders_2023 PARTITION OF orders
    FOR VALUES FROM ('2023-01-01') TO ('2024-01-01');
```

### 캐싱 전략
```sql
-- 머터리얼라이즈드 뷰
CREATE MATERIALIZED VIEW monthly_sales AS
SELECT 
    DATE_TRUNC('month', created_at) as month,
    SUM(amount) as total_sales,
    COUNT(*) as order_count
FROM orders
GROUP BY DATE_TRUNC('month', created_at);

-- 주기적 갱신
REFRESH MATERIALIZED VIEW monthly_sales;
```

## 5. 데이터 타입 선택

### 적절한 데이터 타입 사용
```sql
-- 잘못된 예
CREATE TABLE bad_example (
    id VARCHAR(50),          -- 숫자인데 VARCHAR 사용
    price VARCHAR(20),       -- 금액인데 VARCHAR 사용
    created_at VARCHAR(50)   -- 날짜인데 VARCHAR 사용
);

-- 올바른 예
CREATE TABLE good_example (
    id SERIAL PRIMARY KEY,
    price DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT NOW()
);
```

## 6. 트랜잭션 설계

### ACID 속성 보장
```sql
BEGIN;
    UPDATE accounts SET balance = balance - 100 WHERE id = 1;
    UPDATE accounts SET balance = balance + 100 WHERE id = 2;
    INSERT INTO transactions (from_account, to_account, amount) 
    VALUES (1, 2, 100);
COMMIT;
```

## 결론

데이터베이스 설계는 애플리케이션의 성능과 확장성에 직접적인 영향을 미칩니다. 초기 설계 단계에서 충분한 고려와 계획이 필요하며, 지속적인 모니터링과 최적화가 중요합니다.