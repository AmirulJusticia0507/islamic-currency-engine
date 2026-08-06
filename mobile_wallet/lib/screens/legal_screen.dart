import 'package:flutter/material.dart';
import '../services/currency_service.dart';

class LegalScreen extends StatefulWidget {
  const LegalScreen({super.key});

  @override
  State<LegalScreen> createState() => _LegalScreenState();
}

class _LegalScreenState extends State<LegalScreen> {
  final _service = CurrencyService();
  List<dynamic> _contracts = [];
  String _error = '';

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    try {
      final res = await _service.getLegalContracts();
      setState(() => _contracts = res['contracts'] as List<dynamic>);
    } catch (e) {
      setState(() => _error = e.toString());
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Modul Legalitas & Notaris')),
      body: RefreshIndicator(
        onRefresh: _load,
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            const Card(
              color: Color(0xFF881337),
              child: Padding(
                padding: EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('⚖️ AKTA KITABAH & SYAHADAH',
                        style: TextStyle(fontSize: 12, fontWeight: FontWeight.w900, color: Colors.white)),
                    SizedBox(height: 6),
                    Text('QS Al-Baqarah 2:282 · E-Signature RSA Notaris 2048-bit · Diawasi DPS-MUI & Legal Counsel',
                        style: TextStyle(fontSize: 11, color: Color(0xFFFFC2D1))),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),
            if (_error.isNotEmpty)
              Padding(
                padding: const EdgeInsets.only(bottom: 12),
                child: Text(_error, style: const TextStyle(color: Color(0xFFFB7185), fontSize: 12)),
              ),
            ..._contracts.map((c) {
              final partner = c['partner'] as Map<String, dynamic>? ?? {};
              return Card(
                color: const Color(0xFF0F172A),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                  side: const BorderSide(color: Color(0x66881337)),
                ),
                child: ListTile(
                  title: Text(c['document_title'] as String? ?? '',
                      style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13)),
                  subtitle: Padding(
                    padding: const EdgeInsets.only(top: 4),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('No. Akta: ${c['contract_number']}',
                            style: const TextStyle(fontSize: 11, color: Color(0xFFFBBF24), fontFamily: 'monospace')),
                        Text('Notaris: ${partner['official_name'] ?? '-'}',
                            style: const TextStyle(fontSize: 11, color: Color(0xFF94A3B8))),
                        const SizedBox(height: 6),
                        const Row(
                          children: [
                            Icon(Icons.check_circle, size: 13, color: Color(0xFF10B981)),
                            SizedBox(width: 4),
                            Text('E-Signature RSA Notaris Valid',
                                style: TextStyle(fontSize: 11, color: Color(0xFF10B981))),
                          ],
                        ),
                      ],
                    ),
                  ),
                  trailing: const Icon(Icons.picture_as_pdf, color: Color(0xFFFBBF24)),
                  onTap: () => _openPdf(c['document_pdf_url'] as String? ?? ''),
                ),
              );
            }),
            if (_contracts.isEmpty && _error.isEmpty)
              const Padding(
                padding: EdgeInsets.all(16),
                child: Text('Belum ada akta.', style: TextStyle(color: Color(0xFF94A3B8))),
              ),
          ],
        ),
      ),
    );
  }

  void _openPdf(String url) {
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Buka PDF: $url')));
  }
}
