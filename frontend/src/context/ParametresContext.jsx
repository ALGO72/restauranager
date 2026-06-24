import { createContext, useContext } from 'react'
import { useQuery } from '@tanstack/react-query'
import api from '../services/api'
import { useAuth } from './AuthContext'

const ParametresContext = createContext({
  nom_restaurant: 'RestauManager',
  devise: 'FCFA',
  logo_url: '',
  telephone: '',
  adresse: ''
})

export function ParametresProvider({ children }) {
  const { user } = useAuth()

  const { data: parametres = {
    nom_restaurant: 'RestauManager',
    devise: 'FCFA',
    logo_url: '',
    telephone: '',
    adresse: ''
  }} = useQuery({
    queryKey: ['parametres'],
    queryFn: () => api.get('/parametres').then(r => r.data),
    enabled: !!user,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  })

  return (
    <ParametresContext.Provider value={parametres ?? {
      nom_restaurant: 'RestauManager',
      devise: 'FCFA',
      logo_url: '',
      telephone: '',
      adresse: ''
    }}>
      {children}
    </ParametresContext.Provider>
  )
}

export const useParametres = () => useContext(ParametresContext)