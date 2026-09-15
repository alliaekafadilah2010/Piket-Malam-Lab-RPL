/**
 * PIKET MALAM: LAB RPL
 * "Logika coding adalah satu-satunya senter yang kamu punya."
 * Game Design Document v1.0 implementation.
 */

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { 
  Flashlight, 
  Eye, 
  BookOpen, 
  Terminal, 
  Award, 
  Play, 
  Info, 
  Volume2, 
  VolumeX, 
  RotateCcw,
  Sparkles,
  HelpCircle,
  ShieldAlert,
  Share2,
  Check,
  Home,
  Heart,
  Skull
} from 'lucide-react';
import { 
  PlayerState, 
  RoomDef, 
  InteractiveObject, 
  JournalPage, 
  RoomScoreStat, 
  GameReport, 
  SubjectCategory 
} from './types/game';
import { INITIAL_ROOMS, JOURNAL_PAGES, BIP_HINTS } from './data/gameData';
import { sounds } from './utils/sound';
import { TopHUD } from './components/TopHUD';
import { GameCanvas } from './components/GameCanvas';
import { JournalViewer } from './components/JournalViewer';
import { BipDialog } from './components/BipDialog';
import { InteractivePuzzleModal } from './components/InteractivePuzzleModal';
import { GalatTrialModal } from './components/GalatTrialModal';
import { RaporBayanganModal } from './components/RaporBayanganModal';
import { GameOverModal } from './components/GameOverModal';
import { TouchControls } from './components/TouchControls';
import { JumpscareOverlay } from './components/JumpscareOverlay';
import { StoryIntroModal } from './components/StoryIntroModal';
import { GameGuideModal } from './components/GameGuideModal';

export default function App() {
  // Game Screen State
  const [gameState, setGameState] = useState<'title' | 'playing' | 'guide'>('title');

  // Rooms and Journal State
  const [rooms, setRooms] = useState<RoomDef[]>(INITIAL_ROOMS);
  const [journalPages, setJournalPages] = useState<JournalPage[]>(JOURNAL_PAGES);
  const [hasUnreadJournal, setHasUnreadJournal] = useState(false);

  // Player State
  const [playerState, setPlayerState] = useState<PlayerState>({
    x: 90,
    y: 210,
    direction: 'right',
    isMoving: false,
    battery: 100,
    focus: 3,
    flashlightOn: true,
    lensaNalarActive: false,
    archiveShards: [],
    foundJournalPages: [1],
    currentRoomId: 0,
    speed: 2.6,
  });

  // Current Room
  const currentRoom = rooms.find((r) => r.id === playerState.currentRoomId) || rooms[0];

  // Active Modals
  const [activeModal, setActiveModal] = useState<
    'none' | 'journal' | 'bip' | 'puzzle' | 'galat_trial' | 'report' | 'game_over' | 'jumpscare'
  >('none');
  const [activePuzzleObj, setActivePuzzleObj] = useState<InteractiveObject | null>(null);

  // Audio mute and horror BGM state
  const [isMuted, setIsMuted] = useState(false);
  const [isBgmActive, setIsBgmActive] = useState(true);

  // Ghost proximity danger state
  const [isGhostNear, setIsGhostNear] = useState(false);
  const [ghostProximityRatio, setGhostProximityRatio] = useState(0);
  const [jumpscareGhostName, setJumpscareGhostName] = useState('MISKONSEPSI FATAL');

  // Story Intro Sequence State
  const [showStoryIntro, setShowStoryIntro] = useState(false);

  // Jump trigger state
  const [jumpTrigger, setJumpTrigger] = useState<number>(0);
  const handleJump = useCallback(() => {
    setJumpTrigger((v) => v + 1);
  }, []);

  // Proximity object
  const [nearbyObject, setNearbyObject] = useState<InteractiveObject | null>(null);

  // Room scoring tracker
  const [roomStats, setRoomStats] = useState<{ [roomId: number]: RoomScoreStat }>({
    1: { roomId: 1, subject: 'fisika', attempts: 0, hintsUsed: 0, focusLost: 0, batteryRemaining: 100, journalsFound: 1, optionalPuzzlesSolved: 0, basePoints: 1000, purityMultiplier: 1.5, totalScore: 0 },
    2: { roomId: 2, subject: 'kimia', attempts: 0, hintsUsed: 0, focusLost: 0, batteryRemaining: 100, journalsFound: 1, optionalPuzzlesSolved: 0, basePoints: 1000, purityMultiplier: 1.5, totalScore: 0 },
    3: { roomId: 3, subject: 'logika', attempts: 0, hintsUsed: 0, focusLost: 0, batteryRemaining: 100, journalsFound: 1, optionalPuzzlesSolved: 0, basePoints: 1000, purityMultiplier: 1.5, totalScore: 0 },
    4: { roomId: 4, subject: 'matematika', attempts: 0, hintsUsed: 0, focusLost: 0, batteryRemaining: 100, journalsFound: 1, optionalPuzzlesSolved: 0, basePoints: 1000, purityMultiplier: 1.5, totalScore: 0 },
  });

  // Final Report Data
  const [finalReport, setFinalReport] = useState<GameReport | null>(null);

  // Story Notification Banner
  const [notification, setNotification] = useState<string | null>(
    '18:04 WIB — Lampu padam di SMK Bhakti Nusantara. Nyalakan senter [F] dan cari jurnal!'
  );

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification((curr) => (curr === msg ? null : curr));
    }, 4500);
  };

  // Battery drain loop
  useEffect(() => {
    if (gameState !== 'playing' || activeModal !== 'none') return;

    const interval = setInterval(() => {
      setPlayerState((prev) => {
        if (prev.battery <= 0) return prev;
        // Battery drains slowly with senter on (0.25%/s), and 3x faster with Lensa Nalar (0.75%/s)
        const drain = prev.lensaNalarActive ? 0.75 : prev.flashlightOn ? 0.25 : 0.05;
        const newBat = Math.max(0, prev.battery - drain);

        if (newBat <= 15 && prev.battery > 15) {
          showNotification('Baterai senter melemah (<15%)! Cari baterai cadangan!');
        }
        return { ...prev, battery: newBat };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState, activeModal]);

  // Update Player state helper
  const updatePlayer = useCallback((updates: Partial<PlayerState>) => {
    setPlayerState((prev) => ({ ...prev, ...updates }));
  }, []);

  // Room Switching with strict level progression validation
  const handleSelectRoom = (newRoomId: number) => {
    // If moving forward to a subsequent level, ensure all previous rooms have all puzzles solved
    if (newRoomId > playerState.currentRoomId) {
      for (let rId = 0; rId < newRoomId; rId++) {
        const checkRoom = rooms.find((r) => r.id === rId);
        if (checkRoom) {
          const roomPuzzles = checkRoom.objects.filter((o) => o.type === 'puzzle');
          const unsolved = roomPuzzles.filter((p) => !p.solved);
          if (unsolved.length > 0) {
            sounds.playConceptMistake();
            showNotification(
              `🔒 Level terkunci! Selesaikan SEMUA ${roomPuzzles.length} teka-teki di ${checkRoom.name} terlebih dahulu (tersisa ${unsolved.length} teka-teki).`
            );
            return;
          }
        }
      }
    }

    // Check if Aula is locked
    if (newRoomId === 5 && playerState.archiveShards.length < 4) {
      sounds.playConceptMistake();
      showNotification('🔒 Pintu Aula Sidang GALAT terkunci rapat! Selesaikan semua teka-teki & kumpulkan 4 Serpihan Arsip untuk membuka.');
      return;
    }

    const targetRoom = rooms.find((r) => r.id === newRoomId);
    if (!targetRoom) return;

    sounds.playFlashlight();
    setPlayerState((prev) => ({
      ...prev,
      currentRoomId: newRoomId,
      x: targetRoom.playerSpawn.x,
      y: targetRoom.playerSpawn.y,
    }));
    showNotification(`Memasuki: ${targetRoom.name}`);
  };

  // Object Interaction Handler
  const handleInteractWithObject = (obj: InteractiveObject) => {
    sounds.playFlashlight();

    if (obj.type === 'journal' && obj.journalPageId) {
      // Pick up journal
      sounds.playPageTurn();
      const pageId = obj.journalPageId;
      if (!playerState.foundJournalPages.includes(pageId)) {
        setPlayerState((prev) => ({
          ...prev,
          foundJournalPages: [...prev.foundJournalPages, pageId],
        }));
        setHasUnreadJournal(true);
        showNotification(`Halaman Jurnal Bu Rani #${pageId} ditemukan! Tekan [J] untuk membaca.`);
      }
      setActiveModal('journal');
      return;
    }

    if (obj.type === 'battery') {
      sounds.playPuzzleSolved();
      setPlayerState((prev) => ({
        ...prev,
        battery: Math.min(100, prev.battery + 50),
      }));
      // Remove battery from room
      setRooms((prevRooms) =>
        prevRooms.map((r) =>
          r.id === playerState.currentRoomId
            ? { ...r, objects: r.objects.filter((o) => o.id !== obj.id) }
            : r
        )
      );
      showNotification('Baterai cadangan diambil! Daya senter bertambah +50%!');
      return;
    }

    if (obj.type === 'bip_terminal') {
      sounds.playBipBlip();
      setActiveModal('bip');
      return;
    }

    if (obj.type === 'door') {
      const curId = playerState.currentRoomId;

      // Handle BACK doors to previous room
      if (obj.id.includes('back')) {
        if (curId === 1) handleSelectRoom(0);
        else if (curId === 2) handleSelectRoom(1);
        else if (curId === 3) handleSelectRoom(2);
        else if (curId === 4) handleSelectRoom(3);
        else if (curId === 5) handleSelectRoom(4);
        return;
      }

      // Handle FORWARD / EXIT doors - ALL PUZZLES IN CURRENT ROOM MUST BE SOLVED
      const roomPuzzles = currentRoom.objects.filter((o) => o.type === 'puzzle');
      const unsolvedPuzzles = roomPuzzles.filter((o) => !o.solved);

      if (unsolvedPuzzles.length > 0) {
        sounds.playHeartbeat();
        const names = unsolvedPuzzles.map((p) => `"${p.label}"`).join(', ');
        showNotification(
          `🔒 PINTU TERKUNCI! Semua teka-teki harus selesai agar bisa ke level selanjutnya! Masih tersisa ${unsolvedPuzzles.length} teka-teki: ${names}`
        );
        return;
      }

      // If all puzzles in current room are solved:
      if (curId === 0) {
        handleSelectRoom(1);
        return;
      }

      if (curId === 1) {
        handleSelectRoom(2);
        return;
      }

      if (curId === 2) {
        handleSelectRoom(3);
        return;
      }

      if (curId === 3) {
        handleSelectRoom(4);
        return;
      }

      if (curId === 4) {
        if (playerState.archiveShards.length < 4) {
          sounds.playHeartbeat();
          showNotification('🔒 Pintu Aula Sidang GALAT terkunci! Pastikan 4 Serpihan Arsip telah terkumpul.');
          return;
        }
        handleSelectRoom(5);
        return;
      }

      if (curId === 5) {
        setActiveModal('galat_trial');
        return;
      }
      return;
    }

    if (obj.type === 'puzzle') {
      if (playerState.currentRoomId === 5) {
        setActiveModal('galat_trial');
      } else {
        setActivePuzzleObj(obj);
        setActiveModal('puzzle');
      }
      return;
    }
  };

  // Conceptual Mistake Handler (Ghost advances 1 step)
  const handleConceptualMistake = (reason: string) => {
    sounds.playHeartbeat();
    showNotification(`MISKONSEPSI: ${reason} (Hantu mendekat 1 langkah!)`);

    // Record attempt for scoring
    const curId = playerState.currentRoomId;
    if (roomStats[curId]) {
      setRoomStats((prev) => {
        const attempts = prev[curId].attempts + 1;
        let mult = 1.5;
        if (attempts >= 7) mult = 0.6;
        else if (attempts >= 4) mult = 1.0;
        else if (attempts >= 2) mult = 1.2;
        return {
          ...prev,
          [curId]: {
            ...prev[curId],
            attempts,
            purityMultiplier: mult,
          },
        };
      });
    }

    // Advance ghost in current room
    setRooms((prevRooms) =>
      prevRooms.map((r) => {
        if (r.id === playerState.currentRoomId && r.ghost && !r.ghost.isDissolved) {
          const nextSteps = r.ghost.steps + 1;
          if (nextSteps >= 3) {
            // Ghost caught Nara!
            setTimeout(() => handleGhostCaught(), 400);
            return {
              ...r,
              ghost: { ...r.ghost, steps: 0 },
            };
          }
          return {
            ...r,
            ghost: { ...r.ghost, steps: nextSteps },
          };
        }
        return r;
      })
    );
  };

  // Ghost Proximity Damage Handler (when player steps too close to ghost)
  const handlePlayerTakeDamage = (source: string) => {
    setPlayerState((prev) => {
      const nextFocus = Math.max(0, prev.focus - 1);
      const curId = prev.currentRoomId;

      // Track focus lost in stats
      if (roomStats[curId]) {
        setRoomStats((rs) => ({
          ...rs,
          [curId]: {
            ...rs[curId],
            focusLost: rs[curId].focusLost + 1,
            purityMultiplier: Math.max(0.5, rs[curId].purityMultiplier - 0.2),
          },
        }));
      }

      if (nextFocus <= 0) {
        // Trigger Jumpscare horror overlay before Game Over!
        setJumpscareGhostName(source || 'MISKONSEPSI FATAL');
        setActiveModal('jumpscare');
        showNotification('💀 FOKUS NARA HANCUR! Hantu menerkam kesadaranmu!');
        return {
          ...prev,
          focus: 0,
        };
      }

      showNotification(`⚠️ Hantu ${source} menyerang! Kehilangan 1 Fokus (Sisa: ${nextFocus}). Segera menjauh!`);
      return {
        ...prev,
        focus: nextFocus,
      };
    });
  };

  // Ghost catches Nara
  const handleGhostCaught = () => {
    sounds.playHeartbeat();
    const gName = currentRoom.ghost?.name || 'MISKONSEPSI FATAL';

    setPlayerState((prev) => {
      const nextFocus = Math.max(0, prev.focus - 1);
      const curId = prev.currentRoomId;

      if (roomStats[curId]) {
        setRoomStats((rs) => ({
          ...rs,
          [curId]: {
            ...rs[curId],
            focusLost: rs[curId].focusLost + 1,
            purityMultiplier: Math.max(0.5, rs[curId].purityMultiplier - 0.3),
          },
        }));
      }

      if (nextFocus <= 0) {
        // Trigger Jumpscare horror overlay before Game Over!
        setJumpscareGhostName(gName);
        setActiveModal('jumpscare');
        showNotification('Semua Fokus habis! Pikiran Nara kewalahan oleh bug miskonsepsi.');
        return {
          ...prev,
          focus: 0,
        };
      }
      showNotification(`Hantu ${gName} menjangkau pikiranmu! Kehilangan 1 Fokus.`);
      return {
        ...prev,
        focus: nextFocus,
        x: currentRoom.playerSpawn.x,
        y: currentRoom.playerSpawn.y,
      };
    });
  };

  // Puzzle Solved Handler with strict all-puzzles room progression tracking
  const handlePuzzleSolved = () => {
    sounds.playPuzzleSolved();
    setActiveModal('none');

    const curId = playerState.currentRoomId;
    const puzzleId = activePuzzleObj?.id || '';

    // Calculate remaining puzzles in current room
    const roomPuzzles = currentRoom.objects.filter((o) => o.type === 'puzzle');
    const remainingBefore = roomPuzzles.filter((o) => o.id !== puzzleId && !o.solved);
    const isAllRoomPuzzlesSolved = remainingBefore.length === 0;
    const totalPuzzles = roomPuzzles.length;

    let shardAwarded: string | null = null;
    let bonusBattery = 25;

    if (curId === 0) {
      if (puzzleId === 'tut_network_router') {
        bonusBattery = 35;
      }
      if (isAllRoomPuzzlesSolved) {
        showNotification('🎉 SEMUA 2 TEKA-TEKI SELESAI! Daya server aktif & Router Gateway siap. Pintu Lab Web kini TERBUKA!');
      } else {
        showNotification(`Teka-teki selesai! Selesaikan ${remainingBefore.length} teka-teki lagi di koridor ini agar pintu terbuka.`);
      }
    } else if (curId === 1) {
      if (isAllRoomPuzzlesSolved) {
        shardAwarded = 'Serpihan Arsip Web (HTML/CSS)';
        showNotification('🎉 SEMUA 3 TEKA-TEKI LAB WEB SELESAI! Hantu Syntax terurai & Serpihan Web didapat. Pintu Lab Algoritma kini TERBUKA!');
      } else {
        showNotification(`Teka-teki web selesai (+25% Baterai)! Tersisa ${remainingBefore.length} teka-teki lagi untuk membuka pintu level selanjutnya.`);
      }
    } else if (curId === 2) {
      if (isAllRoomPuzzlesSolved) {
        shardAwarded = 'Serpihan Arsip Percabangan (If-Else)';
        showNotification('🎉 SEMUA 3 TEKA-TEKI LAB ALGORITMA SELESAI! Hantu If-Else terurai & Serpihan didapat. Pintu Lab Basis Data kini TERBUKA!');
      } else {
        showNotification(`Teka-teki algoritma selesai (+25% Baterai)! Tersisa ${remainingBefore.length} teka-teki lagi untuk membuka pintu level selanjutnya.`);
      }
    } else if (curId === 3) {
      if (isAllRoomPuzzlesSolved) {
        shardAwarded = 'Serpihan Arsip Basis Data (SQL)';
        showNotification('🎉 SEMUA 3 TEKA-TEKI BASIS DATA SELESAI! Si Null terurai & Serpihan didapat. Pintu Lab Struktur Data kini TERBUKA!');
      } else {
        showNotification(`Teka-teki database selesai (+25% Baterai)! Tersisa ${remainingBefore.length} teka-teki lagi untuk membuka pintu level selanjutnya.`);
      }
    } else if (curId === 4) {
      if (isAllRoomPuzzlesSolved) {
        shardAwarded = 'Serpihan Arsip Struktur Data (Array)';
        showNotification('🎉 SEMUA 3 TEKA-TEKI STRUKTUR DATA SELESAI! Nyai Array terurai. 4 Serpihan lengkap, Pintu Aula Sidang GALAT kini TERBUKA!');
      } else {
        showNotification(`Teka-teki struktur data selesai (+25% Baterai)! Tersisa ${remainingBefore.length} teka-teki lagi untuk membuka Aula Sidang.`);
      }
    }

    // Shard mapping for rooms 1-4
    const roomShardMap: Record<number, string> = {
      1: 'Serpihan Arsip Web (HTML/CSS)',
      2: 'Serpihan Arsip Percabangan (If-Else)',
      3: 'Serpihan Arsip Basis Data (SQL)',
      4: 'Serpihan Arsip Struktur Data (Array)',
    };
    const finalShard = shardAwarded || (isAllRoomPuzzlesSolved ? roomShardMap[curId] : null);

    // Award shard if available and not yet in inventory
    if (finalShard && !playerState.archiveShards.includes(finalShard)) {
      setPlayerState((prev) => ({
        ...prev,
        battery: Math.min(100, prev.battery + bonusBattery),
        archiveShards: [...prev.archiveShards, finalShard],
      }));
    } else {
      setPlayerState((prev) => ({
        ...prev,
        battery: Math.min(100, prev.battery + bonusBattery),
      }));
    }

    // Dissolve ghost if all room puzzles are solved, and mark current object as solved
    setRooms((prevRooms) =>
      prevRooms.map((r) =>
        r.id === curId
          ? {
              ...r,
              ghost: isAllRoomPuzzlesSolved && r.ghost ? { ...r.ghost, isDissolved: true } : r.ghost,
              objects: r.objects.map((o) =>
                o.id === puzzleId ? { ...o, solved: true } : o
              ),
            }
          : r
      )
    );
  };

  // BIP Hint Request
  const handleRequestBipHint = () => {
    setPlayerState((prev) => ({
      ...prev,
      battery: Math.max(0, prev.battery - 15),
    }));
    const curId = playerState.currentRoomId;
    if (roomStats[curId]) {
      setRoomStats((prev) => ({
        ...prev,
        [curId]: { ...prev[curId], hintsUsed: prev[curId].hintsUsed + 1 },
      }));
    }
  };

  // Victory in Aula Sidang GALAT -> Generate Rapor Bayangan
  const handleVictory = () => {
    setActiveModal('none');

    // Calculate score per room using GDD formula
    let totalScore = 0;
    let puritySum = 0;
    const subjectPercentages = {
      fisika: 75,
      kimia: 75,
      logika: 75,
      matematika: 75,
    };

    [1, 2, 3, 4].forEach((roomId) => {
      const s = roomStats[roomId];
      if (s) {
        // Base 1000 * purity + battery bonus + exploration - penalties
        const roomScore = Math.max(
          0,
          Math.round(
            1000 * s.purityMultiplier +
              playerState.battery * 5 +
              playerState.foundJournalPages.length * 100 -
              s.hintsUsed * 150 -
              s.focusLost * 300
          )
        );
        totalScore += roomScore;
        puritySum += s.purityMultiplier;
        const pct = Math.min(100, Math.round((s.purityMultiplier / 1.5) * 100));
        if (s.subject === 'fisika') subjectPercentages.fisika = pct;
        if (s.subject === 'kimia') subjectPercentages.kimia = pct;
        if (s.subject === 'logika') subjectPercentages.logika = pct;
        if (s.subject === 'matematika') subjectPercentages.matematika = pct;
      }
    });

    const purityAvg = puritySum / 4;

    // Determine Rank
    let rank: 'E' | 'D' | 'C' | 'B' | 'A' | 'S' = 'C';
    let endingType: 'kabur' | 'terurai' | 'arsip_murni' = 'kabur';

    if (totalScore >= 9000 && playerState.foundJournalPages.length >= 5) {
      rank = 'S';
      endingType = 'arsip_murni';
    } else if (totalScore >= 7500) {
      rank = 'A';
      endingType = 'terurai';
    } else if (totalScore >= 6000) {
      rank = 'B';
      endingType = 'terurai';
    } else if (totalScore >= 4500) {
      rank = 'C';
      endingType = 'kabur';
    } else if (totalScore >= 3000) {
      rank = 'D';
      endingType = 'kabur';
    } else {
      rank = 'E';
      endingType = 'kabur';
    }

    // Teacher diagnosis and personalized advice
    const teacherDiagnosis =
      purityAvg >= 1.3
        ? 'Nara membuktikan penalaran logika tingkat tinggi! Kamu membaca catatan konsep sebelum bertindak, menganalisis struktur kode dengan cermat, dan tidak terburu-buru asal coba. Sikap inilah programmer sejati.'
        : purityAvg >= 1.0
        ? 'Nalaranmu cukup stabil. Ada beberapa percobaan yang masih bersifat coba-coba (terutama saat menyusun percabangan dan query basis data), namun kamu cepat mengoreksi diri.'
        : 'Kamu sering kali mengambil aksi sebelum memahami betul struktur dan logika kode. Jangan ragu membaca jurnal dan mengamati Lensa Nalar terlebih dahulu!';

    const recommendations = [
      'Pahami tag berpasangan HTML: Elemen seperti <button> wajib ditutup dengan </button> agar DOM tidak bocor.',
      'Logika percabangan IF-ELSE: Pastikan kondisi boolean bernilai TRUE untuk mengeksekusi blok if.',
      'Gunakan klausa WHERE pada SQL untuk menyaring data spesifik secara aman dan efisien.',
      'Ingat prinsip memori array 0-based: Elemen urutan pertama selalu diambil dengan indeks [0].',
    ];

    setFinalReport({
      subjectScores: subjectPercentages,
      totalPoints: totalScore,
      rank,
      endingType,
      purityAverage: purityAvg,
      teacherDiagnosis,
      recommendations,
    });

    setActiveModal('report');
  };

  // Restart Game
  const handleRestart = () => {
    setRooms(INITIAL_ROOMS);
    setPlayerState({
      x: 90,
      y: 210,
      direction: 'right',
      isMoving: false,
      battery: 100,
      focus: 3,
      flashlightOn: true,
      lensaNalarActive: false,
      archiveShards: [],
      foundJournalPages: [1],
      currentRoomId: 0,
      speed: 2.6,
    });
    setActiveModal('none');
    setFinalReport(null);
    setGameState('playing');
    showNotification('Piket malam dimulai kembali. Logika coding adalah satu-satunya senter yang kamu punya.');
  };

  // Revive player with 3 focus in current room
  const handleRevive = () => {
    setPlayerState((prev) => ({
      ...prev,
      focus: 3,
      x: currentRoom.playerSpawn.x,
      y: currentRoom.playerSpawn.y,
    }));
    // Reset ghost steps in the room
    setRooms((prev) =>
      prev.map((r) => {
        if (r.id === playerState.currentRoomId && r.ghost) {
          return { ...r, ghost: { ...r.ghost, steps: 0 } };
        }
        return r;
      })
    );
    setActiveModal('none');
    sounds.playFlashlight();
    showNotification('Nara memulihkan fokusnya (3 Nyawa). Jangan ulangi kesalahan logika yang sama!');
  };

  const handleJumpscareFinish = useCallback(() => {
    setActiveModal('game_over');
  }, []);

  // Return to Title Menu
  const handleReturnToTitle = () => {
    setActiveModal('none');
    setGameState('title');
  };

  // Share Game Link
  const handleShareGame = async () => {
    const shareUrl = window.location.href;
    const shareData = {
      title: 'Piket Malam: Lab RPL',
      text: 'Ayo uji logika coding HTML, If-Else, SQL, dan Array-mu di game horor edukatif Piket Malam: Lab RPL!',
      url: shareUrl,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        showNotification('Tautan game berhasil dibagikan!');
        return;
      } catch {
        // Fallback to clipboard
      }
    }
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(shareUrl);
      showNotification('🔗 Tautan game disalin ke clipboard! Bagikan ke teman atau gurumu.');
    }
  };

  // Trigger Story Intro sequence before game begins
  const handleInitiateGame = () => {
    sounds.playSwitchClick();
    setShowStoryIntro(true);
  };

  // Start horror backsound & ambience when playing begins
  const handleStartGame = () => {
    sounds.startAmbience();
    if (isBgmActive) {
      sounds.startBgm();
    }
    sounds.playFlashlight();
    setGameState('playing');
  };

  const handleToggleBgm = () => {
    const next = sounds.toggleBgm();
    setIsBgmActive(next);
    showNotification(next ? 'Soundtrack Horor diaktifkan.' : 'Soundtrack Horor dimatikan.');
  };

  const handleToggleMute = () => {
    const muted = sounds.toggleMute();
    setIsMuted(muted);
  };

  // Calculate unlock status and puzzle count for all rooms
  const roomStatusList = useMemo(() => {
    return rooms.map((r, idx) => {
      const puzzles = r.objects.filter((o) => o.type === 'puzzle');
      const solved = puzzles.filter((p) => p.solved).length;
      const total = puzzles.length;

      // Room is unlocked if every preceding room has ALL its puzzles solved
      let isUnlocked = true;
      for (let prevIdx = 0; prevIdx < idx; prevIdx++) {
        const prevRoom = rooms[prevIdx];
        const prevPuzzles = prevRoom.objects.filter((o) => o.type === 'puzzle');
        if (prevPuzzles.some((p) => !p.solved)) {
          isUnlocked = false;
          break;
        }
      }

      // Aula Sidang GALAT (room 5) also requires 4 shards
      if (r.id === 5 && playerState.archiveShards.length < 4) {
        isUnlocked = false;
      }

      return {
        id: r.id,
        name: r.name,
        isUnlocked,
        solvedPuzzles: solved,
        totalPuzzles: total,
      };
    });
  }, [rooms, playerState.archiveShards]);

  const currentRoomPuzzles = currentRoom.objects.filter((o) => o.type === 'puzzle');
  const currentRoomPuzzlesSolved = currentRoomPuzzles.filter((p) => p.solved).length;
  const currentRoomPuzzlesTotal = currentRoomPuzzles.length;

  return (
    <div className="relative w-screen h-screen bg-[#0B1026] text-[#EDE6D6] flex flex-col font-sans-ui overflow-hidden select-none">
      {/* TITLE SCREEN (Focused strictly on dramatic title visuals, separate from game info) */}
      {gameState === 'title' && (
        <div className="relative flex-1 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-[#050714] via-[#0b1026] to-[#040610] text-center overflow-hidden">
          {/* Atmospheric ambient lighting & background glow */}
          <div className="absolute top-1/4 w-[500px] h-[500px] rounded-full bg-red-950/25 blur-3xl pointer-events-none animate-pulse" />
          <div className="absolute -bottom-10 -right-10 w-96 h-96 rounded-full bg-[#5FE1B0]/10 blur-3xl pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_25%,rgba(4,6,16,0.95)_100%)] pointer-events-none" />

          <div className="relative z-10 max-w-xl space-y-6">
            {/* Ominous location badge */}
            <div className="inline-flex items-center space-x-2 bg-red-950/50 border border-red-500/40 px-4 py-1.5 rounded-full text-xs text-red-300 font-mono tracking-widest shadow-[0_0_15px_rgba(239,68,68,0.25)]">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span>LAB KOMPUTER RPL LANTAI 3 · SMK BHAKTI NUSANTARA</span>
            </div>

            {/* Visual Title Header */}
            <div className="space-y-2">
              <h1 className="text-5xl sm:text-7xl font-pixel-heading font-black tracking-tight text-white drop-shadow-[0_0_30px_rgba(232,93,117,0.45)]">
                PIKET MALAM
              </h1>
              <div className="text-sm sm:text-base font-mono tracking-[0.3em] uppercase text-[#E85D75] font-bold">
                Misteri Bug & Miskonsepsi Fatal
              </div>
            </div>

            {/* Centerpiece Atmospheric Visual Box */}
            <div className="py-2 flex items-center justify-center">
              <div className="relative p-5 bg-[#16213E]/60 rounded-2xl border border-gray-700/80 shadow-2xl backdrop-blur-md hover:border-[#5FE1B0]/50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="p-3.5 bg-red-950/70 rounded-xl border border-red-500/50 text-red-400">
                    <Skull className="w-8 h-8 animate-pulse" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-mono text-gray-400">STATUS RUANGAN 18:04 WIB</div>
                    <div className="text-sm font-bold text-gray-200">Gerbang Besi Terkunci Otomatis</div>
                    <div className="text-[11px] text-[#5FE1B0] font-mono">Lampu Plafon: MATI TOTAL</div>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-sm sm:text-base text-amber-200/90 font-journal italic tracking-wide">
              "Logika coding adalah satu-satunya sentermu di kegelapan."
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={handleInitiateGame}
                className="w-full sm:w-auto px-8 py-3.5 bg-[#5FE1B0] hover:bg-[#7ff3c6] text-[#0B1026] font-extrabold text-sm sm:text-base rounded-xl shadow-[0_0_25px_rgba(95,225,176,0.45)] transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center space-x-2.5"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>Mulai Penyelidikan</span>
              </button>

              <button
                onClick={() => setGameState('guide')}
                className="w-full sm:w-auto px-6 py-3.5 bg-[#16213E]/90 hover:bg-[#1f2b50] text-[#EDE6D6] border border-gray-700 hover:border-gray-500 font-bold text-sm rounded-xl transition-colors flex items-center justify-center space-x-2"
              >
                <Info className="w-4 h-4 text-[#F2C14E]" />
                <span>Keterangan & Panduan Game</span>
              </button>

              <button
                onClick={handleShareGame}
                className="w-full sm:w-auto px-5 py-3.5 bg-[#16213E]/90 hover:bg-[#1f2b50] text-[#F2C14E] border border-[#F2C14E]/40 hover:border-[#F2C14E] font-bold text-sm rounded-xl transition-colors flex items-center justify-center space-x-2 shadow-[0_0_15px_rgba(242,193,78,0.2)]"
                title="Salin tautan game dan bagikan ke teman"
              >
                <Share2 className="w-4 h-4" />
                <span>Bagikan</span>
              </button>
            </div>

            {/* Clean minimalist footer tips */}
            <div className="text-[11px] text-gray-500 font-mono pt-2">
              SMK RPL · Horor Edukasi · Tekan [Spasi] untuk Loncat · [Shift] Lensa Nalar
            </div>
          </div>
        </div>
      )}

      {/* HOW TO PLAY & GAME INFO MODAL (Separated cleanly from title) */}
      {gameState === 'guide' && (
        <GameGuideModal onClose={() => setGameState('title')} />
      )}

      {/* MAIN GAMEPLAY VIEW */}
      {gameState === 'playing' && (
        <div className="relative flex-1 flex flex-col overflow-hidden">
          {/* Top HUD */}
          <TopHUD
            playerState={playerState}
            onToggleFlashlight={() => {
              sounds.playFlashlight();
              updatePlayer({ flashlightOn: !playerState.flashlightOn });
            }}
            onToggleLensaNalar={() => {
              const next = !playerState.lensaNalarActive;
              sounds.setLensaNalarHum(next);
              updatePlayer({ lensaNalarActive: next });
            }}
            onOpenJournal={() => {
              sounds.playPageTurn();
              setHasUnreadJournal(false);
              setActiveModal('journal');
            }}
            onOpenBip={() => {
              sounds.playBipBlip();
              setActiveModal('bip');
            }}
            onToggleMute={handleToggleMute}
            isMuted={isMuted}
            isBgmActive={isBgmActive}
            onToggleBgm={handleToggleBgm}
            isGhostNear={isGhostNear}
            currentRoomName={currentRoom.name}
            roomList={roomStatusList}
            onSelectRoom={handleSelectRoom}
            hasUnreadJournal={hasUnreadJournal}
            currentRoomPuzzlesSolved={currentRoomPuzzlesSolved}
            currentRoomPuzzlesTotal={currentRoomPuzzlesTotal}
            onRestart={handleRestart}
            onShare={handleShareGame}
            onReturnToTitle={handleReturnToTitle}
          />

          {/* Story Notification Pill */}
          {notification && (
            <div className="absolute top-14 left-1/2 -translate-x-1/2 z-30 max-w-md w-[92%] bg-[#16213E]/95 border border-[#F2C14E]/60 text-[#EDE6D6] px-3.5 py-1.5 rounded-full shadow-lg text-xs text-center backdrop-blur-md animate-fade-in flex items-center justify-center space-x-2">
              <Sparkles className="w-3.5 h-3.5 text-[#F2C14E] flex-shrink-0" />
              <span className="truncate">{notification}</span>
            </div>
          )}

          {/* 2D Exploration Canvas */}
          <div className="flex-1 flex items-center justify-center p-1 sm:p-2 pb-14 sm:pb-16 overflow-hidden min-h-0">
            <GameCanvas
              playerState={playerState}
              room={currentRoom}
              onUpdatePlayer={updatePlayer}
              onInteractWithObject={handleInteractWithObject}
              nearbyObject={nearbyObject}
              setNearbyObject={setNearbyObject}
              onGhostCatchesPlayer={handleGhostCaught}
              onPlayerTakeDamage={handlePlayerTakeDamage}
              onGhostProximityChange={(isNear, _dist, ratio) => {
                setIsGhostNear(isNear);
                setGhostProximityRatio(ratio || 0);
              }}
              jumpTrigger={jumpTrigger}
              isPaused={activeModal !== 'none'}
            />
          </div>

          {/* Fullscreen Horror Red Terror Screen Effect when nearing Ghost */}
          {ghostProximityRatio > 0.04 && (
            <div
              className="fixed inset-0 pointer-events-none z-30 transition-opacity duration-100"
              style={{
                opacity: Math.min(1, ghostProximityRatio * 1.3),
                background: `radial-gradient(circle at center, transparent ${Math.max(15, 68 - ghostProximityRatio * 50)}%, rgba(220, 15, 45, ${ghostProximityRatio * 0.72}) 100%)`,
                boxShadow: `inset 0 0 ${Math.floor(ghostProximityRatio * 140)}px rgba(255, 0, 45, ${ghostProximityRatio * 0.85})`,
              }}
            >
              {/* Pulsing blood border effect */}
              <div
                className="absolute inset-0 border-4 sm:border-8 border-red-600/70 animate-pulse pointer-events-none"
                style={{ opacity: ghostProximityRatio > 0.4 ? 0.95 : ghostProximityRatio * 1.6 }}
              />

              {/* Terror Danger Warning Ticker */}
              {ghostProximityRatio > 0.65 && (
                <div className="absolute top-16 sm:top-20 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-red-950/95 border-2 border-red-500 text-red-100 font-mono font-black text-xs sm:text-sm tracking-widest rounded-full uppercase shadow-[0_0_25px_rgba(255,0,0,0.85)] animate-pulse flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                  <span>⚠ BAHAYA: ENTITAS MENDEKAT! LARI! ⚠</span>
                </div>
              )}
            </div>
          )}

          {/* On-Screen Touch Controls & Visual Buttons Toolbar */}
          <TouchControls
            onMoveStart={(dir) => {
              const speed = playerState.lensaNalarActive ? 1.6 : 2.6;
              let dx = 0;
              let dy = 0;
              if (dir === 'up') dy = -speed * 4;
              if (dir === 'down') dy = speed * 4;
              if (dir === 'left') dx = -speed * 4;
              if (dir === 'right') dx = speed * 4;
              updatePlayer({
                x: Math.max(45, Math.min(currentRoom.bounds.width - 45, playerState.x + dx)),
                y: Math.max(45, Math.min(currentRoom.bounds.height - 45, playerState.y + dy)),
                direction: dir,
                isMoving: true,
              });
            }}
            onMoveEnd={() => updatePlayer({ isMoving: false })}
            onInteract={() => {
              if (nearbyObject) handleInteractWithObject(nearbyObject);
            }}
            onToggleLensa={() => {
              const next = !playerState.lensaNalarActive;
              sounds.setLensaNalarHum(next);
              updatePlayer({ lensaNalarActive: next });
            }}
            onToggleSenter={() => {
              sounds.playFlashlight();
              updatePlayer({ flashlightOn: !playerState.flashlightOn });
            }}
            onOpenJournal={() => {
              sounds.playPageTurn();
              setHasUnreadJournal(false);
              setActiveModal('journal');
            }}
            onOpenBip={() => {
              sounds.playBipBlip();
              setActiveModal('bip');
            }}
            onJump={handleJump}
            isLensaActive={playerState.lensaNalarActive}
            isSenterOn={playerState.flashlightOn}
            canInteract={Boolean(nearbyObject)}
          />

          {/* MODALS */}
          {/* Jumpscare Horror Overlay (Kondisi Mati/Fokus 0) */}
          {activeModal === 'jumpscare' && (
            <JumpscareOverlay
              ghostName={jumpscareGhostName}
              onFinished={handleJumpscareFinish}
            />
          )}
          {/* 1. Handwritten Journal Viewer */}
          {activeModal === 'journal' && (
            <JournalViewer
              pages={journalPages}
              unlockedPageIds={playerState.foundJournalPages}
              onClose={() => setActiveModal('none')}
            />
          )}

          {/* 2. BIP Assistant Terminal */}
          {activeModal === 'bip' && (
            <BipDialog
              roomId={playerState.currentRoomId}
              roomName={currentRoom.name}
              hints={BIP_HINTS[playerState.currentRoomId] || ['BIP: "Gunakan Lensa Nalar untuk membaca objek!"']}
              battery={playerState.battery}
              onRequestHint={handleRequestBipHint}
              onClose={() => setActiveModal('none')}
            />
          )}

          {/* 3. Interactive Tactile Puzzle Modal */}
          {activeModal === 'puzzle' && activePuzzleObj && (
            <InteractivePuzzleModal
              roomId={playerState.currentRoomId}
              objectId={activePuzzleObj.id}
              puzzleTitle={activePuzzleObj.label || currentRoom.puzzleTitle || 'Tantangan RPL'}
              puzzleDescription={activePuzzleObj.description || currentRoom.puzzleDescription || ''}
              onSolve={handlePuzzleSolved}
              onMistake={handleConceptualMistake}
              onClose={() => setActiveModal('none')}
            />
          )}

          {/* 4. GALAT Boss Trial Showdown */}
          {activeModal === 'galat_trial' && (
            <GalatTrialModal
              onVictory={handleVictory}
              onMistake={handleConceptualMistake}
              onClose={() => setActiveModal('none')}
            />
          )}

          {/* 5. Rapor Bayangan (Diagnostic Report Card - Kondisi Menang / Selesai) */}
          {activeModal === 'report' && finalReport && (
            <RaporBayanganModal
              report={finalReport}
              roomStats={Object.values(roomStats)}
              onRestart={handleRestart}
              onClose={() => setActiveModal('none')}
              onShare={handleShareGame}
              onReturnToTitle={handleReturnToTitle}
            />
          )}

          {/* 6. Game Over Modal (Kondisi Kalah) */}
          {activeModal === 'game_over' && (
            <GameOverModal
              currentRoomName={currentRoom.name}
              archiveShardsCount={playerState.archiveShards.length}
              solvedPuzzlesCount={rooms.reduce(
                (acc, r) => acc + r.objects.filter((o) => o.type === 'puzzle' && o.solved).length,
                0
              )}
              totalPuzzlesCount={rooms.reduce(
                (acc, r) => acc + r.objects.filter((o) => o.type === 'puzzle').length,
                0
              )}
              onRevive={handleRevive}
              onRestart={handleRestart}
              onReturnToTitle={handleReturnToTitle}
              onShare={handleShareGame}
            />
          )}
        </div>
      )}

      {/* STORY INTRO MODAL (Explains Nara's situation when starting the game) */}
      {showStoryIntro && (
        <StoryIntroModal
          onStartGame={() => {
            setShowStoryIntro(false);
            handleStartGame();
          }}
        />
      )}
    </div>
  );
}
