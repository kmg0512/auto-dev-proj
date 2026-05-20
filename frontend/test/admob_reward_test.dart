import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:frontend/main.dart';

void main() {
  testWidgets('Reward Ads failing test', (WidgetTester tester) async {
    // Build our app and trigger a frame.
    await tester.pumpWidget(const GuildRoutineApp(isTestMode: true));

    // Check if "Recover Streak" button exists on Home Screen.
    expect(find.text('Recover Streak'), findsOneWidget);
  });
}
