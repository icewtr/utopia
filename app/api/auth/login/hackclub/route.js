import { NextResponse } from 'next/server';
import { setOAuthStateOnResponse } from '@/lib/session';

export async function GET() {
  const state = crypto.randomUUID();

  const params = new URLSearchParams({
    client_id: process.env.HCA_CLIENT_ID || '',
    redirect_uri: process.env.HCA_REDIRECT_URI || '',
    response_type: 'code',
    scope: 'openid profile email slack_id',
    state,
  });

  const response = NextResponse.redirect(
    `https://auth.hackclub.com/oauth/authorize?${params}`
  );
  setOAuthStateOnResponse(response, state);
  return response;
}
