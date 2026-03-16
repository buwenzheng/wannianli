import { check } from '@tauri-apps/plugin-updater'

export async function checkForUpdates(): Promise<void> {
  try {
    const update = await check()
    if (!update?.available) {
      window.alert('当前已是最新版本')
      return
    }

    const ok = window.confirm(`发现新版本 ${update.version}，是否下载并安装？`)
    if (!ok) return

    await update.downloadAndInstall()
    window.alert('更新已安装，重启应用后生效')
  } catch (err) {
    console.error('检查更新失败', err)
    const msg = err instanceof Error ? err.message : String(err)
    window.alert(`检查更新失败，请稍后再试。${msg ? `\n${msg}` : ''}`)
  }
}

