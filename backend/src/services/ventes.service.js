const prisma = require('../config/db')

exports.getVentes = (user) => prisma.vente.findMany({
  where: user.role === 'EMPLOYE' ? { employeId: user.id } : {},
  include: {
    employe: { select: { nom: true, prenom: true } },
    lignes: { include: { article: true } }
  },
  orderBy: { dateHeure: 'desc' }
})

exports.createVente = async (data, employeId) => {
  const montantTotal = data.lignes.reduce(
    (sum, l) => sum + l.prixUnitaire * l.quantite, 0
  )

  // Créer la vente
  const vente = await prisma.vente.create({
    data: {
      employeId,
      montantTotal,
      note: data.note ?? null,
      lignes: {
        create: data.lignes.map(l => ({
          articleId: l.articleId,
          quantite: l.quantite,
          prixUnitaire: l.prixUnitaire,
          sousTotal: l.prixUnitaire * l.quantite,
        }))
      }
    },
    include: {
      lignes: { include: { article: { include: { produitStock: true } } } }
    }
  })

  // Déduire automatiquement le stock pour les produits revendables
  for (const ligne of vente.lignes) {
    const produit = ligne.article.produitStock
    if (produit && produit.revendable) {
      await prisma.produitStock.update({
        where: { id: produit.id },
        data: {
          quantiteStock: {
            decrement: ligne.quantite
          }
        }
      })
    }
  }

  return vente
}