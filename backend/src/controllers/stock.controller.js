const stockService = require('../services/stock.service')

exports.getStock = async (req, res) => {
  try {
    const stock = await stockService.getStock()
    res.json(stock)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.updateStock = async (req, res) => {
  try {
    const produit = await stockService.updateStock(Number(req.params.id), req.body)
    res.json(produit)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}