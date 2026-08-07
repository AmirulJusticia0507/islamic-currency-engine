const PDFDocument = require("pdfkit");

function buildAktaPdf({ contractNumber, documentTitle, notaryName, licenseNumber, partnerType, createdAt, signedHash }) {
  const datePublished = new Date(createdAt || Date.now()).toLocaleString("id-ID", { dateStyle: "long", timeStyle: "short" });
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const chunks = [];
    doc.on("data", (c) => chunks.push(c));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    doc.fillColor("#881337").fontSize(10).text("ISLAMIC DIGITAL CURRENCY ENGINE (IDCE)", { align: "center" });
    doc.moveDown(0.2);
    doc.fillColor("#047857").fontSize(8).text("AKAD KITABAH & SYAHADAH  |  QS. Al-Baqarah 2:282  |  E-SIGNATURE RSA 2048", { align: "center" });
    doc.moveDown(1);

    doc.fillColor("#0f172a").fontSize(16).text((documentTitle || "AKTA").toUpperCase(), { align: "center" });
    doc.moveDown(0.5);
    doc.fontSize(11).text(`Nomor Akta: ${contractNumber}`);
    doc.text(`Pejabat Notaris: ${notaryName || "-"}`);
    doc.text(`No. Izin (Kemenkumham): ${licenseNumber || "-"}`);
    doc.text(`Diterbitkan: ${datePublished || "-"}`);
    doc.moveDown(0.8);

    doc.fontSize(10).text(
      "Dengan ini dinyatakan bahwa dokumen transm tersebut sah menurut hukum positif Indonesia, " +
        "memenuhi prinsip syariat Islam (bebas riba, gharar, dan maysir), dan telah dibubuhi tanda tangan digital (E-Signature RSA 2048-bit) oleh Pejabat Notaris yang berwenang."
    );
    doc.moveDown(1.2);

    if (signedHash) {
      doc.fontSize(8).fillColor("#334155").text("Hash Signature (RSA):");
      doc.fillColor("#b45309").font("Courier").text(signedHash);
    }
    doc.moveDown(1);
    doc.fillColor("#0f172a").fontSize(12).text("Menandatangani,", { align: "right" });
    doc.moveDown(2.5);
    doc.fontSize(12).text(notaryName || "Notaris", { align: "right" });

    doc.end();
  });
}

module.exports = { buildAktaPdf };