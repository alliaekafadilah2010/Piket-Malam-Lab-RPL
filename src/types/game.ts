/**
 * PIKET MALAM - Type Definitions
 * Based on Game Design Document v1.0
 */

export type SubjectCategory = 'fisika' | 'kimia' | 'logika' | 'matematika';

export interface PlayerState {
  x: number;
  y: number;
  direction: 'up' | 'down' | 'left' | 'right';
  isMoving: boolean;
  battery: number; // 0 - 100
  focus: number; // 0 - 3 (hearts)
  flashlightOn: boolean;
  lensaNalarActive: boolean;
  archiveShards: string[]; // Room IDs that gave shards
  foundJournalPages: number[]; // Page numbers
  currentRoomId: number;
  speed: number;
}

export interface JournalPage {
  id: number;
  title: string;
  subject: SubjectCategory | 'pengantar';
  content: string;
  sketchType?: 'html_tag' | 'if_else' | 'sql_query' | 'array_zero' | 'intro' | 'flexbox' | 'loop' | 'primary_key' | 'stack_queue' | 'git' | 'router_ip' | 'boolean_gate' | 'lever' | 'ph_scale' | 'loop_bug' | 'bell_curve' | 'spectrum';
  authorNote: string;
  unlocked: boolean;
}

export interface GhostState {
  name: string;
  room: string;
  misconception: string;
  clarification: string;
  steps: number; // 0 to 3 (3 = catches player, resets focus)
  isDissolved: boolean;
  x: number;
  y: number;
}

export interface InteractiveObject {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'puzzle' | 'journal' | 'battery' | 'door' | 'bip_terminal' | 'inspection';
  label: string;
  description?: string;
  journalPageId?: number;
  solved?: boolean;
  requiresShard?: boolean;
  conceptualLayerText?: string;
  conceptualLayerData?: {
    forceVector?: { magnitude: number; angle: number; label: string };
    ionCharge?: { ph: number; ions: string; color: string };
    logicCondition?: { code: string; status: 'ok' | 'bug' };
    mathCoordinate?: { formula: string; value: string };
  };
}

export interface RoomDef {
  id: number;
  name: string;
  subject: SubjectCategory | 'tutorial' | 'boss';
  description: string;
  ghost?: GhostState;
  bounds: { width: number; height: number };
  playerSpawn: { x: number; y: number };
  objects: InteractiveObject[];
  walls: { x: number; y: number; width: number; height: number }[];
  puzzleTitle?: string;
  puzzleDescription?: string;
}

export interface RoomScoreStat {
  roomId: number;
  subject: SubjectCategory;
  attempts: number;
  hintsUsed: number;
  focusLost: number;
  batteryRemaining: number;
  journalsFound: number;
  optionalPuzzlesSolved: number;
  basePoints: number;
  purityMultiplier: number;
  totalScore: number;
}

export interface GameReport {
  subjectScores: {
    fisika: number; // 0 - 100 percentage
    kimia: number;
    logika: number;
    matematika: number;
  };
  totalPoints: number;
  rank: 'E' | 'D' | 'C' | 'B' | 'A' | 'S';
  endingType: 'kabur' | 'terurai' | 'arsip_murni';
  purityAverage: number;
  teacherDiagnosis: string;
  recommendations: string[];
}

export interface DialogueLine {
  speaker: 'NARA' | 'BIP' | 'BU RANI' | 'GALAT' | 'HANTU GAYA' | 'SI ION' | 'NULL' | 'NYAI RUMUS';
  text: string;
  mood?: 'normal' | 'panic' | 'glitch' | 'warm' | 'intense';
}
