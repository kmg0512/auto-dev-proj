import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:frontend/main.dart';

void main() {
  testWidgets('MainNavigationScreen should contain an AdMob banner placeholder', (WidgetTester tester) async {
    // Build our app and trigger a frame.
    await tester.pumpWidget(const GuildRoutineApp(isTestMode: true));

    // Verify that the AdMob banner placeholder is present.
    // We expect a widget with key 'admob_banner_placeholder' or a specific container.
    expect(find.byKey(const Key('admob_banner_placeholder')), findsOneWidget);
  });
}
