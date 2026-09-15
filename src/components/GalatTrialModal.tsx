/**
 * GALAT Trial Modal (Boss Showdown in Aula Sekolah Bayangan) - SMK RPL Edition
 * 3-Phase Climax:
 * Phase 1: Evidence Board (Membantah 4 Mitos Fatal Coding RPL)
 * Phase 2: Branching Code Corridor (Lorong Nalar Programmer RPL)
 * Phase 3: The Mirror of Nara (Refleksi Jiwa: Error Bukan Kegagalan, Tapi Petunjuk Jalan)
 */

import React, { useState } from 'react';
import { X, Sparkles, CheckCircle, ShieldAlert, Award, ArrowRight, RotateCcw, Terminal, HelpCircle } from 'lucide-react';
import { sounds } from '../utils/sound';

interface GalatTrialModalProps {
  onVictory: () => void;
  onMistake: (reason: string) => void;
  onClose: () => void;
}

interface ClaimItem {
  id: number;
  claim: string;
  correctEvidenceId: string;
  feedback: string;
}

interface EvidenceToken {
  id: string;
  title: string;
  subject: string;
  description: string;
}

export const GalatTrialModal: React.FC<GalatTrialModalProps> = ({
  onVictory,
  onMistake,
  onClose,
}) => {
  const [phase, setPhase] = useState<1 | 2 | 3>(1);

  // Phase 1 State: Evidence Board (SMK RPL Myths)
  const claims: ClaimItem[] = [
    {
      id: 1,
      claim: '"Tag HTML tidak usah ditutup pakai </tag>! Buat apa buang karakter, browser pasti otomatis tahu maksudmu!"',
      correctEvidenceId: 'html_closing_tag',
      feedback: 'TERBANTAHKAN! Tag berpasangan seperti <button> wajib ditutup dengan </button> agar struktur DOM halaman tidak bocor!',
    },
    {
      id: 2,
      claim: '"Komputer itu peka perasaan! Tanpa menulis kondisi if (kartu === \'VALID\'), pintu otomatis tahu kapan harus buka!"',
      correctEvidenceId: 'if_else_logic',
      feedback: 'TERBANTAHKAN! Komputer adalah mesin logika yang butuh evaluasi boolean bernilai TRUE untuk mengeksekusi blok IF!',
    },
    {
      id: 3,
      claim: '"Tarik saja semua data tanpa klausa WHERE! Kenapa repot menyaring data, serahkan saja semuanya ke RAM server!"',
      correctEvidenceId: 'sql_where_clause',
      feedback: 'TERBANTAHKAN! Klausa WHERE menyaring data spesifik secara efisien agar server tidak mengalami out-of-memory atau lag fatal!',
    },
    {
      id: 4,
      claim: '"Semua manusia menghitung dari 1, jadi elemen pertama di dalam kode array pasti selalu berindeks data[1]!"',
      correctEvidenceId: 'array_zero_index',
      feedback: 'TERBANTAHKAN! Di pemrograman komputer, offset memori dimulai dari 0 (Zero-based indexing), jadi data pertama ada di data[0]!',
    },
  ];

  const evidenceTokens: EvidenceToken[] = [
    {
      id: 'html_closing_tag',
      title: 'Tag Berpasangan HTML (</button>)',
      subject: 'Web Development',
      description: 'Elemen berpasangan membutuhkan penutup garis miring agar DOM dirender dengan benar.',
    },
    {
      id: 'if_else_logic',
      title: 'Evaluasi Logika Boolean (IF == TRUE)',
      subject: 'Algoritma',
      description: 'Blok percabangan hanya aktif saat kondisi perbandingan menghasilkan nilai True.',
    },
    {
      id: 'sql_where_clause',
      title: 'Filter Presisi SQL (Klausa WHERE)',
      subject: 'Basis Data',
      description: 'Menyaring record spesifik tanpa membebani server dengan jutaan baris data sampah.',
    },
    {
      id: 'array_zero_index',
      title: 'Indeks Berbasis Nol (data[0])',
      subject: 'Struktur Data',
      description: 'Offset memori array selalu dimulai dari indeks 0 sebagai elemen pertama.',
    },
  ];

  const [matchedEvidence, setMatchedEvidence] = useState<{ [claimId: number]: string }>({});
  const [selectedToken, setSelectedToken] = useState<string | null>(null);

  // Phase 2: Quick Decision Corridor
  const [corridorStep, setCorridorStep] = useState<number>(0);
  const corridorQuestions = [
    {
      prompt: 'Ketika halaman web tidak menampilkan warna tombol CSS yang kamu ketik, apa tindakan pertama anak RPL yang bijak?',
      options: [
        { text: 'Menendang casing PC dan menginstal ulang Windows dari awal', correct: false },
        { text: 'Membuka Inspect Element (F12) di browser untuk memeriksa kecocokan nama ID/Class dan syntax CSS', correct: true },
        { text: 'Menghapus semua file project dan mengaku komputer terkena kutukan', correct: false },
      ],
    },
    {
      prompt: 'Kamu ingin mencari data siswa bernama "Nara" dari tabel database "siswa_rpl". Perintah SQL yang tepat adalah...',
      options: [
        { text: 'DELETE FROM siswa_rpl WHERE nama = \'Nara\'', correct: false },
        { text: 'SELECT * FROM siswa_rpl WHERE nama = \'Nara\'', correct: true },
        { text: 'DROP DATABASE siswa_rpl', correct: false },
      ],
    },
  ];

  // Phase 3: Mirror Dialogues (RPL Themed)
  const [dialogueIndex, setDialogueIndex] = useState<number>(0);
  const mirrorDialogues = [
    {
      speaker: 'GALAT (Bayangan Merah)',
      text: '"Untuk apa kamu bersusah payah memahami coding? Kamu cuma siswa SMK yang sering pusing melihat layar merah terminal error. Tinggal copas dari internet tanpa tahu artinya, asal jalan saat ujian, lalu lupakan!"',
    },
    {
      speaker: 'NARA',
      text: '"Dulu aku memang berpikir begitu... hanya ingin jalan pintas, memalsukan pemahaman, dan panik setiap kali melihat tulisan error merah. Tapi malam ini aku sadar: copy-paste tanpa mengerti logika hanya membuat kita terjebak dalam kebingungan seumur hidup."',
    },
    {
      speaker: 'GALAT (Bayangan Merah)',
      text: '"Bagaimana kalau kodemu ada bug lagi? Bagaimana kalau kamu merasa tidak berbakat dan teman-temanmu menertawakanmu?!"',
    },
    {
      speaker: 'NARA',
      text: '"Pesan error dan bug itu bukan tanda kebodohan, melainkan petunjuk jujur dari komputer tentang apa yang perlu diperbaiki! Menjadi anak RPL sejati bukan berarti tidak pernah salah, tapi berani menganalisis log, memahami logika, dan pantang menyerah!"',
    },
  ];

  const handleMatchClaim = (claimId: number) => {
    if (!selectedToken) return;
    const targetClaim = claims.find((c) => c.id === claimId);
    if (!targetClaim) return;

    if (targetClaim.correctEvidenceId === selectedToken) {
      sounds.playPuzzleSolved();
      setMatchedEvidence((prev) => ({ ...prev, [claimId]: selectedToken }));
      setSelectedToken(null);
    } else {
      sounds.playConceptMistake();
      onMistake('Bukti nalar coding tidak cocok untuk mematahkan klaim sesat ini.');
    }
  };

  const handleCorridorAnswer = (correct: boolean) => {
    if (correct) {
      sounds.playPuzzleSolved();
      if (corridorStep + 1 >= corridorQuestions.length) {
        setPhase(3);
      } else {
        setCorridorStep(corridorStep + 1);
      }
    } else {
      sounds.playConceptMistake();
      onMistake('Keputusan keliru di lorong nalar programmer.');
    }
  };

  // Helper auto-solve in boss trial for player convenience
  const handleAutoSolveEvidence = () => {
    sounds.playPuzzleSolved();
    setMatchedEvidence({
      1: 'html_closing_tag',
      2: 'if_else_logic',
      3: 'sql_where_clause',
      4: 'array_zero_index',
    });
    setSelectedToken(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3">
      <div className="relative w-full max-w-3xl bg-slate-950 text-slate-100 rounded-2xl border-2 border-emerald-500/70 shadow-[0_0_50px_rgba(16,185,129,0.3)] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Boss Header */}
        <div className="bg-slate-900 px-5 py-3.5 flex items-center justify-between border-b border-emerald-500/40">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              <Terminal className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="font-bold text-sm tracking-wider text-emerald-400 flex items-center gap-2">
                SIDANG NALAR: ENTITAS BUG MASTER GALAT [FASE {phase} / 3]
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono">
                  SMK RPL
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Bantah 4 mitos salah kaprah coding anak SMK Rekayasa Perangkat Lunak
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Boss Body */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4 text-xs font-sans">
          {/* PHASE 1: Evidence Board */}
          {phase === 1 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-900/90 rounded-xl border border-slate-800 text-slate-300 leading-relaxed">
                <span>
                  Pilih satu <strong>Prinsip Nalar Coding</strong> di bawah, lalu klik klaim palsu GALAT yang sesuai untuk membantahnya!
                </span>
                <button
                  onClick={handleAutoSolveEvidence}
                  className="shrink-0 text-xs px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 flex items-center gap-1 transition-colors ml-3"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  Bantuan Bu Rani
                </button>
              </div>

              {/* Claims List */}
              <div className="space-y-2.5">
                {claims.map((claim) => {
                  const isSolved = Boolean(matchedEvidence[claim.id]);
                  return (
                    <div
                      key={claim.id}
                      onClick={() => !isSolved && handleMatchClaim(claim.id)}
                      className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer ${
                        isSolved
                          ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200 shadow-md shadow-emerald-950/50'
                          : selectedToken
                          ? 'bg-slate-900 border-amber-400 hover:bg-slate-850 ring-2 ring-amber-400/30'
                          : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="font-bold text-xs text-rose-300 font-mono leading-relaxed">
                          {claim.claim}
                        </div>
                        {isSolved && <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 ml-2 mt-0.5" />}
                      </div>
                      {isSolved && (
                        <div className="mt-2 text-[11px] text-emerald-300 italic font-sans flex items-center gap-1.5 pt-1.5 border-t border-emerald-800/40">
                          <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          {claim.feedback}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Evidence Inventory */}
              <div className="border-t border-slate-800 pt-3">
                <div className="font-bold text-xs text-amber-400 mb-2.5 flex items-center gap-1.5">
                  <Award className="w-4 h-4" /> Prinsip Nalar Coding Tersedia (Klik untuk memilih):
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {evidenceTokens.map((token) => {
                    const isUsed = Object.values(matchedEvidence).includes(token.id);
                    const isSelected = selectedToken === token.id;
                    return (
                      <button
                        key={token.id}
                        disabled={isUsed}
                        onClick={() => {
                          sounds.playFlashlight();
                          setSelectedToken(isSelected ? null : token.id);
                        }}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          isUsed
                            ? 'opacity-30 border-slate-800 bg-slate-950 cursor-not-allowed'
                            : isSelected
                            ? 'bg-emerald-950/80 border-emerald-400 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-xs text-slate-100">{token.title}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                            {token.subject}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 leading-relaxed">{token.description}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Advance to Phase 2 Button */}
              {Object.keys(matchedEvidence).length === 4 && (
                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => {
                      sounds.playPuzzleSolved();
                      setPhase(2);
                    }}
                    className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl transition-all flex items-center space-x-2 shadow-lg shadow-emerald-900/40"
                  >
                    <span>Lanjut ke Lorong Nalar Programmer (Fase 2)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* PHASE 2: Quick Decision Corridor */}
          {phase === 2 && (
            <div className="space-y-4">
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-slate-300">
                GALAT mengubah aula menjadi lorong kode bercabang! Ambil keputusan paling logis sebagai programmer anak RPL untuk melewati ilusi.
              </div>

              <div className="p-4 bg-slate-900/90 rounded-xl border border-amber-500/40 space-y-3">
                <div className="font-bold text-xs text-amber-400 flex items-center gap-1.5">
                  <Terminal className="w-4 h-4" />
                  Kasus Nyata #{corridorStep + 1}:
                </div>
                <div className="text-sm text-white font-medium">
                  {corridorQuestions[corridorStep].prompt}
                </div>
                <div className="space-y-2 pt-2">
                  {corridorQuestions[corridorStep].options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleCorridorAnswer(opt.correct)}
                      className="w-full p-3.5 rounded-xl bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500 text-left text-xs transition-colors text-slate-200"
                    >
                      {opt.text}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* PHASE 3: The Mirror of Nara */}
          {phase === 3 && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-900 rounded-xl border border-purple-500/40 flex flex-col items-center text-center space-y-2">
                <div className="w-16 h-16 rounded-full border-2 border-purple-400 bg-purple-950/60 flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(168,85,247,0.4)]">
                  🪞
                </div>
                <div className="font-bold text-sm text-purple-300">
                  CERMIN LAB BAYANGAN
                </div>
                <div className="text-xs text-slate-400">
                  GALAT mengambil wujud ketakutan terbesar Nara — rasa malu saat menghadapi syntax error dan takut dinilai bodoh.
                </div>
              </div>

              {/* Dialogue Box */}
              <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                <div className="font-bold text-xs text-amber-400 font-mono">
                  {mirrorDialogues[dialogueIndex].speaker}
                </div>
                <div className="text-sm text-slate-200 leading-relaxed font-sans text-base">
                  {mirrorDialogues[dialogueIndex].text}
                </div>
              </div>

              {/* Navigation in Dialogue */}
              <div className="flex justify-between items-center pt-2">
                <span className="text-[11px] text-slate-500">
                  Dialog {dialogueIndex + 1} dari {mirrorDialogues.length}
                </span>

                {dialogueIndex < mirrorDialogues.length - 1 ? (
                  <button
                    onClick={() => {
                      sounds.playFlashlight();
                      setDialogueIndex(dialogueIndex + 1);
                    }}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs text-white transition-colors"
                  >
                    Lanjutkan Dialog →
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      sounds.playPuzzleSolved();
                      onVictory();
                    }}
                    className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)]"
                  >
                    Bebaskan Lab SMK Bhakti Nusantara! (Tamat)
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
