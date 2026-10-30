import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Bookmark, CheckCircle2, Clock3, Plus, Search, X } from 'lucide-react';
import {
  MCU_CATALOGUE,
  WatchKind,
  WatchStatus,
  WatchTitle,
  WatchlistState,
  getStatus,
  watchlistStats,
} from '../watchlist';

type Filter = 'selected' | 'all' | 'unwatched' | 'watching' | 'watched';
type KindFilter = 'all' | WatchKind;
interface Props {
  isOpen: boolean;
  onClose: () => void;
  state: WatchlistState;
  onSelect: (id: string, selected: boolean) => void;
  onSetStatus: (id: string, status: WatchStatus) => void;
}

const phaseLabels: Record<number, string> = {
  1: 'Phase 1 · 2008–2012',
  2: 'Phase 2 · 2013–2015',
  3: 'Phase 3 · 2016–2019',
  4: 'Phase 4 · 2021–2022',
  5: 'Phase 5 · 2023–2025',
  6: 'Phase 6 · 2025–',
};
const kindLabels: Record<WatchKind, string> = {
  film: 'Film', series: 'Series', animated: 'Animation', special: 'Special',
};
const formatTime = (minutes: number) =>
  `${Math.floor(minutes / 60)}h ${String(minutes % 60).padStart(2, '0')}m`;
const runtimeLabel = (title: WatchTitle) =>
  title.runtimeMinutes === null
    ? 'Runtime TBD'
    : `${title.runtimeEstimated ? '~' : ''}${formatTime(title.runtimeMinutes)}`;

export const PersonalWatchlistModal: React.FC<Props> = ({
  isOpen, onClose, state, onSelect, onSetStatus,
}) => {
  const [filter, setFilter] = useState<Filter>('selected');
  const [kind, setKind] = useState<KindFilter>('all');
  const [query, setQuery] = useState('');
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const prior = document.activeElement as HTMLElement | null;
    const frame = requestAnimationFrame(() => closeRef.current?.focus());
    return () => {
      cancelAnimationFrame(frame);
      prior?.focus();
    };
  }, [isOpen]);

  const stats = useMemo(() => watchlistStats(state), [state]);
  const selectedSet = useMemo(() => new Set(state.selectedIds), [state.selectedIds]);
  const visible = useMemo(() => MCU_CATALOGUE.filter((title) => {
    const selected = selectedSet.has(title.id);
    if (filter === 'selected' && !selected) return false;
    if (filter !== 'all' && filter !== 'selected' && (!selected || getStatus(state, title.id) !== filter)) return false;
    if (kind !== 'all' && title.kind !== kind) return false;
    if (query.trim() && !`${title.title} ${title.year} ${kindLabels[title.kind]}`.toLowerCase().includes(query.trim().toLowerCase())) return false;
    return true;
  }), [filter, kind, query, state, selectedSet]);
  const groups = [1, 2, 3, 4, 5, 6]
    .map((phase) => ({ phase, titles: visible.filter((title) => title.phase === phase) }))
    .filter((group) => group.titles.length > 0);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.stopPropagation();
      onClose();
      return;
    }
    if (event.key !== 'Tab') return;
    const focusable = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>(
      'button:not([disabled]), input:not([disabled]), select:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'
    ) ?? []);
    if (focusable.length === 0) return;
    const first = focusable[0], last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 p-0 backdrop-blur-sm sm:p-4"
      onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="personal-watchlist-title"
        aria-describedby="personal-watchlist-description"
        onKeyDown={handleKeyDown}
        className="atlas-panel flex h-full w-full max-w-5xl flex-col overflow-hidden sm:h-[min(94vh,1000px)] sm:rounded-2xl"
      >
        <header className="flex flex-none items-center justify-between gap-4 border-b border-[var(--border-subtle)] px-4 py-4 sm:px-6">
          <div className="min-w-0">
            <h2 id="personal-watchlist-title" className="flex items-center gap-2 text-xl font-semibold text-white sm:text-2xl">
              <Bookmark className="h-5 w-5 text-[var(--accent-mcu)]" aria-hidden="true" />
              My Watchlist
            </h2>
            <p id="personal-watchlist-description" className="mt-1 text-xs text-[var(--text-muted)] sm:text-sm">
              Add or remove any title. Your watch history is kept even when you remove a title.
            </p>
          </div>
          <button ref={closeRef} type="button" onClick={onClose} aria-label="Close my watchlist"
            className="atlas-control atlas-touch flex flex-none items-center justify-center">
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-6">
          <section aria-label="Selected watchlist summary" className="mb-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[
              ['Selected', String(stats.selectedCount)],
              ['Completed', `${stats.watchedCount}/${stats.selectedCount}`],
              ['Total watch time', `${stats.hasEstimates ? '~' : ''}${formatTime(stats.selectedMinutes)}`],
              ['Remaining', `${stats.hasEstimates ? '~' : ''}${formatTime(stats.remainingMinutes)}`],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-1)] p-3 sm:p-4">
                <p className="text-xs text-[var(--text-muted)]">{label}</p>
                <p className="mt-1 text-xl font-semibold text-white sm:text-2xl">{value}</p>
              </div>
            ))}
          </section>
          <p className="mb-5 text-xs text-[var(--text-muted)]" aria-live="polite">
            {stats.watchingCount} watching · {stats.unknownRuntimeCount > 0
              ? `${stats.unknownRuntimeCount} selected title(s) have unknown runtime and are excluded from time totals.`
              : 'All selected titles have recorded runtimes.'}
            {stats.hasEstimates ? ' Series runtimes include estimates.' : ''}
          </p>

          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="relative min-w-0 flex-1">
              <span className="sr-only">Search MCU catalogue</span>
              <Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-[var(--text-muted)]" />
              <input className="atlas-control h-11 w-full pl-10 pr-3 text-sm" type="search"
                value={query} onChange={(event) => setQuery(event.target.value)}
                placeholder="Search movies and series…" />
            </label>
            <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
              <span>Type</span>
              <select value={kind} onChange={(event) => setKind(event.target.value as KindFilter)}
                className="atlas-control h-11 px-3">
                <option value="all">All types</option>
                <option value="film">Films</option>
                <option value="series">Series</option>
                <option value="animated">Animation</option>
                <option value="special">Specials</option>
              </select>
            </label>
          </div>

          <div className="mb-5 flex flex-wrap gap-2" role="group" aria-label="Watchlist filter">
            {([
              ['selected', 'My selections'], ['all', 'All MCU'],
              ['unwatched', 'Not started'], ['watching', 'Watching'], ['watched', 'Completed'],
            ] as const).map(([id, label]) => (
              <button key={id} type="button" onClick={() => setFilter(id)}
                aria-pressed={filter === id}
                className={`min-h-11 rounded-xl border px-3 text-sm font-medium ${filter === id
                  ? 'border-[var(--accent-mcu)] bg-[rgba(245,166,35,0.13)] text-[var(--accent-mcu-core)]'
                  : 'border-[var(--border-subtle)] bg-[var(--surface-1)] text-[var(--text-secondary)] hover:border-[var(--border-strong)]'}`}>
                {label}
              </button>
            ))}
          </div>

          {visible.length === 0 ? (
            <div className="rounded-xl border border-[var(--border-subtle)] p-8 text-center">
              <p className="text-sm text-[var(--text-secondary)]">No titles match these filters.</p>
              <button type="button" className="atlas-control mt-3 px-4 text-sm"
                onClick={() => { setFilter('all'); setKind('all'); setQuery(''); }}>
                Browse all titles
              </button>
            </div>
          ) : groups.map((group) => (
            <section key={group.phase} className="mb-6" aria-label={phaseLabels[group.phase]}>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">
                {phaseLabels[group.phase]}
              </h3>
              <div className="space-y-2">
                {group.titles.map((title) => {
                  const selected = selectedSet.has(title.id);
                  const status = getStatus(state, title.id);
                  return (
                    <div key={title.id}
                      className={`flex flex-col gap-3 rounded-xl border p-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 ${selected
                        ? 'border-[rgba(245,166,35,0.55)] bg-[rgba(245,166,35,0.08)] sm:p-4'
                        : 'border-[var(--border-subtle)] bg-[var(--surface-1)]'}`}>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className={`font-semibold leading-snug ${selected ? 'text-lg text-white' : 'text-sm text-[var(--text-secondary)]'}`}>
                            {title.title}
                          </h4>
                          {selected && <CheckCircle2 className="h-4 w-4 text-[var(--accent-mcu)]" aria-label="Selected" />}
                        </div>
                        <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-[var(--text-muted)]">
                          <span>{title.year} · {kindLabels[title.kind]}</span>
                          <span aria-hidden="true">·</span>
                          <Clock3 className="h-3 w-3" aria-hidden="true" />
                          <span>{runtimeLabel(title)}</span>
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        {selected && (
                          <label className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                            <span className="sr-only">Viewing status for {title.title}</span>
                            <select className="atlas-control h-11 max-w-[160px] px-2 text-xs sm:text-sm"
                              value={status}
                              onChange={(event) => onSetStatus(title.id, event.target.value as WatchStatus)}>
                              <option value="unwatched">Not started</option>
                              <option value="watching">Watching</option>
                              <option value="watched">Completed</option>
                            </select>
                          </label>
                        )}
                        <button type="button" onClick={() => onSelect(title.id, !selected)}
                          aria-label={`${selected ? 'Remove' : 'Add'} ${title.title} ${selected ? 'from' : 'to'} my watchlist`}
                          className={`atlas-control min-h-11 min-w-[95px] px-3 text-sm font-medium ${selected ? '' : 'border-[var(--border-strong)]'}`}>
                          {selected ? 'Remove' : <span className="inline-flex items-center gap-1"><Plus className="h-4 w-4" /> Add</span>}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
        <footer className="flex flex-none items-center justify-between gap-3 border-t border-[var(--border-subtle)] px-4 py-3 text-xs text-[var(--text-muted)] sm:px-6">
          <span>{visible.length} shown · Release order · Stored on this device</span>
          <button className="atlas-control min-h-11 px-4 text-sm font-semibold" type="button" onClick={onClose}>
            Done
          </button>
        </footer>
      </div>
    </div>
  );
};
