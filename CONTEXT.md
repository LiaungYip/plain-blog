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

A "dark mode" / "light mode" link is rendered in `#header` alongside the nav links. Its `onclick` handler flips `data-theme`, writes to `localStorage`, and updates the link text. A second inline script immediately after the header div sets the correct initial label on page load.

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

For non-GIF images the shortcode generates three size variants (480w, 800w, 1200w) in both the original format and WebP, served via `<picture>` with a WebP `<source>` and an original-format `<img>` fallback. `loading="lazy"` and explicit `width`/`height` are set on the `<img>` to prevent CLS.

GIFs are excluded from all resizing (served as-is) to work around a Hugo 0.159 bug where resizing animated GIFs crashes the WASM image processor (see https://github.com/gohugoio/hugo/issues/14537).

A missing `src` asset is a **build-time error** (`errorf`), not a silent failure.

### Lightbox

Clicking a non-`link` image opens a vanilla JS lightbox overlay showing the full-resolution original. The lightbox is injected unconditionally into every page via `{{ partial "lightbox.html" . }}` in `footer.html` (before `</body>`). CSS and JS are minified and fingerprinted via Hugo Pipes.

Dismiss: click backdrop, click ✕ button, or press Escape.

### `link` param use cases

- Navigation thumbnails in `popular.md` — link to the post URL
- PDF diagram thumbnails (ae2_inscriber, ae2_storage, draw_voxels, excavator, grinder_scavenging, railcraft_cow_farm) — link to the PDF URL

## `[params]` in `config.toml`

`site.Author` was removed in Hugo 0.124. The site config uses `[params]` with `author` and `gaID` keys. The theme reads these as `site.Params.author` and `site.Params.gaID`.
