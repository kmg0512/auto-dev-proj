# Phase 3: Project Management & WBS

## 1. 프로젝트 개발 방법론 및 일정 개요
* **방법론:** Agile Scrum (2주 단위 스프린트)
* **총 개발 기간:** 8주 (4 Sprints) - MVP 런칭 기준
* **리소스 배분:** PM(겸 기획) 1명, 백엔드 엔지니어 1명, 프론트엔드(Flutter) 엔지니어 1명, UI/UX 디자이너 1명.

## 2. Work Breakdown Structure (WBS)

### Sprint 1 (1~2주차): Foundation & Architecture Spike
* **목표:** 기틀 마련, API 모킹을 통한 프론트/백엔드 병렬 작업 환경 구축.
* **디자인/기획:** UI 와이어프레임 확정, API 명세서(Swagger) 작성.
* **백엔드:** AWS 기반 인프라(RDS, Redis) 초기 세팅, NestJS 보일러플레이트, 사용자 인증(OAuth 2.0) API.
* **프론트엔드:** Flutter 프로젝트 세팅, UI 스켈레톤, **AdMob SDK Spike (광고 배너 및 모달 UI 공간 사전 확보)**.

### Sprint 2 (3~4주차): Core Loop & AI Integration
* **목표:** 핵심 게이미피케이션(습관 -> AI 퀘스트 -> 경험치 획득) 루프 완성.
* **백엔드:** 습관 CRUD API, OpenAI API 연동 및 Redis 기반 프롬프트/결과 캐싱 로직 구현.
* **프론트엔드:** 습관 등록/완료 UI, RPG 캐릭터 스탯창 구현, AI 퀘스트 결과 렌더링.

### Sprint 3 (5~6주차): Social Guild & Real-time (WebSockets)
* **목표:** 리텐션 강화를 위한 길드 시스템 및 실시간 통신 적용.
* **백엔드:** 길드 생성/초대 API, Socket.io 인프라 구축, Redis를 활용한 주간 레이드 보스 HP 실시간 버퍼링 연산.
* **프론트엔드:** 길드 로비 UI, 소셜 채팅창, 보스 피격 애니메이션(Flutter 실시간 렌더링).

### Sprint 4 (7~8주차): Monetization, QA & Launch
* **목표:** 광고 수익 모델 최종 연동, 버그 픽스 및 마켓 출시.
* **백엔드:** 실시간 통신(Socket.io) 부하 테스트(Load Testing), 병목 구간(Redis -> Postgres 동기화) 최적화.
* **프론트엔드:** 보상형 비디오 광고(스트릭 부활, 데미지 2배 등) 및 전면 광고 이벤트 트리거 최종 연동.
* **공통:** 통합 QA(E2E), App Store / Google Play 심사 제출.

## 3. 기획 반복(Iteration) 및 피드백 요약
* **Draft 1 (12주 폭포수 방법론):** 가설 검증이 너무 늦어지는 리스크 발생. 모바일 앱 특성상 빠른 MVP 테스트가 필요하다는 지적.
* **Draft 2 (8주 애자일):** 프론트엔드 개발자가 백엔드 API 완료 전까지 대기하는 병목 현상 및 AdMob 연동 지연으로 인한 UI 재설계 리스크 지적.
* **최종 WBS:** Sprint 1에 API 명세 모킹(Swagger)을 강제하여 프론트/백 병렬 개발을 보장하고, AdMob Spike를 Sprint 1로 당겨 광고 지면에 맞춘 UI 설계가 처음부터 이루어지도록 최적화.
