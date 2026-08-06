// Syariah Transaction Validator
// Kaidah Fiqih Muamalah: bebas riba, bebas gharar, akad sarf kontan (yada bi yadin)

const AKAD_TYPES = ["SARF", "WADIAH", "UJRAH"];
const DINAR_GRAM = 4.25; // 1 Dinar = 4.25 gram emas

function validateAkad(akadType) {
  return AKAD_TYPES.includes(akadType);
}

function dinarToGoldGram(amountDinar) {
  const gram = Number(amountDinar) * DINAR_GRAM;
  return Number(gram.toFixed(6));
}

function validateTransferPayload({ sender, receiver, amount }) {
  const errors = [];
  if (!sender || !receiver) errors.push("sender & receiver wajib diisi");
  if (sender === receiver) errors.push("pengirim dan penerima tidak boleh sama");
  if (!(amount > 0)) errors.push("nominal harus lebih dari nol");
  if (Number.isNaN(Number(amount))) errors.push("nominal tidak valid");
  return errors;
}

// Larangan Riba: nilai harus tetap dan ditentukan saat akad (kontan), tidak ada pembungaan.
function assertNoRiba(amountDinar, goldGram) {
  const expected = dinarToGoldGram(amountDinar);
  if (Math.abs(expected - Number(goldGram)) > 0.000001) {
    throw new Error("Gharar: underlying emas tidak sesuai (1 Dinar = 4.25 gr). Transaksi ditolak.");
  }
}

function buildCanonicalMessage(tx) {
  return [
    tx.sender_wallet,
    tx.receiver_wallet,
    tx.amount_dinar,
    tx.akad_type,
    tx.underlying_gold_gram,
    tx.created_at ? tx.created_at.toISOString() : new Date().toISOString(),
  ].join("|");
}

module.exports = { AKAD_TYPES, DINAR_GRAM, validateAkad, dinarToGoldGram, validateTransferPayload, assertNoRiba, buildCanonicalMessage };
