const NAV_ITEMS = [
  { key: "dashboard", label: "📊 Dashboard", perm: "dashboard.view" },
  { key: "transactions", label: "🔁 Transaksi (Sarf)", perm: "transaction.read" },
  { key: "gold", label: "🏅 Harga Emas", perm: "oracle.read" },
  { key: "reserves", label: "🥇 Vault Audit", perm: "reserve.read" },
  { key: "legal", label: "⚖️ Legal & Notaris", perm: "legal.read" },
  { key: "audit", label: "🗂️ Audit & Escrow", perm: "audit.read" },
  { key: "admin", label: "👥 Admin User", perm: "user:manage" },
];

export function Navbar({ active, onChange, permissions = [], onLogout, user }) {
  const visible = NAV_ITEMS.filter((i) => permissions.includes(i.perm) || permissions.includes("user:manage"));

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
          {visible.map((item) => (
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
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-slate-300 font-bold bg-slate-800/60 px-3 py-1.5 rounded-full">
            {user?.user_id} · <span className="text-amber-400">{user?.roles?.join(", ")}</span>
          </span>
          <button onClick={onLogout} className="px-3 py-1.5 text-[11px] font-bold bg-rose-900 hover:bg-rose-800 text-white rounded-lg transition-all">
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}