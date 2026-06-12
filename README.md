# 🏘️ RT Management

Aplikasi administrasi RT berbasis web untuk mengelola penghuni, rumah, tagihan iuran bulanan, dan pengeluaran perumahan.

Dibangun dengan **Laravel 13 + React (Inertia.js) + MySQL**.

---

## ✨ Fitur

- **Kelola Rumah** — Tambah/edit rumah, assign penghuni, riwayat penghuni per rumah
- **Kelola Penghuni** — Data penghuni lengkap beserta foto KTP, status penghuni (tetap/kontrak), status menikah
- **Tagihan Iuran** — Generate tagihan bulanan otomatis (satpam + kebersihan) untuk semua rumah yang dihuni, catat pembayaran, bayar kebersihan 1 tahun sekaligus
- **Pengeluaran** — Catat pengeluaran per bulan dengan kategori (rutin/tidak rutin), upload bukti
- **Dashboard** — Grafik pemasukan vs pengeluaran selama 1 tahun, statistik ringkasan

---

## 🛠️ Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Backend | PHP 8.2+, Laravel 13 |
| Frontend | React 19, Inertia.js |
| Styling | Tailwind CSS v4 |
| Database | MySQL 8 |
| Package Manager | Bun |
| Build Tool | Vite |

---

## ⚙️ Requirements

Pastikan sudah terinstall di mesin Anda:

- PHP **8.2** atau lebih baru (dengan extension: `curl`, `mbstring`, `openssl`, `fileinfo`, `pdo_mysql`, `zip`)
- Composer **2.x**
- Node.js / **Bun** (direkomendasikan)
- MySQL **8.x** (bisa via XAMPP)
- Git

---

## 🚀 Instalasi

### 1. Clone Repository

```bash
git clone https://github.com/USERNAME/rt-management.git
cd rt-management
```

### 2. Install PHP Dependencies

```bash
composer install
```

### 3. Install JavaScript Dependencies

```bash
bun install
```

### 4. Konfigurasi Environment

Copy file `.env.example` menjadi `.env`:

```bash
cp .env.example .env
```

Generate application key:

```bash
php artisan key:generate
```

### 5. Konfigurasi Database

Buka file `.env`, sesuaikan konfigurasi database:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=rt_management
DB_USERNAME=root
DB_PASSWORD=
```

Buat database di MySQL:

```sql
CREATE DATABASE rt_management;
```

### 6. Konfigurasi Iuran

Sesuaikan nominal iuran di `.env` (opsional, sudah ada default):

```env
IURAN_SATPAM=100000
IURAN_KEBERSIHAN=15000
```

### 7. Jalankan Migration

```bash
php artisan migrate
```

### 8. Storage Link

```bash
php artisan storage:link
```

### 9. Jalankan Aplikasi

Buka **dua terminal terpisah**:

**Terminal 1 — Laravel:**
```bash
php artisan serve
```

**Terminal 2 — Vite (React):**
```bash
bun run dev
```

Buka browser di: [http://127.0.0.1:8000](http://127.0.0.1:8000)

---

## 📁 Struktur Direktori Penting

```
rt-management/
├── app/
│   ├── Http/
│   │   ├── Controllers/        # Controller Laravel
│   │   └── Middleware/
│   │       └── HandleInertiaRequests.php
│   └── Models/                 # Eloquent Models
├── config/
│   └── iuran.php               # Konfigurasi nominal iuran
├── database/
│   └── migrations/             # Migration tabel
├── resources/
│   ├── css/
│   │   └── app.css
│   ├── js/
│   │   ├── Components/
│   │   │   ├── Layout/
│   │   │   │   └── AppLayout.jsx
│   │   │   └── ui/             # Komponen UI (Button, Input, dll)
│   │   ├── Pages/
│   │   │   ├── Dashboard/
│   │   │   ├── Houses/
│   │   │   ├── Residents/
│   │   │   ├── BillingPeriods/
│   │   │   ├── Expenses/
│   │   │   └── ExpenseCategories/
│   │   ├── lib/
│   │   │   └── utils.js
│   │   └── app.jsx
│   └── views/
│       └── app.blade.php
├── routes/
│   └── web.php
└── .env.example
```

---

## 🗄️ Struktur Database (ERD)

| Tabel | Keterangan |
|-------|------------|
| `houses` | Data rumah |
| `residents` | Data penghuni |
| `house_residents` | Relasi rumah-penghuni + riwayat |
| `billing_periods` | Periode tagihan (bulan/tahun) |
| `billing_items` | Tagihan per rumah per jenis iuran |
| `payments` | Catatan pembayaran |
| `expense_categories` | Kategori pengeluaran |
| `expenses` | Data pengeluaran |

---

## 📖 Panduan Penggunaan

### Alur Setup Awal

1. **Tambah Kategori Pengeluaran** — `/expense-categories` → Tambah kategori seperti "Gaji Satpam", "Token Listrik", dll
2. **Tambah Rumah** — `/houses` → Input semua nomor rumah yang ada
3. **Tambah Penghuni** — `/residents` → Input data penghuni beserta foto KTP
4. **Assign Penghuni ke Rumah** — `/houses` → Buka detail rumah → Tambah Penghuni

### Alur Tagihan Bulanan

1. Buka `/billing-periods` → **Buat Periode** → pilih bulan & tahun
2. Buka detail periode → klik **Generate Tagihan** (otomatis membuat tagihan untuk semua rumah yang dihuni)
3. Catat pembayaran satu per satu via tombol **Bayar**, atau gunakan **Bayar Kebersihan Tahunan** untuk bayar iuran kebersihan 1 tahun sekaligus

### Catat Pengeluaran

Buka `/expenses` → **Tambah** → isi kategori, nominal, deskripsi, tanggal, dan bukti (opsional)

---

## 🔧 Konfigurasi Tambahan

### Ubah Nominal Iuran

Edit file `.env`:

```env
IURAN_SATPAM=100000
IURAN_KEBERSIHAN=15000
```

Lalu jalankan:

```bash
php artisan config:clear
```

### Build untuk Production

```bash
bun run build
php artisan config:cache
php artisan route:cache
```

---

## 🐛 Troubleshooting

**Vite manifest not found**
→ Jalankan `bun run dev` di terminal terpisah

**No connection to MySQL**
→ Pastikan MySQL sudah running (XAMPP Control Panel → Start MySQL)

**PHP extension missing**
→ Buka `php.ini` → hapus `;` di depan extension yang dibutuhkan → restart terminal

**Storage foto tidak muncul**
→ Jalankan `php artisan storage:link`
