# Cycle Log: GR-BACKEND-28 (RED)

## 1. Context Awareness
- **Task ID**: GR-BACKEND-28
- **Status**: RED Phase
- **Rules Applied**: [RULE-INV-01], [RULE-INV-02], [RULE-BE-01].

## 2. Research & State Reconstruction
- **Requirement**: Implement Guild Leave API (Sprint 4).
- **Current State**: Users can join guilds but cannot leave them.

## 3. Deliberation & Architect Plan
### 3.1 Architect Plan
- Add `leaveGuild(userId)` to `GuildsService`.
- Add `@Post('leave')` to `GuildsController`.
- Method should set the user's `guildId` to `null`.

### 3.2 Critic Review
- **Risk**: Leaving a guild while a raid is active. (Adjustment: For MVP, users can leave anytime; future versions might restrict leaving during boss fights).
- **Risk**: Orphaned leaders. (Adjustment: If a leader leaves, a new one should be appointed; for MVP, guilds are flat or leadership is not yet enforced).

## 4. Execution & Verification Results
- **RED Phase**: Added failing test in `guilds.controller.spec.ts`.
- **Test Failure Result**: `TypeError: controller.leave is not a function`.

<context_awareness>
  <governance_validation>
    <root_rules>RULE-INV-01, RULE-INV-02</root_rules>
    <module_rules>RULE-BE-01</module_rules>
    <compliance_status>Confirmed.</compliance_status>
  </governance_validation>
  <current_state>
    - Task: GR-BACKEND-28 (RED)
    - Previous Context: Completed Guild Invitation List API.
  </current_state>
</context_awareness>

<deliberation>
  <architect_plan>
    Implement an endpoint to allow users to leave their current guild. This is a basic social requirement.
  </architect_plan>
  <critic_review>
    - Risk: Incorrect verification. (Fix: Verified with controller unit test).
    - Risk: Telemetry mismatch. (Fix: Verified with harness test).
  </critic_review>
</deliberation>

<execution_commands>
  <command intent="Create Task JSON">cat << 'EOF' > docs/tasks/GR-BACKEND-28-RED.json
{
  "id": "GR-BACKEND-28-RED",
  "status": "Ready",
  "description": "Implement Guild Leave API (RED phase).",
  "agent": "Gemini-CLI",
  "depends_on": ["GR-BACKEND-27-GREEN"],
  "mechanical_dod": {
    "command": "backend/node_modules/.bin/jest --config backend/package.json backend/src/guilds/guilds.controller.spec.ts",
    "expected_exit_code": 1
  }
}
EOF</command>
</execution_commands>

<state_sync>
  <log_created>logs/cycle_GR-BACKEND-28_RED.md</log_created>
  <registry_updated>docs/tasks/GR-BACKEND-28-RED.json</registry_updated>
  <status>Halted_Due_To_Error</status>
</state_sync>
