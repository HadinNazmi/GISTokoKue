# 📘 Panduan Mengembalikan Database ke Supabase

Dokumen ini menjelaskan langkah-langkah untuk menghubungkan kembali aplikasi **WebGIS Toko Kue Pekanbaru** ke database cloud **Supabase**.

Saat ini aplikasi sudah dilengkapi dengan fitur **Dual-Mode (Fallback Otomatis)**:
* Jika Supabase offline atau belum disiapkan, aplikasi otomatis menggunakan data lokal ([src/data/tokoKue.json](file:///d:/Semester5/GIS/ProjectGIS/src/data/tokoKue.json) + browser storage).
* Begitu Supabase Anda aktif dan kredensial di file `.env` valid, aplikasi otomatis memprioritaskan database Supabase tanpa perlu mengubah kode sumber!

---

## 🛠️ Langkah 1: Aktifkan / Buat Project di Supabase

### Pilihan A: Jika Project Lama Masih Ada (Status: Paused)
1. Buka [Supabase Dashboard](https://supabase.com/dashboard).
2. Temukan project Anda (`lpygndiashzwdzqgusnm`).
3. Klik tombol **"Restore project"** untuk membangkitkannya kembali.
4. Tunggu beberapa menit hingga statusnya menjadi **Active (Green)**.

### Pilihan B: Jika Membuat Project Baru
1. Login ke [Supabase](https://supabase.com/).
2. Klik tombol **"New project"**.
3. Isi informasi project:
   - **Name:** `WebGIS Toko Kue` (atau sesuai keinginan)
   - **Database Password:** (simpan password yang Anda buat)
   - **Region:** `Singapore` (terdekat dengan Indonesia)
4. Tunggu hingga proses pembuatan project selesai (sekitar 1-2 menit).

---

## 💾 Langkah 2: Buat Tabel & Skema Database

1. Pada dashboard Supabase Anda, buka menu **SQL Editor** di panel navigasi sebelah kiri.
2. Klik tombol **"New query"**.
3. Buka file [supabase_schema.sql](file:///d:/Semester5/GIS/ProjectGIS/supabase_schema.sql) yang ada di folder proyek ini.
4. Salin seluruh isi script SQL tersebut, lalu tempel (*paste*) ke dalam SQL Editor Supabase.
5. Klik tombol **"Run"** di pojok kanan bawah editor Supabase.
6. Pastikan muncul pesan sukses: `Success. No rows returned`.

Tabel-tabel berikut akan otomatis terbuat:
* `users` — Akun login untuk Admin dan Owner toko.
* `toko_kue` — Data titik toko kue, koordinat Lat & Lng, rating, kecamatan, foto, dsb.
* `toko_requests` — Pengajuan pendaftaran toko baru dari owner.
* `log_history` — Riwayat aktivitas sistem.

---

## 📁 Langkah 3: Siapkan Storage Bucket Gambar

1. Di dashboard Supabase, buka menu **Storage**.
2. Klik **"Create a new bucket"**.
3. Beri nama bucket: `images`
4. **PENTING:** Centang opsi **"Public bucket"** agar foto toko dapat dilihat oleh publik.
5. Klik **"Save"**.

---

## 📥 Langkah 4: Masukkan Data Toko Kue Awal ke Supabase

Untuk memasukkan data 30+ toko kue dari file [src/data/tokoKue.json](file:///d:/Semester5/GIS/ProjectGIS/src/data/tokoKue.json) ke tabel `toko_kue` di Supabase:
1. Di Supabase Dashboard, buka menu **Table Editor** -> pilih tabel `toko_kue`.
2. Klik tombol **"Insert"** -> **"Import data from CSV"** (atau gunakan SQL script `INSERT INTO toko_kue`).

---

## 🔑 Langkah 5: Perbarui File `.env`

1. Di Supabase Dashboard, buka **Project Settings** (ikon gear di kiri bawah) -> pilih **API**.
2. Salin nilai:
   - **Project URL**
   - **Project API Keys** -> bagian **`anon` `public`**
3. Buka file [.env](file:///d:/Semester5/GIS/ProjectGIS/.env) di project Anda dan perbarui:
   ```env
   # Supabase Configuration
   VITE_SUPABASE_URL=https://<project-id-anda>.supabase.co
   VITE_SUPABASE_ANON_KEY=<anon-key-panjang-anda>

   # App Configuration
   VITE_APP_NAME=WebGIS Toko Kue Pekanbaru
   VITE_APP_VERSION=1.0.0
   ```
4. Simpan file `.env`.
5. Restart dev server terminal:
   - Tekan `Ctrl + C` di terminal
   - Jalankan kembali:
     ```bash
     npm run dev
     ```

---

## 🔐 Akun Default Saat Mode Lokal / Offline
Jika Anda ingin mencoba fitur login dan dashboard saat Supabase belum online:
* **Admin:**
  * Email: `admin@gmail.com`
  * Password: `admin123`
* **Owner:**
  * Email: `owner@gmail.com`
  * Password: `owner123`
* Atau Anda juga bisa langsung klik **"Daftar Akun Baru"** di halaman Register.
