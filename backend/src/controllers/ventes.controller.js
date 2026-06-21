const ventesService = require('../services/ventes.service')

exports.getVentes = async (req, res) => {
  try {
    const ventes = await ventesService.getVentes(req.user)
    res.json(ventes)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.createVente = async (req, res) => {
  try {
    const vente = await ventesService.createVente(req.body, req.user.id)
    res.status(201).json(vente)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}