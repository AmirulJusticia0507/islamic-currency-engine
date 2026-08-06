
# Islamic Digital Currency Engine (IDCE) - Asset-Backed & Legal Compliant

Sistem Ledger & Payment Engine untuk Mata Uang Digital Berbasis Syariat Islam (Al-Qur'an & Hadits) yang didukung oleh arsitektur **NewSQL (CockroachDB)** untuk menjamin konsistensi data finansial tingkat tinggi (*Strict ACID*).

Sistem ini terintegrasi langsung dengan **Modul Legalitas (Kantor Notaris & Pengacara)** untuk memenuhi keabsahan hukum positif di Indonesia dan diawasi oleh **Dewan Pengawas Syariah (DPS)**.

---

## 📌 Daftar Isi

- [Prinsip Syariat Islam](#-prinsip-syariat-islam)
- [Legitimasi Hukum &amp; Notaris](#-legitimasi-hukum--notaris)
- [Arsitektur Sistem (NewSQL Stack)](#-arsitektur-sistem-newsql-stack)
- [Struktur Proyek](#-struktur-proyek)
- [Skema Database NewSQL](#-skema-database-newsql)
- [Konfigurasi Environment (.env)](#-konfigurasi-environment-env)
- [Panduan Memulai](#-panduan-memulai)
- [Lisensi](#-lisensi)

---

## ☪️ Prinsip Syariat Islam

Sistem ini dirancang memenuhi kaidah **Fiqih Muamalah**:

1. **Asset-Backed / Undlying Asset (Bebas Gharar)**: Setiap 1 unit mata uang digital (Dinar) dijamin 100% oleh cadangan Emas Fisik yang tersimpan di *Vault Audit*.
2. **Bebas Riba**: Tidak ada sistem bunga, penalti keterlambatan, atau pembungaan kredit.
3. **Akad Transaksi Syar'i**:
   - **Akad Wadi'ah Yad Dhamanah**: Untuk penitipan saldo *wallet* pengguna.
   - **Akad Sarf**: Untuk penukaran/jual-beli mata uang digital.
   - **Akad Ujrah**: Biaya jasa operasional jaringan yang transparan dan *flat*.
4. **Bebas Maysir (Anti-Spekulasi)**: Nilai stabil terikat pada nilai acuan komoditas riil, bukan dari spekulasi pasar gelap.

---

## ⚖️ Legitimasi Hukum & Notaris

Untuk memenuhi regulasi Bappebti, OJK, dan Kemenkumham:

- **Akad Kitabah & Syahadah (QS. Al-Baqarah: 282)**: Setiap penerbitan token dan deposit emas wajib melalui Pencatatan Akta Notaris.
- **E-Signature Notaris (RSA 2048-bit)**: Pejabat Notaris membubuhkan Tanda Tangan Digital pada berkas akta yang tersimpan di NewSQL.
- **Legal Counsel & Escrow**: Kantor Pengacara mengawasi mekanisme *Smart Escrow* dan penanganan sengketa (*Tahkim* / BASYARNAS).

---

## 🛡️ Arsitektur Sistem (NewSQL Stack)

```text
┌─────────────────────────┐                 ┌─────────────────────────┐
│     FLUTTER WALLET      │                 │    REACT.JS DASHBOARD   │
│  (Send, Receive, Legal) │                 │ (Admin, Notary, Legal)  │
└────────────┬────────────┘                 └────────────┬────────────┘
             │                                           │
             └───────────────────┬───────────────────────┘
                                 │ HTTP API Requests
                                 v
┌─────────────────────────────────────────────────────────────────────┐
│                       EXPRESS.JS CORE ENGINE                        │
│  • Syariah Transaction Validator & Digital Signature Notaris        │
│  • HMAC-SHA512 Signature & RSA Key Management                       │
└──────────────┬───────────────────────────────┬──────────────────────┘
               │                               │
               v                               v
┌─────────────────────────────┐  ┌────────────────────────────────────┐
│   NEWSQL DATABASE CLUSTER   │  │       PHYSICAL GOLD VAULT AUDIT    │
│ (CockroachDB Distributed,   │  │ (Oracle Real-Time Reserve Audit)   │
│  Strict ACID Financial Data)│  └────────────────────────────────────┘
└─────────────────────────────┘
```


📂 Struktur Proyek

islamic-currency-engine/
├── README.md                 # Dokumentasi Utama
├── GUIDELINE.md              # Spesifikasi Teknis & Landasan Syariat/Hukum
├── STYLE.md                  # Style Guide Tailwind CSS untuk React
├── backend-core/             # Node.js & Express.js API Gateway
│   ├── config/               # Koneksi NewSQL (CockroachDB via Sequelize)
│   ├── keys/                 # RSA Keys & Signature Helper
│   ├── utils/                # Ledger, Notary E-Sign & Shariah Audit Engine
│   ├── controllers/          # Wallet, Legal, & Transaction Controllers
│   └── server.js
├── frontend-dashboard/       # React.js + Tailwind CSS (Admin, Auditor, & Notaris Panel)
│   ├── src/
│   │   ├── components/       # Gold Reserve Cards, Notary Verification, Audit Logs
│   │   ├── App.jsx
│   │   └── index.css
│   └── tailwind.config.js
└── mobile_wallet/            # Flutter Mobile App (Islamic Crypto Wallet)
    ├── lib/
    │   ├── screens/          # Wallet, Transfer (Sarf), Legal Documents, Vault Audit
    │   ├── services/         # CurrencyService (HTTP API)
    │   └── main.dart

🗄️ Skema Database NewSQL (CockroachDB)


CREATE DATABASE IF NOT EXISTS islamic_currency_db;
USE islamic_currency_db;

-- 1. Tabel Cadangan Emas Fisik
CREATE TABLE IF NOT EXISTS gold_reserves (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    vault_location VARCHAR(100) NOT NULL,
    total_gram_gold DECIMAL(18, 6) NOT NULL,
    auditor_signature TEXT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Tabel Wallet Pengguna
CREATE TABLE IF NOT EXISTS user_wallets (
    wallet_address VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) UNIQUE NOT NULL,
    balance_dinar DECIMAL(18, 6) DEFAULT 0.000000, -- 1 Dinar = 4.25 gr Emas
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabel Transaksi Syariah
CREATE TABLE IF NOT EXISTS syariah_transactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    transaction_hash VARCHAR(64) UNIQUE NOT NULL,
    sender_wallet VARCHAR(64) NOT NULL,
    receiver_wallet VARCHAR(64) NOT NULL,
    amount_dinar DECIMAL(18, 6) NOT NULL,
    akad_type ENUM('SARF', 'WADIAH', 'UJRAH') NOT NULL,
    underlying_gold_gram DECIMAL(18, 6) NOT NULL,
    status ENUM('PENDING', 'SUCCESS', 'REJECTED') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_wallet) REFERENCES user_wallets(wallet_address)
);

-- 4. Tabel Mitra Notaris & Pengacara
CREATE TABLE IF NOT EXISTS legal_partners (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    partner_type ENUM('NOTARIS', 'PENGACARA', 'DEWAN_PENGAWAS_SYARIAH') NOT NULL,
    official_name VARCHAR(150) NOT NULL,
    license_number VARCHAR(100) UNIQUE NOT NULL, -- SK Kemenkumham / PERADI / DSN-MUI
    public_key_pem TEXT NOT NULL,
    status ENUM('ACTIVE', 'SUSPENDED') DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Tabel Akta Legalisasi & Dokumen Hukum
CREATE TABLE IF NOT EXISTS legal_contracts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    contract_number VARCHAR(100) UNIQUE NOT NULL,
    legal_partner_id BIGINT NOT NULL,
    transaction_hash VARCHAR(64),
    document_title VARCHAR(200) NOT NULL,
    document_pdf_url TEXT NOT NULL,
    notary_signature TEXT NOT NULL, -- Digital Signature RSA Notaris
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (legal_partner_id) REFERENCES legal_partners(id)
);


📋 Konfigurasi Environment (.env)



PORT=5000

# Dialect: sqlite (dev) atau postgres (CockroachDB NewSQL)
DB_DIALECT=sqlite
SQLITE_PATH=./data/idce.sqlite

# CockroachDB (NewSQL) - protokol PostgreSQL
COCKROACH_HOST=127.0.0.1
COCKROACH_PORT=26257
COCKROACH_USER=root
COCKROACH_PASSWORD=
COCKROACH_DB=islamic_currency_db
COCKROACH_SSL=true

# Security & Cryptography

CURRENCY_SECRET_KEY=secret_key_syariah_digital_currency
RSA_PRIVATE_KEY_PATH=./keys/private_key.pem



🚀 Panduan Memulai

**Prasyarat:** Node.js ≥ 18, Flutter ≥ 3.0 (untuk mobile).

1. **Run Backend Core Engine** (`http://localhost:5000`)

   ```bash
   cd backend-core
   cp .env.example .env      # default: DB_DIALECT=sqlite (dev lokal)
   npm install
   npm run seed              # opsional: isi contoh wallet, vault, notaris
   npm run dev               # start server
   ```

   > Untuk produksi NewSQL, ubah `.env` → `DB_DIALECT=postgres` lalu isi `COCKROACH_HOST`, `COCKROACH_PORT` (default `26257`), `COCKROACH_USER`, `COCKROACH_PASSWORD`, `COCKROACH_DB`.
   > RSA 2048-bit & kunci otomatis di-generate pada start pertama (folder `keys/`).

   Cek kesehatan: `curl http://localhost:5000/health`

2. **Run React.js Dashboard** (`http://localhost:5173`, proxy ke `:5000`)

   ```bash
   cd frontend-dashboard
   npm install
   npm run dev
   ```

3. **Run Flutter Mobile App** (pastikan backend aktif)

   ```bash
   cd mobile_wallet
   flutter pub get
   flutter run            # emulator/device; default API: http://10.0.2.2:5000/api
   ```

**Alur API singkat**
```bash
# Buat wallet (idempotent - ulang panggil aman)
curl -X POST http://localhost:5000/api/wallets -H "Content-Type: application/json" -d '{"user_id":"alice"}'

# Transfer akad Sarf (1 Dinar = 4.25 gr emas, settlement kontan)
curl -X POST http://localhost:5000/api/transactions/transfer -H "Content-Type: application/json" \
  -d '{"sender":"<WALLET_ALICE>","receiver":"<WALLET_BOB>","amount":5,"akad_type":"SARF"}'

# Audit cadangan emas (rasio proteksi syariah)
curl http://localhost:5000/api/reserves/audit
```

---

## 🗄️ Akses Database via Beekeeper Studio

### SQLite (mode dev — default)

1. Buka **Beekeeper Studio** → **New Connection → SQLite**.
2. Isi field `File` dengan path file DB. Karena DB disimpan di dalam WSL, dari Windows gunakan path WSL:
   ```
   \\wsl.localhost\Ubuntu\home\amirulpj\islamic-currency-engine\backend-core\data\idce.sqlite
   ```
3. Klik **Test** → **Connect**.

> File `idce.sqlite` baru muncul setelah server berjalan / `npm run seed` (satu file berisi semua tabel: `gold_reserves`, `user_wallets`, `syariah_transactions`, `legal_partners`, `legal_contracts`).

### NewSQL CockroachDB (mode produksi)

Ubah `.env` ke `DB_DIALECT=postgres` terlebih dahulu, lalu koneksi di Beekeeper:

1. Buka **New Connection → PostgreSQL**.
2. Isi kredensial berikut:
   - Host: `127.0.0.1`
   - Port: `26257`
   - User: `root`
   - Password: (kosong — default insecure CockroachDB lokal)
   - Database: `islamic_currency_db`
3. Klik **Test** → **Connect**.

> ⚠️ **Catatan:** CockroachDB memakai protokol **PostgreSQL**, jadi tipe koneksi di Beekeeper adalah **PostgreSQL**, bukan MySQL/TiDB. Driver di `backend-core/config/database.js` sudah diset ke `postgres` (paket `pg`). Untuk cluster CockroachDB versi baru yang *secure by default*, aktifkan `COCKROACH_SSL=true` dan gunakan sertifikat/root user yang sesuai.
