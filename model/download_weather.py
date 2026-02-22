import requests, pandas as pd
from datetime import datetime, timedelta
from dotenv import load_dotenv
import os

load_dotenv()
API_KEY = os.getenv('OPENWEATHER_KEY')

# Free historical weather from Open-Meteo (no API key needed, no cost)
# We use Edmonton + Calgary weighted 50/50 as representative of Alberta

cities = [
    {'name': 'Edmonton', 'lat': 53.5461, 'lon': -113.4938, 'weight': 0.5},
    {'name': 'Calgary',  'lat': 51.0447, 'lon': -114.0719, 'weight': 0.5},
]

# Match date range to your grid_clean.csv
# Check what dates you have and set these to match
START_DATE = '2024-02-20'   # ← matches new 2-year grid data
END_DATE   = '2026-01-20'   # ← matches new 2-year grid data

all_dfs = []

for city in cities:
    print(f"Fetching weather for {city['name']}...")
    
    url = 'https://archive-api.open-meteo.com/v1/archive'
    params = {
        'latitude':   city['lat'],
        'longitude':  city['lon'],
        'start_date': START_DATE,
        'end_date':   END_DATE,
        'hourly':     'temperature_2m',
        'timezone':   'America/Edmonton'
    }
    
    resp = requests.get(url, params=params)
    data = resp.json()
    
    df = pd.DataFrame({
        'timestamp':     pd.to_datetime(data['hourly']['time']),
        'temperature_c': data['hourly']['temperature_2m']
    })
    df['temperature_c'] = df['temperature_c'] * city['weight']
    all_dfs.append(df)
    print(f"  ✓ {len(df)} rows")

# Combine weighted temperatures
weather = all_dfs[0].copy()
weather['temperature_c'] = all_dfs[0]['temperature_c'] + all_dfs[1]['temperature_c']

weather = weather.dropna()
weather.to_csv('weather_clean.csv', index=False)
print(f"\n✅ Saved {len(weather)} hourly weather records to weather_clean.csv")
print(f"   Temp range: {weather['temperature_c'].min():.1f}°C – {weather['temperature_c'].max():.1f}°C")