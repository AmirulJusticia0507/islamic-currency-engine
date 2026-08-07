// Atomic Double-Entry Ledger (Strict ACID via NewSQL / Sequelize transaction)
const { sequelize, SyariahTransaction, UserWallet } = require("../models");
const { buildCanonicalMessage, assertNoRiba } = require("./shariahValidator");
const { rsaSign, hmacSign } = require("./keys");

async function atomicTransfer({ sender, receiver, amount, akadType, goldGram, note, biometricVerified = false, verifiedDeviceId = null }) {
  const t = await sequelize.transaction();
  try {
    const senderRow = await UserWallet.findByPk(sender, { transaction: t, lock: t.LOCK.UPDATE });
    const receiverRow = await UserWallet.findByPk(receiver, { transaction: t, lock: t.LOCK.UPDATE });

    if (!senderRow || !receiverRow) {
      await t.rollback();
      return { ok: false, status: "REJECTED", reason: "wallet tidak ditemukan" };
    }

    const balance = Number(senderRow.balance_dinar);
    if (balance < Number(amount)) {
      await t.rollback();
      return { ok: false, status: "REJECTED", reason: "saldo dinar tidak mencukupi (bebas overdraft)" };
    }

    assertNoRiba(amount, goldGram);

    senderRow.balance_dinar = Number(balance) - Number(amount);
    receiverRow.balance_dinar = Number(receiverRow.balance_dinar) + Number(amount);
    await senderRow.save({ transaction: t });
    await receiverRow.save({ transaction: t });

    const canonical = buildCanonicalMessage({
      sender_wallet: sender,
      receiver_wallet: receiver,
      amount_dinar: amount,
      akad_type: akadType,
      underlying_gold_gram: goldGram,
    });
    const notarySignature = rsaSign(canonical);
    const transactionHash = hmacSign(canonical);

    const txRecord = await SyariahTransaction.create(
      {
        transaction_hash: transactionHash,
        sender_wallet: sender,
        receiver_wallet: receiver,
        amount_dinar: amount,
        akad_type: akadType,
        underlying_gold_gram: goldGram,
        status: "SUCCESS",
        note: note || null,
        biometric_verified: biometricVerified,
        verified_device_id: verifiedDeviceId,
      },
      { transaction: t }
    );

    await t.commit();
    return { ok: true, transaction: txRecord, notarySignature, status: "SUCCESS" };
  } catch (err) {
    await t.rollback();
    return { ok: false, status: "REJECTED", reason: err.message };
  }
}

module.exports = { atomicTransfer };
