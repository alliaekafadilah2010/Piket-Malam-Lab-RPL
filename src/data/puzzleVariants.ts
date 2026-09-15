/**
 * Puzzle Variants Configuration
 * Provides dynamic, randomized question variations for all 14 coding puzzles in Piket Malam: Lab RPL.
 */

export interface RouterVariant {
  name: string;
  targetIp: string;
  targetSubnet: string;
  targetPort: string;
  description: string;
  ipOptions: string[];
  subnetOptions: string[];
  portOptions: string[];
}

export interface HtmlCssVariant {
  elementName: string;
  openTag: string;
  correctCloseTag: string;
  closeTagOptions: string[];
  cssProperty: string;
  correctCssValue: string;
  cssOptions: { label: string; value: string }[];
  description: string;
}

export interface HyperlinkImageVariant {
  scenarioTitle: string;
  description: string;
  correctAnchorAttr: string;
  anchorOptions: { id: string; label: string; code: string }[];
  correctMediaAttr: string;
  mediaOptions: { id: string; label: string; code: string }[];
}

export interface FlexboxVariant {
  goalTitle: string;
  description: string;
  targetJustify: string;
  targetAlign: string;
  expectedLabel: string;
}

export interface IfElseVariant {
  scenarioTitle: string;
  codeSnippet: string;
  correctCard: string;
  correctReason: string;
  wrongReason: string;
  cardOptions: { id: string; label: string; role: string; valid: boolean }[];
}

export interface LoopVariant {
  title: string;
  startTemp: number;
  coolPerStep: number;
  requiredSteps: number;
  safeTemp: number;
  loopCode: string;
}

export interface LogicGateVariant {
  title: string;
  description: string;
  inputA: string;
  inputB: string;
  correctOperator: 'AND' | 'OR';
  explanation: string;
}

export interface SqlSelectVariant {
  targetDesc: string;
  tableName: string;
  correctCondition: string;
  whereOptions: { id: string; label: string; clause: string }[];
  hint: string;
}

export interface SqlInsertVariant {
  targetDesc: string;
  tableName: string;
  correctInsertQuery: string;
  queryOptions: { id: string; query: string; isCorrect: boolean; reason: string }[];
}

export interface PrimaryKeyVariant {
  tableDesc: string;
  tableName: string;
  correctKey: string;
  fields: { id: string; name: string; type: string; isUnique: boolean; description: string }[];
  explanation: string;
}

export interface ArrayVariant {
  arrayVarName: string;
  items: string[];
  targetElementIndex: number; // 0-based
  expectedCode: string;
  indexOptions: string[];
  flowchartInitial: string[];
  flowchartCorrect: string[];
}

export interface StackQueueVariant {
  scenarioTitle: string;
  case1Title: string;
  case1Desc: string;
  case1Correct: 'STACK' | 'QUEUE';
  case2Title: string;
  case2Desc: string;
  case2Correct: 'STACK' | 'QUEUE';
}

export interface GitVariant {
  workflowTitle: string;
  description: string;
  steps: {
    step1: { correct: string; options: { id: string; cmd: string }[] };
    step2: { correct: string; options: { id: string; cmd: string }[] };
    step3: { correct: string; options: { id: string; cmd: string }[] };
  };
}

// 1. Router IP Variants
export const ROUTER_VARIANTS: RouterVariant[] = [
  {
    name: 'Gateway Lokal Lab Komputer 1',
    targetIp: '192.168.1.1',
    targetSubnet: '255.255.255.0',
    targetPort: '80',
    description: 'Konfigurasikan gateway LAN lokal kelas C (/24) untuk mengaktifkan akses web server lokal koridor lab.',
    ipOptions: ['192.168.1.1 (Gateway LAN)', '127.0.0.1 (Loopback/Localhost)', '0.0.0.0 (Unspecified)', '255.255.255.255 (Broadcast)'],
    subnetOptions: ['255.255.255.0 (/24 Default Lab)', '255.0.0.0 (/8 Kelas A)', '255.255.0.0 (/16 Kelas B)'],
    portOptions: ['80 (HTTP Web)', '21 (FTP File)', '22 (SSH Remote)', '443 (HTTPS)']
  },
  {
    name: 'Gateway Database Server Sekolah',
    targetIp: '10.0.0.1',
    targetSubnet: '255.0.0.0',
    targetPort: '3306',
    description: 'Konfigurasikan gateway jaringan privat internal kelas A (/8) menuju server basis data MySQL.',
    ipOptions: ['10.0.0.1 (Gateway Intranet)', '127.0.0.1 (Loopback/Localhost)', '192.168.100.254 (Modem Luar)'],
    subnetOptions: ['255.0.0.0 (/8 Kelas A)', '255.255.255.0 (/24 Kelas C)', '255.255.0.0 (/16 Kelas B)'],
    portOptions: ['3306 (MySQL Database)', '80 (HTTP Web)', '25 (SMTP Mail)']
  },
  {
    name: 'Proxy Server Gateway Lab RPL',
    targetIp: '172.16.0.1',
    targetSubnet: '255.255.0.0',
    targetPort: '8080',
    description: 'Konfigurasikan gateway proxy lokal kelas B (/16) untuk membuka filter keamanan jaringan darurat.',
    ipOptions: ['172.16.0.1 (Gateway Proxy)', '169.254.1.1 (APIPA Gagal DHCP)', '192.168.0.254 (Router Rumah)'],
    subnetOptions: ['255.255.0.0 (/16 Kelas B)', '255.255.255.0 (/24 Kelas C)', '255.0.0.0 (/8 Kelas A)'],
    portOptions: ['8080 (Proxy Web Alternatif)', '22 (SSH Console)', '53 (DNS Server)']
  }
];

// 2. HTML / CSS Button & Layout Variants
export const HTML_CSS_VARIANTS: HtmlCssVariant[] = [
  {
    elementName: 'Tombol Aksi Masuk',
    openTag: '<button class="btn-darurat">',
    correctCloseTag: '</button>',
    closeTagOptions: ['</button>', '<button/>', '</div>', '/>'],
    cssProperty: 'background-color',
    correctCssValue: 'green',
    cssOptions: [
      { label: 'background-color: green; (Lampu Indikator Hijau Aman)', value: 'green' },
      { label: 'background-color: red; (Indikator Bahaya Terkunci)', value: 'red' },
      { label: 'display: none; (Sembunyikan Tombol)', value: 'none' }
    ],
    description: 'Elemen <button> membutuhkan tag penutup berpasangan </button> dan warna latar belakang hijau (green) agar sistem membuka solenoid pintu.'
  },
  {
    elementName: 'Judul Utama Gerbang',
    openTag: '<h1 class="header-lab">',
    correctCloseTag: '</h1>',
    closeTagOptions: ['</h1>', '</header>', '</title>', '<h1/>'],
    cssProperty: 'color',
    correctCssValue: '#5FE1B0',
    cssOptions: [
      { label: 'color: #5FE1B0; (Hijau Mint Neon Sistem Aktif)', value: '#5FE1B0' },
      { label: 'color: #000000; (Hitam Gelap Tak Terlihat)', value: 'black' },
      { label: 'font-size: 0px; (Teks Lenyap)', value: '0px' }
    ],
    description: 'Tag judul utama <h1> wajib ditutup dengan </h1> serta menggunakan warna teks neon #5FE1B0 untuk mengaktifkan sensor optik gerbang.'
  },
  {
    elementName: 'Paragraf Kode Status',
    openTag: '<p class="status-teks">',
    correctCloseTag: '</p>',
    closeTagOptions: ['</p>', '</paragraph>', '</span>', '</br>'],
    cssProperty: 'font-weight',
    correctCssValue: 'bold',
    cssOptions: [
      { label: 'font-weight: bold; (Tebal & Tervalidasi)', value: 'bold' },
      { label: 'opacity: 0; (Transparan Hilang)', value: 'transparent' },
      { label: 'visibility: hidden; (Sembunyi)', value: 'hidden' }
    ],
    description: 'Tag paragraf <p> ditutup dengan </p> dan teks ditebalkan (bold) agar kamera OCR pintu dapat membaca kode autentikasi.'
  }
];

// 3. Hyperlink & Image Variants
export const HYPERLINK_MEDIA_VARIANTS: HyperlinkImageVariant[] = [
  {
    scenarioTitle: 'Navigasi Portal Sekolah & Logo SMK',
    description: 'Perbaiki link navigasi dan tag media gambar agar browser merender portal utama dengan tepat.',
    correctAnchorAttr: 'href',
    anchorOptions: [
      { id: 'href', label: '<a href="portal.smk.id">Masuk Portal</a>', code: 'href="portal.smk.id"' },
      { id: 'src', label: '<a src="portal.smk.id">Masuk Portal</a>', code: 'src="portal.smk.id" (Salah: src untuk media)' },
      { id: 'link', label: '<a link="portal.smk.id">Masuk Portal</a>', code: 'link="portal.smk.id" (Salah: atribut tidak valid)' }
    ],
    correctMediaAttr: 'src_alt',
    mediaOptions: [
      { id: 'src_alt', label: '<img src="logo.png" alt="Logo SMK Bhakti Nusantara" />', code: 'src="logo.png" alt="..."' },
      { id: 'href_only', label: '<img href="logo.png" />', code: 'href="logo.png" (Salah: img pakai src)' },
      { id: 'no_alt', label: '<img url="logo.png" />', code: 'url="logo.png" (Salah: url bukan atribut standar img)' }
    ]
  },
  {
    scenarioTitle: 'Link Download Modul & Foto Guru Pembina',
    description: 'Tautkan link berkas panduan modul RPL dan berkas foto Bu Rani untuk memvalidasi arsip.',
    correctAnchorAttr: 'download',
    anchorOptions: [
      { id: 'download', label: '<a href="modul.pdf" download>Unduh Panduan</a>', code: 'href="modul.pdf" download' },
      { id: 'action', label: '<a action="modul.pdf">Unduh Panduan</a>', code: 'action="modul.pdf" (Salah: action untuk <form>)' },
      { id: 'target_self', label: '<a path="modul.pdf">Unduh Panduan</a>', code: 'path="modul.pdf" (Salah)' }
    ],
    correctMediaAttr: 'src_alt',
    mediaOptions: [
      { id: 'src_alt', label: '<img src="bu_rani.jpg" alt="Foto Bu Rani Guru RPL" />', code: 'src="bu_rani.jpg" alt="..."' },
      { id: 'href_only', label: '<img href="bu_rani.jpg" />', code: 'href="bu_rani.jpg" (Salah)' },
      { id: 'no_alt', label: '<img path="bu_rani.jpg" />', code: 'path="bu_rani.jpg" (Salah)' }
    ]
  }
];

// 4. Flexbox Variants
export const FLEXBOX_VARIANTS: FlexboxVariant[] = [
  {
    goalTitle: 'Pusatkan Kartu Login di Tengah Layar',
    description: 'Atur sumbu utama (X) dan sumbu silang (Y) agar kartu dialog autentikasi berada persis di tengah monitor.',
    targetJustify: 'center',
    targetAlign: 'center',
    expectedLabel: 'justify-content: center & align-items: center'
  },
  {
    goalTitle: 'Rentangkan Elemen Navbar dari Ujung ke Ujung',
    description: 'Posisikan logo sekolah di paling kiri dan menu logout di paling kanan dengan jarak maksimal merata.',
    targetJustify: 'space-between',
    targetAlign: 'center',
    expectedLabel: 'justify-content: space-between & align-items: center'
  },
  {
    goalTitle: 'Ratakan Kontrol di Pojok Kanan Bawah',
    description: 'Posisikan tombol eksekusi darurat di sisi kanan (end) dan di bawah kontainer (end).',
    targetJustify: 'flex-end',
    targetAlign: 'flex-end',
    expectedLabel: 'justify-content: flex-end & align-items: flex-end'
  }
];

// 5. If-Else Variants
export const IF_ELSE_VARIANTS: IfElseVariant[] = [
  {
    scenarioTitle: 'Pemeriksaan Kartu RFID Jam Malam',
    codeSnippet: 'if (kartu.status === "VALID" && kartu.role === "KETUA_LAB") {\n  bukaPintu();\n} else {\n  tolakAkses("Akses Ditolak");\n}',
    correctCard: 'VALID',
    correctReason: 'Kartu Berstatus VALID memenuhi kondisi boolean TRUE sehingga blok if dieksekusi.',
    wrongReason: 'Kondisi bernilai FALSE! Eksekusi melompat ke blok else.',
    cardOptions: [
      { id: 'VALID', label: 'Kartu Nara (Ketua Piket Lab)', role: 'KETUA_LAB', valid: true },
      { id: 'EXPIRED', label: 'Kartu Kedaluwarsa Siswa Lain', role: 'SISWA_UMUM', valid: false },
      { id: 'RUSAK', label: 'Kartu Chip Magnet Rusak', role: 'NONE', valid: false }
    ]
  },
  {
    scenarioTitle: 'Validasi Saldo & Izin Cetak Dokumen',
    codeSnippet: 'if (kartu.saldo >= 20000 && kartu.aktif === true) {\n  aktifkanPrinter();\n} else {\n  tolakAkses("Saldo Tidak Cukup / Kartu Nonaktif");\n}',
    correctCard: 'SALDO_CUKUP',
    correctReason: 'Saldo >= 20000 dan status aktif bernilai TRUE. Printer aktif mencetak kode gerbang.',
    wrongReason: 'Kondisi bernilai FALSE, printer menolak memproses dokumen.',
    cardOptions: [
      { id: 'SALDO_CUKUP', label: 'Kartu Saldo Rp 50.000 (Aktif)', role: 'USER_AKTIF', valid: true },
      { id: 'SALDO_KURANG', label: 'Kartu Saldo Rp 5.000 (Kurang)', role: 'USER_AKTIF', valid: false },
      { id: 'NONAKTIF', label: 'Kartu Saldo Rp 100.000 (Terblokir)', role: 'USER_BLOCKED', valid: false }
    ]
  }
];

// 6. For Loop Variants
export const LOOP_VARIANTS: LoopVariant[] = [
  {
    title: 'Pendinginan Suhu Server dari 95°C ke ≤ 40°C',
    startTemp: 95,
    coolPerStep: 14,
    requiredSteps: 5,
    safeTemp: 40,
    loopCode: 'for (let i = 0; i < 5; i++) {\n  kipas.tiup();\n  suhu -= 14;\n}'
  },
  {
    title: 'Pendinginan Darurat Overheat dari 110°C ke ≤ 30°C',
    startTemp: 110,
    coolPerStep: 12,
    requiredSteps: 8,
    safeTemp: 30,
    loopCode: 'for (let i = 0; i < 8; i++) {\n  pompaFreon.alirkan();\n  suhu -= 12;\n}'
  },
  {
    title: 'Penstabil Suhu Cepat dari 80°C ke ≤ 50°C',
    startTemp: 80,
    coolPerStep: 15,
    requiredSteps: 3,
    safeTemp: 50,
    loopCode: 'for (let i = 0; i < 3; i++) {\n  ventilasi.buka();\n  suhu -= 15;\n}'
  }
];

// 7. Boolean Logic Gate Variants
export const LOGIC_GATE_VARIANTS: LogicGateVariant[] = [
  {
    title: 'Sistem Detektor Kebakaran Lab (Sensor Asap & Sensor Suhu Panas)',
    description: 'Untuk mencegah false alarm dari uap solder, sirine hanya boleh meraung jika kedua sensor mendeteksi bahaya bersamaan.',
    inputA: 'Sensor Asap = TRUE',
    inputB: 'Sensor Panas Api = TRUE',
    correctOperator: 'AND',
    explanation: 'Operator AND (&&) bernilai TRUE jika dan hanya jika KEDUA input bernilai TRUE.'
  },
  {
    title: 'Sistem Saklar Lampu Darurat (Saklar Manual ATAU Pemadaman Listrik PLN)',
    description: 'Lampu darurat harus otomatis menyala jika saklar manual ditekan, ATAU jika ada pemadaman listrik total.',
    inputA: 'Saklar Manual Ditekan = TRUE',
    inputB: 'Listrik PLN Mati = FALSE',
    correctOperator: 'OR',
    explanation: 'Operator OR (||) bernilai TRUE jika SALAH SATU atau kedua input bernilai TRUE.'
  }
];

// 8. SQL SELECT Variants
export const SQL_SELECT_VARIANTS: SqlSelectVariant[] = [
  {
    targetDesc: 'Ambil Shard Kunci RPL dari tabel arsip_lab yang berstatus terkunci',
    tableName: 'arsip_lab',
    correctCondition: "WHERE nama_barang = 'Shard Kunci RPL'",
    whereOptions: [
      { id: 'correct', label: "WHERE nama_barang = 'Shard Kunci RPL'", clause: "WHERE nama_barang = 'Shard Kunci RPL'" },
      { id: 'wrong1', label: "WHERE status = 'RUSAK'", clause: "WHERE status = 'RUSAK'" },
      { id: 'wrong2', label: "WHERE id_barang = 999", clause: "WHERE id_barang = 999" }
    ],
    hint: 'Gunakan klausa WHERE nama_barang = ... untuk memfilter baris data spesifik.'
  },
  {
    targetDesc: 'Cari data pengguna administrator berstatus AKTIF dari tabel tb_pengguna',
    tableName: 'tb_pengguna',
    correctCondition: "WHERE role = 'ADMIN' AND status = 'AKTIF'",
    whereOptions: [
      { id: 'correct', label: "WHERE role = 'ADMIN' AND status = 'AKTIF'", clause: "WHERE role = 'ADMIN' AND status = 'AKTIF'" },
      { id: 'wrong1', label: "WHERE status = 'BANNED'", clause: "WHERE status = 'BANNED'" },
      { id: 'wrong2', label: "WHERE role = 'GUEST'", clause: "WHERE role = 'GUEST'" }
    ],
    hint: 'Filter akun administrator yang aktif agar sesi terminal lab dapat dibuka.'
  }
];

// 9. SQL INSERT Variants
export const SQL_INSERT_VARIANTS: SqlInsertVariant[] = [
  {
    targetDesc: 'Daftarkan Siswa Nara ke tabel tb_siswa',
    tableName: 'tb_siswa',
    correctInsertQuery: 'INSERT_CORRECT',
    queryOptions: [
      {
        id: 'INSERT_CORRECT',
        query: "INSERT INTO tb_siswa (nisn, nama, kelas) VALUES ('1024', 'Nara', 'XI RPL 1');",
        isCorrect: true,
        reason: 'Sintaks SQL DML valid: menyebutkan tabel, daftar kolom, dan nilai VALUES.'
      },
      {
        id: 'INSERT_WRONG_SYNTAX',
        query: "ADD NEW ROW TO tb_siswa VALUES ('1024', 'Nara');",
        isCorrect: false,
        reason: 'Bukan perintah standar SQL (gunakan INSERT INTO).'
      },
      {
        id: 'INSERT_UPDATE_MIX',
        query: "UPDATE tb_siswa SET nama = 'Nara' WHERE nisn = '1024';",
        isCorrect: false,
        reason: 'UPDATE untuk mengubah data yang sudah ada, bukan menambah baris baru.'
      }
    ]
  },
  {
    targetDesc: 'Simpan Inventaris Switch Jaringan Baru ke tb_alat',
    tableName: 'tb_alat',
    correctInsertQuery: 'INSERT_CORRECT',
    queryOptions: [
      {
        id: 'INSERT_CORRECT',
        query: "INSERT INTO tb_alat (kode_alat, nama, kondisi) VALUES ('SW-01', 'Switch Cisco 24P', 'BAIK');",
        isCorrect: true,
        reason: 'Sintaks INSERT INTO valid dengan kolom dan nilai yang bersesuaian.'
      },
      {
        id: 'INSERT_WRONG_SYNTAX',
        query: "PUT INTO tb_alat VALUES ('SW-01', 'Switch Cisco 24P');",
        isCorrect: false,
        reason: 'Perintah PUT INTO tidak dikenal dalam SQL RDBMS.'
      },
      {
        id: 'INSERT_UPDATE_MIX',
        query: "SELECT * INTO tb_alat WHERE kode = 'SW-01';",
        isCorrect: false,
        reason: 'Bukan sintaks penambahan data baru.'
      }
    ]
  }
];

// 10. Primary Key Variants
export const PRIMARY_KEY_VARIANTS: PrimaryKeyVariant[] = [
  {
    tableDesc: 'Tabel tb_siswa (Data Pokok Siswa SMK)',
    tableName: 'tb_siswa',
    correctKey: 'nisn',
    fields: [
      { id: 'nisn', name: 'nisn (Nomor Induk Siswa Nasional)', type: 'VARCHAR(10)', isUnique: true, description: 'Unik seluruh Indonesia, tidak boleh null & tidak pernah duplikat.' },
      { id: 'nama', name: 'nama_siswa', type: 'VARCHAR(100)', isUnique: false, description: 'Bisa kembar antar siswa yang berbeda.' },
      { id: 'alamat', name: 'alamat_tinggal', type: 'TEXT', isUnique: false, description: 'Bisa sama jika siswa adalah kakak-beradik dalam satu rumah.' }
    ],
    explanation: 'NISN bersifat unik dan wajib diisi (NOT NULL), menjadikannya kandidat terbaik Primary Key.'
  },
  {
    tableDesc: 'Tabel tb_buku (Katalog Buku Perpustakaan Sekolah)',
    tableName: 'tb_buku',
    correctKey: 'isbn',
    fields: [
      { id: 'isbn', name: 'isbn (International Standard Book Number)', type: 'VARCHAR(13)', isUnique: true, description: 'Kode identifikasi buku unik standar internasional.' },
      { id: 'judul', name: 'judul_buku', type: 'VARCHAR(150)', isUnique: false, description: 'Bisa ada banyak buku dengan judul yang sama (misal: "Pemrograman Web").' },
      { id: 'tahun', name: 'tahun_terbit', type: 'INT', isUnique: false, description: 'Banyak buku terbit pada tahun yang sama.' }
    ],
    explanation: 'ISBN merupakan nomor seri buku unik internasional yang tidak boleh terduplikasi.'
  }
];

// 11. Array 0-Indexed Variants
export const ARRAY_VARIANTS: ArrayVariant[] = [
  {
    arrayVarName: 'bahasa_lab',
    items: ['HTML', 'CSS', 'JavaScript', 'PHP'],
    targetElementIndex: 0,
    expectedCode: 'bahasa_lab[0]',
    indexOptions: ['bahasa_lab[0] (Elemen Pertama)', 'bahasa_lab[1] (Elemen Kedua)', 'bahasa_lab[-1] (Sintaks Tidak Valid)', 'bahasa_lab[4] (Out of Bounds)'],
    flowchartInitial: ['Input Password', 'Mulai (Start)', 'Buka Brankas (Selesai)', 'Cek Validasi'],
    flowchartCorrect: ['Mulai (Start)', 'Input Password', 'Cek Validasi', 'Buka Brankas (Selesai)']
  },
  {
    arrayVarName: 'perangkat_jaringan',
    items: ['Router', 'Switch', 'Server', 'Access Point'],
    targetElementIndex: 0,
    expectedCode: 'perangkat_jaringan[0]',
    indexOptions: ['perangkat_jaringan[0] (Elemen Pertama: Router)', 'perangkat_jaringan[1] (Elemen Kedua: Switch)', 'perangkat_jaringan[3] (Elemen Keempat)'],
    flowchartInitial: ['Eksekusi Perintah', 'Inisialisasi Port', 'Mulai (Start)', 'Koneksi Sukses (Selesai)'],
    flowchartCorrect: ['Mulai (Start)', 'Inisialisasi Port', 'Eksekusi Perintah', 'Koneksi Sukses (Selesai)']
  }
];

// 12. Stack vs Queue Variants
export const STACK_QUEUE_VARIANTS: StackQueueVariant[] = [
  {
    scenarioTitle: 'Analogi Struktur Data Kasus Praktikum RPL',
    case1Title: 'Kasus A: Fitur Undo & Redo di Teks Editor Visual Studio Code',
    case1Desc: 'Ketik huruf -> Tekan Ctrl+Z: perubahan terakhir yang baru saja diketik adalah yang pertama kali dibatalkan (Last In, First Out).',
    case1Correct: 'STACK',
    case2Title: 'Kasus B: Antrean Cetak Berkas Printer Lab (Spooler)',
    case2Desc: 'Siswa pertama yang menekan tombol Print dokumen akan dilayani dan dicetak kertasnya terlebih dahulu (First In, First Out).',
    case2Correct: 'QUEUE'
  },
  {
    scenarioTitle: 'Analogi Riwayat Navigasi & Pelayanan Antrian',
    case1Title: 'Kasus A: Tombol Back pada Browser Internet',
    case1Desc: 'Halaman web yang paling baru kamu kunjungi akan menjadi halaman pertama yang terbuka saat tombol Back diklik (LIFO).',
    case1Correct: 'STACK',
    case2Title: 'Kasus B: Antrian Pembayaran di Kasir Kantin Sekolah',
    case2Desc: 'Siswa yang datang paling awal di depan loket dilayani pertama kali sebelum siswa di belakangnya (FIFO).',
    case2Correct: 'QUEUE'
  }
];

// 13. Git Variants
export const GIT_VARIANTS: GitVariant[] = [
  {
    workflowTitle: 'Siklus Standar Version Control (Staging -> Commit -> Push)',
    description: 'Urutkan perintah Git yang benar dari memasukkan perubahan ke staging, membuat catatan commit, hingga mengirim ke repositori GitHub sekolah.',
    steps: {
      step1: {
        correct: 'add',
        options: [
          { id: 'add', cmd: 'git add . (Masukkan file ke Staging Area)' },
          { id: 'push', cmd: 'git push (Salah: Push dilakukan terakhir)' },
          { id: 'init', cmd: 'git init (Salah: Repositori sudah ada)' }
        ]
      },
      step2: {
        correct: 'commit',
        options: [
          { id: 'commit', cmd: 'git commit -m "Selesaikan proyek lab RPL"' },
          { id: 'clone', cmd: 'git clone (Salah: Digunakan untuk menduplikasi repo)' },
          { id: 'reset', cmd: 'git reset --hard (Salah: Menghapus perubahan)' }
        ]
      },
      step3: {
        correct: 'push',
        options: [
          { id: 'push', cmd: 'git push origin main (Kirim commit ke server remote)' },
          { id: 'pull', cmd: 'git pull (Salah: Menarik dari server)' },
          { id: 'status', cmd: 'git status (Salah: Hanya melihat status)' }
        ]
      }
    }
  }
];
