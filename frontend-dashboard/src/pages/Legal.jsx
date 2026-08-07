import { useEffect, useState } from "react";
import { api } from "../api/client";
import { LegalNotaryCard } from "../components/LegalNotaryCard";
import { BiometricPanel } from "../components/BiometricDevicePanel";

export function Legal() {
  const [contracts, setContracts] = useState([]);
  const [partners, setPartners] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([api.getLegalContracts(), api.getLegalPartners()])
      .then(([c, p]) => {
        setContracts(c.contracts);
        setPartners(p.partners);
      })
      .catch((e) => setError(e.message));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
      <div>
        <h2 className="text-xl font-black text-white">Modul Legalitas & Notaris</h2>
        <p className="text-xs text-slate-400">Akta Kitabah & Syahadah (QS Al-Baqarah: 282) · E-Signature RSA 2048 · DPS & Legal Counsel.</p>
      </div>

      {error && <div className="bg-rose-900/40 text-rose-400 border border-rose-900 rounded-xl px-4 py-3 text-xs">{error}</div>}

      <div>
        <h3 className="text-sm font-bold text-rose-400 uppercase tracking-widest mb-3">Akta Otentik Notaris & Pengacara</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contracts.map((c) => (
            <LegalNotaryCard
              key={c.id}
              contractNo={c.contract_number}
              notaryName={c.partner?.official_name || "-"}
              licenseNo={c.partner?.license_number || "-"}
              pdfUrl={c.document_pdf_url}
            />
          ))}
          {!contracts.length && (
            <div className="bg-slate-900 border border-rose-900/50 rounded-2xl p-6 text-sm text-slate-400">
              Belum ada akta. Hubungi notaris / legal counsel.
            </div>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold text-amber-400 uppercase tracking-widest mb-3">Mitra Hukum Terdaftar</h3>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl divide-y divide-slate-800">
          {partners.map((p) => (
            <div key={p.id} className="flex items-center justify-between px-6 py-4">
              <div>
                <p className="text-sm font-bold text-white">{p.official_name}</p>
                <p className="text-xs text-slate-400 font-mono">{p.license_number}</p>
              </div>
              <span
                className={`px-2.5 py-1 text-[11px] font-bold rounded-full border ${
                  p.status === "ACTIVE"
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                }`}
              >
                {p.partner_type} · {p.status}
              </span>
            </div>
          ))}
          {!partners.length && <div className="px-6 py-4 text-sm text-slate-400">Belum ada mitra hukum.</div>}
        </div>
      </div>

      <div className="max-w-2xl">
        <BiometricPanel />
      </div>
    </div>
  );
}
