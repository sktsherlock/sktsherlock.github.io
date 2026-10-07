# Academic folio

## 1. Visual theme
Warm white paper, precise typography, and a restrained rust accent. Publications and real institutional photography carry the visual weight. Preserve the established anime portrait as the personal signature.

## 2. Palette
Editorial light: canvas `#fcfbf8`, ink `#272c29`, secondary `#62685f`, dividers `#dddfd6`, accent `#93472f`, quiet surface `#f0f1ea`. Editorial dark: canvas `#151916`, ink `#eceee5`, secondary `#b1b8ab`, dividers `#39433a`, accent `#e6ad8e`, quiet surface `#202820`. Existing Apple, Claude, Linear and Spotify adaptations retain their tokens. Reading text must meet 4.5:1 contrast.

## 3. Typography
Retain the intentionally selected, locally hosted Newsreader for the Latin name. Do not introduce another display family. Use the platform sans-serif stack for research titles and section headings to make long technical titles easy to scan. Keep the Noto Sans SC name subset and system Chinese body fallbacks.

| Role | Desktop | Phone | Weight |
| --- | --- | --- | --- |
| Name | 50px | 36px, 32px at minimum width | 450 |
| Section | 28px | 24px | 550 |
| Publication | 23px | 21px | 600 |
| Reading text | 16px / 1.8 | 16px / 1.8 | 400 |
| Research trajectory | 14px / 1.75 | 14px / 1.75 | 400 |
| Metadata | 12px / 1.65 | 12px / 1.65 | 400 |

CJK paragraphs use line-height 1.9 and no negative tracking. Tag official English paper titles with `lang=en` in both locales.

## 4. Components
Cardless paper rows, white uncropped figure plates, compact venue and CCF labels. Display controls use a 4px radius, photo plates 4px, and the focused personal dialog 12px. Pointer controls acknowledge a press through a small scale change. Keyboard interactions do not animate. Retain focus rings and native modal containment.

## 5. Layout
One CSS strategy: existing plain CSS, with shared reading rules in `homepage-editorial.css` loaded after the preference/theme stylesheet. No new framework or runtime library. Spacing ladder: 4/8/12/16/24/32/48/64px. A 1248px page includes responsive margins. Biography and the three-step trajectory form an asymmetric spread. All five papers share an image/text grid. Align dates and captions consistently.

## 6. Depth
Solid canvas surfaces and fine rules. No glass header or generic shadow-card system. Scientific figures retain a white surface in night mode. Figure and interest dialogs retain their focused backdrops.

## 7. Guardrails
- Preserve 14 papers, five first-author papers, ordering and CCF claims.
- Preserve bilingual content, telephone, preference persistence and both dialogs.
- Preserve real photos, logos, provenance and the old anime avatar.
- Do not invent research, metrics, training experience or biography claims.
- Avoid oversized names, tiny reading text and scroll-jacking.
- Do not truncate titles, authors or localized controls.

## 8. Responsive behavior
1000px: tighten gutters and figure column. 760px: stack the introduction and use horizontal institution entries. 540px: stack paper figures and institution photos above their copy. Verify both sides of each breakpoint, both locales, all five styles and both modes. Maintain 40px controls, reduced motion and static content without scripts.

## 9. Future editing guide
- Add a paper through `content.json`: title 23px/1.4 weight 600, venue 12px, contained white figure plate.
- Add an academic section: heading 28px/1.3 weight 550, chapter number 11px rust, 1px `#dddfd6` rule, 48px spacing.
- Compact controls: 40px minimum height, 4px radius, 13px type, 2px accent focus ring and pointer-only 0.96 press feedback.

Award-level craft is a review target, not an award claim. Judge actual screenshots, reading hierarchy, responsive behavior, accessibility and interactions before publishing.
