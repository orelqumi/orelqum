# Orelqumi Google indexing and Search Console setup

## Status
SEO files and metadata are prepared. **Google ownership is NOT verified in this ZIP** because the exact one-time Search Console HTML tag or original HTML verification file was not supplied. **Do not click Verify until you add the exact credential and redeploy.** No live Google ranking is guaranteed.

## Fix the error "verification file has the wrong content"
Google checks the exact bytes of the account-specific HTML verification file at the root URL. Cloudflare may serve the homepage instead if the file is absent. This package contains a real `public/404.html` to stop missing paths from silently resolving to `index.html` on a typical Pages static setup, but the Google file must still be added.

**Recommended method: HTML meta tag**
1. In Search Console, choose the property `https://orelqum.pages.dev/` (not your GitHub Pages property).
2. Choose **HTML tag** verification and copy Google's entire `<meta name="google-site-verification" content="...">` tag.
3. Open `public/index.html`. Find the comment `GOOGLE SEARCH CONSOLE` inside `<head>`.
4. Paste the **exact** Google tag on the next line, without changing any characters. Do not copy example codes.
5. Deploy using your existing Git-based Cloudflare Pages project; settings: build output directory `public`, root repository directory, no framework, build command `exit 0`.
6. Visit `view-source:https://orelqum.pages.dev/` and search for `google-site-verification`. The exact code must appear there.
7. Click **Verify** in Search Console. Do not remove the tag afterward.

**Alternative: HTML file**
Download the original unique Google verification HTML file and copy it unchanged to `public/` so it appears at `https://orelqum.pages.dev/<exact-google-file-name>.html`. The contents and filename must exactly match. Check the URL in an incognito browser window before clicking Verify.

## SEO files included
- `public/robots.txt` references the sitemap and allows crawling of public pages.
- `public/sitemap.xml` lists public, indexable URLs on Cloudflare Pages.
- Unique page titles and descriptions, canonical URLs, robots directives, Open Graph metadata and homepage Organization/WebSite structured data.
- `public/404.html` gives a useful 404 page and avoids the homepage fallback for missing files.
- Excluded payment, privacy, enrolment and quotation form pages from the sitemap; some are explicitly marked `noindex`.
- Fixed a malformed CSS stylesheet tag found in the last provided website ZIP.

## Post-verification
1. Open Search Console > Sitemaps; submit `sitemap.xml`.
2. In URL Inspection, inspect `https://orelqum.pages.dev/` and request indexing.
3. Open your main URLs and check that CSS loads and navigation is usable.
4. Keep ONE public version preferred. The older GitHub Pages copy may cause duplicate content. If keeping both, place Cloudflare canonical tags on the GitHub copy or redirect it to the Cloudflare site. This ZIP only changes the Cloudflare version.
5. Search rankings and indexing are controlled by Google and may take time.

## Cloudflare deployment note
Keep `public/` and `functions/` alongside each other in the repository root for Git-connected Cloudflare Pages. Upload **the extracted repository files**, not only the `public` contents, if Paystack Pages Functions should also be deployed. The payment API secret must be configured securely in Cloudflare, not in code. Neither live payment processing nor ownership verification is activated by this ZIP alone.
