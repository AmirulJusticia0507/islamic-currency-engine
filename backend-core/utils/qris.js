// QRIS payload builder (EMVCo TLV2 + CRC16) untuk terima pembayaran dimensi Dinar.
// Catatan: QRIS komersial resmi wajib melalui PSP berlisensi (id + IDR). Ini untuk keperluan
// engine/edukasi: menghasilkan QR bergaya QRIS yang bisa dipindai wallet untuk isi alamat tujuan.

function tlv(tag, value) {
  const len = Buffer.byteLength(value, "utf8");
  return tag + String(len).padStart(2, "0") + value;
}

function subTlv(maps) {
  return maps
    .map(([id, value]) => tlv(id, value))
    .join("");
}

function buildQrisPayload({ walletAddress, merchantName, city = "JAKARTA", categoryCode = "5499", amount, currency = "360", staticCode = "12" }) {
  const merchantId = `WALLET:${walletAddress}`;
  const merchantIdentifier = subTlv([
    ["00", "IDCE.DINAR"],
    ["01", merchantId],
    ["02", "WHOLE.ISLAMIC.FINTECH"],
  ]);

  const parts = [];
  parts.push(tlv("00", "01")); // Payload Format Indicator
  parts.push(tlv("01", staticCode)); // PPI (12 = static)
  parts.push(tlv("26", merchantIdentifier)); // Merchant Account Info
  parts.push(tlv("52", categoryCode)); // MCC
  parts.push(tlv("53", currency)); // Currency code
  if (amount) parts.push(tlv("54", amount.toFixed(6))); // Amount opsional (kosong = minta pembeli isi)
  parts.push(tlv("58", "ID")); // Negara
  parts.push(tlv("59", (merchantName || "IDCE MERCHANT").slice(0, 25))); // Merchant name
  parts.push(tlv("60", city.slice(0, 15))); // Kota

  const body = parts.join("");
  const crc = crc16CCITT(Buffer.from(body + "6304", "utf8")).toString(16).toUpperCase().padStart(4, "0");
  return body + "6304" + crc;
}

function crc16CCITT(buf) {
  let crc = 0xffff;
  for (const byte of buf) {
    crc ^= byte << 8;
    for (let i = 0; i < 8; i++) {
      crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
    }
  }
  return crc;
}

module.exports = { buildQrisPayload, crc16CCITT, tlv };