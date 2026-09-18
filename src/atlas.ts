import { TimelineNode, UniverseId } from './types';

export type AtlasRouteId =
  | 'all'
  | 'mcu-essentials'
  | 'infinity-saga'
  | 'spider-multiverse'
  | 'mutant-legacy';

export interface AtlasRoute {
  id: AtlasRouteId;
  name: string;
  shortName: string;
  description: string;
  nodeIds: string[];
}

export const UNIVERSE_META: Record<
  UniverseId,
  {
    label: string;
    shortLabel: string;
    code: string;
    color: string;
    core: string;
    glow: string;
  }
> = {
  '616': {
    label: 'MCU continuity',
    shortLabel: 'MCU',
    code: 'C-616',
    color: '#F5A623',
    core: '#FFD082',
    glow: 'rgba(245, 166, 35, 0.34)',
  },
  '10005': {
    label: 'Legacy mutant continuity',
    shortLabel: 'Mutant',
    code: 'C-10005',
    color: '#00A3FF',
    core: '#70CFFF',
    glow: 'rgba(0, 163, 255, 0.34)',
  },
  spider: {
    label: 'Spider continuities',
    shortLabel: 'Spider',
    code: 'C-96283 / 120703',
    color: '#FF4D45',
    core: '#FFA19B',
    glow: 'rgba(255, 77, 69, 0.34)',
  },
};

export const ATLAS_ROUTES: AtlasRoute[] = [
  {
    id: 'all',
    name: 'Global Map',
    shortName: 'All continuities',
    description: 'Every title in release order, separated by screen continuity.',
    nodeIds: [],
  },
  {
    id: 'mcu-essentials',
    name: 'MCU Essentials',
    shortName: 'MCU essentials',
    description: 'A compact route through the major MCU convergence points in this prototype set.',
    nodeIds: ['m1', 'm2', 'm_ws', 'm_cw', 'm_rag', 'm3', 'm4', 'm_loki', 'm5', 'm_mom', 'm6'],
  },
  {
    id: 'infinity-saga',
    name: 'The Infinity Saga',
    shortName: 'Infinity Saga',
    description: 'A focused route from Iron Man through Endgame.',
    nodeIds: ['m1', 'm_thor1', 'm_cap1', 'm2', 'm_gotg', 'm_aou', 'm_cw', 'm_ds', 'm_rag', 'm3', 'm4'],
  },
  {
    id: 'spider-multiverse',
    name: 'Spider-Man Multiverse',
    shortName: 'Spider multiverse',
    description: 'Legacy live-action Spider-Man, MCU convergence, and Spider-Verse branches.',
    nodeIds: ['s1', 's2', 's3', 's_asm1', 's_asm2', 'm_cw', 'm3', 'm4', 'm5', 's_itsv', 's_atsv'],
  },
  {
    id: 'mutant-legacy',
    name: 'Mutant Legacy',
    shortName: 'Mutant legacy',
    description: 'The Fox mutant line from X-Men through Deadpool & Wolverine.',
    nodeIds: ['f1', 'f_x2', 'f_x3', 'f_fc', 'f2', 'f3', 'f_dp1', 'f_dp2', 'm6'],
  },
];

export const getRoute = (routeId: AtlasRouteId): AtlasRoute =>
  ATLAS_ROUTES.find((route) => route.id === routeId) ?? ATLAS_ROUTES[0];

export const getChronologicalNodes = (nodes: TimelineNode[]): TimelineNode[] =>
  [...nodes].sort((a, b) => {
    const yearDelta = Number.parseInt(a.year, 10) - Number.parseInt(b.year, 10);
    if (yearDelta !== 0) return yearDelta;
    return a.verticalY - b.verticalY;
  });

export const getRouteNodes = (
  nodes: TimelineNode[],
  routeId: AtlasRouteId
): TimelineNode[] => {
  const route = getRoute(routeId);
  if (route.id === 'all') return getChronologicalNodes(nodes);

  const byId = new Map(nodes.map((node) => [node.id, node]));
  return route.nodeIds
    .map((id) => byId.get(id))
    .filter((node): node is TimelineNode => Boolean(node));
};

export const matchesNodeSearch = (node: TimelineNode, query: string): boolean => {
  const q = query.trim().toLowerCase();
  if (!q) return true;

  return [
    node.title,
    node.year,
    node.universeCode,
    node.anchorEvent ?? '',
    node.era ?? '',
    node.phase ?? '',
    ...(node.keyVariants ?? []),
  ].some((value) => value.toLowerCase().includes(q));
};

export const getNavigableNodes = (
  nodes: TimelineNode[],
  query: string
): TimelineNode[] => {
  const chronological = getChronologicalNodes(nodes);
  if (!query.trim()) return chronological;
  return chronological.filter((node) => matchesNodeSearch(node, query));
};

export const toggleNodeSeen = (
  nodes: TimelineNode[],
  id: string
): TimelineNode[] =>
  nodes.map((node) => (node.id === id ? { ...node, seen: !node.seen } : node));
