import React, { useState } from 'react';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Rows3,
  Columns3,
  Search,
  X,
  BarChart3,
} from 'lucide-react';
import { TimelineNode, LoomMode } from '../types';

interface HudHeaderProps {
  nodes: TimelineNode[];
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  selectedFilter: string;
  onSelectFilter: (filter: string) => void;
  loomMode: LoomMode;
  onToggleLoomMode: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenStats: () => void;
}

export const HudHeader: React.FC<HudHeaderProps> = ({
  nodes,
  zoom,
  onZoomIn,
  onZoomOut,
  onResetView,
  selectedFilter,
  onSelectFilter,
  loomMode,
  onToggleLoomMode,
  searchQuery,
  onSearchChange,
  onOpenStats,
}) => {
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const traversedCount = nodes.filter((n) => n.seen).length;
  const totalCount = nodes.length;
  const percentage = Math.round((traversedCount / totalCount) * 100);

  return (
    <header className="fixed top-0 left-0 right-0 h-16 px-2.5 sm:px-4 md:px-6 flex justify-between items-center bg-[#07080B]/95 z-40 backdrop-blur-md border-b border-[#1E222A] gap-2">
      {/* Mobile Search Overlay if open */}
      {isMobileSearchOpen ? (
        <div className="w-full flex items-center gap-2 animate-fade-in">
          <div className="relative flex-1 flex items-center">
            <Search className="w-4 h-4 text-[#8B949E] absolute left-3 pointer-events-none" />
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search Marvel titles, variants, years..."
              className="w-full bg-[#141721] border border-[#2D3342] rounded-full pl-9 pr-8 py-2 text-xs font-mono-code text-white placeholder-[#8B949E] focus:outline-none focus:border-[#00A3FF]"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 text-[#8B949E] hover:text-white cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <button
            onClick={() => setIsMobileSearchOpen(false)}
            className="p-2 text-xs font-mono-code text-[#8B949E] hover:text-white rounded bg-[#141721] border border-[#2D3342] cursor-pointer"
          >
            CANCEL
          </button>
        </div>
      ) : (
        <>
          {/* Left panel: Route selector & Archival dossier trigger */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="bg-[#141721] border border-[#2D3342] rounded px-2 sm:px-2.5 py-1.5 font-mono-code text-xs tracking-wider flex items-center gap-1.5 shadow-sm">
              <span className="inline-block w-2 h-2 rounded-full bg-[#F5A623] shadow-[0_0_8px_#F5A623] flex-shrink-0"></span>
              <select
                id="hud-route-filter"
                value={selectedFilter}
                onChange={(e) => onSelectFilter(e.target.value)}
                className="bg-transparent text-white font-mono-code text-[11px] sm:text-xs font-semibold focus:outline-none cursor-pointer tracking-wider pr-1 max-w-[110px] sm:max-w-[150px] md:max-w-none truncate"
              >
                <option value="all" className="bg-[#07080B] text-white">
                  ALL ARCHIVES (34)
                </option>
                <option value="616" className="bg-[#07080B] text-[#F5A623]">
                  C-616 SACRED MCU
                </option>
                <option value="10005" className="bg-[#07080B] text-[#00A3FF]">
                  C-10005 MUTANT
                </option>
                <option value="spider" className="bg-[#07080B] text-[#FF3B30]">
                  SPIDER CONTINUITIES
                </option>
                <option value="nexus" className="bg-[#07080B] text-[#E5C5FF]">
                  NEXUS INCURSIONS
                </option>
                <option value="untraversed" className="bg-[#07080B] text-gray-300">
                  UNTRAVERSED ONLY
                </option>
              </select>
            </div>

            {/* Traversed Counter & Stats button */}
            <button
              id="hud-stats-btn"
              onClick={onOpenStats}
              title="Open Archival Diagnostics Dossier"
              className="flex items-center gap-1.5 bg-[#141721] hover:bg-[#1E222A] border border-[#2D3342] hover:border-[#3D4455] rounded px-2 sm:px-2.5 py-1.5 font-mono-code text-xs text-white transition-all cursor-pointer active:scale-95"
            >
              <BarChart3 className="w-3.5 h-3.5 text-[#F5A623]" />
              <span className="text-[#F5A623] font-bold text-[11px] sm:text-xs">
                {traversedCount}/{totalCount}
              </span>
              <span className="text-[10px] text-[#8B949E] hidden md:inline">({percentage}%)</span>
            </button>
          </div>

          {/* Center panel: Search Bar (desktop) */}
          <div className="flex-1 max-w-xs md:max-w-sm relative hidden sm:block">
            <div className="relative flex items-center">
              <Search className="w-3.5 h-3.5 text-[#8B949E] absolute left-2.5 pointer-events-none" />
              <input
                id="hud-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search titles, variants, years..."
                className="w-full bg-[#141721] border border-[#2D3342] rounded-full pl-8 pr-7 py-1 text-xs font-mono-code text-white placeholder-[#8B949E]/70 focus:outline-none focus:border-[#F5A623] transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-2 text-[#8B949E] hover:text-white cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Right panel: Mobile Search Trigger, Orientation Switcher & Zoom Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Mobile Search Icon Button */}
            <button
              onClick={() => setIsMobileSearchOpen(true)}
              title="Search"
              className="sm:hidden p-2 bg-[#141721] border border-[#2D3342] rounded text-[#8B949E] hover:text-white cursor-pointer"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Layout Orientation Switcher */}
            <button
              id="toggle-loom-mode-btn"
              onClick={onToggleLoomMode}
              title={`Switch to ${loomMode === 'vertical' ? 'Horizontal Canvas' : 'Vertical Mobile Cards'}`}
              className="bg-[#141721] hover:bg-[#1E222A] border border-[#2D3342] hover:border-[#3D4455] rounded px-2 sm:px-2.5 py-1.5 font-mono-code text-[11px] sm:text-xs tracking-wider flex items-center gap-1.5 transition-all text-white active:scale-95 shadow-sm cursor-pointer"
            >
              {loomMode === 'vertical' ? (
                <>
                  <Rows3 className="w-3.5 h-3.5 text-[#00A3FF]" />
                  <span className="hidden xs:inline">CARDS</span>
                </>
              ) : (
                <>
                  <Columns3 className="w-3.5 h-3.5 text-[#F5A623]" />
                  <span className="hidden xs:inline">CANVAS</span>
                </>
              )}
            </button>

            {/* Zoom Controls (Horizontal Mode) */}
            {loomMode === 'horizontal' && (
              <div className="bg-[#141721] border border-[#2D3342] rounded px-1.5 py-1 font-mono-code text-xs tracking-wider flex items-center gap-0.5 shadow-sm">
                <button
                  id="zoom-out-btn"
                  onClick={onZoomOut}
                  title="Zoom Out"
                  className="p-1 rounded hover:bg-[#2D3342] text-[#8B949E] hover:text-white transition-colors cursor-pointer"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-white font-mono-code text-[10px] sm:text-[11px] min-w-[28px] text-center">
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  id="zoom-in-btn"
                  onClick={onZoomIn}
                  title="Zoom In"
                  className="p-1 rounded hover:bg-[#2D3342] text-[#8B949E] hover:text-white transition-colors cursor-pointer"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  id="reset-view-btn"
                  onClick={onResetView}
                  title="Reset Coordinates"
                  className="p-1 rounded hover:bg-[#2D3342] text-[#8B949E] hover:text-white transition-colors cursor-pointer ml-0.5"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </header>
  );
};
