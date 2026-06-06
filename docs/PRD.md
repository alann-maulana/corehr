# Product Requirement Document (PRD) - Sistem Informasi Manajemen HR (Absensi Karyawan)

## 1. Pendahuluan
Dokumen ini menjelaskan kebutuhan produk untuk sistem manajemen human resource (HRMS), dengan fokus awal pada fitur absensi karyawan. Sistem ini didesain sebagai Progressive Web App (PWA) yang mengutamakan tampilan mobile (mobile-first), memiliki tampilan bersih (clean UI), dan mendukung mode gelap (dark mode).

## 2. Arsitektur & Teknologi Stack
- **Database**: MySQL 8.x
- **Runtime**: Bun
- **Bahasa**: TypeScript
- **Framework**: Next.js (App Router)
- **SQL Query Builder**: KnexJS
- **Validasi Data**: Joi
- **Styling**: Tailwind CSS & Material UI (dengan integrasi CSS Layer)

---

## 3. Fitur Utama & Kebutuhan Fungsional

### 3.1. Autentikasi & Registrasi
- Login dan registrasi menggunakan **Google Sign-In**.
- Jika pengguna baru (pertama kali login via Google), akun dibuat secara otomatis dengan status `unverified` (belum diverifikasi).
- Pengguna yang belum diverifikasi akan diarahkan ke halaman khusus: **Menunggu Verifikasi Manual dari Admin**. Mereka tidak dapat mengakses menu utama lainnya sebelum admin mengubah status mereka menjadi `verified`.

### 3.2. Dashboard Absensi (Halaman Utama)
Hanya dapat diakses oleh pengguna yang sudah terverifikasi (`verified` / `admin`).
- **Informasi Periode**: Menampilkan bulan dan tahun saat ini.
- **Statistik Absen Periode Ini**: Jumlah hari masuk, jam kerja, dsb.
- **Tombol Aksi**:
  - Tombol **Absen Masuk** (hanya aktif jika belum absen masuk pada hari kerja hari ini).
  - Tombol **Absen Pulang** (hanya aktif jika sudah absen masuk tapi belum absen pulang pada hari ini).
- **Data Tidak Absen**: Daftar hari kerja pada periode ini di mana karyawan tidak mencatatkan kehadiran (mangkir / alpa).
- **Histori Terakhir**: Menampilkan daftar aktivitas absen selama 5 hari kerja terakhir.

### 3.3. Menu Absensi
- **Filter**: Filter berdasarkan periode (bulan/tahun) dan pagination (default 10 baris per halaman).
- **Daftar Absensi**: Menampilkan kolom Tanggal, Jam Masuk, dan Jam Pulang.
- **Form Tambah Absen**:
  - **Periode**: Otomatis terisi berdasarkan tanggal saat ini.
  - **Tipe**: Pilihan antara "Masuk" atau "Pulang".
  - **Foto Selfie**: Mengambil foto dari kamera perangkat (wajib).
  - **Catatan**: Field text opsional untuk keterangan tambahan.
  - **Audit Fields**: Kolom `created_by` dan `created_at` otomatis diisi oleh sistem berdasarkan session pengguna saat ini.

### 3.4. Menu Profil
- **Informasi Akun**: Menampilkan nama, email, foto profil Google, dan status verifikasi / role.
- **Versi Aplikasi**: Menampilkan versi build aplikasi saat ini.
- **Tombol Logout**: Menghapus session dan mengarahkan kembali ke halaman login.

### 3.5. Manajemen Hari Kerja & Hari Libur
Sistem harus membedakan hari kerja, hari libur akhir pekan, dan hari libur nasional untuk menghitung hari kerja efektif dan mendeteksi ketidakhadiran (mangkir).
- **Hari Kerja Normal**: Senin sampai Jumat.
- **Hari Libur Normal**: Sabtu dan Minggu.
- **Hari Libur/Cuti Nasional**: Dikelola secara manual oleh admin. Memerlukan input:
  - Tanggal libur
  - Keterangan libur (misal: "Hari Raya Idul Fitri", "Tahun Baru Masehi").

---

## 4. Pembagian Fase Implementasi

### Fase 1: Skeleton Project & Autentikasi (PWA)
- Inisialisasi project folder Next.js dengan TypeScript, Tailwind CSS, dan Material UI.
- Konfigurasi KnexJS dengan MySQL.
- Setup file PWA (manifest, service worker, dsb).
- Halaman Login & Registrasi (Google Sign-In & Mock Login Mode untuk development).
- Halaman Menunggu Verifikasi.

### Fase 2: Dashboard & Profil
- Integrasi middleware autentikasi.
- Halaman Dashboard (Periode saat ini, stats absensi, 5 hari terakhir, daftar hari tidak absen).
- Halaman Profil & fungsi logout.
- Halaman Dashboard Admin sederhana untuk melakukan verifikasi user & input hari libur nasional.

### Fase 3: Manajemen Absensi
- Form/Tombol Absen Masuk dan Absen Pulang dengan capture foto selfie.
- API Endpoint untuk absensi menggunakan validasi Joi.
- Halaman Histori Absensi dengan filter periode dan pagination.
