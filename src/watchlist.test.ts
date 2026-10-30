import assert from 'node:assert/strict';
import test from 'node:test';
import {
  MCU_CATALOGUE, DEFAULT_SELECTED_IDS, catalogIdForAtlasNode,
  getStatus, loadWatchlist, setSelected, setWatchStatus, watchlistStats,
} from './watchlist';

test('MCU catalogue is unique, phase ordered and includes essential films and television', () => {
  assert.equal(new Set(MCU_CATALOGUE.map((item) => item.id)).size, MCU_CATALOGUE.length);
  assert.ok(MCU_CATALOGUE.length >= 60);
  for (let index = 1; index < MCU_CATALOGUE.length; index++) {
    assert.ok(MCU_CATALOGUE[index - 1].year <= MCU_CATALOGUE[index].year);
    assert.ok(MCU_CATALOGUE[index - 1].phase <= MCU_CATALOGUE[index].phase);
  }
  assert.ok(MCU_CATALOGUE.some((item) => item.title === 'VisionQuest' && item.kind === 'series' && item.runtimeMinutes === null));
  assert.ok(MCU_CATALOGUE.some((item) => item.title === 'WandaVision' && item.runtimeEstimated));
});

test('user initial recommendations are all editable and the exact agreed 10', () => {
  const state = loadWatchlist(null);
  assert.equal(state.selectedIds.length, 10);
  assert.deepEqual(state.selectedIds, DEFAULT_SELECTED_IDS);
  const id = DEFAULT_SELECTED_IDS[0];
  const removed = setSelected(state, id, false);
  assert.ok(!removed.selectedIds.includes(id));
  assert.ok(state.selectedIds.includes(id), 'original state is immutable');
  assert.deepEqual(setSelected(removed, id, true).selectedIds, state.selectedIds);
  assert.equal(setSelected(removed, 'not-a-title', true), removed);
});

test('a user can remove every recommended title and empty selection persists', () => {
  const state = { ...loadWatchlist(null), selectedIds: [] };
  const roundtrip = loadWatchlist(JSON.stringify(state));
  assert.deepEqual(roundtrip.selectedIds, []);
});

test('watch status is separate from selection and persists after removal', () => {
  const id = DEFAULT_SELECTED_IDS[0];
  const state = setWatchStatus(loadWatchlist(null), id, 'watched');
  const removed = setSelected(state, id, false);
  assert.equal(getStatus(removed, id), 'watched');
  const restored = loadWatchlist(JSON.stringify(removed));
  assert.equal(getStatus(restored, id), 'watched');
  assert.ok(!restored.selectedIds.includes(id));
  assert.equal(getStatus(setWatchStatus(restored, id, 'unwatched'), id), 'unwatched');
});

test('legacy atlas state imports completed films only on first initialization', () => {
  const legacy = JSON.stringify([{ id: 'm2', seen: true }, { id: 'm_gotg', seen: false }]);
  const state = loadWatchlist(null, legacy);
  assert.equal(getStatus(state, catalogIdForAtlasNode('m2')!), 'watched');
  assert.equal(getStatus(state, catalogIdForAtlasNode('m_gotg')!), 'unwatched');
  const existing = setWatchStatus(loadWatchlist(null), 'the-avengers', 'watching');
  const loaded = loadWatchlist(JSON.stringify(existing), legacy);
  assert.equal(getStatus(loaded, 'the-avengers'), 'watching', 'new storage always wins');
});

test('corrupt and unknown stored ids are ignored safely', () => {
  const invalid = JSON.stringify({ version: 1, selectedIds: ['visionquest', 'fake'], statuses: { fake: 'watched', visionquest: 'bad', 'the-avengers': 'watched' } });
  const loaded = loadWatchlist(invalid);
  assert.deepEqual(loaded.selectedIds, ['visionquest']);
  assert.equal(getStatus(loaded, 'visionquest'), 'unwatched');
  assert.equal(getStatus(loaded, 'the-avengers'), 'watched');
  assert.equal(loadWatchlist('{bad json').selectedIds.length, DEFAULT_SELECTED_IDS.length);
});

test('time totals count only selected titles and never fabricate unknown series runtimes', () => {
  const state = loadWatchlist(null);
  const stats = watchlistStats(state);
  assert.equal(stats.selectedCount, 10);
  assert.equal(stats.unknownRuntimeCount, 1); // VisionQuest, episodes still releasing
  assert.equal(stats.selectedMinutes, 1477); // 24h 37m, including estimated WandaVision
  assert.equal(stats.remainingMinutes, stats.selectedMinutes);
  assert.equal(stats.hasEstimates, true);
  const updated = setWatchStatus(state, 'the-avengers', 'watched');
  assert.equal(watchlistStats(updated).watchedMinutes, 143);
  assert.equal(watchlistStats(updated).remainingMinutes, 1334);
});

test('catalogue matches atlas watched ids without modifying continuity routes', () => {
  assert.equal(catalogIdForAtlasNode('m_aou'), 'avengers-age-of-ultron');
  assert.equal(catalogIdForAtlasNode('f1'), undefined);
});
