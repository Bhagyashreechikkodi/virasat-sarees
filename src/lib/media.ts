const VIDEO_EXT = /\.(mp4|webm|mov|m4v)(?:$|[?#])/i;
const URL_RE = /https?:\/\/[^\s"'<>\\]+|\/uploads\/[^\s"'<>\\]+/gi;

function stripWrappingJunk(value: string): string {
  return value
    .trim()
    .replace(/^[[("']+|[\])"']+$/g, "")
    .replace(/\\+$/g, "")
    .trim();
}

function looksLikeMediaUrl(value: string): boolean {
  if (!value) return false;
  if (value.startsWith("/uploads/")) return true;
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function normalizeUrls(urls: string[], unique: boolean): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const url of urls) {
    const clean = stripWrappingJunk(url);
    if (!looksLikeMediaUrl(clean)) continue;
    if (unique) {
      if (seen.has(clean)) continue;
      seen.add(clean);
    }
    out.push(clean);
  }
  return out;
}

function extractUrls(raw: string): string[] {
  const matches = raw.match(URL_RE) ?? [];
  return normalizeUrls(
    matches.map((match) => match.replace(/[),.;]+$/g, "")),
    true,
  );
}

/** Parse product media from a JSON array, newline/comma list, or mixed paste. */
export function parseMediaList(raw: string | string[] | null | undefined): string[] {
  if (raw == null) return [];
  if (Array.isArray(raw)) {
    return normalizeUrls(raw.flatMap((item) => parseMediaList(String(item))), false);
  }

  const trimmed = raw.trim();
  if (!trimmed) return [];

  if (trimmed.startsWith("[") || trimmed.startsWith('"')) {
    try {
      const parsed = JSON.parse(trimmed) as unknown;
      if (Array.isArray(parsed)) {
        const fromJson = normalizeUrls(
          parsed.flatMap((item) => (typeof item === "string" ? parseMediaList(item) : [])),
          false,
        );
        if (fromJson.length) return fromJson;
      }
      if (typeof parsed === "string") {
        const nested = parseMediaList(parsed);
        if (nested.length) return nested;
      }
    } catch {
      // Fall through to newline / URL extraction.
    }
  }

  const lineParts = trimmed
    .split(/\r?\n|;/)
    .flatMap((line) => line.split(/,\s+(?=https?:\/\/|\/uploads\/)/))
    .map(stripWrappingJunk)
    .filter(Boolean);

  const fromLines = normalizeUrls(lineParts, false);
  if (fromLines.length) return fromLines;

  return extractUrls(trimmed);
}

export function isVideoUrl(src: string): boolean {
  if (VIDEO_EXT.test(src)) return true;
  return /\/video\/upload\//i.test(src);
}

export function galleryImages(urls: string[] | undefined): string[] {
  return (urls ?? []).filter((url) => url && !isVideoUrl(url));
}

export function remoteUnoptimized(src: string): boolean {
  return !src.includes("images.unsplash.com");
}
