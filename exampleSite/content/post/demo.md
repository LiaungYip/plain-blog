---
draft: false
title: Feature Demo
date: 2022-04-18T12:25:42+08:00

# Explicitly setting an URL is optional.
# url: /blank_page

# Setting math: true will enable KaTeX for this page.
math: true

show_table_of_contents: true
---

# Table of contents

If `show_table_of_contents = true` in a page's front matter, then a table of contents is displayed.

You can [configure](https://gohugo.io/getting-started/configuration-markup/#table-of-contents) how many levels of headings are displayed in the table of contents.

The `config.toml` that ships with this `exampleSite` uses heading levels `h1` through `h3`. (Hugo default is to use `h2` and `h3`.)

```toml
[markup]
	[markup.tableOfContents]
		endLevel = 3
		ordered = false
		startLevel = 1
```

# Tables

Tables are supported, with the ability to apply CSS styles using a [shortcode by Will Schenk](<!-- https://willschenk.com/articles/2020/styling_tables_with_hugo/ -->).

For example, this:

<!-- Note /* */ used to prevent Hugo running the shortcode below. https://liatas.com/posts/escaping-hugo-shortcodes/ -->

```md
{{/*<table "pure-table pure-table-bordered">*/}}
| Colour | Tool   |
| ------ | ------ |
| Red    | Hammer |
| Yellow | Wrench |
| Blue   | Saw    |
{{/*</table>*/}}
```

Produces this:

{{<table "pure-table pure-table-bordered">}}
| Colour | Tool   |
| ------ | ------ |
| Red    | Hammer |
| Yellow | Wrench |
| Blue   | Saw    |
{{</table>}}

Possible CSS classes are:

* `pure-table`
* `pure-table pure-table-bordered`
* `pure-table pure-table-horizontal`

Refer https://purecss.io/tables/ .

## Advanced table functionality

Should you require more advanced table functionality (i.e. `rowspan` or `colspan`) then you will need to use raw HTML tables.

(This is true of Markdown and Hugo in general - not just `plain-blog`.)

Using raw HTML requires the `unsafe` option to be set to `true`.

```toml
[markup]
	[markup.goldmark]
		[markup.goldmark.renderer]
			# If your website contains a lot of raw HTML (i.e. HTML tables)
			# then you may need to enable "unsafe" mode.
			# Read and understand https://github.com/gohugoio/hugo/issues/6581
			# before you touch this setting.
			# unsafe = true
```



# Math

If `math = true` in a page's front matter, then KaTeX is loaded to display math.

Both inline math `$ ... math ... $` and display math `$$ ... $$` are supported.

Inline math:

> For example, one formula for determining the required knee point for a current transformer is $ V_k \ge (1 + \frac{X}{R}) \times I_{fault} \times (R_{CT} + R_{LEADS} + R_{RELAY}) $.

Display math:

> Three-phase per unit quantities, given $ S_{base} $ and $ V_{base} $:
>
> $$ I_{base} = \frac{S_{base}}{V_{base}\times\sqrt{3}} $$
> $$ Z_{base} = \frac{V_{base}}{I_{base}\times\sqrt{3}} = \frac{V_{base}^{2}}{S_{base}}$$
>