# AWS 아키텍처 설계 회고

대규모 웹 애플리케이션을 위한 AWS 클라우드 아키텍처 설계 과정과 배운 점들을 정리했습니다.

## 프로젝트 개요

### 요구사항
- 월 1000만 PV 처리 가능한 웹 애플리케이션
- 99.9% 가용성 보장
- 글로벌 사용자 대응
- 비용 효율적인 운영

### 초기 아키텍처 설계

```
Internet Gateway
       ↓
Application Load Balancer
       ↓
Auto Scaling Group (EC2)
       ↓
RDS (Multi-AZ)
```

## 아키텍처 진화 과정

### 1단계: 기본 3-Tier 아키텍처

```yaml
# 초기 설정
VPC: 10.0.0.0/16
Public Subnets: 10.0.1.0/24, 10.0.2.0/24
Private Subnets: 10.0.10.0/24, 10.0.20.0/24
Database Subnets: 10.0.100.0/24, 10.0.200.0/24
```

**문제점:**
- 단일 리전으로 인한 가용성 위험
- 정적 자산 로딩 속도 이슈
- 데이터베이스 성능 병목

### 2단계: CDN 및 캐싱 도입

```
CloudFront (CDN)
       ↓
S3 (Static Assets)
       ↓
Application Load Balancer
       ↓
Auto Scaling Group
       ↓
ElastiCache (Redis)
       ↓
RDS (Read Replica 추가)
```

**개선점:**
- CloudFront로 글로벌 캐싱
- Redis로 세션 및 데이터 캐싱
- RDS Read Replica로 읽기 성능 향상

### 3단계: 마이크로서비스 아키텍처

```
API Gateway
       ↓
Lambda Functions (Serverless)
       ↓
SQS/SNS (Message Queue)
       ↓
DynamoDB (NoSQL)
       ↓
RDS (Core Data)
```

## 주요 의사결정과 근거

### 1. EC2 vs Lambda
```python
# Lambda 함수 예시
import json
import boto3

def lambda_handler(event, context):
    # 이벤트 처리 로직
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('users')
    
    response = table.get_item(
        Key={'user_id': event['user_id']}
    )
    
    return {
        'statusCode': 200,
        'body': json.dumps(response['Item'])
    }
```

**선택 기준:**
- **Lambda**: 비정기적, 짧은 실행 시간
- **EC2**: 장시간 실행, 상태 유지 필요

### 2. RDS vs DynamoDB
```sql
-- RDS (관계형 데이터)
SELECT u.name, COUNT(o.id) as order_count
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id;
```

```python
# DynamoDB (NoSQL)
import boto3

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('user-orders')

response = table.query(
    KeyConditionExpression=Key('user_id').eq('123')
)
```

**선택 기준:**
- **RDS**: 복잡한 쿼리, 트랜잭션 필요
- **DynamoDB**: 높은 확장성, 단순한 쿼리

### 3. Application Load Balancer vs Network Load Balancer

```yaml
# ALB 설정
Type: Application
Scheme: internet-facing
Listeners:
  - Port: 80
    Protocol: HTTP
    Default Actions:
      - Type: redirect
        RedirectConfig:
          Protocol: HTTPS
          Port: 443
          StatusCode: HTTP_301
  - Port: 443
    Protocol: HTTPS
    Certificates:
      - CertificateArn: arn:aws:acm:...
```

**선택한 이유:**
- HTTP/HTTPS 트래픽 처리
- 경로 기반 라우팅 필요
- SSL/TLS 종료 기능

## 성능 최적화

### CloudWatch 모니터링
```python
import boto3

cloudwatch = boto3.client('cloudwatch')

# 커스텀 메트릭 전송
cloudwatch.put_metric_data(
    Namespace='MyApp/Performance',
    MetricData=[
        {
            'MetricName': 'ResponseTime',
            'Value': response_time,
            'Unit': 'Milliseconds',
            'Dimensions': [
                {
                    'Name': 'Environment',
                    'Value': 'production'
                }
            ]
        }
    ]
)
```

### Auto Scaling 정책
```yaml
AutoScalingPolicy:
  - PolicyName: ScaleUpPolicy
    ScalingAdjustment: 2
    Cooldown: 300
    MetricName: CPUUtilization
    ComparisonOperator: GreaterThanThreshold
    Threshold: 70
  
  - PolicyName: ScaleDownPolicy
    ScalingAdjustment: -1
    Cooldown: 300
    MetricName: CPUUtilization
    ComparisonOperator: LessThanThreshold
    Threshold: 30
```

## 비용 최적화

### Reserved Instances vs Spot Instances
```bash
# 비용 분석 스크립트
aws ce get-cost-and-usage \
    --time-period Start=2023-01-01,End=2023-12-31 \
    --granularity MONTHLY \
    --metrics BlendedCost \
    --group-by Type=DIMENSION,Key=SERVICE
```

**전략:**
- 기본 용량: Reserved Instances (1년 예약)
- 피크 트래픽: Spot Instances
- 버스트 트래픽: On-Demand Instances

### S3 스토리지 클래스
```yaml
LifecycleConfiguration:
  Rules:
    - Status: Enabled
      Transitions:
        - Days: 30
          StorageClass: STANDARD_IA
        - Days: 90
          StorageClass: GLACIER
        - Days: 365
          StorageClass: DEEP_ARCHIVE
```

## 보안 고려사항

### IAM 역할 기반 액세스
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:Query"
      ],
      "Resource": "arn:aws:dynamodb:region:account:table/MyTable"
    }
  ]
}
```

### VPC 보안 그룹
```yaml
SecurityGroups:
  WebTier:
    - Protocol: TCP
      Port: 80,443
      Source: 0.0.0.0/0
  
  AppTier:
    - Protocol: TCP
      Port: 8080
      Source: WebTier-SG
  
  DatabaseTier:
    - Protocol: TCP
      Port: 5432
      Source: AppTier-SG
```

## 배운 점들

### 1. 점진적 마이그레이션
- 한 번에 모든 것을 바꾸지 말고 단계적으로 진행
- 각 단계별로 충분한 테스트와 모니터링

### 2. 비용 모니터링의 중요성
- 예상보다 높은 데이터 전송 비용
- CloudWatch 로그 저장 비용 최적화 필요

### 3. 장애 대응 계획
```bash
# 장애 시나리오별 대응 스크립트
#!/bin/bash

case $1 in
  "database")
    # RDS 페일오버
    aws rds failover-db-cluster --db-cluster-identifier myapp-cluster
    ;;
  "application")
    # Auto Scaling 강제 스케일아웃
    aws autoscaling set-desired-capacity --auto-scaling-group-name myapp-asg --desired-capacity 10
    ;;
esac
```

## 결론

AWS 아키텍처 설계는 비즈니스 요구사항, 성능, 비용, 보안을 모두 고려해야 하는 복합적인 과정입니다. 중요한 것은 초기에 완벽한 설계보다는 요구사항 변화에 따라 유연하게 진화할 수 있는 구조를 만드는 것입니다.

### 권장사항
1. Well-Architected Framework 활용
2. 정기적인 비용 검토
3. 자동화된 모니터링 및 알림
4. 재해 복구 계획 수립
5. 지속적인 성능 최적화