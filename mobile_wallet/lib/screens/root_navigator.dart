import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../services/currency_service.dart';
import 'dashboard_screen.dart';
import 'transfer_screen.dart';
import 'vault_audit_screen.dart';
import 'legal_screen.dart';
import 'login_screen.dart';

const _storage = FlutterSecureStorage();

class RootNavigator extends StatefulWidget {
  const RootNavigator({super.key});

  @override
  State<RootNavigator> createState() => _RootNavigatorState();
}

class _RootNavigatorState extends State<RootNavigator> {
  int _index = 0;

  static const _screens = [
    DashboardScreen(),
    TransferScreen(),
    VaultAuditScreen(),
    LegalScreen(),
  ];

  Future<void> _logout() async {
    setAuthToken(null);
    await _storage.delete(key: 'auth_token');
    await _storage.delete(key: 'token');
    await _storage.delete(key: 'wallet_address');
    if (mounted) {
      Navigator.of(context).pushAndRemoveUntil(
        MaterialPageRoute(builder: (_) => const LoginScreen()),
        (route) => false,
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _screens[_index],
      bottomNavigationBar: NavigationBar(
        selectedIndex: _index,
        onDestinationSelected: (i) => setState(() => _index = i),
        backgroundColor: const Color(0xFF0F172A),
        indicatorColor: const Color(0xFF047857),
        destinations: const [
          NavigationDestination(icon: Icon(Icons.dashboard), label: 'Dashboard'),
          NavigationDestination(icon: Icon(Icons.swap_horiz), label: 'Sarf'),
          NavigationDestination(icon: Icon(Icons.shield), label: 'Vault'),
          NavigationDestination(icon: Icon(Icons.gavel), label: 'Legal'),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _logout,
        tooltip: 'Logout (hapus token dari Secure Storage)',
        backgroundColor: const Color(0xFF881337),
        child: const Icon(Icons.logout),
      ),
    );
  }
}
