# Orelqumi Technologies — Cloudflare Pages + Paystack

## What is implemented
- Entire Orelqumi website is in `public/`, including calculator, quotations, Academy and school pages.
- `pay-invoice.html`: one-time payment form for **agreed and issued invoices only**.
- `functions/api/paystack-start.js`: server-side transaction initialization with Paystack. Secret key never exposed publicly.
- `functions/api/paystack-verify.js`: payment verification on return from Paystack.
- `payment-status.html`: shows verified results. Never trusts query string as proof of payment.
- This is **not** automatic invoicing, an online cart, automatic subscriptions, receipt issuance, or automatic project order confirmation.
- Customers enter an invoice reference and agreed amount. This value is **not validated against a stored approved invoice**; check transaction amount/reference in your Paystack dashboard before fulfilling any order. Never assume a payment settles the full agreed invoice until you reconcile it manually.

## Deploy with GitHub → Cloudflare Pages (required for functions)
1. Upload the **contents of this ZIP**, including both `public/` and `functions/`, to your GitHub repository (`orelqumi/orelqum`). Do **not** upload the ZIP file itself; extract first. Because this bundle now uses `public/`, existing GitHub Pages configured to serve the repository root will no longer be the correct hosting target. Configure your public website to use Cloudflare Pages and its Pages URL instead.
2. In Cloudflare go to **Workers & Pages** → create a Pages project → **connect GitHub** → select your repository and branch `main`. Cloudflare increasingly recommends Workers for new applications, but this package specifically uses Pages Functions.
3. Select **no framework**; project root `/`; build command `exit 0`; build output directory `public`.
4. After the initial deployment, note your `https://YOUR-PROJECT.pages.dev` URL.
5. In Cloudflare Pages project go to **Settings → Variables and Secrets**. Add the encrypted secret **`PAYSTACK_SECRET_KEY`** with your Paystack **test** secret key, starting `sk_test_`. Make sure it applies to the desired deployment environment. Save and redeploy.
6. Open the website at `https://YOUR-PROJECT.pages.dev/pay-invoice.html`. Use a genuine invoice and Paystack test payment details; check that the customer returns to the verification page. Check the transaction reference, amount, mode and status in your Paystack dashboard.
7. For production, complete Paystack account/business verification, test status and payout configuration, then replace with your **live** key (`sk_live_`) as an encrypted Cloudflare secret and redeploy. Confirm supported payment methods and settlement settings in your account.
8. Optionally add a custom domain in your Cloudflare Pages project. Keep all client traffic on the actual Cloudflare Pages deployment: **GitHub Pages cannot execute these Functions**.

## Payment safeguards
- The server validates name, email, invoice reference and amount (KES 3–1,000,000), initializes a Paystack hosted checkout and restricts the callback to its own domain.
- The Paystack secret key is read only by server-side Functions. **Never paste it into HTML, JavaScript, GitHub, chat, or `assets/config.js`.**
- The successful redirect does not prove a payment; the server calls Paystack's verification API.
- No automatic service provisioning or recurring charge is offered. Maintenance subscriptions in the pricing catalogue are proposals until a separate agreement and recurring-payment system are implemented. Paystack **M-PESA does not support recurring automatic charges**.
- Anyone can type an arbitrary invoice reference and amount. **Manual reconciliation is mandatory**. A full production billing system requires a secured invoice database with server-validated amounts, duplicate-payment handling, transaction state, admin roles and authenticated webhook processing.
- The existing quote/enrol/contact forms still open an email draft (`mailto:`); Paystack does not provide a contact-form backend.
- Never publish a payment link until the Paystack account is verified and a test charge has been checked end to end.

## Developer local test
Use `npx wrangler pages dev public` from this repository root. For testing payments locally, copy `.dev.vars.example` to `.dev.vars` and replace placeholder with your own **test** secret key. Never commit `.dev.vars`.

## Official documentation
- Cloudflare Pages Functions: https://developers.cloudflare.com/pages/functions/get-started/
- Cloudflare secrets: https://developers.cloudflare.com/pages/functions/bindings/
- Cloudflare Pages Git integration: https://developers.cloudflare.com/pages/get-started/git-integration/
- Paystack transaction API: https://paystack.com/docs/api/transaction/
- Paystack payment verification: https://paystack.com/docs/payments/verify-payments/

## Compact navigation update
All public pages now have a compact responsive header. Main links: Home, Services, Pricing, Build Your Website, Academy, Contact and Get a Quote. Services/Pricing/Academy have accessible click-to-open dropdown menus. Smaller screens use the existing mobile menu button. Payment functions and Cloudflare/Paystack setup are unchanged.
