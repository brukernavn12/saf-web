/**
 * Central image registry: catalog, context assignments, and uniqueness enforcement
 * across homepage, about page, trip cards, and trip detail pages.
 */

export type ImageCategory =
  | "hero"
  | "vineyard"
  | "food"
  | "nature"
  | "team"
  | "harvest"
  | "culture"
  | "logo";

export type ImageContextKey =
  | "home.hero"
  | "home.category.trips"
  | "home.category.private"
  | "home.category.business"
  | "home.about"
  | "page.om-oss"
  | "page.om-oss.morten"
  | "page.om-oss.elisabeth"
  | "logo.mark"
  | "logo.withTagline"
  | `trip.${string}`
  | `trip.${string}.gallery.${number}`;

export interface ImageAsset {
  id: string;
  folder: string;
  filename: string;
  categories: ImageCategory[];
}

/** URL-encode filename segments (handles spaces and special chars). */
export function imagePath(folder: string, filename: string): string {
  return `/images/${folder}/${encodeURIComponent(filename)}`;
}

function asset(
  id: string,
  folder: string,
  filename: string,
  categories: ImageCategory[]
): ImageAsset {
  return { id, folder, filename, categories };
}

/** Curated images used by the site (not the full /public/images/reiser/ library). */
export const IMAGE_CATALOG: Record<string, ImageAsset> = {
  "hero.main": asset("hero.main", "hero", "hero.jpg", ["hero"]),
  "hero.vineyard": asset(
    "hero.vineyard",
    "hero",
    "hero-vineyard.jpeg",
    ["hero", "vineyard"]
  ),

  "logo.mark": asset(
    "logo.mark",
    "logo",
    "Smaken logo uten drue og tag.png",
    ["logo"]
  ),
  "logo.withTagline": asset(
    "logo.withTagline",
    "logo",
    "logo med tagline uten bakgrunn.png",
    ["logo"]
  ),

  "team.morten": asset("team.morten", "om-oss", "morten rotete.jpg", [
    "team",
  ]),
  "team.mortenPortrait": asset("team.mortenPortrait", "om-oss", "morten.jpg", [
    "team",
  ]),
  "team.elisabeth": asset("team.elisabeth", "om-oss", "elisabeth.jpg", [
    "team",
  ]),
  "team.background": asset(
    "team.background",
    "om-oss",
    "smaken teams bakgrunn 1.png",
    ["team"]
  ),

  "reiser.laLiviniere": asset(
    "reiser.laLiviniere",
    "reiser",
    "la liviniere.webp",
    ["vineyard"]
  ),
  "reiser.caunesMinervois": asset(
    "reiser.caunesMinervois",
    "reiser",
    "caunes minervois.jpeg",
    ["vineyard", "culture"]
  ),
  "reiser.fontfroide": asset(
    "reiser.fontfroide",
    "reiser",
    "fontfroide.jpeg",
    ["vineyard", "culture"]
  ),
  "reiser.mat": asset("reiser.mat", "reiser", "mat.jpg", ["food"]),
  "reiser.halles": asset("reiser.halles", "reiser", "halles.jpg", ["food"]),
  "reiser.peyre": asset("reiser.peyre", "reiser", "peyre.jpg", ["nature"]),
  "reiser.deuxRiviere1": asset(
    "reiser.deuxRiviere1",
    "reiser",
    "deux riviere 1.webp",
    ["nature"]
  ),
  "reiser.deuxRiviere2": asset(
    "reiser.deuxRiviere2",
    "reiser",
    "deux riviere2.webp",
    ["nature"]
  ),
  "reiser.pontdugard": asset(
    "reiser.pontdugard",
    "reiser",
    "pontdugard.jpeg",
    ["nature", "culture"]
  ),
  "reiser.harvest1": asset(
    "reiser.harvest1",
    "reiser",
    "IMG_1611.webp",
    ["vineyard", "harvest"]
  ),
  "reiser.harvest2": asset(
    "reiser.harvest2",
    "reiser",
    "IMG_1592.webp",
    ["vineyard", "harvest"]
  ),
  "reiser.ina": asset("reiser.ina", "om-oss", "Ina.webp", ["food", "team"]),
  "reiser.anne": asset("reiser.anne", "om-oss", "Anne.jpg", ["team", "vineyard"]),
};

/** Explicit context → image id assignments (each image id appears at most once). */
export const IMAGE_ASSIGNMENTS: Record<string, string> = {
  "home.hero": "hero.vineyard",
  "home.category.trips": "reiser.caunesMinervois",
  "home.category.private": "reiser.deuxRiviere2",
  "home.category.business": "reiser.pontdugard",
  "home.about": "team.morten",
  "page.om-oss": "team.background",
  "page.om-oss.morten": "team.mortenPortrait",
  "page.om-oss.elisabeth": "team.elisabeth",
  "logo.mark": "logo.mark",
  "logo.withTagline": "logo.withTagline",

  "trip.vin-vingarder-minervois": "reiser.anne",
  "trip.vin-vingarder-minervois.gallery.0": "reiser.laLiviniere",
  "trip.vin-vingarder-minervois.gallery.1": "reiser.fontfroide",

  "trip.smak-languedoc": "reiser.mat",
  "trip.smak-languedoc.gallery.0": "reiser.halles",

  "trip.aktiv-gorges-herault": "reiser.peyre",
  "trip.aktiv-gorges-herault.gallery.0": "reiser.deuxRiviere1",

  "trip.vindrueplukking-minervois": "reiser.harvest1",
  "trip.vindrueplukking-minervois.gallery.0": "reiser.harvest2",

  "trip.matreise-med-ina": "reiser.ina",
};

const TRIP_SLUGS = [
  "vin-vingarder-minervois",
  "smak-languedoc",
  "aktiv-gorges-herault",
  "vindrueplukking-minervois",
  "matreise-med-ina",
] as const;

export type TripSlug = (typeof TRIP_SLUGS)[number];

/** Contexts where duplicate images are forbidden site-wide. */
const GLOBAL_UNIQUE_CONTEXTS = new Set(
  Object.keys(IMAGE_ASSIGNMENTS).filter(
    (key) => !key.startsWith("logo.")
  )
);

function pathForAssetId(id: string): string {
  const assetEntry = IMAGE_CATALOG[id];
  if (!assetEntry) {
    throw new Error(`Unknown image id: ${id}`);
  }
  return imagePath(assetEntry.folder, assetEntry.filename);
}

function validateUniqueAssignments(): void {
  const usedIds = new Map<string, string>();
  for (const [context, imageId] of Object.entries(IMAGE_ASSIGNMENTS)) {
    if (!GLOBAL_UNIQUE_CONTEXTS.has(context)) continue;
    const existing = usedIds.get(imageId);
    if (existing) {
      throw new Error(
        `Duplicate image "${imageId}" assigned to "${existing}" and "${context}"`
      );
    }
    usedIds.set(imageId, context);
  }
}

validateUniqueAssignments();

export function getImagePathForContext(context: ImageContextKey): string {
  const imageId = IMAGE_ASSIGNMENTS[context];
  if (!imageId) {
    throw new Error(`No image assigned for context: ${context}`);
  }
  return pathForAssetId(imageId);
}

export function getAssignedImageIds(excludeContext?: string): Set<string> {
  const assigned = new Set<string>();
  for (const [context, imageId] of Object.entries(IMAGE_ASSIGNMENTS)) {
    if (context === excludeContext) continue;
    if (!GLOBAL_UNIQUE_CONTEXTS.has(context)) continue;
    assigned.add(imageId);
  }
  return assigned;
}

/**
 * Pick an unassigned image, preferring semantic category match.
 * Used when adding new contexts programmatically.
 */
export function selectUniqueImage(options: {
  context: ImageContextKey;
  preferredCategories?: ImageCategory[];
}): string {
  const assigned = getAssignedImageIds(options.context);
  const preferred = new Set(options.preferredCategories ?? []);

  const candidates = Object.values(IMAGE_CATALOG).filter(
    (entry) => !assigned.has(entry.id)
  );

  const ranked = candidates.sort((a, b) => {
    const aScore = a.categories.filter((c) => preferred.has(c)).length;
    const bScore = b.categories.filter((c) => preferred.has(c)).length;
    return bScore - aScore;
  });

  const pick = ranked[0];
  if (!pick) {
    throw new Error(`No unassigned images left for context: ${options.context}`);
  }

  IMAGE_ASSIGNMENTS[options.context] = pick.id;
  return pathForAssetId(pick.id);
}

export function getTripImageUrls(slug: string): {
  imageUrl: string;
  imageUrls: string[];
} {
  const mainContext = `trip.${slug}` as ImageContextKey;
  const imageUrl = getImagePathForContext(mainContext);

  const gallery: string[] = [];
  for (let i = 0; i < 8; i++) {
    const galleryContext = `trip.${slug}.gallery.${i}`;
    const imageId = IMAGE_ASSIGNMENTS[galleryContext];
    if (!imageId) break;
    gallery.push(pathForAssetId(imageId));
  }

  return {
    imageUrl,
    imageUrls: [imageUrl, ...gallery],
  };
}

export const tripImages: Record<
  string,
  { imageUrl: string; imageUrls: string[] }
> = Object.fromEntries(
  TRIP_SLUGS.map((slug) => [slug, getTripImageUrls(slug)])
);

/** Typed image paths for components (derived from registry assignments). */
export const images = {
  hero: getImagePathForContext("home.hero"),
  logo: {
    mark: getImagePathForContext("logo.mark"),
    withTagline: getImagePathForContext("logo.withTagline"),
  },
  omOss: {
    morten: getImagePathForContext("home.about"),
    mortenPortrait: getImagePathForContext("page.om-oss.morten"),
    elisabeth: getImagePathForContext("page.om-oss.elisabeth"),
    teamBackground: getImagePathForContext("page.om-oss"),
  },
  categories: {
    trips: getImagePathForContext("home.category.trips"),
    private: getImagePathForContext("home.category.private"),
    business: getImagePathForContext("home.category.business"),
  },
  reiser: {
    laLiviniere: pathForAssetId("reiser.laLiviniere"),
    caunesMinervois: pathForAssetId("reiser.caunesMinervois"),
    fontfroide: pathForAssetId("reiser.fontfroide"),
    mat: pathForAssetId("reiser.mat"),
    halles: pathForAssetId("reiser.halles"),
    peyre: pathForAssetId("reiser.peyre"),
    deuxRiviere: pathForAssetId("reiser.deuxRiviere1"),
    deuxRiviere2: pathForAssetId("reiser.deuxRiviere2"),
    pontdugard: pathForAssetId("reiser.pontdugard"),
    harvest1: pathForAssetId("reiser.harvest1"),
    harvest2: pathForAssetId("reiser.harvest2"),
  },
} as const;

/** All globally unique image paths (for duplicate checks in dev/tests). */
export function getAllUniqueSiteImagePaths(): string[] {
  return [...GLOBAL_UNIQUE_CONTEXTS].map((context) =>
    getImagePathForContext(context as ImageContextKey)
  );
}
