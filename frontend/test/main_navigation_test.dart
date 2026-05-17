import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:frontend/main.dart';

void main() {
  testWidgets('MainNavigationScreen should navigate between screens', (WidgetTester tester) async {
    await tester.pumpWidget(const MaterialApp(home: MainNavigationScreen(isTestMode: true)));

    expect(find.text('Home Screen'), findsOneWidget);
    expect(find.text('Refresh'), findsOneWidget);

    await tester.tap(find.byIcon(Icons.person));
    await tester.pump();
    expect(find.text('Character Screen'), findsOneWidget);
    expect(find.text('Level Up'), findsOneWidget);

    await tester.tap(find.byIcon(Icons.inventory));
    await tester.pump();
    expect(find.text('Inventory Screen'), findsOneWidget);
    expect(find.text('Use Item'), findsOneWidget);

    await tester.tap(find.byIcon(Icons.info));
    await tester.pump();
    expect(find.text('GuildRoutine v1.0.0'), findsOneWidget);

    await tester.tap(find.byIcon(Icons.group));
    await tester.pump();
    expect(find.textContaining('Boss HP:'), findsOneWidget);

    await tester.tap(find.byIcon(Icons.settings));
    await tester.pump();
    expect(find.text('Settings Screen'), findsOneWidget);
    expect(find.text('Logout'), findsOneWidget);

    // Test Drawer
    await tester.tap(find.byIcon(Icons.menu));
    await tester.pumpAndSettle();
    expect(find.text('GuildRoutine Menu'), findsOneWidget);
    await tester.tap(find.text('Profile'));
    await tester.pump();
    await tester.tap(find.widgetWithText(ListTile, 'About'));
    await tester.pump();
    await tester.tap(find.widgetWithText(ListTile, 'Settings'));
    await tester.pump();
    await tester.tap(find.text('Help'));
    await tester.pump();
    await tester.tap(find.text('Feedback'));
    await tester.pump();
  });

  testWidgets('HomeScreen should be visible', (WidgetTester tester) async {
    await tester.pumpWidget(const MaterialApp(home: HomeScreen()));
    expect(find.text('Home Screen'), findsOneWidget);
    await tester.tap(find.text('Refresh'));
    await tester.pump();
  });

  testWidgets('CharacterScreen should be visible', (WidgetTester tester) async {
    await tester.pumpWidget(const MaterialApp(home: CharacterScreen()));
    expect(find.text('Character Screen'), findsOneWidget);
    await tester.tap(find.text('Level Up'));
    await tester.pump();
  });

  testWidgets('InventoryScreen should be visible', (WidgetTester tester) async {
    await tester.pumpWidget(const MaterialApp(home: InventoryScreen()));
    expect(find.text('Inventory Screen'), findsOneWidget);
    await tester.tap(find.text('Use Item'));
    await tester.pump();
  });

  testWidgets('AboutScreen should be visible', (WidgetTester tester) async {
    await tester.pumpWidget(const MaterialApp(home: AboutScreen()));
    expect(find.text('GuildRoutine v1.0.0'), findsOneWidget);
  });

  testWidgets('SettingsScreen should be visible', (WidgetTester tester) async {
    await tester.pumpWidget(const MaterialApp(home: SettingsScreen()));
    expect(find.text('Settings Screen'), findsOneWidget);
    await tester.tap(find.text('Logout'));
    await tester.pump();
  });
  
  testWidgets('GuildRoutineApp should build', (WidgetTester tester) async {
    await tester.pumpWidget(const GuildRoutineApp(isTestMode: true));
    expect(find.byType(MaterialApp), findsOneWidget);
  });
}
