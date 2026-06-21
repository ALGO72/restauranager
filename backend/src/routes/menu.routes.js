const router = require('express').Router()
const ctrl = require('../controllers/menu.controller')
const auth = require('../middlewares/auth.middleware')
const role = require('../middlewares/role.middleware')

router.get('/categories', auth, ctrl.getCategories)
router.get('/articles', auth, ctrl.getArticles)
router.post('/categories', auth, role('PATRON'), ctrl.createCategorie)
router.post('/articles', auth, role('PATRON'), ctrl.createArticle)
router.put('/articles/:id', auth, role('PATRON'), ctrl.updateArticle)
router.delete('/articles/:id', auth, role('PATRON'), ctrl.deleteArticle)
router.delete('/categories/:id', auth, role('PATRON'), ctrl.deleteCategorie)

module.exports = router