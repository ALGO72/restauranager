const parametresService = require('../services/parametres.service')

exports.getParametres = async (req, res) => {
  try {
    const parametres = await parametresService.getParametres()
    res.json(parametres)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.updateParametres = async (req, res) => {
  try {
    const parametres = await parametresService.updateParametres(req.body)
    res.json(parametres)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}