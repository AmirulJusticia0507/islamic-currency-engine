import { useState } from "react";
import { api, setToken } from "../api/client";

export function Login({ onLogin }) {
  const [user_id, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("login");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = mode === "login" ? await api.login({ user_id, password }) : await api.register({ user_id, password });
      setToken(res.token);
      const me = await api.me();
      onLogin(me.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-6">
        <div className="text-center space-y-1">
          <span className="text-3xl">☪️</span>
          <h1 className="text-lg font-black text-white tracking-wide">IDCE ACCESS</h1>
          <p className="text-[11px] text-amber-400 uppercase tracking-widest">Role & Permission Management</p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-[11px] uppercase tracking-wider text-slate-500">User ID</label>
<input
              value={user_id}
              onChange={(e) => setUser(e.target.value)}
              className="mt-1 w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-700"
              required
            />
          </div>
          <div>
            <label className="text-[11px] uppercase tracking-wider text-slate-500">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-700"
              required
            />
          </div>
          {error && <p className="text-xs text-rose-400 bg-rose-900/40 border border-rose-900 rounded-lg px-3 py-2">{error}</p>}
          <button className="w-full px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm rounded-lg transition-all shadow-md shadow-emerald-700/20">
            {loading ? "Memuat..." : mode === "login" ? "Masuk" : "Daftar"}
          </button>
        </form>
        <button onClick={() => setMode(mode === "login" ? "register" : "login")} className="w-full text-center text-[11px] text-slate-400 hover:text-white">
          {mode === "login" ? "Belum punya akun? Daftar (role USER)" : "Sudah punya akun? Masuk"}
        </button>
        <div className="border-t border-slate-800 pt-4 text-[11px] text-slate-500 leading-relaxed">
          Akun bawaan seed: <code className="text-amber-400">admin/admin123</code> · <code className="text-amber-400">auditor/audit123</code> ·{" "}
          <code className="text-amber-400">notaris/notar123</code> · <code className="text-amber-400">user/user123</code>
        </div>
      </div>
    </div>
  );
}