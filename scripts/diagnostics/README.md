# Diagnostic Scripts

Ad-hoc Node scripts used for one-off Supabase debugging. **They are not part of the test suite** — running them touches the live database.

| Script | Purpose | Required env |
|--------|---------|--------------|
| `test.js` | Sanity check that the anon client can read `products`. | `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` |
| `testProduct.js` | Read a specific product row by id (edit the script). | `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` |
| `check_product.js` | Same as above with a different output format. | `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` |
| `testAdmin.js` | Inspect the `admin_users` table. | `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` |
| `testInsert.js` | Insert a sample product as a signed-in user. | service role or admin auth |
| `testInsertNoSelect.js` | Variant of `testInsert.js` without `.select()` to inspect RLS-blocked silent inserts. | service role or admin auth |
| `testService.js` | Hits Supabase as service-role. **Do not run casually.** | `SUPABASE_SERVICE_ROLE_KEY` |
| `testStorage.js` | Lists files in a storage bucket. | `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (or service role for non-public buckets) |
| `testUpload.js` | Tests an upload to `product-images`. Requires admin signed-in client or service role. | service role or admin auth |

## Running

```bash
node scripts/diagnostics/test.js
```

For scripts that need the service-role key, export it before invoking:

```bash
SUPABASE_SERVICE_ROLE_KEY=eyJ...secret... node scripts/diagnostics/testService.js
```

> ⚠️ Never commit a service-role key. The `.env` file is git-ignored — keep it that way.
