import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:frontend/main.dart';

void main() {
  testWidgets('GuildScreen should have Create and Join buttons', (WidgetTester tester) async {
    await tester.pumpWidget(const MaterialApp(home: GuildScreen()));

    expect(find.text('Create Guild'), findsOneWidget);
    expect(find.text('Join Guild'), findsOneWidget);
  });

  testWidgets('GuildScreen should have Chat UI components', (WidgetTester tester) async {
    await tester.pumpWidget(const MaterialApp(home: GuildScreen()));

    expect(find.byType(TextField), findsOneWidget);
    expect(find.widgetWithIcon(IconButton, Icons.send), findsOneWidget);
  });
}
