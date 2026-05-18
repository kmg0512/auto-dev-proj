# [MODULE] Backend Governance (NestJS/Prisma)

This module inherits from the Root Governance and adds domain-specific constraints for the NestJS ecosystem.

## 1. Architectural Constraints
- **[RULE-BE-01] Clean Architecture**: Maintain strict separation between Controllers, Services, and Prisma Repositories.
- **[RULE-BE-02] DTO Enforcement**: Every request payload MUST be validated via `class-validator` DTOs.
- **[RULE-BE-03] Prisma Safety**: No raw queries unless performance requirements dictate and Architect approves.

## 2. Testing Standards
- **[RULE-BE-TDD-01] Unit Tests**: All Services must have mock-based unit tests.
- **[RULE-BE-TDD-02] E2E Tests**: Critical paths (Auth, Core Habits) must have E2E tests in `test/`.
- **[RULE-BE-TDD-03] Coverage**: Minimum 80% coverage on `src/` logic.

## 3. Tooling
- **Linter**: `eslint`
- **Formatter**: `prettier`
- **Command**: `npm run lint`, `npm run format`
