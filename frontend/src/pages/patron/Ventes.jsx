import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import SidebarPatron from '../../components/layout/SidebarPatron'
import { useParametres } from '../../context/ParametresContext'
import { genererRecu } from '../../utils/genererRecu'
import api from '../../services/api'

export default function Ventes() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selected, setSelected] = useState(null)
  const parametres = useParametres()

  const { data: ventes = [], isLoading } = useQuery({
    queryKey: ['ventes'],
    queryFn: () => api.get('/ventes').then(r => r.data)
  })

  const totalCA = ventes.reduce((sum, v) => sum + v.montantTotal, 0)

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
            <h1 className="text-base font-semibold text-stone-800">Suivi des ventes</h1>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 lg:p-6">

          {/* KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-4 mb-6">
            <div className="bg-white rounded-xl border border-stone-200 p-4">
              <div className="text-xs text-stone-400 mb-1">Chiffre d'affaires total</div>
              <div className="text-xl lg:text-2xl font-bold text-stone-800">
                {totalCA.toLocaleString('fr-FR')} {parametres.devise}
              </div>
            </div>
            <div className="bg-white rounded-xl border border-stone-200 p-4">
              <div className="text-xs text-stone-400 mb-1">Nombre de ventes</div>
              <div className="text-xl lg:text-2xl font-bold text-stone-800">{ventes.length}</div>
            </div>
            <div className="bg-white rounded-xl border border-stone-200 p-4">
              <div className="text-xs text-stone-400 mb-1">Panier moyen</div>
              <div className="text-xl lg:text-2xl font-bold text-stone-800">
                {ventes.length > 0
                  ? Math.round(totalCA / ventes.length).toLocaleString('fr-FR')
                  : 0} {parametres.devise}
              </div>
            </div>
          </div>

          {/* Détail vente */}
          {selected && (
            <div className="bg-white rounded-xl border border-stone-200 p-4 lg:p-5 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-stone-800">
                  Détail vente #{selected.id}
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => genererRecu(selected, parametres)}
                    className="text-xs bg-red-900 text-white px-3 py-1.5 rounded-lg hover:bg-red-800"
                  >
                    🖨 Reçu
                  </button>
                  <button
                    onClick={() => setSelected(null)}
                    className="text-xs text-stone-400 hover:text-stone-600 border border-stone-300 px-3 py-1.5 rounded-lg"
                  >
                    ✕ Fermer
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4 text-sm">
                <div>
                  <span className="text-stone-400">Employé : </span>
                  <span className="font-medium">{selected.employe.prenom} {selected.employe.nom}</span>
                </div>
                <div>
                  <span className="text-stone-400">Date : </span>
                  <span className="font-medium">
                    {new Date(selected.dateHeure).toLocaleString('fr-FR')}
                  </span>
                </div>
                <div>
                  <span className="text-stone-400">Total : </span>
                  <span className="font-bold text-red-900">
                    {Number(selected.montantTotal).toLocaleString('fr-FR')} {parametres.devise}
                  </span>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[400px]">
                  <thead>
                    <tr className="bg-stone-50 text-xs text-stone-500 uppercase tracking-wider">
                      <th className="text-left px-4 py-2">Article</th>
                      <th className="text-left px-4 py-2">Qté</th>
                      <th className="text-left px-4 py-2">Prix unit.</th>
                      <th className="text-left px-4 py-2">Sous-total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selected.lignes.map(ligne => (
                      <tr key={ligne.id} className="border-t border-stone-100">
                        <td className="px-4 py-2 text-sm">{ligne.article.nom}</td>
                        <td className="px-4 py-2 text-sm">{ligne.quantite}</td>
                        <td className="px-4 py-2 text-sm">
                          {Number(ligne.prixUnitaire).toLocaleString('fr-FR')} {parametres.devise}
                        </td>
                        <td className="px-4 py-2 text-sm font-medium">
                          {Number(ligne.sousTotal).toLocaleString('fr-FR')} {parametres.devise}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Liste ventes */}
          <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
            <div className="px-4 lg:px-5 py-3 border-b border-stone-100">
              <h2 className="text-sm font-semibold text-stone-800">Historique des ventes</h2>
            </div>
            {isLoading ? (
              <div className="p-8 text-center text-stone-400 text-sm">Chargement...</div>
            ) : ventes.length === 0 ? (
              <div className="p-10 text-center">
                <div className="text-4xl mb-3">🧾</div>
                <p className="text-stone-500 text-sm">Aucune vente enregistrée.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr className="bg-stone-50 text-xs text-stone-500 uppercase tracking-wider">
                      <th className="text-left px-4 lg:px-5 py-3">#</th>
                      <th className="text-left px-4 lg:px-5 py-3">Employé</th>
                      <th className="text-left px-4 lg:px-5 py-3">Articles</th>
                      <th className="text-left px-4 lg:px-5 py-3">Montant</th>
                      <th className="text-left px-4 lg:px-5 py-3">Date & Heure</th>
                      <th className="px-4 lg:px-5 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {ventes.map((vente, i) => (
                      <tr key={vente.id} className={i % 2 === 0 ? 'bg-white' : 'bg-stone-50'}>
                        <td className="px-4 lg:px-5 py-3 text-sm text-stone-400">#{vente.id}</td>
                        <td className="px-4 lg:px-5 py-3 text-sm font-medium text-stone-800">
                          {vente.employe.prenom} {vente.employe.nom}
                        </td>
                        <td className="px-4 lg:px-5 py-3 text-sm text-stone-500 max-w-[200px] truncate">
                          {vente.lignes.map(l => l.article.nom).join(', ')}
                        </td>
                        <td className="px-4 lg:px-5 py-3 text-sm font-bold text-red-900">
                          {Number(vente.montantTotal).toLocaleString('fr-FR')} {parametres.devise}
                        </td>
                        <td className="px-4 lg:px-5 py-3 text-sm text-stone-400">
                          {new Date(vente.dateHeure).toLocaleString('fr-FR')}
                        </td>
                        <td className="px-4 lg:px-5 py-3">
                          <div className="flex gap-1 lg:gap-2">
                            <button
                              onClick={() => setSelected(selected?.id === vente.id ? null : vente)}
                              className="text-xs text-stone-500 hover:text-stone-800 border border-stone-300 px-2 lg:px-3 py-1 rounded-lg"
                            >
                              Détail
                            </button>
                            <button
                              onClick={() => genererRecu(vente, parametres)}
                              className="text-xs text-red-600 hover:text-red-800 border border-red-200 px-2 lg:px-3 py-1 rounded-lg"
                            >
                              🖨 Reçu
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