const achatsService = require('../services/achats.service')

exports.getAchats = async (req, res) => {
  try {
    const achats = await achatsService.getAchats()
    res.json(achats)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.createAchat = async (req, res) => {
  try {
    const achat = await achatsService.createAchat(req.body)
    res.status(201).json(achat)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.deleteAchat = async (req, res) => {
  try {
    await achatsService.deleteAchat(Number(req.params.id))
    res.json({ message: 'Achat supprimé' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}