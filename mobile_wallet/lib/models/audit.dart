class VaultReserve {
  final int id;
  final String vaultLocation;
  final double totalGramGold;
  final bool signatureValid;

  const VaultReserve({
    required this.id,
    required this.vaultLocation,
    required this.totalGramGold,
    this.signatureValid = false,
  });

  factory VaultReserve.fromJson(Map<String, dynamic> json) {
    return VaultReserve(
      id: json['id'] as int? ?? 0,
      vaultLocation: json['vault_location'] as String? ?? '',
      totalGramGold: double.tryParse(json['total_gram_gold'].toString()) ?? 0,
      signatureValid: json['auditor_signature_valid'] as bool? ?? false,
    );
  }
}

class AuditSummary {
  final double totalReserveGram;
  final double totalCirculationDinar;
  final double ratioPercent;
  final bool solvent;
  final List<VaultReserve> vaults;

  const AuditSummary({
    required this.totalReserveGram,
    required this.totalCirculationDinar,
    required this.ratioPercent,
    required this.solvent,
    required this.vaults,
  });

  factory AuditSummary.fromJson(Map<String, dynamic> json) {
    final vaults = (json['vaults'] as List<dynamic>? ?? [])
        .map((v) => VaultReserve.fromJson(v as Map<String, dynamic>))
        .toList();
    return AuditSummary(
      totalReserveGram: double.tryParse(json['total_reserve_gram'].toString()) ?? 0,
      totalCirculationDinar: double.tryParse(json['total_circulation_dinar'].toString()) ?? 0,
      ratioPercent: double.tryParse(json['protection_ratio_percent'].toString()) ?? 0,
      solvent: json['solvent'] as bool? ?? false,
      vaults: vaults,
    );
  }
}
