<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Utopia

Hack Club YSWS/hackathon website. Teens design/build 30 hours of wearable tech, then attend a 4-day hackathon in Dallas, TX (Jan 14-17).

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript (.tsx files)
- Tailwind CSS v4

## Design System

### Colors (globals.css)

| Token               | Hex       | Usage                          |
|---------------------|-----------|--------------------------------|
| `utopia-plum`       | `#2a1535` | Section backgrounds            |
| `utopia-plum-light` | `#3d2454` | Card backgrounds               |
| `utopia-cream`      | `#ede4f2` | Body text                      |
| `utopia-blush`      | `#f5ebf3` | Polaroid borders/backgrounds   |
| `utopia-highlight`  | `#e879a8` | Emphasized text, accents       |
| `utopia-accent`     | `#c084fc` | Links, underlines              |
| `utopia-caption`    | `#5c3d6e` | Subtle text, borders, icons    |

### Fonts

- **Jacques_Francois** — Serif display font for section titles and headings
- **Inter** — Sans font for body text, labels, UI elements (weights 500/600)
- **Geist / Geist_Mono** — Global sans/mono via layout.tsx

### Component Conventions

- Section wrappers: `bg-utopia-plum px-6 py-20 sm:px-10 sm:py-24 lg:px-16`
- Inner containers: `mx-auto max-w-7xl`
- Cards: `rounded-3xl bg-utopia-plum-light`
- Step labels: `Inter, text-sm font-medium tracking-[0.25em] text-utopia-cream`
- Section titles: `Jacques_Francois, text-5xl sm:text-6xl lg:text-7xl`
- Polaroid style: `border-[6px] border-utopia-blush bg-utopia-blush p-1.5 shadow-lg` with gradient or image inside `aspect-[4/5]`

## File Structure

```
app/
  layout.tsx          — Root layout, Geist fonts, metadata
  page.tsx            — Landing hero, WhatIsSection, ThreeSteps, FAQ
  globals.css         — Tailwind v4 + theme tokens
  components/
    WhatIsSection.tsx — "What is Utopia?" section with polaroid stack
    ThreeSteps.tsx    — 3-step process section
    StepCard.tsx      — Reusable card (step, title, description, polaroidGradient, polaroidImage?)
    FAQ.tsx           — Client component, accordion FAQ
src/
  images/
    LANDING_BG.jpg    — Hero background image
```

## Notes

- Do NOT modify `globals.css` colors or theme tokens without asking
- `utopia/app/page.tsx` is an older duplicate — ignore it
- RSVP link: `https://rsvp.hackclub.community/utopia`
