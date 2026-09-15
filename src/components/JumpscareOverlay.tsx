/**
 * Jumpscare Overlay Component
 * Triggers a terrifying, sudden visual and auditory glitch jumpscare
 * when player's focus (hearts) reaches 0 before showing Game Over.
 */

import React, { useEffect, useState, useRef } from 'react';
import { sounds } from '../utils/sound';
import { Skull, AlertOctagon, Terminal, ArrowRight } from 'lucide-react';

interface JumpscareOverlayProps {
  ghostName?: string;
  onFinished: () => void;
}

export const JumpscareOverlay: React.FC<JumpscareOverlayProps> = ({
  ghostName = 'MISKONSEPSI FATAL',
  onFinished,
}) => {
  const [flashColor, setFlashColor] = useState<'red' | 'black' | 'white' | 'inverted'>('red');
  const [glitchTextIndex, setGlitchTextIndex] = useState(0);
  const onFinishedRef = useRef(onFinished);
  const isFinishedRef = useRef(false);

  // Keep ref up to date without triggering effects
  useEffect(() => {
    onFinishedRef.current = onFinished;
  }, [onFinished]);

  const glitchLines = [
    '0x000000FF: EXCEPTION_ACCESS_VIOLATION',
    'GALAT FATAL: ENTITAS MENERKAM FOKUSMU!',
    'NULL POINTER DEREFERENCE IN SOUL.EXE',
    'STACK OVERFLOW: KESALAHAN LOGIKA TAK TERBENDUNG',
    'MISKONSEPSI MENGUASAI LAB KOMPUTER!',
  ];

  const handleFinish = () => {
    if (isFinishedRef.current) return;
    isFinishedRef.current = true;
    onFinishedRef.current();
  };

  useEffect(() => {
    // Play jumpscare horror sound
    sounds.playJumpscare();

    // Fast strobe/glitch effect
    const strobeInterval = setInterval(() => {
      setFlashColor((prev) => {
        if (prev === 'red') return 'black';
        if (prev === 'black') return 'inverted';
        if (prev === 'inverted') return 'white';
        return 'red';
      });
      setGlitchTextIndex((prev) => (prev + 1) % 5);
    }, 65);

    // Guaranteed auto transition to Game Over after 2 seconds
    const timer = setTimeout(() => {
      clearInterval(strobeInterval);
      handleFinish();
    }, 2000);

    return () => {
      clearInterval(strobeInterval);
      clearTimeout(timer);
    };
  }, []); // Run ONCE on mount, NEVER reset by re-renders!

  return (
    <div
      onClick={handleFinish}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center select-none cursor-pointer transition-colors duration-75 overflow-hidden ${
        flashColor === 'red'
          ? 'bg-[#8B0000]'
          : flashColor === 'black'
          ? 'bg-black'
          : flashColor === 'white'
          ? 'bg-white text-black'
          : 'bg-[#1a0505] text-red-500'
      }`}
      style={{
        animation: 'jumpscareShake 0.08s infinite alternate',
      }}
    >
      <style>{`
        @keyframes jumpscareShake {
          0% { transform: translate(-8px, 6px) scale(1.04) rotate(-1deg); }
          50% { transform: translate(7px, -9px) scale(1.07) rotate(1.5deg); }
          100% { transform: translate(-6px, -5px) scale(1.02) rotate(-0.5deg); }
        }
        @keyframes glitchSlice {
          0% { clip-path: inset(10% 0 30% 0); }
          30% { clip-path: inset(40% 0 10% 0); }
          70% { clip-path: inset(20% 0 60% 0); }
          100% { clip-path: inset(0 0 0 0); }
        }
      `}</style>

      {/* CRT Scanline Noise Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.6)_50%)] bg-[length:100%_4px] opacity-75" />

      {/* Terrifying Shadow Face Graphic */}
      <div className="relative z-10 flex flex-col items-center justify-center space-y-4 max-w-lg px-4 text-center">
        {/* Glowing Demonic Entity SVG / Icon */}
        <div className="relative w-64 h-64 flex items-center justify-center">
          {/* Blood aura */}
          <div className="absolute inset-0 bg-red-600/60 rounded-full blur-3xl animate-pulse" />

          {/* Creepy SVG Entity with Glowing Red Eyes and Jagged Teeth */}
          <svg
            viewBox="0 0 200 200"
            className="w-56 h-56 text-red-500 drop-shadow-[0_0_25px_rgba(255,0,0,0.9)] transform scale-110"
          >
            {/* Ghostly Silhouette */}
            <path
              d="M100 20 C50 20 20 60 20 120 C20 170 40 190 60 170 C80 150 90 180 100 170 C110 180 120 150 140 170 C160 190 180 170 180 120 C180 60 150 20 100 20 Z"
              fill="#0a0000"
              stroke="#ff1a1a"
              strokeWidth="5"
            />
            {/* Bleeding Hollow Eyes */}
            <ellipse cx="65" cy="85" rx="16" ry="24" fill="#ff0000" />
            <circle cx="65" cy="88" r="7" fill="#ffffff" />
            <ellipse cx="135" cy="85" rx="16" ry="24" fill="#ff0000" />
            <circle cx="135" cy="88" r="7" fill="#ffffff" />

            {/* Screaming Jagged Maw */}
            <path
              d="M50 135 Q100 120 150 135 Q140 165 100 170 Q60 165 50 135 Z"
              fill="#2b0000"
              stroke="#ff3333"
              strokeWidth="4"
            />
            {/* Sharp Teeth */}
            <polygon points="65,135 73,148 81,135" fill="#ffffff" />
            <polygon points="85,135 93,150 101,135" fill="#ffffff" />
            <polygon points="105,135 113,150 121,135" fill="#ffffff" />
            <polygon points="125,135 133,148 141,135" fill="#ffffff" />
            <polygon points="75,160 83,146 91,160" fill="#ffffff" />
            <polygon points="105,160 113,146 121,160" fill="#ffffff" />
          </svg>
        </div>

        {/* Glitch Screaming Text */}
        <div className="space-y-1">
          <h1
            className="text-4xl sm:text-5xl font-extrabold tracking-widest text-red-500 uppercase drop-shadow-[0_0_15px_#ff0000]"
            style={{ fontFamily: 'monospace' }}
          >
            TERKAMAN {ghostName}!
          </h1>
          <p className="text-xl sm:text-2xl font-black text-white tracking-wider bg-black/80 px-3 py-1 rounded inline-block border border-red-500">
            FOKUS NARA HANCUR LEBUR!
          </p>
        </div>

        {/* Code Glitch Logs */}
        <div className="w-full bg-black/90 border border-red-600/70 p-2.5 rounded font-mono text-xs text-red-400 space-y-0.5 text-left shadow-2xl">
          <div className="flex items-center space-x-1.5 text-red-500 font-bold border-b border-red-800 pb-1">
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>CRITICAL FAULT: KORIDOR LAB RPL DIKUNCI</span>
          </div>
          <div className="text-[11px] truncate text-red-300">
            &gt; {glitchLines[glitchTextIndex]}
          </div>
          <div className="text-[10px] text-gray-400">
            &gt; MEMORI LOGIKA TERPAPAR KESALAHAN SINTAKS. ENTITAS BERHASIL MEMANGSA KESADARAN.
          </div>
        </div>

        <div className="pt-3 flex flex-col items-center space-y-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleFinish();
            }}
            className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white font-mono font-bold text-xs uppercase tracking-widest rounded-lg border border-red-400 shadow-[0_0_20px_rgba(255,0,0,0.8)] transition-all flex items-center space-x-2 animate-pulse"
          >
            <span>Buka Rapor Kegagalan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <div className="text-[11px] text-gray-300 font-mono">
            [ Otomatis berpindah atau klik di mana saja ]
          </div>
        </div>
      </div>
    </div>
  );
};
