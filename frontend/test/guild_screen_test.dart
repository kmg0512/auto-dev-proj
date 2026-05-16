import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:frontend/main.dart';

void main() {
  testWidgets('GuildScreen should have Create and Join buttons', (WidgetTester tester) async {
    await tester.pumpWidget(const MaterialApp(home: GuildScreen()));

    expect(find.text('Create Guild'), findsOneWidget);
    expect(find.text('Join Guild'), findsOneWidget);
  });
}
