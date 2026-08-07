import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../services/currency_service.dart';
import '../models/wallet.dart';
import '../models/transaction.dart';
import 'qris_receive_screen.dart';

const _storage = FlutterSecureStorage();

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  final _service = CurrencyService();
  Wallet? _wallet;
  List<SyariahTransaction> _transactions = [];
  String _error = '';

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    final walletAddress = await _storage.read(key: 'wallet_address') ?? '';
    if (walletAddress.isEmpty) return;
    try {
      final walletJson = await _service.getWallet(walletAddress);
      final txs = await _service.getTransactions();
      setState(() {
        _wallet = Wallet.fromJson(walletJson['wallet'] as Map<String, dynamic>);
        _transactions = (txs['transactions'] as List<dynamic>)
            .map((t) => SyariahTransaction.fromJson(t as Map<String, dynamic>))
            .toList()
          ..sort((a, b) => (b.createdAt ?? DateTime(0)).compareTo(a.createdAt ?? DateTime(0)));
      });
    } catch (e) {
      setState(() => _error = e.toString());
    }
  }

  @override
  Widget build(BuildContext context) {
    final wallet = _wallet;
    return Scaffold(
      appBar: AppBar(
        title: const Text('Dashboard'),
        actions: [
          IconButton(
            icon: const Icon(Icons.qr_code),
            tooltip: 'QRIS Terima',
            onPressed: () => Navigator.of(context).push(
              MaterialPageRoute(builder: (_) => const QrisReceiveScreen()),
            ),
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: _load,
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            Card(
              color: const Color(0xFF0F172A),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16),
                side: const BorderSide(color: Color(0x4DF59E0B)),
              ),
              child: Padding(
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('SALDO DINAR',
                        style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFFFBBF24))),
                    const SizedBox(height: 6),
                    Text(
                      wallet == null ? '...' : '${wallet.balanceDinar.toStringAsFixed(6)} Dinar',
                      style: const TextStyle(fontSize: 28, fontWeight: FontWeight.w900, color: Colors.white),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      wallet == null ? 'memuat...' : wallet.walletAddress,
                      style: const TextStyle(fontSize: 11, color: Color(0xFF94A3B8), fontFamily: 'monospace'),
                    ),
                    const SizedBox(height: 12),
                    const Row(
                      children: [
                        Icon(Icons.verified, size: 14, color: Color(0xFF10B981)),
                        SizedBox(width: 4),
                        Text('DPS & Notaris: Terverifikasi',
                            style: TextStyle(fontSize: 11, color: Color(0xFF10B981))),
                      ],
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 20),
            const Text('RIWAYAT TRANSAKSI (AKAD SARF)',
                style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFFFBBF24))),
            const SizedBox(height: 8),
            if (_error.isNotEmpty)
              Padding(
                padding: const EdgeInsets.only(bottom: 12),
                child: Text(_error, style: const TextStyle(color: Color(0xFFFB7185), fontSize: 12)),
              ),
            ..._transactions.map((t) => Card(
                  color: const Color(0xFF0F172A),
                  child: ListTile(
                    title: Text('${t.amountDinar.toStringAsFixed(6)} Dinar',
                        style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.white)),
                    subtitle: Text(
                      '${t.senderWallet.substring(0, 8)} → ${t.receiverWallet.substring(0, 8)}\n'
                      '${t.akadType} · ${t.underlyingGoldGram} gr emas',
                      style: const TextStyle(fontSize: 11, color: Color(0xFF94A3B8)),
                    ),
                    trailing: Text(t.status,
                        style: const TextStyle(fontSize: 11, color: Color(0xFF10B981), fontWeight: FontWeight.bold)),
                  ),
                )),
            if (_transactions.isEmpty && _error.isEmpty)
              const Padding(
                padding: EdgeInsets.all(16),
                child: Text('Belum ada transaksi.', style: TextStyle(color: Color(0xFF94A3B8))),
              ),
          ],
        ),
      ),
    );
  }
}
