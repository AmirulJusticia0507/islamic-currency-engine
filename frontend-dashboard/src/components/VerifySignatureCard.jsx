import { useState } from "react";
import { api } from "../api/client";

export function VerifySignatureCard() {
  const [hash, setHash] = useState("");
  const [sig, setSig] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const onVerify = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);
    try {
      const r = await api.verifySignature(hash.trim(), sig.trim());
      setResult(r);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
      <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-widest">Verifikasi E-Signature Transaksi (RSA)</h3>
      <form onSubmit={onVerify} className="space-y-3">
        <div>
          <label className="text-[11px] uppercase tracking-wider text-slate-500">Transaction Hash</label>
          <input
            value={hash}
            onChange={(e) => setHash(e.target.value)}
            className="mt-1 w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-700"
            placeholder="hash dari ledger (klik di tabel untuk isi otomatis)"
          />
        </div>
        <div>
          <label className="text-[11px] uppercase tracking-wider text-slate-500">Notary Signature (base64)</label>
          <textarea
            value={sig}
            onChange={(e) => setSig(e.target.value)}
            rows={3}
            className="mt-1 w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-[10px] text-white font-mono focus:outline-none focus:border-emerald-700"
            placeholder="tempel notary_signature"
          />
        </div>
        <button className="w-full px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm rounded-lg transition-all">
          Verifikasi Keaslian
        </button>
        {error && <p className="text-xs text-rose-400 bg-rose-900/40 border border-rose-900 rounded-lg px-3 py-2">{error}</p>}
        {result && (
          <p
            className={`text-xs font-bold rounded-lg px-3 py-2 border ${
              result.valid
                ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/30"
                : "text-rose-400 bg-rose-500/10 border-rose-500/30"
            }`}
          >
            {result.valid ? "✔ SIGNATURE ASLI · Dokumen tidak diubah" : "✘ SIGNATURE TIDAK VALID / dokumen berubah"}
          </p>
        )}
      </form>
    </div>
  );
}