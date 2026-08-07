import { useEffect, useState } from "react";
import { api } from "../api/client";

const TONE = { HOLDING: "amber", RELEASED: "emerald", REFUNDED: "slate", DISPUTED: "rose" };
const BADGE = (t) =>
  t === "emerald"
    ? "bg-emerald-500/10 text-emerald-400"
    : t === "rose"
    ? "bg-rose-500/10 text-rose-400"
    : t === "amber"
    ? "bg-amber-500/10 text-amber-400"
    : "bg-slate-700 text-slate-300";

function Section({ title, tone = "amber", children }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <h3 className={`text-sm font-bold ${tone === "rose" ? "text-rose-400" : "text-amber-400"} uppercase tracking-widest mb-4`}>{title}</h3>
      {children}
    </div>
  );
}

const BTN = "px-3 py-1.5 text-[11px] font-bold rounded-lg transition-all disabled:opacity-40";

export function Audit({ permissions = [] }) {
  const [logs, setLogs] = useState([]);
  const [escrows, setEscrows] = useState([]);
  const [disputes, setDisputes] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ payer_wallet: "", payee_wallet: "", amount_dinar: "", reason: "" });
  const [busy, setBusy] = useState(null);

  const can = (p) => permissions.includes(p) || permissions.includes("user:manage");

  const load = async () => {
    try {
      const data = await Promise.allSettled([api.getAuditLogs(), api.listEscrows(), api.listDisputes(), api.getNotifications()]);
      const [a, e, d, n] = data.map((x) => (x.status === "fulfilled" ? x.value : null));
      if (a) setLogs(a.logs);
      if (e) setEscrows(e.escrows);
      if (d) setDisputes(d.disputes);
      if (n) setNotifications(n.notifications);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const act = async (key, fn) => {
    setBusy(key);
    setError("");
    try {
      await fn();
      await load();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(null);
    }
  };

  const onCreate = (e) => {
    e.preventDefault();
    act("create", () => api.createEscrow({ ...form, amount_dinar: Number(form.amount_dinar) })).then(() =>
      setForm({ payer_wallet: "", payee_wallet: "", amount_dinar: "", reason: "" })
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
      <div>
        <h2 className="text-xl font-black text-white">Audit Trail & Smart Escrow</h2>
        <p className="text-xs text-slate-400">Jejak audit tak berubah, escrow amanah, dan sengketa dituntaskan Tahkim / BASYARNAS.</p>
      </div>

      {error && <div className="bg-rose-900/40 text-rose-400 border border-rose-900 rounded-xl px-4 py-3 text-xs">{error}</div>}

      {can("escrow.write") && (
        <Section title="Buat Escrow Baru (hold dana)">
          <form onSubmit={onCreate} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
            <input value={form.payer_wallet} onChange={(e) => setForm({ ...form, payer_wallet: e.target.value })} placeholder="Wallet pembayar" className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono focus:border-amber-500 focus:outline-none" required />
            <input value={form.payee_wallet} onChange={(e) => setForm({ ...form, payee_wallet: e.target.value })} placeholder="Wallet penerima" className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono focus:border-amber-500 focus:outline-none" required />
            <input type="number" min="0" step="0.000001" value={form.amount_dinar} onChange={(e) => setForm({ ...form, amount_dinar: e.target.value })} placeholder="Jumlah (Dinar)" className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none" required />
            <input value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} placeholder="Keterangan" className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none" />
            <button className={`${BTN} bg-amber-500 hover:bg-amber-600 text-slate-950`}>🔒 Kunci (Hold)</button>
          </form>
        </Section>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Section title="Escrow">
          {escrows.length ? (
            escrows.map((esc) => (
              <div key={esc.id} className="flex flex-wrap items-center gap-3 px-5 py-3 border-b border-slate-800 last:border-0">
                <span className="text-xs font-mono text-white">{esc.reference}</span>
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${BADGE(TONE[esc.status] || "slate")}`}>{esc.status}</span>
                <span className="text-xs text-slate-400">{esc.amount_dinar} Dinar</span>
                <span className="text-[11px] text-slate-500 font-mono hidden md:inline">→ {esc.payee_wallet}</span>
                {esc.status === "HOLDING" && can("escrow.settle") && (
                  <div className="flex gap-2 ml-auto">
                    <button
                      onClick={() => act(`rel-${esc.id}`, () => api.releaseEscrow(esc.id))}
                      disabled={busy !== null}
                      className={`${BTN} bg-emerald-700 hover:bg-emerald-800 text-white`}
                    >
                      ✓ Release
                    </button>
                    <button
                      onClick={() => act(`ref-${esc.id}`, () => api.refundEscrow(esc.id))}
                      disabled={busy !== null}
                      className={`${BTN} bg-slate-700 hover:bg-slate-600 text-white`}
                    >
                      ↺ Refund
                    </button>
                  </div>
                )}
                {esc.status === "HOLDING" && can("escrow.dispute") && (
                  <div className="flex gap-2 ml-auto">
                    <button
                      onClick={() => act(`dis-${esc.id}`, () => api.openDispute({ escrow_id: esc.id, claim: "Sengketa diajukan dari dashboard" }))}
                      disabled={busy !== null}
                      className={`${BTN} bg-rose-800 hover:bg-rose-700 text-white`}
                    >
                      ⚡ Sengketa
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-500">Belum ada escrow.</p>
          )}
        </Section>

        <Section title="Sengketa Tahkim / BASYARNAS" tone="rose">
          {disputes.length ? (
            disputes.map((dis) => (
              <div key={dis.id} className="flex flex-wrap items-center gap-3 px-5 py-3 border-b border-slate-800 last:border-0">
                <span className="text-xs font-mono text-white">{dis.case_number}</span>
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${dis.status === "OPEN" ? "bg-rose-500/10 text-rose-400" : "bg-emerald-500/10 text-emerald-400"}`}>{dis.status}</span>
                <span className="text-xs text-slate-400">{dis.amount_dinar} Dinar · {dis.adjudication}</span>
                {dis.status === "OPEN" && can("escrow.resolve") ? (
                  <div className="flex gap-2 ml-auto">
                    {["A", "B", "split"].map((side) => (
                      <button
                        key={side}
                        onClick={() => act(`res-${dis.id}-${side}`, () => api.resolveDispute(dis.id, { side }))}
                        disabled={busy !== null}
                        className={`${BTN} bg-amber-700 hover:bg-amber-800 text-white uppercase`}
                      >
                        {side === "split" ? "50/50" : `Menang ${side}`}
                      </button>
                    ))}
                  </div>
                ) : (
                  <span className="text-[11px] text-slate-600 ml-auto">—</span>
                )}
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-500">Belum ada sengketa.</p>
          )}
        </Section>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Section title="Notifikasi">
          {notifications.length ? (
            notifications.map((n) => (
              <div key={n.id} className="flex items-start gap-3 px-5 py-3 border-b border-slate-800 last:border-0">
                <span className={`mt-1.5 w-2 h-2 rounded-full flex-none ${n.read_at ? "bg-slate-700" : "bg-emerald-400 animate-pulse"}`}></span>
                <div>
                  <p className="text-xs font-bold text-white">{n.title}</p>
                  <p className="text-[11px] text-slate-400">{n.body}</p>
                  <p className="text-[10px] text-slate-600">{new Date(n.created_at).toLocaleString("id-ID")}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-500">Belum ada notifikasi.</p>
          )}
        </Section>

        <Section title="Audit Log (immutable)">
          <div className="max-h-96 overflow-auto">
            {logs.length ? (
              logs.map((l) => (
                <div key={l.id} className="px-5 py-2 border-b border-slate-800 last:border-0 flex items-center gap-3">
                  <span className="text-[10px] font-mono text-slate-500">{l.created_at?.slice(0, 16)}</span>
                  <span className="text-[11px] font-mono text-amber-300">{l.action}</span>
                  <span className="text-[11px] text-slate-400">{l.entity}:{l.entity_id}</span>
                  <span className="text-[10px] text-slate-600 ml-auto">{l.actor_user}</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500">Belum ada log.</p>
            )}
          </div>
        </Section>
      </div>
    </div>
  );
}