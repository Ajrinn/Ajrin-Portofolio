# Ajrin Portfolio — Versi Statis (HTML)

Versi ini memakai **index.html murni** (tanpa PHP), jadi bisa langsung jalan di
hosting statis seperti **Vercel**, Netlify, GitHub Pages, atau cPanel.

## Struktur Folder

```
ajrin-portfolio/
├── index.html                ← halaman utama yang DIJALANKAN (header+footer sudah di dalamnya)
├── includes/                 ← potongan terpisah untuk MEMUDAHKAN EDIT (bukan dipakai langsung)
│   ├── header.html
│   ├── footer.html
│   └── modal.html
├── assets/
│   ├── css/
│   │   ├── fonts.css         ← deklarasi @font-face
│   │   └── style.css         ← seluruh style halaman
│   ├── js/main.js            ← seluruh JavaScript / interaksi
│   ├── fonts/                ← font Plus Jakarta Sans (5 ketebalan .woff2)
│   └── img/                  ← (kosong) tempat gambar nanti
└── README.md
```

## Penting (kenapa header/footer ada 2 tempat)

Di hosting statis seperti Vercel, file `.php include` tidak berfungsi. Karena itu
isi header & footer **digabung langsung ke dalam `index.html`** supaya pasti jalan.

Folder `includes/` tetap disertakan sebagai **salinan terpisah untuk editing**:
- Kalau Anda mengubah `includes/header.html` atau `includes/footer.html`,
  salin perubahannya ke bagian yang sesuai di dalam `index.html`.
- File yang benar-benar ditampilkan ke pengunjung hanyalah `index.html`.

CSS, JS, dan font tetap berupa file terpisah dan dipakai langsung oleh `index.html`.

## Deploy ke Vercel

Cara paling mudah (drag & drop):
1. Buka https://vercel.com → **Add New… → Project**.
2. Pilih **Deploy** lewat upload folder, atau hubungkan repo Git Anda.
3. Pastikan **root folder** berisi `index.html` langsung (sejajar dengan folder
   `assets/`). Tidak perlu build command — biarkan kosong / "Other".
4. Klik Deploy. Selesai.

Lewat Git/CLI:
1. Letakkan seluruh isi folder ini di root repository.
2. `vercel` (atau push ke Git yang sudah terhubung). Tanpa konfigurasi khusus,
   Vercel langsung menyajikan `index.html` sebagai situs statis.

## Deploy ke cPanel (jika nanti dibutuhkan)

Upload isi folder ini ke `public_html`, pastikan `index.html` ada di situ
bersama folder `assets/`. Buka domain Anda — langsung jalan.

## Catatan

- Semua path bersifat relatif (`assets/...`), jadi jangan mengubah struktur folder.
- Font sudah jadi file `.woff2` asli (bukan base64), sehingga HTML ringan dan
  font bisa di-cache browser.
