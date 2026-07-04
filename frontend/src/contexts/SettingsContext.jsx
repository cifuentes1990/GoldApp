import { createContext, useContext, useEffect, useState } from 'react'
import api from '../utils/api'

const DEFAULTS = {
  phone:     '+57 300 123 4567',
  whatsapp:  '573001234567',
  instagram: 'https://instagram.com',
  facebook:  'https://facebook.com',
  tiktok:    'https://tiktok.com/@giorgiojoyeria',
  email:     'contacto@giorgiojoyeria.com',
  address:   'Medellín, Antioquia, Colombia',
  hours:     'Lun – Sáb: 8:00am – 7:00pm',
}

const SettingsContext = createContext({ settings: DEFAULTS, reload: () => {} })

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULTS)

  const load = () =>
    api.get('/settings')
      .then(res => setSettings({ ...DEFAULTS, ...res.data.settings }))
      .catch(() => {}) // keep defaults on error

  useEffect(() => { load() }, [])

  return (
    <SettingsContext.Provider value={{ settings, reload: load }}>
      {children}
    </SettingsContext.Provider>
  )
}

export const useSettings = () => useContext(SettingsContext)
