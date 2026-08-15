import { NextResponse } from 'next/server';
import {
  authErrorRedirectUrl,
  setSessionOnResponse,
  verifyOAuthState,
} from '@/lib/session';

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  const oauthError = searchParams.get('error');
  if (oauthError) {
    return NextResponse.redirect(
      authErrorRedirectUrl(request, oauthError)
    );
  }

  const code = searchParams.get('code');
  if (!code) {
    return NextResponse.json(
      { error: 'No authorization code found in callback' },
      { status: 400 }
    );
  }

  if (!(await verifyOAuthState(request))) {
    return NextResponse.redirect(
      authErrorRedirectUrl(request, 'invalid_oauth_state')
    );
  }

  try {
    const tokenResponse = await fetch('https://hackatime.hackclub.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.HACKATIME_CLIENT_ID || '',
        client_secret: process.env.HACKATIME_CLIENT_SECRET || '',
        code,
        grant_type: 'authorization_code',
        redirect_uri: process.env.HACKATIME_REDIRECT_URI || '',
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error('Hackatime Token Exchange Error:', tokenData);
      return NextResponse.redirect(
        authErrorRedirectUrl(request, 'hackatime_token_exchange_failed')
      );
    }

    const userResponse = await fetch('https://hackatime.hackclub.com/api/v1/authenticated/me', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const userData = await userResponse.json();

    if (!userResponse.ok) {
      return NextResponse.redirect(
        authErrorRedirectUrl(request, 'hackatime_profile_failed')
      );
    }

    const slackId = userData.slack_id || (userData.id != null ? String(userData.id) : null);

    if (!slackId) {
      return NextResponse.redirect(
        authErrorRedirectUrl(request, 'hackatime_missing_user_id')
      );
    }

    const response = NextResponse.redirect(new URL('/dashboard', request.url));
    await setSessionOnResponse(response, {
      slackId,
      hackatimeAccessToken: tokenData.access_token,
      hackatimeUserId: userData.id,
    });

    return response;
  } catch (error) {
    console.error('Callback Exchange Route Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
