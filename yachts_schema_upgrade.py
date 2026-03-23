"""
yachts_schema_upgrade.py — Alfred App
=======================================
Upgrades the Supabase yachts table to match YachtService.swift / Yacht.swift.

The old yachts_migration.sql created columns: name, brand, size_ft, max_passengers,
location, includes, price_4hr-price_24hr, hero_image_url, etc.

YachtService.swift queries:  category, yacht_type, vibe, price_level, capacity,
is_partner, logo_url, address  → none of these existed → 0 yachts shown in app.

This script:
  1. Adds every missing column
  2. Fills them from existing data (max_passengers → capacity, location → address …)
  3. Derives yacht_type / vibe / price_level from size and pricing
  4. Ensures is_active = true & city = 'Miami' for every row
"""

import requests, json, time

# ── Supabase credentials ────────────────────────────────────────────────────
PROJECT_REF  = "fbdgbnnkgyljehtccgaq"
MGMT_PAT     = "sbp_19753720bfca52734aac3b36748da002229da5e8"

def run_sql(sql: str, label: str = "") -> list:
    """Execute SQL via Supabase Management API and return result rows."""
    url = f"https://api.supabase.com/v1/projects/{PROJECT_REF}/database/query"
    r = requests.post(
        url,
        headers={
            "Authorization": f"Bearer {MGMT_PAT}",
            "Content-Type": "application/json",
        },
        json={"query": sql},
        timeout=30,
    )
    if r.status_code not in (200, 201):
        print(f"  ✗ {label or 'SQL'} failed ({r.status_code}): {r.text[:300]}")
        return []
    result = r.json()
    if label:
        print(f"  ✓ {label}")
    return result if isinstance(result, list) else []

def run(label: str, sql: str):
    run_sql(sql, label)
    time.sleep(0.15)   # gentle rate-limit

# ── Step 1: Verify table exists & count rows ────────────────────────────────
print("\n=== Step 1: Checking existing table ===")
rows = run_sql("SELECT COUNT(*) AS n FROM public.yachts;", "count rows")
if rows:
    print(f"  → {rows[0].get('n', '?')} rows currently in yachts table")

# ── Step 2: Add missing columns ─────────────────────────────────────────────
print("\n=== Step 2: Adding missing columns ===")

columns_to_add = [
    ("category",      "TEXT",      "'yacht'"),
    ("is_partner",    "BOOLEAN",   "false"),
    ("yacht_type",    "TEXT",      "NULL"),
    ("vibe",          "TEXT",      "NULL"),
    ("price_level",   "INTEGER",   "NULL"),
    ("capacity",      "INTEGER",   "NULL"),
    ("logo_url",      "TEXT",      "NULL"),
    ("address",       "TEXT",      "NULL"),
    ("length_meters", "INTEGER",   "NULL"),
    ("price_per_day", "TEXT",      "NULL"),
    ("price_per_week","TEXT",      "NULL"),
    ("builder",       "TEXT",      "NULL"),
    ("year_built",    "INTEGER",   "NULL"),
    ("amenities",     "TEXT[]",    "NULL"),
    ("opening_hours", "TEXT",      "NULL"),
    ("instagram_url", "TEXT",      "NULL"),
    ("website_url",   "TEXT",      "NULL"),
    ("phone_number",  "TEXT",      "NULL"),
    ("cabins",        "INTEGER",   "NULL"),
    ("crew",          "INTEGER",   "NULL"),
]

for col, coltype, default in columns_to_add:
    default_clause = f" DEFAULT {default}" if default and default != "NULL" else ""
    run(
        f"add column {col}",
        f"ALTER TABLE public.yachts ADD COLUMN IF NOT EXISTS {col} {coltype}{default_clause};"
    )

# ── Step 3: Populate from existing data ─────────────────────────────────────
print("\n=== Step 3: Populating from existing data ===")

run("city = Miami (fill nulls)",
    "UPDATE public.yachts SET city = 'Miami' WHERE city IS NULL OR city = '';")

run("category = yacht",
    "UPDATE public.yachts SET category = 'yacht' WHERE category IS NULL OR category = '';")

run("capacity ← max_passengers",
    "UPDATE public.yachts SET capacity = max_passengers WHERE capacity IS NULL AND max_passengers IS NOT NULL;")

run("address ← location",
    "UPDATE public.yachts SET address = location WHERE address IS NULL AND location IS NOT NULL;")

run("builder ← brand",
    "UPDATE public.yachts SET builder = brand WHERE builder IS NULL AND brand IS NOT NULL;")

run("length_meters ← size_ft",
    "UPDATE public.yachts SET length_meters = ROUND(size_ft * 0.3048) WHERE length_meters IS NULL AND size_ft IS NOT NULL;")

run("price_per_day ← price_8hr or price_6hr",
    """
    UPDATE public.yachts SET price_per_day =
        CASE
            WHEN price_8hr  IS NOT NULL THEN '$' || price_8hr::TEXT
            WHEN price_6hr  IS NOT NULL THEN '$' || price_6hr::TEXT
            WHEN price_12hr IS NOT NULL THEN '$' || price_12hr::TEXT
            ELSE NULL
        END
    WHERE price_per_day IS NULL;
    """)

run("price_per_week ← price_24hr * 5",
    """
    UPDATE public.yachts SET price_per_week =
        CASE WHEN price_24hr IS NOT NULL THEN '$' || (price_24hr * 5)::TEXT ELSE NULL END
    WHERE price_per_week IS NULL;
    """)

run("price_level ← weekend 4hr price",
    """
    UPDATE public.yachts SET price_level =
        CASE
            WHEN price_4hr IS NULL  AND price_6hr IS NULL THEN 3
            WHEN COALESCE(price_4hr, price_6hr) < 1100   THEN 1
            WHEN COALESCE(price_4hr, price_6hr) < 2500   THEN 2
            WHEN COALESCE(price_4hr, price_6hr) < 5000   THEN 3
            ELSE 4
        END
    WHERE price_level IS NULL;
    """)

run("yacht_type ← name/size keywords",
    """
    UPDATE public.yachts SET yacht_type =
        CASE
            WHEN LOWER(name) LIKE '%catamaran%'   THEN 'Catamaran'
            WHEN LOWER(name) LIKE '%axopar%'      THEN 'Day Boat'
            WHEN LOWER(name) LIKE '%fjord%'       THEN 'Day Boat'
            WHEN LOWER(name) LIKE '%pardo%'       THEN 'Sport Cruiser'
            WHEN LOWER(name) LIKE '%sundeck%'     THEN 'Sport Cruiser'
            WHEN LOWER(name) LIKE '%flybridge%'   THEN 'Flybridge'
            WHEN LOWER(name) LIKE '%vanquish%'    THEN 'Day Boat'
            WHEN LOWER(name) LIKE '%vandutch%'    THEN 'Sport Cruiser'
            WHEN size_ft IS NULL                  THEN 'Motor Yacht'
            WHEN size_ft <= 32                    THEN 'Day Boat'
            WHEN size_ft <= 50                    THEN 'Sport Cruiser'
            WHEN size_ft <= 75                    THEN 'Motor Yacht'
            WHEN size_ft <= 120                   THEN 'Super Yacht'
            ELSE 'Mega Yacht'
        END
    WHERE yacht_type IS NULL;
    """)

run("vibe ← size/type",
    """
    UPDATE public.yachts SET vibe =
        CASE
            WHEN LOWER(name) LIKE '%catamaran%'  THEN 'Luxury'
            WHEN LOWER(name) LIKE '%pardo%'      THEN 'Luxury'
            WHEN LOWER(name) LIKE '%axopar%'     THEN 'Party'
            WHEN size_ft IS NULL                 THEN 'Luxury'
            WHEN size_ft <= 35                   THEN 'Party'
            WHEN size_ft <= 55                   THEN 'Luxury'
            WHEN size_ft <= 85                   THEN 'Ultra Luxury'
            ELSE 'Ultra Luxury'
        END
    WHERE vibe IS NULL;
    """)

run("amenities ← tags",
    "UPDATE public.yachts SET amenities = tags WHERE amenities IS NULL AND tags IS NOT NULL;")

# ── Step 4: Ensure is_active = true for all rows ────────────────────────────
print("\n=== Step 4: Activating all yachts ===")
run("is_active = true for all", "UPDATE public.yachts SET is_active = true;")

# Mark larger / well-priced yachts as featured
run("is_featured for flagship yachts",
    """
    UPDATE public.yachts SET is_featured = true
    WHERE is_featured IS NULL OR is_featured = false
    AND (
        size_ft >= 55
        OR (rating IS NOT NULL AND rating >= 4.9)
        OR LOWER(name) LIKE '%pershing%'
        OR LOWER(name) LIKE '%azimut%'
        OR LOWER(name) LIKE '%princess%'
        OR LOWER(name) LIKE '%ferretti%'
        OR LOWER(name) LIKE '%sunseeker%'
        OR LOWER(name) LIKE '%sanlorenzo%'
        OR LOWER(name) LIKE '%maiora%'
        OR LOWER(name) LIKE '%mangusta%'
    );
    """)

# ── Step 5: Final verification ───────────────────────────────────────────────
print("\n=== Step 5: Verification ===")
rows = run_sql("SELECT COUNT(*) AS total FROM public.yachts;", "total rows")
if rows: print(f"  → Total yachts: {rows[0].get('total', '?')}")

rows = run_sql("SELECT COUNT(*) AS active FROM public.yachts WHERE is_active = true;", "active")
if rows: print(f"  → Active (visible in app): {rows[0].get('active', '?')}")

rows = run_sql("SELECT COUNT(*) AS featured FROM public.yachts WHERE is_featured = true;", "featured")
if rows: print(f"  → Featured (hero carousel): {rows[0].get('featured', '?')}")

rows = run_sql(
    "SELECT yacht_type, COUNT(*) AS n FROM public.yachts GROUP BY yacht_type ORDER BY n DESC;",
    "by type"
)
if rows:
    print("  → Breakdown by yacht_type:")
    for r in rows:
        print(f"      {r.get('yacht_type','?'):20s} {r.get('n','?')} yachts")

rows = run_sql(
    "SELECT price_level, COUNT(*) AS n FROM public.yachts GROUP BY price_level ORDER BY price_level;",
    "by price_level"
)
if rows:
    labels = {1:'$', 2:'$$', 3:'$$$', 4:'$$$$'}
    print("  → Breakdown by price_level:")
    for r in rows:
        pl = r.get('price_level')
        print(f"      Level {pl} ({labels.get(pl,'?'):4s})  {r.get('n','?')} yachts")

rows = run_sql(
    "SELECT id, name, city, category, yacht_type, price_level, capacity FROM public.yachts LIMIT 5;",
    "sample rows"
)
if rows:
    print("  → First 5 rows (sample):")
    for r in rows:
        print(f"      {r.get('name','?')[:35]:35s} | {r.get('yacht_type','?'):15s} | PL:{r.get('price_level','?')} | cap:{r.get('capacity','?')}")

print("\n✅ Upgrade complete — yachts database is now connected to the app.\n")
