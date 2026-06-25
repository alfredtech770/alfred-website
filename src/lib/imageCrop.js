/* Per-image manual crop, set in the admin Reframe editor.
 * A crop is { zoom, x, y }: zoom is a scale multiplier (>=1); x/y are the
 * focal point in percent (CSS object-position). Stored per image URL in
 * each venue row's `image_crops` jsonb column. These helpers turn a crop
 * into inline-style props applied on top of an `object-fit: cover` <img>,
 * so the public site frames photos exactly the way the admin preview (and
 * the iOS app) do. No crop set -> centered cover, same as before. */
export function cropProps(crop, hoverScale){
  var x = 50, y = 50, z = 1;
  if (crop && typeof crop === "object") {
    if (crop.x != null) x = crop.x;
    if (crop.y != null) y = crop.y;
    if (crop.zoom != null) z = crop.zoom;
  }
  var mult = (hoverScale || 1) * z;
  var s = { objectPosition: x + "% " + y + "%" };
  if (mult && mult !== 1) {
    s.transform = "scale(" + mult + ")";
    s.transformOrigin = x + "% " + y + "%";
  }
  return s;
}

/* Look up the crop for a specific image URL within a venue's image_crops map. */
export function cropFor(crops, url, hoverScale){
  return cropProps(crops && url ? crops[url] : null, hoverScale);
}
