const prisma = require('../config/db')

exports.getAchats = () => prisma.achat.findMany({
  include: { produit: true },
  orderBy: { dateAchat: 'desc' }
})

exports.createAchat = (data) => prisma.achat.create({
  data: {
    fournisseur: data.fournisseur,
    quantite: parseFloat(data.quantite),
    prixUnitaire: parseFloat(data.prixUnitaire),
    coutTotal: parseFloat(data.quantite) * parseFloat(data.prixUnitaire),
    note: data.note ?? null,
    dateAchat: new Date(),
    produit: {
      connectOrCreate: {
        where: { id: data.produitId ?? 0 },
        create: {
          nom: data.nomProduit,
          unite: data.unite,
          quantiteStock: parseFloat(data.quantite),
          seuilAlerte: parseFloat(data.seuilAlerte ?? 0),
          categorie: {
            connectOrCreate: {
              where: { id: data.categorieProduitId ?? 0 },
              create: { nom: data.nomCategorie ?? 'Général' }
            }
          }
        }
      }
    }
  },
  include: { produit: true }
})

exports.deleteAchat = (id) => prisma.achat.delete({
  where: { id }
})