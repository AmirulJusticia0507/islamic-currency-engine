const NAV_ITEMS = [
  { key: "dashboard", label: "📊 Dashboard" },
  { key: "transactions", label: "🔁 Transaksi (Sarf)" },
  { key: "reserves", label: "🥇 Vault Audit" },
  { key: "legal", label: "⚖️ Legal & Notaris" },
];

export function Navbar({ active, onChange }) {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">☪️</span>
          <div>
            <h1 className="text-sm font-black text-white tracking-wide">ISLAMIC CURRENCY ENGINE</h1>
            <p className="text-[10px] text-amber-400 uppercase tracking-widest">Admin · Auditor · Notaris Panel</p>
          </div>
        </div>
        <nav className="flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              onClick={() => onChange(item.key)}
              className={`px-3 py-2 text-xs font-bold rounded-lg transition-all ${
                active === item.key
                  ? "bg-emerald-700 text-white shadow-md shadow-emerald-700/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
