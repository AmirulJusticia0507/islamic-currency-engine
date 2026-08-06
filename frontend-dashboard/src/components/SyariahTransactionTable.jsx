export function SyariahTransactionTable({ transactions }) {
  return (
    <div className="overflow-x-auto bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl">
      <table className="w-full text-left text-sm text-slate-300">
        <thead className="bg-slate-800/80 text-amber-400 font-bold border-b border-slate-700">
          <tr>
            <th className="px-5 py-4">Transaction Hash</th>
            <th className="px-5 py-4">Pengirim & Penerima</th>
            <th className="px-5 py-4">Nominal (Dinar)</th>
            <th className="px-5 py-4">Akad Syar'i</th>
            <th className="px-5 py-4">Status</th>
            <th className="px-5 py-4">Waktu</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {transactions.map((tx) => (
            <tr key={tx.id} className="hover:bg-slate-800/50 transition-all">
              <td className="px-5 py-4 font-mono text-xs text-amber-500/90">{tx.transaction_hash}</td>
              <td className="px-5 py-4">
                <div className="text-xs">
                  <p className="text-slate-400">
                    From: <span className="text-slate-200 font-mono">{tx.sender_wallet.substring(0, 10)}...</span>
                  </p>
                  <p className="text-slate-400">
                    To: <span className="text-slate-200 font-mono">{tx.receiver_wallet.substring(0, 10)}...</span>
                  </p>
                </div>
              </td>
              <td className="px-5 py-4 font-bold text-white">
                {tx.amount_dinar} Dinar
                <span className="block text-[10px] text-amber-400 font-normal">({tx.underlying_gold_gram}g Emas)</span>
              </td>
              <td className="px-5 py-4">
                <span className="px-2.5 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-md text-xs font-bold">
                  {tx.akad_type}
                </span>
              </td>
              <td className="px-5 py-4">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  {tx.status}
                </span>
              </td>
              <td className="px-5 py-4 text-xs text-slate-500">{new Date(tx.created_at).toLocaleString("id-ID")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
