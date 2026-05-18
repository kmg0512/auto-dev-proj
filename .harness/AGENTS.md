# [MODULE] Infrastructure & Harness Governance

This module governs the internal mechanics of the Harness Protocol and project-wide telemetry.

## 1. Protocol Integrity
- **[RULE-HAR-01] Harness Self-Protection**: Never modify files in `.harness/` or `harness.py` unless explicitly tasked with a Protocol Upgrade.
- **[RULE-HAR-02] Telemetry**: All CLI executions must log to `.harness/telemetry/` for auditability.

## 2. Task Management
- **[RULE-HAR-03] Task Registry Consistency**: Ensure `docs/tasks/` matches the current implementation state.
- **[RULE-HAR-04] Semantic Mapping**: `docs/map.md` must be updated BEFORE any GREEN phase commit.
