import { NextResponse } from 'next/server';
import { clearSessionOnResponse } from '@/lib/session';

export async function POST(request) {
  const response = NextResponse.redirect(new URL('/', request.url));
  clearSessionOnResponse(response);
  return response;
}

export async function GET(request) {
  const response = NextResponse.redirect(new URL('/', request.url));
  clearSessionOnResponse(response);
  return response;
}
