# Cycle Log: GR-BACKEND-22 (RED)

## 1. Context Awareness
- **Task ID**: GR-BACKEND-22
- **Status**: RED Phase
- **Rules Applied**: [RULE-INV-01], [RULE-INV-02], [RULE-BE-01].

## 2. Research & State Reconstruction
- **Requirement**: Implement Guild Boss Reset and Initialization logic (Sprint 4).
- **Current State**: `GuildsService` can track damage but has no way to reset the boss once defeated or for a new week.

## 3. Deliberation & Architect Plan
### 3.1 Architect Plan
- Implement `resetGuildBoss(guildId, newHp)` in `GuildsService`.
- This method should update the DB, clear the Redis damage buffer, and evict the local `hpCache`.
- It will be used by cron jobs or administrative actions to start a new raid.

### 3.2 Critic Review
- **Risk**: Resetting while damage is still in the buffer. (Adjustment: The method explicitly calls `hdel` on the damage buffer to prevent applying old damage to the new boss).
- **Risk**: Local cache staleness. (Adjustment: Explicitly calling `hpCache.delete(guildId)`).

## 4. Execution & Verification Results
- **RED Phase**: Added failing test in `guilds.service.spec.ts`.
- **Test Failure Result**: `TypeError: service.resetGuildBoss is not a function`.

<context_awareness>
  <governance_validation>
    <root_rules>RULE-INV-01, RULE-INV-02</root_rules>
    <module_rules>RULE-BE-01</module_rules>
    <compliance_status>Confirmed.</compliance_status>
  </governance_validation>
  <current_state>
    - Task: GR-BACKEND-22 (RED)
    - Previous Context: Completed Guild Member List API.
  </current_state>
</context_awareness>

<deliberation>
  <architect_plan>
    Implement boss reset logic to allow for cyclical raids. This is a prerequisite for "Weekly Raid" features.
  </architect_plan>
  <critic_review>
    - Risk: Telemetry mismatch. (Fix: Will run harness test in GREEN phase to sync log).
    - Risk: Partial reset. (Fix: Method will reset DB, Redis buffer, and local cache atomically in service).
  </critic_review>
</deliberation>

<execution_commands>
  <command intent="Create Task JSON">cat << 'EOF' > docs/tasks/GR-BACKEND-22-RED.json
{
  "id": "GR-BACKEND-22-RED",
  "status": "Ready",
  "description": "Implement Guild Boss Reset and Initialization logic (RED phase).",
  "agent": "Gemini-CLI",
  "depends_on": ["GR-BACKEND-21-GREEN"],
  "mechanical_dod": {
    "command": "backend/node_modules/.bin/jest --config backend/package.json backend/src/guilds/guilds.service.spec.ts",
    "expected_exit_code": 1
  }
}
EOF</command>
</execution_commands>

<state_sync>
  <log_created>logs/cycle_GR-BACKEND-22_RED.md</log_created>
  <registry_updated>docs/tasks/GR-BACKEND-22-RED.json</registry_updated>
  <status>Halted_Due_To_Error</status>
</state_sync>
