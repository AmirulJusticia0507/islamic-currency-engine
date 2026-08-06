import 'package:flutter/material.dart';
import '../services/currency_service.dart';
import '../models/audit.dart';

class VaultAuditScreen extends StatefulWidget {
  const VaultAuditScreen({super.key});

  @override
  State<VaultAuditScreen> createState() => _VaultAuditScreenState();
}

class _VaultAuditScreenState extends State<VaultAuditScreen> {
  final _service = CurrencyService();
  AuditSummary? _audit;
  String _error = '';

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    try {
      final res = await _service.getAudit();
      setState(() => _audit = AuditSummary.fromJson(res['audit'] as Map<String, dynamic>));
    } catch (e) {
      setState(() => _error = e.toString());
    }
  }

  @override
  Widget build(BuildContext context) {
    final audit = _audit;
    return Scaffold(
      appBar: AppBar(title: const Text('Audit Cadangan Emas (Vault)')),
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
                    const Text('RASIO PROTEKSI SYARIAH (100% ASSET-BACKED)',
                        style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFFFBBF24))),
                    const SizedBox(height: 12),
                    _stat('Total Cadangan Emas', '${audit?.totalReserveGram ?? 0} Gram'),
                    _stat('Koin Dinar Beredar', '${audit?.totalCirculationDinar ?? 0} Dinar'),
                    _stat('Reserve Wajib', '${audit?.requiredReserveGram ?? 0} Gram'),
                    const SizedBox(height: 8),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text('Rasio', style: TextStyle(fontSize: 12, color: Color(0xFF94A3B8))),
                        Text(
                          '${audit?.ratioPercent ?? 0}%',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w900,
                            color: (audit?.solvent ?? false) ? const Color(0xFF10B981) : const Color(0xFFFB7185),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        Icon(Icons.circle, size: 10, color: (audit?.solvent ?? false) ? const Color(0xFF10B981) : const Color(0xFFFB7185)),
                        const SizedBox(width: 6),
                        Text(
                          audit == null ? 'memuat...' : (audit.solvent ? 'SOLVENT — aman & syar\'i' : 'RE-CHECK diperlukan'),
                          style: TextStyle(
                            fontSize: 12,
                            color: (audit?.solvent ?? false) ? const Color(0xFF10B981) : const Color(0xFFFB7185),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 20),
            const Text('DAFTAR VAULT & SERTIFIKAT AUDITOR',
                style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFFFBBF24))),
            const SizedBox(height: 8),
            if (_error.isNotEmpty)
              Padding(
                padding: const EdgeInsets.only(bottom: 12),
                child: Text(_error, style: const TextStyle(color: Color(0xFFFB7185), fontSize: 12)),
              ),
            ...(audit?.vaults ?? []).map((v) => Card(
                  color: const Color(0xFF0F172A),
                  child: ListTile(
                    leading: const Text('🥇', style: TextStyle(fontSize: 24)),
                    title: Text(v.vaultLocation, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                    subtitle: Text('${v.totalGramGold} gr emas · E-Signature Auditor',
                        style: const TextStyle(fontSize: 11, color: Color(0xFF94A3B8))),
                    trailing: Icon(Icons.verified,
                        color: v.signatureValid ? const Color(0xFF10B981) : const Color(0xFFFB7185)),
                  ),
                )),
            if ((audit?.vaults ?? []).isEmpty && _error.isEmpty)
              const Padding(
                padding: EdgeInsets.all(16),
                child: Text('Belum ada data vault.', style: TextStyle(color: Color(0xFF94A3B8))),
              ),
          ],
        ),
      ),
    );
  }

  Widget _stat(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(fontSize: 12, color: Color(0xFF94A3B8))),
          Text(value,
              style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Colors.white)),
        ],
      ),
    );
  }
}
