/**
 * Story Intro Modal Component
 * Enhanced visual comic-cutscene prologue explaining Nara's situation
 * (SMK RPL student trapped in the 3rd floor computer lab after hours) before the game begins.
 */

import React, { useState, useEffect } from 'react';
import { sounds } from '../utils/sound';
import { 
  Clock, 
  Lock, 
  Eye, 
  Flashlight, 
  ChevronRight, 
  SkipForward, 
  AlertTriangle, 
  Terminal,
  Sparkles,
  Zap,
  Radio,
  Laptop,
  Flame,
  ShieldCheck,
  Compass,
  ArrowRight
} from 'lucide-react';

interface StoryIntroModalProps {
  onStartGame: () => void;
}

export const StoryIntroModal: React.FC<StoryIntroModalProps> = ({ onStartGame }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isFlickering, setIsFlickering] = useState(false);

  // Occasional light flicker effect for horror immersion
  useEffect(() => {
    const flickerInterval = setInterval(() => {
      if (Math.random() > 0.6) {
        setIsFlickering(true);
        setTimeout(() => setIsFlickering(false), 120);
      }
    }, 2800);
    return () => clearInterval(flickerInterval);
  }, []);

  const handleNext = () => {
    sounds.playPageTurn();
    if (currentStep < 2) {
      setCurrentStep((prev) => prev + 1);
    } else {
      sounds.playSwitchClick();
      onStartGame();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      sounds.playPageTurn();
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSkip = () => {
    sounds.playSwitchClick();
    onStartGame();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-3 sm:p-5 select-none overflow-y-auto">
      {/* Dynamic atmospheric lighting background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className={`absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full transition-opacity duration-300 ${
          currentStep === 0 ? 'bg-amber-600/15' : currentStep === 1 ? 'bg-rose-700/25' : 'bg-emerald-600/20'
        } blur-[120px]`} />
        
        <div className={`absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full transition-opacity duration-300 ${
          currentStep === 0 ? 'bg-blue-900/20' : currentStep === 1 ? 'bg-red-950/40' : 'bg-teal-600/20'
        } blur-[120px]`} />
        
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,9,20,0)_30%,rgba(3,4,10,0.98)_95%)]" />
        
        {/* CRT Scanline effect */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] pointer-events-none opacity-40" />
      </div>

      <div className={`relative w-full max-w-4xl bg-slate-950/90 border transition-all duration-300 ${
        isFlickering ? 'border-red-500/80 shadow-[0_0_40px_rgba(239,68,68,0.3)]' : 'border-slate-800 shadow-2xl'
      } rounded-2xl p-4 sm:p-6 text-slate-200 z-10 flex flex-col gap-4 max-h-[92vh] overflow-y-auto`}>
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold tracking-widest uppercase border transition-all ${
              currentStep === 0 
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                : currentStep === 1
                ? 'bg-rose-500/10 border-rose-500/40 text-rose-300 animate-pulse'
                : 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
            }`}>
              {currentStep === 0 && '● ADEGAN 1: KORIDOR LANTAI 3'}
              {currentStep === 1 && '⚠ ADEGAN 2: DARURAT RELAI PEKAT'}
              {currentStep === 2 && '✦ ADEGAN 3: MISI PENYELIDIKAN'}
            </span>

            <span className="text-xs text-slate-400 font-mono hidden md:inline-block">
              {currentStep === 0 && '18:04 WIB · Gedung SMK Bhakti Nusantara'}
              {currentStep === 1 && '18:07 WIB · Sensor Pintu Otomatis Terkunci'}
              {currentStep === 2 && '18:09 WIB · Firmware Lensa Nalar Bu Rani'}
            </span>
          </div>

          <button
            onClick={handleSkip}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-mono transition-colors border border-slate-800"
            title="Lewati prolog narasi"
          >
            <span>Lewati Prolog</span>
            <SkipForward className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Main Content Layout: Illustration (Left/Top) + Narrative & Dialogues (Right/Bottom) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
          
          {/* Visual Cutscene Comic Illustration Frame (5 cols on md) */}
          <div className="md:col-span-5 flex flex-col justify-between bg-slate-900/80 rounded-xl border border-slate-800 overflow-hidden relative min-h-[220px] sm:min-h-[260px] p-4 shadow-inner">
            
            {/* Ambient Background Graphic for Scene */}
            {currentStep === 0 && (
              <div className="absolute inset-0 bg-gradient-to-b from-amber-950/20 via-slate-950/80 to-slate-950 flex items-center justify-center pointer-events-none">
                <div className="w-48 h-48 rounded-full bg-amber-500/10 blur-2xl" />
              </div>
            )}
            {currentStep === 1 && (
              <div className="absolute inset-0 bg-gradient-to-b from-rose-950/30 via-slate-950/90 to-slate-950 flex items-center justify-center pointer-events-none">
                <div className="w-56 h-56 rounded-full bg-red-600/15 blur-3xl animate-pulse" />
              </div>
            )}
            {currentStep === 2 && (
              <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/30 via-slate-950/90 to-slate-950 flex items-center justify-center pointer-events-none">
                <div className="w-56 h-56 rounded-full bg-teal-500/15 blur-3xl" />
              </div>
            )}

            {/* Top Badge on Illustration */}
            <div className="relative z-10 flex justify-between items-center text-[10px] font-mono text-slate-400 uppercase">
              <span className="flex items-center gap-1">
                {currentStep === 0 && <Clock className="w-3 h-3 text-amber-400" />}
                {currentStep === 1 && <AlertTriangle className="w-3 h-3 text-rose-400 animate-bounce" />}
                {currentStep === 2 && <Sparkles className="w-3 h-3 text-emerald-400" />}
                STATUS LOKASI
              </span>
              <span className="bg-black/60 px-2 py-0.5 rounded border border-slate-800">
                {currentStep === 0 && 'KORIDOR RPL'}
                {currentStep === 1 && 'PINTU RELAI PEKAT'}
                {currentStep === 2 && 'LENSA NALAR AKTIF'}
              </span>
            </div>

            {/* Central Graphic Element */}
            <div className="relative z-10 my-auto py-3 flex flex-col items-center justify-center text-center">
              {currentStep === 0 && (
                <div className="space-y-3">
                  <div className="relative mx-auto w-24 h-24 rounded-2xl bg-amber-950/40 border border-amber-500/30 flex items-center justify-center shadow-lg">
                    <Laptop className="w-12 h-12 text-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.6)]" />
                    <span className="absolute -bottom-2 -right-2 px-2 py-0.5 bg-amber-500 text-slate-950 font-black text-[9px] rounded-full uppercase">
                      USB + KODE
                    </span>
                  </div>
                  <div className="text-xs font-mono text-amber-200/90">
                    "Flashdisk berisi tugas akhir tertinggal di Lab 3..."
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-3">
                  <div className="relative mx-auto w-24 h-24 rounded-2xl bg-rose-950/50 border border-rose-500/40 flex items-center justify-center shadow-lg animate-pulse">
                    <Lock className="w-12 h-12 text-rose-400 drop-shadow-[0_0_15px_rgba(244,63,94,0.8)]" />
                    <Zap className="w-6 h-6 text-amber-400 absolute -top-2 -right-2 animate-bounce" />
                  </div>
                  <div className="text-xs font-mono text-rose-300 font-bold">
                    BLAAM! Pintu Terkunci Otomatis & Lampu Padam!
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-3">
                  <div className="relative mx-auto w-24 h-24 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-center shadow-lg">
                    <Eye className="w-12 h-12 text-emerald-300 drop-shadow-[0_0_15px_rgba(52,211,153,0.8)] animate-pulse" />
                    <Terminal className="w-6 h-6 text-cyan-400 absolute -bottom-2 -right-2" />
                  </div>
                  <div className="text-xs font-mono text-emerald-300 font-bold">
                    Pesan Rahasia Bu Rani & Logika Pemrograman
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Key controls indicator preview */}
            <div className="relative z-10 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span className="flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-cyan-400" /> Kontrol Cepat:
              </span>
              <span className="text-slate-300">
                [W][A][S][D] / [F] Senter
              </span>
            </div>
          </div>

          {/* Narrative & Character Speech Bubble (7 cols on md) */}
          <div className="md:col-span-7 flex flex-col justify-between space-y-4">
            
            {/* Title & Subtitle */}
            <div>
              <div className="text-xs text-slate-400 font-mono mb-1 flex items-center gap-1.5">
                {currentStep === 0 && <span className="text-amber-400 font-bold">FASE 1: KEDATANGAN</span>}
                {currentStep === 1 && <span className="text-rose-400 font-bold">FASE 2: JEBAKAN MALAM</span>}
                {currentStep === 2 && <span className="text-emerald-400 font-bold">FASE 3: INSTRUKSI BERTAHAN HIDUP</span>}
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-wide">
                {currentStep === 0 && 'Kembali ke Sekolah yang Telah Gelap'}
                {currentStep === 1 && 'Gerbang Terkunci & Entitas Miskonsepsi'}
                {currentStep === 2 && 'Aplikasi "Lensa Nalar" & Kunci Pelarian'}
              </h2>
            </div>

            {/* Story Dialogue & Descriptive Text */}
            <div className="p-4 bg-slate-900/90 rounded-xl border border-slate-800 space-y-3 text-xs sm:text-[13px] leading-relaxed">
              {currentStep === 0 && (
                <>
                  <p className="text-slate-300">
                    Bel kepulangan sekolah telah berbunyi hampir dua jam lalu. Seluruh siswa dan dewan guru SMK Bhakti Nusantara sudah pulang ke rumah.
                  </p>
                  <p className="text-slate-300">
                    Namun <span className="text-amber-300 font-bold">Nara</span>, siswi kelas 10 RPL, menyadari hal krusial: <span className="text-amber-200 underline decoration-amber-500/50">flashdisk tugas akhir coding dan laptopnya tertinggal di Lab Komputer Lantai 3</span>.
                  </p>
                  <p className="text-slate-300">
                    Ia memutuskan kembali menaiki tangga sekolah yang sunyi untuk mengambil barangnya sebelum gerbang sekolah dikunci rapat oleh satpam.
                  </p>
                </>
              )}

              {currentStep === 1 && (
                <>
                  <p className="text-slate-300">
                    <span className="text-rose-400 font-bold font-mono">KREEEK... BLAAM!</span> Begitu melangkah masuk ke koridor lab, pintu besi selenoid membanting rapat di belakang Nara!
                  </p>
                  <p className="text-slate-300">
                    <span className="text-amber-300 font-bold font-mono">BZZZTT!</span> Suara dengung saklar listrik berderak keras. Seluruh lampu plafon padam seketika, menyisakan hawa dingin menusuk tulang.
                  </p>
                  <p className="text-rose-200 bg-rose-950/30 p-2.5 rounded-lg border border-rose-800/40">
                    Di balik kegelapan lorong, bayangan berkabut merah mulai bergerak perlahan. Itulah wujud gaib dari ribuan <em>bug</em> dan <em>miskonsepsi pemrograman</em> yang menumpuk di memori server tua!
                  </p>
                </>
              )}

              {currentStep === 2 && (
                <>
                  <p className="text-slate-300">
                    Ponsel pintar Nara mendadak bergetar dan menyala, membuka aplikasi darurat <span className="text-emerald-300 font-bold">"Lensa Nalar v2.0"</span> rancangan Bu Rani (Guru Produktif RPL).
                  </p>
                  <div className="bg-emerald-950/30 p-3 rounded-lg border border-emerald-800/40 text-emerald-200 space-y-1.5">
                    <div className="font-bold flex items-center gap-1.5 text-xs text-emerald-400">
                      <Radio className="w-3.5 h-3.5 animate-pulse" /> Memo Audio Bu Rani:
                    </div>
                    <p className="italic text-xs">
                      "Nara, kamu harus tetap tenang! Tekan [F] untuk menyalakan senter, gunakan [Shift] untuk mengaktifkan Lensa Nalar dan mendeteksi bug logika kode di setiap monitor, lalu selesaikan teka-teki untuk membuka kunci pintu tiap lab!"
                    </p>
                  </div>
                </>
              )}

              {/* Character Quote Box */}
              <div className="pt-2 border-t border-slate-800 flex items-start gap-2 text-slate-300">
                <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-amber-400 flex-shrink-0 font-bold">
                  {currentStep === 2 ? 'BU RANI' : 'NARA'}
                </span>
                <span className="italic text-xs text-slate-300">
                  {currentStep === 0 && '"Cuma mau ambil flashdisk sebentar, lima menit pasti beres..."'}
                  {currentStep === 1 && '"Pak Satpam?! Ada orang di luar?! Tolong buka pintunya!"'}
                  {currentStep === 2 && '"Gunakan pemahaman logikamu, Nara. Logika coding adalah senter terkuatmu malam ini."'}
                </span>
              </div>
            </div>

            {/* Quick Mechanics Tips Badges */}
            <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono">
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                <span className="text-emerald-400 font-bold block mb-0.5">SENTER [F]</span>
                Menembus gelap & kabut
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                <span className="text-cyan-400 font-bold block mb-0.5">LENSA [Shift]</span>
                Lihat jejak kode bug
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                <span className="text-rose-400 font-bold block mb-0.5">HANTU GHOUL</span>
                Hindari tatapan dekat!
              </div>
            </div>

            {/* Footer Navigation Buttons */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              {/* Back / Scene Counter */}
              <div className="flex items-center gap-2">
                {currentStep > 0 && (
                  <button
                    onClick={handlePrev}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-mono border border-slate-800 transition-colors"
                  >
                    Sebelumnya
                  </button>
                )}
                <div className="flex items-center gap-1.5 ml-1">
                  {[0, 1, 2].map((idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        sounds.playPageTurn();
                        setCurrentStep(idx);
                      }}
                      className={`w-2.5 h-2.5 rounded-full transition-all ${
                        currentStep === idx
                          ? 'bg-emerald-400 scale-125 ring-2 ring-emerald-400/40'
                          : 'bg-slate-700 hover:bg-slate-600'
                      }`}
                      aria-label={`Ke halaman ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>

              {/* Next / Start Button */}
              <button
                onClick={handleNext}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-all transform active:scale-95 ${
                  currentStep === 2
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 ring-2 ring-emerald-400/60 shadow-[0_0_20px_rgba(52,211,153,0.4)] animate-pulse'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                }`}
              >
                <span>{currentStep === 2 ? 'Mulai Petualangan Lab Sekarang!' : 'Lanjutkan Adegan'}</span>
                {currentStep === 2 ? <ArrowRight className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

