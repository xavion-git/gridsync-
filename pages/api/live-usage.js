const MAX_CAPACITY = 11700

export default async function handler(req, res) {
  try {
    const response = await fetch(
      'https://ets.aeso.ca/ets_web/ip/Market/Reports/CSDReportServlet'
    )
    const text = await response.text()

    const match = text.match(/(\d{4,5}\.?\d*)\s*MW/i)
    const usage_mw = match ? Math.round(parseFloat(match[1])) : 10500

    const status =
      usage_mw > 11500 ? 'CRITICAL' :
      usage_mw > 10500 ? 'WARNING'  : 'STABLE'

    res.status(200).json({
      usage_mw,
      capacity_percent: Math.round((usage_mw / MAX_CAPACITY) * 100),
      last_updated: new Date().toISOString(),
      status,
    })
  } catch (e) {
    res.status(200).json({
      usage_mw: 10500,
      capacity_percent: 90,
      last_updated: new Date().toISOString(),
      status: 'STABLE',
      is_mock: true,
    })
  }
}