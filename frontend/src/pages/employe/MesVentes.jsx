import { useQuery } from '@tanstack/react-query'
import SidebarEmploye from '../../components/layout/SidebarEmploye'
import api from '../../services/api'

export default function MesVentes() {
  const { data: ventes = [], isLoading } = useQuery({
    queryKey: ['ventes-employe'],
    queryFn: () => api.get('/ventes').then(r => r.data)
  })

  const aujourd = new Date().toDateString()
  const ventesJour = ventes.filter(v =>
    new Date(v.dateHeure).toDateString() === aujourd
  )

  const totalJour = ventesJour.reduce((sum, v) => sum + v.montantTotal, 0)

  return (
    <div className="flex h-screen bg-stone-100">
      <SidebarEmploye />

      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Topbar */}
        <div className="bg-white border-b border-stone-200 px-6 h-14 flex items-center justify-between flex-shrink-0">
          <h1 className="text-base font-semibold text-stone-800">Mes ventes du jour</h1>
          <span className="text-sm text-stone-400">
            {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-6">

          {/* KPIs */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white rounded-xl border border-stone-200 p-4">
              <div className="text-xs text-stone-400 mb-1">Ventes aujourd'hui</div>
              <div className="text-2xl font-bold text-stone-800">{ventesJour.length}</div>
            </div>
            <div className="bg-white rounded-xl border border-stone-200 p-4">
              <div className="text-xs text-stone-400 mb-1">Total encaissé</div>
              <div className="text-2xl font-bold text-red-900">
                {totalJour.toLocaleString('fr-FR')} FCFA
              </div>
            </div>
          </div>

          {/* Liste */}
          <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
            <div className="px-5 py-3 border-b border-stone-100">
              <h2 className="text-sm font-semibold text-stone-800">Historique du jour</h2>
            </div>
            {isLoading ? (
              <div className="p-8 text-center text-stone-400 text-sm">Chargement...</div>
            ) : ventesJour.length === 0 ? (
              <div className="p-10 text-center">
                <div className="text-4xl mb-3">📋</div>
                <p className="text-stone-500 text-sm">Aucune vente enregistrée aujourd'hui.</p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="bg-stone-50 text-xs text-stone-500 uppercase tracking-wider">
                    <th className="text-left px-5 py-3">Heure</th>
                    <th className="text-left px-5 py-3">Articles</th>
                    <th className="text-left px-5 py-3">Montant</th>
                  </tr>
                </thead>
                <tbody>
                  {ventesJour.map((vente, i) => (
                    <tr key={vente.id} className={i % 2 === 0 ? 'bg-white' : 'bg-stone-50'}>
                      <td className="px-5 py-3 text-sm text-stone-400">
                        {new Date(vente.dateHeure).toLocaleTimeString('fr-FR', {
                          hour: '2-digit', minute: '2-digit'
                        })}
                      </td>
                      <td className="px-5 py-3 text-sm text-stone-700">
                        {vente.lignes.map(l => `${l.article.nom} x${l.quantite}`).join(', ')}
                      </td>
                      <td className="px-5 py-3 text-sm font-bold text-red-900">
                        {Number(vente.montantTotal).toLocaleString('fr-FR')} FCFA
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