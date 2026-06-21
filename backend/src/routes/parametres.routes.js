const router = require('express').Router()
const ctrl = require('../controllers/parametres.controller')
const auth = require('../middlewares/auth.middleware')
const role = require('../middlewares/role.middleware')

router.get('/', auth, ctrl.getParametres)
router.put('/', auth, role('PATRON'), ctrl.updateParametres)

module.exports = router