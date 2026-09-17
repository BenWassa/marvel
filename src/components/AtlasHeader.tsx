import React, { useState } from 'react';
import { BarChart3, Route, Search, X } from 'lucide-react';
import { ATLAS_ROUTES, AtlasRouteId, getRoute, UNIVERSE_META } from '../atlas';

interface AtlasHeaderProps {
  activeRouteId: AtlasRouteId;
  onRouteChange: (routeId: AtlasRouteId) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  traversedCount: number;
  totalCount: number;
  routeTraversedCount: number;
  routeTotalCount: number;
  onOpenStats: () => void;
}

export const AtlasHeader: React.FC<AtlasHeaderProps> = ({
  activeRouteId,
  onRouteChange,
  searchQuery,
  onSearchChange,
  traversedCount,
  totalCount,
  routeTraversedCount,
  routeTotalCount,
  onOpenStats,
}) => {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const route = getRoute(activeRouteId);
  const progress =
    routeTotalCount > 0 ? Math.round((routeTraversedCount / routeTotalCount) * 100) : 0;

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/8 bg-[#06070A]/92 backdrop-blur-2xl">
      <div
        className="absolute inset-x-0 bottom-0 h-px bg-white/5"
        aria-hidden="true"
      >
        <div
          className="h-full bg-[#F5A623] transition-[width] duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mx-auto flex min-h-[76px] max-w-[1600px] items-center gap-2 px-3 py-2 sm:gap-4 sm:px-5 lg:px-8">
        {mobileSearchOpen ? (
          <div className="flex w-full items-center gap-2 sm:hidden">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7E8798]" />
              <input
                autoFocus
                value={searchQuery}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="Search titles, years, people…"
                className="h-10 w-full rounded-xl border border-white/10 bg-white/[0.045] pl-9 pr-9 text-sm text-white outline-none transition focus:border-[#F5A623]/60 focus:bg-white/[0.065]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  aria-label="Clear search"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-[#7E8798] hover:bg-white/5 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={() => setMobileSearchOpen(false)}
              className="h-10 rounded-xl border border-white/10 px-3 font-mono-code text-[11px] uppercase tracking-[0.12em] text-[#9AA3B2]"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="min-w-0 flex-1 sm:flex-none">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 flex-none rounded-full bg-[#F5A623] shadow-[0_0_12px_rgba(245,166,35,0.75)]" />
                <h1 className="truncate text-sm font-semibold tracking-[0.12em] text-white sm:text-base">
                  MARVEL SCREEN ATLAS
                </h1>
              </div>
              <p className="mt-0.5 hidden font-mono-code text-[9px] uppercase tracking-[0.2em] text-[#737D8E] sm:block">
                Release · continuity · context
              </p>
            </div>

            <div className="hidden h-8 w-px bg-white/8 sm:block" />

            <label className="relative flex min-w-0 flex-1 items-center sm:max-w-[310px]">
              <Route className="pointer-events-none absolute left-3 h-3.5 w-3.5 text-[#AAB2C0]" />
              <select
                value={activeRouteId}
                onChange={(event) => onRouteChange(event.target.value as AtlasRouteId)}
                className="h-10 w-full appearance-none rounded-xl border border-white/10 bg-white/[0.045] pl-9 pr-8 font-mono-code text-[11px] font-semibold uppercase tracking-[0.09em] text-white outline-none transition hover:bg-white/[0.065] focus:border-[#F5A623]/60"
                aria-label="Viewing route"
              >
                {ATLAS_ROUTES.map((item) => (
                  <option key={item.id} value={item.id} className="bg-[#0B0D12] text-white">
                    {item.name}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 text-[10px] text-[#727C8E]">⌄</span>
            </label>

            <div className="relative hidden flex-1 sm:block sm:max-w-[360px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#727C8E]" />
              <input
                value={searchQuery}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="Search titles, years, people…"
                className="h-10 w-full rounded-xl border border-white/10 bg-white/[0.035] pl-9 pr-9 text-sm text-white outline-none transition placeholder:text-[#596273] focus:border-[#F5A623]/60 focus:bg-white/[0.055]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  aria-label="Clear search"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-[#727C8E] hover:bg-white/5 hover:text-white"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => setMobileSearchOpen(true)}
              aria-label="Open search"
              className="rounded-xl border border-white/10 bg-white/[0.045] p-2.5 text-[#9AA3B2] sm:hidden"
            >
              <Search className="h-4 w-4" />
            </button>

            <div className="ml-auto flex flex-none items-center gap-1.5 sm:gap-2">
              <div className="hidden items-center gap-2 lg:flex" aria-label="Continuity legend">
                {(Object.keys(UNIVERSE_META) as Array<keyof typeof UNIVERSE_META>).map((id) => {
                  const meta = UNIVERSE_META[id];
                  return (
                    <div key={id} className="flex items-center gap-1.5">
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ backgroundColor: meta.color, boxShadow: `0 0 8px ${meta.glow}` }}
                      />
                      <span className="font-mono-code text-[9px] uppercase tracking-[0.08em] text-[#737D8E]">
                        {meta.shortLabel}
                      </span>
                    </div>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={onOpenStats}
                title="Open watch statistics"
                className="flex h-10 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.045] px-2.5 text-left transition hover:bg-white/[0.07] sm:px-3"
              >
                <BarChart3 className="h-3.5 w-3.5 text-[#F5A623]" />
                <div>
                  <div className="font-mono-code text-[11px] font-bold text-white">
                    {activeRouteId === 'all'
                      ? `${traversedCount}/${totalCount}`
                      : `${routeTraversedCount}/${routeTotalCount}`}
                  </div>
                  <div className="hidden font-mono-code text-[8px] uppercase tracking-[0.12em] text-[#687284] sm:block">
                    {activeRouteId === 'all' ? 'watched' : 'route'}
                  </div>
                </div>
              </button>
            </div>
          </>
        )}
      </div>

      {!mobileSearchOpen && (
        <div className="mx-auto hidden max-w-[1600px] items-center gap-2 px-5 pb-2 sm:flex lg:px-8">
          <span className="font-mono-code text-[9px] uppercase tracking-[0.14em] text-[#657083]">
            {route.shortName}
          </span>
          <span className="h-1 w-1 rounded-full bg-[#3B4351]" />
          <span className="truncate text-[11px] text-[#8791A2]">{route.description}</span>
        </div>
      )}
    </header>
  );
};
