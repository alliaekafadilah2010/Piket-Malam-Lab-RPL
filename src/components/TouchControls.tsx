/**
 * Touch Controls & Action Bar Component
 * Virtual D-Pad / Thumbstick and quick action buttons for all devices,
 * designed to remain visible and responsive in full-screen and windowed modes.
 */

import React, { useState } from 'react';
import { Eye, Flashlight, Hand, BookOpen, Terminal, Gamepad2, ChevronsUp } from 'lucide-react';

interface TouchControlsProps {
  onMoveStart: (dir: 'up' | 'down' | 'left' | 'right') => void;
  onMoveEnd: () => void;
  onInteract: () => void;
  onToggleLensa: () => void;
  onToggleSenter: () => void;
  onOpenJournal: () => void;
  onOpenBip?: () => void;
  onJump?: () => void;
  isLensaActive: boolean;
  isSenterOn: boolean;
  canInteract: boolean;
}

export const TouchControls: React.FC<TouchControlsProps> = ({
  onMoveStart,
  onMoveEnd,
  onInteract,
  onToggleLensa,
  onToggleSenter,
  onOpenJournal,
  onOpenBip,
  onJump,
  isLensaActive,
  isSenterOn,
  canInteract,
}) => {
  const [showDpad, setShowDpad] = useState(true);

  return (
    <div className="fixed bottom-0 left-0 right-0 p-1.5 sm:p-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] flex justify-between items-end pointer-events-none z-40 select-none max-w-full">
      {/* Virtual D-Pad (Left side) */}
      <div className="pointer-events-auto flex flex-col items-start space-y-1 flex-shrink-0">
        {showDpad && (
          <div className="w-24 h-24 sm:w-32 sm:h-32 relative bg-black/75 rounded-full border border-gray-700/90 backdrop-blur-md p-1 shadow-2xl">
            {/* Up */}
            <button
              onTouchStart={() => onMoveStart('up')}
              onTouchEnd={onMoveEnd}
              onMouseDown={() => onMoveStart('up')}
              onMouseUp={onMoveEnd}
              className="absolute top-1 left-7.5 sm:left-11 w-8 h-8 sm:w-10 sm:h-10 bg-gray-800/95 active:bg-[#5FE1B0]/60 hover:bg-gray-700 rounded-t-lg flex items-center justify-center text-gray-200 text-xs sm:text-sm shadow"
              aria-label="Atas"
            >
              ▲
            </button>
            {/* Down */}
            <button
              onTouchStart={() => onMoveStart('down')}
              onTouchEnd={onMoveEnd}
              onMouseDown={() => onMoveStart('down')}
              onMouseUp={onMoveEnd}
              className="absolute bottom-1 left-7.5 sm:left-11 w-8 h-8 sm:w-10 sm:h-10 bg-gray-800/95 active:bg-[#5FE1B0]/60 hover:bg-gray-700 rounded-b-lg flex items-center justify-center text-gray-200 text-xs sm:text-sm shadow"
              aria-label="Bawah"
            >
              ▼
            </button>
            {/* Left */}
            <button
              onTouchStart={() => onMoveStart('left')}
              onTouchEnd={onMoveEnd}
              onMouseDown={() => onMoveStart('left')}
              onMouseUp={onMoveEnd}
              className="absolute top-7.5 sm:top-11 left-1 w-8 h-8 sm:w-10 sm:h-10 bg-gray-800/95 active:bg-[#5FE1B0]/60 hover:bg-gray-700 rounded-l-lg flex items-center justify-center text-gray-200 text-xs sm:text-sm shadow"
              aria-label="Kiri"
            >
              ◀
            </button>
            {/* Right */}
            <button
              onTouchStart={() => onMoveStart('right')}
              onTouchEnd={onMoveEnd}
              onMouseDown={() => onMoveStart('right')}
              onMouseUp={onMoveEnd}
              className="absolute top-7.5 sm:top-11 right-1 w-8 h-8 sm:w-10 sm:h-10 bg-gray-800/95 active:bg-[#5FE1B0]/60 hover:bg-gray-700 rounded-r-lg flex items-center justify-center text-gray-200 text-xs sm:text-sm shadow"
              aria-label="Kanan"
            >
              ▶
            </button>
            {/* Center hub */}
            <div className="absolute top-7.5 sm:top-11 left-7.5 sm:left-11 w-8 h-8 sm:w-10 sm:h-10 bg-gray-900 rounded-full border border-gray-700 pointer-events-none flex items-center justify-center">
              <span className="text-[7px] sm:text-[8px] text-gray-500 font-mono">WASD</span>
            </div>
          </div>
        )}

        {/* D-Pad Toggle Button */}
        <button
          onClick={() => setShowDpad((v) => !v)}
          className="px-2 py-0.5 rounded-full bg-black/70 hover:bg-black/95 border border-gray-700/80 text-[9px] sm:text-[10px] text-gray-300 hover:text-white flex items-center space-x-1 backdrop-blur-sm transition-colors shadow"
          title={showDpad ? 'Sembunyikan D-Pad Layar' : 'Tampilkan D-Pad Layar'}
        >
          <Gamepad2 className="w-3 h-3 text-[#5FE1B0]" />
          <span>{showDpad ? 'Tutup D-Pad' : 'Buka D-Pad'}</span>
        </button>
      </div>

      {/* Visual Action Buttons Toolbar (Always visible in Fullscreen & Windowed) */}
      <div className="pointer-events-auto flex items-end space-x-1 sm:space-x-2 bg-black/80 p-1 sm:p-2 rounded-2xl border border-gray-700/90 backdrop-blur-md shadow-2xl max-w-[calc(100vw-120px)] sm:max-w-none overflow-x-auto">
        {/* Lensa Nalar [Shift] */}
        <button
          onClick={onToggleLensa}
          className={`flex-shrink-0 px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl border flex flex-col items-center justify-center transition-all active:scale-95 ${
            isLensaActive
              ? 'bg-[#5FE1B0] border-white text-black ring-2 ring-[#5FE1B0] shadow-[0_0_12px_rgba(95,225,176,0.6)] font-bold'
              : 'bg-gray-800/95 hover:bg-gray-700 border-gray-600 text-gray-300'
          }`}
          title="Lensa Nalar (Shift)"
        >
          <Eye className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5" />
          <span className="text-[8px] sm:text-[10px] font-semibold mt-0.5 leading-none">Lensa</span>
          <span className="text-[7px] sm:text-[8px] opacity-70 font-mono leading-none mt-0.5 hidden sm:inline">[Shift]</span>
        </button>

        {/* Senter [F] */}
        <button
          onClick={onToggleSenter}
          className={`flex-shrink-0 px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl border flex flex-col items-center justify-center transition-all active:scale-95 ${
            isSenterOn
              ? 'bg-[#F2C14E] border-white text-black ring-2 ring-[#F2C14E]/60 shadow-[0_0_12px_rgba(242,193,78,0.5)] font-bold'
              : 'bg-gray-800/95 hover:bg-gray-700 border-gray-600 text-gray-400'
          }`}
          title="Senter (F)"
        >
          <Flashlight className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5" />
          <span className="text-[8px] sm:text-[10px] font-semibold mt-0.5 leading-none">Senter</span>
          <span className="text-[7px] sm:text-[8px] opacity-70 font-mono leading-none mt-0.5 hidden sm:inline">[F]</span>
        </button>

        {/* Jurnal Bu Rani [J] */}
        <button
          onClick={onOpenJournal}
          className="flex-shrink-0 px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-[#4a2e19] hover:bg-[#5c3c23] border border-amber-400/70 text-amber-100 flex flex-col items-center justify-center transition-all active:scale-95 shadow-md"
          title="Buka Jurnal Bu Rani (J)"
        >
          <BookOpen className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 text-amber-300" />
          <span className="text-[8px] sm:text-[10px] font-semibold mt-0.5 leading-none">Jurnal</span>
          <span className="text-[7px] sm:text-[8px] opacity-70 font-mono leading-none mt-0.5 hidden sm:inline">[J]</span>
        </button>

        {/* Server BIP [H] */}
        {onOpenBip && (
          <button
            onClick={onOpenBip}
            className="flex-shrink-0 px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-[#132338] hover:bg-[#1b314f] border border-sky-400/60 text-sky-200 flex flex-col items-center justify-center transition-all active:scale-95 shadow-md"
            title="Terminal Server BIP-2009 (H)"
          >
            <Terminal className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 text-sky-300" />
            <span className="text-[8px] sm:text-[10px] font-semibold mt-0.5 leading-none">BIP</span>
            <span className="text-[7px] sm:text-[8px] opacity-70 font-mono leading-none mt-0.5 hidden sm:inline">[H]</span>
          </button>
        )}

        {/* Loncat [Spasi] */}
        {onJump && (
          <button
            onClick={onJump}
            className="flex-shrink-0 px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-purple-950/90 hover:bg-purple-900 border border-purple-400/70 text-purple-200 flex flex-col items-center justify-center transition-all active:scale-95 shadow-md"
            title="Loncat Karakter (Spasi)"
          >
            <ChevronsUp className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 text-purple-300" />
            <span className="text-[8px] sm:text-[10px] font-semibold mt-0.5 leading-none">Loncat</span>
            <span className="text-[7px] sm:text-[8px] opacity-70 font-mono leading-none mt-0.5 hidden sm:inline">[Spasi]</span>
          </button>
        )}

        {/* Action Button: Interact [E] (Prominent) */}
        <button
          onClick={onInteract}
          className={`flex-shrink-0 px-3 sm:px-5 py-1.5 sm:py-2 rounded-xl border-2 flex flex-col items-center justify-center font-black transition-all active:scale-95 shadow-xl ${
            canInteract
              ? 'bg-[#F2C14E] border-white text-black ring-4 ring-[#F2C14E]/50 shadow-[0_0_18px_rgba(242,193,78,0.8)] animate-pulse'
              : 'bg-gray-800/90 border-gray-600 text-gray-400 hover:bg-gray-700 hover:text-gray-200'
          }`}
          title="Interaksi dengan Objek di Dekatmu (E)"
        >
          <Hand className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
          <span className="text-[9px] sm:text-xs font-bold leading-none mt-0.5">AKSI</span>
          <span className="text-[7px] sm:text-[8px] opacity-80 font-mono leading-none mt-0.5">[E]</span>
        </button>
      </div>
    </div>
  );
};

