# Claude Code Handoff: August Pirraglia Portfolio

## Project

Local project path:

```text
C:\Users\apirr\Desktop\august-portfolio
```

Local preview:

```text
http://localhost:3001
```

Work locally first. Do not push to GitHub or deploy live unless August explicitly says `push`, `push to live`, or `push to GitHub`.

## What We Are Building

This is a high-end creative director portfolio landing experience for August Pirraglia.

The site should feel cinematic, bold, motion-driven, polished, and credible. The tone should sit between streetwear/creative energy and agency/professional discipline.

The audience:

- Creative agencies
- Potential employers
- Brand and marketing clients
- Film and AI advertising collaborators
- People evaluating August's creative direction, brand identity, signage, marketing, and production ability

The site should quickly communicate that August can build:

- Brand identity systems
- Creative AI film ads
- Marketing assets
- Signage
- Production-ready visual systems
- Motion-driven web experiences

## Why We Are Building It

This should not feel like a generic portfolio template. It should create a strong first impression and position August as a creative director/designer/builder with range across brand, film, signage, AI, and web.

The experience should feel premium, cinematic, and intentional. Motion should support the story, not distract from it.

## Stack

- Vite
- TypeScript
- GSAP / ScrollTrigger
- CSS

Main files:

- `src/content.ts`
- `src/render.ts`
- `src/main.ts`
- `src/styles.css`

Media added for section 2:

- `public/media/signage-artwork/artwork.mp4`
- `public/media/signage-artwork/poster.webp`

## Current Working Rule

Before major changes, explain what you will execute.

If doing a new round of implementation, first make a local checkpoint or at least clearly record the current git status. Do not push.

Run `npm run build` after changes.

Use local browser QA at `http://localhost:3001`.

## Design Rules

Keep the existing colors. Do not change the palette unless August explicitly asks.

Current visual language:

- Dark cinematic background
- Copper/orange accent
- Off-white text
- Dark navy ticker rectangle
- White/off-white nav separators
- Bold condensed display type for major words
- Editorial serif for supporting headline/tagline moments

Quality bar:

- No generic template feel
- No clutter
- Strong type hierarchy
- Smooth scroll-triggered motion
- Desktop and mobile must both look intentional
- Text must not overlap or get cut off

## Hero Section Current Intent

The hero is full-screen.

Keep the existing background artwork/video/canvas.

Keep the large bold:

```text
AUGUST PIRRAGLIA
```

`PORTFOLIO` starts offscreen right and flies into the top-left as the user scrolls. It then stays sticky in the top-left.

Top-right nav:

```text
WORK | ABOUT | CONTACT
```

Nav text should use the existing orange/copper color. Separators should stay light/off-white.

Under `AUGUST PIRRAGLIA`, the hero now has:

```text
Building Brands through Designing Identity & AI Film Advertising
```

This line should remain under the name. It was moved from section 2 into the hero. August asked to make it one font size larger than the first moved version.

`Creative Director` should be one font size larger than the original version and should remain visually secondary to the main name.

Open question for alignment:

- August answered `yes` to the transfer question, but verify whether the hero tagline should stay right-aligned under the name or become more centered under `AUGUST PIRRAGLIA`.

## Section 2 Current Intent

Focus next work on section 2.

Section 2 is the brand/signage reveal section.

Left side:

- Signage artwork/video from `public/media/signage-artwork/artwork.mp4`
- Poster at `public/media/signage-artwork/poster.webp`

Right side:

```text
$39K
of signage. The brand made it inevitable.
```

The old section 2 bottom headline:

```text
Building Brands through Designing Identity & AI Film Advertising
```

was moved into the hero.

Section 2 bottom headline should now be:

```text
Managing Creative Art Direction
```

August answered that section 2 should be the next focus.

## Section 2 Ticker / Navy Banner

There is a dark navy full-width rectangular banner near the top of section 2.

It should:

- Slide in from the right as the user scrolls into section 2
- Extend beyond both left and right viewport edges
- Have no white stroke or border
- Have a strong but tasteful shadow
- Use glowing white text
- Use the same bold display font family as the hero name
- Loop infinitely
- Read as one continuous text string, not separated chunks

Ticker text pattern:

```text
Brand Identity Design • AI Film Ads • Marketing • Signage • Brand Identity Design • AI Film Ads • Marketing • Signage ...
```

Important:

- There must be a middle dot between `Signage` and the next `Brand Identity Design`.
- There should be a little more breathing room between each word group and middle dot.
- There should not be a large blank gap at the repeat point.
- The loop boundary should feel exactly like every other separator.

Recent fix:

- Extra CSS padding between repeated ticker groups was removed.
- The repeated ticker text now uses the same separator everywhere.
- The ticker was verified to include:

```text
Signage • Brand Identity Design
```

## Sticky Label / Section Transition

Top-left `PORTFOLIO` flips/rotates on the X-axis into:

```text
BRANDS
```

This happens as the user scrolls from section 2 toward section 3.

Keep this unless August asks to change it.

## Recently Completed Work

- Hero nav label changed to `PORTFOLIO`.
- Added hidden/back face `BRANDS` for flip animation.
- Added signage artwork/video into section 2.
- Added dark navy continuous ticker banner.
- Added glow on ticker text.
- Added stronger shadow on navy banner.
- Moved `Building Brands through Designing Identity & AI Film Advertising` under the hero name.
- Replaced section 2 headline with `Managing Creative Art Direction`.
- Made hero tagline one font size larger.
- Made `Creative Director` larger than original.
- `npm run build` passed during the previous session.

## What To Do Next

1. Inspect current git status.
2. Open local preview at `http://localhost:3001`.
3. Verify hero composition:
   - `AUGUST PIRRAGLIA` still fits desktop.
   - Hero tagline sits under the name.
   - Hero tagline is one size larger than the first moved version.
   - `Creative Director` is larger but still secondary.
   - No overlap with background/progress/scroll elements.
4. Verify section 2 composition:
   - Ticker is continuous.
   - No blank gap between `Signage` and `Brand Identity Design`.
   - Dot spacing is even everywhere.
   - Ticker spans beyond both screen edges.
   - Ticker does not cover the artwork or `$39K` copy.
   - `Managing Creative Art Direction` appears in section 2.
5. Improve section 2 first:
   - Make the layout feel more intentional.
   - Balance artwork, `$39K`, ticker, and bottom headline.
   - Keep the streetwear/creative plus agency/professional balance.
6. Verify responsive layouts:
   - Desktop: 1280x900 and 1920x1080
   - Tablet: 768x1024
   - Mobile: 375x812
7. Run:

```text
npm run build
```

8. Do not push live unless August explicitly says to.

## Improvement Areas

Prioritize section 2.

Potential refinements:

- Tune vertical spacing in section 2.
- Make `Managing Creative Art Direction` feel intentional, not leftover.
- Tune ticker speed if it feels too fast or too slow.
- Tune glow strength if it feels too blurry or too bright.
- Make sure ticker does not compete too much with `$39K`.
- Make the signage video crop look deliberate.
- Check mobile hierarchy carefully.
- Make the hero tagline and `Creative Director` feel integrated under the name.

## August's Answers From Transfer Questions

Question: Should Claude Code continue from exact current files, or first make a clean checkpoint/commit locally?

Answer: `yes`

Interpretation: make a local checkpoint/status before major work. Do not push.

Question: Should the next session focus only on polishing hero + section 2, or start building section 3?

Answer: `section 2`

Question: For `Managing Creative Art Direction`, use polished wording or original phrasing?

Answer: `yes for the first`

Interpretation: use polished wording:

```text
Managing Creative Art Direction
```

Question: Should the site feel more luxury/editorial, bold streetwear/creative, or agency/professional?

Answer:

```text
both streetwear/creative and agency/professional
```

## Questions To Ask August Before Major Design Moves

Ask only if the answer affects implementation.

1. Should the hero tagline stay right-aligned under `AUGUST PIRRAGLIA`, or should it be centered under the name?
2. Should `Managing Creative Art Direction` be large/editorial or smaller/supporting?
3. Should the ticker move slowly like a premium marquee or faster like an energetic ad banner?
4. Should the ticker stay at the top of section 2, or overlap the artwork slightly?
5. Should `Creative Director` stay copper/orange, or be white with a copper accent?
6. On mobile, should the hero tagline remain visible under the name or be reduced/hidden for a cleaner hero?
7. What should section 3 showcase first: brand identity projects, AI film ads, signage work, or all three?

