import { useState, useEffect, useCallback } from 'react'
import type { AppSettings } from '../types'
import { getSettings, updateSettings, resetSettings } from '../utils/settingsApi'

interface UseSettingsReturn {
  settings: AppSettings | null
  loading: boolean
  save: (s: AppSettings) => Promise<void>
  reset: () => Promise<void>
}

export function useSettings(): UseSettingsReturn {
  const [settings, setSettings] = useState<AppSettings | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSettings()
      .then(s => {
        setSettings(s)
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to load settings:', err)
        setLoading(false)
      })
  }, [])

  const save = useCallback(async (newSettings: AppSettings): Promise<void> => {
    try {
      await updateSettings(newSettings)
      setSettings(newSettings)
    } catch (err) {
      console.error('Failed to save settings:', err)
    }
  }, [])

  const reset = useCallback(async (): Promise<void> => {
    try {
      await resetSettings()
      const s = await getSettings()
      setSettings(s)
    } catch (err) {
      console.error('Failed to reset settings:', err)
    }
  }, [])

  return { settings, loading, save, reset }
}
