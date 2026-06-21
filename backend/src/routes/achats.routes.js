const router = require('express').Router()
const ctrl = require('../controllers/achats.controller')
const auth = require('../middlewares/auth.middleware')
const role = require('../middlewares/role.middleware')

router.get('/', auth, role('PATRON'), ctrl.getAchats)
router.post('/', auth, role('PATRON'), ctrl.createAchat)
router.delete('/:id', auth, role('PATRON'), ctrl.deleteAchat)

module.exports = router