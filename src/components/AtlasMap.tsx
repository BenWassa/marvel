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

const TOP_PADDING = 206;
const BOTTOM_PADDING = 420;

const ERAS = [
  { year: 2000, label: 'Legacy foundations', years: '2000–2007' },
  { year: 2008, label: 'MCU formation', years: '2008–2015' },
  { year: 2016, label: 'Convergence builds', years: '2016–2019' },
  { year: 2021, label: 'Multiverse era', years: '2021–' },
];

const laneOrder: UniverseId[] = ['10005', '616', 'spider'];

const makeCurve = (
  a: { x: number; y: number },
  b: { x: number; y: number }
): string => {
  const midY = (a.y + b.y) / 2;
  return 'M ' + a.x + ' ' + a.y + ' C ' + a.x + ' ' + midY + ', ' + b.x + ' ' + midY + ', ' + b.x + ' ' + b.y;
};

const getLabelPositionClass = (universeId: UniverseId): string => {
  if (universeId === 'spider') {
    return 'right-[34px] top-1/2 -translate-y-1/2 text-right';
  }

  if (universeId === '616') {
    return 'left-1/2 top-[38px] -translate-x-1/2 text-center sm:left-[34px] sm:top-1/2 sm:translate-x-0 sm:-translate-y-1/2 sm:text-left';
  }

  return 'left-[34px] top-1/2 -translate-y-1/2 text-left';
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
  const rowHeight = width < 640 ? 136 : 122;
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
        '10005': width * 0.14,
        '616': width * 0.5,
        spider: width * 0.86,
      };
    }

    return {
      '10005': width * 0.19,
      '616': width * 0.5,
      spider: width * 0.81,
    };
  }, [width]);

  const positions = useMemo(() => {
    const result = new Map<string, { x: number; y: number }>();
    sortedNodes.forEach((node, index) => {
      result.set(node.id, {
        x: laneX[node.uni],
        y: TOP_PADDING + index * rowHeight,
      });
    });
    return result;
  }, [laneX, rowHeight, sortedNodes]);

  const canvasHeight = TOP_PADDING + sortedNodes.length * rowHeight + BOTTOM_PADDING;

  const routePath = useMemo(() => {
    if (activeRouteId === 'all') return '';

    const routePositions = route.nodeIds
      .map((id) => positions.get(id))
      .filter((position): position is { x: number; y: number } => Boolean(position));

    if (routePositions.length < 2) return '';

    let path = 'M ' + routePositions[0].x + ' ' + routePositions[0].y;
    for (let index = 1; index < routePositions.length; index += 1) {
      const previous = routePositions[index - 1];
      const next = routePositions[index];
      const midY = (previous.y + next.y) / 2;
      path += ' C ' + previous.x + ' ' + midY + ', ' + next.x + ' ' + midY + ', ' + next.x + ' ' + next.y;
    }

    return path;
  }, [activeRouteId, positions, route.nodeIds]);

  const selectedNode = nodes.find((node) => node.id === activeNodeId) ?? null;

  const selectedConnections = useMemo(() => {
    if (!selectedNode) return [];

    const pairs: Array<{ sourceId: string; targetId: string }> = [];
    const seen = new Set<string>();

    (selectedNode.connections ?? []).forEach((connection) => {
      const key = selectedNode.id + ':' + connection.targetId;
      if (!seen.has(key) && positions.has(connection.targetId)) {
        seen.add(key);
        pairs.push({ sourceId: selectedNode.id, targetId: connection.targetId });
      }
    });

    nodes.forEach((node) => {
      (node.connections ?? []).forEach((connection) => {
        if (connection.targetId !== selectedNode.id) return;
        const key = node.id + ':' + selectedNode.id;
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
    const nodeElement = document.getElementById('atlas-node-' + activeNodeId);
    const scroller = scrollerRef.current;
    if (!nodeElement || !scroller) return;

    const nodeTop = nodeElement.offsetTop;
    const visibleTop = scroller.scrollTop + 120;
    const visibleBottom = scroller.scrollTop + scroller.clientHeight - 260;

    if (nodeTop < visibleTop || nodeTop > visibleBottom) {
      scroller.scrollTo({
        top: Math.max(0, nodeTop - scroller.clientHeight * 0.42),
        behavior: 'auto',
      });
    }
  }, [activeNodeId]);

  const labelWidth = width < 640 ? 124 : width < 900 ? 178 : 230;
  const searchMatches = sortedNodes.filter((node) => matchesNodeSearch(node, searchQuery)).length;

  return (
    <div
      ref={scrollerRef}
      className="atlas-scroll relative h-full w-full overflow-y-auto overflow-x-hidden"
      role="region"
      aria-label="Marvel screen continuity map"
      aria-describedby="atlas-map-description"
    >
      <p id="atlas-map-description" className="sr-only">
        Titles are arranged vertically by release order and horizontally by screen continuity. Curated routes are highlighted without removing surrounding titles. Selecting a title opens its details.
      </p>

      <p className="sr-only" aria-live="polite">
        {searchQuery.trim()
          ? searchMatches + ' matching titles. Other titles remain available as context.'
          : 'All ' + sortedNodes.length + ' titles are shown.'}
      </p>

      <section className="sr-only" aria-label="Titles in release order">
        <h2>Marvel screen titles in release order</h2>
        <ol>
          {sortedNodes.map((node) => {
            const meta = UNIVERSE_META[node.uni];
            const inRoute = activeRouteId === 'all' || routeSet.has(node.id);
            return (
              <li key={'accessible-' + node.id}>
                {node.year}. {node.title}. {meta.label}. {node.seen ? 'Watched.' : 'Not watched.'}
                {activeRouteId !== 'all' ? (inRoute ? ' Included in the selected route.' : ' Outside the selected route.') : ''}
              </li>
            );
          })}
        </ol>
      </section>

      <div className="relative min-w-0" style={{ height: canvasHeight }}>
        <div className="pointer-events-none absolute inset-0 atlas-grid" aria-hidden="true" />
        <div className="atlas-map-vignette pointer-events-none absolute inset-x-0 top-0 h-[520px]" aria-hidden="true" />

        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox={[0, 0, width, canvasHeight].join(' ')}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <filter id="atlas-soft-glow" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="5" result="blur" />
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
                  y1={142}
                  x2={laneX[universeId]}
                  y2={canvasHeight - BOTTOM_PADDING + 88}
                  stroke={meta.color}
                  strokeWidth="1"
                  strokeDasharray="3 11"
                  opacity="0.3"
                />
                <line
                  x1={laneX[universeId]}
                  y1={142}
                  x2={laneX[universeId]}
                  y2={canvasHeight - BOTTOM_PADDING + 88}
                  stroke={meta.color}
                  strokeWidth="7"
                  opacity="0.025"
                />
              </g>
            );
          })}

          {ERAS.map((era) => {
            const index = sortedNodes.findIndex((node) => Number.parseInt(node.year, 10) >= era.year);
            if (index < 0) return null;
            const y = TOP_PADDING + index * rowHeight - 66;

            return (
              <line
                key={era.year}
                x1="20"
                x2={Math.max(20, width - 20)}
                y1={y}
                y2={y}
                stroke="var(--border-subtle)"
                opacity="0.75"
              />
            );
          })}

          {routePath && (
            <>
              <path
                d={routePath}
                fill="none"
                stroke="var(--route-line)"
                strokeWidth="9"
                opacity="0.07"
                filter="url(#atlas-soft-glow)"
              />
              <path
                d={routePath}
                fill="none"
                stroke="var(--route-line)"
                strokeWidth="2.5"
                opacity="0.9"
                strokeLinecap="round"
              />
            </>
          )}

          {selectedConnections.map(({ sourceId, targetId }) => {
            const source = positions.get(sourceId);
            const target = positions.get(targetId);
            if (!source || !target) return null;

            return (
              <path
                key={sourceId + '-' + targetId}
                d={makeCurve(source, target)}
                fill="none"
                stroke="var(--connection-line)"
                strokeWidth="1.75"
                strokeDasharray="5 7"
                opacity="0.9"
              />
            );
          })}
        </svg>

        <div className="pointer-events-none absolute inset-x-0 top-[106px] z-10" aria-hidden="true">
          {laneOrder.map((universeId) => {
            const meta = UNIVERSE_META[universeId];
            return (
              <div
                key={universeId}
                className="absolute -translate-x-1/2 text-center"
                style={{ left: laneX[universeId] }}
              >
                <div
                  className="mx-auto mb-2 h-2 w-2 rounded-full"
                  style={{ backgroundColor: meta.color }}
                />
                <div className="whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--text-secondary)] sm:text-xs">
                  {meta.shortLabel}
                </div>
                <div className="hidden whitespace-nowrap text-[11px] text-[var(--text-muted)] sm:block">
                  {meta.code}
                </div>
              </div>
            );
          })}
        </div>

        {ERAS.map((era) => {
          const index = sortedNodes.findIndex((node) => Number.parseInt(node.year, 10) >= era.year);
          if (index < 0) return null;
          const y = TOP_PADDING + index * rowHeight - 80;

          return (
            <div
              key={era.year}
              className="pointer-events-none absolute left-4 right-4 z-10 flex items-end justify-between"
              style={{ top: y }}
              aria-hidden="true"
            >
              <span className="bg-[var(--bg)] pr-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)] sm:text-xs">
                {era.label}
              </span>
              <span className="bg-[var(--bg)] pl-3 text-[11px] text-[var(--text-muted)] sm:text-xs">
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
          const watched = node.seen;

          let opacity = 1;
          if (!isActive && !matchesSearch) opacity = 0.2;
          else if (!isActive && !inRoute) opacity = 0.42;

          const routeLabel =
            activeRouteId === 'all'
              ? ''
              : inRoute
                ? ', included in selected route'
                : ', outside selected route';

          return (
            <button
              type="button"
              id={'atlas-node-' + node.id}
              key={node.id}
              onClick={() => onSelectNode(node.id)}
              aria-label={node.title + ', ' + node.year + ', ' + meta.label + (watched ? ', watched' : ', not watched') + routeLabel}
              aria-current={isActive ? 'true' : undefined}
              data-search-match={matchesSearch ? 'true' : 'false'}
              data-in-route={inRoute ? 'true' : 'false'}
              className="atlas-node absolute z-20 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full outline-none transition-opacity duration-150 focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]"
              style={{
                left: position.x,
                top: position.y,
                opacity,
              }}
            >
              <span
                className="absolute inset-[4px] rounded-full transition-[background-color,box-shadow] duration-150"
                style={{
                  backgroundColor: isActive ? meta.glow : 'transparent',
                  boxShadow: isActive ? '0 0 18px ' + meta.glow : 'none',
                }}
                aria-hidden="true"
              />

              {node.nexus && (
                <span
                  className="absolute inset-[6px] rounded-full border"
                  style={{ borderColor: 'var(--connection-line)' }}
                  aria-hidden="true"
                />
              )}

              <span
                className="absolute inset-[12px] rounded-full border-2 transition-[background-color,box-shadow] duration-150"
                style={{
                  borderColor: meta.color,
                  backgroundColor: watched ? meta.core : 'var(--bg)',
                  boxShadow: watched ? '0 0 10px ' + meta.glow : 'none',
                }}
                aria-hidden="true"
              >
                {watched && (
                  <Check className="absolute inset-0 m-auto h-3 w-3 stroke-[3.5] text-[#071014]" />
                )}
              </span>

              <span
                className={
                  'atlas-node-label absolute rounded-lg border px-2.5 py-1.5 ' +
                  getLabelPositionClass(node.uni) +
                  (isActive
                    ? ' border-[var(--border-strong)] bg-[var(--surface-2)] shadow-[0_8px_24px_rgba(0,0,0,0.45)]'
                    : ' border-transparent bg-[color:var(--bg-translucent)]')
                }
                style={{ width: labelWidth }}
              >
                <span className="block truncate text-[11px] font-semibold leading-4 text-[var(--text-primary)] sm:text-xs">
                  {node.title}
                </span>
                <span className="mt-0.5 flex items-center gap-1.5 text-[11px] leading-4 text-[var(--text-muted)]">
                  <span style={{ color: isActive ? meta.color : undefined }}>{node.year}</span>
                  <span aria-hidden="true">·</span>
                  <span className="truncate">{node.runtime}</span>
                  {node.nexus && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="text-[var(--connection-line)]">nexus</span>
                    </>
                  )}
                </span>
              </span>
            </button>
          );
        })}

        {activeRouteId !== 'all' && (
          <div className="pointer-events-none absolute left-1/2 top-[162px] z-10 -translate-x-1/2 rounded-full border border-[var(--route-border)] bg-[var(--surface-2)] px-3 py-1.5 text-[11px] font-medium text-[var(--route-line)]">
            Curated route overlay
          </div>
        )}
      </div>
    </div>
  );
};
