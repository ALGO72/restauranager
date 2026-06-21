import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ identifiant: '', motDePasse: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await api.post('/auth/login', form)
      login(data)
      navigate(data.role === 'PATRON' ? '/patron/dashboard' : '/employe/menu')
    } catch (err) {
      setError('Identifiant ou mot de passe incorrect.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-stone-100 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-8 w-full max-w-sm">

        <div className="text-center mb-8">
          <div className="text-3xl mb-2">🍽</div>
          <h1 className="text-xl font-semibold text-stone-800">RestauManager</h1>
          <p className="text-sm text-stone-500 mt-1">Connectez-vous à votre espace</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Identifiant
            </label>
            <input
              type="text"
              required
              value={form.identifiant}
              onChange={e => setForm({ ...form, identifiant: e.target.value })}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm
                         focus:outline-none focus:ring-2 focus:ring-red-800 focus:border-transparent"
              placeholder="Votre identifiant"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Mot de passe
            </label>
            <input
              type="password"
              required
              value={form.motDePasse}
              onChange={e => setForm({ ...form, motDePasse: e.target.value })}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm
                         focus:outline-none focus:ring-2 focus:ring-red-800 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-red-900 hover:bg-red-800 text-white font-medium
                       rounded-lg text-sm transition-colors disabled:opacity-60"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  )
}