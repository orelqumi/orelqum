# Orelqumi — corrected professional navigation

- The header was rebuilt as a simple flat, seven-item navigation. No broken dropdowns.
- Desktop: Home / Services / Pricing / Build a Website / Academy / Contact / Get a Quote.
- Mobile and tablet: toggle a vertical menu; no links spill across the header.
- Secondary pages (School Packages, Portfolio, About, Courses, Enrol, Pay Invoice) remain available from their respective pages and the footer.
- New `public/assets/navigation.css` overrides earlier navigation styling and has a versioned stylesheet URL to discourage stale CSS caching.
- Home page copy now speaks to clients rather than describing the website design process.

## Update the site
Unzip and replace the repository contents, preserving the `public/` and `functions/` folders at the project root. Cloudflare Pages settings: build command `exit 0`, output directory `public`. See README-CLOUDFLARE-PAYSTACK.md for Paystack configuration.

If you use GitHub Pages instead of Cloudflare, publish the files **inside** `public/` to the GitHub Pages site root. GitHub Pages cannot run the Paystack Functions; payment processing requires Cloudflare Pages.


SEO UPDATE: See GOOGLE-VERIFICATION-AND-SEO-GUIDE.md.
