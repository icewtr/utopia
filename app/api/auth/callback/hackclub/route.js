// app/api/auth/callback/hackclub/route.js
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { decodeJwt, SignJWT } from 'jose';

export async function GET(request) {
  // 1. Grab the authorization code from the URL search params
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json(
      { error: 'No authorization code provided' },
      { status: 400 }
    );
  }

  // Ensure SESSION_SECRET is loaded
  const secretKey = new TextEncoder().encode(
    process.env.SESSION_SECRET || 'fallback-secret-key-change-this-in-env'
  );

  try {
    // 2. Exchange authorization code for tokens (Access Token & ID Token)
    const tokenResponse = await fetch('https://auth.hackclub.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.HCA_CLIENT_ID || '',
        client_secret: process.env.HCA_CLIENT_SECRET || '',
        code: code,
        redirect_uri: process.env.HCA_REDIRECT_URI || '',
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error('Token Exchange Error:', tokenData);
      return NextResponse.json(
        { error: 'Failed to exchange authorization code' },
        { status: 500 }
      );
    }

    // 3. Extract user information and Slack ID via OIDC ID Token or UserInfo
    let user_slack_id = null;
    let user_email = null;
    let user_name = null;

    if (tokenData.id_token) {
      // Decode OIDC ID Token JWT
      const decodedToken = decodeJwt(tokenData.id_token);

      user_slack_id = decodedToken.slack_id || decodedToken.sub;
      user_email = decodedToken.email || null;
      user_name = decodedToken.name || null;
    } else {
      // Fallback: Fetch from userinfo endpoint
      const userinfoRes = await fetch('https://auth.hackclub.com/oauth/userinfo', {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      });

      if (userinfoRes.ok) {
        const userInfo = await userinfoRes.json();
        user_slack_id = userInfo.slack_id || userInfo.sub;
        user_email = userInfo.email || null;
        user_name = userInfo.name || null;
      }
    }

    if (!user_slack_id) {
      return NextResponse.json(
        { error: 'Could not retrieve Slack ID from Hack Club Auth' },
        { status: 400 }
      );
    }

    // 4. Create encrypted Session JWT
    const sessionJwt = await new SignJWT({
      slackId: user_slack_id,
      email: user_email,
      name: user_name,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(secretKey);

    // 5. Save to HTTP-only Cookie
    // FIX: Next.js 15 requires `await cookies()`
    const cookieStore = await cookies();
    cookieStore.set('session', sessionJwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    // 6. Redirect to dashboard/home
    // FIX: Passing request.url to new URL guarantees an absolute URL resolution
    return NextResponse.redirect(new URL('/dashboard', request.url));

  } catch (error) {
    console.error('Callback Route Exception:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}