import { app, shell } from 'electron'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { createMainWindow } from '@main-core/window'
import { createTray, destroyTray, isTraySupported } from '@main-core/tray'
import { registerWindowIpcHandlers } from '@main-core/ipc/windowIpc'
import { registerTrayIpcHandlers } from '@main-core/ipc/trayIpc'
import { registerSettingsIpcHandlers } from '@main-core/ipc/settingsIpc'

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron.wannianli')

  // 检查是否为开发环境
  const isDev = is.dev

  // 根据环境决定应用行为
  if (isDev) {
    // 开发环境：显示在 dock 中，方便调试
    console.log('🛠️  开发环境：启用调试模式')
  } else {
    // 生产环境：设置为菜单栏应用（macOS 不在 dock 显示）
    if (process.platform === 'darwin' && app.dock) {
      app.dock.hide()
    }
  }

  // 注册IPC处理器
  registerWindowIpcHandlers()
  registerTrayIpcHandlers()
  registerSettingsIpcHandlers()

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)

    // 设置外部链接处理
    window.webContents.setWindowOpenHandler((details) => {
      shell.openExternal(details.url)
      return { action: 'deny' }
    })
  })

  // 根据环境决定窗口创建策略
  if (isDev) {
    // 开发环境：直接创建并显示弹出窗口，方便调试
    console.log('🛠️  开发环境：创建调试窗口...')
    const { createCalendarPopupWindow, showCalendarPopupWindow } = await import('@main-core/window')

    try {
      createCalendarPopupWindow()
      await showCalendarPopupWindow()
      console.log('✅ 调试窗口创建成功')
    } catch (error) {
      console.error('❌ 调试窗口创建失败:', error)
    }
  }

  // 创建系统托盘（开发和生产环境都需要）
  console.log('🍎 创建系统托盘...')
  try {
    if (isTraySupported()) {
      const trayResult = await createTray()
      if (trayResult) {
        console.log('✅ 系统托盘创建成功')
      } else {
        console.error('❌ 系统托盘创建失败')
      }
    } else {
      console.warn('⚠️  当前系统不支持系统托盘')
      // 如果不支持托盘且非开发环境，创建主窗口作为降级方案
      if (!isDev) {
        createMainWindow()
      }
    }
  } catch (error) {
    console.error('❌ 创建系统托盘时发生错误:', error)
    // 托盘创建失败且非开发环境，创建主窗口作为降级方案
    if (!isDev) {
      createMainWindow()
    }
  }

  app.on('activate', function () {
    // 对于菜单栏应用，点击 dock 图标时不做任何操作
    // 用户应该通过点击菜单栏图标来使用应用
    console.log('菜单栏应用，忽略 dock 图标点击')
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  // 如果有系统托盘，不要退出应用
  if (process.platform !== 'darwin' && !isTraySupported()) {
    app.quit()
  }
})

// 应用退出前清理
app.on('before-quit', () => {
  destroyTray()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
