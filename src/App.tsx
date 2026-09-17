import React, { useState, useEffect } from 'react';
import { INITIAL_TIMELINE_NODES } from './data';
import { TimelineNode, LoomMode, UniverseId } from './types';
import { HudHeader } from './components/HudHeader';
import { CanvasMap } from './components/CanvasMap';
import { VerticalLoom } from './components/VerticalLoom';
import { ChronoDock } from './components/ChronoDock';
import { ArchivalStatsModal } from './components/ArchivalStatsModal';

const STORAGE_KEY = 'chronometric_loom_nodes_v2';
const LOOM_MODE_KEY = 'chronometric_loom_orientation_v2';

export default function App() {
  // Nodes state with localStorage hydration
  const [nodes, setNodes] = useState<TimelineNode[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return INITIAL_TIMELINE_NODES.map((node) => {
          const found = parsed.find((p: { id: string; seen: boolean }) => p.id === node.id);
          return found ? { ...node, seen: found.seen } : node;
        });
      }
    } catch {
      // ignore JSON parse error
    }
    return INITIAL_TIMELINE_NODES;
  });

  // Loom Mode: Default to vertical for smooth mobile scrolling
  const [loomMode, setLoomMode] = useState<LoomMode>(() => {
    try {
      const savedMode = localStorage.getItem(LOOM_MODE_KEY);
      if (savedMode === 'horizontal' || savedMode === 'vertical') {
        return savedMode;
      }
    } catch {
      // ignore
    }
    return 'vertical';
  });

  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [zoom, setZoom] = useState<number>(1.0);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: -40, y: 20 });
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isStatsOpen, setIsStatsOpen] = useState<boolean>(false);

  // Sync nodes to localStorage
  useEffect(() => {
    try {
      const stateToSave = nodes.map((n) => ({ id: n.id, seen: n.seen }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch {
      // storage errors
    }
  }, [nodes]);

  // Sync loom mode to localStorage
  const handleToggleLoomMode = () => {
    setLoomMode((prev) => {
      const next = prev === 'vertical' ? 'horizontal' : 'vertical';
      try {
        localStorage.setItem(LOOM_MODE_KEY, next);
      } catch {
        // ignore
      }
      return next;
    });
  };

  // Active node object
  const activeNode = nodes.find((n) => n.id === activeNodeId) || null;

  // Toggle Traversed status
  const handleToggleStatus = (id: string) => {
    setNodes((prev) =>
      prev.map((node) => (node.id === id ? { ...node, seen: !node.seen } : node))
    );
  };

  // Batch update status (used by Archival Diagnostics Modal)
  const handleBatchUpdateStatus = (uni: UniverseId | 'all', seen: boolean) => {
    setNodes((prev) =>
      prev.map((node) => {
        if (uni === 'all' || node.uni === uni) {
          return { ...node, seen };
        }
        return node;
      })
    );
  };

  // Zoom controls (for horizontal canvas mode)
  const handleZoomIn = () => {
    setZoom((z) => Math.min(1.8, parseFloat((z + 0.15).toFixed(2))));
  };

  const handleZoomOut = () => {
    setZoom((z) => Math.max(0.6, parseFloat((z - 0.15).toFixed(2))));
  };

  const handleResetView = () => {
    setZoom(1.0);
    setPan({ x: -40, y: 20 });
  };

  const handleSelectNode = (id: string) => {
    setActiveNodeId(id);

    // If in horizontal canvas, optionally pan to center node
    if (loomMode === 'horizontal') {
      const target = nodes.find((n) => n.id === id);
      if (target) {
        const targetPanX = window.innerWidth / 2 - target.x * zoom;
        const targetPanY = window.innerHeight / 2 - target.y * zoom;
        setPan({ x: Math.round(targetPanX), y: Math.round(targetPanY) });
      }
    }
  };

  const handleCloseDock = () => {
    setActiveNodeId(null);
  };

  // Node navigation in dock
  const filteredNodes = nodes.filter((n) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = n.title.toLowerCase().includes(q);
      const matchYear = n.year.includes(q);
      const matchAnchor = (n.anchorEvent || '').toLowerCase().includes(q);
      const matchCode = (n.universeCode || '').toLowerCase().includes(q);
      const matchKey = (n.keyVariants || []).some((k) => k.toLowerCase().includes(q));
      if (!matchTitle && !matchYear && !matchAnchor && !matchCode && !matchKey) {
        return false;
      }
    }

    if (selectedFilter === 'all') return true;
    if (selectedFilter === '616') return n.uni === '616';
    if (selectedFilter === '10005') return n.uni === '10005';
    if (selectedFilter === 'spider') return n.uni === 'spider';
    if (selectedFilter === 'nexus') return !!n.nexus;
    if (selectedFilter === 'untraversed') return !n.seen;
    return true;
  });

  const currentIndex = activeNode ? filteredNodes.findIndex((n) => n.id === activeNode.id) : -1;
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex >= 0 && currentIndex < filteredNodes.length - 1;

  const handleNavigateNode = (direction: 'prev' | 'next') => {
    if (currentIndex === -1) return;
    if (direction === 'prev' && hasPrev) {
      const nextNode = filteredNodes[currentIndex - 1];
      handleSelectNode(nextNode.id);
    } else if (direction === 'next' && hasNext) {
      const nextNode = filteredNodes[currentIndex + 1];
      handleSelectNode(nextNode.id);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      if (e.key === 'Escape') {
        if (isStatsOpen) {
          setIsStatsOpen(false);
        } else {
          handleCloseDock();
        }
      } else if (e.key === 'ArrowRight' && activeNodeId) {
        handleNavigateNode('next');
      } else if (e.key === 'ArrowLeft' && activeNodeId) {
        handleNavigateNode('prev');
      } else if (e.key === '+' || e.key === '=') {
        handleZoomIn();
      } else if (e.key === '-' || e.key === '_') {
        handleZoomOut();
      } else if (e.key === ' ' && activeNodeId) {
        e.preventDefault();
        handleToggleStatus(activeNodeId);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeNodeId, currentIndex, hasPrev, hasNext, isStatsOpen]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#07080B] flex flex-col">
      {/* HUD Header */}
      <HudHeader
        nodes={nodes}
        zoom={zoom}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetView={handleResetView}
        selectedFilter={selectedFilter}
        onSelectFilter={setSelectedFilter}
        loomMode={loomMode}
        onToggleLoomMode={handleToggleLoomMode}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenStats={() => setIsStatsOpen(true)}
      />

      {/* Main View Area: Vertical or Horizontal Loom */}
      <main className="flex-1 w-full h-full relative overflow-hidden pt-16">
        {loomMode === 'vertical' ? (
          <VerticalLoom
            nodes={nodes}
            activeNodeId={activeNodeId}
            onSelectNode={handleSelectNode}
            onToggleStatus={handleToggleStatus}
            selectedFilter={selectedFilter}
            searchQuery={searchQuery}
          />
        ) : (
          <CanvasMap
            nodes={nodes}
            activeNodeId={activeNodeId}
            onSelectNode={handleSelectNode}
            zoom={zoom}
            selectedFilter={selectedFilter}
            pan={pan}
            onPanChange={setPan}
            searchQuery={searchQuery}
          />
        )}
      </main>

      {/* Detail Blade (Chrono-Dock) */}
      <ChronoDock
        activeNode={activeNode}
        onClose={handleCloseDock}
        onToggleStatus={handleToggleStatus}
        onNavigateNode={handleNavigateNode}
        onJumpToNode={handleSelectNode}
        hasPrev={hasPrev}
        hasNext={hasNext}
      />

      {/* Archival Metrics & Continuity Diagnostics Modal */}
      <ArchivalStatsModal
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
        nodes={nodes}
        onBatchUpdateStatus={handleBatchUpdateStatus}
      />
    </div>
  );
}
