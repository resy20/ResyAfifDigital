# 💍 Undangan Digital – Resy & Afif
**27 Desember 2026 · Cilaja Hilir, Sindanglaya, Kab. Bandung**

---

## 📁 Struktur File

```
wedding-resy-afif/
├── index.html          ← Halaman undangan utama (untuk tamu)
├── admin.html          ← Panel admin (untuk pengelola)
├── css/
│   └── style.css       ← Semua styling
├── js/
│   └── app.js          ← Logic: countdown, QR, RSVP, wishes
├── audio/
│   └── jalaraning-tresna.mp3   ← (tambahkan sendiri – lihat catatan)
└── supabase-setup.sql  ← Script database
```

---

## 🎵 Cara Tambah Musik (Jalaraning Tresna – Ilham Pradana)

Karena lagu ini berlisensi, ada 2 cara:

**Cara A – File MP3 sendiri:**
1. Beli/unduh lagu secara legal
2. Simpan sebagai `audio/jalaraning-tresna.mp3`
3. Sudah otomatis terhubung di `index.html`

**Cara B – YouTube/Spotify Embed (tanpa MP3):**
Di `index.html`, ganti bagian `<audio>` dengan:
```html
<!-- YouTube background (tersembunyi) -->
<iframe id="yt-music"
  src="https://www.youtube.com/embed/ID_VIDEO?autoplay=1&loop=1&playlist=ID_VIDEO&controls=0"
  style="display:none" allow="autoplay">
</iframe>
```

---

## 🗄️ Setup Supabase (Database Gratis)

1. Buka **https://supabase.com** → buat akun gratis
2. Klik **New Project** → isi nama project, pilih region **Southeast Asia**
3. Tunggu project dibuat (~2 menit)
4. Buka **SQL Editor** → paste isi file `supabase-setup.sql` → Run
5. Buka **Settings → API** → salin:
   - `Project URL` → paste ke `SUPABASE_URL` di `js/app.js` dan `admin.html`
   - `anon/public key` → paste ke `SUPABASE_ANON_KEY`

---

## 🚀 Deploy ke Vercel (Gratis)

### Cara Termudah:

1. **Buat akun GitHub** (jika belum ada): https://github.com
2. **Upload semua file** ke repository baru
3. **Buka** https://vercel.com → Login dengan GitHub
4. Klik **"Add New Project"** → pilih repository Anda
5. Klik **Deploy** → selesai! 🎉

Website akan tersedia di: `https://nama-project.vercel.app`

### Contoh Link Tamu:
```
https://resy-afif.vercel.app/?to=Bapak+Dadan+Suryadi
https://resy-afif.vercel.app/?to=Keluarga+H.+Rahmat
```

---

## 📲 Cara Pakai Admin Panel

1. Buka `admin.html` di browser (atau `https://domain.com/admin.html`)
2. **Tambah tamu**: isi nama + nomor WA → klik "Tambah"
3. **Kirim undangan**: klik tombol 📲 WA per tamu, atau "Kirim Semua"
4. **Export**: klik "Export CSV" untuk backup data tamu
5. **Pantau RSVP** di tab "Konfirmasi RSVP"

---

## 🔗 Custom Domain (Opsional – Rp 150-200rb/tahun)

Setelah deploy ke Vercel:
1. Beli domain di **Niagahoster** atau **Dewaweb** (lebih murah dari luar)
2. Di Vercel: Settings → Domains → tambah domain
3. Ikuti instruksi DNS yang diberikan Vercel

**Rekomendasi nama domain:**
- `resy-afif.my.id` (Rp 14rb/tahun – murah!)
- `resyafif.com` (Rp 150rb/tahun)

---

## ✅ Checklist Sebelum Launch

- [ ] Ganti `SUPABASE_URL` dan `SUPABASE_ANON_KEY` di `app.js`
- [ ] Tambahkan file audio di folder `audio/`
- [ ] Sesuaikan foto pasangan (ganti URL di `index.html`)
- [ ] Test buka link dengan nama tamu: `?to=NamaTamu`
- [ ] Test RSVP & kirim ucapan
- [ ] Test Admin Panel
- [ ] Deploy ke Vercel
- [ ] Update `base_url` di Admin Panel Settings

---

## 📞 Fitur Ringkasan

| Fitur | Status |
|-------|--------|
| Undangan personal per tamu (?to=Nama) | ✅ |
| Cover/envelope animasi | ✅ |
| Background musik | ✅ |
| Countdown timer real-time | ✅ |
| Scroll reveal animation | ✅ |
| Galeri foto | ✅ |
| RSVP konfirmasi kehadiran | ✅ |
| Buku tamu digital (ucapan) | ✅ |
| QR Code per tamu | ✅ |
| Admin panel manajemen tamu | ✅ |
| Kirim WA otomatis per tamu | ✅ |
| Template pesan WA kustom | ✅ |
| Export CSV daftar tamu | ✅ |
| Database Supabase | ✅ |
| Responsif mobile | ✅ |
| Siap deploy Vercel (gratis) | ✅ |
