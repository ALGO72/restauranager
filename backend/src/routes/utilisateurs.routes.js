const router = require('express').Router()
const ctrl = require('../controllers/utilisateurs.controller')
const auth = require('../middlewares/auth.middleware')
const role = require('../middlewares/role.middleware')

router.get('/', auth, role('PATRON'), ctrl.getEmployes)
router.post('/', auth, role('PATRON'), ctrl.createEmploye)
router.put('/:id', auth, role('PATRON'), ctrl.toggleActif)
router.delete('/:id', auth, role('PATRON'), ctrl.deleteEmploye)
router.put('/:id/password', auth, ctrl.changePassword)

module.exports = router