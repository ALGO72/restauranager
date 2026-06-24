import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import SidebarPatron from '../../components/layout/SidebarPatron'
import api from '../../services/api'

export default function Employes() {
  const queryClient = useQueryClient()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    nom: '', prenom: '', identifiant: '', motDePasse: ''
  })

  const { data: employes = [], isLoading } = useQuery({
    queryKey: ['employes'],
    queryFn: () => api.get('/utilisateurs').then(r => r.data)
  })

  const createEmploye = useMutation({
    mutationFn: (data) => api.post('/utilisateurs', data),
    onSuccess: () => {
      queryClient.invalidateQueries(['employes'])
      setForm({ nom: '', prenom: '', identifiant: '', motDePasse: '' })
      setShowForm(false)
    }
  })

  const toggleActif = useMutation({
    mutationFn: (id) => api.put(`/utilisateurs/${id}`),
    onSuccess: () => queryClient.invalidateQueries(['employes'])
  })

  const deleteEmploye = useMutation({
    mutationFn: (id) => api.delete(`/utilisateurs/${id}`),
    onSuccess: () => queryClient.invalidateQueries(['employes'])
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    createEmploye.mutate(form)
  }

  const actifs = employes.filter(e => e.actif).length

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-stone-100">

      {/* Overlay mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div className={`fixed lg:static inset-y-0 left-0 z-30 transform transition-transform duration-200
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <SidebarPatron onClose={() => setSidebarOpen(false)} />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* Topbar */}
        <div className="bg-white border-b border-stone-200 px-4 lg:px-6 h-14 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-stone-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-base font-semibold text-stone-800">Gestion des employés</h1>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-3 py-1.5 text-xs lg:text-sm bg-red-900 text-white rounded-lg hover:bg-red-800"
          >
            + Nouvel employé
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 lg:p-6">

          {/* KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-4 mb-6">
            <div className="bg-white rounded-xl border border-stone-200 p-4">
              <div className="text-xs text-stone-400 mb-1">Total employés</div>
              <div className="text-xl lg:text-2xl font-bold text-stone-800">{employes.length}</div>
            </div>
            <div className="bg-white rounded-xl border border-l-4 border-green-400 p-4">
              <div className="text-xs text-stone-400 mb-1">Actifs</div>
              <div className="text-xl lg:text-2xl font-bold text-green-600">{actifs}</div>
            </div>
            <div className="bg-white rounded-xl border border-l-4 border-stone-300 p-4">
              <div className="text-xs text-stone-400 mb-1">Désactivés</div>
              <div className="text-xl lg:text-2xl font-bold text-stone-400">{employes.length - actifs}</div>
            </div>
          </div>

          {/* Formulaire */}
          {showForm && (
            <div className="bg-white rounded-xl border border-stone-200 p-4 lg:p-5 mb-6">
              <h2 className="text-sm font-semibold text-stone-800 mb-4">Créer un compte employé</h2>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">Nom</label>
                  <input
                    type="text"
                    required
                    value={form.nom}
                    onChange={e => setForm({ ...form, nom: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-800"
                    placeholder="Ex: Dupont"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">Prénom</label>
                  <input
                    type="text"
                    required
                    value={form.prenom}
                    onChange={e => setForm({ ...form, prenom: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-800"
                    placeholder="Ex: Jean"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">Identifiant</label>
                  <input
                    type="text"
                    required
                    value={form.identifiant}
                    onChange={e => setForm({ ...form, identifiant: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-800"
                    placeholder="Ex: jean.dupont"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">Mot de passe</label>
                  <input
                    type="password"
                    required
                    value={form.motDePasse}
                    onChange={e => setForm({ ...form, motDePasse: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-800"
                    placeholder="••••••••"
                  />
                </div>
                <div className="col-span-1 sm:col-span-2 flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 border border-stone-300 rounded-lg text-sm text-stone-600"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={createEmploye.isPending}
                    className="px-4 py-2 bg-red-900 text-white rounded-lg text-sm hover:bg-red-800 disabled:opacity-60"
                  >
                    {createEmploye.isPending ? 'Création...' : 'Créer le compte'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Liste employés */}
          <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
            <div className="px-4 lg:px-5 py-3 border-b border-stone-100">
              <h2 className="text-sm font-semibold text-stone-800">Liste des employés</h2>
            </div>
            {isLoading ? (
              <div className="p-8 text-center text-stone-400 text-sm">Chargement...</div>
            ) : employes.length === 0 ? (
              <div className="p-10 text-center">
                <div className="text-4xl mb-3">👥</div>
                <p className="text-stone-500 text-sm">Aucun employé enregistré.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[500px]">
                  <thead>
                    <tr className="bg-stone-50 text-xs text-stone-500 uppercase tracking-wider">
                      <th className="text-left px-4 lg:px-5 py-3">Employé</th>
                      <th className="text-left px-4 lg:px-5 py-3">Identifiant</th>
                      <th className="text-left px-4 lg:px-5 py-3">Créé le</th>
                      <th className="text-left px-4 lg:px-5 py-3">Statut</th>
                      <th className="px-4 lg:px-5 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {employes.map((emp, i) => (
                      <tr key={emp.id} className={i % 2 === 0 ? 'bg-white' : 'bg-stone-50'}>
                        <td className="px-4 lg:px-5 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center text-xs font-bold text-stone-600 flex-shrink-0">
                              {emp.prenom[0]}{emp.nom[0]}
                            </div>
                            <div className="text-sm font-medium text-stone-800">
                              {emp.prenom} {emp.nom}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 lg:px-5 py-3 text-sm text-stone-500 font-mono">
                          {emp.identifiant}
                        </td>
                        <td className="px-4 lg:px-5 py-3 text-sm text-stone-400">
                          {new Date(emp.creeLe).toLocaleDateString('fr-FR')}
                        </td>
                        <td className="px-4 lg:px-5 py-3">
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                            emp.actif
                              ? 'bg-green-100 text-green-700'
                              : 'bg-stone-100 text-stone-500'
                          }`}>
                            {emp.actif ? '✓ Actif' : '✗ Désactivé'}
                          </span>
                        </td>
                        <td className="px-4 lg:px-5 py-3">
                          <div className="flex gap-1 lg:gap-2">
                            <button
                              onClick={() => toggleActif.mutate(emp.id)}
                              className="text-xs border border-stone-300 px-2 lg:px-3 py-1 rounded-lg text-stone-600 hover:bg-stone-50"
                            >
                              {emp.actif ? 'Désactiver' : 'Activer'}
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Supprimer ${emp.prenom} ${emp.nom} ?`))
                                  deleteEmploye.mutate(emp.id)
                              }}
                              className="text-xs border border-red-200 px-2 lg:px-3 py-1 rounded-lg text-red-500 hover:bg-red-50"
                            >
                              Supprimer
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}