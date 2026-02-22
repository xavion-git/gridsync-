import pandas as pd

print("📂 Loading data...")

grid = pd.read_csv('HistoricalPoolPriceReportServlet.csv', skiprows=4)

print("Columns found:", grid.columns.tolist())
print(grid.head(3))

grid = grid.rename(columns={
    'Date (HE)':       'timestamp',
    'AIL Demand (MW)': 'usage_mw'
})

grid = grid[['timestamp', 'usage_mw']]

# ─── FIX TIMESTAMP ────────────────────────────────────
grid['date_part'] = grid['timestamp'].str[:10]

# Strip EVERYTHING that isn't a digit (handles "01", "24", "02*" etc.)
grid['hour_part'] = grid['timestamp'].str[11:].str.replace(r'\D', '', regex=True).astype(int) - 1

grid['timestamp'] = pd.to_datetime(grid['date_part'], format='%m/%d/%Y') \
                  + pd.to_timedelta(grid['hour_part'], unit='h')

grid = grid.drop(columns=['date_part', 'hour_part'])

# ─── CLEAN ────────────────────────────────────────────
grid['usage_mw'] = pd.to_numeric(grid['usage_mw'], errors='coerce')
grid = grid.dropna()
grid = grid.drop_duplicates(subset=['timestamp'])
grid = grid.sort_values('timestamp').reset_index(drop=True)
grid = grid[grid['usage_mw'].between(5000, 15000)]

print(f"\n✅ Grid data ready: {len(grid)} rows")
print(f"   Date range: {grid['timestamp'].min()} → {grid['timestamp'].max()}")
print(f"   Usage range: {grid['usage_mw'].min():.0f} – {grid['usage_mw'].max():.0f} MW")

grid.to_csv('grid_clean.csv', index=False)
print("💾 Saved to grid_clean.csv")