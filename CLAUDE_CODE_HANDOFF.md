# HANDOFF - August Pirraglia Creative-Director Portfolio

You are picking up an in-progress, high-end personal portfolio site. Read this fully before touching anything, then inspect the repo and confirm you understand the architecture.

## What This Is

A single-page, scroll-driven "scroll film" portfolio for August Pirraglia, a creative director / graphic designer working across brand identity, AI film advertising, print/signage, packaging, and shipped software.

There is also a dedicated second page, "Leveraging AI," about custom AI tools August built for Adobe Illustrator.

Aesthetic:

- Cinematic
- Editorial
- Analog-warm
- Dark charcoal + copper palette
- One intentionally light cream/beige selected-work section
- Streetwear/creative energy balanced with agency/professional discipline

## Who It's For / Why

Primary goal: land August a full-time Creative Director role.

Audience:

- Hiring managers
- Recruiters
- Creative leads at brands and agencies

Every decision should serve this question:

```text
Would this make a hiring manager take August seriously and reach out?
```

The site should prove range and taste across brand, film, build, AI, signage, and production.

Current live URL:

```text
https://augdog214.github.io/august-portfolio/
```

Keep the GitHub Pages URL for now. No custom domain yet.

## Scope

This build is not feature-complete. More sections and projects are still coming.

Keep the architecture expansion-friendly.

Add a project by adding:

- One entry in `src/content.ts` under `projects.items`
- Optimized assets in `public/media/projects/<slug>/`
- Avoid touching unrelated layers unless the project needs a new behavior

Add a section by adding:

- Data in `src/content.ts`
- Markup in `src/render.ts`
- An init function in `src/main.ts`
- Styles in `src/styles.css`

Pinned ScrollTriggers are load-bearing. Init scroll/pin functions in the same order their sections appear in the DOM, or pin spacers can stack wrong and sections can paint over each other.

Keep the layers separate:

- Copy/data in `content.ts`
- Markup in `render.ts`
- Motion in `main.ts`
- Style in `styles.css`

## Tech Stack & Architecture

- Vite
- TypeScript
- GSAP with ScrollTrigger
- No framework
- No templates

Core files:

- `src/content.ts` - all copy and data, single source of truth
- `src/render.ts` - one large template string injected into `#app`
- `src/main.ts` - GSAP timelines, pinned ScrollTriggers, and motion behavior
- `src/styles.css` - styles and CSS custom-property design tokens
- `src/urls.ts` - `resolvePublicUrl()`, handles GitHub Pages base path

Multi-page build:

- `index.html`
- `leveraging-ai.html`
- `src/leveraging-ai.ts`
- `src/leveraging-ai.css`
- `vite.config.ts` has `rollupOptions.input` and `base: './'`

Assets live in `public/`.

Always resolve public assets with `resolvePublicUrl`. Do not hardcode `/`.

Helper:

```ts
pinDistance(n) => `+=${n * innerHeight}`
```

Use it for pin lengths.

## Sections

DOM order lives in `src/render.ts`. Pin/init order in `src/main.ts` must match this order.

1. Hero
   - Name: `AUGUST PIRRAGLIA`
   - Tagline
   - Background is a 188-frame WebP sequence from "Astro Fool's Hopper"
   - Frames scrub onto a canvas through the hero pin

2. Reveal
   - `$39K of signage` editorial moment
   - Signage video
   - Copper rule

3. Projects
   - Big recent build
   - ORYZO-style fixed-frame project carousel
   - Light cream/beige selected-work section

4. Horizontal Flow / Work
   - Brand panel with `$39K` / FASTSIGNS metrics
   - Film panel with "Astro Fool's Hopper"
   - Horizontal-scroll pinned

5. Final Flow
   - Iris transition
   - Build / About, "ships-as-software"
   - Meta, "you're reading this on it"
   - Contact footer with email, LinkedIn, resume PDF

## Section 3 - Project Carousel

This is the most recent and most complex section.

Reference behavior: ORYZO-style fixed-frame carousel, inspired by `oryzo.ai`.

Core behavior:

- Light/cream theme
- Stationary center frame
- Project covers play/transition inside the fixed frame
- Cards do not move
- Thumbnail filmstrip slides on either side
- Each cover passes through the fixed frame

Image/video treatment:

- Fit + blurred backdrop
- Main cover uses `object-fit: contain`
- Blurred copy fills the frame behind it
- Mixed aspect ratios should never crop badly

Controls:

- Auto-advances with a progress bar
- Auto-advance animates scroll within the pin so the page does not visibly move
- Scroll-scrub also controls it
- Clicking a thumbnail works
- Hover pauses

Loop behavior:

- Whole set loops twice before the pin releases
- `cycles = 2`
- Position range: `0..cycles * count`
- Pin length: `pinDistance(4 * cycles)`

Video behavior:

- Cover videos autoplay muted, because browsers require muted autoplay
- Include an unmute toggle
- The "View Project" full-screen viewer plays media with full audio and controls

Visual rules:

- Covers have no text labels
- Identity lives in the editorial title and the translucent frosted glass panel on the right
- Keep the right frosted glass panel translucent

Projects currently in `content.ts` under `projects.items`:

- Signage, video
- Astro Fool's Hopper, 4-scene montage video
- Gap City Media, promo video
- Kababz: Menu, cycles both menu pages on the card via `slides`, page 2 first
- Art Posters, Gateway-to-Mars video, AntiDesign poster in viewer
- Rage Energy Drink, cans image

Gap City note:

- Gap City includes logo + left-to-right panning banner in viewer
- "Faded Jays" is a Gap City client folded into this project

Section 2 -> 3 transition:

- Scroll-scrubbed gradient veil
- Class: `.projects-veil`
- Dark at the top edge, clear over beige
- Cross-fades beige in so there is no color collision with the dark section above

## Design Tokens

CSS custom properties live in `src/styles.css`.

Dark theme:

- `--bg` around `#141416`
- `--cop` copper `#c77a3c`
- `--font-display`
- `--font-editorial`
- `--font-mono`

Light Section 3:

- `--p-bg` `#f1ebe0`
- `--p-fg` `#1b1714`
- `--p-dim` `#6f655a`
- `--p-cop` `#9a5520`

Important:

Do not use bright `--cop` on the light section. It fails contrast. Use `--p-cop` for WCAG AA contrast on cream.

## Current State / Where We Left Off

The portfolio is deployed live to GitHub Pages.

Repo:

```text
AugDog214/august-portfolio
```

Branch:

```text
main
```

Deploy workflow:

```text
.github/workflows/deploy-pages.yml
```

The workflow builds with:

```text
npm run build
```

and deploys to GitHub Pages.

Live URL:

```text
https://augdog214.github.io/august-portfolio/
```

Everything listed above is built, QA'd across desktop/tablet/mobile, and committed.

Last known commit:

```text
Smooth the Section 2 -> 3 transition
```

A full 7-phase audit passed:

- Build
- Runtime
- Functional
- Responsive
- Accessibility
- SEO
- Performance

Contact email was fixed to:

```text
apirr47@gmail.com
```

Canonical tags and JSON-LD were added to both pages.

## What's Next

1. Leveraging AI page real content

August will send the real tool details soon. Until then, keep the `aiPage` object in `src/leveraging-ai.ts` as placeholder content.

When real details arrive, edit:

```text
src/leveraging-ai.ts
```

Specifically update the `aiPage` object:

- Kicker
- Headline
- Lead
- Design pillar/tool card
- Speed pillar/tool card
- Printing pillar/tool card

Do not invent tool specifics.

2. Social share image

`og:image` is currently an SVG. Facebook, LinkedIn, and X may not render it reliably.

Produce a 1200x630 PNG or JPG share card and wire it into both pages:

- `index.html`
- `leveraging-ai.html`

Update both Open Graph and Twitter image tags.

3. Optional Gap City video trim

Gap City cover video is currently around 11MB / 35 seconds.

Optional improvement:

- Trim to around 15 seconds
- Keep the strongest motion/content
- Optimize file size

## What To Improve

Performance:

- Hero currently preloads about 12MB of frames upfront
- Fine on desktop, heavy on slow mobile
- Consider progressive loading or every-Nth frame loading

Fonts:

- Google Fonts are currently external
- Consider self-hosting for privacy and speed

Reduced motion:

- Horizontal "film" panel may be hidden when motion is off
- Pre-existing scroll-film limitation
- Make all content reachable with reduced motion enabled

Light section:

- Keep auditing contrast and focus states if adding UI on the light Section 3

## Working Agreements

- Develop locally
- Run local dev server on port 3001 when working:

```text
npm run dev
```

- Do not push/deploy unless August explicitly says `push`, `push live`, or `push to GitHub`
- A push to `main` auto-deploys
- QA in a browser before claiming done
- Use the gstack `/browse` skill for headless QA
- Never use `mcp__claude-in-chrome__*` tools
- Make a checkpoint git commit before major work
- Use small, descriptive commits
- Keep the dark/copper palette unless told otherwise
- Section 3 is the one intentionally light section
- Keep the right frosted glass panel translucent
- Keep the content/render/motion/style layers separate
- Verify `npm run build` is clean before finishing

## First Steps For The New Agent

1. Install dependencies if needed:

```text
npm install
```

2. Start local server:

```text
npm run dev
```

3. Open:

```text
http://localhost:3001
```

4. Scroll the whole page.

5. Read these top-to-bottom:

- `src/content.ts`
- `src/render.ts`
- `src/main.ts`
- `src/styles.css`
- `src/leveraging-ai.ts`
- `src/leveraging-ai.css`
- `src/urls.ts`
- `vite.config.ts`

6. Confirm:

```text
npm run build
```

passes.

7. Ask August for the real Leveraging AI tool details before writing that page content.

## August's Confirmed Answers

Primary conversion goal:

```text
Full-time creative director role
```

Where the site should live:

```text
Keep GitHub Pages URL
```

Feature completeness:

```text
More sections/projects coming
```

Leveraging AI content plan:

```text
August will send real details soon
```

Tone:

```text
Streetwear/creative and agency/professional
```

## Questions To Ask August Before Major New Work

Ask only when the answer affects implementation.

1. What are the real names/descriptions of the Design, Speed, and Printing AI tools?
2. Which industries or companies should this portfolio appeal to most for full-time creative director roles?
3. What new section should come next after the existing project carousel?
4. What new projects should be added first?
5. Should the Leveraging AI page feel more technical/product-focused or more creative-director/story-focused?
6. Should any live work be hidden behind a private case-study viewer, or is everything public?
7. Is the resume PDF final, or should the site link to a newer version?


## Update — Content Pass (Sept 2026, local only, not pushed)

- Each project in `projects.items` now has `client` and `caseStudy` (labelled sections). Copy was pulled from August's original portfolio (riff-graphics.myportfolio.com) and tightened. Signage and Gap City had no original write-up, so their copy is built only from facts already on the site; August should expand them.
- The View Project viewer renders a full case study: intro, meta (Client / Role / Year / Tools), cover, copy blocks interleaved with gallery images (with `caption`), and a text-only Next Project link. Paging inside the viewer syncs the carousel on close (`pf:goto`).
- New normal-flow About section (`#about`) between Meta and Contact. Build section id is now `#build`.
- Feature 01 uses the Belamo signage image; Feature 02 plays the Astro film (`data-film-video`, plays only while the horizontal pin is active).
- Iris pin shortened from 8 to 3 viewport heights.
- Share image is now `public/social/august-portfolio-social.jpg` (1200x630).
- Brand name fixed: Kebabz Heaven (the asset folder is still `media/projects/kababz/`).

## Update — Transitions, glows, resume stats (Sept 2026, pushed live)

- $39K reveal pin is 2.5 viewports: content arrives during a 0.65 pre-roll, holds on clean charcoal, lifts out, then the cream wash rises. Selected Work overlaps the last viewport of that pin (`marginTop = -innerHeight`, set in `initReveal` on every refresh) and rises OVER the finished wash — same cream, so no seam. Entry: `.projects-inner` rides a sine.in lag so the card glides to the true centre first, title fades in, then the brief panel swings up from the bottom while card + title ease left.
- Nav switches to `.nav--light` over the cream section (`navTheme` flags from the reveal wash + a projects trigger).
- `.section-dusk` gradient between Selected Work and Brand. Iris opens once (pin 2). Build/Meta content arrives while scrolling in.
- Glows use eased multi-stop radial gradients + `mix-blend-mode: screen` with slow drift; grain is SVG fractal noise.
- Brand panel shows the full Belamo photo at natural ratio, extended 8vw under the copy column, with an eased mask feather.
- Metrics, Signage/Gap City case studies, About facts and the Leveraging AI page use figures from `Resume new 3-27.pdf` (June 2026), which is also the hosted resume PDF now.

## Update — Leveraging AI showcase + seam fixes (Sept 2026, local only, not pushed)

- The iris section is gone. A new pinned **Leveraging AI showcase** (`#ai`, `[data-ai-show]`, `initAiShowcase`) sits right after Selected Work (projects → section-dusk → ai-show → horiz-flow). Data lives in `portfolioContent.aiShowcase` (`aiShowcaseItems` in `content.ts`, 7 builds, media in `public/media/ai/`).
  - Headline "From drawn notes, mock-ups, to working systems." rises in large and centred, then at pin +0.14vh each word flies (time-based, expo.out, 85ms stagger) to its final place at the top; scrolling back reverses it. Start positions are measured per line from the words' untransformed layout (`offsetLeft/Top`) and re-measured on every refresh.
  - Then the info column (left, Brand-panel styling) and the framed media (right) arrive; the photo opens out of its bottom-left corner, where a CSS flare sits (core + conic rays + diagonal beam + streak, screen blend). Copper corner bracket + dash on the top-left.
  - One build per 0.55vh of pinned scroll; items/media crossfade with CSS transitions. Ticks are clickable (scroll to that build). Videos play only while the section is on screen.
  - Triggers after the pin use absolute positions read off `pin.start` (a trigger on the pinned element created after its own pin gets pushed past the pin distance otherwise).
  - Reduced motion: no pin/flight; ticks switch builds directly.
  - Macarena's Kitchen is currently a closure page live, so its image is a screenshot of the pre-closure site (commit dfe9142 of the site repo).
- Horizontal Brand → Film: panels are transparent over the section charcoal and the film glow sits on an oversized `::before` — no vertical seam. Copy blocks cancel most of the track motion and crossfade in place (no clipping at the viewport edge). Distance is measured from panel layout, not `scrollWidth`.
- Hero bottom fade now eases to solid charcoal (no hard line when the pin releases). The $39K ticker banner has an eased horizontal feather (bar, cast shadow, text) and drifts in 16vw instead of sliding across the whole screen.

## Update — Smooth scroll, Orion Node Studio, AI headline (Sept 2026, local only, not pushed)

- **Lenis** smooth scrolling is on (`lenis` dependency, wired to the GSAP ticker + `ScrollTrigger.update`; off for reduced motion). Programmatic scrolls go through `scrollToY()`. The case-study viewer stops Lenis while open and its scroll area has `data-lenis-prevent`.
- The Selected Work entry timeline is now `scrub: true`. It counters the scroll (card holds near centre while the section rises), and the old 0.6s scrub lag made the card and brief panel jump up then drift back down on every wheel notch. Checked with a wheel-scroll test: 0 direction reversals.
- New AI build 02: **Orion Node Studio** (`media/ai/orion-node-studio.webp`, the Pool & Landscape Design Visualization preset). Also added to the Leveraging AI page under a Tools pillar. The showcase now has 8 builds.
- AI headline sits top-right, right-aligned, with a copper edge rule that draws down after the words land. Corner flare is smaller/dimmer, the section lets it spill past its bottom edge (`z-index: 2; overflow-y: visible`), and it fades out as the section leaves.
- Grain opacity 0.11 → 0.16.
- Note: this PC's shell has `NODE_ENV=production`, so a plain `npm install` drops devDependencies. Use `npm install --include=dev`.
