/**
 * YouTube helpers - extract IDs, thumbnails, embed URLs
 */

export function extractYouTubeId(url) {
  if (!url) return "";
  try {
    // Handle youtu.be/ID
    if (url.includes("youtu.be/")) {
      return url.split("youtu.be/")[1].split(/[?&]/)[0];
    }
    // Handle youtube.com/watch?v=ID
    if (url.includes("v=")) {
      return url.split("v=")[1].split(/[&]/)[0];
    }
    // Handle embed
    if (url.includes("/embed/")) {
      return url.split("/embed/")[1].split(/[?&]/)[0];
    }
    // Assume it's already an ID if 11 chars and no slashes
    if (url.length === 11 && !url.includes("/") && !url.includes(" ")) {
      return url;
    }
    return url;
  } catch {
    return "";
  }
}

export function getYouTubeThumbnail(urlOrId, quality = "hqdefault") {
  const id = extractYouTubeId(urlOrId);
  if (!id) return "";
  return `https://img.youtube.com/vi/${id}/${quality}.jpg`;
}

export function getYouTubeWatchUrl(urlOrId) {
  const id = extractYouTubeId(urlOrId);
  if (!id) return urlOrId;
  return `https://www.youtube.com/watch?v=${id}`;
}

export function getYouTubeEmbedUrl(urlOrId) {
  const id = extractYouTubeId(urlOrId);
  if (!id) return "";
  return `https://www.youtube.com/embed/${id}`;
}
