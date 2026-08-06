# STYLE GUIDELINE (TAILWIND CSS) - ISLAMIC FINTECH & LEGAL LUXURY

Panduan gaya visual untuk **React.js Dashboard** bertema **Islamic FinTech & Official Legal Luxury** (_Emerald Green, Gold, Deep Slate, & Burgundy Legal Accent_).

---

## 🎨 Skema Warna (Color Palette)

| Kategori             | Class Tailwind                            | Kode Hex  | Pengunaan                            |
| :------------------- | :---------------------------------------- | :-------- | :----------------------------------- |
| **Primary Syariah**  | `bg-emerald-700` / `hover:bg-emerald-800` | `#047857` | Tombol Utama, Navbar, Header         |
| **Gold Accent**      | `bg-amber-500` / `text-amber-400`         | `#f59e0b` | Dinar Badge, Gram Emas, Highlight    |
| **Legal Accent**     | `bg-rose-900` / `text-rose-400`           | `#881337` | Modul Notaris, Pengacara, Akta Hukum |
| **Background Slate** | `bg-slate-950` / `bg-slate-900`           | `#020617` | Background Halaman Dark Theme        |
| **Card Surface**     | `bg-slate-900/90`                         | `#0f172a` | Card & Form Container                |

---

## 🛠️ Konfigurasi `tailwind.config.js`

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        islamic: {
          950: "#022c22",
          900: "#064e3b",
          700: "#047857",
          500: "#10b981",
        },
        gold: {
          400: "#fbbf24",
          500: "#f59e0b",
        },
        legal: {
          900: "#881337",
          700: "#be123c",
          400: "#fb7185",
        },
      },
    },
  },
  plugins: [],
};
```

🧩 Komponen Tailwind CSS UI (Ready-to-Use)

1. Gold Reserve Audit Card Component

```JavaScript
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
        <span>Rasio Proteksi Syariah: <strong className="text-emerald-400">{ratioPercent}% (Solvent)</strong></span>
        <span>Akad: <strong>Wadi'ah Yad Dhamanah</strong></span>
      </div>
    </div>
  );
}
```

2. Legal Notary Verification Card Component
3. ```JavaScript
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
   ```

4. Syariah Transaction Table Component
5. ```JavaScript
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
                     <p className="text-slate-400">From: <span className="text-slate-200 font-mono">{tx.sender_wallet.substring(0, 10)}...</span></p>
                     <p className="text-slate-400">To: <span className="text-slate-200 font-mono">{tx.receiver_wallet.substring(0, 10)}...</span></p>
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
                 <td className="px-5 py-4 text-xs text-slate-500">{tx.created_at}</td>
               </tr>
             ))}
           </tbody>
         </table>
       </div>
     );
   }
   ```
