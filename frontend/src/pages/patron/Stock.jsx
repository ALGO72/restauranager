import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import SidebarPatron from '../../components/layout/SidebarPatron'
import api from '../../services/api'

export default function Stock() {
  const queryClient = useQueryClient()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [editProduit, setEditProduit] = useState(null)
  const [form, setForm] = useState({ quantiteStock: '', seuilAlerte: '', revendable: false })

  const { data: stock = [], isLoading } = useQuery({
    queryKey: ['stock'],
    queryFn: () => api.get('/stock').then(r => r.data)
  })

  const updateStock = useMutation({
    mutationFn: ({ id, data }) => api.put(`/stock/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['stock'])
      setEditProduit(null)
    }
  })

  const handleEdit = (produit) => {
    setEditProduit(produit)
    setForm({
      quantiteStock: produit.quantiteStock,
      seuilAlerte: produit.seuilAlerte,
      revendable: produit.revendable ?? false
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    updateStock.mutate({ id: editProduit.id, data: form })
  }

  const enAlerte = stock.filter(p => p.quantiteStock <= p.seuilAlerte)
  const normal = stock.filter(p => p.quantiteStock > p.seuilAlerte)

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-stone-100">

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className={`fixed lg:static inset-y-0 left-0 z-30 transform transition-transform duration-200
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <SidebarPatron onClose={() => setSidebarOpen(false)} />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">

        <div className="bg-white border-b border-stone-200 px-4 lg:px-6 h-14 flex items-center gap-3 flex-shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-stone-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-base font-semibold text-stone-800">Gestion du stock</h1>
        </div>

        <div className="flex-1 overflow-y-auto p-4 lg:p-6">

          {/* KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-4 mb-6">
            <div className="bg-white rounded-xl border border-stone-200 p-4">
              <div className="text-xs text-stone-400 mb-1">Total produits</div>
              <div className="text-xl lg:text-2xl font-bold text-stone-800">{stock.length}</div>
              <div className="text-xs text-stone-400 mt-1">En stock</div>
            </div>
            <div className="bg-white rounded-xl border border-l-4 border-red-400 p-4">
              <div className="text-xs text-stone-400 mb-1">⚠ Alertes</div>
              <div className="text-xl lg:text-2xl font-bold text-red-500">{enAlerte.length}</div>
              <div className="text-xs text-red-400 mt-1">Produits bas ou épuisés</div>
            </div>
            <div className="bg-white rounded-xl border border-l-4 border-green-400 p-4">
              <div className="text-xs text-stone-400 mb-1">✓ Normal</div>
              <div className="text-xl lg:text-2xl font-bold text-green-600">{normal.length}</div>
              <div className="text-xs text-green-500 mt-1">Quantité suffisante</div>
            </div>
          </div>

          {/* Modal modification */}
          {editProduit && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl border border-stone-200 p-6 w-full max-w-sm">
                <h2 className="text-sm font-semibold text-stone-800 mb-4">
                  Modifier — {editProduit.nom}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1">
                      Quantité en stock ({editProduit.unite})
                    </label>
                    <input type="number" step="0.01" required value={form.quantiteStock}
                      onChange={e => setForm({ ...form, quantiteStock: e.target.value })}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-800" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1">
                      Seuil d'alerte ({editProduit.unite})
                    </label>
                    <input type="number" step="0.01" required value={form.seuilAlerte}
                      onChange={e => setForm({ ...form, seuilAlerte: e.target.value })}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-800" />
                  </div>

                  {/* Toggle revendable */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-center gap-3">
                      <input type="checkbox" id="revendable" checked={form.revendable}
                        onChange={e => setForm({ ...form, revendable: e.target.checked })}
                        className="w-4 h-4 accent-blue-600" />
                      <div>
                        <label htmlFor="revendable" className="text-sm font-medium text-stone-700">
                          Produit revendable
                        </label>
                        <p className="text-xs text-stone-400 mt-0.5">
                          Le stock sera déduit automatiquement à chaque vente liée.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end">
                    <button type="button" onClick={() => setEditProduit(null)}
                      className="px-4 py-2 border border-stone-300 rounded-lg text-sm text-stone-600">Annuler</button>
                    <button type="submit"
                      className="px-4 py-2 bg-red-900 text-white rounded-lg text-sm hover:bg-red-800">Enregistrer</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Liste stock */}
          {isLoading ? (
            <div className="p-8 text-center text-stone-400 text-sm">Chargement...</div>
          ) : stock.length === 0 ? (
            <div className="bg-white rounded-xl border border-stone-200 p-10 text-center">
              <div className="text-4xl mb-3">📦</div>
              <p className="text-stone-500 text-sm">Aucun produit. Enregistrez des achats pour alimenter le stock.</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
              <div className="px-4 lg:px-5 py-3 border-b border-stone-100">
                <h2 className="text-sm font-semibold text-stone-800">État du stock</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[500px]">
                  <thead>
                    <tr className="bg-stone-50 text-xs text-stone-500 uppercase tracking-wider">
                      <th className="text-left px-4 lg:px-5 py-3">Produit</th>
                      <th className="text-left px-4 lg:px-5 py-3">Quantité</th>
                      <th className="text-left px-4 lg:px-5 py-3">Seuil</th>
                      <th className="text-left px-4 lg:px-5 py-3">Revendable</th>
                      <th className="text-left px-4 lg:px-5 py-3">Statut</th>
                      <th className="px-4 lg:px-5 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {stock.map((produit, i) => {
                      const alerte = produit.quantiteStock <= produit.seuilAlerte
                      return (
                        <tr key={produit.id} className={i % 2 === 0 ? 'bg-white' : 'bg-stone-50'}>
                          <td className="px-4 lg:px-5 py-3 text-sm font-medium text-stone-800">
                            {produit.nom}
                          </td>
                          <td className="px-4 lg:px-5 py-3 text-sm text-stone-800 font-medium">
                            {produit.quantiteStock} {produit.unite}
                          </td>
                          <td className="px-4 lg:px-5 py-3 text-sm text-stone-500">
                            {produit.seuilAlerte} {produit.unite}
                          </td>
                          <td className="px-4 lg:px-5 py-3">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                              produit.revendable
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-stone-100 text-stone-500'
                            }`}>
                              {produit.revendable ? '🔗 Oui' : 'Non'}
                            </span>
                          </td>
                          <td className="px-4 lg:px-5 py-3">
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                              alerte ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'
                            }`}>
                              {alerte ? '⚠ Bas' : '✓ OK'}
                            </span>
                          </td>
                          <td className="px-4 lg:px-5 py-3">
                            <button onClick={() => handleEdit(produit)}
                              className="text-xs text-stone-500 hover:text-stone-800 border border-stone-300 px-3 py-1 rounded-lg">
                              Ajuster
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}