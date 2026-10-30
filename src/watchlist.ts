/**
 * MCU film + Marvel Studios Disney+ series/special release-order catalogue.
 * Deliberately independent from the prototype continuity map: some titles
 * have no atlas node. Legacy Marvel television and unrelated films are excluded.
 * Film runtimes use theatrical minutes; series estimates are explicitly flagged.
 * null means unknown, not zero. Entries are ordered by first release.
 */
export type WatchKind = 'film' | 'series' | 'animated' | 'special';
export type WatchStatus = 'unwatched' | 'watching' | 'watched';
export interface WatchTitle {
  id: string;
  title: string;
  year: number;
  phase: number;
  kind: WatchKind;
  runtimeMinutes: number | null;
  runtimeEstimated?: boolean;
  atlasNodeId?: string;
}
export interface WatchlistState {
  version: 1;
  selectedIds: string[];
  statuses: Record<string, WatchStatus>;
}

export const WATCHLIST_STORAGE_KEY = 'marvel_screen_atlas_watchlist_v1';
export const MCU_CATALOGUE: WatchTitle[] = [
  {
    "id": "iron-man",
    "title": "Iron Man",
    "year": 2008,
    "kind": "film",
    "phase": 1,
    "runtimeMinutes": 126,
    "atlasNodeId": "m1"
  },
  {
    "id": "the-incredible-hulk",
    "title": "The Incredible Hulk",
    "year": 2008,
    "kind": "film",
    "phase": 1,
    "runtimeMinutes": 112,
    "atlasNodeId": "m_hulk"
  },
  {
    "id": "iron-man-2",
    "title": "Iron Man 2",
    "year": 2010,
    "kind": "film",
    "phase": 1,
    "runtimeMinutes": 124
  },
  {
    "id": "thor",
    "title": "Thor",
    "year": 2011,
    "kind": "film",
    "phase": 1,
    "runtimeMinutes": 115,
    "atlasNodeId": "m_thor1"
  },
  {
    "id": "captain-america-the-first-avenger",
    "title": "Captain America: The First Avenger",
    "year": 2011,
    "kind": "film",
    "phase": 1,
    "runtimeMinutes": 124,
    "atlasNodeId": "m_cap1"
  },
  {
    "id": "the-avengers",
    "title": "The Avengers",
    "year": 2012,
    "kind": "film",
    "phase": 1,
    "runtimeMinutes": 143,
    "atlasNodeId": "m2"
  },
  {
    "id": "iron-man-3",
    "title": "Iron Man 3",
    "year": 2013,
    "kind": "film",
    "phase": 2,
    "runtimeMinutes": 130
  },
  {
    "id": "thor-the-dark-world",
    "title": "Thor: The Dark World",
    "year": 2013,
    "kind": "film",
    "phase": 2,
    "runtimeMinutes": 112
  },
  {
    "id": "captain-america-the-winter-soldier",
    "title": "Captain America: The Winter Soldier",
    "year": 2014,
    "kind": "film",
    "phase": 2,
    "runtimeMinutes": 136,
    "atlasNodeId": "m_ws"
  },
  {
    "id": "guardians-of-the-galaxy",
    "title": "Guardians of the Galaxy",
    "year": 2014,
    "kind": "film",
    "phase": 2,
    "runtimeMinutes": 121,
    "atlasNodeId": "m_gotg"
  },
  {
    "id": "avengers-age-of-ultron",
    "title": "Avengers: Age of Ultron",
    "year": 2015,
    "kind": "film",
    "phase": 2,
    "runtimeMinutes": 141,
    "atlasNodeId": "m_aou"
  },
  {
    "id": "ant-man",
    "title": "Ant-Man",
    "year": 2015,
    "kind": "film",
    "phase": 2,
    "runtimeMinutes": 117
  },
  {
    "id": "captain-america-civil-war",
    "title": "Captain America: Civil War",
    "year": 2016,
    "kind": "film",
    "phase": 3,
    "runtimeMinutes": 147,
    "atlasNodeId": "m_cw"
  },
  {
    "id": "doctor-strange",
    "title": "Doctor Strange",
    "year": 2016,
    "kind": "film",
    "phase": 3,
    "runtimeMinutes": 115,
    "atlasNodeId": "m_ds"
  },
  {
    "id": "guardians-of-the-galaxy-vol-2",
    "title": "Guardians of the Galaxy Vol. 2",
    "year": 2017,
    "kind": "film",
    "phase": 3,
    "runtimeMinutes": 136
  },
  {
    "id": "spider-man-homecoming",
    "title": "Spider-Man: Homecoming",
    "year": 2017,
    "kind": "film",
    "phase": 3,
    "runtimeMinutes": 133
  },
  {
    "id": "thor-ragnarok",
    "title": "Thor: Ragnarok",
    "year": 2017,
    "kind": "film",
    "phase": 3,
    "runtimeMinutes": 130,
    "atlasNodeId": "m_rag"
  },
  {
    "id": "black-panther",
    "title": "Black Panther",
    "year": 2018,
    "kind": "film",
    "phase": 3,
    "runtimeMinutes": 134,
    "atlasNodeId": "m_bp"
  },
  {
    "id": "avengers-infinity-war",
    "title": "Avengers: Infinity War",
    "year": 2018,
    "kind": "film",
    "phase": 3,
    "runtimeMinutes": 149,
    "atlasNodeId": "m3"
  },
  {
    "id": "ant-man-and-the-wasp",
    "title": "Ant-Man and the Wasp",
    "year": 2018,
    "kind": "film",
    "phase": 3,
    "runtimeMinutes": 118
  },
  {
    "id": "captain-marvel",
    "title": "Captain Marvel",
    "year": 2019,
    "kind": "film",
    "phase": 3,
    "runtimeMinutes": 123
  },
  {
    "id": "avengers-endgame",
    "title": "Avengers: Endgame",
    "year": 2019,
    "kind": "film",
    "phase": 3,
    "runtimeMinutes": 181,
    "atlasNodeId": "m4"
  },
  {
    "id": "spider-man-far-from-home",
    "title": "Spider-Man: Far From Home",
    "year": 2019,
    "kind": "film",
    "phase": 3,
    "runtimeMinutes": 129
  },
  {
    "id": "wandavision",
    "title": "WandaVision",
    "year": 2021,
    "kind": "series",
    "phase": 4,
    "runtimeMinutes": 350,
    "runtimeEstimated": true
  },
  {
    "id": "the-falcon-and-the-winter-soldier",
    "title": "The Falcon and the Winter Soldier",
    "year": 2021,
    "kind": "series",
    "phase": 4,
    "runtimeMinutes": null
  },
  {
    "id": "loki-season-1",
    "title": "Loki — Season 1",
    "year": 2021,
    "kind": "series",
    "phase": 4,
    "runtimeMinutes": null,
    "atlasNodeId": "m_loki"
  },
  {
    "id": "black-widow",
    "title": "Black Widow",
    "year": 2021,
    "kind": "film",
    "phase": 4,
    "runtimeMinutes": 134
  },
  {
    "id": "what-if-season-1",
    "title": "What If...? — Season 1",
    "year": 2021,
    "kind": "animated",
    "phase": 4,
    "runtimeMinutes": null
  },
  {
    "id": "shang-chi-and-the-legend-of-the-ten-rings",
    "title": "Shang-Chi and the Legend of the Ten Rings",
    "year": 2021,
    "kind": "film",
    "phase": 4,
    "runtimeMinutes": 132
  },
  {
    "id": "eternals",
    "title": "Eternals",
    "year": 2021,
    "kind": "film",
    "phase": 4,
    "runtimeMinutes": 156
  },
  {
    "id": "hawkeye",
    "title": "Hawkeye",
    "year": 2021,
    "kind": "series",
    "phase": 4,
    "runtimeMinutes": null
  },
  {
    "id": "spider-man-no-way-home",
    "title": "Spider-Man: No Way Home",
    "year": 2021,
    "kind": "film",
    "phase": 4,
    "runtimeMinutes": 148,
    "atlasNodeId": "m5"
  },
  {
    "id": "moon-knight",
    "title": "Moon Knight",
    "year": 2022,
    "kind": "series",
    "phase": 4,
    "runtimeMinutes": null
  },
  {
    "id": "doctor-strange-in-the-multiverse-of-madness",
    "title": "Doctor Strange in the Multiverse of Madness",
    "year": 2022,
    "kind": "film",
    "phase": 4,
    "runtimeMinutes": 126,
    "atlasNodeId": "m_mom"
  },
  {
    "id": "ms-marvel",
    "title": "Ms. Marvel",
    "year": 2022,
    "kind": "series",
    "phase": 4,
    "runtimeMinutes": null
  },
  {
    "id": "thor-love-and-thunder",
    "title": "Thor: Love and Thunder",
    "year": 2022,
    "kind": "film",
    "phase": 4,
    "runtimeMinutes": 119
  },
  {
    "id": "i-am-groot-season-1",
    "title": "I Am Groot — Season 1",
    "year": 2022,
    "kind": "animated",
    "phase": 4,
    "runtimeMinutes": null
  },
  {
    "id": "she-hulk-attorney-at-law",
    "title": "She-Hulk: Attorney at Law",
    "year": 2022,
    "kind": "series",
    "phase": 4,
    "runtimeMinutes": null
  },
  {
    "id": "werewolf-by-night",
    "title": "Werewolf by Night",
    "year": 2022,
    "kind": "special",
    "phase": 4,
    "runtimeMinutes": null
  },
  {
    "id": "black-panther-wakanda-forever",
    "title": "Black Panther: Wakanda Forever",
    "year": 2022,
    "kind": "film",
    "phase": 4,
    "runtimeMinutes": 161
  },
  {
    "id": "the-guardians-of-the-galaxy-holiday-special",
    "title": "The Guardians of the Galaxy Holiday Special",
    "year": 2022,
    "kind": "special",
    "phase": 4,
    "runtimeMinutes": null
  },
  {
    "id": "ant-man-and-the-wasp-quantumania",
    "title": "Ant-Man and the Wasp: Quantumania",
    "year": 2023,
    "kind": "film",
    "phase": 5,
    "runtimeMinutes": 124
  },
  {
    "id": "guardians-of-the-galaxy-vol-3",
    "title": "Guardians of the Galaxy Vol. 3",
    "year": 2023,
    "kind": "film",
    "phase": 5,
    "runtimeMinutes": 150,
    "atlasNodeId": "m_gotg3"
  },
  {
    "id": "secret-invasion",
    "title": "Secret Invasion",
    "year": 2023,
    "kind": "series",
    "phase": 5,
    "runtimeMinutes": null
  },
  {
    "id": "i-am-groot-season-2",
    "title": "I Am Groot — Season 2",
    "year": 2023,
    "kind": "animated",
    "phase": 5,
    "runtimeMinutes": null
  },
  {
    "id": "loki-season-2",
    "title": "Loki — Season 2",
    "year": 2023,
    "kind": "series",
    "phase": 5,
    "runtimeMinutes": null
  },
  {
    "id": "the-marvels",
    "title": "The Marvels",
    "year": 2023,
    "kind": "film",
    "phase": 5,
    "runtimeMinutes": 105
  },
  {
    "id": "what-if-season-2",
    "title": "What If...? — Season 2",
    "year": 2023,
    "kind": "animated",
    "phase": 5,
    "runtimeMinutes": null
  },
  {
    "id": "echo",
    "title": "Echo",
    "year": 2024,
    "kind": "series",
    "phase": 5,
    "runtimeMinutes": null
  },
  {
    "id": "deadpool-wolverine",
    "title": "Deadpool & Wolverine",
    "year": 2024,
    "kind": "film",
    "phase": 5,
    "runtimeMinutes": 128,
    "atlasNodeId": "m6"
  },
  {
    "id": "agatha-all-along",
    "title": "Agatha All Along",
    "year": 2024,
    "kind": "series",
    "phase": 5,
    "runtimeMinutes": 375,
    "runtimeEstimated": true
  },
  {
    "id": "what-if-season-3",
    "title": "What If...? — Season 3",
    "year": 2024,
    "kind": "animated",
    "phase": 5,
    "runtimeMinutes": null
  },
  {
    "id": "your-friendly-neighborhood-spider-man-season-1",
    "title": "Your Friendly Neighborhood Spider-Man — Season 1",
    "year": 2025,
    "kind": "animated",
    "phase": 5,
    "runtimeMinutes": null
  },
  {
    "id": "captain-america-brave-new-world",
    "title": "Captain America: Brave New World",
    "year": 2025,
    "kind": "film",
    "phase": 5,
    "runtimeMinutes": 118
  },
  {
    "id": "daredevil-born-again-season-1",
    "title": "Daredevil: Born Again — Season 1",
    "year": 2025,
    "kind": "series",
    "phase": 5,
    "runtimeMinutes": null
  },
  {
    "id": "thunderbolts",
    "title": "Thunderbolts*",
    "year": 2025,
    "kind": "film",
    "phase": 5,
    "runtimeMinutes": 127
  },
  {
    "id": "ironheart",
    "title": "Ironheart",
    "year": 2025,
    "kind": "series",
    "phase": 5,
    "runtimeMinutes": null
  },
  {
    "id": "the-fantastic-four-first-steps",
    "title": "The Fantastic Four: First Steps",
    "year": 2025,
    "kind": "film",
    "phase": 6,
    "runtimeMinutes": 115
  },
  {
    "id": "eyes-of-wakanda",
    "title": "Eyes of Wakanda",
    "year": 2025,
    "kind": "animated",
    "phase": 6,
    "runtimeMinutes": null
  },
  {
    "id": "marvel-zombies",
    "title": "Marvel Zombies",
    "year": 2025,
    "kind": "animated",
    "phase": 6,
    "runtimeMinutes": null
  },
  {
    "id": "wonder-man",
    "title": "Wonder Man",
    "year": 2026,
    "kind": "series",
    "phase": 6,
    "runtimeMinutes": null
  },
  {
    "id": "daredevil-born-again-season-2",
    "title": "Daredevil: Born Again — Season 2",
    "year": 2026,
    "kind": "series",
    "phase": 6,
    "runtimeMinutes": null
  },
  {
    "id": "the-punisher-one-last-kill",
    "title": "The Punisher: One Last Kill",
    "year": 2026,
    "kind": "special",
    "phase": 6,
    "runtimeMinutes": null
  },
  {
    "id": "spider-man-brand-new-day",
    "title": "Spider-Man: Brand New Day",
    "year": 2026,
    "kind": "film",
    "phase": 6,
    "runtimeMinutes": null
  },
  {
    "id": "visionquest",
    "title": "VisionQuest",
    "year": 2026,
    "kind": "series",
    "phase": 6,
    "runtimeMinutes": null
  }
];

export const DEFAULT_SELECTED_IDS = [
  "the-avengers",
  "guardians-of-the-galaxy",
  "avengers-age-of-ultron",
  "captain-america-civil-war",
  "doctor-strange",
  "thor-ragnarok",
  "avengers-infinity-war",
  "avengers-endgame",
  "wandavision",
  "visionquest"
] as string[];
const catalogIds = new Set(MCU_CATALOGUE.map((title) => title.id));
const atlasToCatalog = new Map(
  MCU_CATALOGUE.filter((title) => title.atlasNodeId).map((title) => [title.atlasNodeId!, title.id])
);

export const catalogIdForAtlasNode = (atlasNodeId: string): string | undefined =>
  atlasToCatalog.get(atlasNodeId);

export const getStatus = (state: WatchlistState, id: string): WatchStatus =>
  state.statuses[id] ?? 'unwatched';

export const setSelected = (state: WatchlistState, id: string, selected: boolean): WatchlistState => {
  if (!catalogIds.has(id)) return state;
  const next = new Set(state.selectedIds);
  if (selected) next.add(id);
  else next.delete(id);
  return { ...state, selectedIds: MCU_CATALOGUE.filter((title) => next.has(title.id)).map((t) => t.id) };
};

export const setWatchStatus = (state: WatchlistState, id: string, status: WatchStatus): WatchlistState => {
  if (!catalogIds.has(id) || !['unwatched', 'watching', 'watched'].includes(status)) return state;
  const statuses = { ...state.statuses };
  if (status === 'unwatched') delete statuses[id];
  else statuses[id] = status;
  return { ...state, statuses };
};

/** The previous atlas stored explicit per-node boolean progress. Import once only. */
export const loadWatchlist = (raw: string | null, legacyAtlasRaw: string | null = null): WatchlistState => {
  if (raw) {
    try {
      const parsed: unknown = JSON.parse(raw);
      if (parsed && typeof parsed === 'object' && (parsed as { version?: unknown }).version === 1) {
        const candidate = parsed as { selectedIds?: unknown; statuses?: unknown };
        const selectedIds = Array.isArray(candidate.selectedIds)
          ? [...new Set(candidate.selectedIds.filter((id): id is string => typeof id === 'string' && catalogIds.has(id)))]
          : [...DEFAULT_SELECTED_IDS];
        const statuses: Record<string, WatchStatus> = {};
        if (candidate.statuses && typeof candidate.statuses === 'object' && !Array.isArray(candidate.statuses)) {
          for (const [id, status] of Object.entries(candidate.statuses)) {
            if (catalogIds.has(id) && (status === 'watched' || status === 'watching')) statuses[id] = status;
          }
        }
        return { version: 1, selectedIds, statuses };
      }
    } catch {
      // Invalid or unsupported version: fall back without erasing old atlas progress.
    }
  }

  const statuses: Record<string, WatchStatus> = {};
  if (legacyAtlasRaw) {
    try {
      const legacy: unknown = JSON.parse(legacyAtlasRaw);
      if (Array.isArray(legacy)) {
        for (const item of legacy) {
          if (!item || typeof item !== 'object') continue;
          const { id, seen } = item as { id?: unknown; seen?: unknown };
          if (typeof id === 'string' && seen === true) {
            const catalogId = catalogIdForAtlasNode(id);
            if (catalogId) statuses[catalogId] = 'watched';
          }
        }
      }
    } catch {
      // Malformed historical storage should not stop the watchlist loading.
    }
  }
  return { version: 1, selectedIds: [...DEFAULT_SELECTED_IDS], statuses };
};

export const watchlistStats = (state: WatchlistState) => {
  const selected = MCU_CATALOGUE.filter((title) => state.selectedIds.includes(title.id));
  const watched = selected.filter((title) => getStatus(state, title.id) === 'watched');
  const known = selected.filter((title) => title.runtimeMinutes !== null);
  const knownWatched = watched.filter((title) => title.runtimeMinutes !== null);
  const selectedMinutes = known.reduce((sum, title) => sum + title.runtimeMinutes!, 0);
  const watchedMinutes = knownWatched.reduce((sum, title) => sum + title.runtimeMinutes!, 0);
  return {
    selectedCount: selected.length,
    watchedCount: watched.length,
    watchingCount: selected.filter((title) => getStatus(state, title.id) === 'watching').length,
    selectedMinutes,
    watchedMinutes,
    remainingMinutes: selectedMinutes - watchedMinutes,
    unknownRuntimeCount: selected.length - known.length,
    hasEstimates: known.some((title) => title.runtimeEstimated),
  };
};
