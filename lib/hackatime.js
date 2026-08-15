// lib/hackatime.js

const HACKATIME_BASE_URL = 'https://hackatime.hackclub.com/api/v1';

function formatDate(date) {
  return date.toISOString().split('T')[0];
}

/** Map friendly range names to Hackatime start_date/end_date query params. */
export function rangeToDates(range) {
  const today = new Date();
  const endDate = formatDate(today);

  switch (range) {
    case 'today':
      return { start_date: endDate, end_date: endDate };
    case 'last_7_days': {
      const start = new Date(today);
      start.setDate(start.getDate() - 6);
      return { start_date: formatDate(start), end_date: endDate };
    }
    case 'last_30_days': {
      const start = new Date(today);
      start.setDate(start.getDate() - 29);
      return { start_date: formatDate(start), end_date: endDate };
    }
    case 'all_time':
    default:
      return {};
  }
}

function authHeaders(accessToken) {
  const headers = { Accept: 'application/json' };
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }
  return headers;
}

/**
 * Fetches overall coding stats for a given Slack ID or Hackatime user ID.
 * @param {string} userId - Slack ID (U…) or Hackatime numeric user ID
 * @param {string} [range='last_7_days'] - 'today', 'last_7_days', 'last_30_days', 'all_time'
 * @param {string} [projectName] - Optional project folder name filter
 * @param {string} [accessToken] - Optional OAuth token (needed when public stats are disabled)
 */
export async function getHackatimeStats(userId, range = 'last_7_days', projectName = null, accessToken = null) {
  if (!userId) throw new Error('User ID is required to query Hackatime');

  const { start_date, end_date } = rangeToDates(range);
  const params = new URLSearchParams();
  if (start_date) params.set('start_date', start_date);
  if (end_date) params.set('end_date', end_date);
  if (projectName) params.set('filter_by_project', projectName);

  const query = params.toString();
  const url = `${HACKATIME_BASE_URL}/users/${encodeURIComponent(userId)}/stats${query ? `?${query}` : ''}`;

  try {
    const res = await fetch(url, {
      headers: authHeaders(accessToken),
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      console.warn(`Hackatime stats API returned status ${res.status} for ${userId}`);
      return null;
    }

    const json = await res.json();
    return json.data || null;
  } catch (error) {
    console.error('Error fetching Hackatime stats:', error);
    return null;
  }
}

/**
 * Fetches coding session spans for a user on a specific date.
 * @param {string} userId
 * @param {string} dateString - Format: "YYYY-MM-DD"
 * @param {string} [projectName]
 * @param {string} [accessToken]
 */
export async function getHackatimeDurations(userId, dateString, projectName = null, accessToken = null) {
  if (!userId || !dateString) return [];

  const params = new URLSearchParams({
    start_date: dateString,
    end_date: dateString,
  });
  if (projectName) params.set('project', projectName);

  const url = `${HACKATIME_BASE_URL}/users/${encodeURIComponent(userId)}/heartbeats/spans?${params}`;

  try {
    const res = await fetch(url, {
      headers: authHeaders(accessToken),
      next: { revalidate: 60 },
    });

    if (!res.ok) return [];

    const json = await res.json();
    return json.spans || [];
  } catch (error) {
    console.error('Error fetching Hackatime spans:', error);
    return [];
  }
}
