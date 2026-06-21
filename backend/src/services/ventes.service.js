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
  return prisma.vente.create({
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
      lignes: { include: { article: true } }
    }
  })
}