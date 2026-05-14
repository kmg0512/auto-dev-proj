# Phase 6: System Requirement Specification (SRS) - GuildRoutine

| 문서 번호 | GR-SRS-001 | 프로젝트 명 | GuildRoutine (소셜 AI 습관 형성 RPG) |
| :--- | :--- | :--- | :--- |
| **버전** | v1.0.0 | **작성일** | 2026-05-14 |
| **작성자** | Senior PM & ISO Expert Agent | **상태** | Draft (Internal Review) |

---

## 1. 개요 (Introduction)

### 1.1 목적 (Purpose)
본 문서는 'GuildRoutine' 서비스의 핵심 기능 및 비기능적 요구사항을 정의하며, ISO/IEC/IEEE 29148 표준을 준수하여 작성되었습니다. 개발팀에게는 명확한 구현 지침을 제공하고, QA팀에게는 검증 기준을, 이해관계자에게는 비즈니스 목표 달성을 위한 기준점(Baseline)을 제공하는 것을 목적으로 합니다.

### 1.2 시스템 범위 (System Scope)
* **모바일 클라이언트:** Flutter 기반의 크로스 플랫폼 앱 (iOS, Android).
* **백엔드 서버:** NestJS 기반의 마이크로서비스 아키텍처 및 실시간 통신 서버.
* **AI 엔진:** OpenAI API를 활용한 습관 데이터의 판타지 퀘스트 변환 엔진.
* **수익 모델:** AdMob SDK 연동을 통한 게이미피케이션 광고 수익화 모듈.

---

## 2. 요구사항 명세 (Requirement Specification)

### 2.1 기능적 요구사항 (Functional Requirements)

| ID | 요구사항 명칭 | 요구사항 상세 설명 | 검증 기준 (Verifiability) | 추적성 (Traceability) |
| :--- | :--- | :--- | :--- | :--- |
| **GR-FR-101** | AI 퀘스트 생성 | 사용자가 입력한 자연어 습관 데이터를 AI가 판타지 스타일의 퀘스트명과 설명으로 변환한다. | 입력 후 3초 이내에 변환된 텍스트가 반환되어야 함. | Phase 1 (Core Value) |
| **GR-FR-102** | 길드 레이드 시스템 | 길드원이 습관을 완료할 때마다 실시간으로 보스 몬스터에게 데미지가 반영되어야 한다. | Socket.io를 통해 접속 중인 모든 길드원에게 500ms 이내에 동기화되어야 함. | Phase 2 (WebSockets) |
| **GR-FR-103** | 보상형 광고 연동 | 유저가 스트릭(연속 달성) 실패 시 보상형 광고를 시청하면 기록을 복구해준다. | 광고 시청 완료 이벤트 수신 후 즉시 DB의 `streak_count`가 복구되어야 함. | Phase 1 (BM) |
| **GR-FR-104** | AI 결과 캐싱 | 동일하거나 유사한 키워드의 습관 데이터는 AI API를 호출하지 않고 캐시에서 즉시 반환한다. | Redis 캐시 히트 시 응답 시간이 100ms 이내여야 함. | Phase 2 (Redis) |

### 2.2 비기능적 요구사항 (Non-functional Requirements)

| ID | 구분 | 요구사항 상세 설명 | 검증 기준 (Verifiability) | 추적성 (Traceability) |
| :--- | :--- | :--- | :--- | :--- |
| **GR-NFR-201** | 가용성 (Availability) | 서비스는 연중무휴 중단 없이 운영되어야 한다. | 가동률(Uptime) 99.9% 이상 유지 (Blue/Green 배포 적용). | Phase 4 (CI/CD) |
| **GR-NFR-202** | 보안 (Security) | 모든 API 통신은 보안 프로토콜을 준수하며 사용자 데이터는 보호되어야 한다. | OAuth 2.0 인증 적용 및 HTTPS 암호화 통신 필수. | Phase 2 (Security) |
| **GR-NFR-203** | 확장성 (Scalability) | 동시 접속자 수 증가에 유연하게 대응해야 한다. | AWS ECS Fargate 오토스케일링을 통해 10,000명 이상의 동시 접속 처리. | Phase 4 (ECS) |

---

## 3. 리스크 관리 (Risk Management)

| ID | 리스크 항목 | 영향도 | 리스크 상세 설명 | 완화(Mitigation) 전략 |
| :--- | :--- | :--- | :--- | :--- |
| **GR-RSK-301** | AI 비용 폭증 | High | 유저 증가 시 OpenAI API 호출 비용이 AdMob 수익을 초과할 위험. | Redis 기반 결과 캐싱 및 1일 퀘스트 생성 횟수 제한(Rate Limiting) 적용. |
| **GR-RSK-302** | 실시간 병목 현상 | Medium | 대규모 레이드 시 DB 쓰기 부하로 인한 서버 지연 발생. | Redis Write-behind 패턴 적용 및 데미지 연산 결과의 배치 업데이트 처리. |
| **GR-RSK-303** | 광고 SDK 충돌 | Low | Flutter 버전과 AdMob SDK 간의 버전 충돌로 인한 빌드 오류. | Sprint 1에서 AdMob Spike를 통해 조기에 호환성 검증 및 전용 빌드 파이프라인 구축. |

---

## 4. 제개정 이력 (Revision History)

| 버전 | 날짜 | 개정 내용 | 작성자 | 승인자 |
| :--- | :--- | :--- | :--- | :--- |
| v1.0.0 | 2026-05-14 | 최초 SRS 작성 및 ISO 29148 표준 적용 | PM/ISO Agent | CTO |

---

## [ISO 관점 표준 준수 검토 의견 (Compliance Review)]

1. **추적성 (Traceability):** 모든 요구사항에 고유 ID(GR-FR-XXX)를 부여하고 상위 기획 단계(Phase 1~4)와의 연계성을 명시하여, 특정 기능의 변경이 시스템 전체에 미치는 영향을 추적 가능하게 설계됨.
2. **검증 가능성 (Verifiability):** '빠른 속도', '많은 유저'와 같은 모호한 표현 대신 '3초 이내', '10,000명 동시 접속' 등 정량적 수치를 사용하여 테스트 케이스 작성이 용이하도록 명세됨.
3. **리스크 기반 설계:** 비즈니스 모델(AI 비용)과 기술적 한계(DB 병목)를 사전에 리스크로 정의하고 구체적인 기술적 완화 전략(Caching, Batching)을 수립하여 ISO 9001의 리스크 사고(Risk-based thinking)를 실천함.
4. **결론:** 본 문서는 실무적인 요구사항과 국제 표준 규격을 적절히 융합하였으며, 프로젝트의 투명성과 안정적인 품질 관리를 위한 Baseline으로서 적합함.
