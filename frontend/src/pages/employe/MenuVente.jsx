import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import SidebarEmploye from '../../components/layout/SidebarEmploye'
import api from '../../services/api'

export default function MenuVente() {
  const queryClient = useQueryClient()
  const [order, setOrder] = useState({})
  const [catActive, setCatActive] = useState('all')
  const [toast, setToast] = useState(false)

  const { data: articles = [] } = useQuery({
    queryKey: ['articles'],
    queryFn: () => api.get('/menu/articles').then(r => r.data)
  })

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get('/menu/categories').then(r => r.data)
  })

  const createVente = useMutation({
    mutationFn: (data) => api.post('/ventes', data),
    onSuccess: () => {
      queryClient.invalidateQueries(['ventes-employe'])
      setOrder({})
      setToast(true)
      setTimeout(() => setToast(false), 3000)
    }
  })

  const addItem = (article) => {
    setOrder(prev => ({
      ...prev,
      [article.id]: {
        article,
        qty: (prev[article.id]?.qty ?? 0) + 1
      }
    }))
  }

  const changeQty = (id, delta) => {
    setOrder(prev => {
      const newQty = (prev[id]?.qty ?? 0) + delta
      if (newQty <= 0) {
        const next = { ...prev }
        delete next[id]
        return next
      }
      return { ...prev, [id]: { ...prev[id], qty: newQty } }
    })
  }

  const handleConfirm = () => {
    const keys = Object.keys(order)
    if (!keys.length) return
    const lignes = keys.map(id => ({
      articleId: parseInt(id),
      quantite: order[id].qty,
      prixUnitaire: order[id].article.prixVente,
    }))
    createVente.mutate({ lignes })
  }

  const filtered = catActive === 'all'
    ? articles.filter(a => a.disponible)
    : articles.filter(a => a.categorieId === parseInt(catActive) && a.disponible)

  const grouped = categories.map(cat => ({
    ...cat,
    articles: filtered.filter(a => a.categorieId === cat.id)
  })).filter(cat => cat.articles.length > 0)

  const orderKeys = Object.keys(order)
  const total = orderKeys.reduce((sum, id) => sum + order[id].article.prixVente * order[id].qty, 0)
  const totalArticles = orderKeys.reduce((sum, id) => sum + order[id].qty, 0)

  return (
    <div className="flex h-screen bg-stone-100">
      <SidebarEmploye />

      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Topbar */}
        <div className="bg-white border-b border-stone-200 px-6 h-14 flex items-center justify-between flex-shrink-0">
          <h1 className="text-base font-semibold text-stone-800">Menu du restaurant</h1>
          <span className="text-sm text-stone-400">
            {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </span>
        </div>

        <div className="flex-1 flex overflow-hidden">

          {/* Zone menu */}
          <div className="flex-1 overflow-y-auto p-5">

            {/* Filtres catégories */}
            <div className="flex gap-2 mb-5 flex-wrap">
              <button
                onClick={() => setCatActive('all')}
                className={`px-4 py-1.5 rounded-full text-sm border transition-colors ${
                  catActive === 'all'
                    ? 'bg-red-900 text-white border-red-900'
                    : 'bg-white text-stone-500 border-stone-300 hover:border-red-900 hover:text-red-900'
                }`}
              >
                Tous
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setCatActive(cat.id.toString())}
                  className={`px-4 py-1.5 rounded-full text-sm border transition-colors ${
                    catActive === cat.id.toString()
                      ? 'bg-red-900 text-white border-red-900'
                      : 'bg-white text-stone-500 border-stone-300 hover:border-red-900 hover:text-red-900'
                  }`}
                >
                  {cat.nom}
                </button>
              ))}
            </div>

            {/* Articles */}
            {articles.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-4xl mb-3">🍽</div>
                <p className="text-stone-400 text-sm">Aucun article disponible dans le menu.</p>
              </div>
            ) : (
              grouped.map(cat => (
                <div key={cat.id} className="mb-6">
                  <div className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3">
                    {cat.nom}
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {cat.articles.map(article => (
                      <div
                        key={article.id}
                        onClick={() => addItem(article)}
                        className={`bg-white rounded-xl border p-4 cursor-pointer transition-all ${
                          order[article.id]
                            ? 'border-2 border-red-900 bg-red-50'
                            : 'border-stone-200 hover:border-red-900'
                        }`}
                      >
                        <div className="font-medium text-stone-800 text-sm mb-1">
                          {article.nom}
                        </div>
                        {article.description && (
                          <div className="text-xs text-stone-400 mb-2">{article.description}</div>
                        )}
                        <div className="text-red-900 font-bold text-base">
                          {Number(article.prixVente).toLocaleString('fr-FR')} FCFA
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Panneau commande */}
          <div className="w-64 bg-white border-l border-stone-200 flex flex-col flex-shrink-0">
            <div className="px-4 py-3 border-b border-stone-100">
              <div className="text-sm font-semibold text-stone-800">Commande en cours</div>
              <div className="text-xs text-stone-400 mt-0.5">
                {totalArticles > 0 ? `${totalArticles} article${totalArticles > 1 ? 's' : ''}` : 'Aucun article'}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-3">
              {orderKeys.length === 0 ? (
                <div className="text-center py-10 text-stone-300">
                  <div className="text-3xl mb-2">🛒</div>
                  <div className="text-xs">Sélectionnez des articles</div>
                </div>
              ) : (
                orderKeys.map(id => {
                  const { article, qty } = order[id]
                  return (
                    <div key={id} className="flex items-center gap-2 py-2 border-b border-stone-50">
                      <div className="flex-1 text-xs text-stone-700 font-medium">{article.nom}</div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => changeQty(id, -1)}
                          className="w-5 h-5 rounded border border-stone-300 text-xs flex items-center justify-center hover:bg-stone-100"
                        >−</button>
                        <span className="text-xs font-bold w-4 text-center">{qty}</span>
                        <button
                          onClick={() => changeQty(id, 1)}
                          className="w-5 h-5 rounded border border-stone-300 text-xs flex items-center justify-center hover:bg-stone-100"
                        >+</button>
                      </div>
                      <div className="text-xs text-stone-500 min-w-[50px] text-right">
                        {(article.prixVente * qty).toLocaleString('fr-FR')} F
                      </div>
                    </div>
                  )
                })
              )}
            </div>

            <div className="px-4 py-4 border-t border-stone-100">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm text-stone-500">Total</span>
                <span className="text-xl font-bold text-red-900">
                  {total.toLocaleString('fr-FR')} FCFA
                </span>
              </div>
              <button
                onClick={handleConfirm}
                disabled={!orderKeys.length || createVente.isPending}
                className="w-full py-3 bg-red-900 hover:bg-red-800 text-white font-medium
                           rounded-xl text-sm transition-colors disabled:opacity-40"
              >
                {createVente.isPending ? 'Enregistrement...' : '✓ Confirmer la vente'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Toast succès */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-green-700 text-white px-5 py-3 rounded-xl text-sm font-medium shadow-lg">
          ✅ Vente enregistrée avec succès !
        </div>
      )}
    </div>
  )
}