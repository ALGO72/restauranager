import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import SidebarPatron from '../../components/layout/SidebarPatron'
import api from '../../services/api'

export default function Achats() {
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    nomProduit: '', fournisseur: '', quantite: '',
    prixUnitaire: '', unite: 'kg', seuilAlerte: '', note: ''
  })

  const { data: achats = [], isLoading } = useQuery({
    queryKey: ['achats'],
    queryFn: () => api.get('/achats').then(r => r.data)
  })

  const createAchat = useMutation({
    mutationFn: (data) => api.post('/achats', data),
    onSuccess: () => {
      queryClient.invalidateQueries(['achats'])
      queryClient.invalidateQueries(['stock'])
      setForm({ nomProduit: '', fournisseur: '', quantite: '', prixUnitaire: '', unite: 'kg', seuilAlerte: '', note: '' })
      setShowForm(false)
    }
  })

  const deleteAchat = useMutation({
    mutationFn: (id) => api.delete(`/achats/${id}`),
    onSuccess: () => queryClient.invalidateQueries(['achats'])
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    createAchat.mutate(form)
  }

  const totalDepenses = achats.reduce((sum, a) => sum + a.coutTotal, 0)

  return (
    <div className="flex h-screen bg-stone-100">
      <SidebarPatron />

      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Topbar */}
        <div className="bg-white border-b border-stone-200 px-6 h-14 flex items-center justify-between flex-shrink-0">
          <h1 className="text-base font-semibold text-stone-800">Gestion des achats</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-3 py-1.5 text-sm bg-red-900 text-white rounded-lg hover:bg-red-800"
          >
            + Nouvel achat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">

          {/* KPI total dépenses */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl border border-stone-200 p-4">
              <div className="text-xs text-stone-400 mb-1">Total dépenses</div>
              <div className="text-2xl font-bold text-stone-800">
                {totalDepenses.toLocaleString('fr-FR')} FCFA
              </div>
              <div className="text-xs text-stone-400 mt-1">Tous les achats</div>
            </div>
            <div className="bg-white rounded-xl border border-stone-200 p-4">
              <div className="text-xs text-stone-400 mb-1">Nombre d'achats</div>
              <div className="text-2xl font-bold text-stone-800">{achats.length}</div>
              <div className="text-xs text-stone-400 mt-1">Transactions enregistrées</div>
            </div>
            <div className="bg-white rounded-xl border border-stone-200 p-4">
              <div className="text-xs text-stone-400 mb-1">Dernier achat</div>
              <div className="text-base font-bold text-stone-800">
                {achats.length > 0
                  ? new Date(achats[0].dateAchat).toLocaleDateString('fr-FR')
                  : '—'}
              </div>
              <div className="text-xs text-stone-400 mt-1">Date du dernier enregistrement</div>
            </div>
          </div>

          {/* Formulaire */}
          {showForm && (
            <div className="bg-white rounded-xl border border-stone-200 p-5 mb-6">
              <h2 className="text-sm font-semibold text-stone-800 mb-4">Enregistrer un achat</h2>
              <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">Produit</label>
                  <input
                    type="text"
                    required
                    value={form.nomProduit}
                    onChange={e => setForm({ ...form, nomProduit: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-800"
                    placeholder="Ex: Tomates"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">Fournisseur</label>
                  <input
                    type="text"
                    required
                    value={form.fournisseur}
                    onChange={e => setForm({ ...form, fournisseur: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-800"
                    placeholder="Ex: Marché central"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">Unité</label>
                  <select
                    value={form.unite}
                    onChange={e => setForm({ ...form, unite: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-800"
                  >
                    <option value="kg">kg</option>
                    <option value="litre">litre</option>
                    <option value="pièce">pièce</option>
                    <option value="sachet">sachet</option>
                    <option value="carton">carton</option>
                    <option value="bouteille">bouteille</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">Quantité</label>
                  <input
                    type="number"
                    required
                    value={form.quantite}
                    onChange={e => setForm({ ...form, quantite: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-800"
                    placeholder="Ex: 10"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">Prix unitaire (FCFA)</label>
                  <input
                    type="number"
                    required
                    value={form.prixUnitaire}
                    onChange={e => setForm({ ...form, prixUnitaire: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-800"
                    placeholder="Ex: 500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">Seuil d'alerte stock</label>
                  <input
                    type="number"
                    value={form.seuilAlerte}
                    onChange={e => setForm({ ...form, seuilAlerte: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-800"
                    placeholder="Ex: 2"
                  />
                </div>
                <div className="col-span-3">
                  <label className="block text-xs font-medium text-stone-600 mb-1">Note (optionnel)</label>
                  <input
                    type="text"
                    value={form.note}
                    onChange={e => setForm({ ...form, note: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-800"
                    placeholder="Remarque sur l'achat..."
                  />
                </div>

                {/* Total calculé */}
                {form.quantite && form.prixUnitaire && (
                  <div className="col-span-3 bg-stone-50 rounded-lg px-4 py-2 flex justify-between items-center">
                    <span className="text-sm text-stone-600">Coût total calculé</span>
                    <span className="text-base font-bold text-red-900">
                      {(parseFloat(form.quantite) * parseFloat(form.prixUnitaire)).toLocaleString('fr-FR')} FCFA
                    </span>
                  </div>
                )}

                <div className="col-span-3 flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 border border-stone-300 rounded-lg text-sm text-stone-600"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={createAchat.isPending}
                    className="px-4 py-2 bg-red-900 text-white rounded-lg text-sm hover:bg-red-800 disabled:opacity-60"
                  >
                    {createAchat.isPending ? 'Enregistrement...' : 'Enregistrer'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Liste des achats */}
          <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
            <div className="px-5 py-3 border-b border-stone-100">
              <h2 className="text-sm font-semibold text-stone-800">Historique des achats</h2>
            </div>
            {isLoading ? (
              <div className="p-8 text-center text-stone-400 text-sm">Chargement...</div>
            ) : achats.length === 0 ? (
              <div className="p-10 text-center">
                <div className="text-4xl mb-3">🛍</div>
                <p className="text-stone-500 text-sm">Aucun achat enregistré.</p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="bg-stone-50 text-xs text-stone-500 uppercase tracking-wider">
                    <th className="text-left px-5 py-3">Produit</th>
                    <th className="text-left px-5 py-3">Fournisseur</th>
                    <th className="text-left px-5 py-3">Quantité</th>
                    <th className="text-left px-5 py-3">Prix unitaire</th>
                    <th className="text-left px-5 py-3">Coût total</th>
                    <th className="text-left px-5 py-3">Date</th>
                    <th className="px-5 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {achats.map((achat, i) => (
                    <tr key={achat.id} className={i % 2 === 0 ? 'bg-white' : 'bg-stone-50'}>
                      <td className="px-5 py-3 text-sm font-medium text-stone-800">
                        {achat.produit.nom}
                      </td>
                      <td className="px-5 py-3 text-sm text-stone-600">{achat.fournisseur}</td>
                      <td className="px-5 py-3 text-sm text-stone-600">
                        {achat.quantite} {achat.produit.unite}
                      </td>
                      <td className="px-5 py-3 text-sm text-stone-600">
                        {Number(achat.prixUnitaire).toLocaleString('fr-FR')} FCFA
                      </td>
                      <td className="px-5 py-3 text-sm font-semibold text-red-900">
                        {Number(achat.coutTotal).toLocaleString('fr-FR')} FCFA
                      </td>
                      <td className="px-5 py-3 text-sm text-stone-400">
                        {new Date(achat.dateAchat).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-5 py-3">
                        <button
                          onClick={() => {
                            if (confirm('Supprimer cet achat ?'))
                              deleteAchat.mutate(achat.id)
                          }}
                          className="text-xs text-red-500 hover:text-red-700"
                        >
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}