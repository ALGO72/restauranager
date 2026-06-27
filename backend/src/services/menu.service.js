const prisma = require('../config/db')

exports.getCategories = () => prisma.categorieMenu.findMany({
  orderBy: { ordre: 'asc' }
})

exports.getArticles = () => prisma.articleMenu.findMany({
  include: { categorie: true, produitStock: true },
  orderBy: { nom: 'asc' }
})

exports.createCategorie = (data) => prisma.categorieMenu.create({
  data: { nom: data.nom, ordre: data.ordre ?? 0 }
})

exports.createArticle = (data) => prisma.articleMenu.create({
  data: {
    nom: data.nom,
    prixVente: parseFloat(data.prixVente),
    disponible: data.disponible ?? true,
    description: data.description ?? null,
    categorieId: parseInt(data.categorieId),
    produitStockId: data.produitStockId ? parseInt(data.produitStockId) : null,
  }
})

exports.updateArticle = (id, data) => prisma.articleMenu.update({
  where: { id },
  data: {
    nom: data.nom,
    prixVente: parseFloat(data.prixVente),
    disponible: data.disponible,
    description: data.description ?? null,
    categorieId: parseInt(data.categorieId),
    produitStockId: data.produitStockId ? parseInt(data.produitStockId) : null,
  }
})

exports.deleteArticle = (id) => prisma.articleMenu.delete({ where: { id } })

exports.deleteCategorie = (id) => prisma.categorieMenu.delete({ where: { id } })