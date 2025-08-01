import { ipcRenderer } from 'electron'

/**
 * 窗口管理相关API
 */
export interface WindowApi {
  // 日历弹出窗口操作
  showCalendarPopup: () => Promise<{ success: boolean; error?: string }>
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
  showCalendarPopup: () => ipcRenderer.invoke('window:show-calendar-popup'),
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
