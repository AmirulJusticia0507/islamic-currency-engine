import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../services/currency_service.dart';
import 'root_navigator.dart';

const storage = FlutterSecureStorage();

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _userController = TextEditingController();
  final _passController = TextEditingController();
  final _service = CurrencyService();
  bool _loading = false;
  bool _registerMode = false;
  String _error = '';

  Future<void> _submit() async {
    final userId = _userController.text.trim();
    final password = _passController.text;
    if (userId.isEmpty || password.isEmpty) return;
    setState(() {
      _loading = true;
      _error = '';
    });
    try {
      final res = _registerMode ? await _service.register(userId, password) : await _service.login(userId, password);
      setAuthToken(res['token'] as String);
      await storage.write(key: 'auth_token', value: userId);
      await storage.write(key: 'token', value: res['token'] as String);

      // Pastikan wallet ada (idempotent)
      final w = await _service.createWallet(userId);
      await storage.write(key: 'wallet_address', value: (w['wallet'] as Map<String, dynamic>)['wallet_address'] as String);

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
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Text('☪️', style: TextStyle(fontSize: 56)),
              const SizedBox(height: 8),
              const Text('IDCE WALLET',
                  style: TextStyle(fontSize: 22, fontWeight: FontWeight.w900, color: Colors.white)),
              const Text('Secure · Akad Syari · RBAC',
                  style: TextStyle(fontSize: 12, color: Color(0xFFFBBF24))),
              const SizedBox(height: 32),
              TextField(
                controller: _userController,
                decoration: InputDecoration(
                  labelText: 'User ID',
                  hintText: 'contoh: amirul',
                  filled: true,
                  fillColor: const Color(0xFF0F172A),
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                ),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: _passController,
                obscureText: true,
                decoration: InputDecoration(
                  labelText: 'Password',
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
                  onPressed: _loading ? null : _submit,
                  style: FilledButton.styleFrom(
                    backgroundColor: const Color(0xFF047857),
                    padding: const EdgeInsets.symmetric(vertical: 14),
                  ),
                  child: _loading
                      ? const CircularProgressIndicator(strokeWidth: 2, color: Colors.white)
                      : Text(_registerMode ? 'Daftar & Buat Wallet' : 'Masuk'),
                ),
              ),
              TextButton(
                onPressed: () => setState(() => _registerMode = !_registerMode),
                child: Text(
                  _registerMode ? 'Sudah punya akun? Masuk' : 'Belum punya akun? Daftar',
                  style: const TextStyle(fontSize: 12, color: Color(0xFF94A3B8)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}