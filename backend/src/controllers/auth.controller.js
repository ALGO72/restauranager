const authService = require('../services/auth.service')

exports.login = async (req, res) => {
  try {
    const { identifiant, motDePasse } = req.body
    if (!identifiant || !motDePasse) {
      return res.status(400).json({ error: 'Identifiant et mot de passe requis' })
    }
    const result = await authService.login(identifiant, motDePasse)
    res.json(result)
  } catch (err) {
    res.status(401).json({ error: err.message })
  }
}