# Hao Yan / 颜浩 — academic homepage

Static homepage for [sktsherlock.github.io](https://sktsherlock.github.io/), with English and Chinese versions, a bilingual name, and the English name Sherirto.

## Edit and preview

The selected, editable source is `design-demos/editorial.html`. It contains the semantic layout, biography, local font declarations, and reset. The shared typography, responsive spacing and visual polish are in `css/homepage-editorial.css`, loaded after the optional brand styles in `css/homepage-corner.css`. See `DESIGN.md` for the current visual system. Publications are maintained in `design-demos/content.json`: the build updates the publication section in both the design preview and production page. Other biographical fields in the JSON remain a factual reference; update both files when changing those facts.

```sh
node scripts/build-homepage.mjs
node scripts/preview.mjs
```

Open `http://127.0.0.1:8768/` for English, `/zh/` for Chinese, or `/design-demos/editorial.html` for the editable design. The build writes static `index.html`, `zh/index.html`, and `css/homepage.css`; commit these generated files. GitHub Pages needs no additional build framework. Historical article directories remain intact.

Chinese copy is maintained in `design-demos/zh-CN.json` as ordered exact replacements, including complete biography paragraphs. Update the matching translation whenever its English source changes. Official paper titles and author names remain in English in both versions. Both pages work without JavaScript. The small shared `js/homepage-preferences.js` enables theme switching and remembers language/theme preferences where local storage is available. The initial theme follows the operating system; choosing a theme overrides that preference. Language switching keeps the corresponding content item and reading position, publication disclosure state, theme/style, URL query, and hash. Position is carried once in session storage, with a temporary URL fallback when storage is blocked. Browser Back/Forward uses each history entry's position and language rather than the remembered entry-page redirect.

## Content conventions

- Focus on publications, education, internships, academic service, and honors. Project details and tool-skills lists belong in the CV and are not shown on this academic homepage.
- Show every first-author publication with an uncropped thumbnail and summary, regardless of venue tier. The desktop split stage displays the active original figure beside the academic record. Phone/tablet entries show the short paper name, figure, and complete citation inline. Reserve each thumbnail’s measured width and height to prevent lazy-load layout shifts. Clicking a thumbnail opens the full figure. Keep collaborative work in More Publications, expanded by default.
- First-author papers retain CCF-A-first ordering. More Publications sorts by publication year descending, then CCF-A before CCF-B within each year; publication years are explicit in the JSON record.
- CCF badges use the 2026 seventh edition consistently, including IJCAI B and ICLR A. See `design-demos/publication-sources.md` for verification and the original catalogue PDF.
- The MAGB thumbnail is Figure 1 from arXiv:2410.09132v2; see `design-demos/kdd-figure-notes.md` for provenance and the publisher-version limitation.
- Prefer verified publisher, arXiv, OpenReview, or author repository links.
- Keep the expected June 2027 graduation date explicitly qualified.
- MSRA internship: July 2022–January 2023. STCA: February 2023–January 2024, remote.
- Supervisor: Senzhang Wang. PolyU joint supervisor: Chengqi Zhang. Additional research supervision: Shirui Pan.
- Present reviewing for NeurIPS, ICLR, ICML, KDD, and CIKM (2024–2026) in an independent academic-service section.
- Research interests may describe expansion into LLMs, agents, LLM reasoning, and looped Transformers. Keep this direction distinct from completed research. The introduction states availability for Research Assistant and Algorithm Engineer positions.
- Keep the public phone number in the contact row, with a working `tel:` link. It matches the latest resume.
- Keep a compact bilingual Beyond research section after honors. Video creation/editing comes from the existing profile; favorite animation (Hyouka, Arcane) and games (League of Legends, Arknights) come from the original homepage (`fca1399`). Reuse its artwork in an animation spread and two game-icon rows, with uncropped images, bilingual captions/alt text, and links to the originals. See `design-demos/personal-assets.md`.
- Add a downloadable CV only when its PDF is confirmed to match the latest source.

## Identity and organization images

The portrait, favicon and sharing preview use the restored original anime avatar, `images/hao.jpg`. Institutional marks are unaltered assets from official CSU, PolyU, HFUT, and Microsoft sources; see `design-demos/organization-assets.md`. Preserve their aspect ratios and colors, with a white logo area in both themes. The two Microsoft internships remain distinct entries. Campus and institution photographs lead the entries, with the logos retained as smaller identifiers. Every photograph links to its official source; see `design-demos/campus-assets.md`. STCA remains explicitly remote, and its Beijing-campus photograph is labeled as institutional context.

## Typography and visual direction

The current split-stage design uses Newsreader for the bilingual identity’s Latin name and short research names, and platform sans-serif for running text, technical citations and section headings. The two-character Noto Sans SC subset provides the Chinese name; full Chinese prose uses system fallbacks. Five principal steps are 50/32/22/16/14px, with 36px Latin / 26px Chinese names on phones. Complete official titles are citation paragraphs, never truncated. See DESIGN.md for tokens, motion, image sizing, source editing and breakpoints.

The direction was developed with design-taste-frontend, seed 146532596. The final screenshot critique, intentional exceptions, inherited asset sources and verification are in design-demos/taste-design-review.md. Optional Apple, Claude, Linear and Spotify palette adaptations remain available from the personal corner.

## Checks

`scripts/check-designs.cjs` exercises the selected design using Playwright. Set `DESIGNS=editorial` to check only the selected design; `PLAYWRIGHT_MODULE` and `BROWSER_PATH` can point to an existing Playwright package and Chromium executable. It checks 1440/768/390/320px layouts, expanded publication lists, local images and anchors, keyboard disclosure controls, and content without JavaScript. Screenshots are local review artifacts.

`scripts/check-preferences.cjs` additionally checks both languages and themes, preference persistence, system-theme behavior, navigation between languages, unavailable browser storage, keyboard controls, static Chinese content, and CCF ordering.

`scripts/check-language-position.cjs` checks language switching at desktop and mobile reading positions, with absent or stale hashes, collapsed publications, history navigation, and blocked storage. It uses pointer clicks on the sticky controls to avoid automation scrolling the header before the click. This regression reproduced the former top-of-page jump before the fix; copying only the URL hash cannot preserve manually scrolled positions.

`scripts/check-editorial.cjs` checks 60 language/style/theme/layout combinations, scientific-figure zoom and focus, fixed-frame source links, disclosure behavior, keyboard navigation and contrast. The design-taste skill’s `lint.mjs` and `inspect.mjs` provide the source and screenshot review; generated inspection artifacts stay local in `.taste-skill/`.
