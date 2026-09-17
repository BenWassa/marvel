import React, { useEffect, useRef } from 'react';
import { BarChart3, Check, Clock3, RotateCcw, X } from 'lucide-react';
import { UNIVERSE_META } from '../atlas';
import { TimelineNode, UniverseId } from '../types';

interface ArchivalStatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  nodes: TimelineNode[];
  onBatchUpdateStatus: (uni: UniverseId | 'all', seen: boolean) => void;
}

const formatHoursMins = (mins: number) => {
  const hours = Math.floor(mins / 60);
  const minutes = mins % 60;
  return hours + 'h ' + minutes + 'm';
};

export const ArchivalStatsModal: React.FC<ArchivalStatsModalProps> = ({
  isOpen,
  onClose,
  nodes,
  onBatchUpdateStatus,
}) => {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const previousFocus = document.activeElement as HTMLElement | null;
    const frame = window.requestAnimationFrame(() => closeButtonRef.current?.focus());

    return () => {
      window.cancelAnimationFrame(frame);
      previousFocus?.focus();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const totalCount = nodes.length;
  const watchedNodes = nodes.filter((node) => node.seen);
  const watchedCount = watchedNodes.length;
  const percentComplete = totalCount > 0 ? Math.round((watchedCount / totalCount) * 100) : 0;

  const totalRuntimeMinutes = nodes.reduce(
    (total, node) => total + (node.runtimeMinutes || 120),
    0
  );
  const watchedRuntimeMinutes = watchedNodes.reduce(
    (total, node) => total + (node.runtimeMinutes || 120),
    0
  );
  const nexusCount = nodes.filter((node) => node.nexus).length;

  const continuityStats = (Object.keys(UNIVERSE_META) as UniverseId[]).map((universeId) => {
    const continuityNodes = nodes.filter((node) => node.uni === universeId);
    const continuityWatched = continuityNodes.filter((node) => node.seen).length;
    return {
      universeId,
      meta: UNIVERSE_META[universeId],
      count: continuityNodes.length,
      watched: continuityWatched,
      percent:
        continuityNodes.length > 0
          ? Math.round((continuityWatched / continuityNodes.length) * 100)
          : 0,
    };
  });

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.stopPropagation();
      onClose();
      return;
    }

    if (event.key !== 'Tab') return;

    const focusable = Array.from(
      dialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), select:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'
      ) ?? []
    );

    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;

    if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/75 p-3 backdrop-blur-sm sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="watch-progress-title"
        aria-describedby="watch-progress-description"
        onKeyDown={handleKeyDown}
        className="atlas-panel flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl shadow-[0_22px_70px_rgba(0,0,0,0.72)]"
      >
        <header className="flex items-start justify-between gap-4 border-b border-[var(--border-subtle)] px-4 py-4 sm:px-5">
          <div className="flex min-w-0 gap-3">
            <span className="mt-1 flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-[var(--surface-2)] text-[var(--accent-mcu)]">
              <BarChart3 className="h-4 w-4" />
            </span>
            <div>
              <h2 id="watch-progress-title" className="text-lg font-semibold text-white">
                Watch progress
              </h2>
              <p id="watch-progress-description" className="mt-1 text-sm text-[var(--text-muted)]">
                Progress across the titles currently represented in the atlas.
              </p>
            </div>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close watch progress"
            className="atlas-control atlas-touch flex flex-none items-center justify-center text-[var(--text-muted)] hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="space-y-6 overflow-y-auto p-4 sm:p-5">
          <section aria-label="Overall watch progress">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-1)] p-4">
                <div className="text-xs font-medium text-[var(--text-muted)]">Watched</div>
                <div className="mt-1 text-2xl font-semibold text-white">
                  {watchedCount}/{totalCount}
                </div>
                <div className="mt-1 text-sm text-[var(--text-secondary)]">
                  {percentComplete}% complete
                </div>
              </div>

              <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-1)] p-4">
                <div className="text-xs font-medium text-[var(--text-muted)]">Watch time</div>
                <div className="mt-1 text-2xl font-semibold text-white">
                  {formatHoursMins(watchedRuntimeMinutes)}
                </div>
                <div className="mt-1 text-sm text-[var(--text-secondary)]">
                  of {formatHoursMins(totalRuntimeMinutes)}
                </div>
              </div>

              <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-1)] p-4">
                <div className="text-xs font-medium text-[var(--text-muted)]">Connected titles</div>
                <div className="mt-1 text-2xl font-semibold text-[var(--connection-line)]">
                  {nexusCount}
                </div>
                <div className="mt-1 text-sm text-[var(--text-secondary)]">
                  with cross-continuity links
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-1)] p-4">
              <div className="mb-2 flex items-center justify-between gap-4 text-sm">
                <span className="font-medium text-[var(--text-secondary)]">Overall progress</span>
                <span className="font-semibold text-white">{percentComplete}%</span>
              </div>
              <div
                className="h-2.5 overflow-hidden rounded-full bg-[var(--bg)]"
                role="progressbar"
                aria-label="Overall watch progress"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={percentComplete}
              >
                <div
                  className="h-full rounded-full bg-[var(--accent-mcu)] transition-[width] duration-200"
                  style={{ width: percentComplete + '%' }}
                />
              </div>
            </div>
          </section>

          <section aria-labelledby="continuity-progress-heading">
            <h3 id="continuity-progress-heading" className="mb-3 text-sm font-semibold text-white">
              By continuity
            </h3>

            <div className="space-y-3">
              {continuityStats.map(({ universeId, meta, count, watched, percent }) => (
                <div
                  key={universeId}
                  className="flex flex-col gap-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-1)] p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span
                      className="h-3 w-3 flex-none rounded-full"
                      style={{ backgroundColor: meta.color }}
                      aria-hidden="true"
                    />
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-white">{meta.label}</div>
                      <div className="mt-0.5 text-xs text-[var(--text-muted)]">
                        {watched}/{count} watched · {percent}%
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onBatchUpdateStatus(universeId, watched < count)}
                    className="atlas-control min-h-11 px-3 text-sm font-medium"
                  >
                    {watched === count ? 'Unmark all' : 'Mark all watched'}
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>

        <footer className="flex flex-col-reverse gap-2 border-t border-[var(--border-subtle)] p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <button
            type="button"
            onClick={() => onBatchUpdateStatus('all', false)}
            className="atlas-control flex min-h-11 items-center justify-center gap-2 px-3 text-sm font-medium text-[var(--text-secondary)]"
          >
            <RotateCcw className="h-4 w-4" />
            Reset watch progress
          </button>

          <button
            type="button"
            onClick={() => onBatchUpdateStatus('all', true)}
            className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[var(--accent-mcu)] bg-[var(--accent-mcu)] px-4 text-sm font-semibold text-[#07090D]"
          >
            <Check className="h-4 w-4" />
            Mark all {totalCount} watched
          </button>
        </footer>
      </div>
    </div>
  );
};
