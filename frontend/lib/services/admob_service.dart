import 'package:google_mobile_ads/google_mobile_ads.dart';
import 'package:flutter/foundation.dart';

class AdMobService {
  static RewardedAd? _rewardedAd;
  static bool _isAdLoaded = false;

  static String get rewardedAdUnitId {
    if (kReleaseMode) {
      // Real Ad Unit ID for production
      return 'ca-app-pub-3940256099942544/5224354917'; // Test ID
    } else {
      return 'ca-app-pub-3940256099942544/5224354917'; // Test ID
    }
  }

  static void loadRewardedAd() {
    RewardedAd.load(
      adUnitId: rewardedAdUnitId,
      request: const AdRequest(),
      rewardedAdLoadCallback: RewardedAdLoadCallback(
        onAdLoaded: (ad) {
          _rewardedAd = ad;
          _isAdLoaded = true;
          debugPrint('Rewarded Ad Loaded');
        },
        onAdFailedToLoad: (error) {
          _rewardedAd = null;
          _isAdLoaded = false;
          debugPrint('Rewarded Ad Failed to Load: $error');
        },
      ),
    );
  }

  static void showRewardedAd({required Function(RewardItem) onRewardEarned}) {
    if (_isAdLoaded && _rewardedAd != null) {
      _rewardedAd!.fullScreenContentCallback = FullScreenContentCallback(
        onAdDismissedFullScreenContent: (ad) {
          ad.dispose();
          _isAdLoaded = false;
          loadRewardedAd(); // Preload next ad
        },
        onAdFailedToShowFullScreenContent: (ad, error) {
          ad.dispose();
          _isAdLoaded = false;
          loadRewardedAd();
        },
      );

      _rewardedAd!.show(onUserEarnedReward: (ad, reward) {
        onRewardEarned(reward);
      });
    } else {
      debugPrint('Ad not loaded yet');
      loadRewardedAd();
    }
  }
}
