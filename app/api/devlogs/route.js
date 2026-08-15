// app/api/devlogs/route.js
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/session';
import { getHackatimeStats } from '@/lib/hackatime';

export async function POST(request) {
  try {
    // 1. Verify Session
    const session = await getSession();
    if (!session || !session.slackId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { slackId, hackatimeAccessToken } = session;
    const body = await request.json();
    const { projectId, title, content, lapseUrls = [] } = body;

    if (!projectId || !title || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 2. Fetch target project and existing devlog count
    const project = await db.project.findUnique({
      where: { id: projectId },
      include: {
        devlogs: {
          orderBy: { devlogNumber: 'desc' },
          take: 1,
        },
      },
    });

    if (!project || project.userSlackId !== slackId) {
      return NextResponse.json({ error: 'Project not found or forbidden' }, { status: 404 });
    }

    // Calculate devlog sequence number and start window boundary
    const lastDevlog = project.devlogs[0];
    const devlogNumber = lastDevlog ? lastDevlog.devlogNumber + 1 : 1;
    const windowStartedAt = lastDevlog ? lastDevlog.createdAt : project.createdAt;
    const windowEndedAt = new Date();

    // 3. Fetch Hackatime Stats
    const hackatimeProjectName = project.hackatimeProjects[0] || null;
    const stats = await getHackatimeStats(
      slackId,
      'last_7_days',
      hackatimeProjectName,
      hackatimeAccessToken
    );

    const timeLoggedSeconds = stats?.total_seconds || 0;
    const topEditor = stats?.editors?.[0]?.name || null;
    
    const languagesSnapshot = {};
    if (stats?.languages) {
      stats.languages.forEach((lang) => {
        languagesSnapshot[lang.name] = lang.percent;
      });
    }

    // 4. Word Count & Anti-Fraud Logic
    const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
    
    const wallClockHours = Math.max(1, (windowEndedAt - new Date(windowStartedAt)) / (1000 * 60 * 60));
    const loggedHours = timeLoggedSeconds / 3600;

    let isFlagged = false;
    let flagReason = null;

    if (loggedHours > wallClockHours) {
      isFlagged = true;
      flagReason = `Logged time (${loggedHours.toFixed(1)}h) exceeds wall-clock window (${wallClockHours.toFixed(1)}h)`;
    } else if (loggedHours > 16) {
      isFlagged = true;
      flagReason = `Unusually high single coding window (${loggedHours.toFixed(1)}h)`;
    }

    // Validate Lapse URLs
    const validatedLapseUrls = Array.isArray(lapseUrls)
      ? lapseUrls.filter((url) => typeof url === 'string' && url.includes('lapse.hackclub.com'))
      : [];

    // 5. Database Transaction: Create Devlog & Update Project Metrics
    const [devlog] = await db.$transaction([
      db.devlog.create({
        data: {
          projectId,
          userSlackId: slackId,
          devlogNumber,
          title,
          content,
          wordCount,
          timeLoggedSeconds,
          languagesSnapshot,
          topEditor,
          lapseUrls: validatedLapseUrls,
          isFlagged,
          flagReason,
          windowStartedAt,
          windowEndedAt,
        },
      }),
      db.project.update({
        where: { id: projectId },
        data: {
          totalTimeSeconds: { increment: timeLoggedSeconds },
          primaryEditor: topEditor || project.primaryEditor,
        },
      }),
    ]);

    return NextResponse.json({ success: true, devlog });

  } catch (error) {
    console.error('Failed to create devlog:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}