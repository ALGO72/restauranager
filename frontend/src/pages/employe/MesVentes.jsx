import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import SidebarEmploye from '../../components/layout/SidebarEmploye'
import { useParametres } from '../../context/ParametresContext'
import api from '../../services/api'

export default function MesVentes() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const parametres = useParametres()

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
    <div className="flex flex-col lg:flex-row h-screen bg-stone-100">

      {/* Overlay mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div className={`fixed lg:static inset-y-0 left-0 z-30 transform transition-transform duration-200
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <SidebarEmploye onClose={() => setSidebarOpen(false)} />
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
            <h1 className="text-base font-semibold text-stone-800">Mes ventes du jour</h1>
          </div>
          <span className="text-xs text-stone-400 hidden sm:block">
            {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 lg:p-6">

          {/* KPIs */}
          <div className="grid grid-cols-2 gap-3 lg:gap-4 mb-6">
            <div className="bg-white rounded-xl border border-stone-200 p-4">
              <div className="text-xs text-stone-400 mb-1">Ventes aujourd'hui</div>
              <div className="text-xl lg:text-2xl font-bold text-stone-800">
                {ventesJour.length}
              </div>
              <div className="text-xs text-stone-400 mt-1">Commandes enregistrées</div>
            </div>
            <div className="bg-white rounded-xl border border-stone-200 p-4">
              <div className="text-xs text-stone-400 mb-1">Total encaissé</div>
              <div className="text-xl lg:text-2xl font-bold text-red-900">
                {totalJour.toLocaleString('fr-FR')} {parametres.devise}
              </div>
              <div className="text-xs text-stone-400 mt-1">Montant du jour</div>
            </div>
          </div>

          {/* Liste ventes */}
          <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
            <div className="px-4 lg:px-5 py-3 border-b border-stone-100">
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
              <>
                {/* Vue mobile — cartes */}
                <div className="lg:hidden divide-y divide-stone-100">
                  {ventesJour.map(vente => (
                    <div key={vente.id} className="p-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-stone-400">
                          {new Date(vente.dateHeure).toLocaleTimeString('fr-FR', {
                            hour: '2-digit', minute: '2-digit'
                          })}
                        </span>
                        <span className="text-sm font-bold text-red-900">
                          {Number(vente.montantTotal).toLocaleString('fr-FR')} {parametres.devise}
                        </span>
                      </div>
                      <div className="text-xs text-stone-500">
                        {vente.lignes.map(l => `${l.article.nom} x${l.quantite}`).join(', ')}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Vue desktop — tableau */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full min-w-[400px]">
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
                            {Number(vente.montantTotal).toLocaleString('fr-FR')} {parametres.devise}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}