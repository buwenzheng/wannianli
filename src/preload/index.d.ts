import { ElectronAPI } from '@electron-toolkit/preload'
import { WindowApi, TrayApi } from './api'
import { SettingsApi } from './api/settings'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      window: WindowApi
      tray: TrayApi
      settings: SettingsApi
    }
  }
}
