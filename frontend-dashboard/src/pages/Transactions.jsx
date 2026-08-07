import { useEffect, useState } from "react";
import { api } from "../api/client";
import { SyariahTransactionTable } from "../components/SyariahTransactionTable";
import { QrisCard } from "../components/QrisCard";

const EMPTY = { sender: "", receiver: "", amount: "", akad_type: "SARF" };

export function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [deviceId, setDeviceId] = useState(() => `DEV-${Math.random().toString(36).slice(2, 10)}`);
  const [biometricToken, setBiometricToken] = useState("");
  const [biometricOk, setBiometricOk] = useState(false);

  const load = () => api.getTransactions().then((t) => setTransactions(t.transactions)).catch((e) => setError(e.message));

  useEffect(() => {
    load();
  }, []);

  const authorizeBiometric = async () => {
    setError("");
    try {
      await api.registerBiometric({ wallet_address: form.sender, device_id: deviceId, device_name: "Admin Dashboard" });
      const res = await api.verifyBiometric({ wallet_address: form.sender, device_id: deviceId });
      setBiometricToken(res.token);
      setBiometricOk(true);
    } catch (err) {
      setError(err.message);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);
    if (!biometricOk || !biometricToken) {
      setError("Otorisasi biometrik (sidik jari) dulu sebelum kirim.");
      return;
    }
    try {
      const res = await api.transfer({ ...form, amount: Number(form.amount), biometric_token: biometricToken });
      setResult(res);
      setBiometricOk(false);
      setBiometricToken("");
      setForm(EMPTY);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
      <div>
        <h2 className="text-xl font-black text-white">Akad Sarf · Transfer Kontan (Yada bi Yadin)</h2>
        <p className="text-xs text-slate-400">Settlement real-time, bebas riba, terikat 100% gram emas (1 Dinar = 4.25 gr).</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form onSubmit={onSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 self-start">
          <h3 className="text-sm font-bold text-amber-400 uppercase tracking-widest">Transfer Dinar</h3>
          {["sender", "receiver"].map((f) => (
            <div key={f}>
              <label className="text-[11px] uppercase tracking-wider text-slate-500">{f === "sender" ? "Pengirim (Wallet)" : "Penerima (Wallet)"}</label>
              <input
                value={form[f]}
                onChange={(e) => setForm({ ...form, [f]: e.target.value })}
                className="mt-1 w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-700 font-mono"
                required
              />
            </div>
          ))}
          <div>
            <label className="text-[11px] uppercase tracking-wider text-slate-500">Nominal (Dinar)</label>
            <input
              type="number"
              min="0"
              step="0.000001"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              className="mt-1 w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-700"
              required
            />
          </div>
          <div>
            <label className="text-[11px] uppercase tracking-wider text-slate-500">Akad Syar'i</label>
            <select
              value={form.akad_type}
              onChange={(e) => setForm({ ...form, akad_type: e.target.value })}
              className="mt-1 w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-700"
            >
              <option value="SARF">SARF — Tukar Menukar (Kontan)</option>
              <option value="WADIAH">WADIAH — Titipan</option>
              <option value="UJRAH">UJRAH — Biaya Jasa</option>
            </select>
          </div>
          <button
            type="button"
            onClick={authorizeBiometric}
            disabled={!form.sender || biometricOk}
            className="w-full px-4 py-2.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white font-bold text-sm rounded-lg transition-all border border-slate-700"
          >
            {biometricOk ? "✓ Biometrik Terverifikasi (Token Aktif)" : "✋ Otorisasi Sidik Jari Sebelum Kirim"}
          </button>
          <button className="w-full px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm rounded-lg transition-all shadow-md shadow-emerald-700/20">
            Kirim Sekarang (Settlement)
          </button>
          {error && <p className="text-xs text-rose-400 bg-rose-900/40 border border-rose-900 rounded-lg px-3 py-2">{error}</p>}
          {result && (
            <div className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2 space-y-1 break-all">
              <p>✔ Transaksi SUCCESS · Biometrik terverifikasi</p>
              <p className="font-mono">Hash: {result.transaction_hash}</p>
              <p>Underlying: {result.underlying_gold_gram} gr emas</p>
            </div>
          )}
        </form>

        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-sm font-bold text-amber-400 uppercase tracking-widest mb-3">Ledger Syariah</h3>
          <SyariahTransactionTable transactions={transactions} />
          <QrisCard />
        </div>
      </div>
    </div>
  );
}
