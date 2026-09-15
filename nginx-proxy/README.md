# Setup Nginx HTTPS (Reverse Proxy) + SSL Certbot

Konfigurasi di folder ini bertujuan untuk memberikan Gembok Hijau (`https://`) ke aplikasi CBT agar **fitur Akses Kamera (Selfie Anti-Cheat) tidak diblokir oleh browser**.

## Asumsi Domain

Dalam file `default.conf`, kita mengasumsikan Anda memiliki 3 subdomain:

1. `cbt.widyatama.ac.id` (Portal Mahasiswa)
2. `api.cbt.widyatama.ac.id` (Backend API)
3. `admin.cbt.widyatama.ac.id` (CMS Admin)

_(Ubah nama domain di dalam `default.conf` jika nama domain asli kampus Anda berbeda)._

## Cara Pemasangan di Docker (Production)

Anda dapat memperbarui file `docker-compose.yml` utama Anda dengan menambahkan blok _service_ Nginx dan Certbot berikut:

```yaml
nginx:
  image: nginx:alpine
  container_name: cbt_nginx
  restart: always
  ports:
    - "80:80"
    - "443:443"
  volumes:
    - ./nginx-proxy/default.conf:/etc/nginx/conf.d/default.conf
    - certbot_conf:/etc/letsencrypt
    - certbot_www:/var/www/certbot
  networks:
    - app_network
  depends_on:
    - frontend-toefl
    - backend
    - cms-admin

certbot:
  image: certbot/certbot
  container_name: cbt_certbot
  volumes:
    - certbot_conf:/etc/letsencrypt
    - certbot_www:/var/www/certbot
```

_(Ingat untuk mendaftarkan volume `certbot_conf` dan `certbot_www` di bagian bawah `docker-compose.yml` Anda)._

## Cara Mendapatkan Sertifikat SSL Gratis (Pertama Kali)

Jalankan perintah ini di server production Anda untuk meminta sertifikat SSL dari Let's Encrypt:

```bash
docker-compose run --rm certbot certonly --webroot --webroot-path /var/www/certbot/ -d cbt.widyatama.ac.id -d api.cbt.widyatama.ac.id -d admin.cbt.widyatama.ac.id --email admin@widyatama.ac.id --agree-tos --no-eff-email
```

Setelah sertifikat terbit, restart Nginx:

```bash
docker-compose restart nginx
```

Sekarang semua portal ujian sudah aman terlindungi HTTPS, dan kamera laptop mahasiswa akan menyala tanpa diblokir!
