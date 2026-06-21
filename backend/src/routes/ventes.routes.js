const router = require('express').Router()
const ctrl = require('../controllers/ventes.controller')
const auth = require('../middlewares/auth.middleware')
const role = require('../middlewares/role.middleware')

router.get('/', auth, ctrl.getVentes)
router.post('/', auth, role('EMPLOYE'), ctrl.createVente)

module.exports = router