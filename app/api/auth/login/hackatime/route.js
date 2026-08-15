import { NextResponse } from 'next/server';
import { setOAuthStateOnResponse } from '@/lib/session';

export async function GET() {
  const state = crypto.randomUUID();

  const params = new URLSearchParams({
    client_id: process.env.HACKATIME_CLIENT_ID || '',
    redirect_uri: process.env.HACKATIME_REDIRECT_URI || '',
    response_type: 'code',
    scope: 'profile read',
    state,
  });

  const response = NextResponse.redirect(
    `https://hackatime.hackclub.com/oauth/authorize?${params}`
  );
  setOAuthStateOnResponse(response, state);
  return response;
}
