# Orelqumi Website — repaired release

## Verified source defects repaired
1. The website calculator HTML did NOT load `assets/builder.js`; it was displaying a static total and not calculating when page count/features changed. Fixed.
2. The quotation form HTML also failed to load `assets/builder.js`, so the calculator selections were NOT being transferred. Fixed.
3. When `assets/config.js` contained no contact email, submitting a form launched an email with a blank To field. Forms now show a clear notice and allow copying the enquiry instead of falsely implying it was sent.
4. The school-maintenance selection mapping was incomplete. Fixed.
5. The 404 page used root-absolute links, which were unsuitable for some static deployment contexts. Fixed.
6. The Paystack payment page now explicitly warns that checkout requires deployed Pages Functions and valid credentials.
7. Default website category is Business / Company and initial calculator value matches its KSh 13,000 starting price.

## Upload to Cloudflare (choose one method)

### A. Quick website-only Cloudflare Pages dashboard upload
Use `Orelqumi_Cloudflare_UPLOAD_SITE_ONLY.zip`.
Upload this ZIP using your existing Cloudflare Pages direct-upload method. The ZIP has `index.html` at its root. It contains the working public website, calculator, SEO, robots.txt, sitemap.xml and verification tag. **It cannot run Paystack Functions**. The invoice payment page remains an informational page, not a live payment gateway.

### B. Full Pages + Paystack backend (for later)
Use `Orelqumi_GIT_FULL_CLOUDFLARE_PAYSTACK.zip`.
Extract into GitHub repository root. Keep `public/` and `functions/` as sibling folders. Connect via **Cloudflare Pages Git integration** with branch `main`, root directory `/`, build command `exit 0`, build output directory `public`. Add the encrypted `PAYSTACK_SECRET_KEY` in Cloudflare, deploy, and test with `sk_test_` before going live. Do not publish a real secret in GitHub. No production payments are activated by merely uploading this bundle.

## Before the website can receive customer enquiries
Open `public/assets/config.js` in the FULL ZIP (or `assets/config.js` in the SITE ONLY ZIP) and set `window.ORELQUMI_CONTACT_EMAIL` to your verified business contact email. Until then, customer enquiries can only be copied, not delivered. Contact forms use `mailto:`; they are **not server submissions**.

## Google Search Console
The unique verification meta tag is in `public/index.html` (or the website-only ZIP's `index.html`). After deploying it, open your website, use View Page Source and search for `google-site-verification`. Then use Google Search Console HTML-tag verification. The sitemap is at `https://orelqum.pages.dev/sitemap.xml` once published to that domain.

## Key tests
- `index.html`, `services.html`, `website-pricing.html`, `build-your-website.html`, `quote.html`, `academy.html`, `contact.html` open.
- In Build Your Website, increasing from 5 to 8 pages adds KSh 4,500; ticking Booking adds KSh 5,000.
- Continue to quotation form carries category, pages, features, development estimate and monthly care.
- The menu collapses on mobile and quote button links to the quotation page.
- A blank contact-email configuration shows a clear not-sent warning.
- Payment flow must be tested separately after Pages Functions deployment. Paystack must validate payments server-side.

**Note**: I could not directly inspect the public `orelqum.pages.dev` site from the available web tool, so these fixes are based on the supplied source package and local code checks. Deploying the ZIP is a separate user action.
