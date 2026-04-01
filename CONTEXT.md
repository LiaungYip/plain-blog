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
