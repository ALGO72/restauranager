const prisma = require('../config/db')
const bcrypt = require('bcryptjs')

exports.getEmployes = () => prisma.utilisateur.findMany({
  where: { role: 'EMPLOYE' },
  select: {
    id: true, nom: true, prenom: true,
    identifiant: true, actif: true, creeLe: true
  },
  orderBy: { creeLe: 'desc' }
})

exports.createEmploye = async (data) => {
  const hash = await bcrypt.hash(data.motDePasse, 10)
  return prisma.utilisateur.create({
    data: {
      nom: data.nom,
      prenom: data.prenom,
      identifiant: data.identifiant,
      motDePasse: hash,
      role: 'EMPLOYE',
      actif: true,
    },
    select: {
      id: true, nom: true, prenom: true,
      identifiant: true, actif: true, creeLe: true
    }
  })
}

exports.toggleActif = async (id) => {
  const employe = await prisma.utilisateur.findUnique({ where: { id } })
  return prisma.utilisateur.update({
    where: { id },
    data: { actif: !employe.actif },
    select: {
      id: true, nom: true, prenom: true,
      identifiant: true, actif: true, creeLe: true
    }
  })
}

exports.deleteEmploye = (id) => prisma.utilisateur.delete({
  where: { id }
})

exports.changePassword = async (id, ancienMotDePasse, nouveauMotDePasse) => {
  const user = await prisma.utilisateur.findUnique({ where: { id } })
  if (!user) throw new Error('Utilisateur introuvable')

  const valid = await bcrypt.compare(ancienMotDePasse, user.motDePasse)
  if (!valid) throw new Error('Ancien mot de passe incorrect')

  const hash = await bcrypt.hash(nouveauMotDePasse, 10)
  return prisma.utilisateur.update({
    where: { id },
    data: { motDePasse: hash }
  })
}