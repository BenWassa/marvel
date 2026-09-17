import React, { useRef, useState, useEffect, useCallback } from 'react';
import { TimelineNode, UniverseTrack } from '../types';
import { UNIVERSE_TRACKS, ERA_DIVIDERS } from '../data';

interface CanvasMapProps {
  nodes: TimelineNode[];
  activeNodeId: string | null;
  onSelectNode: (id: string) => void;
  zoom: number;
  selectedFilter: string;
  pan: { x: number; y: number };
  onPanChange: (pan: { x: number; y: number }) => void;
  searchQuery?: string;
}

const CANVAS_WIDTH = 3450;
const CANVAS_HEIGHT = 900;

export const CanvasMap: React.FC<CanvasMapProps> = ({
  nodes,
  activeNodeId,
  onSelectNode,
  zoom,
  selectedFilter,
  pan,
  onPanChange,
  searchQuery = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number; startPanX: number; startPanY: number }>({
    x: 0,
    y: 0,
    startPanX: 0,
    startPanY: 0,
  });

  // Mouse pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.node-element')) return;

    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      startPanX: pan.x,
      startPanY: pan.y,
    };
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;
      onPanChange({
        x: dragStartRef.current.startPanX + dx,
        y: dragStartRef.current.startPanY + dy,
      });
    },
    [isDragging, onPanChange]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Touch pan handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if ((e.target as HTMLElement).closest('.node-element')) return;
    if (e.touches.length === 1) {
      setIsDragging(true);
      dragStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        startPanX: pan.x,
        startPanY: pan.y,
      };
    }
  };

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging || e.touches.length !== 1) return;
      const dx = e.touches[0].clientX - dragStartRef.current.x;
      const dy = e.touches[0].clientY - dragStartRef.current.y;
      onPanChange({
        x: dragStartRef.current.startPanX + dx,
        y: dragStartRef.current.startPanY + dy,
      });
    },
    [isDragging, onPanChange]
  );

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleTouchEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  // Filter & Search check
  const isNodeDimmed = (node: TimelineNode) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = node.title.toLowerCase().includes(q);
      const matchYear = node.year.includes(q);
      const matchAnchor = (node.anchorEvent || '').toLowerCase().includes(q);
      const matchCode = (node.universeCode || '').toLowerCase().includes(q);
      const matchKey = (node.keyVariants || []).some((k) => k.toLowerCase().includes(q));
      if (!matchTitle && !matchYear && !matchAnchor && !matchCode && !matchKey) {
        return true;
      }
    }

    if (selectedFilter === 'all') return false;
    if (selectedFilter === '616') return node.uni !== '616';
    if (selectedFilter === '10005') return node.uni !== '10005';
    if (selectedFilter === 'spider') return node.uni !== 'spider';
    if (selectedFilter === 'nexus') return !node.nexus;
    if (selectedFilter === 'untraversed') return node.seen;
    return false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    onPanChange({
      x: pan.x - e.deltaX * 0.85,
      y: pan.y - e.deltaY * 0.85,
    });
  };

  // Node Map for connections
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  // Key nexus connections
  const nexusPairs = [
    { from: 's2', to: 'm5' },
    { from: 's_asm2', to: 'm5' },
    { from: 'f3', to: 'm6' },
    { from: 'f_dp2', to: 'm6' },
    { from: 'm_loki', to: 'm6' },
    { from: 's_itsv', to: 's_atsv' },
    { from: 's_atsv', to: 'm5' },
  ];

  // Year tick marks along the horizontal timeline
  const yearTicks = [
    { year: '2000', x: 120 },
    { year: '2002', x: 250 },
    { year: '2004', x: 490 },
    { year: '2007', x: 730 },
    { year: '2008', x: 910 },
    { year: '2011', x: 1180 },
    { year: '2012', x: 1400 },
    { year: '2014', x: 1680 },
    { year: '2016', x: 2020 },
    { year: '2018', x: 2360 },
    { year: '2019', x: 2620 },
    { year: '2021', x: 2800 },
    { year: '2023', x: 3080 },
    { year: '2024+', x: 3240 },
  ];

  return (
    <div
      ref={containerRef}
      id="canvas-wrapper"
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onWheel={handleWheel}
      className={`w-full h-full overflow-hidden relative canvas-grid-bg select-none ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      }`}
    >
      {/* Astrometric background subtle overlay */}
      <div className="absolute inset-0 canvas-grid-major pointer-events-none opacity-40" />

      {/* Origin coordinates HUD overlay */}
      <div className="absolute top-4 left-6 font-mono-code text-[10px] text-[#8B949E]/50 pointer-events-none flex flex-col gap-0.5 z-10">
        <div>COORDINATES: X:{Math.round(pan.x)} Y:{Math.round(pan.y)}</div>
        <div>SCALE: {zoom.toFixed(2)}x // 34 CONTINUITY NODES</div>
      </div>

      {/* Transform Layer for Pan & Zoom */}
      <div
        id="pan-zoom-stage"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: 'top left',
          transition: isDragging ? 'none' : 'transform 0.1s ease-out',
          width: `${CANVAS_WIDTH}px`,
          height: `${CANVAS_HEIGHT}px`,
        }}
        className="relative top-[40px]"
      >
        {/* Timeline Year Axis Rulers (Top & Bottom) */}
        <div className="absolute top-10 left-0 right-0 h-8 border-b border-[#1E222A]/70 pointer-events-none">
          {yearTicks.map((tick) => (
            <div
              key={`tick-${tick.year}`}
              style={{ left: `${tick.x}px` }}
              className="absolute -translate-x-1/2 flex flex-col items-center"
            >
              <span className="font-mono-code text-[11px] font-bold text-[#8B949E]/70 tracking-widest">
                {tick.year}
              </span>
              <div className="w-[1px] h-3 bg-[#2D3342] mt-1" />
            </div>
          ))}
        </div>

        {/* Universe Track Labels */}
        {UNIVERSE_TRACKS.map((track) => {
          const isDimmed =
            selectedFilter !== 'all' &&
            selectedFilter !== 'nexus' &&
            selectedFilter !== 'untraversed' &&
            selectedFilter !== track.id;

          return (
            <div
              key={track.id}
              className="uni-label absolute font-mono-code text-[11px] font-bold tracking-[2px] uppercase transition-opacity duration-300 z-10"
              style={{
                top: `${track.y - 32}px`,
                left: `${track.startX}px`,
                color: track.color,
                opacity: isDimmed ? 0.3 : 1,
              }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="inline-block w-2.5 h-2.5 rounded-xs"
                  style={{ backgroundColor: track.color, boxShadow: `0 0 10px ${track.color}` }}
                />
                <span>{track.designation}</span>
              </div>
            </div>
          );
        })}

        {/* SVG Conduits (Lines & Multiverse Nexus connections) */}
        <svg
          className="conduits absolute top-0 left-0 pointer-events-none"
          style={{ width: `${CANVAS_WIDTH}px`, height: `${CANVAS_HEIGHT}px` }}
        >
          {/* Main 616 Line */}
          <path
            className="path-616"
            d="M 40,220 L 3320,220"
            style={{
              opacity: selectedFilter === '10005' || selectedFilter === 'spider' ? 0.25 : 1,
            }}
          />

          {/* Main Fox Mutant Line */}
          <path
            className="path-10005"
            d="M 40,470 L 3320,470"
            style={{
              opacity: selectedFilter === '616' || selectedFilter === 'spider' ? 0.25 : 1,
            }}
          />

          {/* Main Spider Line */}
          <path
            className="path-spider"
            d="M 40,680 L 3320,680"
            style={{
              opacity: selectedFilter === '616' || selectedFilter === '10005' ? 0.25 : 1,
            }}
          />

          {/* Multiverse Nexus Incursion Bezier Curves */}
          {nexusPairs.map((pair, idx) => {
            const fromNode = nodeMap.get(pair.from);
            const toNode = nodeMap.get(pair.to);
            if (!fromNode || !toNode) return null;

            const fromX = fromNode.x;
            const fromY = fromNode.y;
            const toX = toNode.x;
            const toY = toNode.y;

            // Control points create sweeping S-curves across cosmic space
            const controlX1 = fromX + (toX - fromX) * 0.45;
            const controlX2 = fromX + (toX - fromX) * 0.55;

            const isDimmed =
              selectedFilter !== 'all' &&
              selectedFilter !== 'nexus' &&
              selectedFilter !== fromNode.uni &&
              selectedFilter !== toNode.uni;

            return (
              <g key={`canvas-nexus-${pair.from}-${pair.to}-${idx}`} opacity={isDimmed ? 0.15 : 0.9}>
                <path
                  d={`M ${fromX},${fromY} C ${controlX1},${fromY} ${controlX2},${toY} ${toX},${toY}`}
                  className="path-nexus"
                  strokeWidth="2.5"
                />
                <circle
                  cx={Math.round((fromX + toX) / 2)}
                  cy={Math.round((fromY + toY) / 2)}
                  r="4"
                  fill="#E5C5FF"
                  className="pulse-nexus"
                />
              </g>
            );
          })}
        </svg>

        {/* Timeline Nodes */}
        <div id="nodes-container" className="relative w-full h-full">
          {nodes.map((item) => {
            const isDimmed = isNodeDimmed(item);
            const isSelected = activeNodeId === item.id;
            const isSeen = item.seen;
            const isNexus = item.nexus;

            return (
              <div
                key={item.id}
                id={`node-${item.id}`}
                onClick={() => onSelectNode(item.id)}
                style={{
                  left: `${item.x}px`,
                  top: `${item.y}px`,
                  opacity: isDimmed ? 0.2 : 1,
                }}
                className={`node-element absolute cursor-pointer z-20 group -translate-x-1/2 -translate-y-1/2 transition-transform duration-200 ${
                  isDimmed ? 'pointer-events-none' : ''
                }`}
              >
                {/* Year label above */}
                <div
                  className={`absolute -top-6 left-1/2 -translate-x-1/2 font-mono-code text-[10px] tracking-wide pointer-events-none transition-colors duration-200 ${
                    isSelected ? 'text-white font-bold bg-[#141721] px-1 rounded' : 'text-[#8B949E] group-hover:text-white'
                  }`}
                >
                  {item.year}
                </div>

                {/* Node circle */}
                <div
                  style={{
                    borderColor: item.color,
                    backgroundColor: isSeen ? item.color : '#07080B',
                    boxShadow: isSeen
                      ? `0 0 16px 3px ${item.glowColor}`
                      : isSelected
                      ? `0 0 12px 2px ${item.color}`
                      : 'none',
                  }}
                  className={`relative rounded-full transition-all duration-200 flex items-center justify-center ${
                    isNexus
                      ? 'w-6 h-6 border-2 border-double hover:scale-125'
                      : 'w-5 h-5 border-[1.5px] hover:scale-130'
                  } ${isSelected ? 'scale-125 ring-2 ring-white/70' : ''}`}
                >
                  {/* Concentric Nexus Aperture Ring */}
                  {isNexus && (
                    <div
                      className={`absolute -inset-1.5 rounded-full border border-dashed border-[#E5C5FF]/70 animate-[spin_12s_linear_infinite] pointer-events-none ${
                        isSeen ? 'border-[#E5C5FF]' : ''
                      }`}
                    />
                  )}

                  {/* Photonic Center Pin when seen */}
                  {isSeen && !isNexus && (
                    <div className="w-1.5 h-1.5 rounded-full bg-[#07080B]" />
                  )}

                  {isSeen && isNexus && (
                    <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_8px_#FFF]" />
                  )}
                </div>

                {/* Title label and hover poster preview below */}
                <div
                  className="absolute top-6 left-1/2 -translate-x-1/2 text-center pointer-events-none transition-all duration-200 w-36 z-30"
                >
                  <div
                    className={`font-ui-system text-[11px] leading-tight font-semibold tracking-tight transition-colors duration-200 px-1 py-0.5 rounded ${
                      isSelected ? 'text-white font-bold bg-[#141721]/95 shadow border border-white/20' : 'text-[#8B949E] group-hover:text-white'
                    }`}
                  >
                    {item.title}
                  </div>
                  {isNexus && (
                    <span className="inline-block mt-0.5 text-[8px] font-mono-code text-[#E5C5FF] bg-[#E5C5FF]/10 px-1 py-0.2 rounded border border-[#E5C5FF]/30">
                      NEXUS
                    </span>
                  )}

                  {/* Hover Poster Card Popover */}
                  {item.posterUrl && (
                    <div className="hidden group-hover:block absolute left-1/2 -translate-x-1/2 bottom-full mb-3 w-28 rounded-lg overflow-hidden bg-[#0A0C11] border border-[#2D3342] shadow-[0_8px_24px_rgba(0,0,0,0.8)] p-1 transition-all">
                      <img
                        src={item.posterUrl}
                        alt={item.title}
                        className="w-full h-36 object-cover rounded"
                        referrerPolicy="no-referrer"
                      />
                      <div className="mt-1 text-[9px] font-mono-code text-gray-300 truncate">
                        {item.runtime}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
