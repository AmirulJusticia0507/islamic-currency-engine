import { useEffect, useState } from "react";
import { api } from "../api/client";

function GoldChart({ history }) {
  if (!history || history.length < 2) return <p className="text-xs text-slate-500">Belum ada riwayat harga untuk chart.</p>;
  const prices = history.map((h) => Number(h.price_per_dinar_usd));
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 1;
  const W = 700;
  const H = 220;
  const pad = 12;
  const pts = prices
    .map((p, i) => {
      const x = pad + (i / (prices.length - 1)) * (W - pad * 2);
      const y = H - pad - ((p - min) / range) * (H - pad * 2);
      return `${x},${y}`;
    })
    .join(" ");
  const last = history[history.length - 1];

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
        <polyline points={pts} fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinejoin="round" />
        <circle cx={Number(pad + ((prices.length - 1) / (prices.length - 1)) * (W - pad * 2))} cy={H - pad - ((prices[prices.length - 1] - min) / range) * (H - pad * 2)} r="4" fill="#f59e0b" />
      </svg>
      <p className="text-xs text-slate-500 mt-2">
        Terakhir: <span className="text-amber-400 font-bold">${last.price_per_dinar_usd}</span>/Dinar · sumber{" "}
        <span className="font-mono">{last.source}</span> · {new Date(last.recorded_at).toLocaleString("id-ID")}
      </p>
    </div>
  );
}

export function Gold() {
  const [price, setPrice] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    Promise.all([api.getGoldPrice(), api.getGoldHistory(30)])
      .then(([p, h]) => {
        setPrice(p.price);
        setHistory(h.history);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    const id = setInterval(load, 120000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
      <div>
        <h2 className="text-xl font-black text-white">Oracle Harga Emas (LIVE)</h2>
        <p className="text-xs text-slate-400">Sumber: <span className="font-mono">api.gold-api.com (XAU)</span> · 1 Dinar = 4.25 gram emas 24K.</p>
      </div>

      {error && <div className="bg-rose-900/40 text-rose-400 border border-rose-900 rounded-xl px-4 py-3 text-xs">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <p className="text-[11px] uppercase tracking-wider text-slate-500">Harga Emas / Gram (USD)</p>
          <p className="text-2xl font-black text-amber-400 mt-2">{loading ? "—" : `$${Number(price?.price_per_gram_usd || 0).toFixed(4)}`}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <p className="text-[11px] uppercase tracking-wider text-slate-500">Harga / Dinar (USD)</p>
          <p className="text-2xl font-black text-emerald-400 mt-2">{loading ? "—" : `$${Number(price?.price_per_dinar_usd || 0).toFixed(4)}`}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <p className="text-[11px] uppercase tracking-wider text-slate-500">Sumber & Waktu</p>
          <p className="text-lg font-bold text-white mt-2">{loading ? "—" : <span className="font-mono">{price?.source}</span>}</p>
          <p className="text-[11px] text-slate-500">{price?.updated_at ? new Date(price.updated_at).toLocaleTimeString("id-ID") : ""}</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-sm font-bold text-amber-400 uppercase tracking-widest mb-4">Grafik 30 Data Terakhir</h3>
        <GoldChart history={history} />
      </div>
    </div>
  );
}