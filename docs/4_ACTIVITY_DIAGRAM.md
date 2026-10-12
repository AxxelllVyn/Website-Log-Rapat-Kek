# DOKUMEN PERANCANGAN TAHAP 4: UML ACTIVITY DIAGRAM (ALUR PROSES UTAMA)
## Sistem Informasi Log & Notula Rapat (SIM-RAPAT KEK RI)
**Sekretariat Jenderal Dewan Nasional Kawasan Ekonomi Khusus Republik Indonesia**

Dokumen ini memuat perancangan resmi **UML Activity Diagram (Diagram Alur Aktivitas Bisnis)** dengan format baku laporan Skripsi / Tugas Akhir (*Swimlane Table Layout: Aktor 1 | System | Aktor 2*), memodelkan 3 proses bisnis utama pada Sistem Informasi SIM-RAPAT KEK RI sesuai dengan format acuan laporan akademik.

---

## 1. File Diagram & Tautan Preview

* **File Asli Draw.io (Multi-Tab):** [`docs/ACTIVITY_DIAGRAM_SIM_RAPAT.drawio`](file:///c:/Users/nappz/Documents/Project%20Website/Projek%20Log%20Rapat/docs/ACTIVITY_DIAGRAM_SIM_RAPAT.drawio)
* **Tautan Download Langsung:** [http://localhost:3000/ACTIVITY_DIAGRAM_SIM_RAPAT.drawio](http://localhost:3000/ACTIVITY_DIAGRAM_SIM_RAPAT.drawio)
* **Tautan Pratinjau Interaktif di Browser:** [http://localhost:3000/activity-diagram-preview.html](http://localhost:3000/activity-diagram-preview.html)

> [!TIP]
> **Struktur Multi-Tab Draw.io (`.drawio`):**
> Saat file dibuka di aplikasi **Draw.io (diagrams.net)**, terdapat 3 lembar tab terpisah:
> 1. `a. Alur Penjadwalan Rapat` (Swimlane: Admin Biro/Tim | System | Pimpinan & Peserta Rapat)
> 2. `b. Alur Notulensi & Risalah` (Swimlane: Notulis Rapat | System | Pimpinan Sidang)
> 3. `c. Alur Tindak Lanjut & PIC` (Swimlane: Staf Pelaksana PIC | System | Pimpinan / Admin Biro)

---

## 2. Standar Notasi & Palet Warna Visual (Format Skripsi)

Sesuai dengan acuan format bagan alur proses laporan skripsi, diagram ini menerapkan standardisasi bentuk dan palet warna semantik:

| Bentuk Notasi | Warna & Gaya | Makna / Fungsi dalam Alur |
|:---|:---|:---|
| **Lingkaran Start (`●`)** | Putih berkontur hitam + batang atas | Titik awal dimulainya alur proses (*Initial Node*). |
| **Kotak Rounded Hijau** | Isi `#D5E8D4`, Border `#82B366` | Aktivitas / tindakan yang dieksekusi oleh Aktor (Pengguna/Admin/Pimpinan). |
| **Jajaran Genjang Ungu** | Isi `#E1D5E7`, Border `#9673A6` | Pemrosesan data otomatis oleh sistem (*generate ticket/nomor urut/PDF risalah*). |
| **Belah Ketupat Kuning** | Isi `#FFF2CC`, Border `#D6B656` | Titik keputusan logika (*Decision Node*: verifikasi validitas, persetujuan, batas waktu). |
| **Kotak Rounded Merah Putus-putus** | Isi `#F8CECC`, Garis Putus-putus `#B85450` | Status notifikasi / konfirmasi yang diterima aktor di jalurnya. |
| **Kotak Rounded Biru** | Isi `#DAE8FC`, Border `#6C8EBF` | Jalur alternatif / penanganan berkas khusus (cth: *Pengajuan rapat lanjutan*, *Arsip final*). |
| **Panah Merah Putus-putus** | Garis putus-putus merah | Pengiriman sinyal notifikasi antar-jalur (*Cross-swimlane notification dispatch*). |
| **Lingkaran Bullseye (`◉`)** | Lingkaran ganda dengan inti hitam | Titik akhir selesainya proses (*Activity Final Node*). |

---

## 2.3. Alur Proses Utama

Berikut rincian 3 alur proses utama yang dapat langsung dicantumkan ke dalam Bab 2 / Bab 3 laporan tugas akhir:

---

### a. Alur Penjadwalan Rapat Dinas

Alur ini memodelkan proses dari inisiasi pembuatan agenda rapat dinas oleh Admin Biro/Tim, pembuatan nomor registrasi rapat otomatis oleh sistem, penyebaran undangan notifikasi kepada pimpinan & peserta, konfirmasi kehadiran, hingga penutupan status pelaksanaan rapat.

```
+----------------------------------------------------------------------------------------------------+
|                                    Alur Penjadwalan Rapat Dinas                                    |
+------------------------------------+--------------------------+------------------------------------+
|          Admin Biro / Tim          |          System          |      Pimpinan & Peserta Rapat      |
+------------------------------------+--------------------------+------------------------------------+
|  (Start Node)                      |                          |                                    |
|         │                          |                          |                                    |
|  [memilih form buat rapat & tim] ──┼─> [generate nomor rapat] │                                    |
|                                    │           │              │                                    |
|  [mengisi formulir rapat] <────────┼───────────┘              │                                    |
|         │                          |                          |                                    |
|  [klik "Jadwalkan Rapat"] ─────────┼─> <verifikasi data?>     |                                    |
|                                    |      │           │       |                                    |
|                                    | (Tidak)         (Ya)     |                                    |
|                                    |      │           │       |                                    |
|                                    | [status: REJECT] ┼───────┼─> [edit status: SCHEDULED]         |
|                                    |                  │       |          │                         |
|  [notifikasi rapat dijadwalkan] <──┼──────────────────┴───────┼──────────┤                         |
|                                    |                          |  [menerima notifikasi undangan]    |
|                                    |                          |          │                         |
|                                    |                          |  <konfirmasi kehadiran?>           |
|                                    |                          |    │              │                |
|                                    |                          | (Izin)         (Hadir)             |
|                                    |                          |    │              │                |
|                                    |                          | [EXCUSED]      [PRESENT]           |
|  [notifikasi konfirmasi presensi] <┼──────────────────────────┼────┴──────────────┘                |
|                                    |                          |          │                         |
|                                    |                          |  [Rapat Dilaksanakan & Materi]     |
|                                    |                          |          │                         |
|                                    |                          |  <rapat selesai terlaksana?>       |
|                                    |                          |    │              │                |
|                                    |                          | (Tidak)          (Ya)              |
|                                    |                          |    │              │                |
|                                    |                          | [Reschedule]   [status: FINAL]     |
|  [notifikasi pelaksanaan selesai] <┼──────────────────────────┼───────────────────┘                |
|         │                          |                          |                                    |
|   (End Node)                       |                          |                                    |
+------------------------------------+--------------------------+------------------------------------+
```

---

### b. Alur Penyusunan & Pengesahan Notulensi Rapat

Alur ini memodelkan proses notulis mencatat dinamika rapat dinas, penyimpanan draft risalah, pengajuan telaah pimpinan sidang, keputusan revisi vs persetujuan pengesahan (*approval*), pembuatan dokumen PDF resmi ber-QR Code, hingga perumusan butir tindak lanjut (*action items*).

```
+----------------------------------------------------------------------------------------------------+
|                          Alur Penyusunan & Pengesahan Risalah Notulensi                            |
+------------------------------------+--------------------------+------------------------------------+
|            Notulis Rapat           |          System          |          Pimpinan Sidang           |
+------------------------------------+--------------------------+------------------------------------+
|  (Start Node)                      |                          |                                    |
|         │                          |                          |                                    |
|  [mencatat agenda & keputusan] ────┼─> [generate draft JSON]  |                                    |
|                                    │           │              |                                    |
|  [simpan & ajukan telaah] <────────┼───────────┘              |                                    |
|         │                          |                          |                                    |
|         └──────────────────────────┼─> [edit status: REVIEW] ─┼─> [notifikasi draf siap ditelaah]  |
|                                    |                          |          │                         |
|                                    |                          |  [menelaah isi draf risalah]       |
|                                    |                          |          │                         |
|                                    |                          |  <substansi disetujui?>            |
|                                    |                          |    │              │                |
|                                    |                          | (Revisi)      (Disetujui)          |
|                                    |                          |    │              │                |
|  [notifikasi naskah perlu revisi] <┼── [edit status: REVISI] <┘           [edit status: APPROVED]  |
|         │                          |                                              │                |
|  (perbaiki draf notulensi)         |   [generate PDF resmi & QR Code] <───────────┘                |
|                                    |                  │                                            |
|  [notifikasi notula resmi terbit] <┼──────────────────┘                                            |
|                                    |                          <terbitkan tindak lanjut ke tim?>    |
|                                    |                            │              │                   |
|                                    |                          (Tidak)         (Ya)                 |
|                                    |                            │              │                   |
|                                    |                          [Arsip]    [rumuskan butir PIC]      |
|  [notifikasi proses rapat tuntas] <┼───────────────────────────────────────────┘                   |
|         │                          |                                                               |
|   (End Node)                       |                                                               |
+------------------------------------+--------------------------+------------------------------------+
```

---

### c. Alur Monitoring & Pembaruan Tindak Lanjut (PIC)

Alur ini memodelkan proses pimpinan merumuskan butir mandat pekerjaan dari hasil rapat dinas, penomoran tiket penugasan, notifikasi ke staf penanggung jawab (*Person-in-Charge / PIC*), pembaruan status pengerjaan (*On Progress*), evaluasi ketepatan waktu (*Overdue vs Completed*), hingga verifikasi akhir dan penutupan tugas (*Closed*).

```
+----------------------------------------------------------------------------------------------------+
|                       Alur Monitoring & Pembaruan Tindak Lanjut (Action Items)                      |
+------------------------------------+--------------------------+------------------------------------+
|        Staf Pelaksana (PIC)        |          System          |        Pimpinan / Admin Biro       |
+------------------------------------+--------------------------+------------------------------------+
|                                    |                          |  (Start Node)                      |
|                                    |                          |         │                          |
|                                    |   [generate ticket PIC] <┼── [rumuskan butir & PIC tim]       |
|                                    |           │              |                                    |
|  [notifikasi penugasan baru] <─────┼───────────┘              |                                    |
|         │                          |                          |                                    |
|  [telaah instruksi & target]       |                          |                                    |
|         │                          |                          |                                    |
|  [edit status: ON PROGRESS] ───────┼──────────────────────────┼─> [notifikasi pekerjaan diproses]  |
|         │                          |                          |                                    |
|  <selesai tepat waktu target?>     |                          |                                    |
|    │              │                |                          |                                    |
| (Lewat)        (Tepat)             |                          |                                    |
|    │              │                |                          |                                    |
| [OVERDUE]     [COMPLETED] ─────────┼──────────────────────────┼─> [notifikasi siap verifikasi]     |
|                                    |                          |          │                         |
|                                    |                          |  [evaluasi bukti & hasil kerja]    |
|                                    |                          |          │                         |
|                                    |                          |  <hasil kerja memuaskan?>          |
|                                    |                          |    │              │                |
|                                    |                          | (Perlu Rev)   (Memuaskan)          |
|                                    |                          |    │              │                |
|  (kembali revisi pekerjaan) <──────┼──────────────────────────┼─ [Revisi]    [edit: CLOSED/DONE]   |
|                                    |                          |                   │                |
|  [notifikasi tindak lanjut tuntas]<┼──────────────────────────┼───────────────────┘                |
|         │                          |                          |                                    |
|   (End Node)                       |                          |                                    |
+------------------------------------+--------------------------+------------------------------------+
```

---

## 3. Cara Menggunakan File di Draw.io

1. Buka browser dan kunjungi [https://app.diagrams.net](https://app.diagrams.net).
2. Pilih menu **Open Existing Diagram**.
3. Pilih berkas [`docs/ACTIVITY_DIAGRAM_SIM_RAPAT.drawio`](file:///c:/Users/nappz/Documents/Project%20Website/Projek%20Log%20Rapat/docs/ACTIVITY_DIAGRAM_SIM_RAPAT.drawio) yang ada di direktori proyek ini.
4. Di bagian bawah jendela Draw.io, Anda dapat memilih antara tab **a. Alur Penjadwalan Rapat**, **b. Alur Notulensi & Risalah**, atau **c. Alur Tindak Lanjut & PIC**.
5. Untuk menyalin ke laporan Microsoft Word / LaTeX, gunakan menu **File &rarr; Export as &rarr; PNG / SVG / PDF** dengan resolusi 300 DPI untuk kualitas cetak dokumen tugas akhir yang tajam.

---

*Dokumen ini merupakan bagian dari rangkaian dokumentasi resmi rekayasa perangkat lunak SIM-RAPAT KEK RI ([Tahap 1: ERD](file:///c:/Users/nappz/Documents/Project%20Website/Projek%20Log%20Rapat/docs/1_ERD_DIAGRAM.md) &bull; [Tahap 2: LRS](file:///c:/Users/nappz/Documents/Project%20Website/Projek%20Log%20Rapat/docs/2_LRS_DIAGRAM.md) &bull; [Tahap 3: Use Case](file:///c:/Users/nappz/Documents/Project%20Website/Projek%20Log%20Rapat/docs/3_USE_CASE_DIAGRAM.md) &bull; [Tahap 4: Activity Diagram](file:///c:/Users/nappz/Documents/Project%20Website/Projek%20Log%20Rapat/docs/4_ACTIVITY_DIAGRAM.md)).*
