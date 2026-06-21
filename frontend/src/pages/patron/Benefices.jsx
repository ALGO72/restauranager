import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import SidebarPatron from '../../components/layout/SidebarPatron'
import api from '../../services/api'

export default function Benefices() {
  const [periode, setPeriode] = useState('mois')

  const { data: stats, isLoading } = useQuery({
    queryKey: ['stats', periode],
    queryFn: () => api.get(`/dashboard/stats?periode=${periode}`).then(r => r.data)
  })

  const { data: ventes = [] } = useQuery({
    queryKey: ['ventes'],
    queryFn: () => api.get('/ventes').then(r => r.data)
  })

  const { data: achats = [] } = useQuery({
    queryKey: ['achats'],
    queryFn: () => api.get('/achats').then(r => r.data)
  })

  const marge = stats?.ca > 0
    ? Math.round((stats.benefice / stats.ca) * 100)
    : 0

  const periodes = [
    { value: 'jour',    label: "Aujourd'hui" },
    { value: 'semaine', label: '7 derniers jours' },
    { value: 'mois',    label: 'Ce mois' },
    { value: 'tout',    label: 'Tout' },
  ]

  return (
    <div className="flex h-screen bg-stone-100">
      <SidebarPatron />

      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Topbar */}
        <div className="bg-white border-b border-stone-200 px-6 h-14 flex items-center justify-between flex-shrink-0">
          <h1 className="text-base font-semibold text-stone-800">Bénéfices</h1>
          <div className="flex gap-2">
            {periodes.map(p => (
              <button
                key={p.value}
                onClick={() => setPeriode(p.value)}
                className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                  periode === p.value
                    ? 'bg-stone-900 text-white border-stone-900'
                    : 'border-stone-300 text-stone-600 hover:bg-stone-50'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">

          {isLoading ? (
            <div className="p-8 text-center text-stone-400 text-sm">Chargement...</div>
          ) : (
            <>
              {/* KPIs principaux */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-xl border border-stone-200 p-4">
                  <div className="text-xs text-stone-400 mb-1">Chiffre d'affaires</div>
                  <div className="text-2xl font-bold text-stone-800">
                    {Number(stats?.ca ?? 0).toLocaleString('fr-FR')} FCFA
                  </div>
                  <div className="text-xs text-stone-400 mt-1">{stats?.nbVentes} ventes</div>
                </div>
                <div className="bg-white rounded-xl border border-stone-200 p-4">
                  <div className="text-xs text-stone-400 mb-1">Dépenses achats</div>
                  <div className="text-2xl font-bold text-red-600">
                    {Number(stats?.depenses ?? 0).toLocaleString('fr-FR')} FCFA
                  </div>
                  <div className="text-xs text-stone-400 mt-1">Matières premières</div>
                </div>
                <div className={`bg-white rounded-xl border p-4 ${
                  stats?.benefice >= 0
                    ? 'border-l-4 border-green-400'
                    : 'border-l-4 border-red-400'
                }`}>
                  <div className="text-xs text-stone-400 mb-1">Bénéfice brut</div>
                  <div className={`text-2xl font-bold ${
                    stats?.benefice >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {Number(stats?.benefice ?? 0).toLocaleString('fr-FR')} FCFA
                  </div>
                  <div className="text-xs text-stone-400 mt-1">CA − Dépenses</div>
                </div>
                <div className="bg-white rounded-xl border border-stone-200 p-4">
                  <div className="text-xs text-stone-400 mb-1">Marge</div>
                  <div className={`text-2xl font-bold ${
                    marge >= 50 ? 'text-green-600' : marge >= 20 ? 'text-amber-500' : 'text-red-600'
                  }`}>
                    {marge}%
                  </div>
                  <div className="text-xs text-stone-400 mt-1">Bénéfice / CA</div>
                </div>
              </div>

              {/* Barre visuelle bénéfice */}
              <div className="bg-white rounded-xl border border-stone-200 p-5 mb-6">
                <h2 className="text-sm font-semibold text-stone-800 mb-4">Répartition CA</h2>
                <div className="flex items-center gap-4 mb-2">
                  <span className="text-xs text-stone-500 w-20">Dépenses</span>
                  <div className="flex-1 bg-stone-100 rounded-full h-4 overflow-hidden">
                    <div
                      className="h-full bg-red-400 rounded-full transition-all"
                      style={{ width: stats?.ca > 0 ? `${Math.min(100, (stats.depenses / stats.ca) * 100)}%` : '0%' }}
                    />
                  </div>
                  <span className="text-xs font-medium text-red-600 w-24 text-right">
                    {Number(stats?.depenses ?? 0).toLocaleString('fr-FR')} F
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-stone-500 w-20">Bénéfice</span>
                  <div className="flex-1 bg-stone-100 rounded-full h-4 overflow-hidden">
                    <div
                      className="h-full bg-green-400 rounded-full transition-all"
                      style={{ width: stats?.ca > 0 ? `${Math.max(0, Math.min(100, (stats.benefice / stats.ca) * 100))}%` : '0%' }}
                    />
                  </div>
                  <span className="text-xs font-medium text-green-600 w-24 text-right">
                    {Number(stats?.benefice ?? 0).toLocaleString('fr-FR')} F
                  </span>
                </div>
              </div>

              {/* Deux colonnes : dernières ventes + derniers achats */}
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
                  <div className="px-5 py-3 border-b border-stone-100">
                    <h2 className="text-sm font-semibold text-stone-800">Dernières ventes</h2>
                  </div>
                  <table className="w-full">
                    <thead>
                      <tr className="bg-stone-50 text-xs text-stone-500 uppercase">
                        <th className="text-left px-4 py-2">Date</th>
                        <th className="text-left px-4 py-2">Employé</th>
                        <th className="text-right px-4 py-2">Montant</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ventes.slice(0, 6).map((v, i) => (
                        <tr key={v.id} className={i % 2 === 0 ? 'bg-white' : 'bg-stone-50'}>
                          <td className="px-4 py-2 text-xs text-stone-400">
                            {new Date(v.dateHeure).toLocaleDateString('fr-FR')}
                          </td>
                          <td className="px-4 py-2 text-sm text-stone-700">
                            {v.employe.prenom}
                          </td>
                          <td className="px-4 py-2 text-sm font-medium text-green-700 text-right">
                            +{Number(v.montantTotal).toLocaleString('fr-FR')} F
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
                  <div className="px-5 py-3 border-b border-stone-100">
                    <h2 className="text-sm font-semibold text-stone-800">Derniers achats</h2>
                  </div>
                  <table className="w-full">
                    <thead>
                      <tr className="bg-stone-50 text-xs text-stone-500 uppercase">
                        <th className="text-left px-4 py-2">Produit</th>
                        <th className="text-left px-4 py-2">Date</th>
                        <th className="text-right px-4 py-2">Coût</th>
                      </tr>
                    </thead>
                    <tbody>
                      {achats.slice(0, 6).map((a, i) => (
                        <tr key={a.id} className={i % 2 === 0 ? 'bg-white' : 'bg-stone-50'}>
                          <td className="px-4 py-2 text-sm text-stone-700">{a.produit.nom}</td>
                          <td className="px-4 py-2 text-xs text-stone-400">
                            {new Date(a.dateAchat).toLocaleDateString('fr-FR')}
                          </td>
                          <td className="px-4 py-2 text-sm font-medium text-red-600 text-right">
                            -{Number(a.coutTotal).toLocaleString('fr-FR')} F
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}