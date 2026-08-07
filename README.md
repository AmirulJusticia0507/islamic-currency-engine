
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
# 1. Login -> dapat JWT (semua request berikut wajib Authorization: Bearer <TOKEN>)
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" \
  -d '{"user_id":"admin","password":"admin123"}' | jq -r .token)
AUTH="Authorization: Bearer $TOKEN"

# 2. Buat wallet (idempotent)
curl -s -X POST http://localhost:5000/api/wallets -H "$AUTH" -H "Content-Type: application/json" -d '{"user_id":"alice"}'

# 3. Daftarkan perangkat biometrik, lalu verifikasi sidik jari -> biometric_token (berlaku 2 menit)
curl -s -X POST http://localhost:5000/api/biometric/register -H "$AUTH" -H "Content-Type: application/json" \
  -d '{"wallet_address":"<WALLET_ALICE>","device_id":"dev-1","device_name":"Pixel 8"}'
curl -s -X POST http://localhost:5000/api/biometric/verify -H "$AUTH" -H "Content-Type: application/json" \
  -d '{"wallet_address":"<WALLET_ALICE>","device_id":"dev-1"}'   # -> {"token":"..."}

# 4. Transfer akad Sarf (1 Dinar = 4.25 gr emas, settlement kontan, WAJIB biometric_token)
curl -s -X POST http://localhost:5000/api/transactions/transfer -H "$AUTH" -H "Content-Type: application/json" \
  -d '{"sender":"<WALLET_ALICE>","receiver":"<WALLET_BOB>","amount":5,"akad_type":"SARF","biometric_token":"<TOKEN>"}'

# 5. QRIS (payload EMVCo TLV2 + gambar QR PNG base64)
curl -s "http://localhost:5000/api/qris/<WALLET_ALICE>/payload?amount=5" -H "$AUTH"
curl -s "http://localhost:5000/api/qris/<WALLET_ALICE>/qr?amount=5" -H "$AUTH"

# 6. Audit cadangan emas (rasio proteksi syariah)
curl -s http://localhost:5000/api/reserves/audit -H "$AUTH"
```

---

## 🔐 Role & Permission Management (RBAC)

Semua endpoint API (kecuali `/auth/login`, `/auth/register`, `/health`) dilindungi **JWT** + **permission-based access control**. Verifikasi dilakukan middleware `requireAuth` (JWT) lalu `requirePermission(...)`.

**Model**: `users`, `roles`, `permissions`, `user_roles`, `role_permissions`. Login mengeluarkan token JWT (default 12 jam) yang berisi identitas user; setiap request menyertakan `Authorization: Bearer <token>`.

### Matriks permission per role

| Permission | ADMIN | AUDITOR | NOTARY | LEGAL | USER |
| :--- | :---: | :---: | :---: | :---: | :---: |
| `dashboard.view` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `transaction.read` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `transaction.transfer` | ✅ | — | — | — | ✅ |
| `reserve.read` / `reserve.audit` | ✅ | ✅ | — | — | ✅ |
| `reserve.create` | ✅ | ✅ | — | — | — |
| `legal.read` | ✅ | — | ✅ | ✅ | ✅ |
| `legal.sign` | ✅ | — | ✅ | — | — |
| `legal.manage` | ✅ | — | ✅ | ✅ | — |
| `biometric.manage` | ✅ | — | — | — | ✅ |
| `qris.read` | ✅ | — | — | — | ✅ |
| `wallet.create` / `wallet.read` | ✅ | — | — | — | ✅ |
| `user:manage` (kelola user/role) | ✅ | — | — | — | — |

> `ADMIN` punya wildcard `*` (semua permission). Seed otomatis dijalankan saat server start (`seedAcl`).

### Endpoint auth
```bash
# Login
curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" \
  -d '{"user_id":"admin","password":"admin123"}'            # -> {"token":"..."}

# Ambil role & permission sendiri
curl http://localhost:5000/api/auth/me -H "Authorization: Bearer <TOKEN>"

# Hanya ADMIN bisa kelola role user
curl -X POST http://localhost:5000/api/auth/users/<user_id>/roles -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -H "Content-Type: application/json" -d '{"role":"AUDITOR"}'
```

**Akun seed**: `admin/admin123` · `auditor/audit123` · `notaris/notar123` · `user/user123`.

---

## 🛠️ Fitur Lanjutan (Oracle, Escrow, Akta, Verifikasi)

### 🏅 Oracle Harga Emas Real-time
Sumber LIVE `api.gold-api.com/price/XAU` (per troy-ounce, diubah ke per gram & per Dinar; 1 Dinar = 4.25 gr emas 24K). Bila sumber mati, memakai harga statis fallback dengan `source: "DEFAULT"`. Setiap pembacaan dicatat ke tabel `gold_prices` untuk riwayat chart.

```bash
GET /api/oracle/gold              # harga sekarang (sumber + waktu update)
GET /api/oracle/gold/history?limit=30  # 30 titik untuk chart
```

### 🧾 Escrow Cerdas & Sengketa Tahkim/BASYARNAS
Escrow mengunci (hold) dana dari wallet pembayar ke rekening amanah, lalu di-release/refund, atau dibuka sebagai sengketa bila ada sengketa. Model baru: `escrows`, `legal_disputes`.

```bash
POST /api/escrows                                  # buat escrow (dana di-kunci)
POST /api/escrows/:id/release                    # penyerahan ke penerima
POST /api/escrows/:id/refund                      # pengembalian ke pembayar
POST /api/escrows/dispute                          # buka sengketa (claim)
POST /api/escrows/disputes/:id/resolve             # keputusan BASYARNAS (side: A | B | split)
GET  /api/escrows · GET /api/escrows/disputes       # daftar escrow & sengketa
```

### 📄 Akta PDF Otentik (E-Signature RSA 2048)
Buat kontrak → sistem membubuhkan **tanda tangan digital RSA** atas dokumen akta dan **menghasilkan PDF** akta kitabah & syahadah yang dapat diunduh & divertif.

```bash
POST /api/legal/contracts          # buat akta; respons berisi base64 PDF akta
GET  /api/legal/contracts/:id/pdf     # unduh akta PDF
GET  /api/legal/contracts/:id/verify  # verifikasi keaslian tanda tangan RSA
```

> Setiap `SyariahTransaction` kini menyimpan `notary_signature` (RSA). Verifikasi transaksi memakai canonical yang dibentuk **dari baris yang tersimpan** agar *sign* & *verify* selalu identik (sebelumnya fungsi verify tidak konsisten).

```bash
POST /api/transactions/:hash/verify   # body: { notary_signature } -> { valid }
```

### 🧾 Audit Trail & Notifikasi
- `AuditLog` mencatat setiap aksi penting secara immutable → `GET /api/audit`.
- `Notification` mengirim notifikasi push ke user event (mis. transfer sukses) → `GET /api/notifications`, `POST /api/notifications/:id/read`.
- Riwayat transaksi kini **terpaginasi** = `GET /api/transactions?limit=20&offset=0&sender_wallet=...&akad_type=...`.

### 🖥️ Panel Dashboard Baru
- **Harga Emas** (oracle + grafik SVG dari history).
- **Admin User** (`user:manage`) — kelola role per pengguna.
- **Audit & Escrow** — jejak audit, notifikasi, escrow, dan sengketa.
- **Verifikasi** — tombol cek signature transaksi & akta langsung di UI.

Permission baru yang ditambahkan ke ACL: `oracle.read`, `escrow.read`, `escrow.write`, `escrow.dispute`, `audit.read`, `legal.verify`, `notification.read` (seed otomatis via `seedAcl` saat server start).

---

## 🔒 Privasi Autentikasi Biometrik (Fingerprint)

**Data biometrik Anda TIDAK pernah disimpan** — baik di database, server, maupun dikirim melalui jaringan.

- Verifikasi sidik jari diproses **lokal di dalam perangkat** (secure enclave / Touch ID / Face ID / Keystore Android) oleh `local_auth`.
- OS hanya mengembalikan hasil `true/false`; citra sidik jari tidak pernah keluar dari perangkat.
- Yang tersimpan di database hanya **metadata perangkat** pada tabel `authenticated_devices`, bukan sidik jari:

  | Kolom | Isi |
  | :--- | :--- |
  | `device_id` | ID perangkat (generated, bukan biometrik) |
  | `wallet_address` | pemilik wallet |
  | `device_name` | label (mis. "Pixel 8") |
  | `status` / `last_verified_at` | aktif vs dicabut · waktu verifikasi terakhir |

- Alur otorisasi transfer: OS cek sidik jari secara lokal → bila sukses backend menerbitkan `biometric_token` sah sementara (2 menit) → transfer dieksekusi. Yang membuktikan autentikasi adalah biometrik pada perangkat (*device fingerprint*), sedangkan database hanya mencatat perangkat yang diizinkan (`device_id`).
- Perangkat dapat dicabut (revoke) kapan saja lewat `DELETE /api/biometric/:device_id`.

---

## 🗄️ Akses Database via Beekeeper Studio

### SQLite (mode dev — default)

1. Buka **Beekeeper Studio** → **New Connection → SQLite**.
2. Isi field `File` dengan path file DB. Karena DB disimpan di dalam WSL, dari Windows gunakan path WSL:
   ```
   \\wsl.localhost\Ubuntu\home\amirulpj\islamic-currency-engine\backend-core\data\idce.sqlite
   ```
3. Klik **Test** → **Connect**.

> File `idce.sqlite` baru muncul setelah server berjalan / `npm run seed` (satu file berisi semua tabel: `gold_reserves`, `user_wallets`, `syariah_transactions`, `legal_partners`, `legal_contracts`, `escrows`, `legal_disputes`, `gold_prices`, `audit_logs`, `notifications`, `users`, `roles`, `permissions`).

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
