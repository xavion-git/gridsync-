import pandas as pd
import pickle, json
from prophet import Prophet
from datetime import datetime

print("📂 Loading data...")

grid    = pd.read_csv('grid_clean.csv')
weather = pd.read_csv('weather_clean.csv')

grid['timestamp']    = pd.to_datetime(grid['timestamp'])
weather['timestamp'] = pd.to_datetime(weather['timestamp'])

# Round both to the hour so they join cleanly
grid['timestamp']    = grid['timestamp'].dt.floor('h')
weather['timestamp'] = weather['timestamp'].dt.floor('h')

# Merge on timestamp
df = pd.merge(grid, weather, on='timestamp', how='inner')
print(f"   Rows after merge: {len(df)}")

if len(df) == 0:
    print("❌ Merge produced 0 rows — your date ranges don't overlap!")
    print(f"   Grid:    {grid['timestamp'].min()} → {grid['timestamp'].max()}")
    print(f"   Weather: {weather['timestamp'].min()} → {weather['timestamp'].max()}")
    exit()

# Rename for Prophet
df = df.rename(columns={'timestamp': 'ds', 'usage_mw': 'y'})
df['is_weekend'] = (df['ds'].dt.dayofweek >= 5).astype(int)
df = df.dropna()

print(f"   Date range: {df['ds'].min()} → {df['ds'].max()}")
print(f"   Temp range: {df['temperature_c'].min():.1f}°C – {df['temperature_c'].max():.1f}°C")

# ─── TRAIN ────────────────────────────────────────────
cutoff   = df['ds'].max() - pd.Timedelta(weeks=2)
train_df = df[df['ds'] <= cutoff].copy()
test_df  = df[df['ds'] >  cutoff].copy()

print(f"\n🤖 Training on {len(train_df)} rows | Testing on {len(test_df)} rows")

model = Prophet(
    changepoint_prior_scale=0.05,
    seasonality_mode='multiplicative',
    yearly_seasonality=True,
    weekly_seasonality=True,
    daily_seasonality=True,
    interval_width=0.95,
)
model.add_regressor('temperature_c', standardize=True)
model.add_regressor('is_weekend',    standardize=False)

print("   Training... (10-20 minutes)")
start = datetime.now()
model.fit(train_df)
print(f"   ✓ Done in {(datetime.now()-start).seconds}s")

# ─── ACCURACY ─────────────────────────────────────────
future_test = model.make_future_dataframe(
    periods=len(test_df), freq='h', include_history=False
)
future_test['temperature_c'] = test_df['temperature_c'].values
future_test['is_weekend']    = test_df['is_weekend'].values

forecast  = model.predict(future_test)
predicted = forecast['yhat'].values
actual    = test_df['y'].values

mae     = abs(actual - predicted).mean()
acc_200 = (abs(actual - predicted) < 200).mean() * 100
acc_500 = (abs(actual - predicted) < 500).mean() * 100

print(f"\n📊 Accuracy:")
print(f"   MAE:           {mae:.0f} MW")
print(f"   Within ±200MW: {acc_200:.1f}%")
print(f"   Within ±500MW: {acc_500:.1f}%")

# ─── SAVE ─────────────────────────────────────────────
with open('alberta_model.pkl', 'wb') as f:
    pickle.dump(model, f)

json.dump({
    "mae_mw":         round(mae),
    "accuracy_200mw": round(acc_200, 1),
    "accuracy_500mw": round(acc_500, 1),
    "has_temperature": True,
    "trained_at":     datetime.now().isoformat()
}, open('accuracy.json', 'w'), indent=2)

print("\n✅ Done!")
print("   alberta_model.pkl  ← back this up to USB + Google Drive now!")
print("   accuracy.json")