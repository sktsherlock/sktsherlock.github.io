import { readFile, writeFile, mkdir } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
let html = await readFile(new URL('design-demos/editorial.html', root), 'utf8');
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
