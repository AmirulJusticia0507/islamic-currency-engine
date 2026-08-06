class SyariahTransaction {
  final String transactionHash;
  final String senderWallet;
  final String receiverWallet;
  final double amountDinar;
  final String akadType;
  final double underlyingGoldGram;
  final String status;
  final DateTime? createdAt;

  const SyariahTransaction({
    required this.transactionHash,
    required this.senderWallet,
    required this.receiverWallet,
    required this.amountDinar,
    required this.akadType,
    required this.underlyingGoldGram,
    required this.status,
    this.createdAt,
  });

  factory SyariahTransaction.fromJson(Map<String, dynamic> json) {
    return SyariahTransaction(
      transactionHash: json['transaction_hash'] as String? ?? '',
      senderWallet: json['sender_wallet'] as String? ?? '',
      receiverWallet: json['receiver_wallet'] as String? ?? '',
      amountDinar: double.tryParse(json['amount_dinar'].toString()) ?? 0,
      akadType: json['akad_type'] as String? ?? '',
      underlyingGoldGram: double.tryParse(json['underlying_gold_gram'].toString()) ?? 0,
      status: json['status'] as String? ?? '',
      createdAt: json['created_at'] != null ? DateTime.tryParse(json['created_at']) : null,
    );
  }
}
