/**
 * Interactive Puzzle Modal Component - SMK Rekayasa Perangkat Lunak (RPL) Edition
 * Expanded to 14 engaging, beginner-friendly coding challenges across all Lab rooms:
 * - Room 0: Saklar Daya Server (tut_breaker_panel) & Router Gateway IP (tut_network_router)
 * - Room 1: Tombol Web HTML/CSS (phys_puzzle_cabinet), Hyperlink & Image (phys_puzzle_trolley), Flexbox Layout (web_flexbox_terminal)
 * - Room 2: If-Else RFID Card (chem_puzzle_bench), For Loop Pendingin Server (chem_loop_terminal), Boolean Logic Gate (chem_logic_gate)
 * - Room 3: SQL SELECT Query (comp_puzzle_terminal), SQL INSERT Data (db_insert_terminal), PRIMARY KEY Constraint (db_primary_key_console)
 * - Room 4: Array Index 0 & Flowchart (math_puzzle_safe), Stack LIFO vs Queue FIFO (math_stack_queue), Git Workflow (math_git_terminal)
 */

import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Play, 
  RotateCcw, 
  Sparkles, 
  Code, 
  Cpu, 
  Database, 
  Layers, 
  Check, 
  HelpCircle,
  Terminal,
  Globe,
  Lock,
  Unlock,
  ShieldCheck,
  Server,
  Zap,
  Wifi,
  GitBranch,
  Layout,
  Sliders,
  ArrowDown,
  Shuffle
} from 'lucide-react';
import { sounds } from '../utils/sound';
import {
  ROUTER_VARIANTS,
  HTML_CSS_VARIANTS,
  HYPERLINK_MEDIA_VARIANTS,
  FLEXBOX_VARIANTS,
  IF_ELSE_VARIANTS,
  LOOP_VARIANTS,
  LOGIC_GATE_VARIANTS,
  SQL_SELECT_VARIANTS,
  SQL_INSERT_VARIANTS,
  PRIMARY_KEY_VARIANTS,
  ARRAY_VARIANTS,
  STACK_QUEUE_VARIANTS,
  GIT_VARIANTS,
} from '../data/puzzleVariants';

interface InteractivePuzzleModalProps {
  roomId: number;
  objectId: string;
  puzzleTitle: string;
  puzzleDescription: string;
  onSolve: () => void;
  onMistake: (reason: string) => void;
  onClose: () => void;
}

export const InteractivePuzzleModal: React.FC<InteractivePuzzleModalProps> = ({
  roomId,
  objectId,
  puzzleTitle,
  puzzleDescription,
  onSolve,
  onMistake,
  onClose,
}) => {
  // Common states
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  // Dynamic random variant index for current puzzle
  const [variantIndex, setVariantIndex] = useState<number>(() => Math.floor(Math.random() * 3));

  // Reset inputs when switching variants
  const handleRandomizeVariant = () => {
    sounds.playSwitchClick();
    setVariantIndex((prev) => (prev + 1) % 3);
    setFeedback({
      type: 'info',
      message: 'Soal berhasil diacak ke varian baru! Pelajari skenario studi kasus terbaru di bawah ini.'
    });
    // Reset state inputs
    setRouterIp('');
    setRouterSubnet('');
    setRouterPort('');
    setRouterPingDone(false);
    setHtmlClosingTag('');
    setCssButtonColor('');
    setIsWebButtonTested(false);
    setSelectedAnchorTag('');
    setSelectedImageTag('');
    setFlexJustify('flex-start');
    setFlexAlign('flex-start');
    setSelectedCardStatus('');
    setExecutionPath('idle');
    setLoopCount(0);
    setLoopFinished(false);
    setBooleanOperator('');
    setSqlWhere('');
    setQueryExecuted(false);
    setSelectedInsertQuery('');
    setInsertDone(false);
    setSelectedPrimaryKey('');
    setSelectedArrayIndex('');
    setFlowchartSimulated(false);
    setCase1Structure('');
    setCase2Structure('');
    setGitStep1('');
    setGitStep2('');
    setGitStep3('');
    setGitPushed(false);
  };

  // =========================================================================
  // 1. Room 0: Rack Server Power Breakers (tut_breaker_panel)
  // =========================================================================
  const [breakerSwitches, setBreakerSwitches] = useState<[boolean, boolean, boolean]>([false, false, false]);

  // =========================================================================
  // 2. Room 0: Router & IP Lab (tut_network_router)
  // =========================================================================
  const [routerIp, setRouterIp] = useState<string>('');
  const [routerSubnet, setRouterSubnet] = useState<string>('');
  const [routerPort, setRouterPort] = useState<string>('');
  const [routerPingDone, setRouterPingDone] = useState(false);

  // =========================================================================
  // 3. Room 1: HTML & CSS Tombol Web (phys_puzzle_cabinet)
  // =========================================================================
  const [htmlClosingTag, setHtmlClosingTag] = useState<string>('');
  const [cssButtonColor, setCssButtonColor] = useState<string>('');
  const [isWebButtonTested, setIsWebButtonTested] = useState(false);

  // =========================================================================
  // 4. Room 1: Hyperlink & Image Tag Web (phys_puzzle_trolley)
  // =========================================================================
  const [selectedAnchorTag, setSelectedAnchorTag] = useState<string>('');
  const [selectedImageTag, setSelectedImageTag] = useState<string>('');

  // =========================================================================
  // 5. Room 1: CSS Flexbox Layout (web_flexbox_terminal)
  // =========================================================================
  const [flexJustify, setFlexJustify] = useState<string>('flex-start');
  const [flexAlign, setFlexAlign] = useState<string>('flex-start');

  // =========================================================================
  // 6. Room 2: If-Else Scanner Kartu (chem_puzzle_bench / chem_scanner_console)
  // =========================================================================
  const [selectedCardStatus, setSelectedCardStatus] = useState<string>('');
  const [executionPath, setExecutionPath] = useState<'idle' | 'if_branch' | 'else_branch'>('idle');

  // =========================================================================
  // 7. Room 2: For Loop Pendingin Server (chem_loop_terminal)
  // =========================================================================
  const [loopCount, setLoopCount] = useState<number>(0);
  const [serverTemp, setServerTemp] = useState<number>(95);
  const [loopFinished, setLoopFinished] = useState(false);

  // =========================================================================
  // 8. Room 2: Gerbang Logika Boolean (chem_logic_gate)
  // =========================================================================
  const [booleanOperator, setBooleanOperator] = useState<string>('');

  // =========================================================================
  // 9. Room 3: SQL SELECT Query Shard Kunci (comp_puzzle_terminal)
  // =========================================================================
  const [sqlAction, setSqlAction] = useState<string>('SELECT *');
  const [sqlFrom, setSqlFrom] = useState<string>('FROM arsip_lab');
  const [sqlWhere, setSqlWhere] = useState<string>('');
  const [queryExecuted, setQueryExecuted] = useState(false);

  // =========================================================================
  // 10. Room 3: SQL INSERT Siswa Baru (db_insert_terminal)
  // =========================================================================
  const [selectedInsertQuery, setSelectedInsertQuery] = useState<string>('');
  const [insertDone, setInsertDone] = useState(false);

  // =========================================================================
  // 11. Room 3: PRIMARY KEY Constraint (db_primary_key_console)
  // =========================================================================
  const [selectedPrimaryKey, setSelectedPrimaryKey] = useState<string>('');

  // =========================================================================
  // 12. Room 4: Array 0-Index & Flowchart (math_puzzle_safe)
  // =========================================================================
  const [selectedArrayIndex, setSelectedArrayIndex] = useState<string>('');
  const [flowchartOrder, setFlowchartOrder] = useState<string[]>([
    'Input Password',
    'Mulai (Start)',
    'Buka Brankas (Selesai)',
    'Cek Validasi'
  ]);
  const [flowchartSimulated, setFlowchartSimulated] = useState(false);

  // =========================================================================
  // 13. Room 4: Stack LIFO vs Queue FIFO (math_stack_queue)
  // =========================================================================
  const [case1Structure, setCase1Structure] = useState<string>('');
  const [case2Structure, setCase2Structure] = useState<string>('');

  // =========================================================================
  // 14. Room 4: Git Workflow (math_git_terminal)
  // =========================================================================
  const [gitStep1, setGitStep1] = useState<string>('');
  const [gitStep2, setGitStep2] = useState<string>('');
  const [gitStep3, setGitStep3] = useState<string>('');
  const [gitPushed, setGitPushed] = useState(false);

  // Identify active puzzle view
  const puzzleType = objectId || `room_${roomId}`;

  // =========================================================================
  // HANDLERS
  // =========================================================================

  // --- 1. Breaker switches ---
  const toggleBreakerSwitch = (index: number) => {
    sounds.playSwitchClick();
    setBreakerSwitches((prev) => {
      const next: [boolean, boolean, boolean] = [prev[0], prev[1], prev[2]];
      next[index] = !next[index];
      return next;
    });
  };

  const handleTestBreakerCircuit = () => {
    setIsSimulating(true);
    if (breakerSwitches[0] && breakerSwitches[1] && breakerSwitches[2]) {
      sounds.playSuccessChime();
      setFeedback({
        type: 'success',
        message: 'Daya Server Lab RPL menyala sempurna! Pintu masuk terbuka!'
      });
      setTimeout(() => onSolve(), 1000);
    } else {
      sounds.playHeartbeat();
      setFeedback({
        type: 'error',
        message: 'Arus terputus! Aktifkan ketiga saklar (Web Server, Database, Switch).'
      });
      onMistake('Saklar server belum semuanya aktif.');
    }
    setIsSimulating(false);
  };

  // Active dynamic variants
  const activeRouterVar = ROUTER_VARIANTS[variantIndex % ROUTER_VARIANTS.length];
  const activeHtmlVar = HTML_CSS_VARIANTS[variantIndex % HTML_CSS_VARIANTS.length];
  const activeHyperlinkVar = HYPERLINK_MEDIA_VARIANTS[variantIndex % HYPERLINK_MEDIA_VARIANTS.length];
  const activeFlexboxVar = FLEXBOX_VARIANTS[variantIndex % FLEXBOX_VARIANTS.length];
  const activeIfElseVar = IF_ELSE_VARIANTS[variantIndex % IF_ELSE_VARIANTS.length];
  const activeLoopVar = LOOP_VARIANTS[variantIndex % LOOP_VARIANTS.length];
  const activeLogicVar = LOGIC_GATE_VARIANTS[variantIndex % LOGIC_GATE_VARIANTS.length];
  const activeSqlSelectVar = SQL_SELECT_VARIANTS[variantIndex % SQL_SELECT_VARIANTS.length];
  const activeSqlInsertVar = SQL_INSERT_VARIANTS[variantIndex % SQL_INSERT_VARIANTS.length];
  const activePkVar = PRIMARY_KEY_VARIANTS[variantIndex % PRIMARY_KEY_VARIANTS.length];
  const activeArrayVar = ARRAY_VARIANTS[variantIndex % ARRAY_VARIANTS.length];
  const activeStackQueueVar = STACK_QUEUE_VARIANTS[variantIndex % STACK_QUEUE_VARIANTS.length];
  const activeGitVar = GIT_VARIANTS[variantIndex % GIT_VARIANTS.length];

  // --- 2. Router IP ---
  const handleTestRouterIp = () => {
    if (routerIp !== activeRouterVar.targetIp) {
      sounds.playHeartbeat();
      setFeedback({
        type: 'error',
        message: `IP Gateway salah! Untuk ${activeRouterVar.name}, IP gateway yang tepat adalah ${activeRouterVar.targetIp}.`
      });
      onMistake(`Salah konfigurasi IP Gateway (${routerIp || 'kosong'}).`);
      return;
    }
    if (routerSubnet !== activeRouterVar.targetSubnet) {
      sounds.playHeartbeat();
      setFeedback({
        type: 'error',
        message: `Subnet Mask salah! Gunakan ${activeRouterVar.targetSubnet}.`
      });
      onMistake('Salah konfigurasi Subnet Mask.');
      return;
    }
    if (routerPort !== activeRouterVar.targetPort) {
      sounds.playHeartbeat();
      setFeedback({
        type: 'error',
        message: `Port layanan salah! Target layanan ${activeRouterVar.name} menggunakan port ${activeRouterVar.targetPort}.`
      });
      onMistake('Salah memilih Port layanan.');
      return;
    }

    setRouterPingDone(true);
    sounds.playSuccessChime();
    setFeedback({
      type: 'success',
      message: `Ping ${activeRouterVar.targetIp}:${activeRouterVar.targetPort} berhasil (0% loss, 1ms latency)! Router lab aktif!`
    });
    setTimeout(() => onSolve(), 1200);
  };

  // --- 3. Web Button (HTML & CSS) ---
  const handleTestWebButton = () => {
    if (htmlClosingTag !== activeHtmlVar.correctCloseTag) {
      sounds.playHeartbeat();
      setFeedback({
        type: 'error',
        message: `Sintaks HTML error! Elemen ${activeHtmlVar.openTag} harus ditutup dengan tag penutup ${activeHtmlVar.correctCloseTag}!`
      });
      onMistake('Tag penutup HTML salah atau belum dipilih.');
      return;
    }
    if (cssButtonColor !== activeHtmlVar.correctCssValue) {
      sounds.playHeartbeat();
      setFeedback({
        type: 'error',
        message: `Styling CSS belum tepat! Pilih nilai CSS yang sesuai: ${activeHtmlVar.cssProperty}: ${activeHtmlVar.correctCssValue}!`
      });
      onMistake('Warna atau styling CSS belum sesuai.');
      return;
    }
    setIsWebButtonTested(true);
    sounds.playSwitchClick();
    setFeedback({
      type: 'info',
      message: 'Elemen web berhasil dirender di preview! Sekarang klik tombol untuk memicu event onClick().'
    });
  };

  const handleTriggerWebButtonClick = () => {
    sounds.playSuccessChime();
    setFeedback({
      type: 'success',
      message: 'Event onClick() terpicu! Pintu Lab Web terbuka!'
    });
    setTimeout(() => onSolve(), 1000);
  };

  // --- 4. Hyperlink & Image Tag ---
  const handleTestHyperlinkImage = () => {
    if (selectedAnchorTag !== activeHyperlinkVar.correctAnchorAttr) {
      sounds.playHeartbeat();
      setFeedback({
        type: 'error',
        message: 'Tag navigasi/link belum tepat untuk varian ini! Pilih sintaks tag anchor yang valid.'
      });
      onMistake('Salah memilih atribut tag hyperlink.');
      return;
    }
    if (selectedImageTag !== activeHyperlinkVar.correctMediaAttr) {
      sounds.playHeartbeat();
      setFeedback({
        type: 'error',
        message: 'Tag media wajib menyertakan src="..." untuk berkas dan alt="..." untuk deskripsi aksesibilitas!'
      });
      onMistake('Tag media belum menyertakan atribut src dan alt.');
      return;
    }

    sounds.playSuccessChime();
    setFeedback({
      type: 'success',
      message: 'Sintaks web tervalidasi! Proyektor lab web menyala menampilkan portal sekolah!'
    });
    setTimeout(() => onSolve(), 1200);
  };

  // --- 5. CSS Flexbox ---
  const handleTestFlexbox = () => {
    if (flexJustify === activeFlexboxVar.targetJustify && flexAlign === activeFlexboxVar.targetAlign) {
      sounds.playSuccessChime();
      setFeedback({
        type: 'success',
        message: `Sempurna! ${activeFlexboxVar.expectedLabel} memenuhi target: ${activeFlexboxVar.goalTitle}!`
      });
      setTimeout(() => onSolve(), 1200);
    } else {
      sounds.playHeartbeat();
      setFeedback({
        type: 'error',
        message: `Tata letak belum pas! Target: "${activeFlexboxVar.goalTitle}". Gunakan justify-content: ${activeFlexboxVar.targetJustify} & align-items: ${activeFlexboxVar.targetAlign}.`
      });
      onMistake('Properti Flexbox belum memenuhi target varian.');
    }
  };

  // --- 6. If-Else Scanner ---
  const handleScanCard = (status: string) => {
    setSelectedCardStatus(status);
    sounds.playSwitchClick();

    if (status === activeIfElseVar.correctCard) {
      setExecutionPath('if_branch');
      sounds.playSuccessChime();
      setFeedback({
        type: 'success',
        message: `kondisi bernilai TRUE! ${activeIfElseVar.correctReason}`
      });
      setTimeout(() => onSolve(), 1200);
    } else {
      setExecutionPath('else_branch');
      sounds.playHeartbeat();
      setFeedback({
        type: 'error',
        message: `kondisi bernilai FALSE! ${activeIfElseVar.wrongReason}`
      });
      onMistake(`Pilihan ${status} membuat kondisi bernilai False.`);
    }
  };

  // --- 7. For Loop Kipas Server ---
  const handleRunLoopCooling = () => {
    setIsSimulating(true);
    let step = 0;
    const interval = setInterval(() => {
      step++;
      sounds.playSwitchClick();
      setLoopCount(step);
      setServerTemp((prev) => Math.max(activeLoopVar.safeTemp, prev - activeLoopVar.coolPerStep));

      if (step >= activeLoopVar.requiredSteps) {
        clearInterval(interval);
        setIsSimulating(false);
        setLoopFinished(true);
        sounds.playSuccessChime();
        setFeedback({
          type: 'success',
          message: `Loop for selesai berputar ${activeLoopVar.requiredSteps}x! Suhu server aman di ${activeLoopVar.safeTemp}°C!`
        });
        setTimeout(() => onSolve(), 1200);
      }
    }, 400);
  };

  // --- 8. Boolean Logic Gate ---
  const handleTestBooleanGate = () => {
    if (booleanOperator === activeLogicVar.correctOperator) {
      sounds.playSuccessChime();
      setFeedback({
        type: 'success',
        message: `Tepat! ${activeLogicVar.explanation}`
      });
      setTimeout(() => onSolve(), 1200);
    } else {
      sounds.playHeartbeat();
      setFeedback({
        type: 'error',
        message: `Operator ${booleanOperator} keliru untuk "${activeLogicVar.title}"! Harus menggunakan operator ${activeLogicVar.correctOperator}.`
      });
      onMistake(`Salah memilih operator Boolean untuk ${activeLogicVar.title}.`);
    }
  };

  // --- 9. SQL SELECT ---
  const handleExecuteSelectQuery = () => {
    const expectedCondition = activeSqlSelectVar.correctCondition.replace('WHERE ', '');
    if (!sqlWhere.includes(expectedCondition)) {
      sounds.playHeartbeat();
      setFeedback({
        type: 'error',
        message: `Query ditolak! Kamu harus menyertakan klausa filter yang tepat: ${activeSqlSelectVar.correctCondition}.`
      });
      onMistake('Klausa WHERE belum tepat atau belum dipilih.');
      return;
    }

    setQueryExecuted(true);
    sounds.playSuccessChime();
    setFeedback({
      type: 'success',
      message: `Query Berhasil Dieksekusi (1 baris ditemukan)! Data terfilter dari tabel ${activeSqlSelectVar.tableName}!`
    });
    setTimeout(() => onSolve(), 1200);
  };

  // --- 10. SQL INSERT ---
  const handleExecuteInsertQuery = () => {
    if (selectedInsertQuery === activeSqlInsertVar.correctInsertQuery) {
      setInsertDone(true);
      sounds.playSuccessChime();
      setFeedback({
        type: 'success',
        message: `Query DML valid! Data sukses tersimpan ke tabel ${activeSqlInsertVar.tableName}!`
      });
      setTimeout(() => onSolve(), 1200);
    } else {
      sounds.playHeartbeat();
      setFeedback({
        type: 'error',
        message: 'Sintaks SQL salah! Format standar SQL: INSERT INTO nama_tabel (kolom) VALUES (nilai);'
      });
      onMistake('Sintaks SQL INSERT tidak valid.');
    }
  };

  // --- 11. PRIMARY KEY ---
  const handleTestPrimaryKey = () => {
    if (selectedPrimaryKey === activePkVar.correctKey) {
      sounds.playSuccessChime();
      setFeedback({
        type: 'success',
        message: `Benar sekali! ${activePkVar.explanation}`
      });
      setTimeout(() => onSolve(), 1200);
    } else {
      sounds.playHeartbeat();
      setFeedback({
        type: 'error',
        message: `Kolom '${selectedPrimaryKey}' tidak cocok jadi Primary Key! Primary Key wajib unik dan tidak boleh null/duplikat.`
      });
      onMistake('Kolom yang dipilih tidak memenuhi syarat integritas Primary Key.');
    }
  };

  // --- 12. Array 0-Index & Flowchart ---
  const handleRunArrayProgram = () => {
    if (selectedArrayIndex !== activeArrayVar.expectedCode) {
      sounds.playHeartbeat();
      setFeedback({
        type: 'error',
        message: `Indeks array salah! Di pemrograman (0-indexed), elemen pertama selalu diakses dengan: ${activeArrayVar.expectedCode}!`
      });
      onMistake('Salah memilih indeks pertama array.');
      return;
    }

    const isOrderCorrect = 
      flowchartOrder[0] === activeArrayVar.flowchartCorrect[0] &&
      flowchartOrder[1] === activeArrayVar.flowchartCorrect[1] &&
      flowchartOrder[2] === activeArrayVar.flowchartCorrect[2] &&
      flowchartOrder[3] === activeArrayVar.flowchartCorrect[3];

    if (!isOrderCorrect) {
      sounds.playHeartbeat();
      setFeedback({
        type: 'error',
        message: `Urutan flowchart belum logis! Alur program harus: ${activeArrayVar.flowchartCorrect.join(' -> ')}.`
      });
      onMistake('Urutan Flowchart program tidak tepat.');
      return;
    }

    setFlowchartSimulated(true);
    sounds.playSuccessChime();
    setFeedback({
      type: 'success',
      message: 'Program tervalidasi! Array 0-indexed dan Flowchart berjalan sempurna. Brankas arsip terbuka!'
    });
    setTimeout(() => onSolve(), 1200);
  };

  // --- 13. Stack vs Queue ---
  const handleTestStackQueue = () => {
    if (case1Structure === activeStackQueueVar.case1Correct && case2Structure === activeStackQueueVar.case2Correct) {
      sounds.playSuccessChime();
      setFeedback({
        type: 'success',
        message: `Luar biasa! ${activeStackQueueVar.case1Title} = ${activeStackQueueVar.case1Correct} dan ${activeStackQueueVar.case2Title} = ${activeStackQueueVar.case2Correct}!`
      });
      setTimeout(() => onSolve(), 1200);
    } else {
      sounds.playHeartbeat();
      setFeedback({
        type: 'error',
        message: 'Pasangan struktur data belum tepat! Evaluasi kembali: LIFO (Last In First Out) = Stack vs FIFO (First In First Out) = Queue.'
      });
      onMistake('Tertukar antara konsep Stack (LIFO) dan Queue (FIFO).');
    }
  };

  // --- 14. Git Workflow ---
  const handleTestGitWorkflow = () => {
    if (gitStep1 === 'add' && gitStep2 === 'commit' && gitStep3 === 'push') {
      setGitPushed(true);
      sounds.playSuccessChime();
      setFeedback({
        type: 'success',
        message: 'Mantra Git sempurna! git add . -> git commit -m -> git push origin main berhasil diunggah ke GitHub!'
      });
      setTimeout(() => onSolve(), 1200);
    } else {
      sounds.playHeartbeat();
      setFeedback({
        type: 'error',
        message: 'Urutan Git salah! Alur kerja Git: 1. git add . (Staging) -> 2. git commit (Local) -> 3. git push (Remote).'
      });
      onMistake('Urutan perintah Git version control terbalik.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-2xl bg-slate-900 border-2 border-emerald-500/50 rounded-2xl shadow-2xl text-slate-100 flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Header Bar */}
        <div className="bg-slate-950 px-4 sm:px-5 py-3.5 border-b border-slate-800 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex-shrink-0">
              <Terminal className="w-5 h-5" />
            </div>
            <div className="truncate">
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2 truncate">
                <span>{puzzleTitle}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono flex-shrink-0">
                  SMK RPL
                </span>
              </h2>
              <p className="text-xs text-slate-400 truncate">{puzzleDescription}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleRandomizeVariant}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 hover:text-emerald-200 text-xs font-mono transition-all shadow-sm"
              title="Ganti ke variasi soal yang berbeda secara acak"
            >
              <Shuffle className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Varian #{(variantIndex % 3) + 1} (Acak)</span>
              <span className="sm:hidden">Acak</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              title="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-sm">

          {/* ========================================================= */}
          {/* PUZZLE 1: TUT BREAKER PANEL (ROOM 0)                      */}
          {/* ========================================================= */}
          {(puzzleType === 'tut_breaker_panel' || (roomId === 0 && !objectId.includes('router'))) && (
            <div className="space-y-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="text-xs text-slate-400 mb-3 flex items-center justify-between">
                  <span className="font-mono font-bold text-emerald-400 flex items-center gap-1.5">
                    <Zap className="w-4 h-4" /> PANEL DAYA RACK SERVER
                  </span>
                  <span>Target: Alirkan daya ke 3 sirkuit</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { label: 'Web Server', port: 'PORT 80' },
                    { label: 'Database Server', port: 'PORT 3306' },
                    { label: 'Core Switch LAN', port: '24-PORT' }
                  ].map((item, i) => (
                    <button
                      key={item.label}
                      onClick={() => toggleBreakerSwitch(i)}
                      className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                        breakerSwitches[i]
                          ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300 shadow-md'
                          : 'bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-400'
                      }`}
                    >
                      <Server className={`w-6 h-6 ${breakerSwitches[i] ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
                      <div className="text-center">
                        <div className="font-bold text-xs">{item.label}</div>
                        <div className="text-[10px] font-mono text-slate-500">{item.port}</div>
                      </div>
                      <div className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        breakerSwitches[i] ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {breakerSwitches[i] ? 'AKTIF (ON)' : 'MATI (OFF)'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleTestBreakerCircuit}
                disabled={isSimulating}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg transition-colors disabled:opacity-50"
              >
                <Play className="w-4 h-4" />
                Uji Sirkuit Daya Server
              </button>
            </div>
          )}

          {/* ========================================================= */}
          {/* PUZZLE 2: TUT NETWORK ROUTER & IP (ROOM 0)                */}
          {/* ========================================================= */}
          {puzzleType === 'tut_network_router' && (
            <div className="space-y-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="text-xs flex items-center justify-between font-mono">
                  <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                    <Wifi className="w-4 h-4" /> KONFIGURASI ROUTER: {activeRouterVar.name}
                  </span>
                  <span className="text-[10px] text-cyan-300/80 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800">
                    Varian #{((variantIndex % 3) + 1)}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-cyan-950/40 border border-cyan-800/40 text-xs text-cyan-200">
                  <span className="font-bold">Target Layanan:</span> {activeRouterVar.description}
                </div>

                {/* Step 1: IP Gateway */}
                <div>
                  <label className="text-xs text-slate-300 font-semibold block mb-1.5">1. IP Gateway Layanan:</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono">
                    {activeRouterVar.ipOptions.map((opt) => {
                      const ipVal = opt.split(' ')[0];
                      return (
                        <button
                          key={opt}
                          onClick={() => { sounds.playSwitchClick(); setRouterIp(ipVal); }}
                          className={`p-2 rounded-lg border text-left transition-colors ${
                            routerIp === ipVal
                              ? 'bg-cyan-950 border-cyan-400 text-cyan-200 shadow-md'
                              : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850'
                          }`}
                        >
                          <div className="font-bold">{ipVal}</div>
                          <div className="text-[9px] text-slate-500 font-sans truncate">{opt}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Step 2: Subnet Mask */}
                <div>
                  <label className="text-xs text-slate-300 font-semibold block mb-1.5">2. Subnet Mask:</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono">
                    {activeRouterVar.subnetOptions.map((opt) => {
                      const subnetVal = opt.split(' ')[0];
                      return (
                        <button
                          key={opt}
                          onClick={() => { sounds.playSwitchClick(); setRouterSubnet(subnetVal); }}
                          className={`p-2 rounded-lg border text-left transition-colors ${
                            routerSubnet === subnetVal
                              ? 'bg-cyan-950 border-cyan-400 text-cyan-200 shadow-md'
                              : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850'
                          }`}
                        >
                          <div className="font-bold">{subnetVal}</div>
                          <div className="text-[9px] text-slate-500 font-sans truncate">{opt}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Step 3: HTTP/Service Port */}
                <div>
                  <label className="text-xs text-slate-300 font-semibold block mb-1.5">3. Port Protokol Layanan:</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                    {activeRouterVar.portOptions.map((opt) => {
                      const portVal = opt.split(' ')[0];
                      return (
                        <button
                          key={opt}
                          onClick={() => { sounds.playSwitchClick(); setRouterPort(portVal); }}
                          className={`p-2 rounded-lg border text-center transition-colors ${
                            routerPort === portVal
                              ? 'bg-cyan-950 border-cyan-400 text-cyan-200 shadow-md'
                              : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850'
                          }`}
                        >
                          <div className="font-bold">Port {portVal}</div>
                          <div className="text-[9px] text-slate-500 font-sans truncate">{opt}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <button
                onClick={handleTestRouterIp}
                className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg transition-colors"
              >
                <Wifi className="w-4 h-4" />
                Uji Ping & Simpan Konfigurasi Router
              </button>
            </div>
          )}

          {/* ========================================================= */}
          {/* PUZZLE 3: HTML & CSS TOMBOL (ROOM 1: phys_puzzle_cabinet) */}
          {/* ========================================================= */}
          {(puzzleType === 'phys_puzzle_cabinet' || (roomId === 1 && !objectId.includes('trolley') && !objectId.includes('flexbox'))) && (
            <div className="space-y-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
                <div className="text-xs flex items-center justify-between font-sans">
                  <span className="text-amber-400 font-bold flex items-center gap-1.5">
                    <Code className="w-4 h-4" /> Editor Web: index.html
                  </span>
                  <span className="text-[10px] text-amber-300/80 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800 font-mono">
                    Varian #{((variantIndex % 3) + 1)}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-amber-950/30 border border-amber-800/40 text-xs text-amber-200 font-sans">
                  <span className="font-bold">Kasus:</span> {activeHtmlVar.description}
                </div>

                <div className="bg-slate-900 p-3 rounded-lg text-slate-200 leading-relaxed border border-slate-800">
                  <span className="text-rose-400">{activeHtmlVar.openTag}</span>
                  <br />
                  &nbsp;&nbsp;{activeHtmlVar.elementName}
                  <br />
                  <span className="inline-block px-2 py-0.5 bg-slate-800 border border-dashed border-amber-400 rounded text-amber-300 font-bold">
                    {htmlClosingTag || '??? (Pilih Tag Penutup)'}
                  </span>
                </div>

                <div className="flex flex-wrap sm:flex-nowrap gap-2">
                  {activeHtmlVar.closeTagOptions.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => { sounds.playSwitchClick(); setHtmlClosingTag(tag); }}
                      className={`flex-1 py-1.5 px-2 rounded-lg border text-xs font-mono transition-colors ${
                        htmlClosingTag === tag
                          ? 'bg-emerald-600 text-white border-emerald-400 shadow-md'
                          : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <div className="text-sky-400 font-bold font-sans mb-1.5">
                    Properti CSS Styling ({activeHtmlVar.cssProperty}):
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 font-mono">
                    {activeHtmlVar.cssOptions.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => { sounds.playSwitchClick(); setCssButtonColor(opt.value); }}
                        className={`flex-1 py-1.5 px-2 rounded-lg border text-xs transition-colors ${
                          cssButtonColor === opt.value
                            ? 'bg-sky-600 text-white border-sky-400 font-bold shadow-md'
                            : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {!isWebButtonTested ? (
                <button
                  onClick={handleTestWebButton}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg transition-colors"
                >
                  <Play className="w-4 h-4" />
                  Render Kode di Browser
                </button>
              ) : (
                <div className="p-4 bg-slate-950 rounded-xl border border-emerald-500/50 flex flex-col items-center gap-3">
                  <div className="text-xs text-emerald-300 font-bold font-mono">LIVE BROWSER PREVIEW</div>
                  <button
                    onClick={handleTriggerWebButtonClick}
                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl shadow-lg animate-bounce transition-all"
                  >
                    🚪 {activeHtmlVar.elementName}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* PUZZLE 4: HYPERLINK & IMAGE WEB (phys_puzzle_trolley)      */}
          {/* ========================================================= */}
          {puzzleType === 'phys_puzzle_trolley' && (
            <div className="space-y-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
                <div className="text-xs flex items-center justify-between font-sans">
                  <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                    <Globe className="w-4 h-4" /> Navigasi Portal & Elemen Media
                  </span>
                  <span className="text-[10px] text-cyan-300/80 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800 font-mono">
                    Varian #{((variantIndex % 3) + 1)}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-cyan-950/30 border border-cyan-800/40 text-xs text-cyan-200 font-sans">
                  <span className="font-bold">Target Web:</span> {activeHyperlinkVar.description}
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-semibold font-sans block mb-1.5">
                    1. Sintaks Hyperlink (Tag Anchor):
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {activeHyperlinkVar.anchorOptions.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => { sounds.playSwitchClick(); setSelectedAnchorTag(item.id); }}
                        className={`p-2.5 rounded-lg border text-left transition-colors ${
                          selectedAnchorTag === item.id
                            ? 'bg-cyan-950 border-cyan-400 text-cyan-200 shadow-md'
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850'
                        }`}
                      >
                        <code>{item.code}</code>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <label className="text-xs text-slate-300 font-semibold font-sans block mb-1.5">
                    2. Sintaks Gambar (Tag Img) dengan Aksesibilitas:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {activeHyperlinkVar.mediaOptions.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => { sounds.playSwitchClick(); setSelectedImageTag(item.id); }}
                        className={`p-2.5 rounded-lg border text-left transition-colors ${
                          selectedImageTag === item.id
                            ? 'bg-cyan-950 border-cyan-400 text-cyan-200 shadow-md'
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850'
                        }`}
                      >
                        <code>{item.code}</code>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={handleTestHyperlinkImage}
                className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg transition-colors"
              >
                <Globe className="w-4 h-4" />
                Validasi Hyperlink & Render Proyektor
              </button>
            </div>
          )}

          {/* ========================================================= */}
          {/* PUZZLE 5: CSS FLEXBOX LAYOUT (web_flexbox_terminal)       */}
          {/* ========================================================= */}
          {puzzleType === 'web_flexbox_terminal' && (
            <div className="space-y-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="text-xs flex items-center justify-between font-mono">
                  <span className="text-sky-400 font-bold flex items-center gap-1.5">
                    <Layout className="w-4 h-4" /> CSS FLEXBOX: {activeFlexboxVar.goalTitle}
                  </span>
                  <span className="text-[10px] text-sky-300/80 bg-sky-950/80 px-2 py-0.5 rounded border border-sky-800">
                    Varian #{((variantIndex % 3) + 1)}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-sky-950/30 border border-sky-800/40 text-xs text-sky-200">
                  <span className="font-bold">Target Penataan:</span> {activeFlexboxVar.description}
                </div>

                {/* Live Preview Box */}
                <div 
                  className="h-32 bg-slate-900 rounded-xl border border-slate-800 p-2 flex transition-all duration-300"
                  style={{ justifyContent: flexJustify, alignItems: flexAlign }}
                >
                  <div className="px-4 py-2 bg-sky-600 text-white font-bold text-xs rounded-lg shadow-lg border border-sky-400 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5" /> {activeFlexboxVar.expectedLabel}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                  <div>
                    <label className="text-slate-300 font-sans block mb-1">justify-content (Sumbu Utama X):</label>
                    <div className="flex flex-col gap-1.5">
                      {[
                        { val: 'flex-start', label: 'flex-start (Kiri)' },
                        { val: 'center', label: 'center (Tengah X)' },
                        { val: 'flex-end', label: 'flex-end (Kanan)' },
                        { val: 'space-between', label: 'space-between (Ujung ke Ujung)' }
                      ].map((item) => (
                        <button
                          key={item.val}
                          onClick={() => { sounds.playSwitchClick(); setFlexJustify(item.val); }}
                          className={`p-1.5 rounded-lg border text-left transition-colors ${
                            flexJustify === item.val
                              ? 'bg-sky-600 text-white border-sky-400 font-bold shadow-md'
                              : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-850'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-300 font-sans block mb-1">align-items (Sumbu Silang Y):</label>
                    <div className="flex flex-col gap-1.5">
                      {[
                        { val: 'flex-start', label: 'flex-start (Atas)' },
                        { val: 'center', label: 'center (Tengah Y)' },
                        { val: 'flex-end', label: 'flex-end (Bawah)' }
                      ].map((item) => (
                        <button
                          key={item.val}
                          onClick={() => { sounds.playSwitchClick(); setFlexAlign(item.val); }}
                          className={`p-1.5 rounded-lg border text-left transition-colors ${
                            flexAlign === item.val
                              ? 'bg-sky-600 text-white border-sky-400 font-bold shadow-md'
                              : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-850'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleTestFlexbox}
                className="w-full py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg transition-colors"
              >
                <Layout className="w-4 h-4" />
                Terapkan CSS Flexbox
              </button>
            </div>
          )}

          {/* ========================================================= */}
          {/* PUZZLE 6: IF-ELSE SCANNER (ROOM 2: chem_puzzle_bench)     */}
          {/* ========================================================= */}
          {(puzzleType === 'chem_puzzle_bench' || puzzleType === 'chem_scanner_console' || (roomId === 2 && !objectId.includes('loop') && !objectId.includes('logic'))) && (
            <div className="space-y-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
                <div className="text-xs flex items-center justify-between font-sans">
                  <span className="text-purple-400 font-bold flex items-center gap-1.5">
                    <Code className="w-4 h-4" /> Logika Percabangan: auth_access.js
                  </span>
                  <span className="text-[10px] text-purple-300/80 bg-purple-950/80 px-2 py-0.5 rounded border border-purple-800 font-mono">
                    Varian #{((variantIndex % 3) + 1)}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-purple-950/30 border border-purple-800/40 text-xs text-purple-200 font-sans">
                  <span className="font-bold">Skenario:</span> {activeIfElseVar.scenarioTitle}
                </div>

                <div className="bg-slate-900 p-3 rounded-lg text-slate-200 border border-slate-800 leading-relaxed">
                  <pre className="whitespace-pre-wrap font-mono text-xs">{activeIfElseVar.codeSnippet}</pre>
                </div>

                <div className="text-xs font-sans text-slate-300 font-bold pt-1">
                  Pilih Kredensial untuk Divalidasi ke Scanner:
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-sans">
                  {activeIfElseVar.cardOptions.map((card) => (
                    <button
                      key={card.id}
                      onClick={() => handleScanCard(card.id)}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        selectedCardStatus === card.id
                          ? card.id === activeIfElseVar.correctCard
                            ? 'bg-emerald-950 border-emerald-500 text-emerald-200 shadow-md'
                            : 'bg-rose-950 border-rose-500 text-rose-200 shadow-md'
                          : 'bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-300'
                      }`}
                    >
                      <ShieldCheck className="w-5 h-5 mx-auto mb-1 opacity-80" />
                      <div className="font-bold text-xs">{card.label}</div>
                      <div className="text-[10px] font-mono text-slate-500 mt-1">{card.role}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* PUZZLE 7: FOR LOOP PENDINGIN SERVER (chem_loop_terminal)  */}
          {/* ========================================================= */}
          {puzzleType === 'chem_loop_terminal' && (
            <div className="space-y-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="text-xs font-bold text-orange-400 flex items-center justify-between font-mono">
                  <span className="flex items-center gap-1.5">
                    <RotateCcw className="w-4 h-4" /> LOOPING: {activeLoopVar.title}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] ${serverTemp > 50 ? 'bg-rose-950 text-rose-300' : 'bg-emerald-950 text-emerald-300'}`}>
                    Suhu: {serverTemp}°C
                  </span>
                </div>

                {/* Code Preview */}
                <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 font-mono text-xs text-slate-200">
                  <pre className="whitespace-pre-wrap font-mono text-xs">{activeLoopVar.loopCode}</pre>
                  <div className="text-slate-500 mt-1.5 text-[11px]">
                    // Iterasi saat ini: {loopCount} / {activeLoopVar.requiredSteps}
                  </div>
                </div>

                {/* Visual Progress Thermometer */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Proses Perulangan Loop</span>
                    <span>{loopCount} / {activeLoopVar.requiredSteps} Putaran</span>
                  </div>
                  <div className="h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <div 
                      className="h-full bg-gradient-to-r from-orange-500 to-emerald-400 transition-all duration-300"
                      style={{ width: `${Math.min(100, (loopCount / activeLoopVar.requiredSteps) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={handleRunLoopCooling}
                disabled={isSimulating || loopFinished}
                className="w-full py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg transition-colors disabled:opacity-50"
              >
                <Play className="w-4 h-4" />
                {loopFinished ? 'Loop Selesai (Suhu Normal)' : `Jalankan Perulangan (${activeLoopVar.requiredSteps}x Iterasi)`}
              </button>
            </div>
          )}

          {/* ========================================================= */}
          {/* PUZZLE 8: GERBANG LOGIKA BOOLEAN (chem_logic_gate)        */}
          {/* ========================================================= */}
          {puzzleType === 'chem_logic_gate' && (
            <div className="space-y-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
                <div className="text-xs flex items-center justify-between font-sans">
                  <span className="text-indigo-400 font-bold flex items-center gap-1.5">
                    <Cpu className="w-4 h-4" /> {activeLogicVar.title}
                  </span>
                  <span className="text-[10px] text-indigo-300/80 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-800 font-mono">
                    Varian #{((variantIndex % 3) + 1)}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-indigo-950/30 border border-indigo-800/40 text-xs text-indigo-200 font-sans">
                  <span className="font-bold">Kasus:</span> {activeLogicVar.description}
                </div>

                <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-slate-200">
                  <div className="text-slate-400 font-sans text-[11px] mb-1">Kondisi Input Sensor:</div>
                  <div className="font-mono text-xs space-y-1">
                    <div>Input A: <span className="text-cyan-300 font-bold">{activeLogicVar.inputA}</span></div>
                    <div>Input B: <span className="text-amber-300 font-bold">{activeLogicVar.inputB}</span></div>
                  </div>
                  <div className="mt-2 text-indigo-300 font-sans text-xs">
                    Operator yang dipilih: <span className="font-bold underline">{booleanOperator || '(Belum dipilih)'}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-sans">
                  {[
                    { op: 'AND', label: 'AND (&&) - Konjungsi', desc: 'Output TRUE jika dan hanya jika kedua kondisi TRUE.' },
                    { op: 'OR', label: 'OR (||) - Disjungsi', desc: 'Output TRUE jika salah satu atau kedua kondisi TRUE.' }
                  ].map((item) => (
                    <button
                      key={item.op}
                      onClick={() => { sounds.playSwitchClick(); setBooleanOperator(item.op as 'AND' | 'OR'); }}
                      className={`p-3 rounded-xl border text-left transition-colors ${
                        booleanOperator === item.op
                          ? 'bg-indigo-950 border-indigo-400 text-indigo-200 shadow-md'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850'
                      }`}
                    >
                      <div className="font-bold text-xs mb-1">{item.label}</div>
                      <div className="text-[10px] text-slate-400 leading-tight">{item.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleTestBooleanGate}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg transition-colors"
              >
                <Cpu className="w-4 h-4" />
                Uji Gerbang Logika & Buka Katup Darurat
              </button>
            </div>
          )}

          {/* ========================================================= */}
          {/* PUZZLE 9: SQL SELECT SHARD (ROOM 3: comp_puzzle_terminal) */}
          {/* ========================================================= */}
          {(puzzleType === 'comp_puzzle_terminal' || puzzleType === 'comp_sql_terminal' || (roomId === 3 && !objectId.includes('insert') && !objectId.includes('primary'))) && (
            <div className="space-y-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
                <div className="text-xs flex items-center justify-between font-sans">
                  <span className="text-blue-400 font-bold flex items-center gap-1.5 font-mono">
                    <Database className="w-4 h-4" /> MySQL Terminal - Tabel: {activeSqlSelectVar.tableName}
                  </span>
                  <span className="text-[10px] text-blue-300/80 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-800 font-mono">
                    Varian #{((variantIndex % 3) + 1)}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-blue-950/30 border border-blue-800/40 text-xs text-blue-200 font-sans">
                  <span className="font-bold">Kasus Query:</span> {activeSqlSelectVar.targetDesc}
                </div>

                <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-slate-200 leading-relaxed">
                  <span className="text-purple-400 font-bold">SELECT</span> * <br />
                  <span className="text-blue-400 font-bold">FROM</span> {activeSqlSelectVar.tableName} <br />
                  <span className="text-amber-400 font-bold">WHERE</span>{' '}
                  <span className="text-emerald-300 font-bold">
                    {sqlWhere || '??? (Pilih Filter WHERE)'}
                  </span>
                  ;
                </div>

                <div className="space-y-1.5">
                  <div className="text-slate-400 font-sans text-xs">Pilih klausa WHERE untuk menyaring target:</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {activeSqlSelectVar.whereOptions.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => { sounds.playSwitchClick(); setSqlWhere(opt.clause); }}
                        className={`p-2 rounded-lg border text-left font-mono text-xs transition-colors ${
                          sqlWhere === opt.clause
                            ? 'bg-blue-600 text-white border-blue-400 font-bold shadow-md'
                            : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={handleExecuteSelectQuery}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg transition-colors"
              >
                <Play className="w-4 h-4" />
                Eksekusi Query SQL SELECT
              </button>
            </div>
          )}

          {/* ========================================================= */}
          {/* PUZZLE 10: SQL INSERT SISWA (db_insert_terminal)          */}
          {/* ========================================================= */}
          {puzzleType === 'db_insert_terminal' && (
            <div className="space-y-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
                <div className="text-xs flex items-center justify-between font-sans">
                  <span className="text-emerald-400 font-bold flex items-center gap-1.5 font-sans">
                    <Database className="w-4 h-4" /> Tambah Record: {activeSqlInsertVar.tableName}
                  </span>
                  <span className="text-[10px] text-emerald-300/80 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800 font-mono">
                    Varian #{((variantIndex % 3) + 1)}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-800/40 text-xs text-emerald-200 font-sans">
                  <span className="font-bold">Target Record:</span> {activeSqlInsertVar.targetDesc}
                </div>

                <div className="space-y-2">
                  {activeSqlInsertVar.queryOptions.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => { sounds.playSwitchClick(); setSelectedInsertQuery(item.id); }}
                      className={`w-full p-2.5 rounded-lg border text-left transition-colors ${
                        selectedInsertQuery === item.id
                          ? 'bg-emerald-950 border-emerald-400 text-emerald-200 shadow-md'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850'
                      }`}
                    >
                      <code className="block font-bold">{item.query}</code>
                      <span className="text-[10px] text-slate-400 font-sans">{item.reason}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleExecuteInsertQuery}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg transition-colors"
              >
                <Database className="w-4 h-4" />
                Eksekusi INSERT INTO Database
              </button>
            </div>
          )}

          {/* ========================================================= */}
          {/* PUZZLE 11: PRIMARY KEY (db_primary_key_console)           */}
          {/* ========================================================= */}
          {puzzleType === 'db_primary_key_console' && (
            <div className="space-y-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="text-xs flex items-center justify-between font-mono">
                  <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5 font-mono">
                    <ShieldCheck className="w-4 h-4" /> PEMILIHAN PRIMARY KEY: {activePkVar.tableName}
                  </span>
                  <span className="text-[10px] text-amber-300/80 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800">
                    Varian #{((variantIndex % 3) + 1)}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-amber-950/30 border border-amber-800/40 text-xs text-amber-200">
                  <span className="font-bold">Kasus:</span> {activePkVar.tableDesc}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  {activePkVar.fields.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => { sounds.playSwitchClick(); setSelectedPrimaryKey(item.id); }}
                      className={`p-3 rounded-xl border text-left transition-colors ${
                        selectedPrimaryKey === item.id
                          ? 'bg-amber-950 border-amber-400 text-amber-200 shadow-md'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850'
                      }`}
                    >
                      <div className="font-bold mb-1 text-xs">{item.name}</div>
                      <div className="text-[10px] text-slate-400">{item.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleTestPrimaryKey}
                className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg transition-colors"
              >
                <ShieldCheck className="w-4 h-4" />
                Tetapkan Sebagai Primary Key
              </button>
            </div>
          )}

          {/* ========================================================= */}
          {/* PUZZLE 12: ARRAY 0 & FLOWCHART (math_puzzle_safe)         */}
          {/* ========================================================= */}
          {(puzzleType === 'math_puzzle_safe' || (roomId === 4 && !objectId.includes('stack') && !objectId.includes('git'))) && (
            <div className="space-y-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2.5 font-mono text-xs">
                <div className="text-xs flex items-center justify-between font-sans">
                  <span className="text-emerald-400 font-bold flex items-center gap-1.5 font-sans">
                    <Layers className="w-4 h-4" /> 1. Akses Elemen Array:
                  </span>
                  <span className="text-[10px] text-emerald-300/80 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800 font-mono">
                    Varian #{((variantIndex % 3) + 1)}
                  </span>
                </div>

                <div className="bg-slate-900 p-2.5 rounded-lg text-slate-200 border border-slate-800">
                  <code>let {activeArrayVar.arrayVarName} = {JSON.stringify(activeArrayVar.items)};</code>
                  <div className="text-emerald-300 font-sans text-xs mt-1">
                    Target: Ambil nilai <span className="font-bold underline">{activeArrayVar.items[activeArrayVar.targetElementIndex]}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activeArrayVar.indexOptions.map((opt) => {
                    const codeVal = opt.split(' ')[0];
                    return (
                      <button
                        key={opt}
                        onClick={() => { sounds.playSwitchClick(); setSelectedArrayIndex(codeVal); }}
                        className={`py-1.5 px-2 rounded-lg border text-xs transition-colors ${
                          selectedArrayIndex === codeVal
                            ? 'bg-emerald-600 text-white border-emerald-400 shadow-md'
                            : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Part 2: Flowchart Order */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2.5">
                <div className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span>2. Urutan Flowchart Eksekusi Program</span>
                  <button
                    onClick={() => {
                      sounds.playSwitchClick();
                      setFlowchartOrder([...activeArrayVar.flowchartCorrect]);
                    }}
                    className="text-[10px] text-emerald-400 hover:underline"
                  >
                    Urutkan Benar
                  </button>
                </div>

                <div className="flex flex-wrap sm:flex-nowrap items-center gap-1.5 font-mono text-xs">
                  {flowchartOrder.map((step, i) => (
                    <React.Fragment key={step}>
                      <div className={`p-2 rounded-lg border text-center flex-1 font-bold ${
                        flowchartSimulated ? 'bg-emerald-950 border-emerald-500 text-emerald-200' : 'bg-slate-900 border-slate-800 text-slate-300'
                      }`}>
                        <div className="text-[9px] text-slate-500 mb-0.5">Langkah {i + 1}</div>
                        <div className="text-[11px] truncate">{step}</div>
                      </div>
                      {i < 3 && <span className="text-slate-600 font-bold">➔</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <button
                onClick={handleRunArrayProgram}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg transition-colors"
              >
                <Play className="w-4 h-4" />
                Jalankan Program & Buka Brankas Arsip
              </button>
            </div>
          )}

          {/* ========================================================= */}
          {/* PUZZLE 13: STACK VS QUEUE (math_stack_queue)              */}
          {/* ========================================================= */}
          {puzzleType === 'math_stack_queue' && (
            <div className="space-y-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="text-xs flex items-center justify-between font-mono">
                  <span className="text-xs font-bold text-teal-400 flex items-center gap-1.5 font-mono">
                    <Layers className="w-4 h-4" /> STRUKTUR DATA: STACK VS QUEUE
                  </span>
                  <span className="text-[10px] text-teal-300/80 bg-teal-950/80 px-2 py-0.5 rounded border border-teal-800">
                    Varian #{((variantIndex % 3) + 1)}
                  </span>
                </div>

                {/* Kasus 1 */}
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-2">
                  <div className="text-xs text-slate-200 font-semibold">
                    1. {activeStackQueueVar.case1Title}: {activeStackQueueVar.case1Desc}
                  </div>
                  <div className="flex gap-2 text-xs">
                    {[
                      { val: 'STACK', label: 'STACK (LIFO - Last In First Out)' },
                      { val: 'QUEUE', label: 'QUEUE (FIFO - First In First Out)' }
                    ].map((item) => (
                      <button
                        key={item.val}
                        onClick={() => { sounds.playSwitchClick(); setCase1Structure(item.val); }}
                        className={`flex-1 py-1.5 px-2 rounded-lg border transition-colors ${
                          case1Structure === item.val
                            ? 'bg-teal-600 text-white border-teal-400 font-bold shadow-md'
                            : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-850'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Kasus 2 */}
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-2">
                  <div className="text-xs text-slate-200 font-semibold">
                    2. {activeStackQueueVar.case2Title}: {activeStackQueueVar.case2Desc}
                  </div>
                  <div className="flex gap-2 text-xs">
                    {[
                      { val: 'STACK', label: 'STACK (LIFO - Last In First Out)' },
                      { val: 'QUEUE', label: 'QUEUE (FIFO - First In First Out)' }
                    ].map((item) => (
                      <button
                        key={item.val}
                        onClick={() => { sounds.playSwitchClick(); setCase2Structure(item.val); }}
                        className={`flex-1 py-1.5 px-2 rounded-lg border transition-colors ${
                          case2Structure === item.val
                            ? 'bg-teal-600 text-white border-teal-400 font-bold shadow-md'
                            : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-850'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={handleTestStackQueue}
                className="w-full py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg transition-colors"
              >
                <Layers className="w-4 h-4" />
                Validasi Struktur Data
              </button>
            </div>
          )}

          {/* ========================================================= */}
          {/* PUZZLE 14: GIT WORKFLOW (math_git_terminal)               */}
          {/* ========================================================= */}
          {puzzleType === 'math_git_terminal' && (
            <div className="space-y-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
                <div className="text-xs flex items-center justify-between font-sans">
                  <span className="text-rose-400 font-bold flex items-center gap-1.5 font-sans">
                    <GitBranch className="w-4 h-4" /> Git Version Control 3-Tahap
                  </span>
                  <span className="text-[10px] text-rose-300/80 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-800 font-mono">
                    Varian #{((variantIndex % 3) + 1)}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-rose-950/30 border border-rose-800/40 text-xs text-rose-200 font-sans">
                  <span className="font-bold">Target Alur:</span> {activeGitVar.description}
                </div>

                <div className="space-y-2 font-sans">
                  {/* Step 1 */}
                  <div>
                    <label className="text-slate-300 text-xs font-semibold block mb-1">
                      1. Menambahkan file ke Staging Area:
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2 font-mono">
                      {activeGitVar.steps.step1.options.map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => { sounds.playSwitchClick(); setGitStep1(opt.id); }}
                          className={`flex-1 p-2 rounded-lg border text-left text-xs transition-colors ${
                            gitStep1 === opt.id
                              ? 'bg-rose-950 border-rose-400 text-rose-200 shadow-md'
                              : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-850'
                          }`}
                        >
                          {opt.cmd}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div>
                    <label className="text-slate-300 text-xs font-semibold block mb-1">
                      2. Menyimpan snapshot ke riwayat commit lokal:
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2 font-mono">
                      {activeGitVar.steps.step2.options.map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => { sounds.playSwitchClick(); setGitStep2(opt.id); }}
                          className={`flex-1 p-2 rounded-lg border text-left text-xs transition-colors ${
                            gitStep2 === opt.id
                              ? 'bg-rose-950 border-rose-400 text-rose-200 shadow-md'
                              : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-850'
                          }`}
                        >
                          {opt.cmd}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div>
                    <label className="text-slate-300 text-xs font-semibold block mb-1">
                      3. Mengunggah commit ke server GitHub/GitLab:
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2 font-mono">
                      {activeGitVar.steps.step3.options.map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => { sounds.playSwitchClick(); setGitStep3(opt.id); }}
                          className={`flex-1 p-2 rounded-lg border text-left text-xs transition-colors ${
                            gitStep3 === opt.id
                              ? 'bg-rose-950 border-rose-400 text-rose-200 shadow-md'
                              : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-850'
                          }`}
                        >
                          {opt.cmd}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleTestGitWorkflow}
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg transition-colors"
              >
                <GitBranch className="w-4 h-4" />
                Eksekusi Alur Kerja Git Push
              </button>
            </div>
          )}

          {/* ========================================================= */}
          {/* FEEDBACK NOTIFICATION BANNER                              */}
          {/* ========================================================= */}
          {feedback && (
            <div className={`p-3 rounded-xl border flex items-start gap-2.5 text-xs ${
              feedback.type === 'success'
                ? 'bg-emerald-950/80 border-emerald-500/70 text-emerald-200'
                : feedback.type === 'error'
                ? 'bg-rose-950/80 border-rose-500/70 text-rose-200'
                : 'bg-amber-950/80 border-amber-500/70 text-amber-200'
            }`}>
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              )}
              <div>{feedback.message}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
