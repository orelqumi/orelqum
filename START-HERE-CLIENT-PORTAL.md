# Orelqumi Technologies — Customer Payments & Project Dashboard

This release extends the existing Orelqumi site with a REAL Cloudflare Pages Functions and D1-backed portal. It is not a visual-only demo. The login, dashboard, invoices and project records will be functional AFTER D1 is created and bound and the owner account is set up. Nothing in this ZIP connects to your Cloudflare account until you deploy it yourself.

## Features

- `public/dashboard-login.html` — customer/owner sign in
- `public/dashboard.html` — role-specific overview, projects, fixed-amount invoices, Paystack transactions and password change
- `public/dashboard-setup.html` — **one-time** administrator account creation using an owner-only secret
- `functions/api/portal/` — authenticated backend; Cloudflare D1 database storage
- `db/schema.sql` — database tables
- `public/pay-invoice.html` — safe route into authenticated invoice payments

All website pages, school services, pricing calculator, SEO material and other existing pages are retained.

## IMPORTANT security corrections

1. The previous payment form allowed the payer to type any amount. This is NOT suitable for real business invoices. The old `POST /api/paystack-start` is intentionally disabled (HTTP 410). Existing unpaid test payments using that endpoint are not imported.
2. Only Orelqumi's administrator can create a fixed-amount invoice. Paystack initiation now accepts an invoice ID, retrieves the amount from D1 and does not accept a customer-supplied amount.
3. Server-side verification matches the Paystack reference, currency KES, exact amount, transaction mode and successful status before marking invoice as Paid.
4. The dashboard uses password hashes, random session tokens in HttpOnly + Secure + SameSite=Strict cookies, per-email failed-login lockout, origin checks on writes and customer/administrator authorization checks.
5. Transactions must be reconciled. The current design does NOT use an automatic Paystack webhook or send payment emails. If a customer leaves before returning, they or an administrator must press "Verify with Paystack" for the pending transaction to be updated. For production scale, integrate a signed webhook and audit log before relying on automatic fulfillment.
6. Test mode must pass end-to-end again after deploying the D1 version. Actual payments require Paystack Live Mode onboarding and compliance, plus an approved pricing/terms policy.
7. You previously shared a screenshot showing part of a Paystack test secret. Rotate the exposed key in Paystack and update your encrypted Cloudflare `PAYSTACK_SECRET_KEY` secret if you have not already.
8. Customers should NOT receive an automatic self-registration form. The owner creates a client profile only after agreeing on work, and privately communicates a temporary password. Ask customers to change that password immediately.

## Step-by-step Windows Cloudflare setup

**1. Unzip** the complete archive, keeping `public`, `functions` and `db` in the same extracted directory.

**2. Open Command Prompt inside the extracted folder.** In Windows File Explorer, navigate to the folder containing `public`, `functions`, `db`; press `Alt+D`, type `cmd`, press Enter. Check `dir` shows all three directories.

**3. Create your D1 database (one time):**

```cmd
wrangler d1 create orelqumi-portal
```

If you already created this database earlier, do not create another; use the existing one.

**4. Create your tables (one time):**

```cmd
wrangler d1 execute orelqumi-portal --remote --file db/schema.sql
```

This schema uses `CREATE TABLE IF NOT EXISTS`, so it is safe to rerun on the same fresh schema, but do not copy a production database without a backup.

**5. Bind the database to the EXISTING Cloudflare Pages project:**

- Cloudflare Dashboard → Workers & Pages → `orelqum` → Settings → Bindings.
- Add a **D1 database** binding.
- Variable / binding name: `DB` (exactly, including capital letters).
- Database: `orelqumi-portal`.
- Save. Do not create a different Pages project.

**6. Configure a temporary owner setup secret:**

Generate a random string in the Windows Command Prompt:

```cmd
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy it locally, keep it private and never paste it in ChatGPT. In Cloudflare Pages project → Settings → Variables and Secrets, create encrypted secret `ORELQUMI_SETUP_KEY` with that random value. The existing encrypted `PAYSTACK_SECRET_KEY` must remain configured for **Test Mode**.

**7. Deploy all website files and Pages Functions:**

```cmd
wrangler pages deploy public --project-name orelqum --branch main
```

Wait until Wrangler displays `Deployment complete`.

**8. Set up the owner account ONCE:**

Visit `https://orelqum.pages.dev/dashboard-setup.html`. Enter your owner name, email, strong 12+ character password and private `ORELQUMI_SETUP_KEY` value. The server prevents creating a second admin once an admin exists. Sign in should occur automatically.

After successful owner setup, **remove** `ORELQUMI_SETUP_KEY` from your Cloudflare project Secrets and redeploy if Cloudflare requests it. Do not remove `PAYSTACK_SECRET_KEY`.

**9. Add a test client and project:**

- Dashboard → Owner management → Add customer. Provide a temporary password of at least 12 characters; share it privately.
- Create a project and post progress updates.
- Issue an invoice with a unique number like `ORQ-2026-001` and a test amount of KSh 100.
- Open `dashboard-login.html` in a private window and log in as that customer.
- Open Invoices → Pay with Paystack and complete a simulated Paystack M-PESA TEST payment.
- The customer is redirected to `dashboard.html?payment=...`; the server checks Paystack and marks the invoice Paid when the exact amount, transaction reference and KES mode all match.
- Dashboard → Payments can recheck pending payments through Paystack.

**10. Confirm access controls:**

A customer must see only their own projects, invoices and payments. A non-owner must not see the Owner management tab. Log out and confirm the dashboard requires sign-in. Test from an incognito window.

## What this version intentionally DOES NOT do

- It does not automatically email invoices or credentials.
- It does not auto-send reminders, receipt PDFs or project files.
- It does not automatically import old payments made before this D1 dashboard existed.
- It does not offer automatic M-PESA subscriptions.
- It does not record refunds or partial payments as separate accounting events.
- It does not automatically detect a payment if the customer never returns unless someone selects "Verify with Paystack". A signed webhook is the next backend enhancement.
- It does not accept customer-entered prices anymore. All payable amounts come from invoices created by the owner.

## Notes on security and compliance

- D1 data is stored in your own Cloudflare account and must be managed securely. Limit access to your Cloudflare dashboard.
- Rotate credentials if disclosed. Use strong passwords and browser HTTPS.
- Do not deploy live Paystack payments before an independent audit of the payment workflow, tests for double charges and cancellation/refund handling, and confirmation of Kenyan data protection duties.
- The sign-in system includes basic per-email lockout and standard cookie safeguards. For larger use, add Cloudflare Turnstile, IP-aware rate limits, two-factor authentication, email verification and operational monitoring.
- Backup D1 regularly. Plan a customer support channel for access recovery. This initial release has **no password reset via email**; the administrator must manage lost-credential cases through a vetted recovery process.
