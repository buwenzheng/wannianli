import Store from 'electron-store'
import { app } from 'electron'

/**
 * 应用设置数据结构
 */
export interface AppSettings {
  general: {
    autoLaunch: boolean // 开机自启动
    language: 'zh-CN' | 'en-US' // 语言设置
    theme: 'light' | 'dark' | 'auto' // 主题模式
    showLunarCalendar: boolean // 显示农历
  }
  calendar: {
    weekStartsOn: 0 | 1 // 一周开始于 (0=周日, 1=周一)
    showWeekNumbers: boolean // 显示周数
    highlightToday: boolean // 高亮今日
    showFestivals: boolean // 显示节日
    showSolarTerms: boolean // 显示节气
  }
  ui: {
    windowOpacity: number // 窗口透明度 (0.1-1.0)
    enableGlassmorphism: boolean // 启用玻璃拟态效果
    showLunarInfo: boolean // 显示农历信息
  }
  advanced: {
    enableDebugMode: boolean // 开发者模式
    enableHardwareAcceleration: boolean // 硬件加速
    launchMinimized: boolean // 启动时最小化
  }
}

/**
 * 设置管理器
 * 提供应用设置的读写、监听和持久化功能
 */
class SettingsManager {
  private store: any

  constructor() {
    this.store = new Store<AppSettings>({
      name: 'settings',
      defaults: this.getDefaultSettings(),
      // 开启数据验证
      schema: {
        general: {
          type: 'object',
          properties: {
            autoLaunch: { type: 'boolean' },
            language: { type: 'string', enum: ['zh-CN', 'en-US'] },
            theme: { type: 'string', enum: ['light', 'dark', 'auto'] },
            showLunarCalendar: { type: 'boolean' }
          },
          required: ['autoLaunch', 'language', 'theme', 'showLunarCalendar']
        },
        calendar: {
          type: 'object',
          properties: {
            weekStartsOn: { type: 'number', enum: [0, 1] },
            showWeekNumbers: { type: 'boolean' },
            highlightToday: { type: 'boolean' },
            showFestivals: { type: 'boolean' },
            showSolarTerms: { type: 'boolean' }
          },
          required: [
            'weekStartsOn',
            'showWeekNumbers',
            'highlightToday',
            'showFestivals',
            'showSolarTerms'
          ]
        },
        ui: {
          type: 'object',
          properties: {
            windowOpacity: { type: 'number', minimum: 0.1, maximum: 1.0 },
            enableGlassmorphism: { type: 'boolean' },
            showLunarInfo: { type: 'boolean' }
          },
          required: ['windowOpacity', 'enableGlassmorphism', 'showLunarInfo']
        },
        advanced: {
          type: 'object',
          properties: {
            enableDebugMode: { type: 'boolean' },
            enableHardwareAcceleration: { type: 'boolean' },
            launchMinimized: { type: 'boolean' }
          },
          required: ['enableDebugMode', 'enableHardwareAcceleration', 'launchMinimized']
        }
      }
    })

    console.log('📁 设置管理器初始化完成')
    console.log('📍 设置文件路径:', this.store.path)
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
   * 获取所有设置
   */
  getAllSettings(): AppSettings {
    return this.store.store
  }

  /**
   * 获取特定分类的设置
   */
  getSettings<K extends keyof AppSettings>(category: K): AppSettings[K] {
    return this.store.get(category)
  }

  /**
   * 获取单个设置项
   */
  getSetting<K extends keyof AppSettings, T extends keyof AppSettings[K]>(
    category: K,
    key: T
  ): AppSettings[K][T] {
    return this.store.get(`${category}.${String(key)}` as any)
  }

  /**
   * 更新设置分类
   */
  updateSettings<K extends keyof AppSettings>(category: K, updates: Partial<AppSettings[K]>): void {
    const currentSettings = this.getSettings(category)
    const newSettings = { ...currentSettings, ...updates }

    this.store.set(category, newSettings)
    console.log(`⚙️  设置已更新: ${category}`, updates)

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
    this.store.set(`${category}.${String(key)}` as any, value)
    console.log(`⚙️  设置已更新: ${category}.${String(key)} = ${value}`)

    // 特殊处理需要立即生效的设置
    this.handleSpecialSettings(category, { [key]: value } as unknown as Partial<AppSettings[K]>)
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
    this.store.clear()
    console.log('🔄 设置已重置为默认值')
  }

  /**
   * 监听设置变化
   */
  onSettingsChange<K extends keyof AppSettings>(
    category: K,
    callback: (newValue: AppSettings[K], oldValue: AppSettings[K]) => void
  ): () => void {
    return this.store.onDidChange(category, callback)
  }

  /**
   * 监听单个设置项变化
   */
  onSettingChange<K extends keyof AppSettings, T extends keyof AppSettings[K]>(
    category: K,
    key: T,
    callback: (newValue: AppSettings[K][T], oldValue: AppSettings[K][T]) => void
  ): () => void {
    return this.store.onDidChange(`${category}.${String(key)}` as any, callback)
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
    return this.store.path
  }
}

// 单例实例
let settingsManager: SettingsManager | null = null

/**
 * 获取设置管理器实例 (单例)
 */
export function getSettingsManager(): SettingsManager {
  if (!settingsManager) {
    settingsManager = new SettingsManager()
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
