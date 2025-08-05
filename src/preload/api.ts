import { ipcRenderer } from 'electron'
import type { AppSettings } from '@shared/types'

/**
 * 合并的预加载 API
 * 包含窗口管理、托盘管理和设置相关的所有 API
 */

// ==================== 窗口管理 API ====================

/**
 * 窗口管理相关API
 */
export interface WindowApi {
  // 日历弹出窗口操作
  showCalendarPopup: (x?: number, y?: number) => Promise<{ success: boolean; error?: string }>
  hideCalendarPopup: () => Promise<{ success: boolean; error?: string }>
  toggleCalendarPopup: () => Promise<{ success: boolean; error?: string }>
  closeCalendarPopup: () => Promise<{ success: boolean; error?: string }>

  // 窗口状态查询
  getPopupState: () => Promise<{
    success: boolean
    isOpen?: boolean
    isVisible?: boolean
    isFocused?: boolean
    error?: string
  }>

  getMainWindowState: () => Promise<{
    success: boolean
    isOpen?: boolean
    isVisible?: boolean
    isMinimized?: boolean
    isMaximized?: boolean
    isFocused?: boolean
    error?: string
  }>

  // 窗口位置控制
  setPopupPosition: (x: number, y: number) => Promise<{ success: boolean; error?: string }>

  // 主窗口操作
  minimizeMain: () => Promise<{ success: boolean; error?: string }>
  maximizeMain: () => Promise<{ success: boolean; error?: string }>
  closeMain: () => Promise<{ success: boolean; error?: string }>
}

export const windowApi: WindowApi = {
  // 日历弹出窗口操作
  showCalendarPopup: (x?: number, y?: number) =>
    ipcRenderer.invoke('window:show-calendar-popup', x, y),
  hideCalendarPopup: () => ipcRenderer.invoke('window:hide-calendar-popup'),
  toggleCalendarPopup: () => ipcRenderer.invoke('window:toggle-calendar-popup'),
  closeCalendarPopup: () => ipcRenderer.invoke('window:close-calendar-popup'),

  // 窗口状态查询
  getPopupState: () => ipcRenderer.invoke('window:get-popup-state'),
  getMainWindowState: () => ipcRenderer.invoke('window:get-main-window-state'),

  // 窗口位置控制
  setPopupPosition: (x: number, y: number) => ipcRenderer.invoke('window:set-popup-position', x, y),

  // 主窗口操作
  minimizeMain: () => ipcRenderer.invoke('window:minimize-main'),
  maximizeMain: () => ipcRenderer.invoke('window:maximize-main'),
  closeMain: () => ipcRenderer.invoke('window:close-main')
}

// ==================== 托盘管理 API ====================

/**
 * 托盘管理相关API
 */
export interface TrayApi {
  // 托盘基本操作
  create: () => Promise<{ success: boolean; error?: string }>
  destroy: () => Promise<{ success: boolean; error?: string }>
  updateMenu: () => Promise<{ success: boolean; error?: string }>

  // 托盘状态查询
  isSupported: () => Promise<{ success: boolean; supported?: boolean; error?: string }>
  getState: () => Promise<{
    success: boolean
    isCreated?: boolean
    isSupported?: boolean
    error?: string
  }>

  // 托盘交互
  updateTooltip: (text: string) => Promise<{ success: boolean; error?: string }>
  showBalloon: (options: {
    title: string
    content: string
    icon?: string
  }) => Promise<{ success: boolean; error?: string }>
  flash: (enable?: boolean) => Promise<{ success: boolean; error?: string }>
}

export const trayApi: TrayApi = {
  // 托盘基本操作
  create: () => ipcRenderer.invoke('tray:create'),
  destroy: () => ipcRenderer.invoke('tray:destroy'),
  updateMenu: () => ipcRenderer.invoke('tray:update-menu'),

  // 托盘状态查询
  isSupported: () => ipcRenderer.invoke('tray:is-supported'),
  getState: () => ipcRenderer.invoke('tray:get-state'),

  // 托盘交互
  updateTooltip: (text: string) => ipcRenderer.invoke('tray:update-tooltip', text),
  showBalloon: (options: { title: string; content: string; icon?: string }) =>
    ipcRenderer.invoke('tray:show-balloon', options),
  flash: (enable: boolean = true) => ipcRenderer.invoke('tray:flash', enable)
}

// ==================== 设置管理 API ====================

/**
 * 设置相关的预加载API
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
