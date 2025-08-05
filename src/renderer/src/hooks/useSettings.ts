import { useState, useEffect, useCallback } from 'react'
import type { AppSettings } from '@shared/types'

/**
 * 设置管理Hook
 * 提供设置的读取、更新和响应式状态管理
 */
export function useSettings(): {
  settings: AppSettings | null
  loading: boolean
  error: string | null
  updateSettings: <K extends keyof AppSettings>(
    category: K,
    updates: Partial<AppSettings[K]>
  ) => Promise<boolean>
  updateSetting: <K extends keyof AppSettings, T extends keyof AppSettings[K]>(
    category: K,
    key: T,
    value: AppSettings[K][T]
  ) => Promise<boolean>
  resetSettings: () => Promise<boolean>
  exportSettings: () => Promise<AppSettings | null>
  importSettings: (settings: Partial<AppSettings>) => Promise<boolean>
  reload: () => Promise<void>
} {
  const [settings, setSettings] = useState<AppSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 加载设置
  const loadSettings = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const allSettings = await window.api.settings.getAll()
      setSettings(allSettings)
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载设置失败')
      console.error('❌ 加载设置失败:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // 更新设置分类
  const updateSettings = useCallback(
    async <K extends keyof AppSettings>(
      category: K,
      updates: Partial<AppSettings[K]>
    ): Promise<boolean> => {
      try {
        setError(null)
        await window.api.settings.updateCategory(category, updates)

        // 更新本地状态
        if (settings) {
          setSettings((prev) => ({
            ...prev!,
            [category]: { ...prev![category], ...updates }
          }))
        }
        return true
      } catch (err) {
        setError(err instanceof Error ? err.message : '更新设置失败')
        console.error('❌ 更新设置失败:', err)
        return false
      }
    },
    [settings]
  )

  // 更新单个设置
  const updateSetting = useCallback(
    async <K extends keyof AppSettings, T extends keyof AppSettings[K]>(
      category: K,
      key: T,
      value: AppSettings[K][T]
    ): Promise<boolean> => {
      try {
        setError(null)
        await window.api.settings.update(category, key, value)

        // 更新本地状态
        if (settings) {
          setSettings((prev) => ({
            ...prev!,
            [category]: { ...prev![category], [key]: value }
          }))
        }
        return true
      } catch (err) {
        setError(err instanceof Error ? err.message : '更新设置失败')
        console.error('❌ 更新设置失败:', err)
        return false
      }
    },
    [settings]
  )

  // 重置设置
  const resetSettings = useCallback(async (): Promise<boolean> => {
    try {
      setError(null)
      await window.api.settings.reset()
      await loadSettings() // 重新加载设置
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : '重置设置失败')
      console.error('❌ 重置设置失败:', err)
      return false
    }
  }, [loadSettings])

  // 初始化时加载设置
  useEffect(() => {
    loadSettings()
  }, [loadSettings])

  return {
    settings,
    loading,
    error,
    updateSettings,
    updateSetting,
    resetSettings,
    reload: loadSettings
  }
}

/**
 * 开机自启动Hook
 */
export function useAutoLaunch(): {
  enabled: boolean
  loading: boolean
  error: string | null
  toggle: () => Promise<boolean>
  reload: () => Promise<void>
} {
  const [enabled, setEnabled] = useState<boolean>(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 加载开机自启动状态
  const loadStatus = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const status = await window.api.settings.getAutoLaunchStatus()
      setEnabled(status)
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取自启动状态失败')
      console.error('❌ 获取自启动状态失败:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // 设置开机自启动
  const setAutoLaunch = useCallback(async (enable: boolean): Promise<boolean> => {
    try {
      setError(null)
      await window.api.settings.setAutoLaunch(enable)
      setEnabled(enable)
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : '设置自启动失败')
      console.error('❌ 设置自启动失败:', err)
      return false
    }
  }, [])

  // 初始化时加载状态
  useEffect(() => {
    loadStatus()
  }, [loadStatus])

  return {
    enabled,
    loading,
    error,
    setAutoLaunch,
    reload: loadStatus
  }
}

/**
 * 主题设置Hook
 */
export function useTheme(): {
  theme: 'light' | 'dark' | 'auto'
  setTheme: (newTheme: 'light' | 'dark' | 'auto') => Promise<boolean>
  isDark: boolean
} {
  const { settings, updateSetting } = useSettings()

  const theme = settings?.general.theme || 'auto'

  const setTheme = useCallback(
    async (newTheme: 'light' | 'dark' | 'auto'): Promise<boolean> => {
      return await updateSetting('general', 'theme', newTheme)
    },
    [updateSetting]
  )

  // 应用主题到DOM
  useEffect(() => {
    const applyTheme = (targetTheme: 'light' | 'dark' | 'auto'): void => {
      const html = document.documentElement

      if (targetTheme === 'auto') {
        // 自动模式：跟随系统
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        html.classList.toggle('dark', prefersDark)
      } else {
        // 手动模式
        html.classList.toggle('dark', targetTheme === 'dark')
      }
    }

    applyTheme(theme)

    // 监听系统主题变化（仅在auto模式下）
    if (theme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = (): void => applyTheme('auto')

      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }
  }, [theme])

  return {
    theme,
    setTheme,
    isDark: document.documentElement.classList.contains('dark')
  }
}
