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

  return (
    <aside
      className={`fixed inset-x-0 bottom-0 z-50 px-2 pb-2 transition-transform duration-300 sm:px-4 sm:pb-4 ${activeNode ? 'translate-y-0' : 'pointer-events-none translate-y-[115%]'}`}
      aria-hidden={!activeNode}
    >
      {activeNode && meta && (
        <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-[#0A0C11]/96 shadow-[0_-24px_80px_rgba(0,0,0,0.76)] backdrop-blur-2xl">
          <div className="h-1 w-full" style={{ backgroundColor: meta.color }} />

          <div className="relative max-h-[66vh] overflow-y-auto p-4 sm:p-5 md:max-h-none md:p-6">
            <button
              type="button"
              onClick={onClose}
              aria-label="Close details"
              className="absolute right-3 top-3 z-20 rounded-full border border-white/10 bg-black/30 p-2 text-[#8993A4] transition hover:bg-white/8 hover:text-white sm:right-4 sm:top-4"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="grid gap-5 md:grid-cols-[112px_minmax(0,1fr)_auto] md:items-start">
              <div className="hidden md:block">
                <div
                  className="aspect-[2/3] overflow-hidden rounded-xl border border-white/10 bg-[#11141B]"
                  style={{ boxShadow: `0 0 28px ${meta.glow}` }}
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
                      <span className="font-mono-code text-[9px] uppercase tracking-[0.14em] text-[#5F6878]">
                        Archive image unavailable
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="min-w-0 pr-8 md:pr-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className="rounded-md border px-2 py-1 font-mono-code text-[9px] font-bold uppercase tracking-[0.12em]"
                    style={{
                      color: meta.core,
                      borderColor: `${meta.color}55`,
                      backgroundColor: `${meta.color}18`,
                    }}
                  >
                    {meta.label}
                  </span>
                  {activeNode.nexus && (
                    <span className="rounded-md border border-[#E5C5FF]/30 bg-[#E5C5FF]/10 px-2 py-1 font-mono-code text-[9px] font-bold uppercase tracking-[0.12em] text-[#E5C5FF]">
                      Nexus connection
                    </span>
                  )}
                </div>

                <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h2 className="text-xl font-bold tracking-[-0.025em] text-white sm:text-2xl md:text-3xl">
                    {activeNode.title}
                  </h2>
                  <span className="font-mono-code text-xs font-semibold" style={{ color: meta.color }}>
                    {activeNode.year}
                  </span>
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-2 font-mono-code text-[10px] uppercase tracking-[0.1em] text-[#7D8797]">
                  <span className="inline-flex items-center gap-1.5">
                    <Clock3 className="h-3 w-3" />
                    {activeNode.runtime}
                  </span>
                  <span>·</span>
                  <span>{activeNode.universeCode}</span>
                  {activeNode.phase && (
                    <>
                      <span>·</span>
                      <span>{activeNode.phase}</span>
                    </>
                  )}
                </div>

                <p className="mt-3 max-w-3xl text-sm leading-6 text-[#B4BBC7]">
                  {activeNode.desc}
                </p>

                {activeNode.anchorEvent && (
                  <div className="mt-3 flex items-start gap-2 text-xs text-[#939CAB]">
                    <span className="mt-0.5 font-mono-code text-[9px] uppercase tracking-[0.12em] text-[#626C7D]">
                      Context
                    </span>
                    <span>{activeNode.anchorEvent}</span>
                  </div>
                )}

                {activeNode.connections && activeNode.connections.length > 0 && (
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 font-mono-code text-[9px] font-bold uppercase tracking-[0.12em] text-[#CDB3E3]">
                      <Link2 className="h-3 w-3" />
                      Explicit links
                    </span>
                    {activeNode.connections.map((connection) => (
                      <button
                        key={connection.targetId}
                        type="button"
                        onClick={() => onJumpToNode(connection.targetId)}
                        title={connection.reason}
                        className="rounded-lg border border-[#E5C5FF]/22 bg-[#E5C5FF]/8 px-2.5 py-1.5 text-left text-[11px] text-[#DEC9EF] transition hover:border-[#E5C5FF]/45 hover:bg-[#E5C5FF]/12"
                      >
                        {connection.targetTitle}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2 md:min-w-[190px] md:pt-9">
                <button
                  type="button"
                  onClick={() => onToggleStatus(activeNode.id)}
                  className="flex min-h-11 items-center justify-center gap-2 rounded-xl border px-4 text-xs font-bold uppercase tracking-[0.1em] transition active:scale-[0.99]"
                  style={{
                    borderColor: activeNode.seen ? meta.color : '#303644',
                    backgroundColor: activeNode.seen ? meta.color : '#11141B',
                    color: activeNode.seen ? '#07090C' : '#F1F4F8',
                    boxShadow: activeNode.seen ? `0 0 20px ${meta.glow}` : undefined,
                  }}
                >
                  <span
                    className="flex h-4 w-4 items-center justify-center rounded-full border"
                    style={{
                      borderColor: activeNode.seen ? '#071014' : '#687284',
                      backgroundColor: activeNode.seen ? '#071014' : 'transparent',
                    }}
                  >
                    {activeNode.seen && <Check className="h-3 w-3 stroke-[3] text-white" />}
                  </span>
                  {activeNode.seen ? 'Watched' : 'Mark watched'}
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => onNavigateNode('prev')}
                    disabled={!hasPrev}
                    className="flex min-h-10 items-center justify-center gap-1 rounded-xl border border-white/10 bg-white/[0.035] font-mono-code text-[10px] uppercase tracking-[0.1em] text-[#A0A8B5] transition hover:bg-white/[0.065] disabled:cursor-not-allowed disabled:opacity-25"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                    Prev
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigateNode('next')}
                    disabled={!hasNext}
                    className="flex min-h-10 items-center justify-center gap-1 rounded-xl border border-white/10 bg-white/[0.035] font-mono-code text-[10px] uppercase tracking-[0.1em] text-[#A0A8B5] transition hover:bg-white/[0.065] disabled:cursor-not-allowed disabled:opacity-25"
                  >
                    Next
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>

                <p className="hidden text-center font-mono-code text-[8px] uppercase tracking-[0.1em] text-[#4F5868] md:block">
                  ← → navigate · space toggles watched
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
