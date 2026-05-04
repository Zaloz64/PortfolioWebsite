# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Vite dev server with HMR
- `npm run build` — type-check (`tsc -b`) then production build to `dist/`
- `npm run lint` — ESLint over the repo
- `npm run preview` — serve the built `dist/` locally

There is no test runner configured.

## Architecture

Single-page React 19 + Vite + TypeScript portfolio. The entire UI lives in one component: `src/App.tsx`. Treat it as the canonical place to edit copy, sections, and layout — there is no router and no per-section component split.

Key patterns inside `App.tsx`:

- **Section-driven navigation.** `NAV_ITEMS` is the single source of truth for both the floating dock and the in-page anchors. Each entry's `id` must match the `id` of a `<section>` in the JSX. Adding a section means appending to `NAV_ITEMS` *and* rendering a matching `<section id="...">`.
- **`useActiveSection`** uses an `IntersectionObserver` (`rootMargin: '-30% 0px -50% 0px'`) to mark whichever section dominates the viewport, which drives the dock's `.active` highlight. Tweaking the rootMargin changes how "early" a section becomes active during scroll.
- **Dock visibility** is controlled by a scroll listener that hides the dock until `scrollY >= 80`. The animation is on `.dock` / `.dock.hidden` in CSS.
- **Smooth scroll** to anchors goes through `handleNav`, which `preventDefault`s and calls `scrollIntoView`. Plain `<a href="#...">` won't get the smooth behavior consistently across browsers — route new in-page links through `handleNav`.

## Styling

- `src/index.css` defines the design tokens as CSS custom properties on `:root` (`--bg`, `--ink`, `--cream`, `--display`, `--serif`, `--sans`, etc.) and sets global resets. Add new colors/fonts here, not inline.
- `src/App.css` is organized by section (Layout / Top bar / Hero / About / Works / Gallery / Contact / Dock) with `@media (max-width: 720px)` (and `600px`) breakpoints inline at the bottom of each section block. Follow that convention when adding styles rather than collecting media queries at the file end.
- Fonts (`Anton`, `Instrument Serif`, `Inter`) are loaded via Google Fonts `<link>` in `index.html`. New font families need to be added there *and* registered as a CSS variable in `index.css`.
- The project uses raw CSS — no Tailwind, no CSS-in-JS, no PostCSS plugins beyond Vite defaults.

## TypeScript / ESLint

- `tsconfig.json` is a solution file referencing `tsconfig.app.json` (app code) and `tsconfig.node.json` (Vite config). Compiler flags live in those, not the root.
- ESLint config (`eslint.config.js`) is flat-config style and extends `tseslint.configs.recommended` plus `react-hooks` and `react-refresh/vite`. It is *not* type-aware — the README documents how to upgrade to `recommendedTypeChecked` if needed.
