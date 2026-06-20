/**
 * Google API auth helper — service account for GA4 + GSC
 * Environment variables needed:
 *   GOOGLE_CLIENT_EMAIL — service account email
 *   GOOGLE_PRIVATE_KEY — service account private key (with \n)
 */
import { google } from 'googleapis';

let cachedAuth: any = null;

export function getGoogleAuth() {
  if (cachedAuth) return cachedAuth;

  const email = process.env.GOOGLE_CLIENT_EMAIL;
  const key = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!email || !key) {
    throw new Error('Missing GOOGLE_CLIENT_EMAIL or GOOGLE_PRIVATE_KEY');
  }

  cachedAuth = new google.auth.GoogleAuth({
    credentials: {
      client_email: email,
      private_key: key,
    },
    scopes: [
      'https://www.googleapis.com/auth/analytics.readonly',
      'https://www.googleapis.com/auth/webmasters.readonly',
    ],
  });

  return cachedAuth;
}
