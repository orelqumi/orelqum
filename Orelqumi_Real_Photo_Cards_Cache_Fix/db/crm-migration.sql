-- Orelqumi CRM migration. Run ONCE against your existing ORELQUMI_DB D1 database.
-- Leads are prospects and enquiries; not necessarily registered portal customers.
CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  website_type TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'Website enquiry',
  budget_kes INTEGER,
  status TEXT NOT NULL DEFAULT 'New' CHECK(status IN ('New','Contacted','Quoted','Interested','Won','Cancelled','Lost')),
  cancellation_reason TEXT NOT NULL DEFAULT '',
  notes TEXT NOT NULL DEFAULT '',
  last_contacted_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS leads_status_idx ON leads(status);
CREATE INDEX IF NOT EXISTS leads_updated_idx ON leads(updated_at);
