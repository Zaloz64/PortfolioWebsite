# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Vite dev server with HMR
- `npm run build` — type-check (`tsc -b`) then production build to `dist/`
- `npm run lint` — ESLint over the repo
- `npm run preview` — serve the built `dist/` locally

There is no test runner configured.

## Architecture

Single-page React 19 + Vite + TypeScript portfolio. **Effectively the entire UI lives in one file: `src/App.tsx`** — all sections, sub-components (`BuildingSection`, `JourneySection`, `ScallopFrame`, etc.), hooks (`useActiveSection`, `useInView`), and SVG path helpers are defined inline there. There is no router and no per-section component split. Edit copy, sections, and layout here.

> **Dead code warning:** `src/components/`, `src/hooks/`, and `src/lib/` contain earlier extracted versions (`ScallopFrame.tsx`, `useActiveSection.ts`, `scallop.ts`, `constants.ts`). **Nothing imports them** — `App.tsx` redefines all of it inline. Don't edit those expecting changes to show up; either wire them in deliberately or ignore them.

The page is a vertical scroll of sections: **Hero (`#home`) → Building (`#building`) → Journey (`#journey`) → About (`#about`) → Footer/contact (`#contact`)**.

Key patterns inside `App.tsx`:

- **Section-driven navigation.** `NAV_ITEMS` is the single source of truth for the in-page anchors rendered in the top nav. Each entry's `id` must match a `<section id="...">` (note: `#home` and `#contact` are on elements *inside* other blocks, not standalone sections). Adding a nav target means appending to `NAV_ITEMS` *and* rendering a matching `id`.
- **`useActiveSection`** uses an `IntersectionObserver` (`rootMargin: '-30% 0px -50% 0px'`) to pick whichever section dominates the viewport, driving the `.active` highlight on the top-nav links. Tweaking the rootMargin changes how "early" a section becomes active.
- **Shrinking top band, not a dock.** There is no floating dock. The hero + nav live inside `.top-band`, a fixed-height element whose height is set in JS to `max(NAV_HEIGHT, vh - scrollY)` so it collapses from full-viewport down to a compact bar (`.compact`/`.expanded`) as you scroll. `.top-band-spacer` reserves layout space below it. `NAV_HEIGHT` (72) is the shared constant for the collapsed height.
- **`handleNav` for in-page links.** Anchor clicks go through `handleNav`, which `preventDefault`s and `scrollIntoView`s — except `#home`, which scrolls to top (the hero lives in the fixed band and can't be reached by `scrollIntoView`). Route new in-page links through `handleNav`.
- **Custom scroll-snap engine** (effect in `App`): after the user is still for ~200ms *and* rests within `SNAP_THRESHOLD` px of a target (top, building top, journey center, about/footer framing), it animates a gentle snap. It bails on `wheel`/`touchstart`. This is hand-rolled, not CSS scroll-snap — adjust the constants there, not in CSS.
- **Pinned horizontal timeline** (`JourneySection`): in the expanded "full journey" view on desktop, the section is pinned (its height is inflated to `vh + horizontal overflow`) and page scroll is mapped to a `translateX` on the rail. The rail uses `overflow: clip` (not a scroll container) so the vertical wheel passes through with native momentum. Mobile falls back to native horizontal scroll.
- **SVG shape generators.** Pure functions (`buildScallopPath`, `buildFlowerPath`, `scallopOutline`, `cloudBlob`) emit SVG path `d` strings for the recurring scalloped borders, flower motif (`FLOWER_D`), and transition blobs. Components like `ScallopFrame`/`ScallopButton`/`ScallopTag` measure their box with a `ResizeObserver` and regenerate the path on resize. The flower path also powers the site-wide custom **flower cursor** (injected as a `<style>` data-URI in an `App` effect).

## Styling

- `src/index.css` defines the design tokens as CSS custom properties on `:root` (`--bg`, `--ink`, `--cream`, `--display`, `--serif`, `--sans`, etc.) and sets global resets. Add new colors/fonts here, not inline.
- `src/App.css` is organized top-to-bottom by section (Layout / Top band / Hero / Building / Journey / About / Ticker / Footer / Nav) with `@media (max-width: 720px)` (and `600px`) breakpoints inline within each section block. Follow that convention when adding styles rather than collecting media queries at the file end.
- Fonts (`Anton`, `Instrument Serif`, `Inter`) are loaded via Google Fonts `<link>` in `index.html`. New font families need to be added there *and* registered as a CSS variable in `index.css`.
- The project uses raw CSS — no Tailwind, no CSS-in-JS, no PostCSS plugins beyond Vite defaults.

## TypeScript / ESLint

- `tsconfig.json` is a solution file referencing `tsconfig.app.json` (app code) and `tsconfig.node.json` (Vite config). Compiler flags live in those, not the root.
- ESLint config (`eslint.config.js`) is flat-config style and extends `tseslint.configs.recommended` plus `react-hooks` and `react-refresh/vite`. It is *not* type-aware — the README documents how to upgrade to `recommendedTypeChecked` if needed.
