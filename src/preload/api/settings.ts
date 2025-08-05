import { ipcRenderer } from 'electron'
import type { AppSettings } from '../../main/core/simpleSettings'

/**
 * 设置相关的预加载API
 * 为渲染进程提供安全的设置访问接口
 */
export interface SettingsApi {
  // 获取设置
  getAll: () => Promise<AppSettings>
  getCategory: <K extends keyof AppSettings>(category: K) => Promise<AppSettings[K]>
  get: <K extends keyof AppSettings, T extends keyof AppSettings[K]>(
    category: K,
    key: T
  ) => Promise<AppSettings[K][T]>

  // 更新设置
  updateCategory: <K extends keyof AppSettings>(
    category: K,
    updates: Partial<AppSettings[K]>
  ) => Promise<{ success: boolean }>
  update: <K extends keyof AppSettings, T extends keyof AppSettings[K]>(
    category: K,
    key: T,
    value: AppSettings[K][T]
  ) => Promise<{ success: boolean }>

  // 高级操作
  reset: () => Promise<{ success: boolean }>
  export: () => Promise<AppSettings>
  import: (settings: Partial<AppSettings>) => Promise<{ success: boolean }>

  // 开机自启动
  getAutoLaunchStatus: () => Promise<boolean>
  setAutoLaunch: (enable: boolean) => Promise<{ success: boolean }>

  // 工具函数
  getPath: () => Promise<string>
}

/**
 * 设置API实现
 */
export const settingsApi: SettingsApi = {
  // 获取设置
  getAll: () => ipcRenderer.invoke('settings:getAll'),
  getCategory: (category) => ipcRenderer.invoke('settings:getCategory', category),
  get: (category, key) => ipcRenderer.invoke('settings:get', category, key),

  // 更新设置
  updateCategory: (category, updates) =>
    ipcRenderer.invoke('settings:updateCategory', category, updates),
  update: (category, key, value) => ipcRenderer.invoke('settings:update', category, key, value),

  // 高级操作
  reset: () => ipcRenderer.invoke('settings:reset'),
  export: () => ipcRenderer.invoke('settings:export'),
  import: (settings) => ipcRenderer.invoke('settings:import', settings),

  // 开机自启动
  getAutoLaunchStatus: () => ipcRenderer.invoke('settings:getAutoLaunchStatus'),
  setAutoLaunch: (enable) => ipcRenderer.invoke('settings:setAutoLaunch', enable),

  // 工具函数
  getPath: () => ipcRenderer.invoke('settings:getPath')
}
