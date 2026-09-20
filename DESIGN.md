---
name: Marvel Screen Atlas
description: An instrument-panel map for navigating Marvel's screen continuities, release order, and personal watch progress.
colors:
  bg: "#07090D"
  surface-1: "#10141B"
  surface-2: "#151A23"
  surface-3: "#1A202B"
  border-subtle: "#2B3341"
  border-strong: "#465064"
  text-primary: "#F7F9FC"
  text-secondary: "#C1C8D3"
  text-muted: "#8F99AA"
  signal-amber: "#F5A623"
  signal-amber-core: "#FFD082"
  ion-blue: "#00A3FF"
  ion-blue-core: "#70CFFF"
  web-red: "#FF4D45"
  web-red-core: "#FFA19B"
  phase-violet: "#E5C5FF"
  route-gold: "#F5E6BD"
typography:
  headline:
    fontFamily: "Inter, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "0.08em"
  title:
    fontFamily: "Inter, sans-serif"
    fontSize: "clamp(1.25rem, 2vw, 1.875rem)"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.025em"
  body:
    fontFamily: "Inter, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "Inter, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "normal"
  data:
    fontFamily: "JetBrains Mono, monospace"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "normal"
rounded:
  xs: "6px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  pill: "999px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "20px"
  xl: "24px"
components:
  button-primary:
    backgroundColor: "{colors.signal-amber}"
    textColor: "{colors.bg}"
    rounded: "{rounded.md}"
    padding: "0 16px"
    height: "44px"
  button-ghost:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.md}"
    padding: "0 16px"
    height: "44px"
  button-ghost-hover:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.text-primary}"
  badge-continuity:
    backgroundColor: "{colors.signal-amber}"
    textColor: "{colors.signal-amber-core}"
    rounded: "{rounded.xs}"
    padding: "4px 8px"
  card-stat:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.md}"
    padding: "16px"
  panel-float:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.lg}"
---

# Design System: Marvel Screen Atlas

## 1. Overview

**Creative North Star: "The Chronometric Loom"**

Marvel's screen continuities are threads — release-order threads, in-universe threads, cross-continuity nexus threads — and this system's job is to weave them into something a viewer can actually read at a glance. Every surface is an instrument reading, not a poster: obsidian panels, hairline borders, monospace data marks, all tuned for exactness. But the instrument is reading *Marvel*, so the precision carries color and light the way a control panel carries warning lamps and status glow — Signal Amber, Ion Blue, Web Red, Phase Violet — each one a real distinction in the data, never a decoration laid on top of it.

This system explicitly rejects the streaming-service browse grid (no poster walls, no algorithmic rows), gamified fan-tracker chrome (no badges, XP bars, or streak counters — progress reads as a record, not a score), and the cluttered wiki/forum layout (no dense reference tables, no forum-style text dumps). Depth comes from tone and light, not decoration; density lives in the map, not the text.

**Key Characteristics:**
- Obsidian, tinted-neutral surfaces with hairline borders — never pure black or pure white.
- Four named continuity colors, each tied to a real narrative distinction, never applied decoratively.
- Flat map, floating instruments: the map itself stays tonal and still; only overlay panels (dock, modal) lift with shadow and glow.
- Monospace marks (JetBrains Mono) for data — counts, timestamps, codes; Inter for everything read as language.
- 44px minimum control height everywhere, unconditionally — this is a touch-first instrument.

## 2. Colors

The palette is a **Full Palette strategy**: four named continuity colors carry real meaning across the map, plus a tinted-obsidian neutral scale that stays out of the way everywhere else.

### Primary
- **Signal Amber** (`#F5A623`, core `#FFD082`, glow `rgba(245,166,35,0.34)`): the MCU/616 continuity lane. Also the default system accent — header status dot, progress bar fill, stats icon — since 616 is the atlas's default route.

### Secondary
- **Ion Blue** (`#00A3FF`, core `#70CFFF`, glow `rgba(0,163,255,0.34)`): the legacy mutant/X-Men continuity lane.

### Tertiary
- **Web Red** (`#FF4D45`, core `#FFA19B`, glow matching at 0.34 alpha): the Spider continuities (616/Spider-Verse crossovers).
- **Phase Violet** (`#E5C5FF`, connection line + `rgba(229,197,255,0.08)` fill, `rgba(229,197,255,0.34)` border): cross-continuity nexus connections — the "threads between threads." Rendered dashed (`stroke-dasharray: 6 6`) wherever it appears, so the dash pattern itself is the second, color-independent cue for a nexus link.

### Neutral
- **Obsidian** (`#07090D`): base background — never pure `#000`.
- **Surface 1 / 2 / 3** (`#10141B` / `#151A23` / `#1A202B`): ascending tonal layers for panels, hover states, and pressed states, in that order.
- **Border Subtle / Strong** (`#2B3341` / `#465064`): hairline dividers at rest; strong border on hover/focus of interactive surfaces.
- **Text Primary / Secondary / Muted** (`#F7F9FC` / `#C1C8D3` / `#8F99AA`): body-copy hierarchy — never full white on full black.
- **Route Gold** (`#F5E6BD`, border `rgba(245,230,189,0.3)`): the drawn viewing-route line across the map — distinct from Signal Amber so a curated route never reads as "the MCU lane."

### Named Rules
**The Load-Bearing Color Rule.** A color is never added for mood. If Signal Amber, Ion Blue, Web Red, or Phase Violet appear anywhere, they are naming a specific continuity or connection in the data at that exact spot — check the meaning before adding a new hue.

## 3. Typography

**UI Font:** Inter (with system sans fallback)
**Data/Label Font:** JetBrains Mono (with system monospace fallback)

**Character:** Inter carries everything meant to be read as language — titles, descriptions, controls — with tight negative tracking on titles for a confident, edited feel. JetBrains Mono is reserved for anything that reads as a measurement or a code: counts, universe codes, timestamps.

### Hierarchy
- **Headline** (600, 0.875rem, tracking 0.08em, uppercase-set): the "MARVEL SCREEN ATLAS" wordmark and equivalent top-level identity marks. Wide tracking is what makes it read as instrument-panel signage, not a page title.
- **Title** (700, clamp(1.25rem, 2vw, 1.875rem), tracking -0.025em): title-card names inside the dock — the one place type is allowed to feel cinematic.
- **Body** (400, 0.875rem, line-height 1.5): descriptions, context copy. Cap at 65–75ch wherever it runs in a column.
- **Label** (600, 0.75rem): badges, stat captions, section eyebrows. Paired with a border or tonal fill, not used bare.
- **Data** (JetBrains Mono, 500, 0.75rem): counts (`12/48`), universe codes (`C-616`), runtimes — anything that is a measurement rather than a sentence.

### Named Rules
**The Measurement Rule.** If a value is countable, timed, or coded, set it in JetBrains Mono. If it's a sentence, set it in Inter. Never mix the two within one data point.

## 4. Elevation

**"Grounded map, floating instruments."** The map surface itself is flat — tonal layering (Surface 1/2/3) does all the depth work, no box-shadow. Elevation is reserved entirely for panels that physically float above the map: the bottom dock and the stats modal. Those get a directional shadow pushing them off the surface below, plus a colored ambient glow tied to whatever continuity or accent they're presenting — light, not shadow, is the primary way a floating panel announces *why* it's there.

### Shadow Vocabulary
- **Dock lift** (`box-shadow: 0 -20px 60px rgba(0,0,0,0.58)`): the bottom title-detail dock, rising from the bottom edge.
- **Modal lift** (`box-shadow: 0 22px 70px rgba(0,0,0,0.72)`): the stats modal, centered and heavier since it fully interrupts the map.
- **Accent glow** (`box-shadow: 0 0 10–24px [continuity color glow]`): status dots, poster frames, and selection states — always keyed to the specific continuity color at that spot, never a generic white glow.

### Named Rules
**The Flat-Map Rule.** The map canvas and its nodes never cast a drop shadow. If something needs to look lifted, it isn't part of the map — it's a floating instrument, and belongs in the shadow vocabulary above.

## 5. Components

Controls read as instrument-grade hardware first, with color and glow carrying the fan-energy spark on top — **"Instrument-grade with a spark."**

### Buttons
- **Shape:** 12px radius (`rounded-xl`), 44px minimum height unconditionally (`--control-min-height`).
- **Primary ("Mark watched"):** filled with the active continuity color, text flips to Obsidian (`#07090D`) for contrast, inner check-circle uses a darker shade of the same color family. Border matches fill.
- **Ghost/Secondary (nav, close, filters):** Surface 1 background, Border Subtle at rest → Surface 2 + Border Strong on hover, 150ms ease on background/border/color. This is the `.atlas-control` class — every button, select, and text input that isn't the primary CTA shares it.
- **Disabled:** 30% opacity, cursor default, no hover response.
- **Focus:** 2px solid `rgba(255,255,255,0.82)` outline, 2px offset — always visible, never suppressed.

### Chips / Badges
- **Continuity badge:** 6px radius, border + background both derived from the continuity color at low alpha (`color + '18'` fill, `color + '66'` border), text in the color's "core" (light) variant. Never a flat solid fill — badges stay translucent so they layer over map content.
- **Connection badge:** same shape, fixed to Phase Violet regardless of the node's own continuity — this is the one badge whose color never varies, because it always means the same thing (a nexus link).

### Cards / Containers
- **Corner style:** 12px radius for stat cards and image frames, 16px for floating panels (dock, modal).
- **Background:** Surface 1, flat, no shadow — depth comes from the border plus the parent panel's own elevation (see Section 4).
- **Border:** 1px Border Subtle, uniform on all four sides. Never a heavier single-side border used as a colored accent stripe.
- **Internal padding:** 16px default, 20–24px on larger breakpoints.

### Inputs / Fields
- **Style:** `.atlas-control` shared class — Surface 1 fill, Border Subtle stroke, 12px radius, 44px height, leading icon inset at 12px.
- **Focus:** border does not change color; the shared white focus ring takes over, keeping focus state consistent across every control type.
- **Clear action:** inline trailing button, same 44px touch target, muted-to-white color shift on hover — no separate icon button styling.

### Navigation (Header)
- **Style:** fixed, translucent Obsidian (`rgba(7,9,13,0.94)`) with 20px backdrop blur, single hairline bottom border, plus a 1px progress-fill track pinned to that same bottom edge.
- **States:** default → hover lightens text from muted to white; no active/selected pill treatment — the progress bar and route label are the "you are here" signal instead of a highlighted nav item.
- **Mobile:** collapses to a single full-width search takeover rather than shrinking every control — no cramped icon-only nav.

### The Dock (signature component)
The bottom dock is the system's signature move: a floating panel that slides up from off-screen (`translate-y-[115%]` → `translate-y-0`, 200ms) to present one title's full detail without ever leaving the map behind it. It carries a 1px top accent bar in the active node's continuity color — the only place a full-width color bar is used, and only because it's naming the node's continuity, not decorating the panel.

## 6. Do's and Don'ts

### Do:
- **Do** tie every use of Signal Amber, Ion Blue, Web Red, or Phase Violet to a real continuity/connection at that spot (The Load-Bearing Color Rule).
- **Do** keep the map canvas flat — tonal layering only, elevation reserved for floating panels (The Flat-Map Rule).
- **Do** set countable/timed/coded values in JetBrains Mono and sentences in Inter (The Measurement Rule).
- **Do** hold every interactive control to a 44px minimum touch target, unconditionally.
- **Do** pair every color-coded distinction with a second cue (border style, dash pattern, label, icon) so the map stays legible without color.

### Don't:
- **Don't** build a streaming-service poster grid — this is a map to navigate, not a catalogue to scroll.
- **Don't** add gamified fan-tracker chrome — no badges, XP bars, streaks, or achievement animations. Watch progress is a record, never a score.
- **Don't** ship a cluttered wiki/forum layout — no dense reference tables or forum-style text dumps; density stays in the map, not the copy.
- **Don't** use `border-left`/`border-right` as a colored accent stripe on any card or list item — the one exception is the dock's full-width top accent bar, which names a continuity, not a decoration.
- **Don't** add a drop shadow to anything on the map canvas itself. Shadows exist only for panels that visibly float above it.
- **Don't** use pure `#000` or `#fff` anywhere — every neutral is tinted obsidian per the Neutral palette above.
