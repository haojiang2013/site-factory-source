import { NextResponse } from 'next/server';

export async function GET() {
  return new NextResponse('fa71c99a2cd5449fbbfc0c37f2cf6080', {
    headers: { 'Content-Type': 'text/plain' },
  });
}
