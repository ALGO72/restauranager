const prisma = require('../config/db')

exports.getStats = async (periode = 'jour') => {
  const now = new Date()
  let debut

  if (periode === 'jour') {
    debut = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  } else if (periode === 'semaine') {
    debut = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  } else if (periode === 'mois') {
    debut = new Date(now.getFullYear(), now.getMonth(), 1)
  } else {
    debut = new Date(0)
  }

  const [ventes, achats, stock] = await Promise.all([
    prisma.vente.findMany({
      where: { dateHeure: { gte: debut } },
      include: { lignes: true }
    }),
    prisma.achat.findMany({
      where: { dateAchat: { gte: debut } }
    }),
    prisma.produitStock.findMany()
  ])

  const ca = ventes.reduce((sum, v) => sum + v.montantTotal, 0)
  const depenses = achats.reduce((sum, a) => sum + a.coutTotal, 0)
  const benefice = ca - depenses
  const alertesStock = stock.filter(p => p.quantiteStock <= p.seuilAlerte).length

  return {
    ca,
    depenses,
    benefice,
    nbVentes: ventes.length,
    alertesStock,
  }
}