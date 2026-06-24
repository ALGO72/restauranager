import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import SidebarPatron from './SidebarPatron'
import SidebarEmploye from './SidebarEmploye'
import { useAuth } from '../../context/AuthContext'

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user } = useAuth()

  const Sidebar = user?.role === 'PATRON' ? SidebarPatron : SidebarEmploye

  return (
    <div className="flex h-screen bg-stone-100 relative">

      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-30
        transform transition-transform duration-200 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* Barre hamburger mobile */}
        <div className="lg:hidden bg-white border-b border-stone-200 px-4 h-12 flex items-center gap-3 flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-stone-600 hover:text-stone-900"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="text-sm font-semibold text-stone-800">🍽 RestauManager</span>
        </div>

        {children}
      </div>
    </div>
  )
}