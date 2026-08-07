import 'dart:convert';
import 'package:http/http.dart' as http;

String? _authToken;
void setAuthToken(String? t) => _authToken = t;

class CurrencyService {
  final String baseUrl;

  CurrencyService({this.baseUrl = 'http://10.0.2.2:5000/api'});

  Map<String, String> _headers({bool json = false}) => {
        if (_authToken != null) 'Authorization': 'Bearer $_authToken',
        if (json) 'Content-Type': 'application/json',
      };

  Future<Map<String, dynamic>> _get(String path) async {
    final res = await http.get(Uri.parse('$baseUrl$path'), headers: _headers());
    if (res.statusCode != 200) throw Exception(_cleanError(res.body));
    return jsonDecode(res.body) as Map<String, dynamic>;
  }

  Future<Map<String, dynamic>> _post(String path, Map<String, dynamic> body) async {
    final res = await http.post(
      Uri.parse('$baseUrl$path'),
      headers: _headers(json: true),
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

  Future<Map<String, dynamic>> login(String userId, String password) => _post('/auth/login', {'user_id': userId, 'password': password});

  Future<Map<String, dynamic>> register(String userId, String password) => _post('/auth/register', {'user_id': userId, 'password': password});

  Future<Map<String, dynamic>> me() => _get('/auth/me');

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
