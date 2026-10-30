import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = (path: string) => readFileSync(new URL(path, import.meta.url), 'utf8');

test('touch and reduced-motion contracts remain explicit', () => {
  const css = read('./index.css');

  assert.match(css, /--control-min-height:\s*44px/);
  assert.match(css, /\.atlas-touch[\s\S]*min-width:\s*44px/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
});

test('the atlas exposes a semantic region and does not model selection as a toggle', () => {
  const map = read('./components/AtlasMap.tsx');

  assert.match(map, /role="region"/);
  assert.match(map, /aria-describedby="atlas-map-description"/);
  assert.match(map, /aria-current=/);
  assert.doesNotMatch(map, /aria-pressed=/);
});

test('watch progress is a modal dialog with managed keyboard focus', () => {
  const modal = read('./components/ArchivalStatsModal.tsx');

  assert.match(modal, /role="dialog"/);
  assert.match(modal, /aria-modal="true"/);
  assert.match(modal, /event\.key [!=]==? 'Tab'/);
  assert.match(modal, /previousFocus\?\.focus\(\)/);
});

test('curated route state does not define global title navigation', () => {
  const app = read('./App.tsx');

  assert.match(app, /getNavigableNodes\(nodes, searchQuery\)/);
  assert.doesNotMatch(app, /getNavigableNodes\(nodes, activeRouteId/);
});

test('personal watchlist has accessible removable selections and consistent modal focus', () => {
  const panel = read('./components/PersonalWatchlistModal.tsx');
  const header = read('./components/AtlasHeader.tsx');
  const app = read('./App.tsx');

  assert.match(panel, /role="dialog"/);
  assert.match(panel, /aria-modal="true"/);
  assert.match(panel, /previousFocus|prior\?\.focus\(\)/);
  assert.match(panel, /event\.key !== 'Tab'/);
  assert.match(panel, /onSelect\(title\.id, !selected\)/);
  assert.match(panel, /Remove/);
  assert.match(panel, /min-h-11/);
  assert.match(header, /onOpenWatchlist/);
  assert.match(app, /WATCHLIST_STORAGE_KEY/);
  assert.match(app, /catalogIdForAtlasNode/);
});
