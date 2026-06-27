import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import SidebarPatron from '../../components/layout/SidebarPatron'
import api from '../../services/api'

export default function Menu() {
  const queryClient = useQueryClient()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editArticle, setEditArticle] = useState(null)
  const [form, setForm] = useState({
    nom: '', prixVente: '', categorieId: '',
    description: '', disponible: true, produitStockId: ''
  })
  const [showCatForm, setShowCatForm] = useState(false)
  const [newCat, setNewCat] = useState('')

  const { data: articles = [] } = useQuery({
    queryKey: ['articles'],
    queryFn: () => api.get('/menu/articles').then(r => r.data)
  })

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get('/menu/categories').then(r => r.data)
  })

  const { data: stock = [] } = useQuery({
    queryKey: ['stock'],
    queryFn: () => api.get('/stock').then(r => r.data)
  })

  // Seulement les produits revendables
  const produitsRevendables = stock.filter(p => p.revendable)

  const createArticle = useMutation({
    mutationFn: (data) => api.post('/menu/articles', data),
    onSuccess: () => { queryClient.invalidateQueries(['articles']); resetForm() }
  })

  const updateArticle = useMutation({
    mutationFn: ({ id, data }) => api.put(`/menu/articles/${id}`, data),
    onSuccess: () => { queryClient.invalidateQueries(['articles']); resetForm() }
  })

  const deleteArticle = useMutation({
    mutationFn: (id) => api.delete(`/menu/articles/${id}`),
    onSuccess: () => queryClient.invalidateQueries(['articles'])
  })

  const createCategorie = useMutation({
    mutationFn: (data) => api.post('/menu/categories', data),
    onSuccess: () => { queryClient.invalidateQueries(['categories']); setNewCat(''); setShowCatForm(false) }
  })

  const deleteCategorie = useMutation({
    mutationFn: (id) => api.delete(`/menu/categories/${id}`),
    onSuccess: () => queryClient.invalidateQueries(['categories'])
  })

  const resetForm = () => {
    setForm({ nom: '', prixVente: '', categorieId: '', description: '', disponible: true, produitStockId: '' })
    setShowForm(false)
    setEditArticle(null)
  }

  const handleEdit = (article) => {
    setEditArticle(article)
    setForm({
      nom: article.nom,
      prixVente: article.prixVente,
      categorieId: article.categorieId,
      description: article.description ?? '',
      disponible: article.disponible,
      produitStockId: article.produitStockId ?? ''
    })
    setShowForm(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editArticle) {
      updateArticle.mutate({ id: editArticle.id, data: form })
    } else {
      createArticle.mutate(form)
    }
  }

  const grouped = categories.map(cat => ({
    ...cat,
    articles: articles.filter(a => a.categorieId === cat.id)
  }))

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

        <div className="bg-white border-b border-stone-200 px-4 lg:px-6 h-14 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-stone-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-base font-semibold text-stone-800">Gestion du menu</h1>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowCatForm(!showCatForm)}
              className="px-2 lg:px-3 py-1.5 text-xs lg:text-sm border border-stone-300 rounded-lg text-stone-600 hover:bg-stone-50">
              + Catégorie
            </button>
            <button onClick={() => { resetForm(); setShowForm(true) }}
              className="px-2 lg:px-3 py-1.5 text-xs lg:text-sm bg-red-900 text-white rounded-lg hover:bg-red-800">
              + Article
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 lg:p-6">

          {/* Formulaire catégorie */}
          {showCatForm && (
            <div className="bg-white rounded-xl border border-stone-200 p-4 mb-4 flex flex-col sm:flex-row gap-3">
              <input type="text" placeholder="Nom de la catégorie (ex: Plats, Boissons...)"
                value={newCat} onChange={e => setNewCat(e.target.value)}
                className="flex-1 px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-800" />
              <div className="flex gap-2">
                <button onClick={() => createCategorie.mutate({ nom: newCat })}
                  className="flex-1 sm:flex-none px-4 py-2 bg-red-900 text-white rounded-lg text-sm">Créer</button>
                <button onClick={() => setShowCatForm(false)}
                  className="flex-1 sm:flex-none px-4 py-2 border border-stone-300 rounded-lg text-sm text-stone-600">Annuler</button>
              </div>
            </div>
          )}

          {/* Formulaire article */}
          {showForm && (
            <div className="bg-white rounded-xl border border-stone-200 p-4 lg:p-5 mb-4">
              <h2 className="text-sm font-semibold text-stone-800 mb-4">
                {editArticle ? "Modifier l'article" : 'Nouvel article'}
              </h2>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">Nom</label>
                  <input type="text" required value={form.nom}
                    onChange={e => setForm({ ...form, nom: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-800"
                    placeholder="Ex: Bière Castel" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">Prix (FCFA)</label>
                  <input type="number" required value={form.prixVente}
                    onChange={e => setForm({ ...form, prixVente: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-800"
                    placeholder="Ex: 700" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">Catégorie</label>
                  <select required value={form.categorieId}
                    onChange={e => setForm({ ...form, categorieId: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-800">
                    <option value="">Choisir une catégorie</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.nom}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">Description (optionnel)</label>
                  <input type="text" value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-800"
                    placeholder="Ex: 33cl" />
                </div>

                {/* Sélecteur produit stock revendable */}
                <div className="col-span-1 sm:col-span-2">
                  <label className="block text-xs font-medium text-stone-600 mb-1">
                    Lier au stock (produit revendable) — optionnel
                  </label>
                  <select value={form.produitStockId}
                    onChange={e => setForm({ ...form, produitStockId: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-800">
                    <option value="">Aucun (plat cuisiné)</option>
                    {produitsRevendables.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.nom} ({p.quantiteStock} {p.unite} en stock)
                      </option>
                    ))}
                  </select>
                  {form.produitStockId && (
                    <p className="text-xs text-blue-600 mt-1">
                      ✓ Le stock se déduira automatiquement à chaque vente
                    </p>
                  )}
                  {produitsRevendables.length === 0 && (
                    <p className="text-xs text-stone-400 mt-1">
                      Aucun produit revendable. Allez dans Stock → Ajuster → activez "Revendable".
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <input type="checkbox" id="disponible" checked={form.disponible}
                    onChange={e => setForm({ ...form, disponible: e.target.checked })}
                    className="w-4 h-4 accent-red-900" />
                  <label htmlFor="disponible" className="text-sm text-stone-600">Disponible</label>
                </div>

                <div className="col-span-1 sm:col-span-2 flex gap-2 justify-end">
                  <button type="button" onClick={resetForm}
                    className="px-4 py-2 border border-stone-300 rounded-lg text-sm text-stone-600">Annuler</button>
                  <button type="submit"
                    className="px-4 py-2 bg-red-900 text-white rounded-lg text-sm hover:bg-red-800">
                    {editArticle ? 'Modifier' : 'Ajouter'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Liste articles */}
          {categories.length === 0 ? (
            <div className="bg-white rounded-xl border border-stone-200 p-10 text-center">
              <div className="text-4xl mb-3">🍽</div>
              <p className="text-stone-500 text-sm">Aucune catégorie.</p>
            </div>
          ) : (
            grouped.map(cat => (
              <div key={cat.id} className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-wider">
                    {cat.nom} ({cat.articles.length})
                  </h2>
                  {cat.articles.length === 0 && (
                    <button
                      onClick={() => { if (confirm(`Supprimer "${cat.nom}" ?`)) deleteCategorie.mutate(cat.id) }}
                      className="text-xs text-red-500 hover:text-red-700 underline">
                      Supprimer
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {cat.articles.map(article => (
                    <div key={article.id} className="bg-white rounded-xl border border-stone-200 p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="font-medium text-stone-800 text-sm">{article.nom}</div>
                        <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ml-2 ${
                          article.disponible ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                        }`}>
                          {article.disponible ? 'Dispo' : 'Indispo'}
                        </span>
                      </div>
                      {article.description && (
                        <p className="text-xs text-stone-400 mb-1">{article.description}</p>
                      )}
                      {article.produitStock && (
                        <p className="text-xs text-blue-600 mb-1">
                          📦 Stock lié : {article.produitStock.nom} ({article.produitStock.quantiteStock} {article.produitStock.unite})
                        </p>
                      )}
                      <div className="text-red-900 font-bold text-base mb-3">
                        {Number(article.prixVente).toLocaleString('fr-FR')} FCFA
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(article)}
                          className="flex-1 text-xs py-1.5 border border-stone-300 rounded-lg text-stone-600 hover:bg-stone-50">
                          Modifier
                        </button>
                        <button onClick={() => { if (confirm('Supprimer ?')) deleteArticle.mutate(article.id) }}
                          className="flex-1 text-xs py-1.5 border border-red-200 rounded-lg text-red-600 hover:bg-red-50">
                          Supprimer
                        </button>
                      </div>
                    </div>
                  ))}
                  {cat.articles.length === 0 && (
                    <p className="text-sm text-stone-400 col-span-full">Aucun article.</p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}