# Harness Protocol Governance

This project is governed by the **Harness Protocol**. All AI agents operating in this repository must adhere to the following rules.

## 1. Repository as System of Record (SOR)
- All tasks, decisions, and architectural updates must be documented in the repository.
- Task registry: `docs/tasks/`
- Semantic map: `docs/map.md`

## 2. TDD Workflow (RED-GREEN)
- Development must be split into two tasks:
  1. **RED Task**: Write failing tests (`[task_id]-RED.json`).
  2. **GREEN Task**: Implement production code to satisfy tests (`[task_id]-GREEN.json`).
- Production code must achieve >= 80% line coverage.

## 3. Mechanical Invariants
- Use the `harness.py` CLI for verification and commits.
- Absolute path to `harness.py`: `/Users/macbook/.agents/skills/harness/scripts/harness.py`

## 4. Verification Protocol
- Every task MUST be verified via `harness test`.
- Line coverage MUST be >= 80%.
- Bypassing verification is an Integrity Violation.

## 5. Documentation Standards
- Architectural documentation: ISO 42010 (`docs/architecture.md`)
- Quality metrics: ISO 25010 (`docs/quality_metrics.md`)

## 6. Safety & Security
- No modification to `.harness/` or internal harness state.
- Maximum 3 self-healing attempts before human hand-off.
