import { ipcMain, IpcMainInvokeEvent } from 'electron'
import {
  createTray,
  destroyTray,
  updateTrayMenu,
  updateTrayTooltip,
  showTrayBalloon,
  flashTray,
  isTraySupported,
  getTray
} from '../tray'

/**
 * 托盘管理相关的IPC通信处理
 */

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

/**
 * 取消注册托盘管理相关的IPC处理器
 */
export function unregisterTrayIpcHandlers(): void {
  ipcMain.removeAllListeners('tray:create')
  ipcMain.removeAllListeners('tray:destroy')
  ipcMain.removeAllListeners('tray:update-menu')
  ipcMain.removeAllListeners('tray:is-supported')
  ipcMain.removeAllListeners('tray:get-state')
  ipcMain.removeAllListeners('tray:update-tooltip')
  ipcMain.removeAllListeners('tray:show-balloon')
  ipcMain.removeAllListeners('tray:flash')
}
