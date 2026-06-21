import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import SidebarPatron from '../../components/layout/SidebarPatron'
import api from '../../services/api'

export default function Dashboard() {
  const [periode, setPeriode] = useState('jour')

  const { data: stats } = useQuery({
    queryKey: ['stats', periode],
    queryFn: () => api.get(`/dashboard/stats?periode=${periode}`).then(r => r.data)
  })

  const { data: ventes = [] } = useQuery({
    queryKey: ['ventes'],
    queryFn: () => api.get('/ventes').then(r => r.data)
  })

  const { data: stock = [] } = useQuery({
    queryKey: ['stock'],
    queryFn: () => api.get('/stock').then(r => r.data)
  })

  // Graphique ventes par heure (aujourd'hui)
  const ventesParHeure = Array.from({ length: 24 }, (_, h) => {
    const label = `${h}h`
    const total = ventes
      .filter(v => {
        const d = new Date(v.dateHeure)
        return d.toDateString() === new Date().toDateString() && d.getHours() === h
      })
      .reduce((sum, v) => sum + v.montantTotal, 0)
    return { label, total }
  }).filter((_, h) => h >= 6 && h <= 22)

  // Top 5 articles
  const articlesCount = {}
  ventes.forEach(v => {
    v.lignes?.forEach(l => {
      const nom = l.article?.nom ?? 'Inconnu'
      articlesCount[nom] = (articlesCount[nom] ?? 0) + l.quantite
    })
  })
  const top5 = Object.entries(articlesCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([nom, count]) => ({ nom, count }))

  // Stock alertes
  const alertes = stock.filter(p => p.quantiteStock <= p.seuilAlerte)

  const periodes = [
    { value: 'jour',    label: "Aujourd'hui" },
    { value: 'semaine', label: '7 jours' },
    { value: 'mois',    label: 'Ce mois' },
  ]

  return (
    <div className="flex h-screen bg-stone-100">
      <SidebarPatron />

      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Topbar */}
        <div className="bg-white border-b border-stone-200 px-6 h-14 flex items-center justify-between flex-shrink-0">
          <h1 className="text-base font-semibold text-stone-800">Tableau de bord</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm text-stone-400">
              {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
            </span>
            <div className="flex gap-1">
              {periodes.map(p => (
                <button
                  key={p.value}
                  onClick={() => setPeriode(p.value)}
                  className={`px-3 py-1 text-xs rounded-lg border transition-colors ${
                    periode === p.value
                      ? 'bg-stone-900 text-white border-stone-900'
                      : 'border-stone-300 text-stone-500 hover:bg-stone-50'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">

          {/* KPIs */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl border border-stone-200 p-4">
              <div className="text-xs text-stone-400 mb-1">💰 Chiffre d'affaires</div>
              <div className="text-2xl font-bold text-stone-800">
                {Number(stats?.ca ?? 0).toLocaleString('fr-FR')} FCFA
              </div>
              <div className="text-xs text-stone-400 mt-1">{stats?.nbVentes ?? 0} ventes</div>
            </div>
            <div className="bg-white rounded-xl border border-stone-200 p-4">
              <div className="text-xs text-stone-400 mb-1">📈 Bénéfice brut</div>
              <div className={`text-2xl font-bold ${(stats?.benefice ?? 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {Number(stats?.benefice ?? 0).toLocaleString('fr-FR')} FCFA
              </div>
              <div className="text-xs text-stone-400 mt-1">
                Marge {stats?.ca > 0 ? Math.round((stats.benefice / stats.ca) * 100) : 0}%
              </div>
            </div>
            <div className="bg-white rounded-xl border border-stone-200 p-4">
              <div className="text-xs text-stone-400 mb-1">🧾 Ventes</div>
              <div className="text-2xl font-bold text-stone-800">{stats?.nbVentes ?? 0}</div>
              <div className="text-xs text-stone-400 mt-1">Commandes enregistrées</div>
            </div>
            <div className={`bg-white rounded-xl border p-4 ${alertes.length > 0 ? 'border-l-4 border-amber-400' : 'border-stone-200'}`}>
              <div className="text-xs text-stone-400 mb-1">⚠ Stock</div>
              <div className={`text-2xl font-bold ${alertes.length > 0 ? 'text-red-500' : 'text-green-600'}`}>
                {alertes.length}
              </div>
              <div className={`text-xs mt-1 ${alertes.length > 0 ? 'text-red-400' : 'text-green-500'}`}>
                {alertes.length > 0 ? 'Alertes de rupture' : 'Stock OK'}
              </div>
            </div>
          </div>

          {/* Graphiques */}
          <div className="grid grid-cols-2 gap-6 mb-6">

            {/* Graphique ventes par heure */}
            <div className="bg-white rounded-xl border border-stone-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-stone-800">Ventes par heure</h2>
                <span className="text-xs text-stone-400">Aujourd'hui</span>
              </div>
              {ventesParHeure.every(v => v.total === 0) ? (
                <div className="h-32 flex items-center justify-center text-stone-300 text-sm">
                  Aucune vente aujourd'hui
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={140}>
                  <BarChart data={ventesParHeure} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#a8a29e' }} />
                    <YAxis tick={{ fontSize: 10, fill: '#a8a29e' }} />
                    <Tooltip
                      formatter={(v) => [`${v.toLocaleString('fr-FR')} FCFA`, 'Ventes']}
                      contentStyle={{ fontSize: 11, borderRadius: 8 }}
                    />
                    <Bar dataKey="total" fill="#7C2D12" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Top 5 articles */}
            <div className="bg-white rounded-xl border border-stone-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-stone-800">Top 5 articles</h2>
                <span className="text-xs text-stone-400">Toutes périodes</span>
              </div>
              {top5.length === 0 ? (
                <div className="h-32 flex items-center justify-center text-stone-300 text-sm">
                  Aucune vente enregistrée
                </div>
              ) : (
                <div className="space-y-3">
                  {top5.map((item, i) => (
                    <div key={item.nom} className="flex items-center gap-3">
                      <div className="text-xs font-bold text-stone-400 w-4">{i + 1}</div>
                      <div className="flex-1 text-sm text-stone-700">{item.nom}</div>
                      <div className="w-32 bg-stone-100 rounded-full h-2">
                        <div
                          className="h-2 bg-red-900 rounded-full"
                          style={{ width: `${(item.count / top5[0].count) * 100}%` }}
                        />
                      </div>
                      <div className="text-xs font-medium text-stone-500 w-8 text-right">
                        {item.count}x
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Dernières ventes + alertes stock */}
          <div className="grid grid-cols-2 gap-6">

            {/* Dernières ventes */}
            <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
              <div className="px-5 py-3 border-b border-stone-100">
                <h2 className="text-sm font-semibold text-stone-800">Dernières ventes</h2>
              </div>
              {ventes.length === 0 ? (
                <div className="p-8 text-center text-stone-300 text-sm">Aucune vente</div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="bg-stone-50 text-xs text-stone-400 uppercase">
                      <th className="text-left px-4 py-2">Heure</th>
                      <th className="text-left px-4 py-2">Articles</th>
                      <th className="text-right px-4 py-2">Montant</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ventes.slice(0, 5).map((v, i) => (
                      <tr key={v.id} className={i % 2 === 0 ? 'bg-white' : 'bg-stone-50'}>
                        <td className="px-4 py-2 text-xs text-stone-400">
                          {new Date(v.dateHeure).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="px-4 py-2 text-xs text-stone-600">
                          {v.lignes?.map(l => l.article?.nom).join(', ')}
                        </td>
                        <td className="px-4 py-2 text-xs font-bold text-red-900 text-right">
                          {Number(v.montantTotal).toLocaleString('fr-FR')} F
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Alertes stock */}
            <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
              <div className="px-5 py-3 border-b border-stone-100">
                <h2 className="text-sm font-semibold text-stone-800">État du stock</h2>
              </div>
              {stock.length === 0 ? (
                <div className="p-8 text-center text-stone-300 text-sm">Aucun produit en stock</div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="bg-stone-50 text-xs text-stone-400 uppercase">
                      <th className="text-left px-4 py-2">Produit</th>
                      <th className="text-left px-4 py-2">Quantité</th>
                      <th className="text-right px-4 py-2">Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stock.slice(0, 5).map((p, i) => {
                      const alerte = p.quantiteStock <= p.seuilAlerte
                      return (
                        <tr key={p.id} className={i % 2 === 0 ? 'bg-white' : 'bg-stone-50'}>
                          <td className="px-4 py-2 text-xs text-stone-700 font-medium">{p.nom}</td>
                          <td className="px-4 py-2 text-xs text-stone-500">
                            {p.quantiteStock} {p.unite}
                          </td>
                          <td className="px-4 py-2 text-right">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                              alerte ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'
                            }`}>
                              {alerte ? '⚠ Bas' : '✓ OK'}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}