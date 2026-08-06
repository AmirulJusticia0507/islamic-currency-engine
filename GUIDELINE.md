
---
### 2. `GUIDELINE.md`

```markdown
# GUIDELINE TEKNIS, LANDASAN SYARIAT, & LEGALITAS HUKUM

Dokumen ini berisi landasan hukum Islam (Al-Qur'an & Hadits), payung hukum positif negara, serta spesifikasi teknis arsitektur NewSQL.
---
## 1. Landasan Syariat Al-Qur'an & Hadits

### A. Larangan Riba & Perintah Jual-Beli yang Sah

> **Al-Qur'an Surah Al-Baqarah (2:275)**:
> *"Padahal Allah telah menghalalkan jual beli dan mengharamkan riba..."*

- **Implementasi**: Sistem tidak mengenal *interest rate*, staking dengan bunga tetap, atau penalti keuangan. Biaya operasional murni diambil dari *ujrah* (biaya jasa) tetap.

### B. Kewajiban Kesamaan Timbangan & Asset Backing (Bebas Gharar)

> **Al-Qur'an Surah Al-Muthaffifin (83:1-3)**:
> *"Kecelakaan besarlah bagi orang-orang yang curang, (yaitu) orang-orang yang apabila menerima takaran dari orang lain mereka minta dipenuhi, dan apabila mereka menakar atau menimbang untuk orang lain, mereka mengurangi."*

- **Implementasi**: Token mata uang digital ini **wajib terikat 100% dengan gram emas riil** di brankas (`gold_reserves`). Tidak ada pencetakan token ghoib/tanpa emas fisik.

### C. Syarat Tukar Menukar Mata Uang (Akad Sarf)

> **Hadits Riwayat Muslim No. 1587 (Dari Ubadah bin Samit r.a.)**:
> *"Emas dengan emas, perak dengan perak... harus sama jumlahnya (timbangannya) dan harus dilakukan secara kontan (yada bi yadin)..."*

- **Implementasi**: Transaksi penukaran mata uang digital (*Sarf*) diselesaikan secara **Instant / Real-time (Kontan)** menggunakan NewSQL Distributed Lock.

### D. Perintah Pencatatan Akad (Akad Kitabah & Syahadah)

> **Al-Qur'an Surah Al-Baqarah (2:282)**:
> *"Wahai orang-orang yang beriman! Apabila kamu melakukan muamalah tidak secara tunai untuk waktu yang ditentukan, hendaklah kamu menuliskannya secara benar. Dan hendaklah seorang penulis di antara kamu menuliskannya dengan benar..."*

- **Implementasi**: Setiap transaksi bernilai besar dan penerbitan lisensi diikat secara hukum melalui pencatatan **Akta Notaris**.

---

## 2. Payung Hukum Positif Indonesia

Untuk dapat beroperasi secara legal di Indonesia:

1. **BAPPEBTI & OJK**: Dikategorikan sebagai **Aset Komoditi Digital Berbasis Emas Physical-Backed**. Wajib masuk mekanisme *Regulatory Sandbox*.
2. **DSN-MUI**: Wajib menunjuk Dewan Pengawas Syariah (DPS) tersertifikasi untuk penerbitan Sertifikat Opini Syariah.
3. **UU Mata Uang (Bank Indonesia)**: Token Dinar berstatus sebagai **Aset Investasi / Komoditi Digital**, bukan alat pembayaran tunggal pengganti Rupiah (Legal Tender tetap IDR).

---

## 3. Kenapa Memakai NewSQL (TiDB / CockroachDB)?

1. **Strict ACID Consistency**: Menjamin tidak ada *double-spending* atau saldo selisih 1 rupiah pun.
2. **Auto Distributed Sharding**: Mampu menangani ribuan node server tanpa mengorbankan integritas data.
3. **High Availability (99.999%)**: Konsensus Raft/Paxos mencegah kehilangan data jika Data Center utama mati.

---

## 4. Alur 5 Modul Utama Mobile App (Flutter)

1. **Dashboard Screen**: Saldo Dinar, grafik emas acuan riil, dan status verifikasi DPS/Notaris.
2. **Kirim & Terima (Akad Sarf / Transfer)**: Input wallet tujuan & nominal. Mengirim *real-time settlement*.
3. **Audit Cadangan Emas (Vault Audit)**: Transparansi publik lokasi *vault*, gram terverifikasi, dan sertifikat auditor.
4. **Modul Legalitas (Legal & Notary)**: Menampilkan Akta Otentik Notaris, Dokumen Perjanjian Akad (PDF), dan E-Signature Notaris.
5. **Logout**: Menghapus token dari *Secure Storage*.
