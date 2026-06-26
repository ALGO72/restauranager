const BACKEND_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'

export function startKeepAlive() {
  const ping = () => {
    fetch(`${BACKEND_URL}/`)
      .catch(() => console.log('Backend en veille...'))
  }
  ping()
  setInterval(ping, 10 * 60 * 1000)
}