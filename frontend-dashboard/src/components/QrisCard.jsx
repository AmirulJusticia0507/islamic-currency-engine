import { useState } from "react";
import { api } from "../api/client";

export function QrisCard({ initialWallet }) {
  const [wallet, setWallet] = useState(initialWallet || "");
  const [amount, setAmount] = useState("");
  const [dataUrl, setDataUrl] = useState("");
  const [payload, setPayload] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const generate = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const qty = amount ? Number(amount) : null;
      const [img, pay] = await Promise.all([
        api.getQrisImage(wallet, qty),
        api.getQrisPayload(wallet, qty),
      ]);
      setDataUrl(img.dataUrl);
      setPayload(pay.payload);
    } catch (err) {
      setError(err.message);
    }
  };

  const copy = async () => {
    if (!payload) return;
    await navigator.clipboard.writeText(payload);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-amber-400 uppercase tracking-widest">📷 Terima via QRIS</h3>
        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-[11px] font-semibold">
          EMVCo TLV2
        </span>
      </div>

      <form onSubmit={generate} className="space-y-3">
        <input
          value={wallet}
          onChange={(e) => setWallet(e.target.value)}
          placeholder="Wallet Address (penerima)"
          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-700 font-mono"
          required
        />
        <div className="flex gap-3">
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Nominal Dinar (opsional)"
            type="number"
            min="0"
            className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-700"
          />
          <button className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm rounded-lg transition-all shadow-md shadow-emerald-700/20">
            Generate
          </button>
        </div>
      </form>

      {error && <p className="text-xs text-rose-400 bg-rose-900/40 border border-rose-900 rounded-lg px-3 py-2">{error}</p>}

      {dataUrl && (
        <div className="space-y-3">
          <div className="flex justify-center bg-white rounded-xl p-4">
            <img src={dataUrl} alt="QRIS" className="w-52 h-52" />
          </div>
          <button
            onClick={copy}
            className="w-full px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg transition-all shadow-md shadow-amber-500/20"
          >
            {copied ? "✔ Payload Tersalin" : "📄 Salin Payload QRIS"}
          </button>
          {payload && (
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 font-mono text-[10px] text-amber-400/80 break-all max-h-20 overflow-y-auto">
              {payload}
            </div>
          )}
        </div>
      )}
    </div>
  );
}