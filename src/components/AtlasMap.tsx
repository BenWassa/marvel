import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Check } from 'lucide-react';
import {
  AtlasRouteId,
  getChronologicalNodes,
  getRoute,
  matchesNodeSearch,
  UNIVERSE_META,
} from '../atlas';
import { TimelineNode, UniverseId } from '../types';

interface AtlasMapProps {
  nodes: TimelineNode[];
  activeNodeId: string | null;
  onSelectNode: (id: string) => void;
  activeRouteId: AtlasRouteId;
  searchQuery: string;
}

const ROW_HEIGHT = 122;
const TOP_PADDING = 190;
const BOTTOM_PADDING = 430;

const ERAS = [
  { year: 2000, label: 'LEGACY FOUNDATIONS', years: '2000 — 2007' },
  { year: 2008, label: 'MCU FORMATION', years: '2008 — 2015' },
  { year: 2016, label: 'CONVERGENCE BUILDS', years: '2016 — 2019' },
  { year: 2021, label: 'MULTIVERSE ERA', years: '2021 —' },
];

const laneOrder: UniverseId[] = ['10005', '616', 'spider'];

const makeCurve = (
  a: { x: number; y: number },
  b: { x: number; y: number }
): string => {
  const midY = (a.y + b.y) / 2;
  return `M ${a.x} ${a.y} C ${a.x} ${midY}, ${b.x} ${midY}, ${b.x} ${b.y}`;
};

export const AtlasMap: React.FC<AtlasMapProps> = ({
  nodes,
  activeNodeId,
  onSelectNode,
  activeRouteId,
  searchQuery,
}) => {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(1200);

  useEffect(() => {
    const element = scrollerRef.current;
    if (!element) return;

    const update = () => setWidth(element.getBoundingClientRect().width);
    update();

    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const sortedNodes = useMemo(() => getChronologicalNodes(nodes), [nodes]);
  const route = getRoute(activeRouteId);
  const routeSet = useMemo(
    () => new Set(activeRouteId === 'all' ? sortedNodes.map((node) => node.id) : route.nodeIds),
    [activeRouteId, route.nodeIds, sortedNodes]
  );

  const laneX = useMemo<Record<UniverseId, number>>(() => {
    if (width < 640) {
      return {
        '10005': 42,
        '616': width * 0.5,
        spider: width - 42,
      };
    }

    if (width < 980) {
      return {
        '10005': width * 0.13,
        '616': width * 0.5,
        spider: width * 0.87,
      };
    }

    return {
      '10005': width * 0.18,
      '616': width * 0.5,
      spider: width * 0.82,
    };
  }, [width]);

  const positions = useMemo(() => {
    const map = new Map<string, { x: number; y: number }>();
    sortedNodes.forEach((node, index) => {
      map.set(node.id, {
        x: laneX[node.uni],
        y: TOP_PADDING + index * ROW_HEIGHT,
      });
    });
    return map;
  }, [laneX, sortedNodes]);

  const canvasHeight = TOP_PADDING + sortedNodes.length * ROW_HEIGHT + BOTTOM_PADDING;

  const routePath = useMemo(() => {
    if (activeRouteId === 'all') return '';
    const routePositions = route.nodeIds
      .map((id) => positions.get(id))
      .filter((position): position is { x: number; y: number } => Boolean(position));

    if (routePositions.length < 2) return '';

    let d = `M ${routePositions[0].x} ${routePositions[0].y}`;
    for (let index = 1; index < routePositions.length; index += 1) {
      const previous = routePositions[index - 1];
      const next = routePositions[index];
      const midY = (previous.y + next.y) / 2;
      d += ` C ${previous.x} ${midY}, ${next.x} ${midY}, ${next.x} ${next.y}`;
    }
    return d;
  }, [activeRouteId, positions, route.nodeIds]);

  const selectedNode = nodes.find((node) => node.id === activeNodeId) ?? null;

  const selectedConnections = useMemo(() => {
    if (!selectedNode) return [];

    const pairs: Array<{ sourceId: string; targetId: string }> = [];
    const seen = new Set<string>();

    (selectedNode.connections ?? []).forEach((connection) => {
      const key = `${selectedNode.id}:${connection.targetId}`;
      if (!seen.has(key) && positions.has(connection.targetId)) {
        seen.add(key);
        pairs.push({ sourceId: selectedNode.id, targetId: connection.targetId });
      }
    });

    nodes.forEach((node) => {
      (node.connections ?? []).forEach((connection) => {
        if (connection.targetId !== selectedNode.id) return;
        const key = `${node.id}:${selectedNode.id}`;
        if (!seen.has(key) && positions.has(node.id)) {
          seen.add(key);
          pairs.push({ sourceId: node.id, targetId: selectedNode.id });
        }
      });
    });

    return pairs;
  }, [nodes, positions, selectedNode]);

  useEffect(() => {
    if (!activeNodeId) return;
    const nodeElement = document.getElementById(`atlas-node-${activeNodeId}`);
    if (!nodeElement) return;

    const scroller = scrollerRef.current;
    if (!scroller) return;

    const nodeTop = nodeElement.offsetTop;
    const visibleTop = scroller.scrollTop + 110;
    const visibleBottom = scroller.scrollTop + scroller.clientHeight - 250;

    if (nodeTop < visibleTop || nodeTop > visibleBottom) {
      scroller.scrollTo({
        top: Math.max(0, nodeTop - scroller.clientHeight * 0.42),
        behavior: 'smooth',
      });
    }
  }, [activeNodeId]);

  const labelWidth = width < 640 ? 132 : width < 900 ? 175 : 230;

  return (
    <div
      ref={scrollerRef}
      className="atlas-scroll relative h-full w-full overflow-y-auto overflow-x-hidden bg-[#050609]"
    >
      <div className="relative min-w-0" style={{ height: canvasHeight }}>
        <div className="pointer-events-none absolute inset-0 atlas-grid" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(circle_at_50%_0%,rgba(245,166,35,0.08),transparent_62%)]" />

        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox={`0 0 ${width} ${canvasHeight}`}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <filter id="atlas-soft-glow" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="atlas-route-glow" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="10" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {laneOrder.map((universeId) => {
            const meta = UNIVERSE_META[universeId];
            return (
              <g key={universeId}>
                <line
                  x1={laneX[universeId]}
                  y1={136}
                  x2={laneX[universeId]}
                  y2={canvasHeight - BOTTOM_PADDING + 80}
                  stroke={meta.color}
                  strokeWidth="1"
                  strokeDasharray="2 10"
                  opacity="0.22"
                />
                <line
                  x1={laneX[universeId]}
                  y1={136}
                  x2={laneX[universeId]}
                  y2={canvasHeight - BOTTOM_PADDING + 80}
                  stroke={meta.color}
                  strokeWidth="8"
                  opacity="0.018"
                />
              </g>
            );
          })}

          {ERAS.map((era) => {
            const index = sortedNodes.findIndex((node) => Number.parseInt(node.year, 10) >= era.year);
            if (index < 0) return null;
            const y = TOP_PADDING + index * ROW_HEIGHT - 62;

            return (
              <g key={era.year}>
                <line x1="20" x2={Math.max(20, width - 20)} y1={y} y2={y} stroke="#242936" opacity="0.5" />
              </g>
            );
          })}

          {routePath && (
            <>
              <path
                d={routePath}
                fill="none"
                stroke="#F5E6BD"
                strokeWidth="12"
                opacity="0.08"
                filter="url(#atlas-route-glow)"
              />
              <path
                d={routePath}
                fill="none"
                stroke="#F5E6BD"
                strokeWidth="2.25"
                opacity="0.78"
                strokeLinecap="round"
              />
            </>
          )}

          {selectedConnections.map(({ sourceId, targetId }) => {
            const source = positions.get(sourceId);
            const target = positions.get(targetId);
            if (!source || !target) return null;
            const d = makeCurve(source, target);

            return (
              <g key={`${sourceId}-${targetId}`}>
                <path
                  d={d}
                  fill="none"
                  stroke="#E5C5FF"
                  strokeWidth="9"
                  opacity="0.08"
                  filter="url(#atlas-soft-glow)"
                />
                <path
                  d={d}
                  fill="none"
                  stroke="#E5C5FF"
                  strokeWidth="1.5"
                  strokeDasharray="5 6"
                  opacity="0.85"
                />
              </g>
            );
          })}
        </svg>

        <div className="pointer-events-none absolute inset-x-0 top-[106px] z-10">
          {laneOrder.map((universeId) => {
            const meta = UNIVERSE_META[universeId];
            return (
              <div
                key={universeId}
                className="absolute -translate-x-1/2 text-center"
                style={{ left: laneX[universeId] }}
              >
                <div
                  className="mx-auto mb-2 h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: meta.color, boxShadow: `0 0 10px ${meta.glow}` }}
                />
                <div className="whitespace-nowrap font-mono-code text-[8px] font-bold uppercase tracking-[0.12em] text-[#A7AFBC] sm:text-[9px]">
                  {meta.shortLabel}
                </div>
                <div className="hidden whitespace-nowrap font-mono-code text-[8px] uppercase tracking-[0.08em] text-[#515B6C] sm:block">
                  {meta.code}
                </div>
              </div>
            );
          })}
        </div>

        {ERAS.map((era) => {
          const index = sortedNodes.findIndex((node) => Number.parseInt(node.year, 10) >= era.year);
          if (index < 0) return null;
          const y = TOP_PADDING + index * ROW_HEIGHT - 73;

          return (
            <div
              key={era.year}
              className="pointer-events-none absolute left-4 right-4 z-10 flex items-end justify-between"
              style={{ top: y }}
            >
              <span className="bg-[#050609] pr-3 font-mono-code text-[9px] font-bold uppercase tracking-[0.16em] text-[#6F798A]">
                {era.label}
              </span>
              <span className="bg-[#050609] pl-3 font-mono-code text-[8px] uppercase tracking-[0.12em] text-[#464E5C]">
                {era.years}
              </span>
            </div>
          );
        })}

        {sortedNodes.map((node) => {
          const position = positions.get(node.id);
          if (!position) return null;

          const meta = UNIVERSE_META[node.uni];
          const inRoute = activeRouteId === 'all' || routeSet.has(node.id);
          const matchesSearch = matchesNodeSearch(node, searchQuery);
          const isActive = activeNodeId === node.id;
          const isDimmed = !inRoute || !matchesSearch;
          const labelOnLeft = node.uni === 'spider';
          const watched = node.seen;

          return (
            <button
              type="button"
              id={`atlas-node-${node.id}`}
              key={node.id}
              onClick={() => onSelectNode(node.id)}
              aria-label={`${node.title}, ${node.year}${watched ? ', watched' : ''}`}
              aria-pressed={isActive}
              className="absolute z-20 h-11 w-11 -translate-x-1/2 -translate-y-1/2 rounded-full outline-none transition-[opacity,transform] duration-300 focus-visible:ring-2 focus-visible:ring-white/70"
              style={{
                left: position.x,
                top: position.y,
                opacity: isDimmed ? 0.14 : 1,
              }}
            >
              <span
                className="absolute inset-0 m-auto h-9 w-9 rounded-full transition duration-300"
                style={{
                  background: isActive ? meta.glow : 'transparent',
                  filter: isActive ? 'blur(7px)' : undefined,
                }}
                aria-hidden="true"
              />

              {node.nexus && (
                <span
                  className="absolute inset-[5px] rounded-full border opacity-80"
                  style={{ borderColor: '#E5C5FF' }}
                  aria-hidden="true"
                />
              )}

              <span
                className="absolute inset-[11px] rounded-full border-2 transition duration-300"
                style={{
                  borderColor: meta.color,
                  backgroundColor: watched ? meta.core : '#080A0E',
                  boxShadow:
                    watched || isActive
                      ? `0 0 ${isActive ? 18 : 10}px ${meta.glow}`
                      : '0 0 0 transparent',
                }}
                aria-hidden="true"
              >
                {watched && (
                  <Check className="absolute inset-0 m-auto h-3 w-3 stroke-[3.5] text-[#071014]" />
                )}
              </span>

              <span
                className={`absolute top-1/2 -translate-y-1/2 rounded-lg border px-2.5 py-1.5 transition duration-300 sm:px-3 ${labelOnLeft ? 'right-[30px] text-right' : 'left-[30px] text-left'} ${isActive ? 'border-white/18 bg-[#10131A]/96 shadow-[0_8px_28px_rgba(0,0,0,0.48)]' : 'border-transparent bg-[#050609]/82'}`}
                style={{ width: labelWidth }}
              >
                <span className="block truncate text-[10px] font-semibold tracking-[0.025em] text-[#E9EDF4] sm:text-[11px]">
                  {node.title}
                </span>
                <span className="mt-0.5 flex items-center gap-1.5 font-mono-code text-[8px] uppercase tracking-[0.1em] text-[#6F798A] sm:text-[9px]">
                  <span style={{ color: isActive ? meta.color : undefined }}>{node.year}</span>
                  <span>·</span>
                  <span className="truncate">{node.runtime}</span>
                  {node.nexus && (
                    <>
                      <span>·</span>
                      <span className="text-[#D8B7F2]">nexus</span>
                    </>
                  )}
                </span>
              </span>
            </button>
          );
        })}

        {activeRouteId !== 'all' && (
          <div className="pointer-events-none absolute left-1/2 top-[154px] z-10 -translate-x-1/2 rounded-full border border-[#F5E6BD]/20 bg-[#0C0D11]/90 px-3 py-1 font-mono-code text-[8px] uppercase tracking-[0.14em] text-[#CFC5AA]">
            Curated viewing route
          </div>
        )}
      </div>
    </div>
  );
};
