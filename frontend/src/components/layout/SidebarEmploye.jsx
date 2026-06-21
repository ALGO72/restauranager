import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useParametres } from '../../context/ParametresContext'

const navItems = [
  { to: '/employe/menu',   icon: '🧾', label: 'Menu & vente' },
  { to: '/employe/ventes', icon: '📋', label: 'Mes ventes du jour' },
]

export default function SidebarEmploye() {
  const { user, logout } = useAuth()
  const parametres = useParametres()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const initiales = user
    ? `${user.prenom?.[0] ?? ''}${user.nom?.[0] ?? ''}`.toUpperCase()
    : '?'

  return (
    <aside className="w-56 bg-red-900 flex flex-col flex-shrink-0 h-screen">

      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/10">
        <div className="flex items-center gap-2">
          {parametres.logo_url ? (
            <img
              src={parametres.logo_url}
              alt="logo"
              className="w-7 h-7 object-contain rounded"
            />
          ) : (
            <span className="text-xl">🍽</span>
          )}
          <div>
            <div className="text-white font-semibold text-sm leading-tight">
              {parametres.nom_restaurant || 'RestauManager'}
            </div>
            <div className="text-white/50 text-xs">Interface employé</div>
          </div>
        </div>
      </div>

      {/* Badge employé */}
      <div className="mx-3 mt-3 bg-white/10 rounded-xl p-3 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-red-200 flex items-center justify-center
                        text-red-900 text-xs font-bold flex-shrink-0">
          {initiales}
        </div>
        <div>
          <div className="text-white text-sm font-medium">
            {user?.prenom} {user?.nom}
          </div>
          <div className="text-white/50 text-xs">Employé</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-0.5">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-white/20 text-white font-medium'
                  : 'text-white/60 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <span>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Déconnexion */}
      <div className="px-5 py-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="text-white/40 hover:text-white/70 text-xs flex items-center gap-2 transition-colors"
        >
          ← Déconnexion
        </button>
      </div>
    </aside>
  )
}