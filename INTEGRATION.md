# Adhi & Nidhi — Premium Banner Carousel: Integration Guide

## 1. File placement

Copy files into your existing Angular project structure like this:

```
src/app/
├── core/
│   └── services/
│       └── banner.service.ts          ← replace existing
├── models/
│   └── banner.model.ts                ← replace existing (empty file)
└── shared/ (or wherever app-banner currently lives)
    └── banner/
        ├── banner.component.ts        ← replace existing
        ├── banner.component.html      ← replace existing
        └── banner.component.scss      ← replace existing

src/assets/
├── data/
│   └── banner.json                    ← new
└── images/
    └── banners/
        ├── placeholder.svg            ← new (fallback image)
        └── (your actual banner images)

generate-banner-json.js                ← place at project root
```

The service import path (`'../../models/banner.model'`) and component import
path (`'../../core/services/banner.service'`) assume the same relative
folder depth as your uploaded files. Adjust if your actual folders differ.

## 2. Prerequisites

- `HttpClient` must be available. In a standalone bootstrap (`main.ts` /
  `app.config.ts`), make sure `provideHttpClient()` is registered:

  ```ts
  import { provideHttpClient } from '@angular/common/http';

  export const appConfig: ApplicationConfig = {
    providers: [provideHttpClient(), /* ...other providers */]
  };
  ```

- **Bootstrap Icons** are referenced (`bi bi-chevron-left`, button icons like
  `bi-calendar-check`, `bi-gem`). If you don't already load them, add to
  `angular.json` styles array or `index.html`:

  ```html
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
  ```

  Or drop the `<i>` tags from the template if you'd rather not add the
  dependency — everything else keeps working.

- Angular's built-in `@if` / `@for` control-flow syntax is used throughout
  (Angular 17+), matching your Angular 22 setup.

## 3. Populating banner.json

Two options:

**A. Hand-edit** `assets/data/banner.json` — it's a plain array matching
`Banner` in `banner.model.ts`. The sample file included has three fully
worked examples (gold, diamond, silver) showing every feature: badges,
merchandising, independent desktop/tablet/mobile positions, text/image
animation, custom button colors, etc.

**B. Auto-generate from your images folder:**

```bash
node generate-banner-json.js
```

This scans `assets/images/banners/`, and for every image without a matching
entry already in `banner.json`, appends a new entry with sane defaults
(heading derived from the filename, `Shop Now` button, gold theme, etc.) —
so you only need to fill in copy afterward. It never overwrites entries you've
already hand-edited, and it deactivates (rather than deletes) entries whose
image file has since been removed.

Naming convention the script understands:

```
diwali-gold-desktop.jpg     → primary "image"
diwali-gold-desktop-mobile.jpg → matched as that entry's "mobileImage"
```

Run with custom paths if needed:

```bash
node generate-banner-json.js --images ./src/assets/images/banners --out ./src/assets/data/banner.json
```

## 4. How positioning works (no JS width-checks)

Every position (`desktop`, `tablet`, `mobile`) is expressed as a pair of CSS
classes generated per-slide (`pos-m-*`, `pos-t-*`, `pos-d-*` +
`text-m-*`/`text-t-*`/`text-d-*`). The SCSS applies mobile rules
unconditionally, then overrides at `768px` and `992px`. This means:

- Resizing the window updates layout instantly via CSS — no `resize` JS
  listener, no reflow-triggering `window.innerWidth` reads.
- Desktop and mobile positions are genuinely independent, exactly as
  requested — a slide can be `bottom-center` on mobile and `top-right` on
  desktop with zero extra code.

## 5. Animations

- **Text** (`textAnimation` + `animationDelay` per slide): fade, slide
  (left/right/up/down), zoom, scale, blur-in, or none. Implemented as CSS
  keyframes triggered only on `.banner-slide.active`, using `transform` +
  `opacity` (GPU-accelerated, no layout thrash).
- **Image** (`imageAnimation` + `imageAnimationSpeed` per slide): zoom-in,
  zoom-out, slow-pan, ken-burns (default), fade, or none.
- **Slide transition** (`transitionEffect` per slide): `crossfade` (default,
  matches your original design), `fade`, or `slide` (the `slide` variant uses
  an inline `transform: translateX()` computed in the component, so it can
  react to direction without extra CSS classes).
- `prefers-reduced-motion: reduce` is respected in two layers: the component
  detects it via `matchMedia` and swaps animation classes to `none`/`ta-none`,
  and the SCSS has a matching media query as a hard backstop.

## 6. Behaviour / autoplay

All configurable from `DEFAULT_CAROUSEL_CONFIG` in `banner.model.ts` (or
override per-instance by editing `readonly config` in the component):

- `autoplay`, `interval`, `transitionDuration`, `transitionTimingFunction`
- `pauseOnHover`, `pauseOnTouch`, `pauseOnFocus`, `pauseOnHiddenTab`
  (tab visibility uses the `visibilitychange` event)
- `enableKeyboard` (Arrow Left/Right, Home, End — bound to the carousel's own
  focus, not the whole window, so it won't hijack keystrokes elsewhere on the
  page)
- `enableMouseWheel` (debounced, only fires on clearly horizontal-or-strong
  wheel intent)
- `enableTouchSwipe` / `enableDrag` (unified via Pointer Events, so the same
  code path handles touch swipe and mouse drag)
- Autoplay also pauses automatically whenever the carousel scrolls out of the
  viewport (`IntersectionObserver`), so it never runs invisibly in the
  background.

## 7. Accessibility

- `role="region"`, `aria-roledescription="carousel"` on the host.
- Each slide is `role="group"` / `aria-roledescription="slide"` with a
  descriptive `aria-label`.
- Dots use `role="tab"` + `aria-selected`.
- A visually-hidden `aria-live="polite"` element announces the current slide
  to screen readers on every transition.
- Full keyboard support; visible focus ring via `:focus-visible`.
- First slide's `<h1>`, subsequent slides use `<h2>` — keeps a single `<h1>`
  per page for SEO/semantics even though multiple slides render `.heading`.

## 8. SEO

- `seoTitle` / `seoDescription` are included per-slide in the JSON schema so
  you can wire them into `Meta`/`Title` services if a banner ever becomes a
  dedicated landing page, or into JSON-LD (e.g. `ItemList` of `Product` /
  `Offer`) at the page level.
- Meaningful `alt` text is required per slide; the service auto-fills a
  fallback (`heading`) if omitted, so alt text is never empty.

## 9. Performance notes

- `ChangeDetectionStrategy.OnPush` + Signals throughout — no zone-driven
  polling.
- First slide (`priority: true` in JSON) loads eagerly with
  `fetchpriority="high"`; every other slide uses native `loading="lazy"`.
- Animations only ever touch `transform` and `opacity` (plus `filter: blur`
  for the blur-in text variant) — no `top`/`left`/`width` animation, so the
  browser never has to reflow.
- `trackBy` uses `banner.id`, not array index, so reordering `banner.json`
  doesn't force full re-renders.

## 10. Extending later (no breaking changes required)

`Banner.mediaType` already exists (`'image' | 'video' | 'youtube' | 'lottie'`)
as an unused-for-now discriminator. When you're ready to add video or Lottie
slides: branch on `banner.mediaType` in the template's `<picture>` block to
render a `<video>`/embed instead, and add a matching case in
`imageAnimationClass()` if needed — the carousel shell, navigation, autoplay,
and position system all stay exactly as they are.

Countdown timers, seasonal campaigns, and API-driven data all fit the same
way: they're just additional optional fields on `Banner`, or a different
`loadBanners()` implementation in `BannerService` (e.g. swap the `HttpClient`
call for a real backend endpoint) — the component never needs to change.
