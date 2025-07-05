// app/robots.txt/route.ts

import { NextResponse } from 'next/server';

export function GET() {
  const content = `
User-agent: *
Allow: /

Sitemap: https://emailautomation.socialsynk.in/sitemap.xml
`;

  return new NextResponse(content.trim(), {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}