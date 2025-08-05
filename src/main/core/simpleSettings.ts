import { app } from 'electron'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'

// 导入共享的类型定义
import type { AppSettings } from '@shared/types'
export type { AppSettings } from '@shared/types'

/**
 * 简单的设置管理器
 * 使用原生Node.js文件系统，避免外部依赖
 */
class SimpleSettingsManager {
  private settingsPath: string
  private settings: AppSettings
  private watchCallbacks: Map<string, ((newValue: any, oldValue: any) => void)[]> = new Map()

  constructor() {
    // 获取设置文件路径
    const userDataPath = app.getPath('userData')
    this.settingsPath = join(userDataPath, 'settings.json')

    // 确保目录存在
    const settingsDir = dirname(this.settingsPath)
    if (!existsSync(settingsDir)) {
      mkdirSync(settingsDir, { recursive: true })
    }

    // 加载设置
    this.settings = this.loadSettings()

    console.log('📁 简单设置管理器初始化完成')
    console.log('📍 设置文件路径:', this.settingsPath)
  }

  /**
   * 获取默认设置
   */
  private getDefaultSettings(): AppSettings {
    return {
      general: {
        autoLaunch: false,
        language: 'zh-CN',
        theme: 'auto',
        showLunarCalendar: true
      },
      calendar: {
        weekStartsOn: 1, // 周一开始
        showWeekNumbers: false,
        highlightToday: true,
        showFestivals: true,
        showSolarTerms: true
      },
      ui: {
        windowOpacity: 0.95,
        enableGlassmorphism: true,
        showLunarInfo: true
      },
      advanced: {
        enableDebugMode: false,
        enableHardwareAcceleration: true,
        launchMinimized: false
      }
    }
  }

  /**
   * 加载设置
   */
  private loadSettings(): AppSettings {
    try {
      if (existsSync(this.settingsPath)) {
        const settingsData = readFileSync(this.settingsPath, 'utf8')
        const loadedSettings = JSON.parse(settingsData) as Partial<AppSettings>

        // 合并默认设置和加载的设置，确保所有字段都存在
        const defaultSettings = this.getDefaultSettings()
        return this.mergeSettings(defaultSettings, loadedSettings)
      }
    } catch (error) {
      console.error('❌ 加载设置失败，使用默认设置:', error)
    }

    return this.getDefaultSettings()
  }

  /**
   * 保存设置到文件
   */
  private saveSettings(): void {
    try {
      const settingsData = JSON.stringify(this.settings, null, 2)
      writeFileSync(this.settingsPath, settingsData, 'utf8')
      console.log('💾 设置已保存')
    } catch (error) {
      console.error('❌ 保存设置失败:', error)
      throw error
    }
  }

  /**
   * 深度合并设置对象
   */
  private mergeSettings(defaults: AppSettings, loaded: Partial<AppSettings>): AppSettings {
    const result = { ...defaults }

    for (const key in loaded) {
      const categoryKey = key as keyof AppSettings
      if (loaded[categoryKey] && typeof loaded[categoryKey] === 'object') {
        result[categoryKey] = {
          ...defaults[categoryKey],
          ...loaded[categoryKey]
        } as any
      }
    }

    return result
  }

  /**
   * 获取所有设置
   */
  getAllSettings(): AppSettings {
    return { ...this.settings }
  }

  /**
   * 获取设置分类
   */
  getSettings<K extends keyof AppSettings>(category: K): AppSettings[K] {
    return { ...this.settings[category] }
  }

  /**
   * 获取单个设置项
   */
  getSetting<K extends keyof AppSettings, T extends keyof AppSettings[K]>(
    category: K,
    key: T
  ): AppSettings[K][T] {
    return this.settings[category][key]
  }

  /**
   * 更新设置分类
   */
  updateSettings<K extends keyof AppSettings>(category: K, updates: Partial<AppSettings[K]>): void {
    const oldValue = { ...this.settings[category] }
    this.settings[category] = { ...this.settings[category], ...updates }

    this.saveSettings()
    console.log(`⚙️  设置已更新: ${category}`, updates)

    // 触发监听器
    this.triggerCallbacks(`${category}`, this.settings[category], oldValue)

    // 特殊处理需要立即生效的设置
    this.handleSpecialSettings(category, updates)
  }

  /**
   * 更新单个设置项
   */
  updateSetting<K extends keyof AppSettings, T extends keyof AppSettings[K]>(
    category: K,
    key: T,
    value: AppSettings[K][T]
  ): void {
    const oldValue = this.settings[category][key]
    this.settings[category][key] = value

    this.saveSettings()
    console.log(`⚙️  设置已更新: ${category}.${String(key)} = ${value}`)

    // 触发监听器
    this.triggerCallbacks(`${category}.${String(key)}`, value, oldValue)

    // 特殊处理需要立即生效的设置
    this.handleSpecialSettings(category, { [key]: value } as Partial<AppSettings[K]>)
  }

  /**
   * 处理需要立即生效的特殊设置
   */
  private handleSpecialSettings<K extends keyof AppSettings>(
    category: K,
    updates: Partial<AppSettings[K]>
  ): void {
    if (category === 'general' && 'autoLaunch' in updates) {
      this.setAutoLaunch((updates as any).autoLaunch)
    }
  }

  /**
   * 设置开机自启动
   */
  setAutoLaunch(enable: boolean): void {
    try {
      if (process.platform === 'darwin') {
        app.setLoginItemSettings({
          openAtLogin: enable,
          openAsHidden: true // macOS启动时隐藏，只显示托盘
        })
        console.log(`🚀 开机自启动已${enable ? '启用' : '禁用'}`)
      } else {
        // Windows/Linux 支持
        app.setLoginItemSettings({
          openAtLogin: enable
        })
        console.log(`🚀 开机自启动已${enable ? '启用' : '禁用'}`)
      }
    } catch (error) {
      console.error('❌ 设置开机自启动失败:', error)
    }
  }

  /**
   * 获取开机自启动状态
   */
  getAutoLaunchStatus(): boolean {
    try {
      return app.getLoginItemSettings().openAtLogin
    } catch (error) {
      console.error('❌ 获取开机自启动状态失败:', error)
      return false
    }
  }

  /**
   * 重置所有设置为默认值
   */
  resetSettings(): void {
    this.settings = this.getDefaultSettings()
    this.saveSettings()
    console.log('🔄 设置已重置为默认值')
  }

  /**
   * 监听设置变化
   */
  onSettingsChange<K extends keyof AppSettings>(
    category: K,
    callback: (newValue: AppSettings[K], oldValue: AppSettings[K]) => void
  ): () => void {
    const key = String(category)
    if (!this.watchCallbacks.has(key)) {
      this.watchCallbacks.set(key, [])
    }
    this.watchCallbacks.get(key)!.push(callback)

    // 返回取消监听的函数
    return () => {
      const callbacks = this.watchCallbacks.get(key)
      if (callbacks) {
        const index = callbacks.indexOf(callback)
        if (index > -1) {
          callbacks.splice(index, 1)
        }
      }
    }
  }

  /**
   * 监听单个设置项变化
   */
  onSettingChange<K extends keyof AppSettings, T extends keyof AppSettings[K]>(
    category: K,
    key: T,
    callback: (newValue: AppSettings[K][T], oldValue: AppSettings[K][T]) => void
  ): () => void {
    const watchKey = `${String(category)}.${String(key)}`
    if (!this.watchCallbacks.has(watchKey)) {
      this.watchCallbacks.set(watchKey, [])
    }
    this.watchCallbacks.get(watchKey)!.push(callback)

    // 返回取消监听的函数
    return () => {
      const callbacks = this.watchCallbacks.get(watchKey)
      if (callbacks) {
        const index = callbacks.indexOf(callback)
        if (index > -1) {
          callbacks.splice(index, 1)
        }
      }
    }
  }

  /**
   * 触发监听器回调
   */
  private triggerCallbacks(key: string, newValue: any, oldValue: any): void {
    const callbacks = this.watchCallbacks.get(key)
    if (callbacks) {
      callbacks.forEach((callback) => {
        try {
          callback(newValue, oldValue)
        } catch (error) {
          console.error(`❌ 设置监听器回调执行失败 (${key}):`, error)
        }
      })
    }
  }

  /**
   * 导出设置
   */
  exportSettings(): AppSettings {
    return this.getAllSettings()
  }

  /**
   * 导入设置
   */
  importSettings(settings: Partial<AppSettings>): void {
    Object.keys(settings).forEach((category) => {
      const categoryKey = category as keyof AppSettings
      if (settings[categoryKey]) {
        this.updateSettings(categoryKey, settings[categoryKey]!)
      }
    })
    console.log('📥 设置导入完成')
  }

  /**
   * 获取设置文件路径
   */
  getSettingsPath(): string {
    return this.settingsPath
  }
}

// 单例实例
let settingsManager: SimpleSettingsManager | null = null

/**
 * 获取设置管理器实例 (单例)
 */
export function getSettingsManager(): SimpleSettingsManager {
  if (!settingsManager) {
    settingsManager = new SimpleSettingsManager()
  }
  return settingsManager
}

/**
 * 便捷函数：获取所有设置
 */
export function getSettings(): AppSettings {
  return getSettingsManager().getAllSettings()
}

/**
 * 便捷函数：更新设置
 */
export function updateSettings<K extends keyof AppSettings>(
  category: K,
  updates: Partial<AppSettings[K]>
): void {
  return getSettingsManager().updateSettings(category, updates)
}

/**
 * 便捷函数：获取单个设置
 */
export function getSetting<K extends keyof AppSettings, T extends keyof AppSettings[K]>(
  category: K,
  key: T
): AppSettings[K][T] {
  return getSettingsManager().getSetting(category, key)
}

/**
 * 便捷函数：更新单个设置
 */
export function updateSetting<K extends keyof AppSettings, T extends keyof AppSettings[K]>(
  category: K,
  key: T,
  value: AppSettings[K][T]
): void {
  return getSettingsManager().updateSetting(category, key, value)
}
