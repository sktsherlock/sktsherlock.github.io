# The research stage

## Concept and content

The five first-author works, from HiGCL and CAKE through CS-TAG, MAGB and MoKGNN, are the visual material. Their real figures become a fixed research display beside a readable academic record. The same frame changes to official campus/institution photographs beside education and internships, then to existing interest artwork near the end. Readers can preview a paper through the research links and open its original figure.

Preserve all 14 publications, five first-author records, CCF ordering, complete scientific titles, supervisors, dates, telephone, original anime avatar and verified sources. A short paper name is the heading; its complete official title is a citation paragraph. It is never truncated or rewritten.

## Layout

A full-width page uses 24px margins, a 36px gap and a 48/52 split above 1100px. The left frame stays within the viewport; the right column carries the biography and academic record. A screen contains real research or institutional imagery rather than empty decorative space. Below 1100px, the frame becomes inline pictures; paper names precede figures and their full citations. At 700px the header wraps into two rows, and institutional records become a vertical image/text composition.

Use one anchor inset: scroll-margin-top 104px on desktop, 128px on phones. Do not add a second scroll-padding inset. Navigation, reading position and the frame must all use the same layout after fonts/images load.

## Type and palette

Keep self-hosted Newsreader for the name and short research names. Use the system sans-serif for reading and technical citations. The Noto Sans SC two-character subset gives the Chinese name consistent glyphs; full Chinese prose uses platform fallbacks. English and Chinese names remain together, with the intentionally restrained 50px Latin / 34px Chinese desktop sizes and 36px / 26px phone sizes.

Five principal sizes: 50px display, 32px headings, 22px subheads, 16px reading, 14px metadata. Phone headings are 28px. Use full ink for running text; labels and reading text have normal sentence case.

Default light: white canvas, gray #ededed stage/surfaces, deep red #7d0c14 ink/action. Default dark: #1b1b1d canvas, #2a292c surfaces, #f3eded ink, #f0bac0 accent. Scientific figures and official organization marks retain white plates and their original colors. Optional Apple, Claude, Linear and Spotify adaptations retain their own palettes; their colors are an explicit existing user preference.

Separate sections with space or a flat tone change. Remove decorative numbering, eyebrow labels, hairlines, resting shadows, glass and invented motifs. Keep the functional reading-progress indicator as a 4px filled bar.

## Behavior and motion

The frame reads its title, image, credit, venue/date and source from existing page records; there is no second translation or publication database. It crossfades after the next image has decoded, discards old image nodes, and retains the last loaded picture if a request fails. Original figure viewing, zoom, Escape, focus restoration and photo-source navigation are preserved.

Entrances animate already-visible elements in reading order: names, copy and photographs use separate movements. A script failure never hides content. Reduced motion and keyboard input suppress travel. The frame changes with reading rather than running an unrelated autoplay slideshow.

Keep bilingual navigation and position restoration, remembered themes/styles, native dialogs, disclosures, telephone, email, keyboard controls and the no-JavaScript page.

## Editing

- Change biographical copy in design-demos/editorial.html and its matching translation in design-demos/zh-CN.json.
- Add publications in content.json. First-author thumbnails need their actual thumbnailWidth/thumbnailHeight; reserved intrinsic size prevents lazy-load scroll drift. Keep original figures untouched.
- Rebuild with node scripts/build-homepage.mjs and commit both generated language pages and homepage.css.
- Keep campus and interest sources beside the image or on the frame's source link. Source records are documented in the existing campus-assets, organization-assets and personal-assets notes.
- Review with the design-taste inspector plus check-editorial, check-preferences, check-corner and check-language-position.

The design review and limitations are documented in design-demos/taste-design-review.md. Its score is a self-assessment, not an award or external jury result.
