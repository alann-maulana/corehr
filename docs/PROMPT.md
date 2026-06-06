<!-- begin: PROMPT-PRD -->
Buatkan PRD untuk sistem informasi manajemen human resource, dimulai dengan fitur absen karyawan:
- Login/register menggunakan google sign in
- Jika pengguna baru, akun akan berstatus belum diverifikasi. Pengguna diarahkan ke halaman menunggu verifikasi manual dari admin.
- [Authenticated] Masuk ke halaman utama, tampilkan dashboard absensi:
    - Periode saat ini : bulan dan tahun
    - Data absen periode ini
    - Tombol: Absen Masuk dan Absen Pulang
    - Data tidak absen periode ini
    - Data absen 5 hari terakhir
- [Authenticated] Menu absensi :
    - Filter : periode, paging (default 10)
    - Tampilan list : tanggal, jam masuk, jam pulang
    - Tambah absen, form : periode (berdasarkan tanggal saat ini), tipe (masuk/pulang), foto selfie, catatan (opsional). Property created_by dan created_at diset otomatis
- [Authenticated] Menu profil :
    - Informasi akun
    - Versi aplikasi
    - Logout

Manajemen hari kerja/libur :
- Hari kerja normal Senin-Jumat
- Hari libur normal Sabtu dan Minggu
- Hari libur/cuti nasional, perlu input manual: tanggal dan keterangan libur

Fitur umum :
- Progresive Web App
- Diutamakan mobile view first
- Tampilan clean dengan support dark mode
- Integrasikan material ui ke tailwind css dengan skill berikut https://raw.githubusercontent.com/mui/material-ui/refs/heads/master/skills/material-ui-tailwind/SKILL.md

Tech stack :
- MySQL
- Bun
- Typescript
- NextJS
- KnexJS - SQL builder
- Joi - Data validator
- Tailwind CSS

Bagi PRD tersebut menjadi 3 fase :
1. Skeleton project folder + files utama, login/register dan PWA
2. Dashboard dan profile
3. Manajemen absensi
<!-- end: PROMPT-PRD -->