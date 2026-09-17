import React, { useState, useMemo } from 'react';
import {
  Clock,
  Check,
  AlertOctagon,
  ShieldCheck,
  Link2,
  Calendar,
  Layers,
  ArrowUpDown,
  SortAsc,
  Sparkles,
  Film,
  Compass,
} from 'lucide-react';
import { TimelineNode, UniverseId } from '../types';
import { ERA_DIVIDERS } from '../data';

interface VerticalLoomProps {
  nodes: TimelineNode[];
  activeNodeId: string | null;
  onSelectNode: (id: string) => void;
  onToggleStatus?: (id: string) => void;
  selectedFilter: string;
  searchQuery?: string;
}

type SortOption = 'chronological' | 'title' | 'runtime';

export const VerticalLoom: React.FC<VerticalLoomProps> = ({
  nodes,
  activeNodeId,
  onSelectNode,
  onToggleStatus,
  selectedFilter,
  searchQuery = '',
}) => {
  const [sortOption, setSortOption] = useState<SortOption>('chronological');
  const [activeLetter, setActiveLetter] = useState<string | null>(null);

  // Filter nodes based on filter pill and search query
  const filteredNodes = useMemo(() => {
    return nodes.filter((node) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = node.title.toLowerCase().includes(q);
        const matchYear = node.year.includes(q);
        const matchAnchor = (node.anchorEvent || '').toLowerCase().includes(q);
        const matchCode = (node.universeCode || '').toLowerCase().includes(q);
        const matchKey = (node.keyVariants || []).some((k) => k.toLowerCase().includes(q));
        if (!matchTitle && !matchYear && !matchAnchor && !matchCode && !matchKey) {
          return false;
        }
      }

      if (selectedFilter === 'all') return true;
      if (selectedFilter === '616') return node.uni === '616';
      if (selectedFilter === '10005') return node.uni === '10005';
      if (selectedFilter === 'spider') return node.uni === 'spider';
      if (selectedFilter === 'nexus') return !!node.nexus;
      if (selectedFilter === 'untraversed') return !node.seen;
      return true;
    });
  }, [nodes, selectedFilter, searchQuery]);

  // Sorted list according to user option (Chronological vs By Title vs Runtime)
  const sortedNodes = useMemo(() => {
    const list = [...filteredNodes];
    if (sortOption === 'title') {
      return list.sort((a, b) => a.title.localeCompare(b.title));
    }
    if (sortOption === 'runtime') {
      return list.sort((a, b) => b.runtimeMinutes - a.runtimeMinutes);
    }
    // Chronological default (year then id)
    return list.sort((a, b) => {
      const yearDiff = parseInt(a.year, 10) - parseInt(b.year, 10);
      if (yearDiff !== 0) return yearDiff;
      return a.verticalY - b.verticalY;
    });
  }, [filteredNodes, sortOption]);

  // Group by Starting Letter for "By Title" view
  const titleGroups = useMemo(() => {
    if (sortOption !== 'title') return null;
    const groups: { [key: string]: TimelineNode[] } = {};
    sortedNodes.forEach((node) => {
      const firstChar = node.title.charAt(0).toUpperCase();
      const letter = /[A-Z]/.test(firstChar) ? firstChar : '#';
      if (!groups[letter]) groups[letter] = [];
      groups[letter].push(node);
    });
    return groups;
  }, [sortedNodes, sortOption]);

  // Available letters for A-Z jumper
  const availableLetters = useMemo(() => {
    if (!titleGroups) return [];
    return Object.keys(titleGroups).sort();
  }, [titleGroups]);

  // Group by Era for "Chronological" view
  const eraGroups = useMemo(() => {
    if (sortOption !== 'chronological') return null;
    return [
      {
        id: 'era-roots',
        label: 'ERA I: DAWN OF MODERN CONTINUITY',
        years: '2000 — 2007',
        description: 'X-Men genesis and the Sam Raimi Spider-Man trilogy foundation.',
        items: sortedNodes.filter((n) => parseInt(n.year, 10) <= 2007),
      },
      {
        id: 'era-p1-2',
        label: 'ERA II: AVENGERS INITIATIVE & EXPANSION',
        years: '2008 — 2015',
        description: 'Phase 1 & 2 emergence, First Class, and Amazing Spider-Man duology.',
        items: sortedNodes.filter(
          (n) => parseInt(n.year, 10) >= 2008 && parseInt(n.year, 10) <= 2015
        ),
      },
      {
        id: 'era-p3',
        label: 'ERA III: THE INFINITY SAGA CLIMAX',
        years: '2016 — 2019',
        description: 'Civil War, Logan anchor dissolution, Spider-Verse, and Endgame.',
        items: sortedNodes.filter(
          (n) => parseInt(n.year, 10) >= 2016 && parseInt(n.year, 10) <= 2019
        ),
      },
      {
        id: 'era-multi',
        label: 'ERA IV: THE MULTIVERSE CONVERGENCE',
        years: '2021 — 2024+',
        description: 'Loki temporal restructuring, No Way Home rift, and Deadpool & Wolverine.',
        items: sortedNodes.filter((n) => parseInt(n.year, 10) >= 2021),
      },
    ].filter((g) => g.items.length > 0);
  }, [sortedNodes, sortOption]);

  const getUniverseBadge = (uni: UniverseId, code: string) => {
    switch (uni) {
      case '616':
        return {
          label: 'C-616 SACRED MCU',
          bg: 'bg-[#F5A623]/15 text-[#FFD082] border-[#F5A623]/30',
          dot: 'bg-[#F5A623]',
        };
      case '10005':
        return {
          label: 'C-10005 MUTANT',
          bg: 'bg-[#00A3FF]/15 text-[#70CFFF] border-[#00A3FF]/30',
          dot: 'bg-[#00A3FF]',
        };
      case 'spider':
        return {
          label: 'SPIDER-BRANCH',
          bg: 'bg-[#FF3B30]/15 text-[#FFA19B] border-[#FF3B30]/30',
          dot: 'bg-[#FF3B30]',
        };
    }
  };

  const getIncursionRiskBadge = (risk?: string) => {
    switch (risk) {
      case 'Catastrophic':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-mono-code font-bold bg-[#FF3B30]/20 text-[#FFA19B] border border-[#FF3B30]/40 flex items-center gap-1">
            <AlertOctagon className="w-3 h-3 text-[#FF3B30]" /> CATASTROPHIC
          </span>
        );
      case 'Timeline Divergence':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-mono-code font-bold bg-[#00A3FF]/20 text-[#70CFFF] border border-[#00A3FF]/40 flex items-center gap-1">
            <Link2 className="w-3 h-3 text-[#00A3FF]" /> DIVERGENCE
          </span>
        );
      case 'Severe':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-mono-code font-semibold bg-[#F5A623]/20 text-[#FFD082] border border-[#F5A623]/40">
            SEVERE
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-mono-code text-emerald-400 bg-emerald-950/30 border border-emerald-800/40">
            STABLE
          </span>
        );
    }
  };

  return (
    <div className="w-full h-full overflow-y-auto bg-[#07080B] text-white select-none pb-40">
      {/* Sticky Top Toolbar for Mobile: Mode Switcher & Sort Options */}
      <div className="sticky top-0 z-30 bg-[#07080B]/95 backdrop-blur-md border-b border-[#1E222A] px-3 sm:px-6 py-2.5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        {/* Sort & Organization Controls */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 scrollbar-none">
          <span className="text-xs font-mono-code text-[#8B949E] mr-1 hidden sm:inline flex-shrink-0">
            ORGANIZATION:
          </span>
          <button
            onClick={() => setSortOption('chronological')}
            className={`px-3 py-1.5 rounded text-xs font-mono-code flex items-center gap-1.5 transition-all cursor-pointer flex-shrink-0 font-semibold ${
              sortOption === 'chronological'
                ? 'bg-[#F5A623] text-black shadow-[0_0_15px_rgba(245,166,35,0.4)]'
                : 'bg-[#141721] text-[#8B949E] hover:text-white border border-[#2D3342]'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>CHRONOLOGICAL</span>
          </button>

          <button
            onClick={() => setSortOption('title')}
            className={`px-3 py-1.5 rounded text-xs font-mono-code flex items-center gap-1.5 transition-all cursor-pointer flex-shrink-0 font-semibold ${
              sortOption === 'title'
                ? 'bg-[#00A3FF] text-black shadow-[0_0_15px_rgba(0,163,255,0.4)]'
                : 'bg-[#141721] text-[#8B949E] hover:text-white border border-[#2D3342]'
            }`}
          >
            <SortAsc className="w-3.5 h-3.5" />
            <span>BY TITLE (A → Z)</span>
          </button>

          <button
            onClick={() => setSortOption('runtime')}
            className={`px-3 py-1.5 rounded text-xs font-mono-code flex items-center gap-1.5 transition-all cursor-pointer flex-shrink-0 font-semibold ${
              sortOption === 'runtime'
                ? 'bg-[#FF3B30] text-white shadow-[0_0_15px_rgba(255,59,48,0.4)]'
                : 'bg-[#141721] text-[#8B949E] hover:text-white border border-[#2D3342]'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>BY RUNTIME</span>
          </button>
        </div>

        {/* Count Indicator */}
        <div className="flex items-center justify-between sm:justify-end gap-2 text-xs font-mono-code text-[#8B949E]">
          <span>
            SHOWING <strong className="text-white">{sortedNodes.length}</strong> / {nodes.length}{' '}
            CONTINUITIES
          </span>
          {sortOption === 'title' && availableLetters.length > 0 && (
            <span className="text-[11px] text-[#00A3FF] font-bold">
              {availableLetters.length} LETTERS
            </span>
          )}
        </div>
      </div>

      {/* Fast A-Z Scrubber if sorting by title */}
      {sortOption === 'title' && availableLetters.length > 0 && (
        <div className="sticky top-12 z-20 bg-[#0A0C11]/90 backdrop-blur-md border-b border-[#1E222A]/80 px-3 py-1.5 flex items-center gap-1 overflow-x-auto scrollbar-none justify-center">
          {availableLetters.map((letter) => (
            <a
              key={letter}
              href={`#letter-${letter}`}
              className="px-2 py-1 text-xs font-mono-code font-bold text-gray-400 hover:text-white hover:bg-[#1E222A] rounded transition-colors"
            >
              {letter}
            </a>
          ))}
        </div>
      )}

      {/* Main Content Area: Responsive Card Stream */}
      <div className="max-w-4xl mx-auto px-3 sm:px-6 py-4">
        {/* If no matches */}
        {sortedNodes.length === 0 && (
          <div className="text-center py-20 bg-[#0E1118] border border-[#1E222A] rounded-xl p-8 mt-6">
            <Film className="w-12 h-12 mx-auto text-[#8B949E] mb-3 opacity-40" />
            <h3 className="text-lg font-bold text-white font-mono-code">
              NO CONTINUITY STRANDS FOUND
            </h3>
            <p className="text-sm text-[#8B949E] mt-1 max-w-sm mx-auto">
              No entries match the query &ldquo;{searchQuery}&rdquo; under the current filters.
            </p>
          </div>
        )}

        {/* VIEW 1: Chronological grouped by Era */}
        {sortOption === 'chronological' && eraGroups && (
          <div className="space-y-8">
            {eraGroups.map((era) => (
              <section key={era.id} className="relative">
                {/* Era Header Banner */}
                <div className="sticky top-12 sm:top-14 z-10 bg-[#0E1118]/95 border border-[#2D3342] rounded-lg p-3 sm:p-4 mb-4 backdrop-blur-md shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div>
                    <h2 className="text-sm sm:text-base font-bold font-mono-code tracking-wide text-[#F5A623] flex items-center gap-2">
                      <Layers className="w-4 h-4 text-[#F5A623]" />
                      {era.label}
                    </h2>
                    <p className="text-xs text-[#8B949E] mt-0.5">{era.description}</p>
                  </div>
                  <span className="text-xs font-mono-code font-bold text-white bg-[#1E222A] px-2.5 py-1 rounded w-fit border border-[#2D3342]">
                    {era.years}
                  </span>
                </div>

                {/* Cards in this Era */}
                <div className="space-y-3.5">
                  {era.items.map((node) => (
                    <TimelineCard
                      key={node.id}
                      node={node}
                      isActive={node.id === activeNodeId}
                      onSelect={() => onSelectNode(node.id)}
                      onToggleStatus={onToggleStatus}
                      getUniverseBadge={getUniverseBadge}
                      getIncursionRiskBadge={getIncursionRiskBadge}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        {/* VIEW 2: By Title (A to Z) */}
        {sortOption === 'title' && titleGroups && (
          <div className="space-y-8">
            {Object.keys(titleGroups)
              .sort()
              .map((letter) => (
                <section key={letter} id={`letter-${letter}`} className="relative scroll-mt-24">
                  {/* Letter Header */}
                  <div className="flex items-center gap-3 mb-3 border-b border-[#1E222A] pb-2">
                    <div className="w-8 h-8 rounded-lg bg-[#00A3FF]/20 border border-[#00A3FF]/40 text-[#00A3FF] flex items-center justify-center font-mono-code font-bold text-base">
                      {letter}
                    </div>
                    <span className="text-xs font-mono-code text-[#8B949E]">
                      {titleGroups[letter].length} TITLE
                      {titleGroups[letter].length === 1 ? '' : 'S'}
                    </span>
                  </div>

                  {/* Cards for this letter */}
                  <div className="space-y-3.5">
                    {titleGroups[letter].map((node) => (
                      <TimelineCard
                        key={node.id}
                        node={node}
                        isActive={node.id === activeNodeId}
                        onSelect={() => onSelectNode(node.id)}
                        onToggleStatus={onToggleStatus}
                        getUniverseBadge={getUniverseBadge}
                        getIncursionRiskBadge={getIncursionRiskBadge}
                      />
                    ))}
                  </div>
                </section>
              ))}
          </div>
        )}

        {/* VIEW 3: By Runtime */}
        {sortOption === 'runtime' && (
          <div className="space-y-3.5">
            {sortedNodes.map((node, idx) => (
              <TimelineCard
                key={node.id}
                node={node}
                rank={idx + 1}
                isActive={node.id === activeNodeId}
                onSelect={() => onSelectNode(node.id)}
                onToggleStatus={onToggleStatus}
                getUniverseBadge={getUniverseBadge}
                getIncursionRiskBadge={getIncursionRiskBadge}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// =========================================================================
// REUSABLE TIMELINE CARD COMPONENT: MOBILE-FIRST, POSTER ARTWORK & CRISP TEXT
// =========================================================================
interface TimelineCardProps {
  node: TimelineNode;
  isActive: boolean;
  rank?: number;
  onSelect: () => void;
  onToggleStatus?: (id: string) => void;
  getUniverseBadge: (
    uni: UniverseId,
    code: string
  ) => { label: string; bg: string; dot: string };
  getIncursionRiskBadge: (risk?: string) => React.ReactNode;
}

const TimelineCard: React.FC<TimelineCardProps> = ({
  node,
  isActive,
  rank,
  onSelect,
  onToggleStatus,
  getUniverseBadge,
  getIncursionRiskBadge,
}) => {
  const [imgFailed, setImgFailed] = useState(false);
  const uniBadge = getUniverseBadge(node.uni, node.universeCode);

  return (
    <div
      onClick={onSelect}
      className={`group relative rounded-xl transition-all duration-200 cursor-pointer overflow-hidden border ${
        isActive
          ? 'bg-[#141824] border-[#00A3FF] ring-2 ring-[#00A3FF]/40 shadow-[0_0_30px_rgba(0,163,255,0.25)]'
          : node.seen
          ? 'bg-[#0B0E14] border-[#1E2530] hover:border-[#384152]'
          : 'bg-[#0D1017] border-[#1C212D] hover:border-[#30384A]'
      }`}
    >
      {/* Continuity strand glowing left border */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1.5 transition-colors"
        style={{ backgroundColor: node.color }}
      />

      <div className="p-3 sm:p-4 pl-4 sm:pl-5 flex items-start gap-3.5 sm:gap-4">
        {/* TMDB Poster Artwork */}
        <div className="relative w-20 sm:w-24 aspect-[2/3] rounded-lg overflow-hidden bg-[#161B26] border border-[#2D3342] flex-shrink-0 shadow-md">
          {node.posterUrl && !imgFailed ? (
            <img
              src={node.posterUrl}
              alt={node.title}
              loading="lazy"
              referrerPolicy="no-referrer"
              onError={() => setImgFailed(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-[#8B949E] p-2 text-center font-mono-code text-[10px]">
              <Film className="w-6 h-6 mb-1 opacity-50" />
              <span>MARVEL</span>
            </div>
          )}

          {/* Traversed checkmark badge over poster */}
          {node.seen && (
            <div className="absolute top-1 right-1 bg-emerald-500 text-black p-1 rounded-full shadow-lg">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
          )}

          {/* Rank if runtime view */}
          {rank && (
            <div className="absolute bottom-1 left-1 bg-black/80 px-1.5 py-0.5 rounded text-[10px] font-mono-code font-bold text-white border border-white/20">
              #{rank}
            </div>
          )}
        </div>

        {/* Content Body: Large, Readable, Zero Wasted Space */}
        <div className="flex-1 min-w-0">
          {/* Top Row: Year, Universe, Nexus Pill */}
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-base sm:text-lg font-mono-code font-bold text-white tracking-tight">
              {node.year}
            </span>

            <span
              className={`px-2 py-0.5 rounded text-[11px] font-mono-code font-semibold border flex items-center gap-1.5 ${uniBadge.bg}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${uniBadge.dot}`} />
              <span>{uniBadge.label}</span>
            </span>

            {node.nexus && (
              <span className="px-2 py-0.5 rounded text-[11px] font-mono-code font-bold bg-[#E5C5FF]/20 text-[#E5C5FF] border border-[#E5C5FF]/40 tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#E5C5FF]" /> NEXUS
              </span>
            )}

            {node.phase && (
              <span className="text-[11px] font-mono-code text-[#F5A623] hidden sm:inline">
                {node.phase}
              </span>
            )}
          </div>

          {/* Large Readable Title */}
          <h3 className="text-base sm:text-lg md:text-xl font-bold tracking-tight text-white group-hover:text-[#70CFFF] transition-colors line-clamp-1">
            {node.title}
          </h3>

          {/* Anchor Event */}
          {node.anchorEvent && (
            <div className="text-xs sm:text-sm font-mono-code text-[#F5A623]/90 mt-0.5 flex items-center gap-1.5 truncate">
              <span className="text-[#8B949E] text-[11px]">ANCHOR:</span>
              <span className="truncate">§ {node.anchorEvent}</span>
            </div>
          )}

          {/* Description snippet on larger screens or compact on mobile */}
          <p className="text-xs sm:text-sm text-[#8B949E] mt-1.5 line-clamp-2 leading-relaxed">
            {node.desc}
          </p>

          {/* Bottom Badges & Quick Action */}
          <div className="mt-2.5 flex items-center justify-between gap-2 flex-wrap pt-2 border-t border-[#1E2533]">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono-code text-[#8B949E] flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{node.runtime}</span>
              </span>

              {getIncursionRiskBadge(node.incursionRisk)}

              {node.connections && node.connections.length > 0 && (
                <span className="text-[11px] font-mono-code text-[#E5C5FF] bg-[#E5C5FF]/10 px-2 py-0.5 rounded border border-[#E5C5FF]/20 flex items-center gap-1">
                  <Link2 className="w-3 h-3" />
                  <span>{node.connections.length} NEXUS LINK</span>
                </span>
              )}
            </div>

            {/* Quick Traverse Checkbox Toggle on Card */}
            {onToggleStatus && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleStatus(node.id);
                }}
                className={`px-3 py-1.5 rounded text-xs font-mono-code font-bold tracking-wide flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 ${
                  node.seen
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30'
                    : 'bg-[#1E2533] text-[#8B949E] hover:text-white border border-[#2D3342] hover:border-gray-500'
                }`}
              >
                <Check className={`w-3.5 h-3.5 ${node.seen ? 'stroke-[3]' : 'opacity-40'}`} />
                <span>{node.seen ? 'TRAVERSED' : 'MARK TRAVERSED'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
