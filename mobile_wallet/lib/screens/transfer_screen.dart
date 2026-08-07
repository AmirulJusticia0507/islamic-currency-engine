import 'dart:math';
import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:local_auth/local_auth.dart';
import '../services/currency_service.dart';

const _storage = FlutterSecureStorage();
final _localAuth = LocalAuthentication();

class TransferScreen extends StatefulWidget {
  const TransferScreen({super.key});

  @override
  State<TransferScreen> createState() => _TransferScreenState();
}

class _TransferScreenState extends State<TransferScreen> {
  final _service = CurrencyService();
  final _receiver = TextEditingController();
  final _amount = TextEditingController();
  String _akad = 'SARF';
  bool _loading = false;
  String _result = '';
  bool _isError = false;

  Future<String> _getDeviceId() async {
    var id = await _storage.read(key: 'device_id');
    if (id == null) {
      id = 'DEV-${DateTime.now().millisecondsSinceEpoch}-${Random().nextInt(9000) + 1000}';
      await _storage.write(key: 'device_id', value: id);
    }
    return id!;
  }

  Future<bool> _authenticate() async {
    try {
      final available = await _localAuth.canCheckBiometrics;
      if (!available) {
        setState(() => _result = 'Perangkat tidak mendukung sidik jari / biometrik.');
        return false;
      }
      return await _localAuth.authenticate(
        localizedReason: 'Verifikasi sidik jari untuk mengotorisasi transaksi Akad Sarf',
        options: const AuthenticationOptions(biometricOnly: true),
      );
    } catch (e) {
      setState(() => _result = 'Gagal memanggil biometrik: $e');
      return false;
    }
  }

  Future<void> _send() async {
    final sender = await _storage.read(key: 'wallet_address') ?? '';
    final receiver = _receiver.text.trim();
    final amount = double.tryParse(_amount.text.replaceAll(',', '.'));
    if (sender.isEmpty || receiver.isEmpty || amount == null) {
      setState(() {
        _isError = true;
        _result = 'Isi wallet tujuan dan nominal yang valid.';
      });
      return;
    }

    setState(() {
      _loading = true;
      _isError = false;
      _result = 'Meminta verifikasi sidik jari...';
    });

    try {
      final ok = await _authenticate();
      if (!ok) {
        setState(() {
          _loading = false;
          _isError = true;
          _result = 'Verifikasi biometrik dibatalkan / gagal. Transaksi batal.';
        });
        return;
      }

      final deviceId = await _getDeviceId();
      await _service.registerBiometric(walletAddress: sender, deviceId: deviceId, deviceName: 'IDCE Mobile');
      final token = await _service.verifyBiometric(walletAddress: sender, deviceId: deviceId);

      final res = await _service.transfer(
        sender: sender,
        receiver: receiver,
        amount: amount,
        akadType: _akad,
        biometricToken: token,
      );
      setState(() {
        _isError = false;
        _result = '✔ SUCCESS (Biometrik terverifikasi)\nHash: ${res['transaction_hash']}\nUnderlying: ${res['underlying_gold_gram']} gr emas';
      });
    } catch (e) {
      setState(() {
        _isError = true;
        _result = e.toString();
      });
    } finally {
      setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Kirim & Terima (Akad Sarf)')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Card(
            color: const Color(0xFF0F172A),
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Settlement Kontan (Yada bi Yadin)',
                      style: TextStyle(fontSize: 11, color: Color(0xFF94A3B8))),
                  const SizedBox(height: 16),
                  TextField(
                    controller: _receiver,
                    decoration: const InputDecoration(
                      labelText: 'Wallet Penerima',
                      filled: true,
                      fillColor: Color(0xFF020617),
                      border: OutlineInputBorder(),
                    ),
                  ),
                  const SizedBox(height: 12),
                  TextField(
                    controller: _amount,
                    keyboardType: TextInputType.numberWithOptions(decimal: true),
                    decoration: const InputDecoration(
                      labelText: 'Nominal (Dinar)',
                      filled: true,
                      fillColor: Color(0xFF020617),
                      border: OutlineInputBorder(),
                    ),
                  ),
                  const SizedBox(height: 12),
                  DropdownButtonFormField<String>(
                    value: _akad,
                    dropdownColor: const Color(0xFF0F172A),
                    decoration: const InputDecoration(
                      labelText: 'Akad Syar\'i',
                      filled: true,
                      fillColor: Color(0xFF020617),
                      border: OutlineInputBorder(),
                    ),
                    items: const [
                      DropdownMenuItem(value: 'SARF', child: Text('SARF — Tukar Menukar')),
                      DropdownMenuItem(value: 'WADIAH', child: Text('WADIAH — Titipan')),
                      DropdownMenuItem(value: 'UJRAH', child: Text('UJRAH — Biaya Jasa')),
                    ],
                    onChanged: (v) => setState(() => _akad = v ?? 'SARF'),
                  ),
                  const SizedBox(height: 16),
                  SizedBox(
                    width: double.infinity,
                    child: FilledButton(
                      onPressed: _loading ? null : _send,
                      style: FilledButton.styleFrom(
                        backgroundColor: const Color(0xFF047857),
                        padding: const EdgeInsets.symmetric(vertical: 14),
                      ),
                      child: _loading
                          ? const CircularProgressIndicator(strokeWidth: 2, color: Colors.white)
                          : const Text('Kirim (Verifikasi Sidik Jari + Settlement)'),
                    ),
                  ),
                  if (_result.isNotEmpty) ...[
                    const SizedBox(height: 12),
                    Text(
                      _result,
                      style: TextStyle(
                        fontSize: 12,
                        color: _isError ? const Color(0xFFFB7185) : const Color(0xFF10B981),
                      ),
                    ),
                  ],
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
