import { ElectronAPI } from '@electron-toolkit/preload'
import { WindowApi, TrayApi, SettingsApi } from '@preload/api'

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
