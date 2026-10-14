# Historical design experiment, 14 October 2026

This split-stage experiment was retired at the user’s request. Production returned to the previous editorial design with subtle motion. See DESIGN.md for the current direction.

## Brief, inventory and argument

Audience: researchers, possible supervisors, collaborators and algorithm-team recruiters. After the first screen, a reader should know who Hao Yan is, where he studies and how to inspect his work. The primary action opens the research section.

Subject inventory: the bilingual name 颜浩 / Hao Yan; the English name Sherirto; original anime portrait; CSU combined graduate study; HFUT mathematics background; PolyU joint supervision by Chengqi Zhang and additional supervision by Shirui Pan; Senzhang Wang's supervision; two distinct Microsoft internships; five first-author works HiGCL, CAKE, CS-TAG, MAGB and MoKGNN; the progression from sparse labels to attributed graphs and Graph–LLM; 14 publication records; favorite animation, music and games supplied in the conversation.

Argument and proof:

- Identity and research direction: complete biography, supervisors and expected June 2027 graduation, with MAGB's real Figure 1 beside the introduction.
- Research evidence: five first-author works with their untouched figures, complete citations and real paper/code links.
- Collaboration: nine additional publications, with year and CCF ordering retained.
- Education and experience: actual dates, affiliations, roles, official campus photographs, logos and source links.
- Academic contribution and recognition: separate reviewer service and complete honors.
- Personality and contact: the user's original interest artwork, native personal corner, public telephone, email and GitHub.

The full pre-edit copy deck was saved locally in .taste-skill/copy-deck-before.txt. No research claims, author names or paper titles were invented.

## Direction and decisions

Dealt direction: **The split stage**, seed **146532596**, personal-portfolio / editorial, type retained from the established identity. The other options were the name-as-monument and pinned-poster; their oversized names conflict with the user's earlier preference.

Idea: **On this page, Hao Yan's particular sequence of five graph-learning papers becomes a fixed, changing research display beside the full academic record.** A different researcher's work would require different images, citations and progression.

Live thing: research-index and trajectory links preview the matching real figure, and the frame opens that figure in the existing zoomable native viewer. Native anchors and inline figures provide the static and phone fallback.

Three redraws were recorded by the draw script:

- Hero: the awning/stripe blueprint assumed a client-specific striped artifact that this researcher does not have. The redrawn inset-picture geometry supplies the fixed half. The existing name scale and bilingual identity take precedence over the blueprint's oversized crossing wordmark; text does not overlap figures.
- Palette: cobalt on sand conflicts with the user's white academic-page preference. The redrawn oxblood/gray palette supplies the ink and surface relationship; white remains the reading ground as requested.
- Gallery: replace the uncaptioned, clipped drag row with **Photo tiles with label strips**, because the actual favorite works need readable names, sources and a phone layout without sideways clipping.

## Screenshot critique

ROUND 1
Seen in one second: MAGB's graph and bird figure, next to Hao Yan's bilingual identity.
Idea (one sentence): the author's own research figures carry the fixed visual half of his academic record.
Live thing: inspect an original research figure and preview papers from their links.
Layout words by section: hero=split / research=index / collaboration=citation list / institutions=active photograph / service=type on a field / honors=list / interests=captioned gallery.
Scores: design 7.4 · usability 7.8 · creativity 7.3 · content 9.0 → arithmetic 7.64, capped 6.0.
Caps applied: inspector FAIL for small links directly above subsequent headings.
Top three problems:
1. The primary action and final biography link looked like labels above headings (desktop-fold and phone-fold). Remove the redundant About heading and duplicate background link.
2. The phone identity did not state the institution until after its research image (mobile-fold). Add CSU to the existing Ph.D. role line.
3. Figure frames moved, while section entrances were too short for the recorded review to show their choreography. Use visible CSS entrances for names, copy and photos with distinct timings.

ROUND 2
Seen in one second: a research specimen and a clearly named CSU doctoral researcher.
Idea (one sentence): actual scientific output forms the academic page's recurring frame.
Live thing: the original-figure viewer, with contextual previews.
Layout words by section: hero=split / research=specimens / collaboration=list / institutions=photograph / service=field / honors=list / interests=gallery.
Scores: design 7.8 · usability 8.0 · creativity 7.5 · content 9.0 → arithmetic 7.87, capped 6.0.
Caps applied: inspector FAIL for figure captions/actions directly above short paper headings on phones.
Top three problems:
1. On tablet and phone, a figure caption preceded the short paper name (mobile-page-01). Put the short name before its figure; keep the complete citation afterward.
2. Lazy-loaded scientific thumbnails had no reserved intrinsic dimensions, causing position restoration to drift after loading. Record measured image dimensions and render width/height attributes.
3. Preserve complete scientific titles at reading size rather than trying to shorten them into two-line promotional headlines.

ROUND 3, final
Seen in one second: the author's research output and bilingual identity.
Idea (one sentence): HiGCL/CAKE, CS-TAG/MAGB and MoKGNN supply a visual academic record specific to this author.
Live thing: real-figure preview and zoom, with native-link fallbacks.
Layout words by section: hero=split / research=specimens / collaboration=citations / education=active photograph / service=type field / honors=readable list / interests=captioned prints / footer=single closing field.
Scores: design 7.8 · usability 8.3 · creativity 7.5 · content 9.0 → overall **7.96/10**.
Caps applied: none after final inspector corrections.
Top three remaining limitations:
1. The complete academic record is long, especially on a phone. All requested papers and factual details remain readable rather than hidden to shorten the page.
2. A fixed preview intentionally remains during a long introduction and collaborative list; the inspector warns long-pin. This is the selected split-stage behavior, while each first-author paper and institution changes the picture.
3. The Chinese name needs a Chinese glyph family alongside the Latin signature, and no researcher-owned video clip was supplied. These produce mixed-font-headline and no-footage warnings; both are deliberate exceptions.

This is an internal screenshot assessment. It is not an Awwwards, Webby or FWA award claim. Final measurements had no FAILs; all three retained WARNs are explained above.

## Assets, attribution and motion

All images are reused from the existing project. Scientific figures remain unaltered, including MAGB Figure 1 from arXiv v2. Existing official CSU, PolyU, HFUT and Microsoft photographs retain their original source links on the fixed frame and inline phone captions. See campus-assets.md, organization-assets.md, kdd-figure-notes.md and personal-assets.md for the existing provenance. No bundled stock photographs or sample biographical content were used.

Motion changes the real frame in response to the reader, and entrances begin with visible content. It never creates a hidden blank section. Reduced-motion and keyboard users get immediate content. Testing also caught and fixed a variable collision between the research frame and figure viewer, and removed a double-counted anchor inset that prevented navigation from activating the target section.

## Verification

- Design-taste source lint: 0 FAIL. Retained copy WARNs are an official paper title containing “Unleash” and punctuation in metadata, not rewritten marketing copy.
- Real-browser inspector: desktop 1440, tablet 768, phone 390; no FAILs, no page errors, complete figures and no horizontal overflow.
- Language reading-position suite: 50 checks passed, including both directions, stale hashes, blocked storage, keyboard, collapsed publications, Back/Forward and page boundaries.
- Preference suite: 16 scenarios passed; 14 publications and five first-author papers preserved.
- Personal corner: 12 scenarios and 40 style combinations passed.
- Editorial suite and final publishing checks: recorded after completion below.

Final completion: editorial suite passed 60 language/style/theme/layout combinations with 680 contrast samples (minimum 10.85:1). Native zoom, Escape, focus return, contextual photo sources, complete titles, anchors, static fallback and browser error checks passed. Two consecutive builds produced identical output; both language wrappers were balanced, syntax and diff checks passed.
