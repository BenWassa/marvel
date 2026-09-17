import React, { useEffect, useMemo, useState } from 'react';
import { INITIAL_TIMELINE_NODES } from './data';
import {
  ATLAS_ROUTES,
  AtlasRouteId,
  getRouteNodes,
  matchesNodeSearch,
} from './atlas';
import { TimelineNode, UniverseId } from './types';
import { AtlasHeader } from './components/AtlasHeader';
import { AtlasMap } from './components/AtlasMap';
import { AtlasDock } from './components/AtlasDock';
import { ArchivalStatsModal } from './components/ArchivalStatsModal';

const STORAGE_KEY = 'chronometric_loom_nodes_v2';
const ROUTE_KEY = 'marvel_screen_atlas_route_v1';

export default function App() {
  const [nodes, setNodes] = useState<TimelineNode[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return INITIAL_TIMELINE_NODES.map((node) => {
          const found = parsed.find((item: { id: string; seen: boolean }) => item.id === node.id);
          return found ? { ...node, seen: found.seen } : node;
        });
      }
    } catch {
      // Fall through to the seeded catalogue.
    }

    return INITIAL_TIMELINE_NODES;
  });

  const [activeRouteId, setActiveRouteId] = useState<AtlasRouteId>(() => {
    try {
      const savedRoute = localStorage.getItem(ROUTE_KEY) as AtlasRouteId | null;
      if (savedRoute && ATLAS_ROUTES.some((route) => route.id === savedRoute)) {
        return savedRoute;
      }
    } catch {
      // Ignore storage errors.
    }

    return 'all';
  });

  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isStatsOpen, setIsStatsOpen] = useState(false);

  useEffect(() => {
    try {
      const stateToSave = nodes.map((node) => ({ id: node.id, seen: node.seen }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch {
      // Progress remains in memory when storage is unavailable.
    }
  }, [nodes]);

  useEffect(() => {
    try {
      localStorage.setItem(ROUTE_KEY, activeRouteId);
    } catch {
      // Route persistence is non-critical.
    }
  }, [activeRouteId]);

  const activeNode = nodes.find((node) => node.id === activeNodeId) ?? null;

  const routeNodes = useMemo(
    () => getRouteNodes(nodes, activeRouteId),
    [activeRouteId, nodes]
  );

  const navigationNodes = useMemo(() => {
    if (!searchQuery.trim()) return routeNodes;
    return routeNodes.filter((node) => matchesNodeSearch(node, searchQuery));
  }, [routeNodes, searchQuery]);

  const routeTraversedCount = routeNodes.filter((node) => node.seen).length;
  const traversedCount = nodes.filter((node) => node.seen).length;

  const currentIndex = activeNode
    ? navigationNodes.findIndex((node) => node.id === activeNode.id)
    : -1;
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex >= 0 && currentIndex < navigationNodes.length - 1;

  const handleToggleStatus = (id: string) => {
    setNodes((current) =>
      current.map((node) => (node.id === id ? { ...node, seen: !node.seen } : node))
    );
  };

  const handleBatchUpdateStatus = (universe: UniverseId | 'all', seen: boolean) => {
    setNodes((current) =>
      current.map((node) =>
        universe === 'all' || node.uni === universe ? { ...node, seen } : node
      )
    );
  };

  const handleNavigateNode = (direction: 'prev' | 'next') => {
    if (currentIndex < 0) return;

    const nextIndex = direction === 'prev' ? currentIndex - 1 : currentIndex + 1;
    const nextNode = navigationNodes[nextIndex];

    if (nextNode) setActiveNodeId(nextNode.id);
  };

  const handleRouteChange = (routeId: AtlasRouteId) => {
    setActiveRouteId(routeId);
    setActiveNodeId(null);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && ['INPUT', 'SELECT', 'TEXTAREA'].includes(target.tagName)) return;

      if (event.key === 'Escape') {
        if (isStatsOpen) {
          setIsStatsOpen(false);
        } else {
          setActiveNodeId(null);
        }
        return;
      }

      if (!activeNodeId) return;

      if (event.key === 'ArrowLeft') {
        handleNavigateNode('prev');
      } else if (event.key === 'ArrowRight') {
        handleNavigateNode('next');
      } else if (event.key === ' ') {
        event.preventDefault();
        handleToggleStatus(activeNodeId);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeNodeId, currentIndex, hasNext, hasPrev, isStatsOpen, navigationNodes]);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#050609] text-white">
      <AtlasHeader
        activeRouteId={activeRouteId}
        onRouteChange={handleRouteChange}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        traversedCount={traversedCount}
        totalCount={nodes.length}
        routeTraversedCount={routeTraversedCount}
        routeTotalCount={routeNodes.length}
        onOpenStats={() => setIsStatsOpen(true)}
      />

      <main className="h-full w-full">
        <AtlasMap
          nodes={nodes}
          activeNodeId={activeNodeId}
          onSelectNode={setActiveNodeId}
          activeRouteId={activeRouteId}
          searchQuery={searchQuery}
        />
      </main>

      <AtlasDock
        activeNode={activeNode}
        onClose={() => setActiveNodeId(null)}
        onToggleStatus={handleToggleStatus}
        onNavigateNode={handleNavigateNode}
        onJumpToNode={setActiveNodeId}
        hasPrev={hasPrev}
        hasNext={hasNext}
      />

      <ArchivalStatsModal
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
        nodes={nodes}
        onBatchUpdateStatus={handleBatchUpdateStatus}
      />
    </div>
  );
}
