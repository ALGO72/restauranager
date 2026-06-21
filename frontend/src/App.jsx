import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ParametresProvider } from './context/ParametresContext'
import Parametres from './pages/patron/Parametres'


import Login     from './pages/Login'
import MenuVente from './pages/employe/MenuVente'
import MesVentes from './pages/employe/MesVentes'
import Dashboard from './pages/patron/Dashboard'
import Menu      from './pages/patron/Menu'
import Achats    from './pages/patron/Achats'
import Stock     from './pages/patron/Stock'
import Ventes    from './pages/patron/Ventes'
import Benefices from './pages/patron/Benefices'
import Employes  from './pages/patron/Employes'

function PrivateRoute({ children, role }) {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/login" replace />
  if (role && user.role !== role) return <Navigate to="/login" replace />
  return children
}

function AppRoutes() {
  const { user } = useAuth()

  return (
    <Routes>
      <Route path="/login" element={
        user
          ? <Navigate to={user.role === 'PATRON' ? '/patron/dashboard' : '/employe/menu'} replace />
          : <Login />
      } />

      <Route path="/employe/menu" element={
        <PrivateRoute role="EMPLOYE"><MenuVente /></PrivateRoute>
      } />
      <Route path="/employe/ventes" element={
        <PrivateRoute role="EMPLOYE"><MesVentes /></PrivateRoute>
      } />

      <Route path="/patron/dashboard" element={
        <PrivateRoute role="PATRON"><Dashboard /></PrivateRoute>
      } />
      <Route path="/patron/menu" element={
        <PrivateRoute role="PATRON"><Menu /></PrivateRoute>
      } />
      <Route path="/patron/achats" element={
        <PrivateRoute role="PATRON"><Achats /></PrivateRoute>
      } />
      <Route path="/patron/stock" element={
        <PrivateRoute role="PATRON"><Stock /></PrivateRoute>
      } />
      <Route path="/patron/ventes" element={
        <PrivateRoute role="PATRON"><Ventes /></PrivateRoute>
      } />
      <Route path="/patron/benefices" element={
        <PrivateRoute role="PATRON"><Benefices /></PrivateRoute>
      } />
      <Route path="/patron/employes" element={
        <PrivateRoute role="PATRON"><Employes /></PrivateRoute>
      } />
      <Route path="/patron/parametres" element={
        <PrivateRoute role="PATRON"><Parametres /></PrivateRoute>
    } />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <ParametresProvider>
        <AppRoutes />
      </ParametresProvider>
    </AuthProvider>
  )
}