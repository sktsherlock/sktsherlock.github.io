# Hao Yan / 颜浩 — academic homepage

Static homepage for [sktsherlock.github.io](https://sktsherlock.github.io/), with English and Chinese versions, a bilingual name, and the English name Sherirto.

## Edit and preview

The selected, editable source is `design-demos/editorial.html`. It contains the layout, biography, and base styles. The shared typography, responsive spacing and visual polish are in `css/homepage-editorial.css`, loaded after the optional brand styles in `css/homepage-corner.css`. See `DESIGN.md` for the current visual system. Publications are maintained in `design-demos/content.json`: the build updates the publication section in both the design preview and production page. Other biographical fields in the JSON remain a factual reference; update both files when changing those facts.

```sh
node scripts/build-homepage.mjs
node scripts/preview.mjs
```

Open `http://127.0.0.1:8768/` for English, `/zh/` for Chinese, or `/design-demos/editorial.html` for the editable design. The build writes static `index.html`, `zh/index.html`, and `css/homepage.css`; commit these generated files. GitHub Pages needs no additional build framework. Historical article directories remain intact.

Chinese copy is maintained in `design-demos/zh-CN.json` as ordered exact replacements, including complete biography paragraphs. Update the matching translation whenever its English source changes. Official paper titles and author names remain in English in both versions. Both pages work without JavaScript. The small shared `js/homepage-preferences.js` enables theme switching and remembers language/theme preferences where local storage is available. The initial theme follows the operating system; choosing a theme overrides that preference. Language switching keeps the current section and URL query.

## Content conventions

- Focus on publications, education, internships, academic service, and honors. Project details and tool-skills lists belong in the CV and are not shown on this academic homepage.
- Show every first-author publication with an uncropped thumbnail and summary, regardless of venue tier. Default desktop rows reserve 320px for figures and give the remaining width to titles and authors; mobile rows stack figure first. Clicking a thumbnail opens the full figure. Keep collaborative work in More Publications, expanded by default.
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

## Typography

The name retains self-hosted Newsreader as its serif signature. Default section titles, publication titles, and body text use a platform sans-serif stack: Apple system fonts on Apple devices, Segoe UI on Windows, with PingFang SC / Microsoft YaHei Chinese fallbacks. The section/body scale is 28/16 px on desktop and 24/16 px on mobile; publication titles are 23/21 px. The optional Claude style retains serif section headings. IBM Plex Sans remains in the repository as a historical asset; its OFL license is retained. No Apple font files are redistributed. The Chinese name prefers the installed PingFang SC font on Apple devices. A small, licensed Noto Sans SC subset containing only 颜浩 provides a consistent fallback elsewhere. It is not a general Chinese body font; regenerate the subset if changing the Chinese name. Chinese paragraphs use more line-height, and official English paper titles and author lines are tagged with `lang=en` in both locales.

The selected editorial design was developed with huashu-design. Font hierarchy was refined with the [Apple design analysis](https://getdesign.md/apple/design-md) as a reference; the [Apple system font list](https://developer.apple.com/fonts/system-fonts/) identifies PingFang SC. This site is not affiliated with Apple or Distill.

## Checks

`scripts/check-designs.cjs` exercises the selected design using Playwright. Set `DESIGNS=editorial` to check only the selected design; `PLAYWRIGHT_MODULE` and `BROWSER_PATH` can point to an existing Playwright package and Chromium executable. It checks 1440/768/390/320px layouts, expanded publication lists, local images and anchors, keyboard disclosure controls, and content without JavaScript. Screenshots are local review artifacts.

`scripts/check-preferences.cjs` additionally checks both languages and themes, preference persistence, system-theme behavior, navigation between languages, unavailable browser storage, keyboard controls, static Chinese content, and CCF ordering.
