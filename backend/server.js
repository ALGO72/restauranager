const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()

// Middlewares globaux
app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())

// Routes
app.use('/api/auth',         require('./src/routes/auth.routes'))
app.use('/api/menu',         require('./src/routes/menu.routes'))
app.use('/api/ventes',       require('./src/routes/ventes.routes'))
app.use('/api/achats',       require('./src/routes/achats.routes'))
app.use('/api/stock',        require('./src/routes/stock.routes'))
app.use('/api/utilisateurs', require('./src/routes/utilisateurs.routes'))
app.use('/api/dashboard',    require('./src/routes/dashboard.routes'))

// Route de test
app.get('/', (req, res) => {
  res.json({ message: '🍽 RestauManager API en ligne !' })
})

// Middleware erreurs
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Erreur serveur' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur http://localhost:${PORT}`)
})