import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:frontend/main.dart';

void main() {
  testWidgets('GuildScreen should have Create and Join buttons', (WidgetTester tester) async {
    await tester.pumpWidget(const MaterialApp(home: GuildScreen(isTestMode: true)));

    expect(find.text('Create Guild'), findsOneWidget);
    expect(find.text('Join Guild'), findsOneWidget);
  });

  testWidgets('GuildScreen should have Chat UI components', (WidgetTester tester) async {
    await tester.pumpWidget(const MaterialApp(home: GuildScreen(isTestMode: true)));

    expect(find.byType(TextField), findsOneWidget);
    expect(find.widgetWithIcon(IconButton, Icons.send), findsOneWidget);
  });

  testWidgets('GuildScreen should have Boss Raid UI components', (WidgetTester tester) async {
    await tester.pumpWidget(const MaterialApp(home: GuildScreen(isTestMode: true)));

    expect(find.textContaining('Boss HP:'), findsOneWidget);
    expect(find.text('Attack Boss'), findsOneWidget);

    await tester.tap(find.text('Attack Boss'));
    await tester.pump();
    // In test mode, this doesn't do much but we test the button is clickable

    await tester.enterText(find.byType(TextField), 'Hello Boss');
    await tester.tap(find.byIcon(Icons.send));
    await tester.pump();
  });
}
