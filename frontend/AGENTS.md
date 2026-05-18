# [MODULE] Frontend Governance (Flutter/Dart)

This module inherits from the Root Governance and adds domain-specific constraints for the Flutter ecosystem.

## 1. Architectural Constraints
- **[RULE-FE-01] State Management**: Use the established pattern (e.g., Provider/Bloc) consistently.
- **[RULE-FE-02] Widget Composition**: Prefer small, reusable widgets over monolithic build methods.
- **[RULE-FE-03] Type Safety**: Avoid `dynamic` types; ensure all data models are strictly typed.

## 2. Testing Standards
- **[RULE-FE-TDD-01] Widget Tests**: Every new feature widget must have a widget test.
- **[RULE-FE-TDD-02] Golden Tests**: Critical UI components should have golden tests for regression.
- **[RULE-FE-TDD-03] Integration Tests**: High-level flow verification in `integration_test/`.

## 3. Tooling
- **Linter**: `flutter analyze`
- **Formatter**: `flutter format`
