import { readFile, writeFile, mkdir } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
let html = await readFile(new URL('design-demos/editorial.html', root), 'utf8');
const content = JSON.parse(await readFile(new URL('design-demos/content.json', root), 'utf8'));
const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const authors = value => escape(value).replace(/\bHao Yan\b/g, '<strong>Hao Yan</strong>');
const links = paper => [
  paper.paper && `<a class="text-link" href="${escape(paper.paper)}">Read paper <span aria-hidden="true">↗</span></a>`,
  paper.code && `<a class="text-link" href="${escape(paper.code)}">View code <span aria-hidden="true">↗</span></a>`
].filter(Boolean).join('');
const venue = paper => `<span>${escape(paper.venue)}</span><span class="ccf-badge">CCF-${escape(paper.ccf)}</span>`;
const firstAuthor = content.publications.filter(paper => paper.firstAuthor);
const collaborations = content.publications.filter(paper => !paper.firstAuthor);
const featured = firstAuthor.map((paper, index) => `<article class="paper paper-${index}" id="${escape(paper.id)}">
  <figure><a href="${escape(paper.image)}" aria-label="Open full figure for ${escape(paper.title)}"><img src="${escape(paper.image)}" alt="${escape(paper.caption)}" loading="lazy"></a><figcaption>${escape(paper.caption)}</figcaption></figure>
  <div class="paper-copy"><p class="eyebrow venue">${venue(paper)}</p><h3>${escape(paper.title)}</h3><p class="authors">${authors(paper.authors)}</p><p class="paper-summary">${escape(paper.summary)}</p><div class="paper-links">${links(paper)}</div></div>
</article>`).join('\n');
const archive = collaborations.map(paper => `<article class="archive-paper" id="${escape(paper.id)}"><p class="archive-venue">${venue(paper)}</p><div><h3>${escape(paper.title)}</h3><p class="authors">${authors(paper.authors)}</p><div class="paper-links">${links(paper)}</div></div></article>`).join('\n');
const publications = `<section id="research" aria-labelledby="research-title">
<div class="section-heading"><h2 id="research-title">First-author research</h2><p>${firstAuthor.length} first-author papers · ${content.publications.length} publications in total</p></div>
<p class="publication-note">Venue ratings follow the <a href="${escape(content.ccfSource)}">CCF 2026 catalogue</a>.</p>
${featured}
<details class="publication-record" open><summary>More Publications <span>${collaborations.length} collaborative works</span></summary>${archive}</details>
</section>`;
html = html.replace(/<section id="research"[\s\S]*?(?=<section id="projects")/, publications);
// Keep the chosen design preview and the production page on the same publication record.
await writeFile(new URL('design-demos/editorial.html', root), html);
const style = html.match(/<style>([\s\S]*?)<\/style>/);
if (!style) throw new Error('Editorial source is missing its stylesheet.');
await mkdir(new URL('css/', root), { recursive: true });
await writeFile(new URL('css/homepage.css', root), style[1].trim() + '\n');
html = html.replace(/<!--[\s\S]*?-->/g, '')
  .replace(/<meta name="robots" content="[^"]*">/, '')
  .replace(/<style>[\s\S]*?<\/style>/, '<link rel="stylesheet" href="css/homepage.css">')
  .replaceAll('../images/', 'images/');
const metadata = `
<link rel="canonical" href="https://sktsherlock.github.io/">
<link rel="icon" href="images/hao.jpg" type="image/jpeg">
<meta name="google-site-verification" content="zApo4ExUOx1XT93yiBoTFltC1NrryrT4B3w7h8EmDU0">
<meta property="og:type" content="website">
<meta property="og:url" content="https://sktsherlock.github.io/">
<meta property="og:title" content="Hao Yan (颜浩) · Sherirto">
<meta property="og:description" content="Ph.D. student at Central South University. Graph–language models, multimodal learning, and scientific agents. Expected graduation: June 2027.">
<meta property="og:image" content="https://sktsherlock.github.io/images/hao.jpg">
<meta name="twitter:card" content="summary">
`;
html = html.replace('</head>', metadata + '</head>');
// Keep old homepage section bookmarks useful after the redesign.
for (const [legacy, current] of Object.entries({ 'about-me': 'about', '-education': 'background', '-publication': 'research', '-experience': 'background', '-news': 'projects', '-honor-and-award': 'recognition', '-after-research': 'life' })) {
  const needle = new RegExp(`(<[^>]+id="${current}"[^>]*>)`);
  html = html.replace(needle, `$1<span id="${legacy}" class="legacy-anchor" aria-hidden="true"></span>`);
}
await writeFile(new URL('index.html', root), html.trim() + '\n');
console.log('Built index.html and css/homepage.css from the selected editorial design.');
