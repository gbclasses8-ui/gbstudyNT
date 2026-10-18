import { Batch, CourseOverview, FolderItem, VideoMediaData } from '../types';
import { INITIAL_BATCHES } from '../data/batchesData';

const PRIMARY_URL = 'https://nt.studybeepro.site';
const FALLBACK_URL = 'https://old-nt.studybeepro.site';

// Session memory cache to prevent duplicate fetches & speed up browsing
const folderCache = new Map<string, FolderItem[]>();
const overviewCache = new Map<number | string, CourseOverview>();
const mediaCache = new Map<string, VideoMediaData>();

/**
 * Robust JSON fetcher with automatic fallback and protection against HTML error pages
 */
async function fetchSafeJson(primaryUrl: string, fallbackUrl?: string): Promise<any> {
  // Try relative proxy URL first in dev, then direct primary URL
  const urlsToTry: string[] = [];

  // In browser, try direct primaryUrl first since nt.studybeepro.site sets Access-Control-Allow-Origin: *
  urlsToTry.push(primaryUrl);

  // If primaryUrl is absolute, also try relative version if proxy is active
  if (primaryUrl.startsWith(PRIMARY_URL)) {
    urlsToTry.push(primaryUrl.replace(PRIMARY_URL, ''));
  }

  // Add fallback url if provided
  if (fallbackUrl) {
    urlsToTry.push(fallbackUrl);
  }

  let lastError: any = null;

  for (const url of urlsToTry) {
    try {
      const res = await fetch(url, {
        headers: {
          Accept: 'application/json, text/plain, */*',
        },
      });

      if (!res.ok) {
        continue;
      }

      const text = await res.text();
      // Guard against HTML / Doctype error pages
      const trimmed = text.trim();
      if (trimmed.startsWith('<') || trimmed.startsWith('<!DOCTYPE')) {
        continue;
      }

      const json = JSON.parse(trimmed);
      return json;
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error(`Failed to fetch JSON from ${primaryUrl}`);
}

export async function fetchBatches(): Promise<Batch[]> {
  try {
    const json = await fetchSafeJson(
      `${PRIMARY_URL}/batches.json?_t=${Date.now()}`,
      `${FALLBACK_URL}/batches.json?_t=${Date.now()}`
    );
    const rawList = [...(json.new || []), ...(json.old || [])];
    if (Array.isArray(rawList) && rawList.length > 0) {
      return INITIAL_BATCHES.map((initial) => {
        const found = rawList.find((b: any) => String(b.id) === String(initial.id));
        if (found) {
          return {
            ...initial,
            title: found.title || initial.title,
            thumbnail: found.thumbnail || initial.thumbnail,
          };
        }
        return initial;
      });
    }
  } catch (err) {
    console.warn('Using bundled initial batches dataset:', err);
  }
  return INITIAL_BATCHES;
}

export async function fetchCourseOverview(courseId: number | string): Promise<CourseOverview | null> {
  if (overviewCache.has(courseId)) {
    return overviewCache.get(courseId)!;
  }

  try {
    const json = await fetchSafeJson(
      `${PRIMARY_URL}/api/nt?overview=${courseId}&_t=${Date.now()}`,
      `${FALLBACK_URL}/api/nig?overview=${courseId}&_t=${Date.now()}`
    );

    if (json && json.success && Array.isArray(json.data)) {
      const overviewTab = json.data.find((d: any) => d.type === 'overview');
      const detailsSection = overviewTab?.data?.find((l: any) => l.layout_type === 'details');
      const courseDetails = detailsSection?.layout_data?.[0];
      const extraTab = json.data.find((d: any) => d.type === 'extra_overview');

      const overview: CourseOverview = {
        id: Number(courseId),
        title: courseDetails?.title || `Batch ${courseId}`,
        description: courseDetails?.description || '',
        thumbnail: courseDetails?.thumbnail || '',
        mrp: courseDetails?.mrp,
        offer_price: courseDetails?.offer_price,
        is_new: courseDetails?.is_new,
        is_trending: courseDetails?.is_trending,
        timeTableTitle: extraTab?.title || 'Schedule & Time Table',
        timeTableHtml: extraTab?.description || '',
      };

      overviewCache.set(courseId, overview);
      return overview;
    }
  } catch (err) {
    console.error(`Error loading overview for course ${courseId}:`, err);
  }

  // Fallback to initial batch info
  const initial = INITIAL_BATCHES.find((b) => String(b.id) === String(courseId));
  if (initial) {
    return {
      id: initial.id,
      title: initial.title,
      description: initial.description,
      thumbnail: initial.thumbnail,
    };
  }

  return null;
}

export async function fetchFolderContent(
  courseId: number | string,
  folderId: string | number = 0
): Promise<FolderItem[]> {
  const cacheKey = `${courseId}_${folderId}`;
  if (folderCache.has(cacheKey)) {
    return folderCache.get(cacheKey)!;
  }

  try {
    const json = await fetchSafeJson(
      `${PRIMARY_URL}/api/nt?content=${courseId}&folder=${folderId}&_t=${Date.now()}`,
      `${FALLBACK_URL}/api/nig?content=${courseId}&folder=${folderId}&_t=${Date.now()}`
    );

    if (json && json.success && Array.isArray(json.data)) {
      folderCache.set(cacheKey, json.data);
      return json.data;
    }
  } catch (err) {
    console.error(`Error fetching folder ${folderId} for course ${courseId}:`, err);
  }

  return [];
}

export async function resolveMediaContent(
  courseId: number | string,
  contentId: string | number,
  item?: FolderItem | any
): Promise<VideoMediaData | null> {
  const cacheKey = `${courseId}_${contentId}`;
  if (mediaCache.has(cacheKey)) {
    return mediaCache.get(cacheKey)!;
  }

  const rawData = item?.data || {};
  let fileUrl = rawData.file_url || '';
  const vdcId = rawData.vdc_id;
  const isPdf = rawData.file_type === 1 || String(item?.title || '').toLowerCase().includes('.pdf');
  let parsedDownloads: Array<{ title: string; url: string }> = [];

  // Parse any existing download URLs on item
  if (rawData.download_urls) {
    try {
      const parsed = typeof rawData.download_urls === 'string'
        ? JSON.parse(rawData.download_urls)
        : rawData.download_urls;
      if (Array.isArray(parsed)) {
        parsedDownloads = parsed;
      }
    } catch {
      // ignore
    }
  }

  // Priority 1: If item has vdc_id, resolve video crypt stream
  if (vdcId && vdcId.trim() !== '' && vdcId !== 'null') {
    try {
      const vcJson = await fetchSafeJson(`${PRIMARY_URL}/vc/${vdcId}`);
      if (vcJson && (vcJson.success || vcJson.status)) {
        const streamLink = vcJson.data?.data?.link?.file_url || vcJson.data?.link?.file_url || deepFindUrl(vcJson);
        if (streamLink) {
          fileUrl = streamLink;
        }
      }
    } catch (e) {
      console.warn(`VideoCrypt resolution notice for vdc_id ${vdcId}:`, e);
    }
  }

  // Priority 2: If still no fileUrl or if it's a PDF note, resolve via /vc/media
  if (!fileUrl || isPdf) {
    try {
      const mediaJson = await fetchSafeJson(
        `${PRIMARY_URL}/vc/media?course_id=${courseId}&content_id=${contentId}&_t=${Date.now()}`
      );
      const mediaContent = mediaJson.decryptedData || mediaJson.data || {};
      const resolvedUrl = mediaContent.file_url || deepFindUrl(mediaContent);
      if (resolvedUrl) {
        fileUrl = resolvedUrl;
      }

      // Check for additional download URLs from media resolution
      if (mediaContent.download_urls && parsedDownloads.length === 0) {
        try {
          const parsed = typeof mediaContent.download_urls === 'string'
            ? JSON.parse(mediaContent.download_urls)
            : mediaContent.download_urls;
          if (Array.isArray(parsed)) {
            parsedDownloads = parsed;
          }
        } catch {
          // ignore
        }
      }
    } catch (e) {
      console.warn(`vc/media resolution notice for ${contentId}:`, e);
    }
  }

  // Priority 3: Fallback to download MP4 if no stream URL but download_urls exist
  if (!fileUrl && parsedDownloads.length > 0) {
    // Prefer highest available quality (720 -> 480 -> 360 -> 240)
    const best = parsedDownloads.find((d) => d.title.includes('720')) ||
                 parsedDownloads.find((d) => d.title.includes('480')) ||
                 parsedDownloads.find((d) => d.title.includes('360')) ||
                 parsedDownloads[parsedDownloads.length - 1];
    if (best && best.url) {
      fileUrl = best.url;
    }
  }

  // Priority 4: YouTube fallback from thumbnail
  if (!fileUrl && rawData.thumbnail && rawData.thumbnail.includes('i.ytimg.com/vi/')) {
    const parts = rawData.thumbnail.split('/vi/');
    if (parts.length > 1) {
      const ytId = parts[1].split('/')[0];
      if (ytId) {
        fileUrl = `https://www.youtube.com/watch?v=${ytId}`;
      }
    }
  }

  const resolved: VideoMediaData = {
    id: contentId,
    course_id: courseId,
    title: item?.title || rawData.title || 'Educational Lecture',
    description: rawData.description,
    thumbnail: rawData.thumbnail,
    file_url: fileUrl,
    file_type: rawData.file_type,
    video_type: rawData.video_type,
    duration: rawData.duration,
    is_live: rawData.is_live,
    download_urls: parsedDownloads,
  };

  if (fileUrl) {
    mediaCache.set(cacheKey, resolved);
  }

  return resolved;
}

function deepFindUrl(obj: any): string | null {
  if (!obj) return null;
  const commonKeys = ['file_url', 'url', 'link', 'pdf_link', 'videoUrl', 'aws_url', 'pdf_url'];
  for (const key of commonKeys) {
    if (obj[key] && typeof obj[key] === 'string' && obj[key].length > 5) {
      return obj[key];
    }
  }
  if (typeof obj === 'object') {
    for (const key in obj) {
      if (typeof obj[key] === 'object') {
        const found = deepFindUrl(obj[key]);
        if (found) return found;
      }
    }
  }
  return null;
}

export async function fetchLiveClasses(
  courseId: number | string,
  typeCode: '0' | '1' | '2' = '1'
): Promise<any[]> {
  try {
    const json = await fetchSafeJson(
      `${PRIMARY_URL}/api/play?action=classes&type=${typeCode}&course_id=${courseId}&_t=${Date.now()}`
    );
    if (json && json.success && Array.isArray(json.data)) {
      return json.data;
    }
  } catch (err) {
    // live classes not active or empty
  }
  return [];
}
