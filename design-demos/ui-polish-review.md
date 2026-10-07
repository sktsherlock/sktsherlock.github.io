# UI polish review

Date: 2026-10-07. Skill: `ui`. The established academic journal direction and all current features are preserved. The user's award-quality target is treated as a demanding craft benchmark, not an award certification.

## Evidence and direction
Reviewed real desktop and Chinese phone screenshots before editing. Problems: mixed serif/sans heading roles, an overly dense gray trajectory panel, uneven institutional metadata rows, undersized trajectory text, and inconsistent spacing. Followed the current site's typography, assets and palettes instead of introducing a new template. The Latin name retains its deliberate Newsreader identity; long technical titles use the platform sans-serif family. Warm white and rust remain the default palette, with a quieter dark reading surface.

## Iteration record

| Pass | Observation | Change and verification |
| --- | --- | --- |
| 1 | Technical titles and section headings competed visually; the right column read as a generic panel | Unified heading scale and paper typography, removed the filled trajectory box, aligned scientific figures with publication copy; inspected desktop, Chinese phone, campus and night screenshots |
| 2 | A research phrase and the education link broke awkwardly; trajectory descriptions repeated information | Kept the Graph–LLM phrase and education link intact, tightened bilingual trajectory copy without adding claims, retained generous link targets; inspected both languages and phone paper layouts |
| 3 | Responsive edges and keyboard behavior needed direct verification | Checked both sides of all major breakpoints, contrast including the new CCF-A badge backgrounds, pointer feedback, immediate keyboard interactions, image decoding and existing dialogs |

## Verification
- Existing editorial checks: 60 layout combinations; 900 contrast samples, minimum 4.71:1; native figure zoom, focus containment/restoration, sticky anchor offsets, no-script fallback and image decoding.
- Additional breakpoint sweep: 240 combinations across two languages, five styles, two modes and twelve widths (1280, 1001, 1000, 761, 760, 701, 700, 541, 540, 390, 375, 320px). No horizontal overflow; primary controls at least 40px.
- Additional contrast sweep: 820 samples including CCF-A badges, honor rows, contacts, paper index and research descriptions. Minimum 5.00:1.
- Preference checks: all 16 scenarios passed, including system color changes, blocked storage, saved language/theme, keyboard controls and static Chinese content.
- Personal-corner checks: 12 scenarios and 40 style combinations passed, including nine interests, filters, all five style options, persistence, undo, language changes, keyboard tabs and backdrop closing.
- Image test helpers now wait for final loaded image state after changing lazy images to eager. This avoids false reports when an initial decode candidate is replaced; actual broken assets still fail.

## Content and aesthetic audit
No new achievements, metrics, projects, research experience or preference claims. All 14 publications, five first-author papers, CCF sorting, phone, supervisors, photos and the restored anime avatar are retained. No new library, external font, generated illustration, glass surface, gradient headline or ornamental scroll effect. Existing scientific diagrams and campus photographs remain the visual anchors. Section jobs and reading hierarchy are distinct, with less ornamental chrome.

Screenshots are local review artifacts in `design-demos/screenshots/ui-*`. The design decision record is `DESIGN.md`; there is no placeholder content to replace.
