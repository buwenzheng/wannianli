import { ipcMain, IpcMainInvokeEvent } from 'electron'
import {
  showCalendarPopupWindow,
  hideCalendarPopupWindow,
  toggleCalendarPopupWindow,
  closeCalendarPopupWindow,
  getMainWindow,
  getCalendarPopupWindow
} from '../window'

/**
 * 窗口管理相关的IPC通信处理
 */

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

/**
 * 取消注册窗口管理相关的IPC处理器
 */
export function unregisterWindowIpcHandlers(): void {
  ipcMain.removeAllListeners('window:show-calendar-popup')
  ipcMain.removeAllListeners('window:hide-calendar-popup')
  ipcMain.removeAllListeners('window:toggle-calendar-popup')
  ipcMain.removeAllListeners('window:close-calendar-popup')
  ipcMain.removeAllListeners('window:get-popup-state')
  ipcMain.removeAllListeners('window:set-popup-position')
  ipcMain.removeAllListeners('window:get-main-window-state')
  ipcMain.removeAllListeners('window:minimize-main')
  ipcMain.removeAllListeners('window:maximize-main')
  ipcMain.removeAllListeners('window:close-main')
}
