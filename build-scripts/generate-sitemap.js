const fs = require('fs');
const path = require('path');

function generateSitemap() {
    const baseUrl = 'https://prismspecialtiesdmv.com';
    const pages = [];
    
    // Recursively find all index.html files
    function findPages(dir, urlPath = '') {
        const items = fs.readdirSync(dir);
        
        items.forEach(item => {
            const fullPath = path.join(dir, item);
            const stat = fs.statSync(fullPath);
            
            if (stat.isDirectory()) {
                findPages(fullPath, `${urlPath}/${item}`);
            } else if (item === 'index.html') {
                pages.push({
                    url: `${baseUrl}${urlPath}/`,
                    lastmod: new Date().toISOString(),
                    priority: urlPath === '' ? '1.0' : '0.8'
                });
            }
        });
    }
    
    findPages('./public');
    
    // Generate XML sitemap
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;
    
    fs.writeFileSync('./public/sitemap.xml', sitemap);
    console.log(`✅ Generated sitemap with ${pages.length} pages`);
}

generateSitemap();