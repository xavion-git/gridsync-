const MAX_CAPACITY = 11700

/*
 * /api/live-usage — Returns current Alberta grid demand
 *
 * Uses the official AESO "Current Supply Demand" API (JSON).
 * Requires AESO_API_KEY in .env.local.
 * Falls back to mock data if the API key is missing or the request fails.
 */
export default async function handler(req, res) {
  const apiKey = process.env.AESO_API_KEY

  if (!apiKey) {
    return res.status(200).json({
      usage_mw: 10500,
      capacity_percent: 90,
      last_updated: new Date().toISOString(),
      status: 'STABLE',
      is_mock: true,
      error: 'No AESO_API_KEY in .env.local',
    })
  }

  try {
    const response = await fetch(
      'https://apimgw.aeso.ca/public/currentsupplydemand-api/v2/csd/summary/current',
      {
        headers: {
          'API-Key': apiKey,
          'Accept': 'application/json',
        },
      }
    )

    if (!response.ok) {
      throw new Error(`AESO API returned ${response.status}`)
    }

    const data = await response.json()

    // The AESO CSD response has totalNet under different structures
    // depending on version. Try to extract the total load value.
    let usage_mw = null

    // v1.1 structure: data.return.alberta_internal_load or similar
    const report = data?.return || data

    if (report?.alberta_internal_load) {
      usage_mw = Math.round(parseFloat(report.alberta_internal_load))
    } else if (report?.totalNet) {
      usage_mw = Math.round(parseFloat(report.totalNet))
    } else if (report?.summary?.alberta_internal_load) {
      usage_mw = Math.round(parseFloat(report.summary.alberta_internal_load))
    } else if (Array.isArray(report)) {
      // Some versions return an array — look for the total
      const entry = report[0]
      usage_mw = Math.round(parseFloat(
        entry?.alberta_internal_load || entry?.totalNet || 0
      ))
    }

    // If we still couldn't parse it, log the structure for debugging
    if (!usage_mw || isNaN(usage_mw)) {
      console.log('AESO response structure:', JSON.stringify(data).slice(0, 500))
      return res.status(200).json({
        usage_mw: 10500,
        capacity_percent: 90,
        last_updated: new Date().toISOString(),
        status: 'STABLE',
        is_mock: true,
        error: 'Could not parse AESO response — check server logs',
        raw_keys: Object.keys(data?.return || data || {}),
      })
    }

    const status =
      usage_mw > 11500 ? 'CRITICAL' :
      usage_mw > 10500 ? 'WARNING' : 'STABLE'

    res.status(200).json({
      usage_mw,
      capacity_percent: Math.round((usage_mw / MAX_CAPACITY) * 100),
      last_updated: new Date().toISOString(),
      status,
    })
  } catch (e) {
    console.error('AESO API error:', e.message)
    res.status(200).json({
      usage_mw: 10500,
      capacity_percent: 90,
      last_updated: new Date().toISOString(),
      status: 'STABLE',
      is_mock: true,
      error: e.message,
    })
  }
}