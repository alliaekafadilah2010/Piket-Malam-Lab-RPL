/**
 * BIP Assistant Dialog
 * CRT terminal from 2009 serving as hints system and comic relief guide.
 * Requesting hints deducts battery and impacts score.
 */

import React, { useState } from 'react';
import { X, Terminal, Cpu, AlertTriangle, HelpCircle } from 'lucide-react';
import { sounds } from '../utils/sound';

interface BipDialogProps {
  roomId: number;
  roomName: string;
  hints: string[];
  battery: number;
  onRequestHint: () => void;
  onClose: () => void;
}

export const BipDialog: React.FC<BipDialogProps> = ({
  roomId,
  roomName,
  hints,
  battery,
  onRequestHint,
  onClose,
}) => {
  const [hintCount, setHintCount] = useState(0);

  const handleAskHint = () => {
    if (battery < 15) return;
    sounds.playBipBlip(1);
    setHintCount((prev) => Math.min(prev + 1, hints.length));
    onRequestHint();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3">
      <div className="relative w-full max-w-xl bg-[#09151c] text-[#5FE1B0] rounded-xl border-2 border-[#5FE1B0] shadow-[0_0_25px_rgba(95,225,176,0.3)] overflow-hidden flex flex-col crt-screen font-mono">
        {/* Terminal Header */}
        <div className="bg-[#0e272a] px-4 py-2 flex items-center justify-between border-b border-[#5FE1B0]/40">
          <div className="flex items-center space-x-2">
            <Cpu className="w-5 h-5 text-[#5FE1B0] animate-pulse" />
            <span className="text-xs font-bold tracking-wider text-[#EDE6D6]">
              SERVER SISTEM ARSIP BIP-2009 [v1.4b-SMK]
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1"
            title="Tutup Terminal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Terminal Screen Body */}
        <div className="p-5 flex-1 space-y-4 text-xs leading-relaxed max-h-[60vh] overflow-y-auto">
          {/* Status Display */}
          <div className="border border-[#5FE1B0]/30 p-2.5 rounded bg-[#061014] text-[11px]">
            <div className="flex justify-between text-gray-400 mb-1">
              <span>STATUS UNIT: TERHUBUNG KORIDOR</span>
              <span className="text-[#F2C14E]">LOKASI: {roomName}</span>
            </div>
            <div className="text-gray-300">
              MEMORI RAM: 512MB [KORUP 42%] · TRANSMISI: SPEKTRUM SUARA INTERKOM
            </div>
          </div>

          {/* BIP Face / Animated Speaker ASCII */}
          <div className="flex items-center space-x-4 bg-[#08181f] p-3 rounded border border-[#5FE1B0]/40">
            <div className="w-14 h-14 bg-black border border-[#5FE1B0] rounded flex flex-col items-center justify-center text-center text-lg font-bold text-[#5FE1B0] shadow-[inset_0_0_8px_#5FE1B0]">
              <span>[◉_◉]</span>
              <span className="text-[8px] tracking-widest text-[#F2C14E]">BIP-09</span>
            </div>
            <div className="flex-1 text-[11px] text-gray-300">
              <span className="text-[#5FE1B0] font-bold">BIP:</span> "N-Nara... sinyalku di ruangan ini terputus-putus. Tapi kalau kamu butuh kalkulasi nalar, aku bisa menguras baterai ponselmu untuk petunjuk. Ingat, berpikir sendiri itu gratis... bertanya padaku ada biayanya!"
            </div>
          </div>

          {/* Hints Displayed */}
          {hintCount > 0 ? (
            <div className="space-y-2">
              <div className="text-xs font-bold text-[#F2C14E] flex items-center gap-1">
                <HelpCircle className="w-4 h-4" /> Petunjuk Terbuka:
              </div>
              {hints.slice(0, hintCount).map((hint, idx) => (
                <div key={idx} className="p-3 bg-[#0d2328] border-l-4 border-[#5FE1B0] rounded text-[12px] text-[#EDE6D6]">
                  {hint}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500 italic text-[11px]">
              Belum ada petunjuk yang diminta untuk ruangan ini.
            </div>
          )}

          {/* Hint Warning */}
          <div className="bg-[#1f1618] border border-[#E85D75]/40 p-2.5 rounded text-[11px] text-[#E85D75] flex items-start space-x-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <div>
              <strong>Perhatian:</strong> Tiap permintaan petunjuk menyedot <strong>15% Baterai</strong> dan mengurangi bonus skor akhir (penalti petunjuk).
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="bg-[#0e272a] px-4 py-3 border-t border-[#5FE1B0]/40 flex items-center justify-between">
          <span className="text-[11px] text-gray-400">
            Sisa Baterai: <strong className={battery < 15 ? 'text-red-400' : 'text-[#F2C14E]'}>{Math.round(battery)}%</strong>
          </span>

          <button
            onClick={handleAskHint}
            disabled={battery < 15 || hintCount >= hints.length}
            className="flex items-center space-x-2 px-4 py-2 bg-[#5FE1B0] text-[#0B1026] font-bold rounded text-xs hover:bg-[#7ff3c6] transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-[0_0_12px_rgba(95,225,176,0.4)]"
          >
            <Terminal className="w-4 h-4" />
            <span>
              {hintCount >= hints.length ? 'Semua Petunjuk Terbuka' : 'Minta Petunjuk BIP (-15% Bat)'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
