import 'package:flutter_test/flutter_test.dart';
import 'package:frontend/main.dart';

void main() {
  testWidgets('AdMob Spike Dummy UI Test', (WidgetTester tester) async {
    // Build our app and trigger a frame.
    await tester.pumpWidget(const GuildRoutineApp());

    // Verify that our title is present.
    expect(find.text('Dummy UI for GuildRoutine'), findsOneWidget);
    
    // Verify that the button is present.
    expect(find.text('Watch Ad to Recover Streak'), findsOneWidget);
  });
}
