import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const navItems = [
  { to: '/patron/dashboard',  icon: '📊', label: 'Tableau de bord' },
  { to: '/patron/menu',       icon: '🍽', label: 'Menu' },
  { to: '/patron/achats',     icon: '🛍', label: 'Achats' },
  { to: '/patron/stock',      icon: '📦', label: 'Stock' },
  { to: '/patron/ventes',     icon: '🧾', label: 'Ventes' },
  { to: '/patron/benefices',  icon: '📈', label: 'Bénéfices' },
  { to: '/patron/employes',   icon: '👥', label: 'Employés' },
]

export default function SidebarPatron() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const initiales = user
    ? `${user.prenom?.[0] ?? ''}${user.nom?.[0] ?? ''}`.toUpperCase()
    : '?'

  return (
    <aside className="w-52 bg-stone-900 flex flex-col flex-shrink-0 h-screen">

      <div className="px-5 py-5 border-b border-white/10">
        <div className="text-white font-semibold text-lg">🍽 RestauManager</div>
        <div className="text-white/40 text-xs mt-0.5">Interface patron</div>
      </div>

      <div className="mx-3 mt-3 bg-amber-500/15 border border-amber-500/25 rounded-xl p-3 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center
                        text-stone-900 text-xs font-bold flex-shrink-0">
          {initiales}
        </div>
        <div>
          <div className="text-white text-sm font-medium">
            {user?.prenom} {user?.nom}
          </div>
          <div className="text-amber-500 text-xs">Patron</div>
        </div>
      </div>

      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-amber-500/18 text-amber-400 font-medium'
                  : 'text-white/50 hover:bg-white/6 hover:text-white'
              }`
            }
          >
            <span>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="px-5 py-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="text-white/30 hover:text-white/60 text-xs flex items-center gap-2 transition-colors"
        >
          ← Déconnexion
        </button>
      </div>
    </aside>
  )
}