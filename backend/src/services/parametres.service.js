const prisma = require('../config/db')

exports.getParametres = async () => {
  const params = await prisma.parametre.findMany()
  // Convertir en objet clé/valeur
  return params.reduce((obj, p) => {
    obj[p.cle] = p.valeur
    return obj
  }, {})
}

exports.updateParametres = async (data) => {
  const updates = Object.entries(data).map(([cle, valeur]) =>
    prisma.parametre.upsert({
      where: { cle },
      update: { valeur: String(valeur) },
      create: { cle, valeur: String(valeur) }
    })
  )
  await Promise.all(updates)
  return exports.getParametres()
}