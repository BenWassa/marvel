# Product

## Register

product

## Users

Marvel viewers who want to navigate the franchise's tangled screen continuity — release order, in-universe order, and cross-continuity connections (616/MCU, mutant/X-Men universe, Spider-Verse) — without losing track of what they've already watched. They arrive with a specific job: "what do I watch next, and where does it sit relative to everything else." Context is a focused planning session (picking a route, checking a title's place on the map), not passive background browsing. Usage is personal and self-directed — one viewer's own watch state, saved locally, not a shared social feed.

## Product Purpose

Marvel Screen Atlas ("The Chronometric Loom") renders Marvel's screen continuities as a navigable map rather than a flat list: continuity lanes, curated viewing routes, cross-universe nexus connections, and per-node context, with personal watch progress persisted across sessions. Success looks like a viewer confidently answering "where am I and what's next" at a glance, across a catalogue that would otherwise require a wiki and a spreadsheet to track.

## Brand Personality

An archivist's precision wearing a fan's enthusiasm. The instrument is exact — cartographic, systematic, data-true, the kind of interface that respects the scale and tangle of the source material — but it should not read cold or clinical. It should feel like *Marvel*: energetic, a little cinematic, charged with the same pulpy confidence as the source material, not a sterile ops dashboard that happens to be about superheroes. Precision and fun coexist; neither should crowd the other out.

## Anti-references

- Generic streaming-service browse grids (Netflix/Disney+ poster walls) — this is a map to navigate, not a catalogue to scroll.
- Gamified fan-tracker chrome — no badges, XP bars, streaks, or achievement chrome. Progress is tracked, never scored.
- Cluttered wiki/forum layouts — no dense reference tables or forum-style information dumps. Density stays visual (the map), not textual.

## Design Principles

- **The map is the interface, not a decoration.** Continuity lanes, routes, and nexus connections carry real navigational meaning — every visual distinction (color, dash pattern, glow) should map to a real distinction in the data, never be applied for flourish alone.
- **Precision first, warmth close behind.** Exact data (mono type, grid backdrops, muted surfaces) establishes trust; color and motion carry the Marvel energy on top of that foundation, not instead of it.
- **Progress is a record, not a scoreboard.** Watch state is a quiet personal ledger. Celebrate it with restraint — no points, streaks, or badge chrome.
- **Respect the tangle.** Multiverse complexity is the actual subject matter — don't flatten it into a simple list to make the UI easier; make the UI capable of the complexity instead.
- **Show the route, not just the destination.** Curated viewing routes and context links matter as much as any single node — the interface should always make "what comes next" obvious.

## Accessibility & Inclusion

WCAG 2.1 AA as the floor. `prefers-reduced-motion` is already respected in the base stylesheet — keep new motion behind that guard. Maintain 44px minimum touch targets (already established via `--control-min-height` and `.atlas-touch`). Continuity lanes are color-coded (amber/blue/red) — pair color with a second cue (line style, label, icon) wherever a lane distinction is load-bearing, so the map stays legible for color-blind viewers.
