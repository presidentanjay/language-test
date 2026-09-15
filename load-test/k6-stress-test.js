import http from "k6/http";
import { check, sleep } from "k6";

// Konfigurasi pengujian beban
export const options = {
  stages: [
    { duration: "30s", target: 50 }, // Ramp-up: 0 ke 50 user dalam 30 detik
    { duration: "1m", target: 200 }, // Spike: Naik drastis ke 200 user
    { duration: "2m", target: 200 }, // Sustain: Tahan di 200 user selama 2 menit (Simulasi login serentak)
    { duration: "30s", target: 0 }, // Ramp-down: Turun ke 0 user
  ],
  thresholds: {
    http_req_duration: ["p(95)<2000"], // 95% request harus selesai di bawah 2 detik
    http_req_failed: ["rate<0.01"], // Tingkat error maksimal 1%
  },
};

const BASE_URL = __ENV.API_URL || "http://localhost:3333/api";

export default function () {
  // 1. Simulasi peserta membuka halaman login
  let res = http.get(`${BASE_URL}/exams`);

  check(res, {
    "GET /exams status 200": (r) => r.status === 200,
  });

  sleep(1); // Jeda baca layar 1 detik

  // 2. Simulasi peserta mengetik email dan password, lalu login
  // Catatan: Pastikan akun ini ada di seeder, atau gunakan akun dummy
  const payload = JSON.stringify({
    email: "peserta@gmail.com",
    password: "password",
  });

  const params = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  let loginRes = http.post(`${BASE_URL}/login`, payload, params);

  check(loginRes, {
    "POST /login status 200": (r) => r.status === 200,
  });

  sleep(2); // Jeda sebelum request berikutnya (simulasi manusia)

  // 3. Simulasi mengambil data profil setelah login
  let meRes = http.get(`${BASE_URL}/me`, {
    // K6 otomatis mengirimkan cookies dari login sebelumnya (HttpOnly cookie)
  });

  check(meRes, {
    "GET /me status 200": (r) => r.status === 200,
  });

  sleep(3); // Selesai siklus login
}
