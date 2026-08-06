import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../services/currency_service.dart';
import '../models/wallet.dart';
import '../models/transaction.dart';
import 'root_navigator.dart';

const storage = FlutterSecureStorage();

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _controller = TextEditingController();
  final _service = CurrencyService();
  bool _loading = false;
  String _error = '';

  Future<void> _login() async {
    final userId = _controller.text.trim();
    if (userId.isEmpty) return;
    setState(() {
      _loading = true;
      _error = '';
    });
    try {
      final res = await _service.createWallet(userId);
      final wallet = res['wallet'] as Map<String, dynamic>;
      await storage.write(key: 'auth_token', value: userId);
      await storage.write(key: 'wallet_address', value: wallet['wallet_address'] as String);
      if (mounted) {
        Navigator.of(context).pushAndRemoveUntil(
          MaterialPageRoute(builder: (_) => const RootNavigator()),
          (route) => false,
        );
      }
    } catch (e) {
      setState(() => _error = e.toString());
    } finally {
      setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Text('☪️', style: TextStyle(fontSize: 56)),
              const SizedBox(height: 8),
              const Text('IDCE WALLET',
                  style: TextStyle(fontSize: 22, fontWeight: FontWeight.w900, color: Colors.white)),
              const Text('Akad Wadi\'ah Yad Dhamanah',
                  style: TextStyle(fontSize: 12, color: Color(0xFFFBBF24))),
              const SizedBox(height: 32),
              TextField(
                controller: _controller,
                decoration: InputDecoration(
                  labelText: 'User ID',
                  hintText: 'contoh: amirul',
                  filled: true,
                  fillColor: const Color(0xFF0F172A),
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                ),
              ),
              const SizedBox(height: 16),
              if (_error.isNotEmpty)
                Padding(
                  padding: const EdgeInsets.only(bottom: 12),
                  child: Text(_error, style: const TextStyle(color: Color(0xFFFB7185), fontSize: 12)),
                ),
              SizedBox(
                width: double.infinity,
                child: FilledButton(
                  onPressed: _loading ? null : _login,
                  style: FilledButton.styleFrom(
                    backgroundColor: const Color(0xFF047857),
                    padding: const EdgeInsets.symmetric(vertical: 14),
                  ),
                  child: _loading
                      ? const CircularProgressIndicator(strokeWidth: 2, color: Colors.white)
                      : const Text('Masuk / Buat Wallet'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
