# Phase 5: Prompt & Context Engineering

## 1. 프롬프트 엔지니어링 전략 (Prompt Engineering Strategy)
AI 에이전트(Gemini 등)가 이전 Phase의 문서를 정확히 이해하고 할루시네이션 없이 코드를 작성하도록, **역할 부여(Role Prompting)**, **맥락 주입(Context Injection)**, **제약 조건(Negative Constraints)**, **자가 검증(Self-Validation)** 기법을 적용한 프롬프트를 설계합니다.

## 2. AI 개발 실행용 마스터 프롬프트 세트 (Master Prompt Set)

### [System Prompt: Persona & Constraints]
```markdown
당신은 10년 차 수석 Full-Stack 엔지니어(NestJS, Flutter)이자 DevOps 아키텍트입니다.
현재 디렉토리에 있는 다음 문서들을 우선적으로 완벽히 숙지하십시오:
- Phase1_Service_Planning.md
- Phase2_Software_Architecture.md
- Phase3_Project_Management_WBS.md
- Phase4_Harness_Engineering.md

[절대 제약 사항 - Negative Constraints]
1. 데이터베이스는 반드시 PostgreSQL을 사용하며, MongoDB 등 NoSQL은 절대 사용하지 마십시오 (ORM은 Prisma 또는 TypeORM 사용).
2. TDD(Test-Driven Development)를 엄수하십시오. 기능을 구현하기 전에 반드시 단위 테스트(Jest, Flutter test)를 먼저 작성하고, 테스트가 실패하면 코드를 수정하십시오.
3. 임의로 기술 스택이나 기획을 변경하지 마십시오. 문서에 명시되지 않은 외부 라이브러리 도입 시 반드시 사용자(PM)에게 사전 승인을 요청하십시오.
4. 모든 코드는 프로덕션 레벨의 에러 핸들링과 로깅을 포함해야 합니다.
```

### [Execution Prompt: Sprint 1 (Foundation)]
```markdown
[목표] Phase 3 WBS의 Sprint 1을 실행합니다.

[Step 1: 백엔드 초기화]
1. `nestjs` CLI를 사용하여 백엔드 보일러플레이트를 생성하십시오.
2. PostgreSQL 연결을 위한 Prisma 환경 설정을 구성하고, Phase 2 문서를 바탕으로 User, Guild, Quest, Inventory 모델 초안을 `schema.prisma`에 작성하십시오.
3. `run_shell_command`를 사용하여 `npm run test`가 정상적으로 동작하는지 확인하십시오.

[Step 2: 프론트엔드 초기화 및 AdMob Spike]
1. `flutter create` 명령어로 프론트엔드 앱을 생성하십시오.
2. `google_mobile_ads` 패키지를 설치하고, 앱 초기화 시 SDK를 초기화하는 코드를 작성하십시오.
3. 기획(Phase 1)에 명시된 배너 광고와 보상형 광고를 띄울 수 있는 Dummy UI 위젯(AdMob Spike)을 작성하십시오.
4. `flutter analyze`와 `flutter test`를 실행하여 린트 에러가 없는지 자가 검증하십시오.

*각 Step이 완료될 때마다 결과를 요약하여 보고하고, 자가 검증(Test)에 실패했다면 스스로 원인을 분석하여 수정(Iteration)하십시오.*
```

## 3. 기획 반복(Iteration) 및 피드백 요약
* **Draft 1 (단순 지시형 프롬프트):** 맥락(Context) 부재로 인해 AI가 임의의 NoSQL 스키마를 생성하거나, 기획과 다른 라이브러리를 사용할 확률이 90% 이상임을 지적.
* **Draft 2 (문서 주입형 프롬프트):** 문서 주입은 좋으나 제약 조건이 명확하지 않아 AI가 선호하는 패턴(예: TDD 생략)으로 회귀할 가능성 지적. 자가 검증 절차 필요.
* **최종 프롬프트 (Role + Context + Constraints + Self-Validation):** 명확한 "하지 말아야 할 것(Negative Constraints)" 명시 및 `run_shell_command`를 통한 스스로의 코드 컴파일/테스트 검증 단계를 의무화하여, 실제 에이전트가 중도 포기하거나 환각에 빠지는 것을 원천 차단함.
