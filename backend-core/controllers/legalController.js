const { LegalPartner, LegalContract } = require("../models");
const { rsaSign } = require("../utils/keys");
const { buildAktaPdf } = require("../utils/pdfAkta");
const { log } = require("../utils/auditLog");

exports.createPartner = async (req, res) => {
  const { partner_type, official_name, license_number, public_key_pem } = req.body;
  if (!partner_type || !official_name || !license_number || !public_key_pem) {
    return res.status(400).json({ error: "partner_type, official_name, license_number, public_key_pem wajib diisi" });
  }
  const existing = await LegalPartner.findOne({ where: { license_number } });
  if (existing) return res.status(409).json({ error: "license_number sudah terdaftar" });
  const partner = await LegalPartner.create({ partner_type, official_name, license_number, public_key_pem });
  await log(req.user.id, "legal:partner:create", "LegalPartner", partner.id, { name: official_name });
  res.status(201).json({ partner });
};

exports.listPartners = async (req, res) => {
  const partners = await LegalPartner.findAll();
  res.json({ partners });
};

exports.createContract = async (req, res) => {
  const { contract_number, legal_partner_id, transaction_hash, document_title, clauses, notary_name } = req.body;
  if (!contract_number || !legal_partner_id || !document_title) {
    return res.status(400).json({ error: "contract_number, legal_partner_id, document_title wajib diisi" });
  }
  const partner = await LegalPartner.findByPk(legal_partner_id);
  if (!partner) return res.status(404).json({ error: "mitra hukum tidak ditemukan" });

  const document_pdf_url = `/api/legal/contracts/${contract_number}/pdf`;
  const signedDoc = rsaSign(`${contract_number}:${document_title}:${document_pdf_url}:${transaction_hash || ""}`);

  const contract = await LegalContract.create({
    contract_number,
    legal_partner_id,
    transaction_hash: transaction_hash || null,
    document_title,
    document_pdf_url,
    notary_signature: signedDoc,
  });

  const pdf = await buildAktaPdf({
    contractNumber: contract_number,
    documentTitle: document_title,
    notaryName: notary_name || partner.official_name || "Notaris IDCE",
    createdAt: new Date(),
    signedHash: signedDoc,
  });

  await log(req.user.id, "legal:contract:create", "LegalContract", contract.id, { contract_number });
  res.status(201).json({ contract, aktaPdfBase64: pdf.toString("base64") });
};

exports.listContracts = async (req, res) => {
  const contracts = await LegalContract.findAll({ include: [{ association: "partner" }], order: [["created_at", "DESC"]] });
  res.json({ contracts });
};

exports.getContract = async (req, res) => {
  const contract = await LegalContract.findByPk(req.params.id, { include: [{ association: "partner" }] });
  if (!contract) return res.status(404).json({ error: "kontrak tidak ditemukan" });
  res.json({ contract });
};

exports.verify = async (req, res) => {
  const contract = await LegalContract.findByPk(req.params.id);
  if (!contract) return res.status(404).json({ error: "kontrak tidak ditemukan" });

  const { rsaVerify, getPublicKey } = require("../utils/keys");
  const expected = `${contract.contract_number}:${contract.document_title}:${contract.document_pdf_url}:${contract.transaction_hash || ""}`;
  const valid = rsaVerify(expected, contract.notary_signature, getPublicKey());

  await log(req.user.id, "legal:contract:verify", "LegalContract", contract.id, { valid });
  res.json({ valid, reason: valid ? "Signature RSA asli" : "Signature tidak valid / dokumen diubah" });
};

exports.getPdf = async (req, res) => {
  const contract = await LegalContract.findByPk(req.params.id, { include: [{ association: "partner" }] });
  if (!contract) return res.status(404).json({ error: "kontrak tidak ditemukan" });

  const pdf = await buildAktaPdf({
    contractNumber: contract.contract_number,
    documentTitle: contract.document_title,
    notaryName: (contract.partner && contract.partner.official_name) || "Notaris IDCE",
    createdAt: contract.created_at,
    signedHash: contract.notary_signature,
  });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="akta-${contract.contract_number}.pdf"`);
  res.send(pdf);
};