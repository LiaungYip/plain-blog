# plain-blog

    minimal theme
    puts your content first
    refridgerator

See a live example at my website, [penwatch.net](//penwatch.net/).

Inspired by [qntm.org](//qntm.org) and [gizak/nofancy](https://github.com/gizak/nofancy).

Looking for a Hugo documentation theme with a similar focus on minimal functionality? Try [`plain-docs`](//github.com/LiaungYip/plain-docs/).

## Screenshots

![](https://raw.githubusercontent.com/LiaungYip/plain-blog/master/images/tn.png)

![](https://raw.githubusercontent.com/LiaungYip/plain-blog/master/images/screenshot.png)

## Features

* Pages load FAST FAST FAST. (First page overhead: ≈40 kB. Subsequent page overhead: ≈3 kB.)
* Responsive - looks great on desktop or mobile.
* High contrast - black text, on a white background, with blue links.
* Minimal Javascript. Hardly cares if JS is disabled.
* Supports your choice of taxonomies: categories, or tags, or series, or all three at once.
* Google Analytics.
* Top and bottom menus.
* Printable - headers, footers, and menus disappear when you hit the "Print" button.
* Table of contents - use `show_table_of_contents = "true"` in front matter.
* Hugo Pipes is used to fetch third-party CSS and JS dependencies at the time you build the website, avoiding use of third-party CDN's. (See https://github.com/gohugoio/hugoThemes/issues/668 .)
* Supports math using KaTeX - `$ x = \frac{-b\pm\sqrt{b^2-4ac}}{2a} $` -  use `math = "true"` in front matter. (Note: Uses third party CDN - for now.)
* [Example site available](https://github.com/LiaungYip/plain-blog-example) - `config.toml` and basic pages ready to go.

## Things omitted

My goal is to load the first page in 50kB or less.

That means I've left out anything that wasn't needed. Some things I omitted include:

* jQuery (30kB compressed)
* highlight.js (100kB compressed) - use Pygments for [server-side highlighting](https://gohugo.io/extras/highlighting/) instead.
* Web fonts (e.g. 200kB for Proxima Nova and Source Code Pro)
* Icons, i.e. font-awesome (70 kB compressed)

## Libraries used

* [`purecss`](https://purecss.io/) ([License](https://github.com/yahoo/pure/blob/master/LICENSE.md))
* [`timeago.js`](https://github.com/hustcc/timeago.js) for fuzzy timestamps - "just now", "4 days ago", "2 years ago". (MIT License)
