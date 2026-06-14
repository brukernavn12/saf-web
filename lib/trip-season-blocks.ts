/** Trips with fixed season blocks (no DB departures). Keys map to tripDetail.seasonBlock.{slug}.{key}.* */
export const TRIP_SEASON_BLOCK_KEYS: Partial<Record<string, readonly string[]>> = {
  vindrueplukkeopplevelse: ["block0", "block1"],
};

export function getTripSeasonBlockKeys(slug: string): readonly string[] {
  return TRIP_SEASON_BLOCK_KEYS[slug] ?? [];
}

export function tripHasSeasonBlocks(slug: string): boolean {
  return getTripSeasonBlockKeys(slug).length > 0;
}
