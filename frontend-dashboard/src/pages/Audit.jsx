import { useEffect, useState } from "react";
import { api } from "../api/client";

function Section({ title, tone = "amber", children }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <h3 className={`text-sm font-bold ${tone === "rose" ? "text-rose-400" : "text-amber-400"} uppercase tracking-widest mb-4`}>{title}</h3>
      {children}
    </div>
  );
}

export function Audit() {
  const [logs, setLogs] = useState([]);
  const [escrows, setEscrows] = useState([]);
  const [disputes, setDisputes] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const data = await Promise.allSettled([
        api.getAuditLogs(),
        api.listEscrows(),
        api.listDisputes(),
        api.getNotifications(),
      ]);
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

  const escRow = (esc) => {
    const tone = { HOLDING: "amber", RELEASED: "emerald", REFUNDED: "slate", DISPUTED: "rose" }[esc.status];
    return (
      <div key={esc.id} className="flex flex-wrap items-center gap-3 px-5 py-3 border-b border-slate-800 last:border-0">
        <span className="text-xs font-mono text-white">{esc.reference}</span>
        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
          tone === "emerald" ? "bg-emerald-500/10 text-emerald-400" : tone === "rose" ? "bg-rose-500/10 text-rose-400" : "bg-slate-700 text-slate-300"
        }`}>{esc.status}</span>
        <span className="text-xs text-slate-400">{esc.amount_dinar} Dinar · {esc.underlying_gold_gram} gr</span>
        <span className="text-[11px] text-slate-500 font-mono ml-auto">→ {esc.payee_wallet}</span>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
      <div>
        <h2 className="text-xl font-black text-white">Audit Trail & Smart Escrow</h2>
        <p className="text-xs text-slate-400">Jejak audit tak berubah, escrow amanah, dan sengketa dituntaskan Tahkim / BASYARNAS.</p>
      </div>

      {error && <div className="bg-rose-900/40 text-rose-400 border border-rose-900 rounded-xl px-4 py-3 text-xs">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Section title="Escrow Aktif">
          {escrows.length ? escrows.map(escrow) : <p className="text-xs text-slate-500">Belum ada escrow.</p>}
        </Section>

        <Section title="Sengketa Tahkim / BASYARNAS" tone="rose">
          {disputes.length ? (
            disputes.map((dis) => (
              <div key={dis.id} className="flex flex-wrap items-center gap-3 px-5 py-3 border-b border-slate-800 last:border-0">
                <span className="text-xs font-mono text-white">{dis.case_number}</span>
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                  dis.status === "OPEN" ? "bg-rose-500/10 text-rose-400" : "bg-emerald-500/10 text-emerald-400"
                }`}>{dis.status}</span>
                <span className="text-xs text-slate-400">{dis.amount_dinar} Dinar · {dis.adjudication}</span>
                <span className="text-[11px] text-slate-500 text-right ml-auto w-48 truncate">{dis.claim}</span>
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