# plain-blog theme — context notes

## Related links (`layouts/partials/related.html`)

The `related.html` partial is included at the bottom of every single post (`_default/single.html`) and renders a "More" section with links to related content.

### Sections

1. **Next / Previous** — simple chronological prev/next links across all posts.

2. **Series** — if the post belongs to a series, lists all posts in that series in date order with a "You are here" marker on the current post.

3. **More in [Category]** — for each category the post belongs to, shows up to 2 posts preceding and 2 posts following the current post by date within that category. This gives contextually nearby posts rather than always showing the same 5 most-recent posts.

4. **More tagged [Tag]** — same logic as categories, but for tags.

### Design decisions

- Sections 3 and 4 use a date-walk approach: iterate `ByDate` over the taxonomy's pages, split into a `$before` and `$after` slice at the current page, then take `last 2 $before` and `first 2 $after`. This ensures the links are temporally close to the current post.
- Hugo's scored related-content algorithm (`RegularPages.Related`) was removed. It was unreliable for posts that have no `tags` or `keywords` front matter — those posts scored below the threshold and showed no related links at all.
- Taxonomy-based listing is explicit and predictable: any post that shares a category or tag will always appear, regardless of whether it has keywords defined.

## Post timestamps (`layouts/partials/timestamps.html`)

"Posted" is always shown from `.Date`. "Updated" is shown **only** when the front matter key `content-updated-date` is explicitly set — it is never inferred from file modification time or Hugo's `lastmod`.

To mark a post as updated, add to its front matter:
```yaml
content-updated-date: 2026-05-01
```

Hugo's internal `lastmod` cascade (`config.toml`: `lastmod = ["lastmod", ":fileModTime"]`) is left untouched — it still drives sitemap/RSS freshness. The displayed "Updated" date is fully independent of it.

The hyphenated key requires `index .Params "content-updated-date"` in templates (dot notation doesn't work for hyphenated keys). The value is parsed with `time .` to produce a `time.Time` for the `datetime` attribute and timeago rendering.

## Dark mode (`assets/plain-blog.css`, `layouts/partials/header.html`)

All colours in the stylesheet are expressed as CSS custom properties rather than hardcoded values. The variables are defined on `:root` (light mode defaults) and overridden under `[data-theme="dark"]`.

### Variables

| Variable | Light | Dark |
|---|---|---|
| `--bg` | `#fff` | `#1a1a1a` |
| `--bg-muted` | `#eee` | `#2d2d2d` |
| `--bg-subtle` | `#f8f8f8` | `#252525` |
| `--border` | `silver` | `#555` |
| `--text` | `#000` | `#ddd` |
| `--link` | `#00e` | `#7ab8f5` |
| `--link-visited` | `#551a8b` | `#c09aff` |
| `--code-color` | `#C00` | `#ff7070` |

### Theme selection logic

The `data-theme` attribute is set on `<html>` by an inline script in `<head>` (before any paint, to prevent flash of wrong theme). Priority order:

1. `localStorage` key `theme` — set when the user explicitly toggles.
2. `prefers-color-scheme: light` media query — respects the OS/browser setting.
3. Default: `dark`.

### Toggle

A tri-state segmented control (`Dark | Auto | Light`) is rendered in `#header` as `<span id="theme-control">` containing three `<button>` elements, each with a `data-value` attribute (`dark`, `auto`, `light`).

**States:**
- `Dark` / `Light` — explicit override stored in `localStorage` as `'dark'` or `'light'`.
- `Auto` — follows `prefers-color-scheme`; stored as `'auto'` in `localStorage`.

**Two attributes on `<html>`:**
- `data-theme` — the resolved theme (`'dark'` or `'light'`), used by the CSS variable overrides.
- `data-theme-pref` — the stored preference (`'dark'`, `'auto'`, or `'light'`), used by CSS to highlight the active segment.

**Init script (inline in `<head>`, runs before paint):** reads `localStorage`, defaults to `'auto'` if absent, resolves `auto` via `matchMedia('(prefers-color-scheme: light)')`, then sets both `data-theme` and `data-theme-pref` on `<html>`.

**`setThemePref(p)` (inline `<script>` after `#header`):** called by each button's `onclick`. Resolves the theme, updates both attributes, and writes to `localStorage`.

**Active state:** CSS rule `[data-theme-pref="X"] [data-value="X"]` fills the matching button with `var(--border)` background — no JS DOM manipulation needed for the visual state.

## Responsive images with lightbox (`layouts/shortcodes/img.html`, `assets/lightbox.css`, `assets/lightbox.js`, `layouts/partials/lightbox.html`)

All images in content files use the `{{< img >}}` shortcode instead of markdown `![]()` syntax or raw `<img>` tags. Images live in `/assets/img/` (not `/static/`) so Hugo's image pipeline can process them.

### Shortcode parameters

| Parameter | Required | Description |
|---|---|---|
| `src` | Yes | Path relative to `assets/`, e.g. `img/wordpress-img/Foo.jpg` |
| `alt` | No | Alt text |
| `caption` | No | Figure caption rendered below the image |
| `link` | No | If set, wraps image in a plain `<a>` to this URL instead of lightbox |

### Image processing

For non-GIF images the shortcode generates srcset variants dynamically, only for sizes **smaller than the native image width** (never upscaling). The fixed candidate widths are 480, 800, and 1200 px; any candidate ≥ the source width is skipped. The native-size original (and a native-size WebP conversion) are always included as the largest srcset entry.

- `width`/`height` on `<img>` are set from the **original** image dimensions (not a resized variant) to give the browser the correct aspect ratio for CLS prevention.
- The `sizes` attribute is capped at the native image width. The layout uses a fluid PureCSS grid (content column is 60% of viewport at XL breakpoints, no fixed-pixel cap), so `sizes` must not cap at an arbitrary pixel value like 1200px — that would cause the browser to download an undersized variant for wide monitors, resulting in blur.
  - native > 800 px → `(max-width: 600px) 480px, (max-width: 1200px) 800px, Npx` (N = native width)
  - native 481–800 px → `(max-width: 600px) 480px, Npx`
  - native ≤ 480 px → `Npx`
- The `src` fallback on `<img>` is the original file (unresized).

Examples:
- 593 px image → srcset: `480w, 593w`; sizes: `(max-width: 600px) 480px, 593px`
- 1500 px image → srcset: `480w, 800w, 1200w, 1500w`; sizes: `(max-width: 600px) 480px, (max-width: 1200px) 800px, 1500px`
- 300 px image → srcset: `300w` only; sizes: `300px`

GIFs are excluded from all resizing (served as-is) to work around a Hugo 0.159 bug where resizing animated GIFs crashes the WASM image processor (see https://github.com/gohugoio/hugo/issues/14537).

A missing `src` asset is a **build-time error** (`errorf`), not a silent failure.

### Lightbox

Clicking a non-`link` image opens a vanilla JS lightbox overlay showing the full-resolution original. The lightbox is injected unconditionally into every page via `{{ partial "lightbox.html" . }}` in `footer.html` (before `</body>`). CSS and JS are minified and fingerprinted via Hugo Pipes.

Dismiss: click backdrop, click ✕ button, or press Escape.

### Lightbox affordance cues (`assets/lightbox.css`)

Two CSS pseudo-elements on `.img-figure a` hint that images are clickable:

- `::before` — a persistent `⤢` badge pinned to the bottom-right corner, always visible (important for touch/mobile where hover doesn't exist). Fades out when the hover overlay appears.
- `::after` — on hover, a semi-transparent dark overlay fills the image with "Click to enlarge" text centred. Fades in/out with a 0.2s transition.

Both are `pointer-events: none` so they don't interfere with the click. Both are scoped to `.img-figure a.img-lightbox-trigger` so they don't appear on `link`-param images (PDF thumbnails, nav thumbnails), which use a plain `<a>` without that class.

### `link` param use cases

- Navigation thumbnails in `popular.md` — link to the post URL
- PDF diagram thumbnails (ae2_inscriber, ae2_storage, draw_voxels, excavator, grinder_scavenging, railcraft_cow_farm) — link to the PDF URL

## `[params]` in `config.toml`

`site.Author` was removed in Hugo 0.124. The site config uses `[params]` with `author` and `gaID` keys. The theme reads these as `site.Params.author` and `site.Params.gaID`.
