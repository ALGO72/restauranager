const dashboardService = require('../services/dashboard.service')

exports.getStats = async (req, res) => {
  try {
    const { periode } = req.query
    const stats = await dashboardService.getStats(periode)
    res.json(stats)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}