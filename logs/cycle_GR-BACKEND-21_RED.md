# Cycle Log: GR-BACKEND-21 (RED)

## 1. Context Awareness
- **Task ID**: GR-BACKEND-21
- **Status**: RED Phase
- **Rules Applied**: [RULE-INV-01], [RULE-INV-02], [RULE-BE-01].

## 2. Research & State Reconstruction
- **Requirement**: Implement Guild Member List API to allow guild members to see each other.
- **Current State**: `GuildsController` and `GuildsService` lack a way to list members of a guild.

## 3. Deliberation & Architect Plan
### 3.1 Architect Plan
- Add `getGuildMembers(guildId)` to `GuildsService`.
- Add `@Get(':id/members')` to `GuildsController`.
- Verify the members returned include their RPG stats.

### 3.2 Critic Review
- **Risk**: Performance hit if a guild has thousands of members. (Adjustment: For MVP, we'll assume guilds are small as per typical social RPGs, but we'll use Prisma's selective fetching to minimize data transfer).
- **Risk**: Returning sensitive data (e.g. email). (Adjustment: Explicitly select only `id`, `name`, `level`, `exp`).

## 4. Execution & Verification Results
- **RED Phase**: Added failing test in `guilds.controller.spec.ts`.
- **Test Failure Result**: `TypeError: controller.getMembers is not a function`.

<context_awareness>
  <governance_validation>
    <root_rules>RULE-INV-01, RULE-INV-02</root_rules>
    <module_rules>RULE-BE-01</module_rules>
    <compliance_status>Confirmed.</compliance_status>
  </governance_validation>
  <current_state>
    - Task: GR-BACKEND-21 (RED)
    - Previous Context: Completed Guild Invitation flow.
  </current_state>
</context_awareness>

<deliberation>
  <architect_plan>
    Implement an endpoint to retrieve the list of members in a guild. This is essential for the "Guild Lobby" and "Social" features of the RPG.
  </architect_plan>
  <critic_review>
    - Risk: Privacy leak. (Fix: Using selective fetching in Prisma to only expose public RPG stats)
    - Risk: Missing service implementation. (Fix: Will implement both controller and service in GREEN phase)
  </critic_review>
</deliberation>

<execution_commands>
  <command intent="Create Task JSON">cat << 'EOF' > docs/tasks/GR-BACKEND-21-RED.json
{
  "id": "GR-BACKEND-21-RED",
  "status": "Ready",
  "description": "Implement Guild Member List API (RED phase).",
  "agent": "Gemini-CLI",
  "depends_on": ["GR-BACKEND-20-GREEN"],
  "mechanical_dod": {
    "command": "backend/node_modules/.bin/jest --config backend/package.json backend/src/guilds/guilds.controller.spec.ts",
    "expected_exit_code": 1
  }
}
EOF</command>
  <command intent="Update tests to failing state">sed -i ... backend/src/guilds/guilds.controller.spec.ts</command>
</execution_commands>

<state_sync>
  <log_created>logs/cycle_GR-BACKEND-21_RED.md</log_created>
  <registry_updated>docs/tasks/GR-BACKEND-21-RED.json</registry_updated>
  <status>Halted_Due_To_Error</status>
</state_sync>
