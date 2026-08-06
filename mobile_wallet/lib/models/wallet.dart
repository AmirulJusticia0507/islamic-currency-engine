class Wallet {
  final String walletAddress;
  final String userId;
  final double balanceDinar;

  const Wallet({
    required this.walletAddress,
    required this.userId,
    required this.balanceDinar,
  });

  factory Wallet.fromJson(Map<String, dynamic> json) {
    return Wallet(
      walletAddress: json['wallet_address'] as String? ?? '',
      userId: json['user_id'] as String? ?? '',
      balanceDinar: double.tryParse(json['balance_dinar'].toString()) ?? 0,
    );
  }
}
