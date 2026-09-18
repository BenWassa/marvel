import React from 'react';
import { Check, ChevronLeft, ChevronRight, Clock3, Link2, X } from 'lucide-react';
import { UNIVERSE_META } from '../atlas';
import { TimelineNode } from '../types';

interface AtlasDockProps {
  activeNode: TimelineNode | null;
  onClose: () => void;
  onToggleStatus: (id: string) => void;
  onNavigateNode: (direction: 'prev' | 'next') => void;
  onJumpToNode: (id: string) => void;
  hasPrev: boolean;
  hasNext: boolean;
}

export const AtlasDock: React.FC<AtlasDockProps> = ({
  activeNode,
  onClose,
  onToggleStatus,
  onNavigateNode,
  onJumpToNode,
  hasPrev,
  hasNext,
}) => {
  const meta = activeNode ? UNIVERSE_META[activeNode.uni] : null;
  const panelClass =
    'fixed inset-x-0 bottom-0 z-50 px-2 pb-2 transition-transform duration-200 sm:px-4 sm:pb-4 ' +
    (activeNode ? 'translate-y-0' : 'pointer-events-none translate-y-[115%]');

  return (
    <aside
      className={panelClass}
      aria-hidden={!activeNode}
    >
      {activeNode && meta && (
        <section
          className="atlas-panel mx-auto max-w-5xl overflow-hidden rounded-2xl shadow-[0_-20px_60px_rgba(0,0,0,0.58)]"
          role="region"
          aria-labelledby={'atlas-dock-title-' + activeNode.id}
        >
          <div className="h-1 w-full" style={{ backgroundColor: meta.color }} aria-hidden="true" />

          <div className="relative max-h-[72vh] overflow-y-auto p-4 sm:p-5 md:max-h-none md:p-6">
            <button
              type="button"
              onClick={onClose}
              aria-label="Close title details"
              className="atlas-control atlas-touch absolute right-3 top-3 z-20 flex items-center justify-center text-[var(--text-muted)] hover:text-white sm:right-4 sm:top-4"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="grid gap-5 md:grid-cols-[112px_minmax(0,1fr)_200px] md:items-start">
              <div className="hidden md:block">
                <div
                  className="aspect-[2/3] overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-1)]"
                  style={{ boxShadow: '0 0 24px ' + meta.glow }}
                >
                  {activeNode.posterUrl ? (
                    <img
                      src={activeNode.posterUrl}
                      alt=""
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full items-end p-3">
                      <span className="text-xs text-[var(--text-muted)]">
                        Image unavailable
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="min-w-0 pr-10 md:pr-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className="rounded-md border px-2 py-1 text-[11px] font-semibold"
                    style={{
                      color: meta.core,
                      borderColor: meta.color + '66',
                      backgroundColor: meta.color + '18',
                    }}
                  >
                    {meta.label}
                  </span>
                  {activeNode.nexus && (
                    <span className="rounded-md border border-[var(--connection-border)] bg-[var(--connection-bg)] px-2 py-1 text-[11px] font-semibold text-[var(--connection-line)]">
                      Cross-continuity connection
                    </span>
                  )}
                </div>

                <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h2
                    id={'atlas-dock-title-' + activeNode.id}
                    className="text-xl font-bold tracking-[-0.025em] text-white sm:text-2xl md:text-3xl"
                  >
                    {activeNode.title}
                  </h2>
                  <span className="text-sm font-semibold" style={{ color: meta.color }}>
                    {activeNode.year}
                  </span>
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-[var(--text-muted)]">
                  <span className="inline-flex items-center gap-1.5">
                    <Clock3 className="h-3.5 w-3.5" />
                    {activeNode.runtime}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{activeNode.universeCode}</span>
                  {activeNode.phase && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span>{activeNode.phase}</span>
                    </>
                  )}
                </div>

                <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--text-secondary)]">
                  {activeNode.desc}
                </p>

                {activeNode.anchorEvent && (
                  <div className="mt-4 grid gap-1 sm:grid-cols-[64px_1fr] sm:gap-3">
                    <span className="text-xs font-semibold text-[var(--text-muted)]">
                      Context
                    </span>
                    <span className="text-sm leading-5 text-[var(--text-secondary)]">{activeNode.anchorEvent}</span>
                  </div>
                )}

                {activeNode.connections && activeNode.connections.length > 0 && (
                  <div className="mt-4">
                    <div className="mb-2 inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--connection-line)]">
                      <Link2 className="h-3.5 w-3.5" />
                      Narrative/context links
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {activeNode.connections.map((connection) => (
                        <button
                          key={connection.targetId}
                          type="button"
                          onClick={() => onJumpToNode(connection.targetId)}
                          title={connection.reason}
                          className="atlas-control min-h-11 px-3 text-left text-xs text-[var(--connection-line)]"
                        >
                          {connection.targetTitle}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2 md:pt-8">
                <button
                  type="button"
                  onClick={() => onToggleStatus(activeNode.id)}
                  className="flex min-h-11 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-semibold transition-[background-color,border-color] duration-150"
                  style={{
                    borderColor: activeNode.seen ? meta.color : 'var(--border-strong)',
                    backgroundColor: activeNode.seen ? meta.color : 'var(--surface-1)',
                    color: activeNode.seen ? '#07090D' : 'var(--text-primary)',
                  }}
                  aria-pressed={activeNode.seen}
                >
                  <span
                    className="flex h-5 w-5 items-center justify-center rounded-full border"
                    style={{
                      borderColor: activeNode.seen ? '#071014' : 'var(--text-muted)',
                      backgroundColor: activeNode.seen ? '#071014' : 'transparent',
                    }}
                    aria-hidden="true"
                  >
                    {activeNode.seen && <Check className="h-3.5 w-3.5 stroke-[3] text-white" />}
                  </span>
                  {activeNode.seen ? 'Watched' : 'Mark watched'}
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => onNavigateNode('prev')}
                    disabled={!hasPrev}
                    className="atlas-control flex min-h-11 items-center justify-center gap-1.5 px-2 text-xs font-medium disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigateNode('next')}
                    disabled={!hasNext}
                    className="atlas-control flex min-h-11 items-center justify-center gap-1.5 px-2 text-xs font-medium disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>

                <p className="hidden text-center text-xs text-[var(--text-muted)] md:block">
                  Browse matching titles in release order
                </p>
              </div>
            </div>
          </div>
        </section>
      )}
    </aside>
  );
};
