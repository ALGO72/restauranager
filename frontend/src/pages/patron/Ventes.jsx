import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import SidebarPatron from '../../components/layout/SidebarPatron'
import api from '../../services/api'

export default function Ventes() {
  const [selected, setSelected] = useState(null)

  const { data: ventes = [], isLoading } = useQuery({
    queryKey: ['ventes'],
    queryFn: () => api.get('/ventes').then(r => r.data)
  })

  const totalCA = ventes.reduce((sum, v) => sum + v.montantTotal, 0)

  return (
    <div className="flex h-screen bg-stone-100">
      <SidebarPatron />

      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Topbar */}
        <div className="bg-white border-b border-stone-200 px-6 h-14 flex items-center justify-between flex-shrink-0">
          <h1 className="text-base font-semibold text-stone-800">Suivi des ventes</h1>
        </div>

        <div className="flex-1 overflow-y-auto p-6">

          {/* KPIs */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl border border-stone-200 p-4">
              <div className="text-xs text-stone-400 mb-1">Chiffre d'affaires total</div>
              <div className="text-2xl font-bold text-stone-800">
                {totalCA.toLocaleString('fr-FR')} FCFA
              </div>
            </div>
            <div className="bg-white rounded-xl border border-stone-200 p-4">
              <div className="text-xs text-stone-400 mb-1">Nombre de ventes</div>
              <div className="text-2xl font-bold text-stone-800">{ventes.length}</div>
            </div>
            <div className="bg-white rounded-xl border border-stone-200 p-4">
              <div className="text-xs text-stone-400 mb-1">Panier moyen</div>
              <div className="text-2xl font-bold text-stone-800">
                {ventes.length > 0
                  ? Math.round(totalCA / ventes.length).toLocaleString('fr-FR')
                  : 0} FCFA
              </div>
            </div>
          </div>

          {/* Détail vente sélectionnée */}
          {selected && (
            <div className="bg-white rounded-xl border border-stone-200 p-5 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-stone-800">
                  Détail de la vente #{selected.id}
                </h2>
                <button
                  onClick={() => setSelected(null)}
                  className="text-xs text-stone-400 hover:text-stone-600"
                >
                  ✕ Fermer
                </button>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
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
                    {Number(selected.montantTotal).toLocaleString('fr-FR')} FCFA
                  </span>
                </div>
              </div>
              <table className="w-full">
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
                        {Number(ligne.prixUnitaire).toLocaleString('fr-FR')} FCFA
                      </td>
                      <td className="px-4 py-2 text-sm font-medium">
                        {Number(ligne.sousTotal).toLocaleString('fr-FR')} FCFA
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Liste des ventes */}
          <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
            <div className="px-5 py-3 border-b border-stone-100">
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
              <table className="w-full">
                <thead>
                  <tr className="bg-stone-50 text-xs text-stone-500 uppercase tracking-wider">
                    <th className="text-left px-5 py-3">#</th>
                    <th className="text-left px-5 py-3">Employé</th>
                    <th className="text-left px-5 py-3">Articles</th>
                    <th className="text-left px-5 py-3">Montant</th>
                    <th className="text-left px-5 py-3">Date & Heure</th>
                    <th className="px-5 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {ventes.map((vente, i) => (
                    <tr key={vente.id} className={i % 2 === 0 ? 'bg-white' : 'bg-stone-50'}>
                      <td className="px-5 py-3 text-sm text-stone-400">#{vente.id}</td>
                      <td className="px-5 py-3 text-sm font-medium text-stone-800">
                        {vente.employe.prenom} {vente.employe.nom}
                      </td>
                      <td className="px-5 py-3 text-sm text-stone-500">
                        {vente.lignes.map(l => l.article.nom).join(', ')}
                      </td>
                      <td className="px-5 py-3 text-sm font-bold text-red-900">
                        {Number(vente.montantTotal).toLocaleString('fr-FR')} FCFA
                      </td>
                      <td className="px-5 py-3 text-sm text-stone-400">
                        {new Date(vente.dateHeure).toLocaleString('fr-FR')}
                      </td>
                      <td className="px-5 py-3">
                        <button
                          onClick={() => setSelected(selected?.id === vente.id ? null : vente)}
                          className="text-xs text-stone-500 hover:text-stone-800 border border-stone-300 px-3 py-1 rounded-lg"
                        >
                          Détail
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