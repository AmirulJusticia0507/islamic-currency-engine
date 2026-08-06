import { useEffect, useState } from "react";
import { api } from "../api/client";
import { GoldReserveCard } from "../components/GoldReserveCard";
import { SyariahTransactionTable } from "../components/SyariahTransactionTable";

export function Dashboard() {
  const [audit, setAudit] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([api.getAudit(), api.getTransactions()])
      .then(([a, t]) => {
        setAudit(a.audit);
        setTransactions(t.transactions.slice(0, 8));
      })
      .catch((e) => setError(e.message));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-white">Ringkasan Cadangan & Transaksi</h2>
          <p className="text-xs text-slate-400">Status audit syariah real-time dari NewSQL ledger engine.</p>
        </div>
        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-bold">
          {audit && audit.solvent ? "SOLVENT" : "RE-CHECK"}
        </span>
      </div>

      {error && <div className="bg-rose-900/40 text-rose-400 border border-rose-900 rounded-xl px-4 py-3 text-xs">{error}</div>}

      <GoldReserveCard
        totalGram={audit?.total_reserve_gram ?? 0}
        totalCirculation={audit?.total_circulation_dinar ?? 0}
        ratioPercent={audit?.protection_ratio_percent ?? 0}
      />

      <div>
        <h3 className="text-sm font-bold text-amber-400 uppercase tracking-widest mb-3">Transaksi Terakhir (Akad Sarf)</h3>
        {transactions.length ? (
          <SyariahTransactionTable transactions={transactions} />
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-sm text-slate-400">Belum ada transaksi.</div>
        )}
      </div>
    </div>
  );
}
