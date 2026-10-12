# DOKUMEN PERANCANGAN TAHAP 5: DESAIN DATABASE (RELATIONAL SCHEMA DIAGRAM)
## Sistem Informasi Log & Notula Rapat (SIM-RAPAT KEK RI)
**Sekretariat Jenderal Dewan Nasional Kawasan Ekonomi Khusus Republik Indonesia**

Dokumen ini memuat perancangan resmi **Desain Database (Physical Relational Data Model)** dengan format visual *Card Diagram* modern sesuai acuan penulisan Skripsi / Tugas Akhir, memodelkan tabel-tabel basis data **Neon PostgreSQL** dengan header navy/biru, highlight baris kunci (*Primary Key* dan *Foreign Key*), serta garis relasi kardinalitas ortogonal (`0..1` &rarr; `*`).

---

## 1. File Diagram & Tautan Pratinjau

* **File Asli Draw.io (Multi-Tab):** [`docs/DESAIN_DATABASE_SIM_RAPAT.drawio`](file:///c:/Users/nappz/Documents/Project%20Website/Projek%20Log%20Rapat/docs/DESAIN_DATABASE_SIM_RAPAT.drawio)
* **Tautan Unduh Langsung:** [http://localhost:3000/DESAIN_DATABASE_SIM_RAPAT.drawio](http://localhost:3000/DESAIN_DATABASE_SIM_RAPAT.drawio)
* **Tautan Pratinjau Interaktif di Browser:** [http://localhost:3000/database-design-preview.html](http://localhost:3000/database-design-preview.html)

> [!TIP]
> **Fitur Pratinjau Interaktif di Web:**
> Melalui browser di `http://localhost:3000/database-design-preview.html`, Anda dapat beralih secara langsung antara:
> 1. **Skema Utama SIM-RAPAT KEK RI (8 Tabel Inti)** — Ditata dalam grid dan relasi persis seperti contoh acuan.
> 2. **Skema Lengkap SIM-RAPAT KEK RI (14 Tabel 3NF)** — Menampilkan seluruh 14 tabel PostgreSQL.
> 3. **Replika Persis Contoh Gambar (8 Tabel Permohonan Informasi)** — Replika 100% dari gambar yang Anda lampirkan (`m_units`, `r_user_unit`, `r_permohonan_informasi`, dll).

---

## 2. Standardisasi Visual Desain Database (Sesuai Contoh Acuan)

| Elemen Desain | Gaya / Palet Warna | Makna & Aturan Desain |
|:---|:---|:---|
| **Header Kartu Tabel** | Biru Navy `#205493`, Teks Putih Tebal | Menampilkan nama fisik tabel relasional dalam huruf kecil (*snake_case*). |
| **Baris Kunci (PK & FK)** | Latar Biru Muda Halus `#E6F0FA` | Membedakan kolom kunci utama (*Primary Key* 🔑) dan kunci tamu (*Foreign Key* 🔗) dari kolom atribut biasa. |
| **Kolom Atribut Biasa** | Latar Putih Bersih `#FFFFFF` | Menampilkan atribut data standar dengan batas garis halus (*border-bottom*). |
| **Tipe Data (Kanan)** | Abu-abu Slate `#64748B`, Font Monospace | Menampilkan tipe data fisik PostgreSQL (`varchar`, `integer`, `timestamp`, `enum`, `boolean`, `text`). |
| **Garis Relasi Ortogonal** | Biru Cerulean `#3182CE` (tebal 1.6–1.8px) | Menghubungkan kolom PK di tabel induk ke kolom FK di tabel anak dengan belokan siku halus. |
| **Titik Kardinalitas** | Lingkaran kecil putih bergaris biru `○` | Menandai sisi **0..1 (Induk / Satu)** dan sisi **\* (Anak / Banyak)** dengan tanda panah terbuka. |

---

## 3. Struktur 8 Tabel Inti SIM-RAPAT KEK RI (Layout Contoh Acuan)

Sesuai tata letak spasial pada gambar acuan Anda, berikut pemetaan 8 tabel inti SIM-RAPAT KEK RI:

```
                  +-------------------+            +-------------------+
                  |       biro        | 0..1      *|     tim_biro      |
                  +-------------------+───────────>+-------------------+
                  | id_biro        PK |            | id_tim         PK |
                  | kode_biro         |            | id_biro        FK |
                  | nama_biro         |            | nama_tim          |
                  +-------------------+            +-------------------+
                     │ 0..1                                  │ 0..1
                     │                                       │
                     ▼ *                                     ▼ *
+--------------------+--------------+   +--------------------+--------------+   +--------------------+--------------+
|               rapat               |   |            tindak_lanjut          |   |              pengguna              |
+-----------------------------------+   +-----------------------------------+   +-----------------------------------+
| id_rapat                       PK |0.1| id_tindak_lanjut               PK |   | id_pengguna                    PK |
| nomor_rapat                       |──>| id_rapat                       FK |   | nama_lengkap                      |
| judul_rapat                       | * | judul_tindak_lanjut               |   | email                             |
| id_biro                        FK |   | status_tindak_lanjut         enum |   | kata_sandi                        |
| id_tim                         FK |   | prioritas                    enum |   | peran                        enum |
| id_pengguna                    FK |   | tenggat_waktu           timestamp |   +-----------------------------------+
| tanggal_rapat           timestamp |   | diselesaikan_pada       timestamp |              │ 0..1
| waktu_mulai                       |   +-----------------------------------+              │
| lokasi_rapat                      |                                                      │
| status_rapat                 enum |                                                      │
| kategori_naskah                   |                                                      │
| dibuat_pada             timestamp |                                                      │
+-----------------------------------+                                                      ▼ *
   │ 0..1           │ 0..1              +-----------------------------------+   +-----------------------------------+
   │                │                   |             notifikasi            |   |           peserta_rapat           |
   │                │                   +-----------------------------------+   +-----------------------------------+
   │                │                0.1| id_notifikasi                  PK |   | id_peserta                     PK |
   │                └──────────────────>| id_pengguna                    FK |<──| id_rapat                       FK |
   │                                  * | judul                             | * | id_pengguna                    FK |
   │                                    | pesan                        text |   | status_kehadiran             enum |
   │                                    | sudah_dibaca              boolean |   | dibuat_pada             timestamp |
   ▼ *                                  +-----------------------------------+   +-----------------------------------+
+-----------------------------------+
|           notulen_rapat           |
+-----------------------------------+
| id_notulen                     PK |
| id_rapat                       FK |
| poin_pembahasan              text |
| arahan_pimpinan              text |
| kesimpulan                   text |
| catatan_khusus               text |
| dibuat_pada             timestamp |
+-----------------------------------+
```

---

## 4. Cara Menggunakan File di Draw.io

1. Akses [https://app.diagrams.net](https://app.diagrams.net) di peramban web Anda.
2. Pilih menu **Open Existing Diagram** &rarr; buka berkas [`docs/DESAIN_DATABASE_SIM_RAPAT.drawio`](file:///c:/Users/nappz/Documents/Project%20Website/Projek%20Log%20Rapat/docs/DESAIN_DATABASE_SIM_RAPAT.drawio).
3. Anda dapat mengedit teks, menggeser letak tabel, atau menambahkan atribut sesuai perkembangan bab laporan.
4. Untuk menyematkan ke dokumen Word laporan skripsi:
   * Pilih menu **File &rarr; Export as &rarr; PNG**.
   * Centang **Transparent Background** (opsional) dan tentukan **Zoom: 300% (300 DPI)** agar hasil cetakan diagram tidak pecah atau buram.

---

*Dokumen ini merupakan bagian dari rangkaian dokumentasi resmi rekayasa perangkat lunak SIM-RAPAT KEK RI ([Tahap 1: ERD](file:///c:/Users/nappz/Documents/Project%20Website/Projek%20Log%20Rapat/docs/1_ERD_DIAGRAM.md) &bull; [Tahap 2: LRS](file:///c:/Users/nappz/Documents/Project%20Website/Projek%20Log%20Rapat/docs/2_LRS_DIAGRAM.md) &bull; [Tahap 3: Use Case](file:///c:/Users/nappz/Documents/Project%20Website/Projek%20Log%20Rapat/docs/3_USE_CASE_DIAGRAM.md) &bull; [Tahap 4: Activity Diagram](file:///c:/Users/nappz/Documents/Project%20Website/Projek%20Log%20Rapat/docs/4_ACTIVITY_DIAGRAM.md) &bull; [Tahap 5: Desain Database](file:///c:/Users/nappz/Documents/Project%20Website/Projek%20Log%20Rapat/docs/5_DESAIN_DATABASE.md)).*
