const router = require('express').Router()
const ctrl = require('../controllers/dashboard.controller')
const auth = require('../middlewares/auth.middleware')
const role = require('../middlewares/role.middleware')

router.get('/stats', auth, role('PATRON'), ctrl.getStats)

module.exports = router