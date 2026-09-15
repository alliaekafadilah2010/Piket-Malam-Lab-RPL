/**
 * PIKET MALAM - Game Data
 * Rooms, Puzzles, Bu Rani's Handwritten Journal, Dialogue, and Scoring Configuration
 */

import { RoomDef, JournalPage, DialogueLine } from '../types/game';

export const JOURNAL_PAGES: JournalPage[] = [
  {
    id: 1,
    title: 'Catatan #01: Saat Lampu Padam di Lab RPL',
    subject: 'pengantar',
    content: `Kalau kamu membaca ini, berarti kamu masih ada di Lab RPL setelah pukul 18.00. 
Jangan panik, Nara. Sekolah ini punya kebiasaan aneh saat malam: ia menguji pemahaman nalar kita terhadap dunia coding.
Ingat satu hal: Coding bukan sekadar menghafal sintaks atau copy-paste dari internet agar dapat nilai KKM.
Coding adalah seni berpikir terstruktur dan memecahkan masalah secara logis.
Gunakan ponselmu untuk menerangi jalan, dan gunakan 'Lensa Nalar' (Shift) untuk melihat logika di balik sistem sekolah ini!`,
    sketchType: 'intro',
    authorNote: '— Bu Rani (Guru Produktif RPL yang suka lupa bawa spidol)',
    unlocked: true,
  },
  {
    id: 2,
    title: 'Catatan #14: Anatomi Web: Tag HTML & Styling CSS',
    subject: 'fisika',
    content: `Banyak anak kelas 10 RPL mengira HTML itu cuma teks biasa.
Padahal elemen HTML seperti batu bata! Sebagian besar tag wajib berpasangan: ada tag pembuka dan ada tag penutup bergaris miring:
Contohnya: <button id="pintu">Buka Pintu</button>!
Kalau kamu lupa menutup tag-nya, struktur halaman web bisa bocor dan berantakan.
Lalu, CSS (Cascading Style Sheets) bertugas memberi warna dan gaya: background-color: green; agar tombol menyala hijau dan siap diklik!`,
    sketchType: 'html_tag',
    authorNote: 'Pernah ada murid bikin web tugas akhir tombolnya hilang gara-gara tag tak ditutup.',
    unlocked: false,
  },
  {
    id: 3,
    title: 'Catatan #16: Tata Letak Web: CSS Flexbox & Hyperlink',
    subject: 'fisika',
    content: `Kenapa form login dan navbar sering miring ke pojok kiri atas?
Karena belum menggunakan CSS Flexbox!
Dengan: display: flex; justify-content: center; align-items: center;
Seluruh elemen akan otomatis tertata rapi tepat di tengah layar!
Sedangkan untuk navigasi antar halaman, kita gunakan tag jangkar: <a href="tujuan.html">Teks Link</a> dan atribut alt pada <img alt="..." /> agar ramah disabilitas dan SEO!`,
    sketchType: 'flexbox',
    authorNote: 'Flexbox menyelamatkan jutaan web developer dari era tabel HTML kuno.',
    unlocked: false,
  },
  {
    id: 4,
    title: 'Catatan #20: Seni Percabangan: Logika If / Else & Boolean',
    subject: 'kimia',
    content: `Komputer itu sangat patuh, tapi dia tidak bisa membaca pikiran manusia.
Untuk mengambil keputusan, kita menggunakan struktur percabangan IF - ELSE:
if (kondisi === true) {
    // dijalankan jika syarat terpenuhi!
} else {
    // dijalankan jika syarat TIDAK terpenuhi!
}
Kalau kartu aksesmu bernilai "VALID", gerbang otomatis terbuka. Kalau kosong atau rusak, masuk ke blok else (terkunci). Sederhana tapi menjadi fondasi seluruh software di dunia!`,
    sketchType: 'if_else',
    authorNote: 'Sering dipakai mengunci pintu otomatis lab waktu ujian kompetensi kejuruan.',
    unlocked: false,
  },
  {
    id: 5,
    title: 'Catatan #23: Jangan Lelah Berputar: Logika For Loop',
    subject: 'kimia',
    content: `Daripada mengetik kode putarKipas() berulang-ulang 5 kali manual, programmer cerdas menggunakan Loop:
for (let i = 0; i < 5; i++) {
    putarKipas();
}
Nilai awal i=0, selama i < 5, jalankan perintah dan tambah i++ (i = 0, 1, 2, 3, 4). Tepat 5 kali putaran, lalu loop berhenti otomatis sebelum server overheat!`,
    sketchType: 'loop',
    authorNote: 'Hati-hati kondisi akhir, jangan sampai membuat perulangan tanpa henti (infinite loop)!',
    unlocked: false,
  },
  {
    id: 6,
    title: 'Catatan #25: Gerbang Logika: Operator AND (&&) vs OR (||)',
    subject: 'kimia',
    content: `Sistem alarm lab tidak boleh sembarangan berbunyi hanya karena uap mi instan!
Operator AND (&&): Kedua syarat WAJIB bernilai TRUE sekaligus (asap === true && suhuTinggi === true).
Operator OR (||): Cukup SALAH SATU syarat saja yang TRUE.
Untuk sistem darurat kebakaran yang aman dari false alarm, operator AND adalah pilihan yang tepat!`,
    sketchType: 'boolean_gate',
    authorNote: 'Belajar tabel kebenaran gerbang logika itu kunci lulus ujian sertifikasi.',
    unlocked: false,
  },
  {
    id: 7,
    title: 'Catatan #31: Jantung Basis Data: Query SQL & Klausa WHERE',
    subject: 'logika',
    content: `Di dunia RPL, jutaan data disimpan rapi di dalam Tabel Database (RDBMS).
Untuk mengambil data, kita menggunakan mantra legendaris SQL:
SELECT nama_kolom FROM nama_tabel WHERE kondisi;
Ingat pesan Bu Rani: JANGAN PERNAH menjalankan query tanpa klausa WHERE jika hanya mencari data spesifik!
Klausa WHERE nama_barang = 'Shard Kunci' menyaring data langsung ke sasaran tanpa membebani server sekolah!`,
    sketchType: 'sql_query',
    authorNote: 'Jangan pernah coba ketik DELETE FROM siswa tanpa WHERE, nanti seisi sekolah hilang datanya!',
    unlocked: false,
  },
  {
    id: 8,
    title: 'Catatan #34: Menambah Data Baru & Syarat PRIMARY KEY',
    subject: 'logika',
    content: `Untuk mendaftarkan siswa baru ke database:
INSERT INTO siswa (nis, nama, jurusan) VALUES ('1001', 'Nara', 'RPL');
Setiap tabel wajib punya PRIMARY KEY: identitas unik yang TIDAK BOLEH kembar dan TIDAK BOLEH kosong (NOT NULL).
NISN atau ID Siswa adalah Primary Key yang sempurna, bukan Nama (karena nama orang bisa kembar)!`,
    sketchType: 'primary_key',
    authorNote: 'Kunci primer adalah fondasi integritas data relasional.',
    unlocked: false,
  },
  {
    id: 9,
    title: 'Catatan #41: Rahasia Memori: Mengapa Array Mulai dari 0?',
    subject: 'matematika',
    content: `Pertanyaan klasik anak RPL: "Bu, kenapa indeks array di komputer mulai dari angka 0, bukan 1?"
Jawabannya: Karena indeks array adalah 'jarak offset' dari alamat memori awal!
Elemen pertama berada tepat di titik awal, sehingga jaraknya adalah 0!
Jika kita punya: let data = ["R", "P", "L"];
Maka data[0] adalah "R", data[1] adalah "P", dan data[2] adalah "L"!
Dan susun Flowchart: Mulai ➔ Input ➔ Validasi ➔ Selesai!`,
    sketchType: 'array_zero',
    authorNote: 'Indeks 0 adalah jati diri anak RPL sejati.',
    unlocked: false,
  },
  {
    id: 10,
    title: 'Catatan #43: Tumpukan vs Antrean: Stack (LIFO) & Queue (FIFO)',
    subject: 'matematika',
    content: `Dua struktur data paling populer di industri:
1. Stack (Tumpukan): LIFO (Last In, First Out). Yang terakhir ditaruh adalah yang pertama diambil! Contoh: Tombol Undo (Ctrl+Z) di editor kode.
2. Queue (Antrean): FIFO (First In, First Out). Yang pertama datang adalah yang pertama dilayani! Contoh: Antrean cetak printer lab RPL.`,
    sketchType: 'stack_queue',
    authorNote: 'Ingat tumpukan piring di kantin dan antrean kasir swalayan.',
    unlocked: false,
  },
  {
    id: 11,
    title: 'Catatan #45: Tiga Mantra Suci Git Version Control',
    subject: 'matematika',
    content: `Jangan simpan skripsi dengan nama "final_banget_revisi3_fix_beneran.zip"!
Gunakan Git:
1. git add . ➔ Masukkan perubahan file ke Staging Area
2. git commit -m "pesan" ➔ Simpan snapshot ke Local Repository
3. git push origin main ➔ Unggah hasil karyamu ke Cloud GitHub!`,
    sketchType: 'git',
    authorNote: 'Pernah ada tim magang nangis seharian gara-gara lupa commit sebelum laptop korsleting.',
    unlocked: false,
  },
];

export const INITIAL_ROOMS: RoomDef[] = [
  {
    id: 0,
    name: 'Koridor Utama (Sayap Lab RPL)',
    subject: 'tutorial',
    description: 'Lorong panjang Lab Rekayasa Perangkat Lunak SMK Bhakti Nusantara. Lampu neon berkedip sebelum mati total.',
    bounds: { width: 700, height: 420 },
    playerSpawn: { x: 90, y: 210 },
    walls: [
      { x: 0, y: 0, width: 700, height: 40 },
      { x: 0, y: 380, width: 700, height: 40 },
      { x: 0, y: 0, width: 40, height: 420 },
      { x: 660, y: 0, width: 40, height: 160 },
      { x: 660, y: 260, width: 40, height: 160 },
    ],
    objects: [
      {
        id: 'tut_journal_1',
        x: 180,
        y: 190,
        width: 32,
        height: 32,
        type: 'journal',
        label: 'Jurnal Bu Rani (Hal 1)',
        description: 'Buku catatan guru produktif RPL tergeletak di atas bangku koridor.',
        journalPageId: 1,
      },
      {
        id: 'tut_battery_1',
        x: 320,
        y: 90,
        width: 24,
        height: 24,
        type: 'battery',
        label: 'Baterai Cadangan AA',
        description: 'Baterai senter cadangan berdaya penuh.',
      },
      {
        id: 'tut_bip_terminal',
        x: 440,
        y: 60,
        width: 44,
        height: 44,
        type: 'bip_terminal',
        label: 'Terminal Asisten BIP-2009',
        description: 'Monitor tabung mini asisten cerdas lab RPL.',
      },
      {
        id: 'tut_breaker_panel',
        x: 540,
        y: 50,
        width: 44,
        height: 50,
        type: 'puzzle',
        label: 'Panel Daya Rack Server Lab',
        description: 'Panel saklar daya server lab RPL. Tekan E untuk mengalirkan daya ke pintu gerbang.',
        conceptualLayerText: 'Server Power Rack: Alirkan daya ke Switch & Server Web.',
        solved: false,
      },
      {
        id: 'tut_network_router',
        x: 260,
        y: 310,
        width: 48,
        height: 48,
        type: 'puzzle',
        label: 'Terminal Router & IP Lab RPL',
        description: 'Router jaringan lab RPL mati konfigurasi. Setel IP Gateway & Netmask untuk mengaktifkan lampu darurat koridor!',
        conceptualLayerText: 'Layer Jaringan TCP/IP: Gateway 192.168.1.1, Netmask 255.255.255.0, Port 80.',
        solved: false,
      },
      {
        id: 'tut_door_exit',
        x: 640,
        y: 160,
        width: 40,
        height: 100,
        type: 'door',
        label: 'Pintu Masuk Lab Web',
        description: 'Pintu besi selenoid menuju Lab Pemrograman Web. Wajib menyelesaikan SEMUA teka-teki di koridor (Panel Daya & Router).',
        requiresShard: false,
        conceptualLayerText: 'Koneksi Relai Gerbang: Wajib menyelesaikan SEMUA 2 teka-teki koridor.',
      },
    ],
    puzzleTitle: 'Aktifkan Daya Server Lab RPL',
    puzzleDescription: 'Gunakan Lensa Nalar (Shift) untuk melihat jalur arus dan aktifkan saklar daya server!',
  },
  {
    id: 1,
    name: 'Lab Pemrograman Web (HTML & CSS)',
    subject: 'fisika',
    description: 'Ruang praktikum pembuatan web dasar. Monitor komputer menampilkan halaman web yang rusak karena tag HTML bocor dan CSS hilang.',
    ghost: {
      name: 'HANTU SYNTAX',
      room: 'Lab Web',
      misconception: '"Tag HTML tidak perlu ditutup! Cukup ketik teks saja, browser pasti otomatis paham!"',
      clarification: 'Elemen HTML berpasangan seperti <button> wajib ditutup dengan </button>, dan CSS memberi warna hijau agar tombol aktif.',
      steps: 0,
      isDissolved: false,
      x: 580,
      y: 190,
    },
    bounds: { width: 700, height: 420 },
    playerSpawn: { x: 80, y: 210 },
    walls: [
      { x: 0, y: 0, width: 700, height: 40 },
      { x: 0, y: 380, width: 700, height: 40 },
      { x: 0, y: 0, width: 40, height: 420 },
      { x: 660, y: 0, width: 40, height: 160 },
      { x: 660, y: 260, width: 40, height: 160 },
      { x: 180, y: 110, width: 140, height: 50 },
      { x: 180, y: 260, width: 140, height: 50 },
    ],
    objects: [
      {
        id: 'phys_journal_lever',
        x: 210,
        y: 60,
        width: 32,
        height: 32,
        type: 'journal',
        label: 'Jurnal Bu Rani (Hal 14: HTML & CSS)',
        journalPageId: 2,
      },
      {
        id: 'phys_puzzle_cabinet',
        x: 400,
        y: 140,
        width: 54,
        height: 110,
        type: 'puzzle',
        label: 'Konsol Terminal Kode Tombol Web',
        description: 'Tombol aktivasi pintu gerbang web rusak. Tag penutup hilang dan warna belum disetel.',
        conceptualLayerText: 'DOM Inspector: Tag <button> belum ditutup. Butuh tag </button> dan CSS bg-green.',
        solved: false,
      },
      {
        id: 'phys_puzzle_trolley',
        x: 500,
        y: 60,
        width: 54,
        height: 40,
        type: 'puzzle',
        label: 'Terminal Hyperlink & Image Web',
        description: 'Tautkan link navigasi portal sekolah <a href="..."> dan tag gambar <img alt="..."> untuk memulihkan proyektor lab!',
        conceptualLayerText: 'Hypertext Markup: Tag <a href="..."> dan <img src="..." alt="...">.',
        solved: false,
      },
      {
        id: 'web_flexbox_terminal',
        x: 500,
        y: 290,
        width: 54,
        height: 48,
        type: 'puzzle',
        label: 'Konsol Tata Letak CSS Flexbox',
        description: 'Kartu login web sekolah miring dan rusak di pojok monitor. Pusatkan dengan CSS Flexbox!',
        conceptualLayerText: 'CSS Layout: display: flex; justify-content: center; align-items: center;',
        solved: false,
      },
      {
        id: 'phys_battery',
        x: 130,
        y: 330,
        width: 24,
        height: 24,
        type: 'battery',
        label: 'Baterai Senter',
      },
      {
        id: 'phys_door_back',
        x: 50,
        y: 160,
        width: 36,
        height: 100,
        type: 'door',
        label: 'Pintu Kembali ke Koridor Utama',
        description: 'Kembali ke koridor utama sayap lab RPL.',
        requiresShard: false,
      },
      {
        id: 'phys_door_exit',
        x: 640,
        y: 160,
        width: 40,
        height: 100,
        type: 'door',
        label: 'Pintu Lanjut ke Lab Algoritma (If-Else)',
        description: 'Pintu gerbang otomatis menuju Lab Algoritma. Wajib menyelesaikan SEMUA 3 teka-teki Lab Web (Tombol HTML/CSS, Link/Img, dan Flexbox).',
        requiresShard: false,
        conceptualLayerText: 'Koneksi Relai Pintu: Wajib menyelesaikan SEMUA 3 teka-teki web.',
      }
    ],
    puzzleTitle: 'Perbaiki Tombol Web (HTML & CSS)',
    puzzleDescription: 'Tutup tag <button> dengan benar, lalu pilih warna CSS hijau agar tombol pintu web bisa diklik!',
  },
  {
    id: 2,
    name: 'Lab Algoritma & Percabangan (If / Else)',
    subject: 'kimia',
    description: 'Ruang ujian algoritma. Sistem pintu gerbang terkunci oleh logika script percabangan IF-ELSE yang menunggu masukan kartu valid.',
    ghost: {
      name: 'HANTU IF-ELSE',
      room: 'Lab Algoritma',
      misconception: '"Komputer bisa membaca pikiran kita! Tidak perlu menulis kondisi if (kartu == VALID), pintu pasti terbuka sendiri!"',
      clarification: 'Percabangan logika membutuhkan evaluasi kondisi boolean yang bernilai True agar blok if dapat dieksekusi.',
      steps: 0,
      isDissolved: false,
      x: 580,
      y: 180,
    },
    bounds: { width: 700, height: 420 },
    playerSpawn: { x: 80, y: 210 },
    walls: [
      { x: 0, y: 0, width: 700, height: 40 },
      { x: 0, y: 380, width: 700, height: 40 },
      { x: 0, y: 0, width: 40, height: 420 },
      { x: 660, y: 0, width: 40, height: 160 },
      { x: 660, y: 260, width: 40, height: 160 },
      { x: 220, y: 90, width: 120, height: 60 },
      { x: 220, y: 270, width: 120, height: 60 },
    ],
    objects: [
      {
        id: 'chem_journal_ph',
        x: 140,
        y: 200,
        width: 32,
        height: 32,
        type: 'journal',
        label: 'Jurnal Bu Rani (Hal 20: Percabangan)',
        journalPageId: 4,
      },
      {
        id: 'chem_puzzle_bench',
        x: 400,
        y: 140,
        width: 70,
        height: 120,
        type: 'puzzle',
        label: 'Terminal Autentikasi Scanner If-Else',
        description: 'Terdapat kode if (kartu === "VALID") dan scanner RFID siswa.',
        conceptualLayerText: 'Logic Branch: Evaluasi kondisi IF. Masukkan kartu VALID agar kondisi bernilai TRUE!',
        solved: false,
      },
      {
        id: 'chem_loop_terminal',
        x: 240,
        y: 170,
        width: 50,
        height: 50,
        type: 'puzzle',
        label: 'Terminal Loop Kipas Pendingin Server',
        description: 'Server lab hampir overheat (95°C)! Jalankan loop for (let i = 0; i < 5; i++) untuk memutar kipas 5 kali dan mendinginkan suhu!',
        conceptualLayerText: 'Looping construct: for (let i = 0; i < 5; i++) { fan.spin(); }',
        solved: false,
      },
      {
        id: 'chem_logic_gate',
        x: 480,
        y: 290,
        width: 50,
        height: 48,
        type: 'puzzle',
        label: 'Terminal Gerbang Logika Boolean (&& vs ||)',
        description: 'Tentukan operator logika Boolean untuk sistem alarm kebakaran lab RPL agar tidak terjadi alarm palsu!',
        conceptualLayerText: 'Boolean Algebra: asap === true && panas === true',
        solved: false,
      },
      {
        id: 'chem_battery',
        x: 350,
        y: 60,
        width: 24,
        height: 24,
        type: 'battery',
        label: 'Baterai Senter',
      },
      {
        id: 'chem_door_back',
        x: 50,
        y: 160,
        width: 36,
        height: 100,
        type: 'door',
        label: 'Pintu Kembali ke Lab Web',
        description: 'Kembali ke Lab Pemrograman Web (HTML & CSS).',
        requiresShard: false,
      },
      {
        id: 'chem_door_exit',
        x: 640,
        y: 160,
        width: 40,
        height: 100,
        type: 'door',
        label: 'Pintu Lanjut ke Lab Basis Data (SQL)',
        description: 'Gerbang otomatis menuju Lab Basis Data. Wajib menyelesaikan SEMUA 3 teka-teki Lab Algoritma (Kartu If-Else, Loop Kipas, dan Gerbang Logika).',
        requiresShard: false,
        conceptualLayerText: 'Koneksi Relai Pintu: Wajib menyelesaikan SEMUA 3 teka-teki logika algoritma.',
      }
    ],
    puzzleTitle: 'Autentikasi Kartu Akses If-Else',
    puzzleDescription: 'Pilih status kartu yang VALID agar kondisi IF bernilai TRUE dan membuka kunci pintu!',
  },
  {
    id: 3,
    name: 'Lab Basis Data & SQL',
    subject: 'logika',
    description: 'Ruang server database sekolah. Komputer admin MySQL menampilkan pesan error query data arsip sekolah.',
    ghost: {
      name: 'SI NULL',
      room: 'Lab Basis Data',
      misconception: '"Ambil semua data tanpa filter WHERE! Tidak usah repot menyaring data di database!"',
      clarification: 'Klausa WHERE menyaring data spesifik secara efisien dan aman tanpa membebani server.',
      steps: 0,
      isDissolved: false,
      x: 580,
      y: 200,
    },
    bounds: { width: 700, height: 420 },
    playerSpawn: { x: 80, y: 210 },
    walls: [
      { x: 0, y: 0, width: 700, height: 40 },
      { x: 0, y: 380, width: 700, height: 40 },
      { x: 0, y: 0, width: 40, height: 420 },
      { x: 660, y: 0, width: 40, height: 160 },
      { x: 660, y: 260, width: 40, height: 160 },
      { x: 190, y: 100, width: 100, height: 50 },
      { x: 190, y: 260, width: 100, height: 50 },
      { x: 340, y: 100, width: 100, height: 50 },
      { x: 340, y: 260, width: 100, height: 50 },
    ],
    objects: [
      {
        id: 'comp_journal_bug',
        x: 130,
        y: 190,
        width: 32,
        height: 32,
        type: 'journal',
        label: 'Jurnal Bu Rani (Hal 31: Mantra SQL)',
        journalPageId: 7,
      },
      {
        id: 'comp_puzzle_terminal',
        x: 480,
        y: 140,
        width: 64,
        height: 110,
        type: 'puzzle',
        label: 'Konsol SQL Query Database Arsip',
        description: 'Terminal SQL untuk mencari baris data Shard Kunci RPL di tabel arsip_sekolah.',
        conceptualLayerText: 'SQL Query: SELECT * FROM arsip_lab WHERE nama_barang = \'Shard Kunci RPL\'.',
        solved: false,
      },
      {
        id: 'db_insert_terminal',
        x: 230,
        y: 170,
        width: 50,
        height: 50,
        type: 'puzzle',
        label: 'Terminal SQL INSERT Siswa Baru',
        description: 'Daftarkan siswa baru ke tabel database sekolah menggunakan sintaks SQL INSERT INTO yang valid!',
        conceptualLayerText: 'SQL DML: INSERT INTO siswa (nis, nama, kelas) VALUES (\'1024\', \'Nara\', \'X-RPL-1\');',
        solved: false,
      },
      {
        id: 'db_primary_key_console',
        x: 370,
        y: 170,
        width: 50,
        height: 50,
        type: 'puzzle',
        label: 'Konsol Kunci Unik (PRIMARY KEY)',
        description: 'Tentukan kolom basis data yang memenuhi syarat sebagai PRIMARY KEY tabel siswa!',
        conceptualLayerText: 'Database Constraints: PRIMARY KEY must be unique and NOT NULL.',
        solved: false,
      },
      {
        id: 'comp_battery',
        x: 370,
        y: 60,
        width: 24,
        height: 24,
        type: 'battery',
        label: 'Baterai Senter',
      },
      {
        id: 'comp_door_back',
        x: 50,
        y: 160,
        width: 36,
        height: 100,
        type: 'door',
        label: 'Pintu Kembali ke Lab Algoritma',
        description: 'Kembali ke Lab Algoritma & Percabangan (If-Else).',
        requiresShard: false,
      },
      {
        id: 'comp_door_exit',
        x: 640,
        y: 160,
        width: 40,
        height: 100,
        type: 'door',
        label: 'Pintu Lanjut ke Lab Struktur Data (Array)',
        description: 'Pintu gerbang otomatis menuju Lab Struktur Data. Wajib menyelesaikan SEMUA 3 teka-teki Lab Basis Data (Query SELECT, INSERT INTO, dan PRIMARY KEY).',
        requiresShard: false,
        conceptualLayerText: 'Koneksi Relai Pintu: Wajib menyelesaikan SEMUA 3 teka-teki database.',
      }
    ],
    puzzleTitle: 'Query SQL Mencari Shard Kunci',
    puzzleDescription: 'Susun 3 blok SQL: SELECT + FROM arsip_lab + WHERE nama_barang = \'Shard Kunci RPL\'!',
  },
  {
    id: 4,
    name: 'Lab Struktur Data & Flowchart',
    subject: 'matematika',
    description: 'Ruang perancangan software. Brankas arsip sekolah terlindung oleh sistem kunci array memori dan flowchart alur program.',
    ghost: {
      name: 'NYAI ARRAY',
      room: 'Lab Struktur Data',
      misconception: '"Elemen pertama di dalam pemrograman pasti nomor 1! Komputer menghitung dari 1!"',
      clarification: 'Dalam bahasa pemrograman standar, array selalu menggunakan indeks mulai dari 0 (zero-based indexing: data[0]).',
      steps: 0,
      isDissolved: false,
      x: 580,
      y: 190,
    },
    bounds: { width: 700, height: 420 },
    playerSpawn: { x: 80, y: 210 },
    walls: [
      { x: 0, y: 0, width: 700, height: 40 },
      { x: 0, y: 380, width: 700, height: 40 },
      { x: 0, y: 0, width: 40, height: 420 },
      { x: 660, y: 0, width: 40, height: 160 },
      { x: 660, y: 260, width: 40, height: 160 },
      { x: 190, y: 80, width: 50, height: 100 },
      { x: 190, y: 240, width: 50, height: 100 },
      { x: 320, y: 80, width: 50, height: 100 },
      { x: 320, y: 240, width: 50, height: 100 },
    ],
    objects: [
      {
        id: 'math_journal_stats',
        x: 130,
        y: 190,
        width: 32,
        height: 32,
        type: 'journal',
        label: 'Jurnal Bu Rani (Hal 41: Array & Flowchart)',
        journalPageId: 9,
      },
      {
        id: 'math_puzzle_safe',
        x: 470,
        y: 140,
        width: 70,
        height: 120,
        type: 'puzzle',
        label: 'Brankas Kunci Array & Flowchart',
        description: 'Sistem brankas dengan memori array kata_kunci[0] dan alur flowchart program.',
        conceptualLayerText: 'Memory Array: Indeks pertama adalah [0]. Flowchart: Mulai -> Input -> Proses -> Selesai.',
        solved: false,
      },
      {
        id: 'math_stack_queue',
        x: 250,
        y: 110,
        width: 50,
        height: 50,
        type: 'puzzle',
        label: 'Terminal Stack (LIFO) vs Queue (FIFO)',
        description: 'Pasangkan konsep struktur data: Undo Text Editor (LIFO) dan Antrean Cetak Dokumen (FIFO)!',
        conceptualLayerText: 'Data Structures: Stack = LIFO, Queue = FIFO.',
        solved: false,
      },
      {
        id: 'math_git_terminal',
        x: 250,
        y: 270,
        width: 50,
        height: 50,
        type: 'puzzle',
        label: 'Konsol Version Control Git',
        description: 'Susun 3 tahap commit Git: Staging (git add), Local Repo (git commit), dan Cloud (git push)!',
        conceptualLayerText: 'Git Workflow: git add . -> git commit -m -> git push origin main',
        solved: false,
      },
      {
        id: 'math_battery',
        x: 400,
        y: 60,
        width: 24,
        height: 24,
        type: 'battery',
        label: 'Baterai Senter',
      },
      {
        id: 'math_door_back',
        x: 50,
        y: 160,
        width: 36,
        height: 100,
        type: 'door',
        label: 'Pintu Kembali ke Lab Basis Data',
        description: 'Kembali ke Lab Basis Data & SQL.',
        requiresShard: false,
      },
      {
        id: 'math_door_exit',
        x: 640,
        y: 160,
        width: 40,
        height: 100,
        type: 'door',
        label: 'Pintu Masuk ke Aula Sidang GALAT',
        description: 'Membuka akses ke Aula Sidang GALAT setelah SEMUA 3 teka-teki Struktur Data selesai dan 4 Serpihan Arsip lengkap.',
        requiresShard: false,
        conceptualLayerText: 'Koneksi Relai Pintu: Wajib menyelesaikan SEMUA 3 teka-teki & mengumpulkan 4 Serpihan Arsip.',
      }
    ],
    puzzleTitle: 'Indeks Array 0 & Flowchart Program',
    puzzleDescription: 'Pilih elemen pertama kata_kunci[0] dan susun alur Flowchart program untuk membuka brankas arsip!',
  },
  {
    id: 5,
    name: 'Aula Sidang GALAT (Bug Master RPL)',
    subject: 'boss',
    description: 'Ruangan aula megah yang remang-remang. Bayangan raksasa GALAT melayang di panggung sidang menguji nalar coding anak RPL.',
    bounds: { width: 700, height: 440 },
    playerSpawn: { x: 350, y: 350 },
    walls: [
      { x: 0, y: 0, width: 700, height: 40 },
      { x: 0, y: 400, width: 700, height: 40 },
      { x: 0, y: 0, width: 40, height: 440 },
      { x: 660, y: 0, width: 40, height: 440 },
    ],
    objects: [
      {
        id: 'boss_door_back',
        x: 320,
        y: 395,
        width: 60,
        height: 30,
        type: 'door',
        label: 'Pintu Kembali ke Koridor Lab',
        description: 'Kembali ke koridor utama sayap lab RPL.',
      },
      {
        id: 'boss_board',
        x: 270,
        y: 70,
        width: 160,
        height: 100,
        type: 'puzzle',
        label: 'Papan Tulis Sidang Nalar GALAT',
        description: 'Papan tulis hitam besar tempat menyusun argumen dan membantah 4 mitos salah kaprah coding anak RPL.',
        conceptualLayerText: 'Fundamental RPL: Tag HTML Berpasangan + Logika If-Else + Query SQL WHERE + Indeks Array 0.',
        solved: false,
      }
    ],
    puzzleTitle: 'Sidang Nalar Coding Melawan GALAT',
    puzzleDescription: 'Gunakan seluruh pemahaman coding RPL yang kamu pelajari untuk membantah mitos dan membebaskan sekolah!',
  }
];

export const BIP_HINTS: Record<number, string[]> = {
  0: [
    'BIP: "Tekan saklar breaker di panel daya untuk mengalirkan listrik ke pintu gerbang koridor!"'
  ],
  1: [
    'BIP: "Tag HTML harus berpasangan: tag <button> harus ditutup dengan </button>! Lalu pilih warna hijau agar tombol siap diklik!"'
  ],
  2: [
    'BIP: "Logika percabangan if-else sangat mudah! Pilih status kartu yang \'VALID\' agar kondisi IF bernilai TRUE dan pintu terbuka!"'
  ],
  3: [
    'BIP: "Query SQL: Gunakan SELECT * FROM arsip_lab WHERE nama_barang = \'Shard Kunci RPL\' untuk menemukan kunci di baris database!"'
  ],
  4: [
    'BIP: "Ingat prinsip anak RPL: Indeks array selalu dimulai dari angka 0, jadi huruf pertama ada di kata_kunci[0]! Lalu jalankan Flowchart dari Mulai hingga Selesai!"'
  ],
  5: [
    'BIP: "Sidang GALAT! Pasang bukti nalar coding anak RPL ke tiap tuduhan sesat GALAT. Buktikan kita paham logika di balik kode!"'
  ]
};

// Returns a deep clone of the rooms so game state can be reset cleanly
export const getFreshRooms = (): RoomDef[] => JSON.parse(JSON.stringify(INITIAL_ROOMS));
