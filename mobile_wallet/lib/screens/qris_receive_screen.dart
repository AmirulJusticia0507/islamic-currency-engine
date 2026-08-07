import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../services/currency_service.dart';

const _storage = FlutterSecureStorage();

class QrisReceiveScreen extends StatefulWidget {
  const QrisReceiveScreen({super.key});

  @override
  State<QrisReceiveScreen> createState() => _QrisReceiveScreenState();
}

class _QrisReceiveScreenState extends State<QrisReceiveScreen> {
  final _service = CurrencyService();
  bool _loading = true;
  String _dataUrl = '';
  String _error = '';
  final _amountCtrl = TextEditingController();
  String _amount = '';

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() {
      _loading = true;
      _error = '';
    });
    final wallet = await _storage.read(key: 'wallet_address') ?? '';
    try {
      final qty = double.tryParse(_amountCtrl.text.replaceAll(',', '.')) * 1.0;
      final url = await _service.getQrisImage(wallet, amount: qty == 0 ? null : qty);
      setState(() {
        _dataUrl = url;
        _loading = false;
      });
    } catch (e) {
      setState(() {
        _error = e.toString();
        _loading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Terima via QRIS')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          TextField(
            controller: _amountCtrl,
            keyboardType: const TextInputType.numberWithOptions(decimal: true),
            decoration: const InputDecoration(
              labelText: 'Nominal (kosongkan = bebas isi oleh pengirim)',
              filled: true,
              fillColor: Color(0xFF0F172A),
              border: OutlineInputBorder(),
            ),
            onSubmitted: (_) => _load(),
          ),
          const SizedBox(height: 12),
          SizedBox(
            height: 48,
            child: FilledButton(
              onPressed: _load,
              style: FilledButton.styleFrom(backgroundColor: const Color(0xFF047857)),
              child: const Text('Generate QR'),
            ),
          ),
          const SizedBox(height: 20),
          if (_loading)
            const Center(child: CircularProgressIndicator())
          else if (_error.isNotEmpty)
            Text(_error, style: const TextStyle(color: Color(0xFFFB7185), fontSize: 12))
          else ...[
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
              ),
              child: _dataUrl.startsWith('data:image')
                  ? Image.memory(base64Decode(_dataUrl.split(',').last))
                  : const Text('QR tidak tersedia', style: TextStyle(color: Colors.black)),
            ),
            const SizedBox(height: 12),
            const Text('Pindai QR ini untuk kirim Dinar ke wallet Anda',
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 12, color: Color(0xFF94A3B8))),
          ],
        ],
      ),
    );
  }
}