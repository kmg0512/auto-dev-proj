# [ROOT] Harness Protocol Governance [RULE-GOV-01]

This is the **Global Root Governance**. All sub-modules (Backend, Frontend, Harness) MUST inherit and comply with these base invariants.

## 1. Global Invariants (Immutable)
- **[RULE-INV-01]** The repository is the single Source of Truth (SOR).
- **[RULE-INV-02]** Every change MUST follow the TDD RED-GREEN cycle via `harness.py`.
- **[RULE-INV-03]** Raw `git` commands are strictly forbidden for committing changes.
- **[RULE-INV-04]** Hierarchical AGENTS.md: Root rules apply globally, subdirectory `AGENTS.md` provide domain-specific overrides.

## 2. Multi-Persona Execution
- **[RULE-PER-01] Lead Architect**: Global system design and inter-module consistency.
- **[RULE-PER-02] Principal Critic**: Validation of invariants and cross-module integrity.

## 3. Distributed Policy Mapping
- **Backend Rules**: Defined in `./backend/AGENTS.md`.
- **Frontend Rules**: Defined in `./frontend/AGENTS.md`.
- **Infrastructure/Harness Rules**: Defined in `./.harness/AGENTS.md`.

## 4. Verification Gateways
- **[RULE-GATE-01]** Global line coverage threshold: >= 80%.
- **[RULE-GATE-02]** Deadlock prevention: 3 failures = Halt & Report.
