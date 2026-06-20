/**
 * IndexNow key verification file for Bing/Yandex.
 * Serves at: https://{domain}/indexnow-fa71c99a2cd5449fbbfc0c37f2cf6080.txt
 */
import { NextResponse } from 'next/server';

const KEY = 'fa71c99a2cd5449fbbfc0c37f2cf6080';

export async function GET() {
  return new NextResponse(KEY, {
    headers: { 'Content-Type': 'text/plain' },
  });
}
