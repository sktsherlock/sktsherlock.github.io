# Hao Yan / 颜浩 — academic homepage

Static homepage for [sktsherlock.github.io](https://sktsherlock.github.io/), maintained in English with a bilingual name and the English name Sherirto.

## Edit and preview

The selected, editable source is `design-demos/editorial.html`. It contains the page content and styles. `design-demos/content.json` is a factual reference; it is not a live rendering dependency. Update both when changing biographical facts.

```sh
node scripts/build-homepage.mjs
node scripts/preview.mjs
```

Open `http://127.0.0.1:8768/` for the production page or `/design-demos/editorial.html` for the editable design. The build writes the static `index.html` and `css/homepage.css`; commit both generated files. GitHub Pages needs no additional build framework. Historical article directories remain intact.

## Content conventions

- Keep published/accepted papers separate from preprints and ongoing projects.
- Prefer verified publisher, arXiv, OpenReview, or author repository links.
- Keep the expected June 2027 graduation date explicitly qualified.
- MSRA internship: July 2022–January 2023. STCA: February 2023–January 2024, remote.
- Supervisor: Senzhang Wang. PolyU joint supervisor: Chengqi Zhang. Additional research supervision: Shirui Pan.
- Agent projects describe development, tools, Skills, and research workflows. Do not imply completed LLM post-training experiments.
- Add a downloadable CV only when its PDF is confirmed to match the latest source.

## Typography

Newsreader and IBM Plex Sans are self-hosted under `fonts/homepage/`, with their OFL licenses. The Chinese name prefers the installed PingFang SC font on Apple devices. A small, licensed Noto Sans SC subset containing only 颜浩 provides a consistent fallback elsewhere. It is not a general Chinese body font; regenerate the subset if changing the Chinese name.

The selected editorial design was developed with huashu-design. Font hierarchy was refined with the [Apple design analysis](https://getdesign.md/apple/design-md) as a reference; the [Apple system font list](https://developer.apple.com/fonts/system-fonts/) identifies PingFang SC. This site is not affiliated with Apple or Distill.

## Checks

`scripts/check-designs.cjs` exercises the selected design using Playwright. Set `DESIGNS=editorial` to check only the selected design; `PLAYWRIGHT_MODULE` and `BROWSER_PATH` can point to an existing Playwright package and Chromium executable. It checks 1440/768/390/320px layouts, expanded publication lists, local images and anchors, keyboard disclosure controls, and content without JavaScript. Screenshots are local review artifacts.
