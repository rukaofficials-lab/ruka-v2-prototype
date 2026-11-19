// Agents that ask for Markdown (Accept: text/markdown) get a Markdown version of the page; browsers still get HTML.
// Homepage -> /index.md, product pages -> /products/<CODE>.md, unknown pages -> 404 with a short Markdown map of the site.
export const config = {
  matcher: ['/((?!assets/|services/|.*\\.(?:css|js|mjs|webp|jpe?g|png|gif|svg|ico|avif|woff2?|json|txt|xml|md|pdf)$).*)'],
};

const headers = { 'content-type': 'text/markdown; charset=utf-8', vary: 'Accept', 'cache-control': 'public, max-age=0, must-revalidate' };

export default async function middleware(request) {
  if (!/text\/markdown/i.test(request.headers.get('accept') || '')) return;
  const url = new URL(request.url);
  const path = url.pathname.replace(/\/+$/, '').replace(/\.html$/, '') || '/';
  const source = path === '/' || path === '/index' ? '/index.md' : /^\/products\/[A-Za-z0-9-]+$/.test(path) ? path + '.md' : null;
  if (source) {
    const md = await fetch(new URL(source, url.origin), { headers: { accept: 'text/plain' } });
    if (md.ok) return new Response(await md.text(), { status: 200, headers });
  } else {
    // A real page without a Markdown version: let the HTML through.
    const page = await fetch(new URL(url.pathname, url.origin), { method: 'HEAD', headers: { accept: 'text/html' } });
    if (page.ok) return;
  }
  const site = url.origin;
  const body = `# 404 — Page not found / ไม่พบหน้านี้\n\nThe page \`${path}\` does not exist on RUKA.\n\n- [Home](${site}/)\n- [All products / สินค้าทั้งหมด](${site}/products)\n- [Catalog JSON](${site}/catalog.json)\n- [About RUKA for AI assistants](${site}/llms.txt)\n- [Sitemap](${site}/sitemap.xml)\n- [Start a brief / เริ่มบรีฟ](${site}/brief)\n- [Contact / ติดต่อ](${site}/contact)\n`;
  return new Response(body, { status: 404, headers });
}
