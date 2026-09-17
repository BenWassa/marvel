import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  AlertOctagon,
  Link2,
  Clock,
  ShieldCheck,
  Film,
  Sparkles,
} from 'lucide-react';
import { TimelineNode } from '../types';

interface ChronoDockProps {
  activeNode: TimelineNode | null;
  onClose: () => void;
  onToggleStatus: (id: string) => void;
  onNavigateNode: (direction: 'prev' | 'next') => void;
  onJumpToNode?: (id: string) => void;
  hasPrev: boolean;
  hasNext: boolean;
}

export const ChronoDock: React.FC<ChronoDockProps> = ({
  activeNode,
  onClose,
  onToggleStatus,
  onNavigateNode,
  onJumpToNode,
  hasPrev,
  hasNext,
}) => {
  const [cachedNode, setCachedNode] = useState<TimelineNode | null>(activeNode);
  const [imageError, setImageError] = useState(false);

  React.useEffect(() => {
    if (activeNode) {
      setCachedNode(activeNode);
      setImageError(false);
    }
  }, [activeNode]);

  const displayNode = activeNode || cachedNode;
  const isOpen = Boolean(activeNode);

  if (!displayNode) return null;

  const color = displayNode.color;
  const isSeen = displayNode.seen;
  const isNexus = displayNode.nexus;

  const getIncursionRiskBadge = (risk?: string) => {
    switch (risk) {
      case 'Catastrophic':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-mono-code font-bold bg-[#FF3B30]/15 text-[#FFA19B] border border-[#FF3B30]/40 flex items-center gap-1">
            <AlertOctagon className="w-3.5 h-3.5 text-[#FF3B30]" /> CATASTROPHIC INCURSION
          </span>
        );
      case 'Timeline Divergence':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-mono-code font-bold bg-[#00A3FF]/15 text-[#70CFFF] border border-[#00A3FF]/40 flex items-center gap-1">
            <Link2 className="w-3.5 h-3.5 text-[#00A3FF]" /> TIMELINE DIVERGENCE
          </span>
        );
      case 'Severe':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-mono-code font-semibold bg-[#F5A623]/15 text-[#FFD082] border border-[#F5A623]/40 flex items-center gap-1">
            SEVERE ANOMALY
          </span>
        );
      case 'Moderate':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-mono-code text-yellow-300 bg-yellow-950/30 border border-yellow-700/50">
            MODERATE SHIFT
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-mono-code text-emerald-400 bg-emerald-950/30 border border-emerald-800/40 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> STABLE CONTINUITY
          </span>
        );
    }
  };

  return (
    <>
      {/* Mobile Backdrop Scrim */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/70 z-40 md:hidden transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      <footer
        id="chrono-dock"
        className={`fixed bottom-0 left-0 right-0 bg-[#0A0C11]/98 border-t border-[#1E222A] backdrop-blur-2xl flex flex-col md:flex-row items-stretch md:items-center px-4 sm:px-6 md:px-8 pt-3 pb-6 md:py-4 z-50 shadow-[0_-16px_60px_rgba(0,0,0,0.9)] max-h-[85vh] md:max-h-60 overflow-y-auto md:overflow-visible transition-transform duration-350 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isOpen ? 'translate-y-0 pointer-events-auto' : 'translate-y-full pointer-events-none'
        }`}
      >
        {/* Mobile Pull Handle */}
        <div className="w-12 h-1 rounded-full bg-[#2D3342] mx-auto -mt-1 mb-3 md:hidden flex-shrink-0" />

        {/* Close button */}
        <button
          id="dock-close-btn"
          onClick={onClose}
          aria-label="Close archival dossier"
          className="absolute top-3 right-4 md:right-6 font-mono-code text-xs text-[#8B949E] hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 py-1 px-2.5 rounded hover:bg-[#141721] active:scale-95 z-10"
        >
          <span className="hidden sm:inline text-[10px] bg-[#1E222A] px-1.5 py-0.5 rounded text-gray-300">
            ESC
          </span>
          <span className="text-xs font-semibold">CLOSE</span>
          <X className="w-4 h-4" />
        </button>

        {/* Left Column: Poster Artwork & Badges */}
        <div className="flex-shrink-0 w-full md:w-80 flex items-start gap-3.5 border-b md:border-b-0 md:border-r border-[#1E222A] pb-3 md:pb-0 md:pr-5 mb-2.5 md:mb-0">
          {/* TMDB Poster Artwork */}
          <div className="relative w-18 h-26 sm:w-20 sm:h-28 rounded-md overflow-hidden bg-[#141721] border border-[#2D3342] flex-shrink-0 shadow-md">
            {displayNode.posterUrl && !imageError ? (
              <img
                src={displayNode.posterUrl}
                alt={displayNode.title}
                referrerPolicy="no-referrer"
                onError={() => setImageError(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-[#8B949E] p-1 text-center font-mono-code text-[9px]">
                <Film className="w-5 h-5 mb-1 opacity-50" />
                <span>MARVEL</span>
              </div>
            )}
            {isSeen && (
              <div className="absolute top-1 right-1 bg-emerald-500 text-black p-0.5 rounded-full shadow">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
            )}
          </div>

          {/* Metadata accanto poster */}
          <div className="flex-1 flex flex-col justify-center min-w-0 pr-12 md:pr-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span
                id="dock-year"
                className="font-mono-code text-xl sm:text-2xl font-bold tracking-tight text-white"
              >
                {displayNode.year}
              </span>
              <span className="px-1.5 py-0.5 rounded text-[11px] font-mono-code bg-[#141721] text-white border border-[#2D3342] tracking-wider font-semibold">
                {displayNode.universeCode}
              </span>
              {isNexus && (
                <span className="px-1.5 py-0.5 rounded text-[11px] font-mono-code bg-[#E5C5FF]/20 text-[#E5C5FF] border border-[#E5C5FF]/40 tracking-wider font-bold">
                  NEXUS
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
              {getIncursionRiskBadge(displayNode.incursionRisk)}
            </div>

            <div className="flex items-center gap-2 mt-1.5 text-xs font-mono-code text-[#8B949E]">
              <Clock className="w-3.5 h-3.5 text-[#8B949E]" />
              <span>{displayNode.runtime}</span>
              {displayNode.phase && (
                <>
                  <span>•</span>
                  <span className="text-[#F5A623]">{displayNode.phase}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Center Column: Title, Synopsis, Anchor, Variants, Connections */}
        <div className="flex-1 w-full md:px-6 py-1 overflow-hidden">
          <div className="flex items-center gap-2 flex-wrap">
            <h2
              id="dock-title"
              className="text-base sm:text-lg md:text-xl font-bold tracking-tight text-white truncate max-w-xl"
            >
              {displayNode.title}
            </h2>
            {isSeen && (
              <span className="inline-flex items-center gap-1 text-[11px] font-mono-code text-emerald-400 bg-emerald-950/50 border border-emerald-800/70 px-2 py-0.5 rounded flex-shrink-0">
                <Check className="w-3 h-3" /> TRAVERSED
              </span>
            )}
          </div>

          {/* Anchor Event */}
          {displayNode.anchorEvent && (
            <div className="text-xs font-mono-code text-[#F5A623]/90 mt-0.5 flex items-center gap-1.5 truncate">
              <span className="text-[#8B949E]">ANCHOR:</span>
              <span>§ {displayNode.anchorEvent}</span>
            </div>
          )}

          {/* Description */}
          <p
            id="dock-desc"
            className="text-xs sm:text-sm text-[#8B949E] leading-relaxed mt-1 line-clamp-2 md:line-clamp-2"
          >
            {displayNode.desc}
          </p>

          {/* Multiversal Connections or Cast Tags */}
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            {displayNode.connections && displayNode.connections.length > 0 ? (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-mono-code text-[#E5C5FF] font-bold">
                  NEXUS ANOMALIES:
                </span>
                {displayNode.connections.map((conn) => (
                  <button
                    key={conn.targetId}
                    onClick={() => onJumpToNode && onJumpToNode(conn.targetId)}
                    title={conn.reason}
                    className="px-2.5 py-0.5 rounded text-[11px] font-mono-code bg-[#E5C5FF]/15 hover:bg-[#E5C5FF]/30 text-[#E5C5FF] border border-[#E5C5FF]/40 hover:border-[#E5C5FF] flex items-center gap-1 transition-all cursor-pointer active:scale-95"
                  >
                    <span>{conn.targetTitle}</span>
                    <span className="text-[10px]">↗</span>
                  </button>
                ))}
              </div>
            ) : displayNode.keyVariants && displayNode.keyVariants.length > 0 ? (
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] font-mono-code text-[#8B949E]">VARIANTS:</span>
                {displayNode.keyVariants.slice(0, 3).map((variant, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded text-[11px] font-mono-code bg-[#141721] text-gray-200 border border-[#2D3342]"
                  >
                    {variant}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        {/* Right Column: Navigation & Photonic Traversal Action */}
        <div className="flex-shrink-0 w-full md:w-auto flex items-center justify-between md:justify-end gap-3 mt-3 md:mt-0 pt-2.5 md:pt-0 border-t md:border-t-0 border-[#1E222A]">
          {/* Previous / Next Stepper */}
          <div className="flex items-center gap-1 bg-[#141721] border border-[#2D3342] rounded p-1">
            <button
              id="dock-prev-btn"
              onClick={() => onNavigateNode('prev')}
              disabled={!hasPrev}
              title="Previous Node"
              className="p-2 sm:p-2 rounded hover:bg-[#2D3342] text-[#8B949E] hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors active:scale-95 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              id="dock-next-btn"
              onClick={() => onNavigateNode('next')}
              disabled={!hasNext}
              title="Next Node"
              className="p-2 sm:p-2 rounded hover:bg-[#2D3342] text-[#8B949E] hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors active:scale-95 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Photonic status button */}
          <button
            id="dock-toggle"
            onClick={() => onToggleStatus(displayNode.id)}
            style={{
              borderColor: color,
              backgroundColor: isSeen ? color : 'transparent',
              color: isSeen ? '#07080B' : color,
              boxShadow: isSeen ? `0 0 20px ${color}99` : 'none',
            }}
            className={`flex-1 md:flex-initial text-center px-4 sm:px-6 py-2.5 min-h-[44px] rounded font-mono-code text-xs font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer border active:scale-98 ${
              isSeen ? 'hover:brightness-110' : 'hover:bg-[#141721]'
            }`}
          >
            {isSeen ? `[✓] TRAVERSED (${displayNode.runtime})` : `[ ] MARK TRAVERSED`}
          </button>
        </div>
      </footer>
    </>
  );
};
