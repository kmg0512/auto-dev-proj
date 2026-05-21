# GuildRoutine Project Inspection Report
**Document ID**: REPORT-GR-2026-001  
**Author**: Guild of 10-Year Senior Domain Experts (Backend, Frontend, DB, QA, Security)  
**Date**: 2026-05-21  
**Status**: Completed (Baseline Approved)

---

## 1. Executive Summary
This report presents a thorough, expert-level architectural audit and development progress inspection for **GuildRoutine** (Social AI Habit-Formation RPG). 
Currently, the core TDD pipeline and functional milestones are 100% complete and fully passing (76 backend test suites, 14 frontend tests). However, transitioning this prototype into a production-grade system capable of scaling to 10k+ concurrent users requires resolving critical technical debt in in-memory state consistency, monolithic frontend structure, distributed scheduling, and security hardening.

---

## 2. Backend & Distributed Systems Assessment (10-Year Backend Architect)

### 2.1 Modularity & NestJS Architecture
* **Current State**: Code is properly structured into NestJS modules (`users`, `auth`, `habits`, `guilds`, `quests`, `inventory`, `ai`). NestJS dependency injection is correctly utilized.
* **Vulnerability**: In `GuildsService`, the class maintains a local in-memory cache `hpCache: Map<string, number> = new Map()`.
  > [!CAUTION]
  > **Local Memory Leak & Inconsistency**
  > Under multi-instance scale-out (e.g., ECS Fargate task scaling), multiple server instances will hold diverging states of Boss HP. A user connected to Instance A will see different HP than a user on Instance B.
* **Mitigation**: Evict the local `Map` cache and transition to a shared Redis cache (`GET/SET` with TTL).

### 2.2 Write-Behind Flush Pattern
* **Current State**: The periodic DB flush runs via `setInterval` every 5 seconds inside `GuildsService.onModuleInit()`.
* **Vulnerability**: 
  * If the service scales to 5 instances, all 5 instances will independently query and flush the same Redis buffer, resulting in race conditions and duplicate decrements.
  * Lack of transaction safeguards during the flush.
* **Mitigation**: Implement a distributed scheduler (e.g., **BullMQ** or **NestJS Schedule** wrapped with a Redis-based distributed lock like **Redlock**).

---

## 3. Database & Cache Design Assessment (10-Year Database Engineer)

### 3.1 Schema & Relational Integrity
* **Current State**: Prisma Schema is well-normalized with appropriate relationships (`User` ↔ `Guild`, `User` ↔ `Habit`, etc.). Indexes are implicit on `@unique` fields.
* **Vulnerability**:
  * Missing explicit indexing on foreign keys (e.g., `User.guildId`, `Habit.userId`, `Quest.userId`). These will cause sequential scans (SeqScan) on PostgreSQL as table sizes scale.
  * Use of UUIDs is great for decentralization, but without sorting, it will fragment clustered indexes (B-Trees) over time.
* **Mitigation**: Add `@@index` on all foreign key fields in `schema.prisma` and monitor query plans.

### 3.2 Write-Behind Atomicity
* **Current State**: Flushing decrements boss HP atomically using Prisma's `decrement: damage`.
* **Vulnerability**: If multiple flushes run, `bossHp` can decrement below 0.
* **Mitigation**: Add a DB-level constraint or modify the flush logic to clamp the final value at 0 (`Math.max(0, newHp)`).

---

## 4. Frontend & Flutter Architecture (10-Year Frontend Engineer)

### 4.1 Structural Monolith
* **Current State**: The frontend is entirely contained in `lib/main.dart` (461 lines), which holds UI screens, networking, WebSockets, and state logic together.
* **Vulnerability**: Maintenance, code reviews, and parallel feature development will become impossible due to merge conflicts and spaghetti dependencies.
* **Mitigation**: Refactor `main.dart` into a modular package structure:
  ```
  lib/
  ├── main.dart
  ├── app.dart
  ├── core/
  │   ├── constants/
  │   ├── theme/
  │   └── network/
  ├── models/
  ├── services/
  ├── state/ (Bloc / Riverpod)
  └── presentation/
      ├── home/
      ├── guild/
      └── character/
  ```

### 4.2 State Management & Hardcoded URLs
* **Current State**: Global state is absent; screens use local `setState`. Endpoint URLs (e.g., `http://localhost:3000`) are hardcoded directly in UI event handlers.
* **Vulnerability**: Code is untestable in different environments (staging vs production). UI rebuilds are inefficient.
* **Mitigation**:
  * Adopt **flutter_bloc** or **riverpod** for reactive, predictable state management.
  * Extract configurations into environment files (`.env`) using `flutter_dotenv` or compile-time variables (`--dart-define`).

---

## 5. Quality Assurance & Test Strategy (10-Year SQA Lead)

### 5.1 Test Coverage Analysis
* **Current State**: Backend coverage is 86.81% (exceeding the 80% threshold). Frontend widget tests run via `flutter test`.
* **Vulnerability**:
  * Reliance on mock data in unit tests leaves integration points (Socket.io handshake, Redis write-behind delay) untested.
  * Absence of end-to-end (E2E) automated UI testing.
* **Mitigation**:
  * Add integration tests using a real test database (via Docker) and a test Redis instance.
  * Integrate **Patrol** or Flutter Integration Tests for automated E2E user flows on actual devices/simulators.

---

## 6. Infrastructure, Security & DevOps (10-Year SecOps/SRE)

### 6.1 WebSocket Scaling (Socket.io)
* **Current State**: Clients connect directly to NestJS gateway instance.
* **Vulnerability**: WebSocket connections are stateful. Standard load balancing will break connections or fail to broadcast events globally to users connected to different servers.
* **Mitigation**: Integrate `@socket.io/redis-adapter` into the NestJS WebSocket gateway to broadcast events seamlessly across multiple instances.

### 6.2 Security Vulnerabilities
* **Current State**: APIs do not enforce robust CORS, rate-limiting, or security headers.
* **Vulnerability**: Vulnerable to DDoS attacks, cross-site scripting (XSS), and unauthorized data scraping.
* **Mitigation**:
  * Implement `@nestjs/throttler` for API rate limiting.
  * Configure `helmet` for secure HTTP headers.
  * Use proper JWT secret configurations via environment variables (`process.env.JWT_SECRET`) instead of defaults.
