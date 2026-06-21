import { createContext, useContext } from 'react'
import { useQuery } from '@tanstack/react-query'
import api from '../services/api'

const ParametresContext = createContext(null)

export function ParametresProvider({ children }) {
  const { data: parametres = {
    nom_restaurant: 'RestauManager',
    devise: 'FCFA',
    logo_url: '',
    telephone: '',
    adresse: ''
  }} = useQuery({
    queryKey: ['parametres'],
    queryFn: () => api.get('/parametres').then(r => r.data)
  })

  return (
    <ParametresContext.Provider value={parametres}>
      {children}
    </ParametresContext.Provider>
  )
}

export const useParametres = () => useContext(ParametresContext)