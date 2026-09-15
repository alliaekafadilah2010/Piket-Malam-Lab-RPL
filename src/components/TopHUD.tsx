/**
 * Top HUD component for Piket Malam
 * Displays battery, focus hearts, flashlight state, Lensa Nalar status,
 * shards collected, and quick action shortcuts.
 */

import React, { useState } from 'react';
import { 
  Zap, 
  Heart, 
  Eye, 
  Flashlight, 
  BookOpen, 
  Terminal, 
  Volume2, 
  VolumeX, 
  Award,
  Compass,
  Lock,
  CheckCircle2,
  RotateCcw,
  Share2,
  Home,
  Check,
  Music,
  AlertTriangle,
  Skull,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { PlayerState } from '../types/game';

interface TopHUDProps {
  playerState: PlayerState;
  onToggleFlashlight: () => void;
  onToggleLensaNalar: () => void;
  onOpenJournal: () => void;
  onOpenBip: () => void;
  onToggleMute: () => void;
  isMuted: boolean;
  isBgmActive?: boolean;
  onToggleBgm?: () => void;
  isGhostNear?: boolean;
  currentRoomName: string;
  roomList: {
    id: number;
    name: string;
    isUnlocked: boolean;
    solvedPuzzles: number;
    totalPuzzles: number;
  }[];
  onSelectRoom: (id: number) => void;
  hasUnreadJournal: boolean;
  currentRoomPuzzlesSolved: number;
  currentRoomPuzzlesTotal: number;
  onRestart?: () => void;
  onShare?: () => void;
  onReturnToTitle?: () => void;
}

export const TopHUD: React.FC<TopHUDProps> = ({
  playerState,
  onToggleFlashlight,
  onToggleLensaNalar,
  onOpenJournal,
  onOpenBip,
  onToggleMute,
  isMuted,
  isBgmActive = true,
  onToggleBgm,
  isGhostNear = false,
  currentRoomName,
  roomList,
  onSelectRoom,
  hasUnreadJournal,
  currentRoomPuzzlesSolved,
  currentRoomPuzzlesTotal,
  onRestart,
  onShare,
  onReturnToTitle,
}) => {
  const [copied, setCopied] = useState(false);
  const [confirmingRestart, setConfirmingRestart] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const restartTimerRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handleToggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      // ignore
    }
  };

  const handleRestartClick = () => {
    if (!confirmingRestart) {
      setConfirmingRestart(true);
      if (restartTimerRef.current !== null) {
        window.clearTimeout(restartTimerRef.current);
      }
      restartTimerRef.current = window.setTimeout(() => {
        setConfirmingRestart(false);
      }, 4000);
    } else {
      if (restartTimerRef.current !== null) {
        window.clearTimeout(restartTimerRef.current);
      }
      setConfirmingRestart(false);
      if (onRestart) onRestart();
    }
  };

  const handleShareClick = () => {
    if (onShare) {
      onShare();
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const getBatteryColor = (battery: number) => {
    if (battery > 50) return 'bg-[#5FE1B0]';
    if (battery > 20) return 'bg-[#F2C14E]';
    return 'bg-[#E85D75] animate-pulse';
  };

  const isCurrentRoomComplete =
    currentRoomPuzzlesTotal > 0 && currentRoomPuzzlesSolved >= currentRoomPuzzlesTotal;

  return (
    <header className="w-full bg-[#0B1026]/90 border-b border-[#16213E] backdrop-blur-md px-3 py-2 text-[#EDE6D6] z-30 select-none shadow-lg">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        {/* Left: Room Info & Navigator & Puzzle Completion Status */}
        <div className="flex items-center space-x-2.5">
          <div className="flex items-center space-x-1.5 bg-[#16213E] px-3 py-1 rounded border border-[#5FE1B0]/30 text-xs">
            <Compass className="w-3.5 h-3.5 text-[#5FE1B0]" />
            <select
              value={playerState.currentRoomId}
              onChange={(e) => onSelectRoom(Number(e.target.value))}
              className="bg-transparent text-xs font-semibold focus:outline-none cursor-pointer text-[#EDE6D6]"
              aria-label="Pilih Ruangan"
            >
              {roomList.map((r) => (
                <option
                  key={r.id}
                  value={r.id}
                  disabled={!r.isUnlocked}
                  className="bg-[#0B1026] text-[#EDE6D6]"
                >
                  {r.isUnlocked ? `✓ ${r.name}` : `🔒 ${r.name} (Terkunci)`}
                </option>
              ))}
            </select>
          </div>

          {/* Puzzle Progress in Current Room (Required for Door Unlock) */}
          <div
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded border text-xs font-semibold transition-all ${
              isCurrentRoomComplete
                ? 'bg-[#5FE1B0]/20 border-[#5FE1B0] text-[#5FE1B0] shadow-[0_0_8px_rgba(95,225,176,0.3)]'
                : 'bg-[#16213E] border-[#F2C14E]/50 text-[#F2C14E]'
            }`}
            title="Ketentuan Level: Semua teka-teki di ruangan ini harus selesai agar pintu ke level berikutnya terbuka!"
          >
            {isCurrentRoomComplete ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-[#5FE1B0] flex-shrink-0" />
            ) : (
              <Lock className="w-3.5 h-3.5 text-[#F2C14E] flex-shrink-0" />
            )}
            <span className="font-mono">
              Teka-Teki: {currentRoomPuzzlesSolved}/{currentRoomPuzzlesTotal}
            </span>
            <span className="text-[10px] hidden sm:inline px-1 py-0.5 rounded bg-black/40 font-mono">
              {isCurrentRoomComplete ? 'PINTU TERBUKA' : 'WAJIB SEMUA'}
            </span>
          </div>

          {/* Focus Hearts */}
          <div className="flex items-center space-x-1" title="Fokus (Nyawa)">
            {[1, 2, 3].map((heart) => (
              <Heart
                key={heart}
                className={`w-4 h-4 transition-all duration-300 ${
                  heart <= playerState.focus
                    ? 'text-[#E85D75] fill-[#E85D75] drop-shadow-[0_0_4px_rgba(232,93,117,0.8)]'
                    : 'text-gray-600 fill-transparent'
                }`}
              />
            ))}
            <span className="text-[10px] text-gray-400 ml-1 hidden sm:inline">Fokus</span>
          </div>

          {/* BAHAYA: Hantu Berada di Dekat Pemain */}
          {isGhostNear && (
            <div className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-red-950/90 border border-red-500 text-red-400 font-bold text-[10px] sm:text-xs animate-pulse shadow-[0_0_12px_rgba(239,68,68,0.7)]">
              <AlertTriangle className="w-3.5 h-3.5 text-red-400 animate-bounce flex-shrink-0" />
              <span className="tracking-wide">BAHAYA: HANTU DEKAT!</span>
            </div>
          )}
        </div>

        {/* Center: Battery Gauge & Concept Lens Active Banner */}
        <div className="flex items-center space-x-3">
          {/* Battery */}
          <div className="flex items-center space-x-1.5 bg-[#16213E] px-2.5 py-1 rounded border border-gray-700/60" title="Baterai Senter">
            <Zap className={`w-3.5 h-3.5 ${playerState.battery < 20 ? 'text-[#E85D75] animate-bounce' : 'text-[#F2C14E]'}`} />
            <div className="w-16 sm:w-20 bg-gray-800 h-2 rounded-full overflow-hidden border border-gray-700">
              <div
                className={`h-full transition-all duration-300 ${getBatteryColor(playerState.battery)}`}
                style={{ width: `${Math.max(0, playerState.battery)}%` }}
              />
            </div>
            <span className="text-[11px] font-mono w-7 text-right">{Math.round(playerState.battery)}%</span>
          </div>

          {/* Lensa Nalar Indicator */}
          <button
            onClick={onToggleLensaNalar}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded text-xs font-semibold transition-all border ${
              playerState.lensaNalarActive
                ? 'bg-[#5FE1B0]/20 border-[#5FE1B0] text-[#5FE1B0] shadow-[0_0_10px_rgba(95,225,176,0.4)] animate-pulse'
                : 'bg-[#16213E] border-gray-700 text-gray-400 hover:text-[#5FE1B0] hover:border-[#5FE1B0]/50'
            }`}
            title="Lensa Nalar (Tahan Shift atau Klik)"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Lensa Nalar</span>
            <span className="text-[10px] opacity-70 ml-0.5">[Shift]</span>
          </button>

          {/* Senter Toggle */}
          <button
            onClick={onToggleFlashlight}
            className={`flex items-center space-x-1 px-2 py-1 rounded text-xs transition-all border ${
              playerState.flashlightOn
                ? 'bg-[#F2C14E]/20 border-[#F2C14E] text-[#F2C14E]'
                : 'bg-[#16213E] border-gray-700 text-gray-400'
            }`}
            title="Nyalakan / Matikan Senter [F]"
          >
            <Flashlight className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Senter</span>
            <span className="text-[10px] opacity-70">[F]</span>
          </button>
        </div>

        {/* Right: Archive Shards, Journal, BIP & Sound */}
        <div className="flex items-center space-x-2">
          {/* Shards count */}
          <div className="flex items-center space-x-1 bg-[#16213E] px-2 py-1 rounded border border-gray-700/60" title="Serpihan Arsip">
            <Award className="w-3.5 h-3.5 text-[#F2C14E]" />
            <span className="text-xs font-mono font-bold text-[#F2C14E]">{playerState.archiveShards.length}/4</span>
          </div>

          {/* Journal Button */}
          <button
            onClick={onOpenJournal}
            className="relative flex items-center space-x-1 bg-[#16213E] hover:bg-[#16213E]/80 border border-gray-700 hover:border-[#F2C14E]/60 text-[#EDE6D6] px-2.5 py-1 rounded text-xs transition-colors"
            title="Buka Jurnal Bu Rani [J]"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#F2C14E]" />
            <span className="hidden sm:inline">Jurnal</span>
            <span className="text-[10px] text-gray-400">[J]</span>
            {hasUnreadJournal && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#E85D75] rounded-full animate-ping" />
            )}
          </button>

          {/* BIP Assistant Button */}
          <button
            onClick={onOpenBip}
            className="flex items-center space-x-1 bg-[#16213E] hover:bg-[#16213E]/80 border border-gray-700 hover:border-[#5FE1B0]/60 text-[#5FE1B0] px-2 py-1 rounded text-xs transition-colors"
            title="Petunjuk Server BIP-2009 [H]"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">BIP</span>
            <span className="text-[10px] text-gray-400">[H]</span>
          </button>

          {/* Soundtrack BGM Toggle */}
          {onToggleBgm && (
            <button
              onClick={onToggleBgm}
              className={`p-1 sm:px-2 sm:py-1 rounded border text-xs flex items-center space-x-1 transition-colors ${
                isBgmActive
                  ? 'bg-[#16213E] border-[#5FE1B0]/50 text-[#5FE1B0]'
                  : 'bg-[#16213E]/60 border-gray-700 text-gray-500 hover:text-gray-400'
              }`}
              title={isBgmActive ? 'Matikan Soundtrack BGM' : 'Nyalakan Soundtrack BGM'}
            >
              <Music className={`w-3.5 h-3.5 ${isBgmActive ? 'animate-pulse text-[#5FE1B0]' : 'text-gray-500'}`} />
              <span className="hidden md:inline text-[11px] font-mono">BGM</span>
            </button>
          )}

          {/* Audio Mute */}
          <button
            onClick={onToggleMute}
            className="p-1 rounded bg-[#16213E] border border-gray-700 text-gray-300 hover:text-white"
            title={isMuted ? 'Nyalakan Suara' : 'Bisukan Suara'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-[#5FE1B0]" />}
          </button>

          {/* Share Game Link */}
          <button
            onClick={handleShareClick}
            className="p-1 sm:px-2 sm:py-1 rounded bg-[#16213E] hover:bg-[#1f2c52] border border-gray-700 hover:border-[#F2C14E]/60 text-[#F2C14E] text-xs flex items-center space-x-1 transition-colors"
            title="Bagikan Tautan Game Ini"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#5FE1B0]" /> : <Share2 className="w-3.5 h-3.5" />}
            <span className="hidden md:inline">{copied ? 'Tersalin' : 'Bagikan'}</span>
          </button>

          {/* Restart Game with inline 2-step confirmation */}
          {onRestart && (
            <button
              onClick={handleRestartClick}
              className={`p-1 sm:px-2 sm:py-1 rounded text-xs flex items-center space-x-1.5 transition-all border ${
                confirmingRestart
                  ? 'bg-[#E85D75] text-white border-[#E85D75] font-bold shadow-[0_0_15px_rgba(232,93,117,0.7)] animate-pulse'
                  : 'bg-[#16213E] hover:bg-[#2e141a] border-gray-700 hover:border-[#E85D75]/60 text-gray-300 hover:text-[#E85D75]'
              }`}
              title={confirmingRestart ? 'Klik sekali lagi untuk konfirmasi Mulai Ulang!' : 'Mulai Ulang (Restart Game)'}
            >
              <RotateCcw className={`w-3.5 h-3.5 ${confirmingRestart ? 'rotate-180 transition-transform' : ''}`} />
              <span className="text-xs font-semibold">{confirmingRestart ? 'Yakin Reset?' : 'Restart'}</span>
            </button>
          )}

          {/* Fullscreen Toggle Button */}
          <button
            onClick={handleToggleFullscreen}
            className="p-1 sm:px-2 sm:py-1 rounded bg-[#16213E] hover:bg-[#1f2c52] border border-gray-700 hover:border-[#5FE1B0]/60 text-gray-300 hover:text-white text-xs flex items-center space-x-1 transition-colors"
            title={isFullscreen ? 'Keluar Layar Penuh (Esc)' : 'Mode Layar Penuh (Fullscreen)'}
          >
            {isFullscreen ? (
              <Minimize2 className="w-3.5 h-3.5 text-[#5FE1B0]" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5 text-gray-300" />
            )}
            <span className="hidden xl:inline">{isFullscreen ? 'Kecilkan' : 'Fullscreen'}</span>
          </button>

          {/* Return to Title Menu */}
          {onReturnToTitle && (
            <button
              onClick={onReturnToTitle}
              className="p-1 sm:px-2 sm:py-1 rounded bg-[#16213E] hover:bg-[#1f2c52] border border-gray-700 text-gray-300 text-xs flex items-center space-x-1 transition-colors"
              title="Kembali ke Menu Awal"
            >
              <Home className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Menu</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
