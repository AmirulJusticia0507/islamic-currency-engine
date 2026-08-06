const { LegalPartner, LegalContract } = require("../models");
const { rsaSign } = require("../utils/keys");

exports.createPartner = async (req, res) => {
  const { partner_type, official_name, license_number, public_key_pem } = req.body;
  if (!partner_type || !official_name || !license_number || !public_key_pem) {
    return res.status(400).json({ error: "partner_type, official_name, license_number, public_key_pem wajib diisi" });
  }
  const existing = await LegalPartner.findOne({ where: { license_number } });
  if (existing) return res.status(409).json({ error: "license_number sudah terdaftar" });
  const partner = await LegalPartner.create({ partner_type, official_name, license_number, public_key_pem });
  res.status(201).json({ partner });
};

exports.listPartners = async (req, res) => {
  const partners = await LegalPartner.findAll();
  res.json({ partners });
};

exports.createContract = async (req, res) => {
  const { contract_number, legal_partner_id, transaction_hash, document_title, document_pdf_url } = req.body;
  if (!contract_number || !legal_partner_id || !document_title || !document_pdf_url) {
    return res.status(400).json({ error: "contract_number, legal_partner_id, document_title, document_pdf_url wajib diisi" });
  }
  const partner = await LegalPartner.findByPk(legal_partner_id);
  if (!partner) return res.status(404).json({ error: "mitra hukum tidak ditemukan" });

  const signedDoc = rsaSign(`${contract_number}:${document_title}:${document_pdf_url}:${transaction_hash || ""}`);
  const contract = await LegalContract.create({
    contract_number,
    legal_partner_id,
    transaction_hash: transaction_hash || null,
    document_title,
    document_pdf_url,
    notary_signature: signedDoc,
  });
  res.status(201).json({ contract });
};

exports.listContracts = async (req, res) => {
  const contracts = await LegalContract.findAll({ include: [{ association: "partner" }], order: [["created_at", "DESC"]] });
  res.json({ contracts });
};
