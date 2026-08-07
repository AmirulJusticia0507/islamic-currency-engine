import 'dart:convert';
import 'package:http/http.dart' as http;

class CurrencyService {
  final String baseUrl;

  CurrencyService({this.baseUrl = 'http://10.0.2.2:5000/api'});

  Future<Map<String, dynamic>> _get(String path) async {
    final res = await http.get(Uri.parse('$baseUrl$path'));
    if (res.statusCode != 200) throw Exception('HTTP ${res.statusCode}');
    return jsonDecode(res.body) as Map<String, dynamic>;
  }

  Future<Map<String, dynamic>> _post(String path, Map<String, dynamic> body) async {
    final res = await http.post(
      Uri.parse('$baseUrl$path'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(body),
    );
    if (res.statusCode != 200 && res.statusCode != 201) {
      throw Exception(_cleanError(res.body));
    }
    return jsonDecode(res.body) as Map<String, dynamic>;
  }

  String _cleanError(String body) {
    try {
      final d = jsonDecode(body);
      return (d['reason'] ?? d['error'] ?? 'Gagal').toString();
    } catch (_) {
      return body;
    }
  }

  Future<Map<String, dynamic>> getWallet(String address) => _get('/wallets/$address');

  Future<Map<String, dynamic>> getBalance(String address) => _get('/wallets/$address/balance');

  Future<Map<String, dynamic>> createWallet(String userId) => _post('/wallets', {'user_id': userId});

  Future<Map<String, dynamic>> registerBiometric({
    required String walletAddress,
    required String deviceId,
    required String deviceName,
  }) =>
      _post('/biometric/register', {
        'wallet_address': walletAddress,
        'device_id': deviceId,
        'device_name': deviceName,
      });

  Future<String> verifyBiometric({required String walletAddress, required String deviceId}) async {
    final res = await _post('/biometric/verify', {'wallet_address': walletAddress, 'device_id': deviceId});
    return res['token'] as String;
  }

  Future<Map<String, dynamic>> transfer({
    required String sender,
    required String receiver,
    required double amount,
    required String akadType,
    required String biometricToken,
  }) =>
      _post('/transactions/transfer', {
        'sender': sender,
        'receiver': receiver,
        'amount': amount,
        'akad_type': akadType,
        'biometric_token': biometricToken,
      });

  Future<Map<String, dynamic>> getTransactions() => _get('/transactions');

  Future<Map<String, dynamic>> getAudit() => _get('/reserves/audit');

  Future<Map<String, dynamic>> getLegalContracts() => _get('/legal/contracts');

  Future<Map<String, dynamic>> getLegalPartners() => _get('/legal/partners');

  Future<String> getQrisImage(String walletAddress, {double? amount}) async {
    final q = amount != null ? '?amount=$amount' : '';
    final res = await _get('/qris/$walletAddress/qr$q');
    return res['dataUrl'] as String;
  }
}
