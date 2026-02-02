# Analisis Proyek Wancash

## Ringkasan Eksekutif
Proyek ini adalah aplikasi terdesentralisasi (dApp) yang terdiri dari dua komponen utama:
1. **`my-frontend`**: Antarmuka pengguna berbasis web modern.
2. **`my-ofts`**: Kumpulan *smart contract* untuk token lintas rantai (OFT) dan staking.

Tujuannya adalah membangun ekosistem token **Wancash** yang dapat beroperasi di berbagai blockchain (Omnichain) menggunakan teknologi LayerZero, lengkap dengan fitur staking dan perlindungan pasar (anti-bot, pajak).

---

## 1. Analisis Frontend (`my-frontend`)

### Teknologi Utama
- **Framework**: Vue 3 (Composition API)
- **Build Tool**: Vite
- **Bahasa**: TypeScript
- **State Management**: Pinia
- **Web3 Integration**: `@wagmi/vue`, `@reown/appkit`, `ethers`, `viem`
- **UI/Styling**: Tailwind CSS, Shadcn (via Radix Vue), Lucide Icons
- **Testing**: Cypress (E2E & Component)
- **Lainnya**: `vue-i18n` (Internasionalisasi), `@tanstack/vue-query` (Data fetching), Sentry (Error monitoring), PWA support.

### Fitur & Struktur
- **Entry Point**: `src/main.ts` menginisialisasi aplikasi dengan error handling khusus yang menampilkan UI "Unable to Load Application" jika inisialisasi gagal.
- **Konfigurasi**: `vite.config.ts` dikonfigurasi dengan proxy dinamis untuk pengembangan lokal dan dukungan PWA.
- **Scripts**: Terdapat skrip kustom (`watch-errors.sh`) untuk pemantauan error.

---

## 2. Analisis Smart Contracts (`my-ofts`)

### Teknologi Utama
- **Framework**: Hardhat & Foundry (Hybrid)
- **Bahasa**: Solidity ^0.8.22
- **Standar**: LayerZero V2 OFT (Omnichain Fungible Token)

### Kontrak Utama

#### A. `Wancash.sol`
Token utama proyek ini.
- **Tipe**: LayerZero OFT (bisa ditransfer antar chain).
- **Fitur Keamanan**:
  - **Anti-Whale**: Batasan jumlah transaksi maks (`maxTxAmount`) dan saldo wallet maks (`maxWalletAmount`).
  - **Anti-Bot**: Jeda waktu antar pembelian (`antiBotDuration`, default 40 detik).
- **Pajak (Tax)**: Pajak pembelian (3%) dan penjualan (5%) yang dikirim ke `treasuryAddress`.
- **Vesting**: 50% dari total supply awal dikunci dalam kontrak `VestingWallet` selama kurang lebih 5 tahun.

#### B. `EnhancedStaking.sol`
Kontrak untuk staking token.
- **Mekanisme**: Pengguna mengunci token untuk mendapatkan reward.
- **Durasi (Saat ini dikonfigurasi untuk Testnet/High Speed)**:
  - 3 menit (15% reward)
  - 5 menit (33% reward)
  - 60 menit (80% reward)
  - 120 menit (200% reward)
  - 180 menit (500% reward)
  *Catatan: Komentar kode menyebutkan "Bulan/Tahun", namun implementasi kode menggunakan menit. Ini mungkin untuk tujuan pengujian.*
- **Fitur Darurat**: `emergencyUnstake` memungkinkan penarikan modal (principal) tanpa reward jika terjadi masalah.

---

## Kesimpulan
Proyek ini tampaknya sedang dalam tahap pengembangan aktif atau persiapan peluncuran (testnet), terlihat dari konfigurasi durasi staking yang sangat singkat. Integrasi LayerZero menunjukkan fokus yang kuat pada interoperabilitas lintas rantai sejak awal.
