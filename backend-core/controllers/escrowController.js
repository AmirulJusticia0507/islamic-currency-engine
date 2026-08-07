const { sequelize, Escrow, LegalDispute, UserWallet } = require("../models");
const { DINAR_GRAM } = require("../utils/shariahValidator");
const { log } = require("../utils/auditLog");

function makeReference(userId) {
  return "ESC-" + Date.now().toString(36).toUpperCase() + "-" + (userId || "X").toString().slice(0, 6);
}

exports.create = async (req, res) => {
  const { payer_wallet, payee_wallet, amount_dinar, reason } = req.body;
  if (!payer_wallet || !payee_wallet || !(amount_dinar > 0)) {
    return res.status(400).json({ error: "payer_wallet, payee_wallet, amount_dinar wajib diisi" });
  }
  const payer = await UserWallet.findByPk(payer_wallet);
  const payee = await UserWallet.findByPk(payee_wallet);
  if (!payer || !payee) return res.status(404).json({ error: "wallet tidak ditemukan" });
  if (Number(payer.balance_dinar) < Number(amount_dinar)) {
    return res.status(400).json({ error: "saldo dinar tidak mencukupi untuk escrow" });
  }

  const t = await sequelize.transaction();
  try {
    payer.balance_dinar = Number(payer.balance_dinar) - Number(amount_dinar);
    await payer.save({ transaction: t });

    const escrow = await Escrow.create(
      {
        reference: makeReference(req.user.id),
        payer_wallet,
        payee_wallet,
        amount_dinar: amount_dinar,
        underlying_gold_gram: Number(amount_dinar) * DINAR_GRAM,
        reason: reason || null,
        status: "HOLDING",
      },
      { transaction: t }
    );
    await t.commit();

    await log(req.user.id, "escrow:create", "Escrow", escrow.id, { reference: escrow.reference, amount: amount_dinar });
    res.status(201).json({ escrow });
  } catch (err) {
    await t.rollback();
    res.status(500).json({ error: err.message });
  }
};

exports.release = async (req, res) => {
  const escrow = await Escrow.findByPk(req.params.escrow_id);
  if (!escrow) return res.status(404).json({ error: "escrow tidak ditemukan" });
  if (escrow.status !== "HOLDING") return res.status(400).json({ error: "escrow bukan dalam status HOLDING" });

  const t = await sequelize.transaction();
  try {
    const payee = await UserWallet.findByPk(escrow.payee_wallet, { transaction: t, lock: t.LOCK.UPDATE });
    payee.balance_dinar = Number(payee.balance_dinar) + Number(escrow.amount_dinar);
    await payee.save({ transaction: t });
    escrow.status = "RELEASED";
    escrow.released_at = new Date();
    await escrow.save({ transaction: t });
    await t.commit();
    await log(req.user.id, "escrow:release", "Escrow", escrow.id, { reference: escrow.reference });
    res.json({ escrow });
  } catch (err) {
    await t.rollback();
    res.status(500).json({ error: err.message });
  }
};

exports.refund = async (req, res) => {
  const escrow = await Escrow.findByPk(req.params.escrow_id);
  if (!escrow) return res.status(404).json({ error: "escrow tidak ditemukan" });
  if (escrow.status !== "HOLDING") return res.status(400).json({ error: "escrow tidak dapat di-refund" });

  const t = await sequelize.transaction();
  try {
    const payer = await UserWallet.findByPk(escrow.payer_wallet, { transaction: t, lock: t.LOCK.UPDATE });
    payer.balance_dinar = Number(payer.balance_dinar) + Number(escrow.amount_dinar);
    await payer.save({ transaction: t });
    escrow.status = "REFUNDED";
    escrow.released_at = new Date();
    await escrow.save({ transaction: t });
    await t.commit();
    await log(req.user.id, "escrow:refund", "Escrow", escrow.id, { reference: escrow.reference });
    res.json({ escrow });
  } catch (err) {
    await t.rollback();
    res.status(500).json({ error: err.message });
  }
};

exports.openDispute = async (req, res) => {
  const escrow = await Escrow.findByPk(req.body.escrow_id);
  if (!escrow) return res.status(404).json({ error: "escrow tidak ditemukan" });
  if (escrow.status !== "HOLDING") return res.status(400).json({ error: "hanya escrow HOLDING yang dapat disengketakan" });

  const caseNum = "CASE-" + Date.now().toString(36).toUpperCase();
  const t = await sequelize.transaction();
  try {
    escrow.status = "DISPUTED";
    await escrow.save({ transaction: t });
    const dispute = await LegalDispute.create(
      {
        case_number: caseNum,
        escrow_id: escrow.id,
        party_a_wallet: escrow.payer_wallet,
        party_b_wallet: escrow.payee_wallet,
        amount_dinar: escrow.amount_dinar,
        claim: req.body.claim || "Sengketa transaksi escrow",
        adjudication: req.body.adjudication || "BASYARNAS",
        mediator_wallet: req.body.mediator_wallet || null,
        status: "OPEN",
      },
      { transaction: t }
    );
    await t.commit();
    await log(req.user.id, "escrow:dispute", "LegalDispute", dispute.id, { case: caseNum });
    res.status(201).json({ dispute });
  } catch (err) {
    await t.rollback();
    res.status(500).json({ error: err.message });
  }
};

exports.resolveDispute = async (req, res) => {
  const dispute = await LegalDispute.findByPk(req.params.dispute_id, { include: [{ association: "escrow" }] });
  if (!dispute) return res.status(404).json({ error: "sengketa tidak ditemukan" });
  if (dispute.status !== "OPEN") return res.status(400).json({ error: "sengketa tidak terbuka" });
  const { side, resolution } = req.body;
  if (!["A", "B", "split"].includes(side)) return res.status(400).json({ error: "side harus A, B, atau split" });

  const t = await sequelize.transaction();
  try {
    const amount = Number(dispute.amount_dinar);
    if (side === "A") {
      const payer = await UserWallet.findByPk(dispute.party_a_wallet, { transaction: t, lock: t.LOCK.UPDATE });
      payer.balance_dinar = Number(payer.balance_dinar) + amount;
      await payer.save({ transaction: t });
    } else if (side === "B") {
      const payee = await UserWallet.findByPk(dispute.party_b_wallet, { transaction: t, lock: t.LOCK.UPDATE });
      payee.balance_dinar = Number(payee.balance_dinar) + amount;
      await payee.save({ transaction: t });
    } else {
      const half = amount / 2;
      const payer = await UserWallet.findByPk(dispute.party_a_wallet, { transaction: t, lock: t.LOCK.UPDATE });
      const payee = await UserWallet.findByPk(dispute.party_b_wallet, { transaction: t, lock: t.LOCK.UPDATE });
      payer.balance_dinar = Number(payer.balance_dinar) + half;
      payee.balance_dinar = Number(payee.balance_dinar) + half;
      await payer.save({ transaction: t });
      await payee.save({ transaction: t });
    }

    if (dispute.escrow) {
      dispute.escrow.status = "RELEASED";
      dispute.escrow.released_at = new Date();
      await dispute.escrow.save({ transaction: t });
    }
    dispute.status = "RESOLVED";
    dispute.resolution = resolution || `Diselesaikan keputusan BASYARNAS (pihak ${side})`;
    dispute.resolved_at = new Date();
    await dispute.save({ transaction: t });
    await t.commit();
    await log(req.user.id, "escrow:resolve", "LegalDispute", dispute.id, { side, case: dispute.case_number });
    res.json({ dispute });
  } catch (err) {
    await t.rollback();
    res.status(500).json({ error: err.message });
  }
};

exports.list = async (req, res) => {
  const escrows = await Escrow.findAll({
    include: [{ model: UserWallet, as: "payee" }],
    order: [["created_at", "DESC"]],
    limit: Number(req.query.limit) || 50,
  });
  res.json({ escrows });
};

exports.listDisputes = async (req, res) => {
  const disputes = await LegalDispute.findAll({ order: [["created_at", "DESC"]], limit: Number(req.query.limit) || 50 });
  res.json({ disputes });
};