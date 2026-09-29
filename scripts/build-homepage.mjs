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
const byTier = (a, b) => a.ccf.localeCompare(b.ccf);
const firstAuthor = content.publications.filter(paper => paper.firstAuthor).sort(byTier);
const collaborations = content.publications.filter(paper => !paper.firstAuthor).sort((a, b) => b.year - a.year || byTier(a, b));
const featured = firstAuthor.map((paper, index) => `<article class="paper paper-${index}" id="${escape(paper.id)}">
  <figure><a href="${escape(paper.image)}" aria-label="Open full figure for ${escape(paper.title)}"><img src="${escape(paper.image)}" alt="${escape(paper.caption)}" loading="lazy"></a>${paper.figureLabel ? `<figcaption>${escape(paper.figureLabel)}</figcaption>` : ''}</figure>
  <div class="paper-copy"><p class="eyebrow venue">${venue(paper)}</p><h3>${escape(paper.title)}</h3><p class="authors">${authors(paper.authors)}</p><p class="paper-summary">${escape(paper.summary)}</p><div class="paper-links">${links(paper)}</div></div>
</article>`).join('\n');
const archive = collaborations.map(paper => `<article class="archive-paper" id="${escape(paper.id)}"><p class="archive-venue">${venue(paper)}</p><div><h3>${escape(paper.title)}</h3><p class="authors">${authors(paper.authors)}</p><div class="paper-links">${links(paper)}</div></div></article>`).join('\n');
const publications = `<section id="research" aria-labelledby="research-title">
<div class="section-heading"><h2 id="research-title">First-author research</h2><p>${firstAuthor.length} first-author papers · ${content.publications.length} publications in total</p></div>
<p class="publication-note">Venue ratings follow the <a href="${escape(content.ccfSource)}">CCF 2026 catalogue</a>.</p>
${featured}
<details class="publication-record" open><summary>More Publications <span>${collaborations.length} collaborative works</span></summary>${archive}</details>
</section>`;
html = html.replace(/<section id="research"[\s\S]*?(?=<section class="history")/, publications);
// Keep the chosen design preview and the production page on the same publication record.
await writeFile(new URL('design-demos/editorial.html', root), html);
const style = html.match(/<style>([\s\S]*?)<\/style>/);
if (!style) throw new Error('Editorial source is missing its stylesheet.');
await mkdir(new URL('css/', root), { recursive: true });
await writeFile(new URL('css/homepage.css', root), style[1].trim() + '\n');
html = html.replace(/<!--[\s\S]*?-->/g, '')
  .replace(/<meta name="robots" content="[^"]*">/, '')
  .replace(/<style>[\s\S]*?<\/style>/, '<link rel="stylesheet" href="css/homepage.css">')
  .replaceAll('../js/', 'js/')
  .replaceAll('../images/', 'images/');
const metadata = `
<link rel="canonical" href="https://sktsherlock.github.io/">
<link rel="alternate" hreflang="en" href="https://sktsherlock.github.io/">
<link rel="alternate" hreflang="zh-CN" href="https://sktsherlock.github.io/zh/">
<link rel="alternate" hreflang="x-default" href="https://sktsherlock.github.io/">
<link rel="icon" href="images/homepage/hao-avatar-icon.png" type="image/png" sizes="64x64">
<meta name="google-site-verification" content="zApo4ExUOx1XT93yiBoTFltC1NrryrT4B3w7h8EmDU0">
<meta property="og:type" content="website">
<meta property="og:url" content="https://sktsherlock.github.io/">
<meta property="og:title" content="Hao Yan (颜浩) · Sherirto">
<meta property="og:description" content="Ph.D. student at Central South University. Graph–language models, multimodal learning, LLMs, agents, and reasoning. Seeking Research Assistant and Algorithm Engineer opportunities. Expected graduation: June 2027.">
<meta property="og:image" content="https://sktsherlock.github.io/images/homepage/hao-avatar.webp">
<meta name="twitter:card" content="summary">
`;
html = html.replace('</head>', metadata + '</head>');
// Keep old homepage section bookmarks useful after the redesign.
for (const [legacy, current] of Object.entries({ 'about-me': 'about', '-education': 'background', '-publication': 'research', '-experience': 'background', '-news': 'research', 'projects': 'research', '-honor-and-award': 'recognition', '-after-research': 'life' })) {
  const needle = new RegExp(`(<[^>]+id="${current}"[^>]*>)`);
  html = html.replace(needle, `$1<span id="${legacy}" class="legacy-anchor" aria-hidden="true"></span>`);
}
await writeFile(new URL('index.html', root), html.trim() + '\n');
const chinese = JSON.parse(await readFile(new URL('design-demos/zh-CN.json', root), 'utf8'));
let zh = html;
for (const [english, translation] of chinese.replacements) zh = zh.replaceAll(english, translation);
zh = zh.replace('<html lang="en">', '<html lang="zh-CN">')
  .replace(/<title>.*?<\/title>/, '<title>颜浩 Hao Yan · Sherirto · 学术主页</title>')
  .replace(/<meta name="description" content="[^"]*">/, '<meta name="description" content="颜浩（Hao Yan / Sherirto），中南大学博士生，研究图与语言模型、多模态学习，正拓展至大模型推理、智能体和循环 Transformer，寻找研究助理与算法工程师岗位。">')
  .replace(/<meta property="og:description" content="[^"]*">/, '<meta property="og:description" content="中南大学博士生，预计2027年6月毕业。研究图与语言模型、多模态学习，关注大模型推理、智能体及循环 Transformer，寻找研究助理与算法工程师岗位。">')
  .replace('<link rel="canonical" href="https://sktsherlock.github.io/">', '<link rel="canonical" href="https://sktsherlock.github.io/zh/">')
  .replace('<meta property="og:url" content="https://sktsherlock.github.io/">', '<meta property="og:url" content="https://sktsherlock.github.io/zh/">')
  .replace(/<a id="language-toggle"[^>]*>.*?<\/a>/, '<a id="language-toggle" class="display-control" href="/" hreflang="en" lang="en" aria-label="View homepage in English">English</a>')
  .replaceAll('data-theme-label>Dark', 'data-theme-label>夜间')
  .replaceAll('href="css/', 'href="../css/')
  .replaceAll('src="js/', 'src="../js/')
  .replaceAll('href="images/', 'href="../images/')
  .replaceAll('src="images/', 'src="../images/');
await mkdir(new URL('zh/', root), { recursive: true });
await writeFile(new URL('zh/index.html', root), zh.trim() + '\n');
console.log('Built English and Chinese homepages with shared styles and preferences.');
