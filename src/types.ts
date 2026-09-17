export type UniverseId = '616' | '10005' | 'spider';
export type LoomMode = 'vertical' | 'horizontal';

export interface NexusConnection {
  targetId: string;
  targetTitle: string;
  reason: string;
}

export interface TimelineNode {
  id: string;
  title: string;
  year: string;
  uni: UniverseId;
  universeCode: string; // e.g. 'C-616', 'C-10005', 'C-96283', 'C-120703', 'C-TRN733'
  color: string;
  glowColor: string;
  x: number;
  y: number;
  verticalY: number;
  columnIndex: number; // 0: spider, 1: 10005, 2: 616
  runtime: string;
  runtimeMinutes: number;
  seen: boolean;
  desc: string;
  posterUrl?: string;
  nexus?: boolean;
  phase?: string;
  era?: string;
  anchorEvent?: string;
  incursionRisk?: 'Stable' | 'Moderate' | 'Severe' | 'Catastrophic' | 'Timeline Divergence';
  keyVariants?: string[];
  connections?: NexusConnection[];
}

export interface UniverseTrack {
  id: UniverseId;
  label: string;
  code: string;
  designation: string;
  y: number;
  color: string;
  glowColor: string;
  startX: number;
  endX: number;
  description: string;
  columnIndex: number;
}
