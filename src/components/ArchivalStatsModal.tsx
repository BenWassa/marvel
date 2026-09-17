import React from 'react';
import { X, Clock, ShieldAlert, Sparkles, CheckCircle2, RotateCcw, Flame, Check } from 'lucide-react';
import { TimelineNode, UniverseId } from '../types';

interface ArchivalStatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  nodes: TimelineNode[];
  onBatchUpdateStatus: (uni: UniverseId | 'all', seen: boolean) => void;
}

export const ArchivalStatsModal: React.FC<ArchivalStatsModalProps> = ({
  isOpen,
  onClose,
  nodes,
  onBatchUpdateStatus,
}) => {
  if (!isOpen) return null;

  const totalCount = nodes.length;
  const traversedNodes = nodes.filter((n) => n.seen);
  const traversedCount = traversedNodes.length;
  const percentComplete = Math.round((traversedCount / totalCount) * 100);

  const totalRuntimeMinutes = nodes.reduce((acc, n) => acc + (n.runtimeMinutes || 120), 0);
  const traversedRuntimeMinutes = traversedNodes.reduce(
    (acc, n) => acc + (n.runtimeMinutes || 120),
    0
  );

  const formatHoursMins = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m}m`;
  };

  // Universe stats
  const mcuNodes = nodes.filter((n) => n.uni === '616');
  const mutantNodes = nodes.filter((n) => n.uni === '10005');
  const spiderNodes = nodes.filter((n) => n.uni === 'spider');

  const mcuTraversed = mcuNodes.filter((n) => n.seen).length;
  const mutantTraversed = mutantNodes.filter((n) => n.seen).length;
  const spiderTraversed = spiderNodes.filter((n) => n.seen).length;

  const nexusNodes = nodes.filter((n) => n.nexus);
  const catastrophicNodes = nodes.filter((n) => n.incursionRisk === 'Catastrophic');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in">
      <div
        id="archival-stats-modal"
        className="w-full max-w-2xl bg-[#0B0D13] border border-[#1E222A] rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1E222A] bg-[#141721]/60">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F5A623] shadow-[0_0_10px_#F5A623]" />
            <h2 className="font-mono-code text-sm sm:text-base font-bold text-white tracking-wider uppercase">
              TVA Archival Dossier // Continuity Diagnostics
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded hover:bg-[#1E222A] text-[#8B949E] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {/* Top Level Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-[#141721]/80 border border-[#2D3342]/60 rounded-lg p-3">
              <div className="text-[10px] font-mono-code text-[#8B949E] tracking-wider uppercase">
                TOTAL ARCHIVES
              </div>
              <div className="text-xl sm:text-2xl font-bold font-mono-code text-white mt-1">
                {totalCount}
              </div>
              <div className="text-[10px] font-mono-code text-emerald-400 mt-0.5">
                3 Continuities
              </div>
            </div>

            <div className="bg-[#141721]/80 border border-[#2D3342]/60 rounded-lg p-3">
              <div className="text-[10px] font-mono-code text-[#8B949E] tracking-wider uppercase">
                TRAVERSED
              </div>
              <div className="text-xl sm:text-2xl font-bold font-mono-code text-[#F5A623] mt-1">
                {traversedCount}/{totalCount}
              </div>
              <div className="text-[10px] font-mono-code text-[#8B949E] mt-0.5">
                {percentComplete}% Synchronized
              </div>
            </div>

            <div className="bg-[#141721]/80 border border-[#2D3342]/60 rounded-lg p-3">
              <div className="text-[10px] font-mono-code text-[#8B949E] tracking-wider uppercase">
                WATCHTIME
              </div>
              <div className="text-lg sm:text-xl font-bold font-mono-code text-white mt-1">
                {formatHoursMins(traversedRuntimeMinutes)}
              </div>
              <div className="text-[10px] font-mono-code text-[#8B949E] mt-0.5">
                of {formatHoursMins(totalRuntimeMinutes)}
              </div>
            </div>

            <div className="bg-[#141721]/80 border border-[#2D3342]/60 rounded-lg p-3">
              <div className="text-[10px] font-mono-code text-[#8B949E] tracking-wider uppercase">
                NEXUS INCURSIONS
              </div>
              <div className="text-xl sm:text-2xl font-bold font-mono-code text-[#E5C5FF] mt-1">
                {nexusNodes.length}
              </div>
              <div className="text-[10px] font-mono-code text-red-400 mt-0.5">
                {catastrophicNodes.length} Catastrophic
              </div>
            </div>
          </div>

          {/* Master Progress Bar */}
          <div className="bg-[#141721]/50 border border-[#1E222A] p-4 rounded-lg">
            <div className="flex justify-between items-center text-xs font-mono-code mb-2">
              <span className="text-[#8B949E]">TEMPORAL SYNCHRONIZATION INDEX</span>
              <span className="text-white font-bold">{percentComplete}%</span>
            </div>
            <div className="w-full h-2.5 bg-[#07080B] rounded-full overflow-hidden border border-[#2D3342]">
              <div
                className="h-full bg-gradient-to-r from-[#FF3B30] via-[#00A3FF] to-[#F5A623] transition-all duration-500 rounded-full"
                style={{ width: `${percentComplete}%` }}
              />
            </div>
          </div>

          {/* Continuity Strands Breakdown */}
          <div className="space-y-3">
            <h3 className="font-mono-code text-xs text-[#8B949E] tracking-wider uppercase font-semibold">
              CONTINUITY STRAND SYNCHRONIZATION
            </h3>

            {/* Sacred Timeline */}
            <div className="bg-[#141721]/60 border border-[#2D3342]/70 rounded-lg p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-[#F5A623] shadow-[0_0_8px_#F5A623]" />
                <div>
                  <div className="font-mono-code text-xs font-bold text-white">
                    C-616: SACRED TIMELINE (MCU)
                  </div>
                  <div className="text-[10px] font-mono-code text-[#8B949E]">
                    {mcuNodes.length} Core Titles • Phase 1 through Phase 5
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono-code text-xs font-bold text-[#F5A623]">
                  {mcuTraversed}/{mcuNodes.length} (
                  {Math.round((mcuTraversed / mcuNodes.length) * 100)}%)
                </span>
                <button
                  onClick={() => onBatchUpdateStatus('616', mcuTraversed < mcuNodes.length)}
                  className="px-2.5 py-1 text-[10px] font-mono-code rounded bg-[#1E222A] hover:bg-[#2D3342] text-white border border-[#2D3342] cursor-pointer transition-colors"
                >
                  {mcuTraversed === mcuNodes.length ? 'UNMARK ALL' : 'MARK ALL'}
                </button>
              </div>
            </div>

            {/* Legacy Mutant Timeline */}
            <div className="bg-[#141721]/60 border border-[#2D3342]/70 rounded-lg p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-[#00A3FF] shadow-[0_0_8px_#00A3FF]" />
                <div>
                  <div className="font-mono-code text-xs font-bold text-white">
                    C-10005: LEGACY MUTANT CONTINUITY
                  </div>
                  <div className="text-[10px] font-mono-code text-[#8B949E]">
                    {mutantNodes.length} Core Titles • X-Men, Wolverine, Deadpool
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono-code text-xs font-bold text-[#00A3FF]">
                  {mutantTraversed}/{mutantNodes.length} (
                  {Math.round((mutantTraversed / mutantNodes.length) * 100)}%)
                </span>
                <button
                  onClick={() =>
                    onBatchUpdateStatus('10005', mutantTraversed < mutantNodes.length)
                  }
                  className="px-2.5 py-1 text-[10px] font-mono-code rounded bg-[#1E222A] hover:bg-[#2D3342] text-white border border-[#2D3342] cursor-pointer transition-colors"
                >
                  {mutantTraversed === mutantNodes.length ? 'UNMARK ALL' : 'MARK ALL'}
                </button>
              </div>
            </div>

            {/* Spider Continuities */}
            <div className="bg-[#141721]/60 border border-[#2D3342]/70 rounded-lg p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-[#FF3B30] shadow-[0_0_8px_#FF3B30]" />
                <div>
                  <div className="font-mono-code text-xs font-bold text-white">
                    C-96283 / 120703 / TRN733: SPIDER CONTINUITIES
                  </div>
                  <div className="text-[10px] font-mono-code text-[#8B949E]">
                    {spiderNodes.length} Core Titles • Raimi, Webb & Spider-Verse
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono-code text-xs font-bold text-[#FF3B30]">
                  {spiderTraversed}/{spiderNodes.length} (
                  {Math.round((spiderTraversed / spiderNodes.length) * 100)}%)
                </span>
                <button
                  onClick={() =>
                    onBatchUpdateStatus('spider', spiderTraversed < spiderNodes.length)
                  }
                  className="px-2.5 py-1 text-[10px] font-mono-code rounded bg-[#1E222A] hover:bg-[#2D3342] text-white border border-[#2D3342] cursor-pointer transition-colors"
                >
                  {spiderTraversed === spiderNodes.length ? 'UNMARK ALL' : 'MARK ALL'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-[#1E222A] bg-[#141721]/80">
          <button
            onClick={() => onBatchUpdateStatus('all', false)}
            className="flex items-center gap-1.5 text-xs font-mono-code text-[#8B949E] hover:text-red-400 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>RESET PROGRESS</span>
          </button>
          <button
            onClick={() => onBatchUpdateStatus('all', true)}
            className="flex items-center gap-1.5 text-xs font-mono-code text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" />
            <span>MARK ENTIRE MULTIVERSE (34)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
