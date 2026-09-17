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
    <header className="atlas-header fixed inset-x-0 top-0 z-50">
      <div className="atlas-progress-track absolute inset-x-0 bottom-0 h-px" aria-hidden="true">
        <div
          className="atlas-progress h-full"
          style={{ width: progress + '%' }}
        />
      </div>

      <div className="mx-auto flex min-h-[72px] max-w-[1600px] items-center gap-2 px-3 py-2 sm:gap-4 sm:px-5 lg:px-8">
        {mobileSearchOpen ? (
          <div className="flex w-full items-center gap-2 sm:hidden">
            <label className="relative flex-1">
              <span className="sr-only">Search the atlas</span>
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                autoFocus
                value={searchQuery}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="Search titles, years, continuity…"
                className="atlas-control h-11 w-full pl-9 pr-10 text-sm"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  aria-label="Clear search"
                  className="atlas-touch absolute right-0 top-1/2 flex -translate-y-1/2 items-center justify-center text-[var(--text-muted)] hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </label>
            <button
              type="button"
              onClick={() => setMobileSearchOpen(false)}
              className="atlas-control h-11 px-3 text-sm font-medium"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="min-w-0 flex-1 sm:flex-none">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 flex-none rounded-full bg-[var(--accent-mcu)] shadow-[0_0_10px_var(--accent-mcu-glow)]" />
                <h1 className="truncate text-sm font-semibold tracking-[0.08em] text-white sm:text-base">
                  MARVEL SCREEN ATLAS
                </h1>
              </div>
              <p className="mt-1 hidden text-xs text-[var(--text-muted)] sm:block">
                Release order, continuity and context
              </p>
            </div>

            <div className="hidden h-8 w-px bg-[var(--border-subtle)] sm:block" />

            <label className="relative flex min-w-0 flex-1 items-center sm:max-w-[300px]">
              <span className="sr-only">Viewing route</span>
              <Route className="pointer-events-none absolute left-3 h-4 w-4 text-[var(--text-secondary)]" />
              <select
                value={activeRouteId}
                onChange={(event) => onRouteChange(event.target.value as AtlasRouteId)}
                className="atlas-control h-11 w-full appearance-none pl-9 pr-8 text-sm font-medium"
              >
                {ATLAS_ROUTES.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 text-sm text-[var(--text-muted)]">⌄</span>
            </label>

            <label className="relative hidden flex-1 sm:block sm:max-w-[360px]">
              <span className="sr-only">Search the atlas</span>
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                value={searchQuery}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="Search titles, years, continuity…"
                className="atlas-control h-11 w-full pl-9 pr-10 text-sm"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  aria-label="Clear search"
                  className="atlas-touch absolute right-0 top-1/2 flex -translate-y-1/2 items-center justify-center text-[var(--text-muted)] hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </label>

            <button
              type="button"
              onClick={() => setMobileSearchOpen(true)}
              aria-label="Open search"
              className="atlas-control atlas-touch flex items-center justify-center text-[var(--text-secondary)] sm:hidden"
            >
              <Search className="h-4 w-4" />
            </button>

            <div className="ml-auto flex flex-none items-center gap-2">
              <div className="hidden items-center gap-3 xl:flex" aria-label="Continuity legend">
                {(Object.keys(UNIVERSE_META) as Array<keyof typeof UNIVERSE_META>).map((id) => {
                  const meta = UNIVERSE_META[id];
                  return (
                    <div key={id} className="flex items-center gap-1.5">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: meta.color }}
                      />
                      <span className="text-xs text-[var(--text-muted)]">{meta.shortLabel}</span>
                    </div>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={onOpenStats}
                aria-label="Open watch progress"
                className="atlas-control flex h-11 min-w-11 items-center justify-center gap-2 px-3"
              >
                <BarChart3 className="h-4 w-4 text-[var(--accent-mcu)]" />
                <div className="hidden text-left sm:block">
                  <div className="text-sm font-semibold text-white">
                    {activeRouteId === 'all'
                      ? traversedCount + '/' + totalCount
                      : routeTraversedCount + '/' + routeTotalCount}
                  </div>
                  <div className="text-xs text-[var(--text-muted)]">
                    {activeRouteId === 'all' ? 'watched' : 'on route'}
                  </div>
                </div>
              </button>
            </div>
          </>
        )}
      </div>

      {!mobileSearchOpen && (
        <div className="mx-auto hidden max-w-[1600px] items-center gap-2 px-5 pb-2.5 sm:flex lg:px-8">
          <span className="text-xs font-medium text-[var(--text-secondary)]">
            {route.shortName}
          </span>
          <span className="h-1 w-1 rounded-full bg-[var(--border-strong)]" />
          <span className="truncate text-xs text-[var(--text-muted)]">{route.description}</span>
        </div>
      )}
    </header>
  );
};
