/**
 * One-time data migration: loads the legacy roadmap requests (ported from
 * the original Notion export) and creates demo accounts for the existing
 * ValPay team roster, so the app isn't empty on first run.
 *
 * Usage:
 *   npm run db:seed
 *
 * Requires SUPABASE_SERVICE_ROLE_KEY (never expose this to the browser —
 * it bypasses RLS, which is exactly what a one-off seed script needs).
 */
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import REQUESTS from '../data/requests-data';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

// Matches the original prototype's demo roster (app/page.tsx USER_OPTIONS).
const DEMO_USERS = [
  'blake.rouse@valpay.com', 'cameron.hutchinson@valpay.com', 'carly.jackson@valpay.com',
  'elie.dimitri@valpay.com', 'ethan.savage@valpay.com', 'izabela.cyranowicz@valpay.com',
  'joshua.leopardi@valpay.com', 'kenneth.fallon@valpay.com', 'matthew.georges@valpay.com',
  'matthew.gottlieb@valpay.com', 'meagan.love@valpay.com', 'melissa.good@valpay.com',
  'm.bourassa@valsoftcorp.com', 'raphael.gad@valpay.com', 'tarek.kazak@valpay.com',
  'tristan.gauthier@valpay.com', 'youssef.maamoun@valpay.com', 'ivo.dimitrov@valpay.com'
];

// Every demo account gets this password. Tell your team to change it after
// their first login (the app's "Change password" menu already wires this up).
const DEMO_PASSWORD = 'ValPayRoadmap!2026';

async function seedUsers() {
  console.log(`Creating ${DEMO_USERS.length} demo users…`);
  for (const email of DEMO_USERS) {
    const { error } = await supabase.auth.admin.createUser({
      email,
      password: DEMO_PASSWORD,
      email_confirm: true
    });
    if (error && !error.message.includes('already been registered')) {
      console.error(`  ✗ ${email}: ${error.message}`);
    } else {
      console.log(`  ✓ ${email}`);
    }
  }
}

function parseCreatedAt(created: string): string {
  const d = new Date(created);
  return Number.isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
}

async function seedRequests() {
  console.log(`Inserting ${REQUESTS.length} legacy roadmap requests…`);
  // `requests.id` is text with no default — reuse the original prototype's
  // deterministic ids (req-1, req-2, …) directly.
  const rows = REQUESTS.map(r => ({
    id: r.id,
    title: r.title,
    description: r.description || '',
    status: r.status,
    urgency: r.urgency,
    gmv_label: r.gmvLabel,
    gmv_value: r.gmvValue,
    partner: r.partner,
    categories: r.categories,
    audience: r.audience,
    primary_category: r.primaryCategory,
    compliance: !!r.compliance,
    submitted_by: null, // legacy/imported requests aren't linked to a real account
    created_at: parseCreatedAt(r.created)
  }));

  const { error } = await supabase.from('requests').upsert(rows, { onConflict: 'id' });
  if (error) {
    console.error('  ✗ Failed to insert requests:', error.message);
    process.exit(1);
  }
  console.log(`  ✓ Inserted/updated ${rows.length} requests.`);
}

async function main() {
  await seedRequests();
  await seedUsers();
  console.log('\nDone. Demo accounts can sign in with password:', DEMO_PASSWORD);
}

main();
