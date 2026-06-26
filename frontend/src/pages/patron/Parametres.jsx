import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import SidebarPatron from '../../components/layout/SidebarPatron'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'

export default function Parametres() {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [form, setForm] = useState({
    nom_restaurant: '', devise: 'FCFA',
    telephone: '', adresse: '', logo_url: ''
  })
  const [pwForm, setPwForm] = useState({
    ancienMotDePasse: '', nouveauMotDePasse: '', confirmation: ''
  })
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' })

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type })
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000)
  }

  const { data: parametres } = useQuery({
    queryKey: ['parametres'],
    queryFn: () => api.get('/parametres').then(r => r.data),
    staleTime: 0, gcTime: 0,
  })

  useEffect(() => {
    if (parametres) setForm(parametres)
  }, [parametres])

  const updateParametres = useMutation({
    mutationFn: (data) => api.put('/parametres', data),
    onSuccess: () => {
      showToast('✅ Paramètres sauvegardés !')
      setTimeout(() => window.location.reload(), 1000)
    }
  })

  const changePassword = useMutation({
    mutationFn: (data) => api.put(`/utilisateurs/${user.id}/password`, data),
    onSuccess: () => {
      setPwForm({ ancienMotDePasse: '', nouveauMotDePasse: '', confirmation: '' })
      showToast('✅ Mot de passe modifié !')
    },
    onError: (err) => {
      showToast('❌ ' + (err.response?.data?.error ?? 'Erreur'), 'error')
    }
  })

  const handleSubmitParametres = (e) => {
    e.preventDefault()
    updateParametres.mutate(form)
  }

  const handleSubmitPassword = (e) => {
    e.preventDefault()
    if (pwForm.nouveauMotDePasse !== pwForm.confirmation) {
      showToast('❌ Les mots de passe ne correspondent pas', 'error'); return
    }
    if (pwForm.nouveauMotDePasse.length < 6) {
      showToast('❌ Minimum 6 caractères', 'error'); return
    }
    changePassword.mutate({
      ancienMotDePasse: pwForm.ancienMotDePasse,
      nouveauMotDePasse: pwForm.nouveauMotDePasse
    })
  }

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
        <div className="bg-white border-b border-stone-200 px-4 lg:px-6 h-14 flex items-center flex-shrink-0 gap-3">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-stone-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-base font-semibold text-stone-800">Paramètres</h1>
        </div>

        <div className="flex-1 overflow-y-auto p-4 lg:p-6">

          {/* Deux colonnes sur desktop, une colonne sur mobile */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Informations restaurant */}
            <form onSubmit={handleSubmitParametres}>
              <div className="bg-white rounded-xl border border-stone-200 p-4 lg:p-6">
                <h2 className="text-sm font-semibold text-stone-800 mb-4">
                  🏪 Informations du restaurant
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1">Nom du restaurant</label>
                    <input type="text" value={form.nom_restaurant}
                      onChange={e => setForm({ ...form, nom_restaurant: e.target.value })}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-800"
                      placeholder="Ex: Chez Mama Africa" />
                    <p className="text-xs text-stone-400 mt-1">Apparaît dans toute l'application</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1">Devise</label>
                    <select value={form.devise} onChange={e => setForm({ ...form, devise: e.target.value })}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-800">
                      <option value="FCFA">FCFA (Franc CFA)</option>
                      <option value="XAF">XAF</option>
                      <option value="EUR">EUR (Euro)</option>
                      <option value="USD">USD (Dollar)</option>
                      <option value="MAD">MAD (Dirham)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1">Téléphone</label>
                    <input type="text" value={form.telephone}
                      onChange={e => setForm({ ...form, telephone: e.target.value })}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-800"
                      placeholder="Ex: +237 6XX XXX XXX" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1">Adresse</label>
                    <input type="text" value={form.adresse}
                      onChange={e => setForm({ ...form, adresse: e.target.value })}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-800"
                      placeholder="Ex: Avenue Kennedy, Ngaoundéré" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1">URL du logo</label>
                    <input type="url" value={form.logo_url}
                      onChange={e => setForm({ ...form, logo_url: e.target.value })}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-800"
                      placeholder="https://exemple.com/logo.png" />
                    <p className="text-xs text-stone-400 mt-1">Hébergez sur imgur.com (gratuit)</p>
                    {form.logo_url && (
                      <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-lg mt-2">
                        <img src={form.logo_url} alt="Logo" className="w-10 h-10 object-contain rounded"
                          onError={e => e.target.style.display = 'none'} />
                        <span className="text-xs text-stone-500">Aperçu du logo</span>
                      </div>
                    )}
                  </div>
                </div>
                <button type="submit" disabled={updateParametres.isPending}
                  className="mt-5 w-full py-2.5 bg-red-900 hover:bg-red-800 text-white font-medium rounded-xl text-sm transition-colors disabled:opacity-60">
                  {updateParametres.isPending ? 'Enregistrement...' : '✓ Sauvegarder'}
                </button>
              </div>
            </form>

            {/* Mot de passe */}
            <form onSubmit={handleSubmitPassword}>
              <div className="bg-white rounded-xl border border-stone-200 p-4 lg:p-6">
                <h2 className="text-sm font-semibold text-stone-800 mb-4">
                  🔐 Modifier mon mot de passe
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1">Ancien mot de passe</label>
                    <input type="password" required value={pwForm.ancienMotDePasse}
                      onChange={e => setPwForm({ ...pwForm, ancienMotDePasse: e.target.value })}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-800"
                      placeholder="••••••••" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1">Nouveau mot de passe</label>
                    <input type="password" required value={pwForm.nouveauMotDePasse}
                      onChange={e => setPwForm({ ...pwForm, nouveauMotDePasse: e.target.value })}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-800"
                      placeholder="Minimum 6 caractères" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1">Confirmer</label>
                    <input type="password" required value={pwForm.confirmation}
                      onChange={e => setPwForm({ ...pwForm, confirmation: e.target.value })}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-800"
                      placeholder="••••••••" />
                  </div>
                  <div className="bg-stone-50 rounded-lg p-3">
                    <p className="text-xs font-medium text-stone-600 mb-2">Règles :</p>
                    <ul className="space-y-1">
                      <li className={`text-xs flex items-center gap-1 ${pwForm.nouveauMotDePasse.length >= 6 ? 'text-green-600' : 'text-stone-400'}`}>
                        {pwForm.nouveauMotDePasse.length >= 6 ? '✓' : '○'} Au moins 6 caractères
                      </li>
                      <li className={`text-xs flex items-center gap-1 ${pwForm.nouveauMotDePasse && pwForm.nouveauMotDePasse === pwForm.confirmation ? 'text-green-600' : 'text-stone-400'}`}>
                        {pwForm.nouveauMotDePasse && pwForm.nouveauMotDePasse === pwForm.confirmation ? '✓' : '○'} Mots de passe identiques
                      </li>
                    </ul>
                  </div>
                </div>
                <button type="submit" disabled={changePassword.isPending}
                  className="mt-5 w-full py-2.5 bg-stone-800 hover:bg-stone-700 text-white font-medium rounded-xl text-sm transition-colors disabled:opacity-60">
                  {changePassword.isPending ? 'Modification...' : '🔐 Modifier le mot de passe'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast.show && (
        <div className={`fixed bottom-6 right-4 lg:right-6 px-4 py-3 rounded-xl text-sm font-medium shadow-lg text-white z-50 ${
          toast.type === 'error' ? 'bg-red-600' : 'bg-green-700'
        }`}>
          {toast.message}
        </div>
      )}
    </div>
  )
}