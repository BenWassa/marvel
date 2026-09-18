import assert from 'node:assert/strict';
import test from 'node:test';
import { INITIAL_TIMELINE_NODES } from './data';
import {
  getChronologicalNodes,
  getNavigableNodes,
  getRouteNodes,
  matchesNodeSearch,
  toggleNodeSeen,
} from './atlas';

test('global release order is deterministic', () => {
  const ordered = getChronologicalNodes(INITIAL_TIMELINE_NODES);
  assert.equal(ordered.length, INITIAL_TIMELINE_NODES.length);

  for (let index = 1; index < ordered.length; index += 1) {
    assert.ok(Number(ordered[index - 1].year) <= Number(ordered[index].year));
  }
});

test('curated routes emphasize a subset without becoming navigation authority', () => {
  const route = getRouteNodes(INITIAL_TIMELINE_NODES, 'mcu-essentials');
  const navigable = getNavigableNodes(INITIAL_TIMELINE_NODES, '');

  assert.ok(route.length < navigable.length);
  assert.equal(navigable.length, INITIAL_TIMELINE_NODES.length);
  assert.ok(route.every((node) => navigable.some((candidate) => candidate.id === node.id)));
});

test('search narrows keyboard browsing while keeping matching semantics predictable', () => {
  const matches = getNavigableNodes(INITIAL_TIMELINE_NODES, 'spider-man');

  assert.ok(matches.length > 0);
  assert.ok(matches.every((node) => matchesNodeSearch(node, 'SPIDER-MAN')));
});

test('search covers year and continuity metadata', () => {
  assert.ok(getNavigableNodes(INITIAL_TIMELINE_NODES, '2024').some((node) => node.id === 'm6'));
  assert.ok(getNavigableNodes(INITIAL_TIMELINE_NODES, 'C-10005').some((node) => node.uni === '10005'));
});

test('watch state toggles only the requested title and preserves input state', () => {
  const target = INITIAL_TIMELINE_NODES[0];
  const originalSeen = target.seen;
  const updated = toggleNodeSeen(INITIAL_TIMELINE_NODES, target.id);

  assert.equal(INITIAL_TIMELINE_NODES[0].seen, originalSeen);
  assert.equal(updated[0].seen, !originalSeen);
  assert.deepEqual(
    updated.slice(1).map((node) => node.seen),
    INITIAL_TIMELINE_NODES.slice(1).map((node) => node.seen)
  );
});
