import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import SidebarPatron from '../../components/layout/SidebarPatron'
import api from '../../services/api'

export default function Menu() {
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [editArticle, setEditArticle] = useState(null)
  const [form, setForm] = useState({ nom: '', prixVente: '', categorieId: '', description: '', disponible: true })
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
    setForm({ nom: '', prixVente: '', categorieId: '', description: '', disponible: true })
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
      disponible: article.disponible
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
    <div className="flex h-screen bg-stone-100">
      <SidebarPatron />

      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Topbar */}
        <div className="bg-white border-b border-stone-200 px-6 h-14 flex items-center justify-between flex-shrink-0">
          <h1 className="text-base font-semibold text-stone-800">Gestion du menu</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setShowCatForm(!showCatForm)}
              className="px-3 py-1.5 text-sm border border-stone-300 rounded-lg text-stone-600 hover:bg-stone-50"
            >
              + Catégorie
            </button>
            <button
              onClick={() => { resetForm(); setShowForm(true) }}
              className="px-3 py-1.5 text-sm bg-red-900 text-white rounded-lg hover:bg-red-800"
            >
              + Article
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">

          {/* Formulaire nouvelle catégorie */}
          {showCatForm && (
            <div className="bg-white rounded-xl border border-stone-200 p-4 mb-4 flex gap-3">
              <input
                type="text"
                placeholder="Nom de la catégorie (ex: Plats, Boissons...)"
                value={newCat}
                onChange={e => setNewCat(e.target.value)}
                className="flex-1 px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-800"
              />
              <button
                onClick={() => createCategorie.mutate({ nom: newCat })}
                className="px-4 py-2 bg-red-900 text-white rounded-lg text-sm hover:bg-red-800"
              >
                Créer
              </button>
              <button
                onClick={() => setShowCatForm(false)}
                className="px-4 py-2 border border-stone-300 rounded-lg text-sm text-stone-600"
              >
                Annuler
              </button>
            </div>
          )}

          {/* Formulaire article */}
          {showForm && (
            <div className="bg-white rounded-xl border border-stone-200 p-5 mb-4">
              <h2 className="text-sm font-semibold text-stone-800 mb-4">
                {editArticle ? "Modifier l'article" : 'Nouvel article'}
              </h2>
              <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">Nom</label>
                  <input
                    type="text"
                    required
                    value={form.nom}
                    onChange={e => setForm({ ...form, nom: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-800"
                    placeholder="Ex: Poulet braisé"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">Prix (FCFA)</label>
                  <input
                    type="number"
                    required
                    value={form.prixVente}
                    onChange={e => setForm({ ...form, prixVente: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-800"
                    placeholder="Ex: 3500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">Catégorie</label>
                  <select
                    required
                    value={form.categorieId}
                    onChange={e => setForm({ ...form, categorieId: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-800"
                  >
                    <option value="">Choisir une catégorie</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.nom}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">Description (optionnel)</label>
                  <input
                    type="text"
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-800"
                    placeholder="Ex: Avec frites"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="disponible"
                    checked={form.disponible}
                    onChange={e => setForm({ ...form, disponible: e.target.checked })}
                    className="w-4 h-4 accent-red-900"
                  />
                  <label htmlFor="disponible" className="text-sm text-stone-600">Disponible</label>
                </div>
                <div className="col-span-2 flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 border border-stone-300 rounded-lg text-sm text-stone-600"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-red-900 text-white rounded-lg text-sm hover:bg-red-800"
                  >
                    {editArticle ? 'Modifier' : 'Ajouter'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Liste articles par catégorie */}
          {categories.length === 0 ? (
            <div className="bg-white rounded-xl border border-stone-200 p-10 text-center">
              <div className="text-4xl mb-3">🍽</div>
              <p className="text-stone-500 text-sm">Aucune catégorie. Commencez par créer une catégorie.</p>
            </div>
          ) : (
            grouped.map(cat => (
              <div key={cat.id} className="mb-6">

                {/* Titre catégorie + bouton supprimer */}
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-wider">
                    {cat.nom} ({cat.articles.length})
                  </h2>
                  {cat.articles.length === 0 && (
                    <button
                      onClick={() => {
                        if (confirm(`Supprimer la catégorie "${cat.nom}" ?`))
                          deleteCategorie.mutate(cat.id)
                      }}
                      className="text-xs text-red-500 hover:text-red-700 underline"
                    >
                      Supprimer cette catégorie
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {cat.articles.map(article => (
                    <div key={article.id} className="bg-white rounded-xl border border-stone-200 p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="font-medium text-stone-800 text-sm">{article.nom}</div>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          article.disponible
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-600'
                        }`}>
                          {article.disponible ? 'Dispo' : 'Indispo'}
                        </span>
                      </div>
                      {article.description && (
                        <p className="text-xs text-stone-400 mb-2">{article.description}</p>
                      )}
                      <div className="text-red-900 font-bold text-base mb-3">
                        {Number(article.prixVente).toLocaleString('fr-FR')} FCFA
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(article)}
                          className="flex-1 text-xs py-1.5 border border-stone-300 rounded-lg text-stone-600 hover:bg-stone-50"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Supprimer cet article ?'))
                              deleteArticle.mutate(article.id)
                          }}
                          className="flex-1 text-xs py-1.5 border border-red-200 rounded-lg text-red-600 hover:bg-red-50"
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  ))}
                  {cat.articles.length === 0 && (
                    <p className="text-sm text-stone-400 col-span-3">Aucun article dans cette catégorie.</p>
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