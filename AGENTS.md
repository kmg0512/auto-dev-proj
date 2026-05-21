# [ROOT] Harness Protocol Governance [RULE-GOV-01]

This is the **Global Root Governance**. All sub-modules (Backend, Frontend, Harness) MUST inherit and comply with these base invariants.

## 1. Global Invariants (Immutable)
- **[RULE-INV-01]** The repository is the single Source of Truth (SOR). All tasks, state updates, and configuration maps must reside within the repository.
- **[RULE-INV-02]** Every code change MUST follow the Test-Driven Development (TDD) RED-GREEN-REFACTOR cycle, verified by the harness protocol tool.
- **[RULE-INV-03]** Raw `git commit` commands are strictly forbidden for committing changes. All commits must be made via the `harness.sh commit` command to ensure integrity.
- **[RULE-INV-04]** Hierarchical AGENTS.md: Root rules apply globally. Module-specific `AGENTS.md` files provide local overrides and domain-specific rules.

## 2. Multi-Persona Execution & Role Restrictions
- **[RULE-PER-01] Lead Architect (Planning/Refactoring)**: Responsible for global architecture, structural modifications, and API boundaries.
- **[RULE-PER-02] Principal Critic (QA/Verification)**: Mandated to audit all changes, run test suites, and enforce quality gates.
- **[RULE-PER-03] Role Separation**:
  - **QA / Adversarial Agent**: Only allowed to write/edit tests in the RED phase. Prohibited from modifying production code.
  - **Dev / Implementation Agent**: Only allowed to modify production code in the GREEN phase to pass existing tests.
  - **Doc / Technical Writer Agent**: Only allowed to update Markdown files in the `docs/` directory.

## 3. Context Optimization & Fragment-Based Docs
- **[RULE-CTX-01] Index-Routed Updates**: Monolithic documentation files must not be rewritten. The agent must inspect `docs/index.md` and apply fragment-based updates to localized files (e.g., `docs/requirements/auth.md`).
- **[RULE-CTX-02] Semantic Map Synced**: The semantic code map (`docs/map.md`) must be kept up-to-date with current symbols, functions, and boundaries prior to any GREEN task verification.

## 4. Verification Gateways & Self-Healing
- **[RULE-GATE-01] Quality Gates**:
  - Line coverage threshold: >= 80% (measured via LCOV).
  - Mutation testing score (when enabled): >= 60%.
- **[RULE-GATE-02] Deadlock Prevention**:
  - Max self-healing retry count: 3.
  - On the 3rd failed attempt, the agent MUST immediately halt, write a detailed `<error_report>` XML to `logs/error_[TASK_ID].xml`, and hand over control to the user.

## 5. Security & Privacy Guardrails
- **[RULE-SEC-01] Allowed Command Prefixes**: Only commands matching the pre-approved whitelist (e.g., `npm run`, `flutter test`, `harness.sh`) are allowed. Shell metacharacters (`&&`, `||`, `;`, `|`, `$(`, `` ` ``) are strictly blocked.
- **[RULE-SEC-02] Safe DB Policy**: Database migrations must never contain unsafe mutations like `DROP TABLE`, `TRUNCATE`, or unguarded `DELETE`.
- **[RULE-SEC-03] Log Scrubbing**: All telemetry and cycle logs must be automatically scrubbed of PII, secrets, keys, and tokens prior to saving.
