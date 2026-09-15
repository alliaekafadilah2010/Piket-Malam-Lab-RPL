/**
 * Journal Viewer Component
 * Renders Bu Rani's handwritten notebook with lined pages, teacher sketches,
 * sticky notes, and humorous marginalia.
 */

import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Bookmark, Sparkles } from 'lucide-react';
import { JournalPage } from '../types/game';
import { sounds } from '../utils/sound';

interface JournalViewerProps {
  pages: JournalPage[];
  unlockedPageIds: number[];
  onClose: () => void;
}

export const JournalViewer: React.FC<JournalViewerProps> = ({
  pages,
  unlockedPageIds,
  onClose,
}) => {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  const availablePages = pages.filter((p) => unlockedPageIds.includes(p.id));
  const activePage = availablePages[currentPageIndex] || pages[0];

  const handleNext = () => {
    if (currentPageIndex < availablePages.length - 1) {
      sounds.playPageTurn();
      setCurrentPageIndex(currentPageIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentPageIndex > 0) {
      sounds.playPageTurn();
      setCurrentPageIndex(currentPageIndex - 1);
    }
  };

  const renderSketch = (type?: string) => {
    switch (type) {
      case 'html_tag':
        return (
          <div className="my-3 p-3 bg-amber-50/90 rounded-xl border border-amber-300 font-mono text-xs text-amber-950">
            <div className="text-[11px] font-bold text-amber-900 mb-1.5 flex items-center gap-1 font-sans">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              Sketsa Bu Rani: Struktur Tag Berpasangan HTML
            </div>
            <div className="bg-slate-900 text-slate-100 p-3 rounded-lg text-xs leading-relaxed space-y-1">
              <div><span className="text-rose-400">&lt;button</span> <span className="text-amber-300">id=</span><span className="text-emerald-300">"btn-pintu"</span><span className="text-rose-400">&gt;</span> <span className="text-white font-sans">Buka Pintu</span> <span className="text-emerald-400 font-bold">&lt;/button&gt;</span> ✅</div>
              <div className="text-[11px] text-slate-400 font-sans mt-2 pt-2 border-t border-slate-800">
                ⚠️ Jika tag penutup <span className="text-rose-400 font-mono">&lt;/button&gt;</span> lupa ditulis, browser akan menganggap seluruh teks setelahnya adalah bagian dari tombol!
              </div>
            </div>
          </div>
        );
      case 'if_else':
        return (
          <div className="my-3 p-3 bg-amber-50/90 rounded-xl border border-amber-300 font-mono text-xs text-amber-950">
            <div className="text-[11px] font-bold text-amber-900 mb-1.5 flex items-center gap-1 font-sans">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              Sketsa Bu Rani: Alur Percabangan Logika IF ... ELSE
            </div>
            <div className="bg-slate-900 text-slate-200 p-3 rounded-lg text-[11px] leading-relaxed">
              <span className="text-purple-400 font-bold">if</span> (kartu === <span className="text-emerald-300">"VALID"</span>) &#123;<br />
              &nbsp;&nbsp;<span className="text-emerald-400 font-bold font-sans">✓ Kondisi TRUE ➔ Pintu Terbuka!</span><br />
              &#125; <span className="text-purple-400 font-bold">else</span> &#123;<br />
              &nbsp;&nbsp;<span className="text-rose-400 font-bold font-sans">✗ Kondisi FALSE ➔ Pintu Tetap Terkunci!</span><br />
              &#125;
            </div>
          </div>
        );
      case 'sql_query':
        return (
          <div className="my-3 p-3 bg-amber-50/90 rounded-xl border border-amber-300 font-mono text-xs text-amber-950">
            <div className="text-[11px] font-bold text-amber-900 mb-1.5 flex items-center gap-1 font-sans">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              Sketsa Bu Rani: Anatomi Query SQL Presisi
            </div>
            <div className="bg-slate-900 text-slate-100 p-3 rounded-lg text-xs leading-relaxed">
              <span className="text-purple-400 font-bold">SELECT</span> * <br />
              <span className="text-blue-400 font-bold">FROM</span> arsip_lab <br />
              <span className="text-amber-400 font-bold">WHERE</span> nama_barang = <span className="text-emerald-300">'Shard Kunci RPL'</span>;
              <div className="text-[10px] text-slate-400 font-sans mt-2 pt-1.5 border-t border-slate-800">
                💡 Klausa WHERE bertindak sebagai filter penyaring data target.
              </div>
            </div>
          </div>
        );
      case 'array_zero':
        return (
          <div className="my-3 p-3 bg-amber-50/90 rounded-xl border border-amber-300 font-sans text-xs text-amber-950">
            <div className="text-[11px] font-bold text-amber-900 mb-1.5 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              Sketsa Bu Rani: Indeks Array Berbasis 0 (Zero-Indexed)
            </div>
            <div className="grid grid-cols-4 gap-1.5 text-center font-mono text-xs my-2">
              <div className="p-2 bg-emerald-100 border-2 border-emerald-600 rounded">
                <div className="text-[10px] text-emerald-800 font-bold">Indeks [0]</div>
                <div className="text-sm font-black text-emerald-950">"R"</div>
              </div>
              <div className="p-2 bg-amber-100 border border-amber-300 rounded">
                <div className="text-[10px] text-amber-800">Indeks [1]</div>
                <div className="text-sm font-bold text-amber-950">"P"</div>
              </div>
              <div className="p-2 bg-amber-100 border border-amber-300 rounded">
                <div className="text-[10px] text-amber-800">Indeks [2]</div>
                <div className="text-sm font-bold text-amber-950">"L"</div>
              </div>
              <div className="p-2 bg-amber-100 border border-amber-300 rounded">
                <div className="text-[10px] text-amber-800">Indeks [3]</div>
                <div className="text-sm font-bold text-amber-950">"!"</div>
              </div>
            </div>
            <div className="text-[10px] text-amber-900 italic">
              *Ingat: Di komputer, elemen urutan pertama selalu diambil dengan indeks [0]!
            </div>
          </div>
        );
      case 'flexbox':
        return (
          <div className="my-3 p-3 bg-amber-50/90 rounded-xl border border-amber-300 font-mono text-xs text-amber-950">
            <div className="text-[11px] font-bold text-amber-900 mb-1.5 flex items-center gap-1 font-sans">
              <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
              Sketsa Bu Rani: CSS Flexbox Perfect Centering
            </div>
            <div className="bg-slate-900 text-slate-100 p-3 rounded-lg text-xs leading-relaxed space-y-1">
              <div className="text-cyan-400 font-bold font-sans">.wadah-login &#123;</div>
              <div className="pl-3 text-emerald-300">display: flex;</div>
              <div className="pl-3 text-amber-300">justify-content: center; <span className="text-slate-400 font-sans text-[10px]">/* Sumbu horizontal (X) */</span></div>
              <div className="pl-3 text-rose-300">align-items: center; <span className="text-slate-400 font-sans text-[10px]">/* Sumbu vertikal (Y) */</span></div>
              <div className="text-cyan-400 font-bold font-sans">&#125;</div>
            </div>
          </div>
        );
      case 'loop':
        return (
          <div className="my-3 p-3 bg-amber-50/90 rounded-xl border border-amber-300 font-mono text-xs text-amber-950">
            <div className="text-[11px] font-bold text-amber-900 mb-1.5 flex items-center gap-1 font-sans">
              <Sparkles className="w-3.5 h-3.5 text-orange-600" />
              Sketsa Bu Rani: Siklus Putaran For Loop
            </div>
            <div className="bg-slate-900 text-slate-100 p-3 rounded-lg text-xs leading-relaxed">
              <div className="text-amber-300 font-bold">for (<span className="text-sky-300">let i = 0</span>; <span className="text-emerald-300">i &lt; 5</span>; <span className="text-rose-300">i++</span>) &#123;</div>
              <div className="pl-3 text-white">putarKipasServer();</div>
              <div className="text-amber-300 font-bold">&#125;</div>
              <div className="mt-2 text-[10px] text-slate-300 font-sans border-t border-slate-700 pt-1.5">
                Iterasi: i=0 (ke-1), i=1 (ke-2), i=2 (ke-3), i=3 (ke-4), i=4 (ke-5) ➔ Total 5 kali putaran pas!
              </div>
            </div>
          </div>
        );
      case 'boolean_gate':
        return (
          <div className="my-3 p-3 bg-amber-50/90 rounded-xl border border-amber-300 font-mono text-xs text-amber-950">
            <div className="text-[11px] font-bold text-amber-900 mb-1.5 flex items-center gap-1 font-sans">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              Sketsa Bu Rani: Logika AND (&&) vs OR (||)
            </div>
            <div className="bg-slate-900 text-slate-100 p-3 rounded-lg text-[11px] space-y-1">
              <div><span className="text-indigo-400 font-bold">AND (&&):</span> TRUE hanya jika KEDUA syarat terpenuhi!</div>
              <div className="text-[10px] text-emerald-400 pl-2">asap === true && panas === true ➔ ALARM BUNYI!</div>
              <div className="pt-1"><span className="text-amber-400 font-bold">OR (||):</span> TRUE jika SALAH SATU sudah cukup.</div>
            </div>
          </div>
        );
      case 'primary_key':
        return (
          <div className="my-3 p-3 bg-amber-50/90 rounded-xl border border-amber-300 font-sans text-xs text-amber-950">
            <div className="text-[11px] font-bold text-amber-900 mb-1.5 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              Sketsa Bu Rani: 2 Aturan Emas PRIMARY KEY
            </div>
            <div className="grid grid-cols-2 gap-2 text-center text-xs my-1">
              <div className="p-2 bg-purple-100 border border-purple-300 rounded-lg">
                <div className="font-bold text-purple-900">1. WAJIB UNIK</div>
                <div className="text-[10px] text-purple-800">Tidak boleh ada nilai yang sama persis (misal NISN).</div>
              </div>
              <div className="p-2 bg-rose-100 border border-rose-300 rounded-lg">
                <div className="font-bold text-rose-900">2. NOT NULL</div>
                <div className="text-[10px] text-rose-800">Tidak boleh dibiarkan kosong sama sekali!</div>
              </div>
            </div>
          </div>
        );
      case 'stack_queue':
        return (
          <div className="my-3 p-3 bg-amber-50/90 rounded-xl border border-amber-300 font-sans text-xs text-amber-950">
            <div className="text-[11px] font-bold text-amber-900 mb-1.5 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              Sketsa Bu Rani: Stack (LIFO) vs Queue (FIFO)
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 bg-blue-50 border border-blue-300 rounded-lg">
                <div className="font-bold text-blue-900">STACK (LIFO)</div>
                <div className="text-[10px] text-blue-800">Last In, First Out (Tumpukan piring / Ctrl+Z Undo).</div>
              </div>
              <div className="p-2 bg-emerald-50 border border-emerald-300 rounded-lg">
                <div className="font-bold text-emerald-900">QUEUE (FIFO)</div>
                <div className="text-[10px] text-emerald-800">First In, First Out (Antrean kasir / Printer Lab).</div>
              </div>
            </div>
          </div>
        );
      case 'git':
        return (
          <div className="my-3 p-3 bg-amber-50/90 rounded-xl border border-amber-300 font-mono text-xs text-amber-950">
            <div className="text-[11px] font-bold text-amber-900 mb-1.5 flex items-center gap-1 font-sans">
              <Sparkles className="w-3.5 h-3.5 text-rose-600" />
              Sketsa Bu Rani: 3 Langkah Wajib Git
            </div>
            <div className="bg-slate-900 text-slate-100 p-2.5 rounded-lg space-y-1 text-xs">
              <div><span className="text-emerald-400">1. git add .</span> ➔ Simpan ke Staging</div>
              <div><span className="text-amber-300">2. git commit -m "..."</span> ➔ Catat ke Riwayat Lokal</div>
              <div><span className="text-sky-300">3. git push origin main</span> ➔ Upload ke GitHub</div>
            </div>
          </div>
        );
      case 'lever':
        return (
          <div className="my-3 p-3 bg-amber-50/80 rounded border border-amber-300 font-sans text-xs text-amber-950">
            <div className="text-[11px] font-bold text-amber-900 mb-1 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              Sketsa Bu Rani: Diagram Momen Gaya (Torsi)
            </div>
            <svg viewBox="0 0 300 80" className="w-full h-20 bg-amber-100/50 rounded">
              {/* Ground */}
              <line x1="20" y1="65" x2="280" y2="65" stroke="#78350f" strokeWidth="2" strokeDasharray="4 2" />
              {/* Fulcrum / Titik Tumpu */}
              <polygon points="100,65 90,45 110,45" fill="#d97706" stroke="#78350f" />
              {/* Lever bar */}
              <line x1="40" y1="43" x2="260" y2="43" stroke="#92400e" strokeWidth="6" strokeLinecap="round" />
              {/* Load (Lemari) */}
              <rect x="35" y="15" width="30" height="28" fill="#b45309" rx="2" />
              <text x="50" y="32" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="bold">200kg</text>
              {/* Effort arrow */}
              <line x1="250" y1="15" x2="250" y2="38" stroke="#15803d" strokeWidth="3" markerEnd="url(#arrow)" />
              <text x="250" y="12" textAnchor="middle" fill="#15803d" fontSize="9" fontWeight="bold">F (Dorongan Nara)</text>
              {/* Labels */}
              <text x="70" y="58" textAnchor="middle" fill="#78350f" fontSize="8">Lengan Beban (d1)</text>
              <text x="180" y="58" textAnchor="middle" fill="#15803d" fontSize="8">Lengan Kuasa (d2: Semakin panjang, makin ringan!)</text>
            </svg>
          </div>
        );
      case 'ph_scale':
        return (
          <div className="my-3 p-3 bg-amber-50/80 rounded border border-amber-300 font-sans text-xs text-amber-950">
            <div className="text-[11px] font-bold text-amber-900 mb-1 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              Sketsa Bu Rani: Warna Ekstrak Kubis Ungu vs Skala pH
            </div>
            <div className="w-full h-8 rounded flex overflow-hidden border border-gray-400 my-1 text-[9px] font-bold text-white text-center items-center shadow-inner">
              <div className="bg-red-600 h-full flex-1 flex items-center justify-center">pH 1 Merah</div>
              <div className="bg-pink-500 h-full flex-1 flex items-center justify-center">pH 3 Pink</div>
              <div className="bg-purple-600 h-full flex-1 flex items-center justify-center ring-2 ring-yellow-400">pH 7 Ungu (Netral)</div>
              <div className="bg-teal-600 h-full flex-1 flex items-center justify-center">pH 9 Biru</div>
              <div className="bg-yellow-400 text-black h-full flex-1 flex items-center justify-center">pH 13 Kuning</div>
            </div>
            <div className="text-[10px] text-amber-900 italic mt-1">
              *Catatan: Basa kuat (pH 13) di sebelah kanan sama bahayanya dengan asam pekat di sebelah kiri!
            </div>
          </div>
        );
      case 'loop_bug':
        return (
          <div className="my-3 p-3 bg-emerald-50/90 rounded border border-emerald-300 font-mono text-xs text-emerald-950">
            <div className="text-[11px] font-bold text-emerald-900 mb-1 font-sans">
              Sketsa Bu Rani: Jebakan Off-By-One Array
            </div>
            <div className="bg-emerald-950 text-emerald-300 p-2 rounded text-[11px] leading-relaxed">
              <span className="text-red-400 line-through">for (let i = 0; i &lt;= 4; i++)</span> ❌ 5 putaran (indeks 4 tak ada!)<br />
              <span className="text-emerald-400 font-bold">for (let i = 0; i &lt; 4; i++)</span> ✅ 4 putaran tepat (indeks 0, 1, 2, 3)
            </div>
          </div>
        );
      case 'spectrum':
        return (
          <div className="my-3 p-3 bg-amber-50/80 rounded border border-amber-300 font-sans text-xs text-amber-950">
            <div className="text-[11px] font-bold text-amber-900 mb-1 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              Sketsa Bu Rani: Penguraian Spektrum Cahaya Prisma Kaca
            </div>
            {/* Visual Prism SVG */}
            <svg viewBox="0 0 320 85" className="w-full h-20 bg-slate-900 rounded p-1">
              {/* Incident White Light */}
              <line x1="10" y1="50" x2="110" y2="45" stroke="#FFFFFF" strokeWidth="3" />
              <text x="40" y="38" fill="#E2E8F0" fontSize="9" fontWeight="bold">Sinar Putih</text>
              {/* Glass Prism */}
              <polygon points="110,70 145,15 180,70" fill="rgba(148, 163, 184, 0.35)" stroke="#94A3B8" strokeWidth="2" />
              <text x="145" y="55" textAnchor="middle" fill="#CBD5E1" fontSize="8">Prisma</text>
              {/* Dispersed Spectrum Rays */}
              <line x1="165" y1="42" x2="300" y2="20" stroke="#EF4444" strokeWidth="3" />
              <text x="305" y="23" fill="#EF4444" fontSize="8" fontWeight="bold">Merah</text>
              
              <line x1="165" y1="44" x2="300" y2="38" stroke="#EAB308" strokeWidth="3" />
              <text x="305" y="41" fill="#EAB308" fontSize="8" fontWeight="bold">Kuning</text>

              <line x1="165" y1="46" x2="300" y2="56" stroke="#22C55E" strokeWidth="3" />
              <text x="305" y="59" fill="#22C55E" fontSize="8" fontWeight="bold">Hijau</text>

              <line x1="165" y1="48" x2="300" y2="74" stroke="#3B82F6" strokeWidth="3" />
              <text x="305" y="77" fill="#3B82F6" fontSize="8" fontWeight="bold">Biru</text>
            </svg>
            <div className="bg-amber-100 p-2 rounded text-[11px] text-amber-900 mt-2">
              Urutan panjang gelombang dari terpanjang ke terpendek:<br />
              <strong>[Merah] ➔ [Kuning] ➔ [Hijau] ➔ [Biru]</strong><br />
              <span className="text-xs text-amber-800 italic">Susun ke-4 buku arsip sesuai urutan pelangi ini untuk membuka sensor brankas!</span>
            </div>
          </div>
        );
      case 'bell_curve':
        return (
          <div className="my-3 p-3 bg-amber-50/80 rounded border border-amber-300 font-sans text-xs text-amber-950">
            <div className="text-[11px] font-bold text-amber-900 mb-1 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              Sketsa Bu Rani: Bahaya Pencilan (Outlier) pada Rata-Rata
            </div>
            <div className="bg-amber-100 p-2 rounded text-[11px] text-amber-900">
              Data peminjaman buku: [3, 4, 3, 5, 4, 3, 4, 3, 2, 4, <strong className="text-red-600 underline">999</strong>]<br />
              Rata-rata: <strong>94 buku</strong> (tidak masuk akal!)<br />
              Modus sejati: <strong>3 buku</strong> (paling sering muncul di grafik frekuensi).
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3">
      <div className="relative w-full max-w-2xl bg-[#EDE6D6] text-[#2c2416] rounded-xl shadow-2xl border-4 border-[#b59d79] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Binder Header */}
        <div className="bg-[#5c4028] text-amber-100 px-4 py-2.5 flex items-center justify-between shadow-md">
          <div className="flex items-center space-x-2">
            <Bookmark className="w-5 h-5 text-[#F2C14E]" />
            <h2 className="font-bold text-sm tracking-wide">JURNAL GURU FISIKA - BU RANI</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-white/20 text-amber-200 hover:text-white transition-colors"
            title="Tutup Jurnal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lined Notebook Paper Body */}
        <div 
          className="flex-1 p-5 sm:p-7 overflow-y-auto font-journal text-lg sm:text-xl leading-relaxed text-[#2c2416]"
          style={{
            backgroundImage: 'repeating-linear-gradient(#EDE6D6, #EDE6D6 28px, #d4cbb8 29px, #d4cbb8 30px)',
            backgroundPosition: '0 8px',
          }}
        >
          {activePage ? (
            <div>
              <div className="flex justify-between items-baseline border-b-2 border-red-400 pb-1 mb-3">
                <h3 className="font-bold text-2xl text-[#7a2e1d]">{activePage.title}</h3>
                <span className="text-xs font-mono uppercase px-2 py-0.5 bg-[#5c4028]/10 rounded border border-[#5c4028]/30">
                  Subjek: {activePage.subject}
                </span>
              </div>

              {/* Main handwritten content */}
              <div className="whitespace-pre-line my-2">
                {activePage.content}
              </div>

              {/* Teacher's sketch if applicable */}
              {renderSketch(activePage.sketchType)}

              {/* Humorous / Encouraging Teacher Marginalia */}
              <div className="mt-4 p-2 bg-yellow-200/60 rotate-[-1deg] border-l-4 border-amber-600 rounded text-base text-amber-950 font-sans italic">
                {activePage.authorNote}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500 font-sans">
              Belum ada lembar jurnal yang ditemukan. Telusuri koridor dan ruangan sekolah!
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="bg-[#dfd5c1] px-4 py-3 border-t border-[#b59d79] flex items-center justify-between text-xs font-sans">
          <button
            onClick={handlePrev}
            disabled={currentPageIndex === 0}
            className="flex items-center space-x-1 px-3 py-1.5 rounded bg-[#5c4028] text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#7a5535] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Sebelumnya</span>
          </button>

          <span className="font-bold text-gray-700 font-mono">
            Halaman {currentPageIndex + 1} dari {availablePages.length} ({pages.length} Total Tersedia)
          </span>

          <button
            onClick={handleNext}
            disabled={currentPageIndex >= availablePages.length - 1}
            className="flex items-center space-x-1 px-3 py-1.5 rounded bg-[#5c4028] text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#7a5535] transition-colors"
          >
            <span>Selanjutnya</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
