export function GoldReserveCard({ totalGram, totalCirculation, ratioPercent }) {
  return (
    <div className="p-6 bg-slate-900 border border-amber-500/30 rounded-2xl shadow-xl backdrop-blur-md">
      <div className="flex justify-between items-center mb-4">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
          📜 Syariah Vault Audit (Dinar Reserve)
        </span>
        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-semibold">
          100% Asset Backed
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-slate-400">Total Cadangan Emas Vault</p>
          <h3 className="text-2xl font-black text-amber-400 mt-1">{totalGram} Gram</h3>
        </div>
        <div>
          <p className="text-xs text-slate-400">Koin Dinar Beredar</p>
          <h3 className="text-2xl font-black text-white mt-1">{totalCirculation} Dinar</h3>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <span>
          Rasio Proteksi Syariah: <strong className="text-emerald-400">{ratioPercent}% (Solvent)</strong>
        </span>
        <span>
          Akad: <strong>Wadi'ah Yad Dhamanah</strong>
        </span>
      </div>
    </div>
  );
}
