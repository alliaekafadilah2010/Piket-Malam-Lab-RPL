import React, { useState } from 'react';
import { 
  ShieldAlert, 
  RotateCcw, 
  Share2, 
  Home, 
  Heart, 
  Award, 
  Check, 
  Copy 
} from 'lucide-react';

interface GameOverModalProps {
  currentRoomName: string;
  archiveShardsCount: number;
  solvedPuzzlesCount: number;
  totalPuzzlesCount: number;
  onRevive: () => void;
  onRestart: () => void;
  onReturnToTitle: () => void;
  onShare: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  currentRoomName,
  archiveShardsCount,
  solvedPuzzlesCount,
  totalPuzzlesCount,
  onRevive,
  onRestart,
  onReturnToTitle,
  onShare,
}) => {
  const [copied, setCopied] = useState(false);

  const handleShareClick = () => {
    onShare();
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#0E1326] text-[#EDE6D6] rounded-2xl border-2 border-[#E85D75] shadow-[0_0_30px_rgba(232,93,117,0.4)] overflow-hidden">
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-[#2d1219] via-[#1a1429] to-[#0E1326] p-5 border-b border-[#E85D75]/40 flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-[#E85D75]/20 border border-[#E85D75]/60">
            <ShieldAlert className="w-7 h-7 text-[#E85D75] animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-pixel-heading font-bold text-[#E85D75] tracking-wide">
              FOKUS NARA TERKIKIS HABIS
            </h2>
            <p className="text-xs text-gray-400">
              Kondisi Kalah: Akumulasi Galat & Miskonsepsi Coding
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 text-xs sm:text-sm">
          <p className="text-gray-300 leading-relaxed bg-[#16213E]/70 p-3.5 rounded-xl border border-gray-700/60">
            Pikiran Nara kewalahan menghadapi rentetan galat logika pemrograman di tengah kegelapan lab SMK RPL. Sentermu padam sejenak dan bayangan bug menguasai ruangan.
          </p>

          {/* Stats Box */}
          <div className="grid grid-cols-3 gap-2 py-1">
            <div className="bg-[#16213E] p-3 rounded-xl border border-gray-700 text-center">
              <span className="text-[10px] text-gray-400 block mb-0.5">Lokasi Terakhir</span>
              <span className="text-xs font-semibold text-[#EDE6D6] truncate block" title={currentRoomName}>
                {currentRoomName}
              </span>
            </div>
            <div className="bg-[#16213E] p-3 rounded-xl border border-gray-700 text-center">
              <span className="text-[10px] text-gray-400 block mb-0.5">Teka-Teki Selesai</span>
              <span className="text-sm font-mono font-bold text-[#5FE1B0]">
                {solvedPuzzlesCount} / {totalPuzzlesCount}
              </span>
            </div>
            <div className="bg-[#16213E] p-3 rounded-xl border border-gray-700 text-center">
              <span className="text-[10px] text-gray-400 block mb-0.5">Serpihan Arsip</span>
              <span className="text-sm font-mono font-bold text-[#F2C14E]">
                {archiveShardsCount} / 4
              </span>
            </div>
          </div>

          <div className="text-[11px] text-[#F2C14E] bg-[#F2C14E]/10 p-2.5 rounded-lg border border-[#F2C14E]/30 flex items-center space-x-2">
            <Heart className="w-4 h-4 text-[#E85D75] fill-[#E85D75] flex-shrink-0" />
            <span>
              Tip: Buka <strong>Jurnal Bu Rani [J]</strong> atau aktifkan <strong>Lensa Nalar [Shift]</strong> sebelum memilih kode untuk menghindari terkaman hantu bug!
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-[#12192f] p-4 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <button
              onClick={onReturnToTitle}
              className="flex-1 sm:flex-initial flex items-center justify-center space-x-1 px-3 py-2 bg-[#16213E] hover:bg-[#1f2c52] text-gray-300 rounded-lg text-xs font-semibold border border-gray-700 transition-colors"
              title="Kembali ke Menu Awal"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Menu</span>
            </button>
            <button
              onClick={handleShareClick}
              className="flex-1 sm:flex-initial flex items-center justify-center space-x-1 px-3 py-2 bg-[#16213E] hover:bg-[#1f2c52] text-[#F2C14E] rounded-lg text-xs font-semibold border border-[#F2C14E]/40 transition-colors"
              title="Bagikan Tautan Game"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#5FE1B0]" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? 'Tersalin!' : 'Bagikan Link'}</span>
            </button>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <button
              onClick={onRestart}
              className="flex-1 sm:flex-initial flex items-center justify-center space-x-1 px-3.5 py-2 bg-[#2d1219] hover:bg-[#3f1823] text-[#E85D75] rounded-lg text-xs font-bold border border-[#E85D75]/60 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restart Awal</span>
            </button>
            <button
              onClick={onRevive}
              className="flex-1 sm:flex-initial flex items-center justify-center space-x-1 px-4 py-2 bg-[#5FE1B0] hover:bg-[#7ff3c6] text-[#0B1026] rounded-lg text-xs font-extrabold shadow-[0_0_12px_rgba(95,225,176,0.4)] transition-all transform hover:scale-105"
            >
              <Heart className="w-3.5 h-3.5 fill-current" />
              <span>Bangkit Lagi</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
