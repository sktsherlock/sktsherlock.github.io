import { readFile } from 'node:fs/promises';

const interests = JSON.parse(await readFile(new URL('../design-demos/personal-interests.json', import.meta.url), 'utf8'));
const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const copy = (language, english, chinese) => language === 'zh' ? chinese : english;
const name = (item, language) => escape(item.name[language]);
const image = (item, language) => `<img src="${escape(item.image)}" alt="${escape(item.alt[language])}" loading="lazy" decoding="async">`;
const card = (item, language) => `<figure class="interest-card interest-${item.id}"><a href="${escape(item.source)}">${image(item, language)}<figcaption>${name(item, language)}</figcaption></a></figure>`;

export function renderLife(language = 'en') {
  const [animation, series, music, games] = interests.groups;
  return `<section id="life" class="personal-section" aria-labelledby="life-title">
  <div class="section-heading"><h2 id="life-title">${copy(language, 'Beyond research', '研究之外')}</h2><p>${copy(language, 'Stories, music & a little play', '故事、音乐与一点游戏时光')}</p></div>
  <p class="personal-intro">${copy(language, 'Outside research, I enjoy video creation and editing, animation, TV series, and games. I also enjoy the music of Jay Chou and Hebe Tien.', '研究之外，我喜欢视频创作与剪辑，也喜欢动漫、剧集和游戏。音乐方面，我喜欢周杰伦与田馥甄的作品。')}</p>
  <div class="life-gallery"><article class="life-animation"><h3>${animation.label[language]}</h3><div class="life-animation-strip">${animation.items.map(item => card(item, language)).join('')}</div></article>
  <div class="life-side"><article><h3>${series.label[language]}</h3><div class="life-mini-row">${series.items.map(item => card(item, language)).join('')}</div></article>
  <article><h3>${music.label[language]}</h3><div class="life-mini-row">${music.items.map(item => card(item, language)).join('')}</div></article>
  <article><h3>${games.label[language]}</h3><div class="life-mini-row">${games.items.map(item => card(item, language)).join('')}</div></article></div></div>
  <p class="portrait-hint">${copy(language, 'A small surprise lives in the portrait at the top.', '页首的头像里，还藏着一个小惊喜。')}</p>
</section>`;
}

const styles = [
  {id:'editorial', title:{en:'Research journal',zh:'研究杂志'}, description:{en:'The original · paper, serif & rust',zh:'原版 · 纸白、衬线与赤陶色'}, source:null},
  {id:'apple', title:{en:'Apple',zh:'Apple'}, description:{en:'Airy spacing · blue & soft gray',zh:'舒展留白 · 蓝色与柔灰'}, source:'https://getdesign.md/apple/design-md'},
  {id:'claude', title:{en:'Claude',zh:'Claude'}, description:{en:'Warm paper · literary headings',zh:'暖色纸张 · 文学式标题'}, source:'https://getdesign.md/claude/design-md'},
  {id:'linear', title:{en:'Linear',zh:'Linear'}, description:{en:'Precise grid · lavender & charcoal',zh:'精密网格 · 薰衣草紫与炭黑'}, source:'https://getdesign.md/linear.app/design-md'},
  {id:'spotify', title:{en:'Spotify',zh:'Spotify'}, description:{en:'Bold gallery · green & deep surfaces',zh:'大胆画廊 · 绿色与深色层次'}, source:'https://getdesign.md/spotify/design-md'}
];

export function renderCorner(language = 'en') {
  const categoryButtons = interests.groups.map((group,index) => `<button type="button" data-interest-category="${group.id}" aria-pressed="${index === 0}">${group.label[language]}</button>`).join('');
  const panels = interests.groups.map((group,index) => `<section class="corner-category" data-interest-panel="${group.id}" aria-label="${group.label[language]}"${index ? ' hidden' : ''}><div class="corner-gallery">${group.items.map(item => card(item, language)).join('')}</div>${group.id === 'music' ? `<p class="corner-caption">${copy(language, 'Two artists whose music I enjoy.', '两位我喜欢的音乐人。')}</p>` : ''}</section>`).join('');
  const choices = styles.map(style => `<button type="button" class="style-choice" data-style-choice="${style.id}" data-style-title="${style.title[language]}" aria-pressed="${style.id === 'editorial'}"><span class="style-preview preview-${style.id}" aria-hidden="true"><span class="preview-heading">Hao Yan <span lang="zh-CN">颜浩</span></span><span class="preview-rule"></span><span class="preview-lines"></span><span class="preview-tiles"><i></i><i></i></span></span><span class="style-choice-title">${style.id !== 'editorial' ? `<img src="../images/homepage/theme-marks/${style.id}.svg" alt="" width="18" height="18">` : ''}${style.title[language]}<span class="style-selected" aria-hidden="true">✓</span></span><span class="style-choice-description">${style.description[language]}</span></button>`).join('');
  return `<dialog id="personal-corner" class="corner-dialog" aria-labelledby="corner-title">
  <div class="corner-top"><div><p class="corner-eyebrow">${copy(language, 'You found a little detour', '你发现了一个小角落')}</p><h2 id="corner-title">Sherirto’s little corner</h2></div><button type="button" class="corner-close" aria-label="${copy(language, 'Close personal corner', '关闭兴趣角落')}" data-close-corner autofocus>×</button></div>
  <div class="corner-tabs" role="tablist" aria-label="${copy(language, 'Explore this corner', '探索这个角落')}"><button type="button" role="tab" id="corner-interests-tab" aria-controls="corner-interests" aria-selected="true" data-corner-tab="interests">${copy(language, 'Personal interests', '个人兴趣')}</button><button type="button" role="tab" id="corner-styles-tab" aria-controls="corner-styles" aria-selected="false" tabindex="-1" data-corner-tab="styles">${copy(language, 'Style lab', '风格实验室')}</button></div>
  <div id="corner-interests" role="tabpanel" aria-labelledby="corner-interests-tab"><p class="corner-intro">${copy(language, 'A few things I like when I step away from research.', '暂时离开研究，看看我平时喜欢的一些作品。')}</p><div class="interest-filters" aria-label="${copy(language, 'Interest categories', '兴趣分类')}">${categoryButtons}</div>${panels}</div>
  <div id="corner-styles" role="tabpanel" aria-labelledby="corner-styles-tab" hidden><p class="corner-intro">${copy(language, 'Try a different visual language for this academic homepage. Pick a style to see it on the full page.', '给这份学术主页换一种视觉语言。选择一种风格，即可在完整页面上体验。')}</p><div class="style-choices">${choices}</div><p class="style-lab-note">${copy(language, 'Each style works with Light and Dark mode. Your choice is remembered on this browser.', '每种风格都支持日间与夜间模式，当前浏览器会记住你的选择。')}</p><p class="style-sources">${copy(language, 'Independent adaptations inspired by', '设计灵感来自')} <a href="https://github.com/voltagent/awesome-design-md">awesome-design-md</a> · ${styles.filter(style=>style.source).map(style=>`<a href="${style.source}">${style.title[language]}</a>`).join(' · ')}</p></div>
</dialog><div class="style-notice" id="style-notice" role="status" hidden><span data-style-notice-text></span><button type="button" data-undo-style>${copy(language, 'Undo', '撤销')}</button><button type="button" data-dismiss-notice aria-label="${copy(language, 'Dismiss style notice', '关闭风格提示')}">×</button></div>`;
}
