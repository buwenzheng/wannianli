import { ipcRenderer } from 'electron'

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
