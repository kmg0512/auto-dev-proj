# Phase 2: Software Architecture & Specification

## 1. 시스템 아키텍처 개요 (System Architecture)
본 서비스는 게이미피케이션 요소와 실시간 동기화(레이드 보스, 채팅)를 요구하므로, 높은 성능과 확장성을 보장하는 아키텍처로 설계되었습니다.

* **프론트엔드 (Frontend):** Flutter (Dart)
  * 채택 이유: 60fps 이상의 부드러운 2D RPG 애니메이션 구현 및 단일 코드베이스로 iOS/Android 동시 배포.
* **백엔드 (Backend):** NestJS (TypeScript)
  * 채택 이유: 엔터프라이즈급 구조(의존성 주입, 강타입)를 제공하여 복잡한 게임 경제(재화, 경험치) 및 길드 비즈니스 로직을 안전하게 유지보수.
* **데이터베이스 (Database):** PostgreSQL (AWS RDS)
  * 채택 이유: 사용자, 길드, 인벤토리, 퀘스트 간의 복잡한 관계와 트랜잭션 무결성을 보장하기 위해 NoSQL보다 RDBMS가 적합.
* **인메모리 캐시 및 메시지 브로커:** Redis (AWS ElastiCache)
  * 채택 이유: 수많은 유저의 동시다발적인 보스 데미지 연산을 메모리에서 우선 처리 후 DB에 배치 저장(Write-behind)하여 병목 현상 방지. Socket.io 스케일아웃 시 Pub/Sub 어댑터로 활용.

## 2. 주요 API 및 데이터 흐름 (API & Data Flow)
* **REST API:**
  * 사용자 인증 (OAuth 2.0), 프로필/아바타 관리.
  * 습관(퀘스트) CRUD 및 인벤토리 아이템 사용.
* **WebSockets (Socket.io):**
  * **길드 레이드 시스템:** 누군가 습관을 완료하면 보스의 HP가 깎이는 연출이 접속 중인 모든 길드원에게 실시간 브로드캐스트됨.
  * **길드 채팅:** 실시간 커뮤니케이션.
* **AI 연동 (OpenAI API - GPT-4o-mini):**
  * **프롬프트 캐싱:** 유저가 입력한 일상적인 습관(예: "물 마시기")을 RPG 퀘스트 텍스트로 변환할 때, 이미 캐싱된 키워드라면 Redis에서 즉시 반환하여 API 호출 비용 최소화.

## 3. 기획 반복(Iteration) 및 피드백 요약
* **Draft 1 (React Native + Express + MongoDB):** 길드 및 인벤토리 시스템 구현 시 MongoDB의 데이터 무결성 리스크 지적. PostgreSQL로 변경 권고. 실시간 통신 부재 지적.
* **Draft 2 (Flutter + NestJS + PostgreSQL + WebSockets):** 다수의 유저가 동시에 보스를 공격할 때 PostgreSQL의 Row-level Lock으로 인한 쓰기 병목 지적. 캐싱 및 버퍼링 레이어 필요성 대두.
* **최종 스펙 (Redis 도입):** Redis를 도입하여 실시간 데미지 연산 버퍼링 및 OpenAI API 호출 결과를 캐싱함으로써, DB 부하 감소와 외부 API 비용 최적화를 이룬 최종 아키텍처 완성.
