const utilisateursService = require('../services/utilisateurs.service')

exports.getEmployes = async (req, res) => {
  try {
    const employes = await utilisateursService.getEmployes()
    res.json(employes)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.createEmploye = async (req, res) => {
  try {
    const employe = await utilisateursService.createEmploye(req.body)
    res.status(201).json(employe)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.toggleActif = async (req, res) => {
  try {
    const employe = await utilisateursService.toggleActif(Number(req.params.id))
    res.json(employe)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.deleteEmploye = async (req, res) => {
  try {
    await utilisateursService.deleteEmploye(Number(req.params.id))
    res.json({ message: 'Employé supprimé' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.changePassword = async (req, res) => {
  try {
    const { ancienMotDePasse, nouveauMotDePasse } = req.body
    const id = Number(req.params.id)

    // Vérifier que l'utilisateur modifie son propre mot de passe
    if (req.user.id !== id && req.user.role !== 'PATRON') {
      return res.status(403).json({ error: 'Accès refusé' })
    }

    await utilisateursService.changePassword(id, ancienMotDePasse, nouveauMotDePasse)
    res.json({ message: 'Mot de passe modifié avec succès' })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}