import { useEffect, useState } from "react";
import { api } from "../api/client";

export function BiometricPanel() {
  const [wallet, setWallet] = useState("");
  const [deviceName, setDeviceName] = useState("");
  const [devices, setDevices] = useState([]);
  const [error, setError] = useState("");

  const load = (w) => api.listDevices(w || wallet).then((d) => setDevices(d.devices)).catch((e) => setError(e.message));

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const register = async (e) => {
    e.preventDefault();
    if (!wallet || !deviceName) return;
    setError("");
    const deviceId = `DEV-${Math.random().toString(36).slice(2, 10)}`;
    await api.registerBiometric({ wallet_address: wallet, device_id: deviceId, device_name: deviceName });
    setDeviceName("");
    load(wallet);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
      <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-widest">🫆 Perangkat Biometrik (Fingerprint)</h3>
      <p className="text-[11px] text-slate-400">
        Daftarkan perangkat yang boleh mengotorisasi transaksi. Transfer hanya lolos setelah verifikasi sidik jari menghasilkan token 2-menit.
      </p>

      <form onSubmit={register} className="space-y-3">
        <input
          value={wallet}
          onChange={(e) => setWallet(e.target.value)}
          placeholder="Wallet Address"
          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-700 font-mono"
          required
        />
        <div className="flex gap-3">
          <input
            value={deviceName}
            onChange={(e) => setDeviceName(e.target.value)}
            placeholder="Nama perangkat (mis. Pixel 8)"
            className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-700"
            required
          />
          <button className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm rounded-lg transition-all">
            Daftarkan
          </button>
        </div>
        <button
          type="button"
          onClick={() => load(wallet)}
          className="text-[11px] text-slate-400 hover:text-white underline"
        >
          Muat ulang daftar perangkat
        </button>
      </form>

      {error && <p className="text-xs text-rose-400 bg-rose-900/40 border border-rose-900 rounded-lg px-3 py-2">{error}</p>}

      <div className="divide-y divide-slate-800 border-t border-slate-800">
        {devices.map((d) => (
          <div key={d.device_id} className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-bold text-white">{d.device_name}</p>
              <p className="text-xs text-slate-400 font-mono">
                {d.device_id} · Wallet {d.wallet_address.slice(0, 12)}...
              </p>
            </div>
            <span
              className={`px-2.5 py-1 text-[11px] font-bold rounded-full border ${
                d.status === "ACTIVE"
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                  : "bg-rose-500/10 text-rose-400 border-rose-500/20"
              }`}
            >
              {d.status}
            </span>
          </div>
        ))}
        {!devices.length && <p className="py-3 text-sm text-slate-400">Belum ada perangkat biometrik.</p>}
      </div>
    </div>
  );
}