const prisma = require('../config/db')

exports.getStock = () => prisma.produitStock.findMany({
  include: { categorie: true },
  orderBy: { nom: 'asc' }
})

exports.updateStock = (id, data) => prisma.produitStock.update({
  where: { id },
  data: {
    quantiteStock: parseFloat(data.quantiteStock),
    seuilAlerte: parseFloat(data.seuilAlerte),
    revendable: data.revendable ?? false,
  }
})