import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const baseUrl = 'https://emailautomation.socialsynk.in';

    // Static pages
    const staticPages = [
      ''
    ];

    // Generate sitemap XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages
  .map((page) => {
    const priority = page === '' ? '1.0' : '0.8';
    const changeFreq = page === '' ? 'daily' : 'weekly';
    return `
  <url>
    <loc>${baseUrl}/${page}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${changeFreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
  })
  .join('')}
</urlset>`;

    return new NextResponse(sitemap, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate',
      },
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}