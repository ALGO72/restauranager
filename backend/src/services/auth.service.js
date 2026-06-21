const prisma = require('../config/db')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

exports.login = async (identifiant, motDePasse) => {
  const user = await prisma.utilisateur.findUnique({
    where: { identifiant }
  })
  if (!user || !user.actif) {
    throw new Error('Identifiant ou mot de passe incorrect')
  }
  const valid = await bcrypt.compare(motDePasse, user.motDePasse)
  if (!valid) {
    throw new Error('Identifiant ou mot de passe incorrect')
  }
  const token = jwt.sign(
    { id: user.id, role: user.role, nom: user.nom, prenom: user.prenom },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  )
  return {
    token,
    role: user.role,
    nom: user.nom,
    prenom: user.prenom,
  }
}