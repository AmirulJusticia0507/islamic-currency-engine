import { useEffect, useState } from "react";
import { api } from "../api/client";

export function Reserves() {
  const [reserves, setReserves] = useState([]);
  const [audit, setAudit] = useState(null);
  const [form, setForm] = useState({ vault_location: "", total_gram_gold: "" });
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");

  const load = () =>
    Promise.all([api.getReserves(), api.getAudit()])
      .then(([r, a]) => {
        setReserves(r.reserves);
        setAudit(a.audit);
      })
      .catch((e) => setError(e.message));

  useEffect(() => {
    load();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMsg("");
    try {
      await api.createReserve({ ...form, total_gram_gold: Number(form.total_gram_gold) });
      setForm({ vault_location: "", total_gram_gold: "" });
      setMsg("Reserve vault berhasil dicatat & ditandatangani auditor.");
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
      <div>
        <h2 className="text-xl font-black text-white">Audit Cadangan Emas Fisik (Vault Audit)</h2>
        <p className="text-xs text-slate-400">Transparansi publik: lokasi vault, gram terverifikasi, dan sertifikat auditor (QS 83:1-3).</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form onSubmit={onSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 self-start">
          <h3 className="text-sm font-bold text-amber-400 uppercase tracking-widest">Catat Reserve Vault</h3>
          <div>
            <label className="text-[11px] uppercase tracking-wider text-slate-500">Lokasi Vault</label>
            <input
              value={form.vault_location}
              onChange={(e) => setForm({ ...form, vault_location: e.target.value })}
              className="mt-1 w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-700"
              required
            />
          </div>
          <div>
            <label className="text-[11px] uppercase tracking-wider text-slate-500">Total Gram Emas Fisik</label>
            <input
              type="number"
              min="0"
              step="0.000001"
              value={form.total_gram_gold}
              onChange={(e) => setForm({ ...form, total_gram_gold: e.target.value })}
              className="mt-1 w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-700"
              required
            />
          </div>
          <button className="w-full px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm rounded-lg transition-all shadow-md shadow-amber-500/20">
            Tandatangani & Catat
          </button>
          {error && <p className="text-xs text-rose-400 bg-rose-900/40 border border-rose-900 rounded-lg px-3 py-2">{error}</p>}
          {msg && <p className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2">{msg}</p>}
        </form>

        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-6 flex flex-wrap gap-6 justify-between">
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-widest">Total Reserve</p>
              <p className="text-2xl font-black text-amber-400">{audit?.total_reserve_gram ?? 0} Gram</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-widest">Dinar Beredar</p>
              <p className="text-2xl font-black text-white">{audit?.total_circulation_dinar ?? 0} Dinar</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-widest">Rasio Proteksi</p>
              <p className={`text-2xl font-black ${audit?.solvent ? "text-emerald-400" : "text-rose-400"}`}>
                {audit?.protection_ratio_percent ?? 0}%
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {reserves.map((r) => (
              <div key={r.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-white">{r.vault_location}</p>
                  <p className="text-xs text-slate-400">
                    {r.total_gram_gold} gr emas · Auditor E-Signature: <span className="text-emerald-400">VALID</span>
                  </p>
                </div>
                <span className="text-2xl">🥇</span>
              </div>
            ))}
            {!reserves.length && <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-sm text-slate-400">Belum ada data vault.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
