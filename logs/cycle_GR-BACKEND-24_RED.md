# Cycle Log: GR-BACKEND-24 (RED)

## 1. Context Awareness
- **Task ID**: GR-BACKEND-24
- **Status**: RED Phase
- **Rules Applied**: [RULE-INV-01], [RULE-INV-02], [RULE-BE-01].

## 2. Research & State Reconstruction
- **Requirement**: Implement Guild Raid Status API (Sprint 4).
- **Current State**: `GuildsService` has `getGuildBossHp`, but the `GuildsController` lacks an endpoint to expose this information to the frontend for initial load.

## 3. Deliberation & Architect Plan
### 3.1 Architect Plan
- Add `@Get(':id/raid-status')` to `GuildsController`.
- This endpoint will call `getGuildBossHp` and return the current raid state.

### 3.2 Critic Review
- **Risk**: Redundancy with WebSocket events. (Adjustment: WebSockets are for real-time updates; REST is needed for the initial "Snapshot" when a user enters the guild screen).
- **Risk**: Public visibility. (Adjustment: For MVP, the endpoint is public; future versions should verify the user is a guild member).

## 4. Execution & Verification Results
- **RED Phase**: Added failing test in `guilds.controller.spec.ts`.
- **Test Failure Result**: `TypeError: controller.getRaidStatus is not a function`.

<context_awareness>
  <governance_validation>
    <root_rules>RULE-INV-01, RULE-INV-02</root_rules>
    <module_rules>RULE-BE-01</module_rules>
    <compliance_status>Confirmed.</compliance_status>
  </governance_validation>
  <current_state>
    - Task: GR-BACKEND-24 (RED)
    - Previous Context: Completed Raid Rewards logic.
  </current_state>
</context_awareness>

<deliberation>
  <architect_plan>
    Implement an endpoint to provide the current raid status. This is necessary for the frontend to render the boss health bar correctly upon screen entry.
  </architect_plan>
  <critic_review>
    - Risk: Over-fetching. (Fix: Endpoint only returns guildId and bossHp).
    - Risk: Incorrect verification. (Fix: Verified with controller unit test).
  </critic_review>
</deliberation>

<execution_commands>
  <command intent="Create Task JSON">cat << 'EOF' > docs/tasks/GR-BACKEND-24-RED.json
{
  "id": "GR-BACKEND-24-RED",
  "status": "Ready",
  "description": "Implement Guild Raid Status API (RED phase).",
  "agent": "Gemini-CLI",
  "depends_on": ["GR-BACKEND-23-GREEN"],
  "mechanical_dod": {
    "command": "backend/node_modules/.bin/jest --config backend/package.json backend/src/guilds/guilds.controller.spec.ts",
    "expected_exit_code": 1
  }
}
EOF</command>
</execution_commands>

<state_sync>
  <log_created>logs/cycle_GR-BACKEND-24_RED.md</log_created>
  <registry_updated>docs/tasks/GR-BACKEND-24-RED.json</registry_updated>
  <status>Halted_Due_To_Error</status>
</state_sync>
