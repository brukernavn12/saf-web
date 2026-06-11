/** Re-exports from the central image registry. */
export {
  imagePath,
  images,
  tripImages,
  getImagePathForContext,
  getTripImageUrls,
  selectUniqueImage,
  getAllUniqueSiteImagePaths,
  IMAGE_CATALOG,
  IMAGE_ASSIGNMENTS,
} from "@/lib/image-registry";

export type {
  ImageCategory,
  ImageContextKey,
  ImageAsset,
  TripSlug,
} from "@/lib/image-registry";
