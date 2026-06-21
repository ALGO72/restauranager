const router = require('express').Router()
const ctrl = require('../controllers/stock.controller')
const auth = require('../middlewares/auth.middleware')
const role = require('../middlewares/role.middleware')

router.get('/', auth, role('PATRON'), ctrl.getStock)
router.put('/:id', auth, role('PATRON'), ctrl.updateStock)

module.exports = router