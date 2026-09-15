# Pengujian Beban CBT (Load Testing) dengan K6

Folder ini berisi skrip untuk melakukan _stress testing_ / pengujian beban menggunakan [k6](https://k6.io/).
Tujuannya adalah memastikan server kuat menampung ratusan mahasiswa yang login dan mengakses ujian secara bersamaan.

## Prasyarat

1. Install k6 di komputer/server penguji:
   - Mac: `brew install k6`
   - Debian/Ubuntu: `sudo apt install k6`
   - Windows: `winget install k6`

## Cara Menjalankan

Pastikan backend CBT sedang berjalan (bisa di localhost atau server staging).

Lalu jalankan perintah ini di terminal:

```bash
# Jalankan test dengan konfigurasi default (Ramp up to 200 users)
k6 run k6-stress-test.js

# Menjalankan test dengan URL API custom (jika mengetes server production)
k6 run -e API_URL=https://api.cbt.widyatama.ac.id/api k6-stress-test.js
```

## Membaca Hasil

Perhatikan metrik berikut setelah test selesai:

- `http_req_duration`: Rata-rata waktu respons server. Jika di atas `2000ms` (2 detik), server mulai kewalahan.
- `http_req_failed`: Persentase request yang gagal (Error 500/502/504). Jika lebih dari 0%, cek log server.
- `vus`: Jumlah virtual users (mahasiswa palsu) yang berhasil disimulasikan bersamaan.
