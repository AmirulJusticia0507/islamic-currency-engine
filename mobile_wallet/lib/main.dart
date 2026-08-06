import 'package:flutter/material.dart';
import 'screens/login_screen.dart';

ColorScheme idceScheme() => const ColorScheme.dark(
      primary: Color(0xFF047857),
      secondary: Color(0xFFF59E0B),
      tertiary: Color(0xFF881337),
      surface: Color(0xFF0F172A),
      background: Color(0xFF020617),
      onPrimary: Colors.white,
      onSecondary: Color(0xFF020617),
    );

void main() {
  runApp(const MobileWalletApp());
}

class MobileWalletApp extends StatelessWidget {
  const MobileWalletApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'IDCE Wallet',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: idceScheme(),
        scaffoldBackgroundColor: const Color(0xFF020617),
        appBarTheme: const AppBarTheme(backgroundColor: Color(0xFF020617)),
      ),
      home: const LoginScreen(),
    );
  }
}
