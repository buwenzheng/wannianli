import { ipcMain, IpcMainInvokeEvent } from 'electron'
import {
  showCalendarPopupWindow,
  hideCalendarPopupWindow,
  toggleCalendarPopupWindow,
  closeCalendarPopupWindow,
  getMainWindow,
  getCalendarPopupWindow
} from '@main/window'
import {
  createTray,
  destroyTray,
  updateTrayMenu,
  updateTrayTooltip,
  showTrayBalloon,
  flashTray,
  isTraySupported,
  getTray
} from '@main/tray'
import { getSettingsManager, AppSettings } from '@main/settings'

/**
 * 合并的 IPC 通信处理
 * 包含窗口管理、托盘管理和设置相关的所有 IPC 处理器
 */

// ==================== 窗口管理 IPC 处理器 ====================

/**
 * 注册窗口管理相关的IPC处理器
 */
export function registerWindowIpcHandlers(): void {
  // 显示日历弹出窗口
  ipcMain.handle(
    'window:show-calendar-popup',
    async (_event: IpcMainInvokeEvent, x?: number, y?: number) => {
      try {
        showCalendarPopupWindow(x, y)
        return { success: true }
      } catch (error) {
        console.error('显示日历弹出窗口失败:', error)
        return { success: false, error: error instanceof Error ? error.message : String(error) }
      }
    }
  )

  // 隐藏日历弹出窗口
  ipcMain.handle('window:hide-calendar-popup', async () => {
    try {
      hideCalendarPopupWindow()
      return { success: true }
    } catch (error) {
      console.error('隐藏日历弹出窗口失败:', error)
      return { success: false, error: error instanceof Error ? error.message : String(error) }
    }
  })

  // 切换日历弹出窗口显示状态
  ipcMain.handle('window:toggle-calendar-popup', async () => {
    try {
      toggleCalendarPopupWindow()
      return { success: true }
    } catch (error) {
      console.error('切换日历弹出窗口失败:', error)
      return { success: false, error: error instanceof Error ? error.message : String(error) }
    }
  })

  // 关闭日历弹出窗口
  ipcMain.handle('window:close-calendar-popup', async () => {
    try {
      closeCalendarPopupWindow()
      return { success: true }
    } catch (error) {
      console.error('关闭日历弹出窗口失败:', error)
      return { success: false, error: error instanceof Error ? error.message : String(error) }
    }
  })

  // 获取窗口状态
  ipcMain.handle('window:get-popup-state', async () => {
    try {
      const popupWindow = getCalendarPopupWindow()
      return {
        success: true,
        isOpen: popupWindow && !popupWindow.isDestroyed(),
        isVisible: popupWindow && !popupWindow.isDestroyed() && popupWindow.isVisible(),
        isFocused: popupWindow && !popupWindow.isDestroyed() && popupWindow.isFocused()
      }
    } catch (error) {
      console.error('获取窗口状态失败:', error)
      return { success: false, error: error instanceof Error ? error.message : String(error) }
    }
  })

  // 设置窗口位置
  ipcMain.handle(
    'window:set-popup-position',
    async (_event: IpcMainInvokeEvent, x: number, y: number) => {
      try {
        const popupWindow = getCalendarPopupWindow()
        if (popupWindow && !popupWindow.isDestroyed()) {
          popupWindow.setPosition(x, y)
          return { success: true }
        }
        return { success: false, error: '弹出窗口不存在' }
      } catch (error) {
        console.error('设置窗口位置失败:', error)
        return { success: false, error: error instanceof Error ? error.message : String(error) }
      }
    }
  )

  // 获取主窗口状态
  ipcMain.handle('window:get-main-window-state', async () => {
    try {
      const mainWindow = getMainWindow()
      return {
        success: true,
        isOpen: mainWindow && !mainWindow.isDestroyed(),
        isVisible: mainWindow && !mainWindow.isDestroyed() && mainWindow.isVisible(),
        isMinimized: mainWindow && !mainWindow.isDestroyed() && mainWindow.isMinimized(),
        isMaximized: mainWindow && !mainWindow.isDestroyed() && mainWindow.isMaximized(),
        isFocused: mainWindow && !mainWindow.isDestroyed() && mainWindow.isFocused()
      }
    } catch (error) {
      console.error('获取主窗口状态失败:', error)
      return { success: false, error: error instanceof Error ? error.message : String(error) }
    }
  })

  // 主窗口操作
  ipcMain.handle('window:minimize-main', async () => {
    try {
      const mainWindow = getMainWindow()
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.minimize()
        return { success: true }
      }
      return { success: false, error: '主窗口不存在' }
    } catch (error) {
      console.error('最小化主窗口失败:', error)
      return { success: false, error: error instanceof Error ? error.message : String(error) }
    }
  })

  ipcMain.handle('window:maximize-main', async () => {
    try {
      const mainWindow = getMainWindow()
      if (mainWindow && !mainWindow.isDestroyed()) {
        if (mainWindow.isMaximized()) {
          mainWindow.unmaximize()
        } else {
          mainWindow.maximize()
        }
        return { success: true }
      }
      return { success: false, error: '主窗口不存在' }
    } catch (error) {
      console.error('最大化/还原主窗口失败:', error)
      return { success: false, error: error instanceof Error ? error.message : String(error) }
    }
  })

  ipcMain.handle('window:close-main', async () => {
    try {
      const mainWindow = getMainWindow()
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.close()
        return { success: true }
      }
      return { success: false, error: '主窗口不存在' }
    } catch (error) {
      console.error('关闭主窗口失败:', error)
      return { success: false, error: error instanceof Error ? error.message : String(error) }
    }
  })
}

// ==================== 托盘管理 IPC 处理器 ====================

/**
 * 注册托盘管理相关的IPC处理器
 */
export function registerTrayIpcHandlers(): void {
  // 创建系统托盘
  ipcMain.handle('tray:create', async () => {
    try {
      const tray = createTray()
      return { success: !!tray }
    } catch (error) {
      console.error('创建托盘失败:', error)
      return { success: false, error: error instanceof Error ? error.message : String(error) }
    }
  })

  // 销毁系统托盘
  ipcMain.handle('tray:destroy', async () => {
    try {
      destroyTray()
      return { success: true }
    } catch (error) {
      console.error('销毁托盘失败:', error)
      return { success: false, error: error instanceof Error ? error.message : String(error) }
    }
  })

  // 更新托盘菜单
  ipcMain.handle('tray:update-menu', async () => {
    try {
      updateTrayMenu()
      return { success: true }
    } catch (error) {
      console.error('更新托盘菜单失败:', error)
      return { success: false, error: error instanceof Error ? error.message : String(error) }
    }
  })

  // 检查托盘支持
  ipcMain.handle('tray:is-supported', async () => {
    try {
      return { success: true, supported: isTraySupported() }
    } catch (error) {
      console.error('检查托盘支持失败:', error)
      return { success: false, error: error instanceof Error ? error.message : String(error) }
    }
  })

  // 获取托盘状态
  ipcMain.handle('tray:get-state', async () => {
    try {
      const tray = getTray()
      return {
        success: true,
        isCreated: !!tray && !tray.isDestroyed(),
        isSupported: isTraySupported()
      }
    } catch (error) {
      console.error('获取托盘状态失败:', error)
      return { success: false, error: error instanceof Error ? error.message : String(error) }
    }
  })

  // 更新托盘提示文本
  ipcMain.handle('tray:update-tooltip', async (_event: IpcMainInvokeEvent, text: string) => {
    try {
      updateTrayTooltip(text)
      return { success: true }
    } catch (error) {
      console.error('更新托盘提示文本失败:', error)
      return { success: false, error: error instanceof Error ? error.message : String(error) }
    }
  })

  // 显示托盘通知
  ipcMain.handle(
    'tray:show-balloon',
    async (
      _event: IpcMainInvokeEvent,
      options: {
        title: string
        content: string
        icon?: string
      }
    ) => {
      try {
        showTrayBalloon(options)
        return { success: true }
      } catch (error) {
        console.error('显示托盘通知失败:', error)
        return { success: false, error: error instanceof Error ? error.message : String(error) }
      }
    }
  )

  // 设置托盘闪烁
  ipcMain.handle('tray:flash', async (_event: IpcMainInvokeEvent, enable: boolean = true) => {
    try {
      flashTray(enable)
      return { success: true }
    } catch (error) {
      console.error('设置托盘闪烁失败:', error)
      return { success: false, error: error instanceof Error ? error.message : String(error) }
    }
  })
}

// ==================== 设置管理 IPC 处理器 ====================

/**
 * 注册设置相关的IPC处理器
 */
export function registerSettingsIpcHandlers(): void {
  const settingsManager = getSettingsManager()

  // 获取所有设置
  ipcMain.handle('settings:getAll', () => {
    try {
      return settingsManager.getAllSettings()
    } catch (error) {
      console.error('❌ 获取设置失败:', error)
      throw error
    }
  })

  // 获取设置分类
  ipcMain.handle('settings:getCategory', (_, category: keyof AppSettings) => {
    try {
      return settingsManager.getSettings(category)
    } catch (error) {
      console.error(`❌ 获取设置分类 ${String(category)} 失败:`, error)
      throw error
    }
  })

  // 获取单个设置项
  ipcMain.handle('settings:get', (_, category: keyof AppSettings, key: string) => {
    try {
      // 使用类型断言来绕过严格的泛型约束
      const typedManager = settingsManager as any
      return typedManager.getSetting(category, key)
    } catch (error) {
      console.error(`❌ 获取设置 ${String(category)}.${key} 失败:`, error)
      throw error
    }
  })

  // 更新设置分类
  ipcMain.handle('settings:updateCategory', (_, category: keyof AppSettings, updates: any) => {
    try {
      settingsManager.updateSettings(category, updates)
      return { success: true }
    } catch (error) {
      console.error(`❌ 更新设置分类 ${String(category)} 失败:`, error)
      throw error
    }
  })

  // 更新单个设置项
  ipcMain.handle('settings:update', (_, category: keyof AppSettings, key: string, value: any) => {
    try {
      // 使用类型断言来绕过严格的泛型约束
      const typedManager = settingsManager as any
      typedManager.updateSetting(category, key, value)
      return { success: true }
    } catch (error) {
      console.error(`❌ 更新设置 ${String(category)}.${key} 失败:`, error)
      throw error
    }
  })

  // 重置设置
  ipcMain.handle('settings:reset', () => {
    try {
      settingsManager.resetSettings()
      return { success: true }
    } catch (error) {
      console.error('❌ 重置设置失败:', error)
      throw error
    }
  })

  // 导出设置
  ipcMain.handle('settings:export', () => {
    try {
      return settingsManager.exportSettings()
    } catch (error) {
      console.error('❌ 导出设置失败:', error)
      throw error
    }
  })

  // 导入设置
  ipcMain.handle('settings:import', (_, settings: Partial<AppSettings>) => {
    try {
      settingsManager.importSettings(settings)
      return { success: true }
    } catch (error) {
      console.error('❌ 导入设置失败:', error)
      throw error
    }
  })

  // 获取开机自启动状态
  ipcMain.handle('settings:getAutoLaunchStatus', () => {
    try {
      return settingsManager.getAutoLaunchStatus()
    } catch (error) {
      console.error('❌ 获取开机自启动状态失败:', error)
      return false
    }
  })

  // 设置开机自启动
  ipcMain.handle('settings:setAutoLaunch', (_, enable: boolean) => {
    try {
      settingsManager.setAutoLaunch(enable)
      // 同时更新设置存储
      settingsManager.updateSetting('general', 'autoLaunch', enable)
      return { success: true }
    } catch (error) {
      console.error('❌ 设置开机自启动失败:', error)
      throw error
    }
  })

  // 获取设置文件路径
  ipcMain.handle('settings:getPath', () => {
    try {
      return settingsManager.getSettingsPath()
    } catch (error) {
      console.error('❌ 获取设置文件路径失败:', error)
      throw error
    }
  })

  console.log('📡 设置IPC处理器注册完成')
}

// ==================== 统一注册和注销函数 ====================

/**
 * 注册所有 IPC 处理器
 */
export function registerAllIpcHandlers(): void {
  registerWindowIpcHandlers()
  registerTrayIpcHandlers()
  registerSettingsIpcHandlers()
  console.log('📡 所有IPC处理器注册完成')
}

/**
 * 注销所有 IPC 处理器
 */
export function unregisterAllIpcHandlers(): void {
  // 窗口相关处理器
  const windowHandlers = [
    'window:show-calendar-popup',
    'window:hide-calendar-popup',
    'window:toggle-calendar-popup',
    'window:close-calendar-popup',
    'window:get-popup-state',
    'window:set-popup-position',
    'window:get-main-window-state',
    'window:minimize-main',
    'window:maximize-main',
    'window:close-main'
  ]

  // 托盘相关处理器
  const trayHandlers = [
    'tray:create',
    'tray:destroy',
    'tray:update-menu',
    'tray:is-supported',
    'tray:get-state',
    'tray:update-tooltip',
    'tray:show-balloon',
    'tray:flash'
  ]

  // 设置相关处理器
  const settingsHandlers = [
    'settings:getAll',
    'settings:getCategory',
    'settings:get',
    'settings:updateCategory',
    'settings:update',
    'settings:reset',
    'settings:export',
    'settings:import',
    'settings:getAutoLaunchStatus',
    'settings:setAutoLaunch',
    'settings:getPath'
  ]

  // 注销所有处理器
  const allHandlers = windowHandlers.concat(trayHandlers, settingsHandlers)
  allHandlers.forEach((handler) => {
    ipcMain.removeAllListeners(handler)
  })

  console.log('📡 所有IPC处理器注销完成')
}
