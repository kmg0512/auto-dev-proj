import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:frontend/main.dart';

void main() {
  testWidgets('UI Skeleton Navigation Test', (WidgetTester tester) async {
    // Build our app and trigger a frame.
    await tester.pumpWidget(const GuildRoutineApp());

    // Verify that the BottomNavigationBar is present.
    expect(find.byType(BottomNavigationBar), findsOneWidget);

    // Verify that the navigation items are present.
    expect(find.text('Home'), findsOneWidget);
    expect(find.text('Character'), findsOneWidget);
    expect(find.text('Guild'), findsOneWidget);
    expect(find.text('Settings'), findsOneWidget);

    // Tap on the 'Character' tab and verify.
    await tester.tap(find.text('Character'));
    await tester.pump();
    expect(find.text('Character Screen'), findsOneWidget);

    // Tap on the 'Guild' tab and verify.
    await tester.tap(find.text('Guild'));
    await tester.pump();
    expect(find.text('Create Guild'), findsOneWidget);
    expect(find.text('Join Guild'), findsOneWidget);
  });
}
