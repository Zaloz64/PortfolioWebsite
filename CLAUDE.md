# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Vite dev server with HMR
- `npm run build` — type-check (`tsc -b`) then production build to `dist/`
- `npm run lint` — ESLint over the repo
- `npm run preview` — serve the built `dist/` locally

There is no test runner configured.

## Architecture

React 19 + Vite + TypeScript portfolio. The UI is split across a few files:

- **`src/App.tsx`** — the shell + a tiny hand-rolled router. It tracks a `Route` (`'home' | 'work'`) from `window.location.pathname`, syncs it with `pushState`/`popstate`, owns scroll restoration (saved home scroll vs. a `pendingSection` to jump to), and hosts the site-wide **flower cursor** effect and page-grain layer. It renders either `<Home>` or `<WorkPage>`.
- **`src/Home.tsx`** — the scrolling landing page: the shrinking top band, the section stack, the scroll-position/`vh` state, and the custom scroll-snap engine. All the scroll listeners live here so they don't run on `/work`.
- **`src/WorkPage.tsx`** — the full "everything I've made" archive at `/work`: sticky nav bar, filter chips, bento grid, and the shared detail modal.
- **`src/sections/`** — one file per landing section: `Hero`, `Building`, `Journey`, `About`, `Footer`.
- **`src/components/`** — shared pieces: `SiteNav` (top nav, used by both pages), `ScallopFrame`, `WorkModal`.
- **`src/hooks.ts`** — `useActiveSection`, `useInView`.
- **`src/lib/`** — `constants.ts` (`NAV_ITEMS`, `NAV_HEIGHT`), `svg.ts` (path helpers + `FLOWER_D`), `work.ts` (archive data + categories).

The landing page is a vertical scroll of sections: **Hero (`#home`) → Building (`#building`) → Journey (`#journey`) → About (`#about`) → Footer/contact (`#contact`)**.

Key patterns:

- **Two routes, shared nav.** `App` swaps `<Home>`/`<WorkPage>` on a `Route`. `SiteNav` is rendered by both: on Home it sits inside the top band and scrolls in-page; on Work it sits in a sticky `.work-topbar` and routes home first. Clicking a section from `/work` goes through `goHomeSection(id)`, which stashes `id` in `pendingSection` and navigates home; the route `useLayoutEffect` then scrolls there (instant) instead of restoring the saved scroll.
- **Building nav dropdown.** In `SiteNav`, the `building` entry is a trigger that **navigates to the building section on click**, plus a hover/focus-within popout menu (`.topnav-menu`, revealed by CSS — no JS open state) offering *Everything I've made →* (the `/work` page). On mobile it flattens into the burger panel (menu shown inline). A transparent `::before` bridge keeps the hover alive across the gap.
- **Section-driven navigation.** `NAV_ITEMS` (in `src/lib/constants.ts`) is the single source of truth for the top-nav anchors. Each `id` must match a rendered `<section id="...">` (note: `#home` and `#contact` are on elements *inside* other blocks, not standalone sections). Adding a nav target means appending to `NAV_ITEMS` *and* rendering a matching `id`.
- **`useActiveSection`** (in `src/hooks.ts`) uses an `IntersectionObserver` (`rootMargin: '-30% 0px -50% 0px'`) to pick whichever section dominates the viewport, driving the `.active` highlight. Only Home passes it the section list; Work marks the building entry active via `isWork`.
- **Shrinking top band, not a dock.** The hero + nav live inside `.top-band` (in `Home`), whose height is set in JS to `max(NAV_HEIGHT, vh - scrollY)` so it collapses from full-viewport to a compact bar (`.compact`/`.expanded`) as you scroll. `.top-band-spacer` reserves layout space below it. `NAV_HEIGHT` (72) is the shared constant for the collapsed height.
- **In-page scroll.** `Home`'s `scrollToSection` `scrollIntoView`s a section — except `#home`, which scrolls to top (the hero lives in the fixed band and can't be reached by `scrollIntoView`). The Hero's anchors use the event-based `handleNav` wrapper.
- **Custom scroll-snap engine** (effect in `Home`): after the user is still for ~200ms *and* rests within `SNAP_THRESHOLD` px of a target (top, building top, journey center, about/footer framing), it animates a gentle snap. It bails on `wheel`/`touchstart`. Hand-rolled, not CSS scroll-snap — adjust the constants there, not in CSS.
- **Pinned horizontal timeline** (`sections/Journey.tsx`): in the expanded "full journey" view on desktop, the section is pinned (height inflated to `vh + horizontal overflow`) and page scroll is mapped to a `translateX` on the rail. The rail uses `overflow: clip` (not a scroll container) so the vertical wheel passes through with native momentum. Mobile falls back to native horizontal scroll.
- **SVG shape generators** (`src/lib/svg.ts`). Pure functions emit SVG path `d` strings for the scalloped borders, flower motif (`FLOWER_D`), and transition blobs. `ScallopFrame` measures its box with a `ResizeObserver` and regenerates the path on resize. `FLOWER_D` also powers the site-wide custom **flower cursor** (injected as a `<style>` data-URI in an `App` effect).

## Styling

- `src/index.css` defines the design tokens as CSS custom properties on `:root` (`--bg`, `--ink`, `--cream`, `--display`, `--serif`, `--sans`, etc.) and sets global resets. Add new colors/fonts here, not inline.
- `src/App.css` is organized top-to-bottom by section (Layout / Top band / Hero / Building / Journey / About / Ticker / Footer / Nav) with `@media (max-width: 720px)` (and `600px`) breakpoints inline within each section block. Follow that convention when adding styles rather than collecting media queries at the file end.
- Fonts (`Anton`, `Instrument Serif`, `Inter`) are loaded via Google Fonts `<link>` in `index.html`. New font families need to be added there *and* registered as a CSS variable in `index.css`.
- The project uses raw CSS — no Tailwind, no CSS-in-JS, no PostCSS plugins beyond Vite defaults.

## TypeScript / ESLint

- `tsconfig.json` is a solution file referencing `tsconfig.app.json` (app code) and `tsconfig.node.json` (Vite config). Compiler flags live in those, not the root.
- ESLint config (`eslint.config.js`) is flat-config style and extends `tseslint.configs.recommended` plus `react-hooks` and `react-refresh/vite`. It is *not* type-aware — the README documents how to upgrade to `recommendedTypeChecked` if needed.
