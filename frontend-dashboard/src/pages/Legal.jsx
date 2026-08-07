import { useEffect, useState } from "react";
import { api } from "../api/client";
import { LegalNotaryCard } from "../components/LegalNotaryCard";
import { BiometricPanel } from "../components/BiometricDevicePanel";

function ContractRow({ contract, open, onToggle }) {
  const [verify, setVerify] = useState(null);
  const [busy, setBusy] = useState(false);

  const doVerify = async () => {
    setBusy(true);
    try {
      setVerify(await api.verifyLegalContract(contract.id));
    } catch (e) {
      setVerify({ valid: false, reason: e.message });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="p-6 bg-slate-900 border border-rose-900/50 rounded-2xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-white">{contract.document_title}</p>
          <p className="text-xs font-mono text-amber-300 mt-1">{contract.contract_number}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Notaris: <span className="text-white">{contract.partner?.official_name || "-"}</span> · {contract.partner?.license_number}
          </p>
        </div>
        <span className={`px-2.5 py-1 text-[11px] font-bold rounded-full border ${
          verify?.valid ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" : "bg-slate-800 text-slate-300 border-slate-700"
        }`}>
          {verify ? (verify.valid ? "✓ Asli" : "✘ Tidak Valid") : "E-Sign RSA"}
        </span>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-800 flex flex-wrap gap-2">
        <button
          onClick={doVerify}
          disabled={busy}
          className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg transition-all disabled:opacity-40"
        >
          {busy ? "Memeriksa…" : "🔍 Verifikasi Akta"}
        </button>
        <a
          href={`/api/legal/contracts/${contract.id}/pdf`}
          target="_blank"
          rel="noreferrer"
          className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg transition-all"
        >
          📄 Unduh Akta PDF
        </a>
      </div>
      {verify && (
        <p className={`text-xs mt-2 ${verify.valid ? "text-emerald-400" : "text-rose-400"}`}>{verify.reason}</p>
      )}
    </div>
  );
}

export function Legal() {
  const [contracts, setContracts] = useState([]);
  const [partners, setPartners] = useState([]);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ contract_number: "", legal_partner_id: "", document_title: "" });
  const [createdPdf, setCreatedPdf] = useState(null);

  const load = () =>
    Promise.all([api.getLegalContracts(), api.getLegalPartners()])
      .then(([c, p]) => {
        setContracts(c.contracts);
        setPartners(p.partners);
      })
      .catch((e) => setError(e.message));

  useEffect(() => {
    load();
  }, []);

  const onCreate = async (e) => {
    e.preventDefault();
    setError("");
    setCreatedPdf(null);
    try {
      const res = await api.createContract(form);
      setCreatedPdf(res.aktaPdfBase64);
      setForm({ contract_number: "", legal_partner_id: "", document_title: "" });
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const downloadPdf = () => {
    const bin = atob(createdPdf);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    const blob = new Blob([bytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${form.contract_number || "akta"}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
      <div>
        <h2 className="text-xl font-black text-white">Modul Legalitas & Notaris</h2>
        <p className="text-xs text-slate-400">Akta Kitabah & Syahadah (QS Al-Baqarah: 282) · E-Signature RSA 2048 · DPS & Legal Counsel.</p>
      </div>

      {error && <div className="bg-rose-900/40 text-rose-400 border border-rose-900 rounded-xl px-4 py-3 text-xs">{error}</div>}

      <div>
        <h3 className="text-sm font-bold text-rose-400 uppercase tracking-widest mb-3">Akta Otentik Notaris & Pengacara</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contracts.map((c) => (
            <div key={c.id}>
              <ContractRow contract={c} />
            </div>
          ))}
{!contracts.length && (
          <div className="bg-slate-900 border border-rose-900/50 rounded-2xl p-6 text-sm text-slate-400">Belum ada akta. Hubungi notaris / legal counsel.</div>
        )}
      </div>
      </div>

      <div>
        <h3 className="text-sm font-bold text-amber-400 uppercase tracking-widest mb-3">Buat Akta Baru (Pejabat Notaris)</h3>
        <form onSubmit={onCreate} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-[11px] uppercase tracking-wider text-slate-500">Nomor Akta</label>
            <input
              value={form.contract_number}
              onChange={(e) => setForm({ ...form, contract_number: e.target.value })}
              className="mt-1 w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
              required
            />
          </div>
          <div>
            <label className="text-[11px] uppercase tracking-wider text-slate-500">Mitra Hukum (Notaris/PPAT)</label>
            <select
              value={form.legal_partner_id}
              onChange={(e) => setForm({ ...form, legal_partner_id: e.target.value })}
              className="mt-1 w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              required
            >
              <option value="">Pilih…</option>
              {partners.map((p) => (
                <option key={p.id} value={p.id}>{p.official_name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[11px] uppercase tracking-wider text-slate-500">Judul Dokumen Akta</label>
            <input
              value={form.document_title}
              onChange={(e) => setForm({ ...form, document_title: e.target.value })}
              className="mt-1 w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              required
            />
          </div>
          <div className="md:col-span-3 flex items-center gap-3">
            <button className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg transition-all">✍️ Tandatangani & Genapkan PDF Akta</button>
            <button type="button" onClick={load} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-lg transition-all">↻ Refresh</button>
          </div>
        </form>
        {createdPdf && (
          <div className="mt-4 flex flex-wrap items-center gap-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl px-4 py-3">
            <p className="text-xs text-emerald-400 font-bold">✔ Akta terbit & ditandatangani RSA Notaris. Unduh:</p>
            <button onClick={downloadPdf} className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg transition-all">⬇️ Unduh PDF ({Math.round(createdPdf.length * 0.75 / 1024)} KB)</button>
          </div>
        )}
      </div>
    </div>
  );
}
