export function LegalNotaryCard({ contractNo, notaryName, licenseNo, pdfUrl }) {
  return (
    <div className="p-6 bg-slate-900 border border-rose-900/50 rounded-2xl shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">⚖️</span>
          <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider">
            Akta Legalisasi Notaris & Pengacara
          </h4>
        </div>
        <span className="px-3 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/30 rounded-full text-[11px] font-semibold">
          Sah Hukum Positif (QS 2:282)
        </span>
      </div>

      <div className="space-y-3 text-xs text-slate-300">
        <div className="flex justify-between">
          <span className="text-slate-500">Nomor Akta Notaris:</span>
          <span className="font-mono text-amber-300 font-bold">{contractNo}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Pejabat Notaris / PPAT:</span>
          <span className="font-semibold text-white">{notaryName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">No. Izin SK Kemenkumham:</span>
          <span className="font-mono text-slate-400">{licenseNo}</span>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[11px] text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          E-Signature RSA Notaris Valid
        </div>
        <a
          href={pdfUrl}
          target="_blank"
          rel="noreferrer"
          className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg transition-all shadow-md shadow-amber-500/20"
        >
          📄 Unduh Berkas Akta PDF
        </a>
      </div>
    </div>
  );
}
