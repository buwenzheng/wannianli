import { ElectronAPI } from '@electron-toolkit/preload'
import { WindowApi, TrayApi } from '@preload-api'
import { SettingsApi } from '@preload-api/settings'

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
