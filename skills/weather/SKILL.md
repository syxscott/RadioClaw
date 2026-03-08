---
name: weather
description: "Get current weather and forecasts via wttr.in or Open-Meteo. Use when: user asks about weather, temperature, or forecasts for any location. NOT for: historical weather data, severe weather alerts, or detailed meteorological analysis. No API key needed."
homepage: https://wttr.in/:help
metadata: { "RadioClaw": { "emoji": "üå§Ô∏?, "requires": { "bins": ["curl"] } } }
---

# Weather Skill

Get current weather conditions and forecasts.

## When to Use

‚ú?**USE this skill when:**

- "What's the weather?"
- "Will it rain today/tomorrow?"
- "Temperature in [city]"
- "Weather forecast for the week"
- Travel planning weather checks

## When NOT to Use

‚ù?**DON'T use this skill when:**

- Historical weather data ‚Ü?use weather archives/APIs
- Climate analysis or trends ‚Ü?use specialized data sources
- Hyper-local microclimate data ‚Ü?use local sensors
- Severe weather alerts ‚Ü?check official NWS sources
- Aviation/marine weather ‚Ü?use specialized services (METAR, etc.)

## Location

Always include a city, region, or airport code in weather queries.

## Commands

### Current Weather

```bash
# One-line summary
curl "wttr.in/London?format=3"

# Detailed current conditions
curl "wttr.in/London?0"

# Specific city
curl "wttr.in/New+York?format=3"
```

### Forecasts

```bash
# 3-day forecast
curl "wttr.in/London"

# Week forecast
curl "wttr.in/London?format=v2"

# Specific day (0=today, 1=tomorrow, 2=day after)
curl "wttr.in/London?1"
```

### Format Options

```bash
# One-liner
curl "wttr.in/London?format=%l:+%c+%t+%w"

# JSON output
curl "wttr.in/London?format=j1"

# PNG image
curl "wttr.in/London.png"
```

### Format Codes

- `%c` ‚Ä?Weather condition emoji
- `%t` ‚Ä?Temperature
- `%f` ‚Ä?"Feels like"
- `%w` ‚Ä?Wind
- `%h` ‚Ä?Humidity
- `%p` ‚Ä?Precipitation
- `%l` ‚Ä?Location

## Quick Responses

**"What's the weather?"**

```bash
curl -s "wttr.in/London?format=%l:+%c+%t+(feels+like+%f),+%w+wind,+%h+humidity"
```

**"Will it rain?"**

```bash
curl -s "wttr.in/London?format=%l:+%c+%p"
```

**"Weekend forecast"**

```bash
curl "wttr.in/London?format=v2"
```

## Notes

- No API key needed (uses wttr.in)
- Rate limited; don't spam requests
- Works for most global cities
- Supports airport codes: `curl wttr.in/ORD`
