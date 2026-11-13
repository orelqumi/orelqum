# Orelqumi — Private Enquiries & Cancellation CRM

This complete package extends the existing Cloudflare Pages owner dashboard with a Leads & Customers view. It records name, phone, email, requested website, lead source, quoted budget, lead stage, cancellation reason, and notes. The owner can export the saved data as CSV.

## Important: it is NOT automatically connected to the public quote form
Until a protected backend enquiry endpoint, abuse prevention (such as Turnstile), a privacy notice and appropriate consent are set up, add incoming WhatsApp, phone, and website enquiries manually. Do not publish or share the private CSV.

## Existing site: apply just the new database migration
From this extracted root folder (with `db`, `public`, `functions` beside one another):

    wrangler d1 list

Determine your EXISTING portal database name and confirm its D1 binding is `DB`. Then run (substitute your actual existing DB name):

    wrangler d1 execute EXISTING_DATABASE_NAME --remote --file db/crm-migration.sql

IMPORTANT: Do not create a second D1 database. The same binding and previous tables must remain.

## Deploy updated website + Functions

    wrangler pages deploy public --project-name orelqum --branch main

Then visit `https://orelqum.pages.dev/dashboard-login.html`, log in to your **owner** account and select **Enquiries & cancellations**. Add a test enquiry and confirm it appears. The client role cannot see this tab or access its API.

## For first-time portal installations

Use `START-HERE-CLIENT-PORTAL.md` to configure `DB`, import full `db/schema.sql` once, and establish your first owner login. The CRM migration above is for databases that already have the core portal tables.

## Data and security

* Records are stored in your Cloudflare D1 database under owner-only API access, not in a public spreadsheet.
* The export CSV contains customer phone numbers and must be protected.
* Record only details customers have voluntarily supplied for an enquiry, provide an appropriate privacy notice, and respect requests for deletion.
* A status of `Cancelled` records the outcome, but it does not automatically issue a refund or cancel a Paystack subscription.
* No real customer data is preloaded.
