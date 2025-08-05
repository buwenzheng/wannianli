import { ipcMain } from 'electron'
import { getSettingsManager, AppSettings } from '../simpleSettings'

/**
 * 设置相关的IPC处理器
 * 提供渲染进程与设置系统的通信接口
 */

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
      console.error(`❌ 获取设置分类 ${category} 失败:`, error)
      throw error
    }
  })

  // 获取单个设置项
  ipcMain.handle('settings:get', (_, category: keyof AppSettings, key: string) => {
    try {
      return settingsManager.getSetting(category, key as any)
    } catch (error) {
      console.error(`❌ 获取设置 ${category}.${key} 失败:`, error)
      throw error
    }
  })

  // 更新设置分类
  ipcMain.handle('settings:updateCategory', (_, category: keyof AppSettings, updates: any) => {
    try {
      settingsManager.updateSettings(category, updates)
      return { success: true }
    } catch (error) {
      console.error(`❌ 更新设置分类 ${category} 失败:`, error)
      throw error
    }
  })

  // 更新单个设置项
  ipcMain.handle('settings:update', (_, category: keyof AppSettings, key: string, value: any) => {
    try {
      settingsManager.updateSetting(category, key as any, value)
      return { success: true }
    } catch (error) {
      console.error(`❌ 更新设置 ${category}.${key} 失败:`, error)
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

/**
 * 注销设置相关的IPC处理器
 */
export function unregisterSettingsIpcHandlers(): void {
  const handlers = [
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

  handlers.forEach((handler) => {
    ipcMain.removeAllListeners(handler)
  })

  console.log('📡 设置IPC处理器注销完成')
}
