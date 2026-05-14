import 'package:flutter/material.dart';
import 'package:google_mobile_ads/google_mobile_ads.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  MobileAds.instance.initialize();
  runApp(const GuildRoutineApp());
}

class GuildRoutineApp extends StatelessWidget {
  const GuildRoutineApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'GuildRoutine',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      home: const AdMobSpikeScreen(),
    );
  }
}

class AdMobSpikeScreen extends StatefulWidget {
  const AdMobSpikeScreen({super.key});

  @override
  State<AdMobSpikeScreen> createState() => _AdMobSpikeScreenState();
}

class _AdMobSpikeScreenState extends State<AdMobSpikeScreen> {
  BannerAd? _bannerAd;
  RewardedAd? _rewardedAd;
  bool _isBannerAdLoaded = false;
  bool _isRewardedAdLoaded = false;

  final String _bannerAdUnitId = 'ca-app-pub-3940256099942544/6300978111'; // Test Banner ID
  final String _rewardedAdUnitId = 'ca-app-pub-3940256099942544/5224354917'; // Test Rewarded ID

  @override
  void initState() {
    super.initState();
    _loadBannerAd();
    _loadRewardedAd();
  }

  void _loadBannerAd() {
    _bannerAd = BannerAd(
      adUnitId: _bannerAdUnitId,
      request: const AdRequest(),
      size: AdSize.banner,
      listener: BannerAdListener(
        onAdLoaded: (ad) {
          setState(() {
            _isBannerAdLoaded = true;
          });
        },
        onAdFailedToLoad: (ad, err) {
          ad.dispose();
        },
      ),
    )..load();
  }

  void _loadRewardedAd() {
    RewardedAd.load(
      adUnitId: _rewardedAdUnitId,
      request: const AdRequest(),
      rewardedAdLoadCallback: RewardedAdLoadCallback(
        onAdLoaded: (ad) {
          setState(() {
            _rewardedAd = ad;
            _isRewardedAdLoaded = true;
          });
        },
        onAdFailedToLoad: (err) {
          _isRewardedAdLoaded = false;
        },
      ),
    );
  }

  void _showRewardedAd() {
    if (_rewardedAd != null) {
      _rewardedAd!.show(onUserEarnedReward: (AdWithoutView ad, RewardItem reward) {
        // Reward user
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Streak Recovered / Damage Boosted!')),
        );
      });
      _rewardedAd = null;
      _isRewardedAdLoaded = false;
      _loadRewardedAd(); // Load next ad
    }
  }

  @override
  void dispose() {
    _bannerAd?.dispose();
    _rewardedAd?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('GuildRoutine: AdMob Spike'),
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            const Text('Dummy UI for GuildRoutine', style: TextStyle(fontSize: 20)),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: _isRewardedAdLoaded ? _showRewardedAd : null,
              child: const Text('Watch Ad to Recover Streak'),
            ),
          ],
        ),
      ),
      bottomNavigationBar: _isBannerAdLoaded && _bannerAd != null
          ? SizedBox(
              width: _bannerAd!.size.width.toDouble(),
              height: _bannerAd!.size.height.toDouble(),
              child: AdWidget(ad: _bannerAd!),
            )
          : const SizedBox(height: 50, child: Center(child: Text('Loading Banner...'))),
    );
  }
}
