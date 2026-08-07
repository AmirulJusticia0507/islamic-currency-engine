import { useEffect, useState } from "react";
import { api } from "../api/client";

const ROLE_OPTIONS = ["ADMIN", "AUDITOR", "NOTARY", "LEGAL", "USER"];

export function Admin() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);

  const load = () => api.listUsers().then((u) => setUsers(u.users)).catch((e) => setError(e.message));

  useEffect(() => {
    load();
  }, []);

  const onRole = async (user, role) => {
    setBusyId(user.id);
    setError("");
    try {
      await api.assignRole(user.user_id, role);
      await load();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
      <div>
        <h2 className="text-xl font-black text-white">Administrasi User & Role (RBAC)</h2>
        <p className="text-xs text-slate-400">Kelola akses dashboard · setiap permission di-verifikasi server via JWT.</p>
      </div>

      {error && <div className="bg-rose-900/40 text-rose-400 border border-rose-900 rounded-xl px-4 py-3 text-xs">{error}</div>}

      <div className="bg-slate-900 border border-slate-800 rounded-2xl divide-y divide-slate-800 overflow-hidden">
        <div className="grid grid-cols-[1fr_1fr_1.5fr] gap-4 px-6 py-3 text-[10px] uppercase tracking-widest text-slate-500 font-bold">
          <span>User ID</span>
          <span>Status</span>
          <span>Role</span>
        </div>
        {users.map((u) => (
          <div key={u.id} className="grid grid-cols-[1fr_1fr_1.5fr] gap-4 items-center px-6 py-3">
            <span className="text-xs font-mono text-white">{u.user_id}</span>
            <span className={`text-[11px] font-bold ${u.status === "ACTIVE" ? "text-emerald-400" : "text-rose-400"}`}>{u.status}</span>
            <div className="flex flex-wrap gap-2 items-center">
              <span className="px-2 py-0.5 text-[10px] font-bold bg-slate-800 border border-slate-700 rounded-full text-amber-300">
                {u.roles?.map((r) => r.name).join(", ") || "-"}
              </span>
              <select
                value=""
                disabled={busyId === u.id}
                onChange={(e) => onRole(u, e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white focus:outline-none disabled:opacity-40"
              >
                <option value="">Ganti role…</option>
                {ROLE_OPTIONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
        {!users.length && <div className="px-6 py-4 text-sm text-slate-400">Tidak ada user.</div>}
      </div>
    </div>
  );
}