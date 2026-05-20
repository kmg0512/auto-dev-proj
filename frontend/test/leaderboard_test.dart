import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:guild_routine/main.dart';

void main() {
  testWidgets('Leaderboard UI failing test', (WidgetTester tester) async {
    // Build our app and trigger a frame.
    await tester.pumpWidget(const GuildRoutineApp(isTestMode: true));

    // Tap the Leaderboard tab (assuming it will be added)
    // For now, let's just check if "Leaderboard" text exists in the bottom nav or screen.
    expect(find.text('Leaderboard'), findsOneWidget);
  });
}
