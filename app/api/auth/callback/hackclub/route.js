import { NextResponse } from 'next/server';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import { db } from '@/lib/db';
import {
  authErrorRedirectUrl,
  setSessionOnResponse,
  verifyOAuthState,
} from '@/lib/session';

const HCA_JWKS = createRemoteJWKSet(
  new URL('https://auth.hackclub.com/oauth/discovery/keys')
);

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
      { error: 'No authorization code provided' },
      { status: 400 }
    );
  }

  if (!(await verifyOAuthState(request))) {
    return NextResponse.redirect(
      authErrorRedirectUrl(request, 'invalid_oauth_state')
    );
  }

  try {
    const tokenResponse = await fetch('https://auth.hackclub.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.HCA_CLIENT_ID || '',
        client_secret: process.env.HCA_CLIENT_SECRET || '',
        code,
        redirect_uri: process.env.HCA_REDIRECT_URI || '',
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error('Token Exchange Error:', tokenData);
      return NextResponse.redirect(
        authErrorRedirectUrl(request, 'token_exchange_failed')
      );
    }

    let userSlackId = null;
    let userEmail = null;
    let userName = null;

    if (tokenData.id_token) {
      const { payload } = await jwtVerify(tokenData.id_token, HCA_JWKS, {
        issuer: 'https://auth.hackclub.com',
        audience: process.env.HCA_CLIENT_ID,
      });

      userSlackId = payload.slack_id || null;
      userEmail = payload.email || null;
      userName = payload.name || null;
    }

    if (!userSlackId && tokenData.access_token) {
      const userinfoRes = await fetch('https://auth.hackclub.com/oauth/userinfo', {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      });

      if (userinfoRes.ok) {
        const userInfo = await userinfoRes.json();
        userSlackId = userInfo.slack_id || null;
        userEmail = userInfo.email || userEmail;
        userName = userInfo.name || userName;
      }
    }

    if (!userSlackId) {
      return NextResponse.redirect(
        authErrorRedirectUrl(
          request,
          'missing_slack_id — ensure the login scope includes slack_id'
        )
      );
    }

    // --- Database Sync ---
    try {
      await db.user.upsert({
        where: { slackId: userSlackId },
        update: {
          username: userName || 'Anonymous',
          hcaVerified: true,
        },
        create: {
          slackId: userSlackId,
          username: userName || 'Anonymous',
          hcaVerified: true,
          role: 'USER',
        },
      });
    } catch (dbError) {
      console.error('Failed to sync user to database:', dbError);
      // We continue the session even if DB fails, 
      // but you might want to block them here later.
    }

    const response = NextResponse.redirect(new URL('/dashboard', request.url));
    await setSessionOnResponse(response, {
      slackId: userSlackId,
      email: userEmail,
      name: userName,
    });

    return response;
  } catch (error) {
    console.error('Callback Route Exception:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
