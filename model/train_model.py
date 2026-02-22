import pandas as pd
import pickle, json
from prophet import Prophet
from datetime import datetime

print("🤖 Starting Prophet training...")
start_time = datetime.now()

df = pd.read_csv('grid_clean.csv')
df = df.rename(columns={'timestamp': 'ds', 'usage_mw': 'y'})
df['ds'] = pd.to_datetime(df['ds'])

# Add features Prophet CAN calculate itself from the timestamp
df['is_weekend'] = (df['ds'].dt.dayofweek >= 5).astype(int)

cutoff = df['ds'].max() - pd.Timedelta(weeks=2)
train_df = df[df['ds'] <= cutoff].copy()
test_df  = df[df['ds'] >  cutoff].copy()

print(f"   Training on {len(train_df)} rows | Testing on {len(test_df)} rows")

model = Prophet(
    changepoint_prior_scale=0.05,
    seasonality_mode='multiplicative',
    yearly_seasonality=True,
    weekly_seasonality=True,
    daily_seasonality=True,
    interval_width=0.95,
)

# Only add is_weekend — no temperature needed yet
model.add_regressor('is_weekend', standardize=False)

print("   Training... (this takes 5-15 minutes)")
model.fit(train_df)

elapsed = (datetime.now() - start_time).seconds
print(f"   ✓ Training complete in {elapsed}s")

# ─── ACCURACY CHECK ───────────────────────────────────
future_test = model.make_future_dataframe(periods=len(test_df), freq='h', include_history=False)
future_test['is_weekend'] = test_df['is_weekend'].values

forecast = model.predict(future_test)
predicted = forecast['yhat'].values
actual    = test_df['y'].values

mae     = abs(actual - predicted).mean()
acc_200 = (abs(actual - predicted) < 200).mean() * 100
acc_500 = (abs(actual - predicted) < 500).mean() * 100

print(f"\n📊 Accuracy:")
print(f"   MAE:          {mae:.0f} MW")
print(f"   Within ±200MW: {acc_200:.1f}%")
print(f"   Within ±500MW: {acc_500:.1f}%")

with open('alberta_model.pkl', 'wb') as f:
    pickle.dump(model, f)

json.dump({
    "mae_mw": round(mae),
    "accuracy_200mw": round(acc_200, 1),
    "accuracy_500mw": round(acc_500, 1),
    "trained_at": datetime.now().isoformat()
}, open('accuracy.json', 'w'), indent=2)

print("\n✅ Done!")
print("   alberta_model.pkl saved")
print("   accuracy.json saved")