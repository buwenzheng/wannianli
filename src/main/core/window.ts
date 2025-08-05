import { BrowserWindow, screen } from 'electron'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'
import icon from '@resources/icon.png?asset'
import { CALENDAR_POPUP_WINDOW, MAIN_WINDOW, SETTINGS_WINDOW } from '@main-constants/window'

/**
 * 窗口管理模块
 * 负责创建和管理应用的各种窗口
 */

let mainWindow: BrowserWindow | null = null
let calendarPopupWindow: BrowserWindow | null = null

/**
 * 获取主窗口实例
 */
export function getMainWindow(): BrowserWindow | null {
  return mainWindow
}

/**
 * 获取日历弹出窗口实例
 */
export function getCalendarPopupWindow(): BrowserWindow | null {
  return calendarPopupWindow
}

/**
 * 创建主窗口
 */
export function createMainWindow(): BrowserWindow {
  // 如果主窗口已存在，直接返回
  if (mainWindow && !mainWindow.isDestroyed()) {
    return mainWindow
  }

  // 创建主窗口
  mainWindow = new BrowserWindow({
    width: MAIN_WINDOW.WIDTH,
    height: MAIN_WINDOW.HEIGHT,
    show: false,
    autoHideMenuBar: true,
    resizable: true,
    minimizable: true,
    maximizable: true,
    closable: true,
    title: '万年历',
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  // 加载页面
  loadWindowContent(mainWindow)

  // 窗口就绪时不自动显示（菜单栏应用特性）
  mainWindow.on('ready-to-show', () => {
    console.log('主窗口已准备就绪，但不自动显示（菜单栏应用）')

    // 开发环境下打开开发者工具
    // if (is.dev) {
    //   mainWindow?.webContents.openDevTools()
    // }
  })

  // 窗口关闭事件
  mainWindow.on('closed', () => {
    mainWindow = null
  })

  // 阻止窗口关闭，改为隐藏到托盘
  mainWindow.on('close', async (event) => {
    if (process.platform === 'darwin') {
      // macOS行为：关闭窗口但保持应用运行
      event.preventDefault()
      mainWindow?.hide()
    } else {
      // Windows/Linux：如果有托盘，隐藏到托盘
      try {
        const { isTraySupported } = await import('./tray')
        if (isTraySupported()) {
          event.preventDefault()
          mainWindow?.hide()
        }
      } catch (error) {
        console.error('导入托盘模块失败:', error)
      }
    }
  })

  return mainWindow
}

/**
 * 创建日历弹出窗口
 */
export function createCalendarPopupWindow(): BrowserWindow {
  // 如果弹出窗口已存在，直接返回
  if (calendarPopupWindow && !calendarPopupWindow.isDestroyed()) {
    return calendarPopupWindow
  }

  // 检查是否为开发环境
  const isDev = is.dev

  // 获取当前鼠标位置和屏幕信息
  const mousePos = screen.getCursorScreenPoint()
  const currentDisplay = screen.getDisplayNearestPoint(mousePos)

  // 计算弹出窗口位置和大小
  const windowWidth = CALENDAR_POPUP_WINDOW.WIDTH
  const windowHeight = CALENDAR_POPUP_WINDOW.HEIGHT
  const padding = 20

  let x, y

  if (isDev) {
    // 开发环境：居中显示
    x = currentDisplay.bounds.x + (currentDisplay.bounds.width - windowWidth) / 2
    y = currentDisplay.bounds.y + (currentDisplay.bounds.height - windowHeight) / 2
  } else {
    // 生产环境：在鼠标附近显示
    x = mousePos.x - windowWidth / 2
    y = mousePos.y - windowHeight / 2
  }

  // 确保窗口不超出屏幕边界
  const maxX = currentDisplay.bounds.x + currentDisplay.bounds.width - windowWidth - padding
  const maxY = currentDisplay.bounds.y + currentDisplay.bounds.height - windowHeight - padding
  const minX = currentDisplay.bounds.x + padding
  const minY = currentDisplay.bounds.y + padding

  x = Math.max(minX, Math.min(maxX, x))
  y = Math.max(minY, Math.min(maxY, y))

  // 创建弹出窗口
  calendarPopupWindow = new BrowserWindow({
    width: windowWidth,
    height: windowHeight,
    x: x,
    y: y,
    show: false,
    frame: isDev, // 开发环境显示边框，方便拖动和调试
    alwaysOnTop: !isDev, // 开发环境不置顶，方便调试
    skipTaskbar: !isDev, // 开发环境显示在任务栏
    resizable: isDev, // 开发环境可调整大小
    movable: true,
    minimizable: isDev, // 开发环境可最小化
    maximizable: isDev, // 开发环境可最大化
    closable: true,
    focusable: true,
    title: isDev ? '万年历 (调试模式)' : '万年历',
    backgroundColor: '#ffffff',
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  // 加载页面
  loadWindowContent(calendarPopupWindow)

  // 窗口就绪时显示
  calendarPopupWindow.on('ready-to-show', () => {
    if (!calendarPopupWindow) return
    calendarPopupWindow.show()
    calendarPopupWindow.focus()
  })

  // 开发环境下不自动隐藏窗口，方便调试
  if (!isDev) {
    // 生产环境：窗口失去焦点时隐藏
    calendarPopupWindow.on('blur', () => {
      if (!calendarPopupWindow) return
      // 延迟隐藏，避免点击窗口内容时立即隐藏
      setTimeout(() => {
        if (calendarPopupWindow && !calendarPopupWindow.isFocused()) {
          hideCalendarPopupWindow()
        }
      }, 200)
    })
  }

  // 窗口关闭事件
  calendarPopupWindow.on('closed', () => {
    calendarPopupWindow = null
  })

  return calendarPopupWindow
}

/**
 * 显示日历弹出窗口
 */
export async function showCalendarPopupWindow(x?: number, y?: number): Promise<void> {
  if (!calendarPopupWindow || calendarPopupWindow.isDestroyed()) {
    createCalendarPopupWindow()
  }

  if (calendarPopupWindow) {
    // 如果提供了位置参数，设置窗口位置
    if (x !== undefined && y !== undefined) {
      const { screen } = await import('electron')
      const workArea = screen.getPrimaryDisplay().workAreaSize
      const windowWidth = CALENDAR_POPUP_WINDOW.WIDTH
      const windowHeight = CALENDAR_POPUP_WINDOW.HEIGHT

      // 确保位置在屏幕范围内
      const targetX = Math.max(0, Math.min(x, workArea.width - windowWidth))
      const targetY = Math.max(0, Math.min(y, workArea.height - windowHeight))
      calendarPopupWindow.setPosition(targetX, targetY)
    }

    calendarPopupWindow.show()
    calendarPopupWindow.focus()
  }
}

/**
 * 隐藏日历弹出窗口
 */
export function hideCalendarPopupWindow(): void {
  if (calendarPopupWindow && !calendarPopupWindow.isDestroyed()) {
    calendarPopupWindow.hide()
  }
}

/**
 * 切换日历弹出窗口显示状态
 */
export function toggleCalendarPopupWindow(): void {
  if (!calendarPopupWindow || calendarPopupWindow.isDestroyed()) {
    showCalendarPopupWindow()
  } else if (calendarPopupWindow.isVisible()) {
    hideCalendarPopupWindow()
  } else {
    showCalendarPopupWindow()
  }
}

/**
 * 关闭日历弹出窗口
 */
export function closeCalendarPopupWindow(): void {
  if (calendarPopupWindow && !calendarPopupWindow.isDestroyed()) {
    calendarPopupWindow.close()
  }
}

/**
 * 加载窗口内容
 */
function loadWindowContent(window: BrowserWindow): void {
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    window.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    window.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

/**
 * 获取所有活动窗口
 */
export function getAllWindows(): BrowserWindow[] {
  const windows: BrowserWindow[] = []

  if (mainWindow && !mainWindow.isDestroyed()) {
    windows.push(mainWindow)
  }

  if (calendarPopupWindow && !calendarPopupWindow.isDestroyed()) {
    windows.push(calendarPopupWindow)
  }

  return windows
}

/**
 * 关闭所有窗口
 */
export function closeAllWindows(): void {
  closeCalendarPopupWindow()

  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.close()
  }
}

/**
 * 检查是否有窗口打开
 */
export function hasOpenWindows(): boolean {
  return getAllWindows().length > 0
}

// 设置窗口实例
let settingsWindow: BrowserWindow | null = null

/**
 * 获取设置窗口实例
 */
export function getSettingsWindow(): BrowserWindow | null {
  return settingsWindow
}

/**
 * 创建设置窗口
 */
export function createSettingsWindow(): BrowserWindow {
  // 如果设置窗口已存在，则聚焦并显示
  if (settingsWindow && !settingsWindow.isDestroyed()) {
    settingsWindow.focus()
    settingsWindow.show()
    return settingsWindow
  }

  // 创建设置窗口
  settingsWindow = new BrowserWindow({
    width: SETTINGS_WINDOW.WIDTH,
    height: SETTINGS_WINDOW.HEIGHT,
    minWidth: SETTINGS_WINDOW.MIN_WIDTH,
    minHeight: SETTINGS_WINDOW.MIN_HEIGHT,
    center: true,
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
    frame: true,
    resizable: false,
    minimizable: true,
    maximizable: true,
    closable: true,
    alwaysOnTop: false,
    skipTaskbar: false,
    show: false,
    title: '万年历 - 设置',
    icon: process.platform === 'linux' ? join(__dirname, '../../resources/icon.png') : undefined,
    vibrancy: process.platform === 'darwin' ? 'under-window' : undefined,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  // 设置窗口内容
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    settingsWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/#/settings`)
  } else {
    settingsWindow.loadFile(join(__dirname, '../renderer/index.html'), {
      hash: 'settings'
    })
  }

  // 窗口事件处理
  settingsWindow.webContents.on('did-finish-load', () => {
    console.log('⚙️  设置窗口内容加载完成')
  })

  settingsWindow.on('ready-to-show', () => {
    if (settingsWindow && !settingsWindow.isDestroyed()) {
      settingsWindow.show()
      console.log('⚙️  设置窗口已显示')
    }
  })

  settingsWindow.on('closed', () => {
    settingsWindow = null
    console.log('⚙️  设置窗口已关闭')
  })

  settingsWindow.webContents.setWindowOpenHandler(() => {
    return { action: 'deny' }
  })

  console.log('⚙️  设置窗口已创建')
  return settingsWindow
}

/**
 * 显示设置窗口
 */
export async function showSettingsWindow(): Promise<void> {
  if (!settingsWindow || settingsWindow.isDestroyed()) {
    createSettingsWindow()
  } else {
    settingsWindow.focus()
    settingsWindow.show()
  }
}

/**
 * 隐藏设置窗口
 */
export async function hideSettingsWindow(): Promise<void> {
  if (settingsWindow && !settingsWindow.isDestroyed()) {
    settingsWindow.hide()
    console.log('⚙️  设置窗口已隐藏')
  }
}

/**
 * 关闭设置窗口
 */
export async function closeSettingsWindow(): Promise<void> {
  if (settingsWindow && !settingsWindow.isDestroyed()) {
    settingsWindow.close()
    console.log('⚙️  设置窗口已关闭')
  }
}
