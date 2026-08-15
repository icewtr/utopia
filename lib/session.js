import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';

const SESSION_COOKIE = 'session';
export const OAUTH_STATE_COOKIE = 'oauth_state';
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function getSecretKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('SESSION_SECRET must be set in production');
    }
    return new TextEncoder().encode('dev-only-fallback-secret');
  }
  return new TextEncoder().encode(secret);
}

export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
  maxAge: SESSION_MAX_AGE,
};

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return payload;
  } catch {
    return null;
  }
}

export async function createSessionToken(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getSecretKey());
}

/** Merge new fields into an existing session and set the cookie on a Response. */
export async function setSessionOnResponse(response, fields) {
  const existing = (await getSession()) || {};
  const merged = { ...existing, ...fields };
  const sessionJwt = await createSessionToken(merged);
  response.cookies.set(SESSION_COOKIE, sessionJwt, sessionCookieOptions);
  return merged;
}

export function clearSessionOnResponse(response) {
  response.cookies.set(SESSION_COOKIE, '', { ...sessionCookieOptions, maxAge: 0 });
}

export function setOAuthStateOnResponse(response, state) {
  response.cookies.set(OAUTH_STATE_COOKIE, state, {
    ...sessionCookieOptions,
    maxAge: 600, // 10 minutes
  });
}

export async function verifyOAuthState(request) {
  const { searchParams } = new URL(request.url);
  const state = searchParams.get('state');
  const cookieStore = await cookies();
  const storedState = cookieStore.get(OAUTH_STATE_COOKIE)?.value;

  if (!state || !storedState || state !== storedState) {
    return false;
  }

  cookieStore.delete(OAUTH_STATE_COOKIE);
  return true;
}

export function authErrorRedirectUrl(request, message) {
  const url = new URL('/dashboard', request.url);
  url.searchParams.set('auth_error', message);
  return url;
}
