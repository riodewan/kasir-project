
# ☕ Kasir Cafe - Laravel + React POS App

Sistem kasir cafe modern berbasis Laravel + React. Dirancang dengan UI bersih dan fitur lengkap untuk keperluan kasir, stok produk, laporan, dan manajemen user.

---

## 🚀 Fitur Lengkap

- 🔐 Login & Role-Based Access (admin & user)
- 📦 CRUD Produk & Kategori
- 🧾 Transaksi Kasir + Cetak Struk PDF
- 💸 Input Tunai & Otomatis Hitung Kembalian
- 📊 Laporan Transaksi + Export PDF & Excel
- 🧑 Manajemen User + Upload Avatar
- 📈 Dashboard Admin (summary data & statistik)
- 🖼️ Landing Page Promosi Cafe (untuk user/guest)

---

## ⚙️ Stack Teknologi

- **Backend**: Laravel 12
- **Frontend**: React + TailwindCSS
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **PDF**: Laravel DomPDF
- **Excel**: Laravel Excel
- **Upload**: Laravel Storage
- **Animasi**: Framer Motion

---

## 🔧 Cara Instalasi

### 1. Clone Project

```bash
git clone https://github.com/username/kasir-project.git
cd kasir-project
```

### 2. Install Laravel Backend

```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan storage:link
php artisan serve
```

### 3. Install React Frontend

```bash
cd kasir-frontend
npm install
npm run dev
```

---

## 🌐 Route API

Semua route API diamankan dengan middleware Sanctum:

- `POST /api/login`
- `GET /api/dashboard/summary`
- `GET/POST/PUT/DELETE /api/produk`
- `GET/POST/PUT/DELETE /api/kategori`
- `GET/POST/DELETE /api/transaksi`
- `GET /api/laporan`
- `GET/POST/PUT/DELETE /api/users`

---

## 🖼️ Cuplikan Halaman

> 📸 Ganti link berikut dengan screenshot dari proyekmu sendiri

**Dashboard Admin**
![dashboard](https://source.unsplash.com/featured/?dashboard)

**Halaman Transaksi**
![transaksi](https://source.unsplash.com/featured/?cashier)

**Landing Page**
![landing](https://source.unsplash.com/featured/?coffee)

---

## 📂 Struktur Project

```
kasir-project/
├── app/Http/Controllers/Api/
│   └── AuthController.php, ProductController.php, ...
├── routes/api.php
├── public/storage ← Simpanan avatar user
├── kasir-frontend/
│   ├── src/pages/
│   ├── src/components/
│   ├── src/App.jsx
│   └── src/main.jsx
```

---

## 👥 Role Akses

| Role  | Akses Halaman                                                                 |
|-------|--------------------------------------------------------------------------------|
| Admin | Dashboard, Produk, Kategori, Transaksi, Laporan, Manajemen User               |
| User  | Halaman Transaksi & Landing Page                                              |

---

## 📜 Lisensi

Proyek ini dilindungi oleh lisensi MIT. Silakan gunakan dan modifikasi sesuai kebutuhan.

---

## 🙏 Terima Kasih

Dibuat untuk mendukung efisiensi cafe kecil dan menengah.  
Silakan sesuaikan dan kembangkan sesuai kebutuhan bisnismu ☕🍰
