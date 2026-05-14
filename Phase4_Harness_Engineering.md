# Phase 4: Harness Engineering (CI/CD Pipeline)

## 1. 파이프라인 개요 및 Quality Gates
본 프로젝트는 Harness Engineering 개념(점진적 배포 및 자동화 게이트)을 차용하여, 안전하고 중단 없는 배포 파이프라인을 구축합니다.

* **Pull Request (PR) Quality Gates:**
  * 백엔드: PR 생성 시 GitHub Actions가 트리거되어 `Jest` 단위 테스트 및 Linter 실행.
  * 프론트엔드: `Flutter test` 및 `Flutter analyze` 실행.
  * *모든 테스트 통과 시에만 main 브랜치 병합 허용.*

## 2. 백엔드 CI/CD (GitHub Actions -> AWS ECS)
실시간 통신(Socket.io)을 처리하는 서버이므로 무중단 배포(Zero-downtime)가 핵심입니다.

* **1단계 (Build & Push):** `main` 브랜치 병합 시 Docker Image 빌드 후 AWS ECR로 푸시.
* **2단계 (Staging Deploy & DB Migration):** 
  * Staging 환경의 DB(RDS)에 대해 Prisma/TypeORM 마이그레이션 자동 실행.
  * AWS ECS (Fargate) Staging 환경에 컨테이너 배포 후 자동화된 API E2E 테스트 진행.
* **3단계 (Production Blue/Green Deploy):** 
  * Staging 테스트 통과 후 Production 배포 트리거.
  * 기존 컨테이너(Blue)를 유지한 상태에서 새 컨테이너(Green)를 띄우고, 로드밸런서(ALB) 트래픽을 점진적으로 전환. 기존 Socket.io 연결은 Graceful Shutdown 처리.

## 3. 프론트엔드 CI/CD (Codemagic + Fastlane)
모바일 앱 빌드 최적화 및 스토어 심사 자동화를 위해 구성합니다.

* **1단계 (Build):** `main` 브랜치 병합 시 Codemagic(또는 GitHub Actions macOS Runner) 트리거. iOS(IPA) 및 Android(AAB) 릴리즈 빌드 수행.
* **2단계 (Test Distribution):** Fastlane을 통해 Apple TestFlight 및 Google Play Internal Testing으로 자동 업로드 및 테스터에게 알림 발송.
* **3단계 (Production Promotion):** QA 완료 후 CI/CD 파이프라인 내 수동 승인(Manual Approval) 버튼 클릭 시, 스토어 프로덕션 심사로 자동 승격.

## 4. 기획 반복(Iteration) 및 피드백 요약
* **Draft 1 (EC2 직접 배포 및 기본 GitHub Actions):** EC2 SSH 배포는 실시간 서버(WebSockets) 무중단 업데이트에 치명적 리스크가 있어 AWS ECS로 변경. 프론트엔드 빌드 속도 개선 필요성 대두.
* **Draft 2 (ECS 및 DB 마이그레이션 추가):** 테스트 자동화(Quality Gate)가 누락되어 비즈니스 로직 버그가 그대로 배포될 수 있는 위험성 지적.
* **최종 파이프라인 (Harness 기반 점진적 배포):** PR 단계에서의 강제 단위 테스트(Quality Gates), Blue/Green 무중단 배포 방식 적용, TestFlight/Google Play Internal 자동화 연동을 통해 안정성과 개발 속도를 모두 확보.
