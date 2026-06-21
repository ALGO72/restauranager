const menuService = require('../services/menu.service')

exports.getCategories = async (req, res) => {
  try {
    const categories = await menuService.getCategories()
    res.json(categories)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.getArticles = async (req, res) => {
  try {
    const articles = await menuService.getArticles()
    res.json(articles)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.createCategorie = async (req, res) => {
  try {
    const categorie = await menuService.createCategorie(req.body)
    res.status(201).json(categorie)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.createArticle = async (req, res) => {
  try {
    const article = await menuService.createArticle(req.body)
    res.status(201).json(article)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.updateArticle = async (req, res) => {
  try {
    const article = await menuService.updateArticle(Number(req.params.id), req.body)
    res.json(article)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.deleteArticle = async (req, res) => {
  try {
    await menuService.deleteArticle(Number(req.params.id))
    res.json({ message: 'Article supprimé' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.deleteCategorie = async (req, res) => {
  try {
    await menuService.deleteCategorie(Number(req.params.id))
    res.json({ message: 'Catégorie supprimée' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}