import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getHackatimeStats, getHackatimeDurations } from '@/lib/hackatime';

export async function GET(request) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized: No active session' }, { status: 401 });
    }

    const userId = session.slackId || session.hackatimeUserId;
    if (!userId) {
      return NextResponse.json({ error: 'User ID missing from session' }, { status: 400 });
    }

    const accessToken =
      typeof session.hackatimeAccessToken === 'string'
        ? session.hackatimeAccessToken
        : null;

    const { searchParams } = new URL(request.url);
    const project = searchParams.get('project') || null;
    const range = searchParams.get('range') || 'last_7_days';
    const date = searchParams.get('date') || null;

    if (date) {
      const durations = await getHackatimeDurations(userId, date, project, accessToken);
      return NextResponse.json({ userId, date, project, durations });
    }

    const stats = await getHackatimeStats(userId, range, project, accessToken);

    return NextResponse.json({
      userId,
      project,
      range,
      stats: stats || {
        total_seconds: 0,
        human_readable_total: '0 secs',
        languages: [],
        editors: [],
      },
    });
  } catch (error) {
    console.error('Hackatime Route Error:', error);
    return NextResponse.json({ error: 'Failed to retrieve Hackatime metrics' }, { status: 500 });
  }
}
