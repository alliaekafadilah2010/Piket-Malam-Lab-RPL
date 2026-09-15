/**
 * Game Guide & Lore Modal Component
 * Displays comprehensive game details, story synopsis, level requirements,
 * and controls in a dedicated, polished modal separated from the title screen.
 */

import React from 'react';
import { 
  X, 
  Sparkles, 
  AlertTriangle, 
  Gamepad2, 
  Eye, 
  Flashlight, 
  ChevronsUp, 
  Hand, 
  BookOpen, 
  Terminal, 
  ShieldAlert,
  HelpCircle,
  Skull
} from 'lucide-react';
import { sounds } from '../utils/sound';

interface GameGuideModalProps {
  onClose: () => void;
}

export const GameGuideModal: React.FC<GameGuideModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 select-none overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#0B1026] text-[#EDE6D6] rounded-2xl border-2 border-[#5FE1B0]/80 shadow-[0_0_35px_rgba(95,225,176,0.25)] p-5 sm:p-7 space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-800 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-[#16213E] rounded-xl border border-[#5FE1B0]/40 text-[#5FE1B0]">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold font-pixel-heading text-[#F2C14E] tracking-wide">
                Keterangan & Panduan Penyelidikan
              </h2>
              <p className="text-[11px] text-gray-400">
                Piket Malam: Teror Lab RPL SMK Bhakti Nusantara
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sounds.playSwitchClick();
              onClose();
            }}
            className="p-1.5 rounded-lg bg-gray-800/80 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors border border-gray-700"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs leading-relaxed text-gray-300">
          {/* Latar Belakang Cerita */}
          <div className="p-3.5 bg-[#16213E]/90 rounded-xl border border-gray-700/80 space-y-2">
            <h3 className="text-sm font-bold text-[#5FE1B0] flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-[#F2C14E]" />
              <span>Sinopsis Latar Belakang</span>
            </h3>
            <p>
              Pukul 18:04 WIB di Lab Rekayasa Perangkat Lunak Lantai 3 SMK Bhakti Nusantara. Bel pulang sekolah telah usai, namun Nara (siswi kelas 10) harus kembali karena laptop dan flashdisk proyek akhirnya tertinggal.
            </p>
            <p>
              Pintu relai selenoid tiba-tiba mengunci dari luar dan lampu neon padam total. Entitas bayangan yang berkeliaran di dalam lab adalah <strong>Wujud Nyata Miskonsepsi & Bug Coding</strong> yang menumpuk. Kamu menguraikan mereka bukan dengan doa mistis, melainkan dengan <strong>memperbaiki logika kode, struktur tag HTML/CSS, query database, dan indeks array</strong>!
            </p>
          </div>

          {/* Aturan Mutlak: Teka-Teki Wajib Selesai */}
          <div className="p-3.5 bg-gradient-to-r from-amber-950/40 to-slate-900 rounded-xl border border-amber-500/50 space-y-1.5 text-amber-100">
            <h3 className="text-sm font-bold text-[#F2C14E] flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>⭐ Ketentuan Mutlak Pintu Gerbang Lab</span>
            </h3>
            <p className="text-xs text-amber-200/90 leading-relaxed">
              Pintu besi otomatis di ujung lab terkunci rapat oleh sistem proteksi. Kamu <strong>WAJIB menyelesaikan SEMUA teka-teki</strong> yang ada di ruangan tersebut sebelum pintu gerbang terbuka ke ruangan berikutnya! Pantau indikator jumlah teka-teki di bilah navigasi atas (HUD).
            </p>
          </div>

          {/* Peringatan Bahaya Hantu & Efek Layar Merah */}
          <div className="p-3.5 bg-red-950/30 rounded-xl border border-red-500/40 space-y-1.5 text-red-200">
            <h3 className="text-sm font-bold text-red-400 flex items-center space-x-2">
              <Skull className="w-4 h-4 text-red-500" />
              <span>Mekanik Horor: Layar Merah & Pengurangan Fokus</span>
            </h3>
            <p className="text-xs text-red-200/90 leading-relaxed">
              Hantu miskonsepsi kini <strong>bergerak aktif dan berpatroli</strong> di dalam lab. Semakin dekat Nara dengan hantu, <strong>layar akan semakin memerah berdenyut</strong> dan detak jantung berdegup kencang. Jika kamu berada terlalu dekat atau melakukan kesalahan fatal berulang kali, fokus (hati) akan berkurang drastis dan memicu teror jumpscare!
            </p>
          </div>

          {/* Panduan Kontrol & Alat */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Gamepad2 className="w-4 h-4 text-[#5FE1B0]" />
              <span>Peralatan & Kontrol Pemain</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="p-2.5 bg-gray-900/80 rounded-xl border border-gray-800 flex items-start space-x-2.5">
                <div className="p-1.5 rounded-lg bg-[#5FE1B0]/20 text-[#5FE1B0]">
                  <Eye className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-white">Lensa Nalar [Shift / Layar]</div>
                  <div className="text-[11px] text-gray-400">Melihat lapisan konsep kode tersembunyi, logika IF, dan struktur tag.</div>
                </div>
              </div>

              <div className="p-2.5 bg-gray-900/80 rounded-xl border border-gray-800 flex items-start space-x-2.5">
                <div className="p-1.5 rounded-lg bg-[#F2C14E]/20 text-[#F2C14E]">
                  <Flashlight className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-white">Senter [F / Layar]</div>
                  <div className="text-[11px] text-gray-400">Menerangi sudut gelap lab. Baterai dapat diisi dengan baterai AA di meja.</div>
                </div>
              </div>

              <div className="p-2.5 bg-gray-900/80 rounded-xl border border-gray-800 flex items-start space-x-2.5">
                <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400">
                  <ChevronsUp className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-white">Loncat [Spasi / Layar]</div>
                  <div className="text-[11px] text-gray-400">Karakter Nara dapat melompat untuk menghindari bahaya atau bergerak lincah.</div>
                </div>
              </div>

              <div className="p-2.5 bg-gray-900/80 rounded-xl border border-gray-800 flex items-start space-x-2.5">
                <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                  <Hand className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-white">Aksi Interaksi [E / Layar]</div>
                  <div className="text-[11px] text-gray-400">Memeriksa komputer, memecahkan teka-teki, dan membuka pintu lab.</div>
                </div>
              </div>

              <div className="p-2.5 bg-gray-900/80 rounded-xl border border-gray-800 flex items-start space-x-2.5">
                <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-white">Jurnal Bu Rani [J / Layar]</div>
                  <div className="text-[11px] text-gray-400">Catatan sakti guru produktif berisi kunci pemahaman materi coding RPL.</div>
                </div>
              </div>

              <div className="p-2.5 bg-gray-900/80 rounded-xl border border-gray-800 flex items-start space-x-2.5">
                <div className="p-1.5 rounded-lg bg-sky-500/20 text-sky-300">
                  <Terminal className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-white">Asisten BIP-2009 [H / Layar]</div>
                  <div className="text-[11px] text-gray-400">Meminta bantuan petunjuk kode (mengurangi 15% baterai senter).</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-3 border-t border-gray-800">
          <button
            onClick={() => {
              sounds.playSwitchClick();
              onClose();
            }}
            className="px-6 py-2.5 bg-[#5FE1B0] hover:bg-[#7ff3c6] text-[#0B1026] font-extrabold text-xs sm:text-sm rounded-xl shadow-[0_0_15px_rgba(95,225,176,0.3)] transition-all"
          >
            Tutup & Kembali
          </button>
        </div>
      </div>
    </div>
  );
};
