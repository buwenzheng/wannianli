import { ElectronAPI } from '@electron-toolkit/preload'
import { WindowApi, TrayApi } from './api'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      window: WindowApi
      tray: TrayApi
    }
  }
}
