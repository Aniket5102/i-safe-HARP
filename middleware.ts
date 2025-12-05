
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const res = NextResponse.next();
  // Allow clipboard read/write for same-origin
  res.headers.set('Permissions-Policy', 'clipboard-read=(self), clipboard-write=(self)');
  return res;
}

    