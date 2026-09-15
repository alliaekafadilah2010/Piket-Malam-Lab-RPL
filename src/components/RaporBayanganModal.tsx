/**
 * Rapor Bayangan (Shadow Report Card) Component
 * Distinctive diagnostic feature:
 * - 4-Axis SVG Radar Chart for Indeks Nalar (Fisika, Kimia, Logika, Matematika)
 * - Purity Multiplier calculation
 * - Personalized teacher diagnosis & recommendations from Bu Rani
 * - Downloadable report snapshot for school submission
 */

import React, { useRef, useState } from 'react';
import { 
  Award, 
  Download, 
  RotateCcw, 
  CheckCircle, 
  Sparkles, 
  BookOpen, 
  Zap, 
  HeartCrack,
  HelpCircle,
  Share2,
  Home,
  Check
} from 'lucide-react';
import { GameReport, RoomScoreStat } from '../types/game';

interface RaporBayanganModalProps {
  report: GameReport;
  roomStats: RoomScoreStat[];
  onRestart: () => void;
  onClose: () => void;
  onShare?: () => void;
  onReturnToTitle?: () => void;
}

export const RaporBayanganModal: React.FC<RaporBayanganModalProps> = ({
  report,
  roomStats,
  onRestart,
  onClose,
  onShare,
  onReturnToTitle,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  const handleShareClick = () => {
    if (onShare) {
      onShare();
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Radar chart coordinates (Center 150, 150, Radius 100)
  const cx = 150;
  const cy = 150;
  const r = 90;

  // 4 axes: Fisika (Up), Kimia (Right), Logika (Down), Matematika (Left)
  const getPoint = (score: number, angleDeg: number) => {
    const rad = (angleDeg - 90) * (Math.PI / 180);
    const dist = (score / 100) * r;
    return {
      x: cx + dist * Math.cos(rad),
      y: cy + dist * Math.sin(rad),
    };
  };

  const pFisika = getPoint(report.subjectScores.fisika, 0);
  const pKimia = getPoint(report.subjectScores.kimia, 90);
  const pLogika = getPoint(report.subjectScores.logika, 180);
  const pMatematika = getPoint(report.subjectScores.matematika, 270);

  const radarPolygonPoints = `${pFisika.x},${pFisika.y} ${pKimia.x},${pKimia.y} ${pLogika.x},${pLogika.y} ${pMatematika.x},${pMatematika.y}`;

  // Simple image export simulation via Canvas
  const handleExportCard = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 750;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background
    ctx.fillStyle = '#0B1026';
    ctx.fillRect(0, 0, 600, 750);

    // Border
    ctx.strokeStyle = '#5FE1B0';
    ctx.lineWidth = 4;
    ctx.strokeRect(10, 10, 580, 730);

    // Title
    ctx.fillStyle = '#EDE6D6';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText('RAPOR BAYANGAN: INDEKS NALAR', 140, 50);

    ctx.fillStyle = '#F2C14E';
    ctx.font = '16px sans-serif';
    ctx.fillText(`Peringkat Akhir: ${report.rank} | Total Skor: ${report.totalPoints}`, 170, 80);

    // Subject Scores
    ctx.fillStyle = '#EDE6D6';
    ctx.font = '14px sans-serif';
    ctx.fillText(`Web (HTML/CSS): ${report.subjectScores.fisika}%`, 60, 140);
    ctx.fillText(`Percabangan (If-Else): ${report.subjectScores.kimia}%`, 60, 170);
    ctx.fillText(`Basis Data (SQL): ${report.subjectScores.logika}%`, 60, 200);
    ctx.fillText(`Struktur Data (Array): ${report.subjectScores.matematika}%`, 60, 230);

    // Teacher note
    ctx.fillStyle = '#5FE1B0';
    ctx.font = 'bold 15px sans-serif';
    ctx.fillText('Catatan Evaluasi Bu Rani:', 60, 280);

    ctx.fillStyle = '#EDE6D6';
    ctx.font = 'italic 13px sans-serif';
    const lines = [
      report.teacherDiagnosis.slice(0, 55),
      report.teacherDiagnosis.slice(55, 110),
      report.teacherDiagnosis.slice(110),
    ];
    lines.forEach((line, idx) => {
      ctx.fillText(line, 60, 310 + idx * 22);
    });

    // Watermark
    ctx.fillStyle = '#6b7280';
    ctx.font = '11px monospace';
    ctx.fillText('SMK Bhakti Nusantara - Piket Malam Game Edukasi', 160, 710);

    // Trigger download
    const link = document.createElement('a');
    link.download = `Rapor-Bayangan-Piket-Malam-${report.rank}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const getEndingBadge = () => {
    switch (report.endingType) {
      case 'arsip_murni':
        return {
          title: 'ENDING S: ARSIP MURNI',
          desc: 'Sekolah Bayangan berubah menjadi perpustakaan terang! Jurnal Bu Rani kembali ke dunia nyata dan dibaca generasi berikutnya.',
          color: 'text-[#F2C14E] border-[#F2C14E]',
        };
      case 'terurai':
        return {
          title: 'ENDING B/A: TERURAI',
          desc: 'GALAT berhasil diuraikan dan Bu Rani beristirahat dengan tenang. Fajar menyingsing di SMK Bhakti Nusantara.',
          color: 'text-[#5FE1B0] border-[#5FE1B0]',
        };
      default:
        return {
          title: 'ENDING C/D/E: KABUR',
          desc: 'Kamu selamat keluar saat subuh, tapi gedung masih temaram. Miskonsepsi masih mengendap di sekolah.',
          color: 'text-gray-400 border-gray-600',
        };
    }
  };

  const ending = getEndingBadge();

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3">
      <div 
        ref={cardRef}
        className="relative w-full max-w-2xl bg-[#0B1026] text-[#EDE6D6] rounded-xl border-3 border-[#5FE1B0] shadow-[0_0_40px_rgba(95,225,176,0.3)] overflow-hidden flex flex-col max-h-[94vh]"
      >
        {/* Header */}
        <div className="bg-[#16213E] px-5 py-3.5 flex items-center justify-between border-b border-gray-700">
          <div className="flex items-center space-x-2">
            <Award className="w-6 h-6 text-[#F2C14E]" />
            <div>
              <h2 className="font-bold text-sm text-[#EDE6D6] tracking-wider">
                RAPOR BAYANGAN: INDEKS NALAR SISWA
              </h2>
              <p className="text-[11px] text-gray-400">
                Diagnosis Nalar Berdasarkan Eksperimen & Kemurnian Berpikir
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="px-3 py-1 rounded bg-[#5FE1B0]/20 border border-[#5FE1B0] text-[#5FE1B0] font-mono font-bold text-base">
              RANK {report.rank}
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 flex-1 overflow-y-auto space-y-5 text-xs font-sans">
          {/* Ending Banner */}
          <div className={`p-3.5 rounded-lg border-2 bg-[#16213E]/50 ${ending.color}`}>
            <div className="font-bold text-sm mb-1">{ending.title}</div>
            <div className="text-gray-300 text-xs leading-relaxed">{ending.desc}</div>
          </div>

          {/* Grid: Radar Chart + Subject Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center bg-[#090d1f] p-4 rounded-xl border border-gray-800">
            {/* SVG Radar Chart */}
            <div className="flex flex-col items-center">
              <svg viewBox="0 0 300 300" className="w-56 h-56">
                {/* Concentric Web Rings (25%, 50%, 75%, 100%) */}
                {[0.25, 0.5, 0.75, 1.0].map((step, idx) => (
                  <polygon
                    key={idx}
                    points={`
                      ${cx},${cy - r * step}
                      ${cx + r * step},${cy}
                      ${cx},${cy + r * step}
                      ${cx - r * step},${cy}
                    `}
                    fill="none"
                    stroke="#1f2937"
                    strokeWidth="1"
                    strokeDasharray={idx === 3 ? 'none' : '2 2'}
                  />
                ))}

                {/* Axes Lines */}
                <line x1={cx} y1={cy - r} x2={cx} y2={cy + r} stroke="#374151" strokeWidth="1" />
                <line x1={cx - r} y1={cy} x2={cx + r} y2={cy} stroke="#374151" strokeWidth="1" />

                {/* Student Score Polygon */}
                <polygon
                  points={radarPolygonPoints}
                  fill="rgba(95, 225, 176, 0.35)"
                  stroke="#5FE1B0"
                  strokeWidth="2.5"
                />

                {/* Data Points Dots */}
                {[pFisika, pKimia, pLogika, pMatematika].map((p, idx) => (
                  <circle key={idx} cx={p.x} cy={p.y} r="4" fill="#F2C14E" stroke="#0B1026" strokeWidth="1.5" />
                ))}

                {/* Axis Labels */}
                <text x={cx} y={cy - r - 8} fill="#5FE1B0" fontSize="10" textAnchor="middle" fontWeight="bold">
                  HTML/CSS ({report.subjectScores.fisika}%)
                </text>
                <text x={cx + r + 8} y={cy + 3} fill="#5FE1B0" fontSize="10" textAnchor="start" fontWeight="bold">
                  If-Else ({report.subjectScores.kimia}%)
                </text>
                <text x={cx} y={cy + r + 14} fill="#5FE1B0" fontSize="10" textAnchor="middle" fontWeight="bold">
                  SQL ({report.subjectScores.logika}%)
                </text>
                <text x={cx - r - 8} y={cy + 3} fill="#5FE1B0" fontSize="10" textAnchor="end" fontWeight="bold">
                  Array & Flow ({report.subjectScores.matematika}%)
                </text>
              </svg>
            </div>

            {/* Score Breakdown Table */}
            <div className="space-y-2 text-xs">
              <div className="font-bold text-gray-300 text-xs border-b border-gray-700 pb-1">
                Komposisi Penilaian Nalar:
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Total Poin Nalar:</span>
                <strong className="text-[#F2C14E] font-mono text-sm">{report.totalPoints} pts</strong>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Multiplier Kemurnian Rata-Rata:</span>
                <strong className="text-[#5FE1B0] font-mono">×{report.purityAverage.toFixed(2)}</strong>
              </div>
              <div className="text-[10px] text-gray-400 italic">
                *Kemurnian tinggi didapat dari membaca jurnal dan berpikir sebelum bertindak, bukan coba-coba tanpa arah.
              </div>
            </div>
          </div>

          {/* Teacher Diagnosis (Bu Rani) */}
          <div className="p-4 bg-amber-50/10 rounded-xl border border-amber-600/40 font-journal text-lg text-amber-100 leading-relaxed">
            <div className="font-sans text-xs font-bold text-[#F2C14E] mb-1 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-[#F2C14E]" />
              Catatan Diagnostik Guru (Bu Rani):
            </div>
            <div className="italic">
              "{report.teacherDiagnosis}"
            </div>
          </div>

          {/* Personalized Study Recommendations */}
          <div className="space-y-1.5 bg-[#16213E] p-3 rounded-lg border border-gray-700">
            <div className="font-bold text-[11px] text-[#5FE1B0]">
              Rekomendasi Tindak Lanjut:
            </div>
            {report.recommendations.map((rec, idx) => (
              <div key={idx} className="flex items-start space-x-2 text-[11px] text-gray-300">
                <span className="text-[#5FE1B0]">•</span>
                <span>{rec}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-[#16213E] px-5 py-3 border-t border-gray-700 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleExportCard}
              className="flex items-center space-x-1.5 px-3.5 py-2 bg-[#1b2848] hover:bg-[#253763] text-white border border-gray-600 rounded-lg text-xs font-semibold transition-colors"
            >
              <Download className="w-4 h-4 text-[#5FE1B0]" />
              <span>Unduh PNG</span>
            </button>

            <button
              onClick={handleShareClick}
              className="flex items-center space-x-1.5 px-3.5 py-2 bg-[#F2C14E]/20 hover:bg-[#F2C14E]/30 text-[#F2C14E] border border-[#F2C14E]/50 rounded-lg text-xs font-semibold transition-colors"
              title="Bagikan Tautan Hasil Rapor"
            >
              {copied ? <Check className="w-4 h-4 text-[#5FE1B0]" /> : <Share2 className="w-4 h-4" />}
              <span>{copied ? 'Tautan Disalin!' : 'Bagikan Link'}</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            {onReturnToTitle && (
              <button
                onClick={onReturnToTitle}
                className="flex items-center space-x-1.5 px-3.5 py-2 bg-[#1b2848] hover:bg-[#253763] text-gray-300 border border-gray-600 rounded-lg text-xs font-semibold transition-colors"
              >
                <Home className="w-4 h-4" />
                <span>Menu Awal</span>
              </button>
            )}

            <button
              onClick={onRestart}
              className="flex items-center space-x-1.5 px-4 py-2 bg-[#5FE1B0] hover:bg-[#7ff3c6] text-[#0B1026] rounded-lg text-xs font-bold transition-all shadow-[0_0_12px_rgba(95,225,176,0.3)]"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Piket Malam Lagi (Mulai Ulang)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
