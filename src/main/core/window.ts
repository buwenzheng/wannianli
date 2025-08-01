import { BrowserWindow, screen } from 'electron'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'
import icon from '../../../resources/icon.png?asset'

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
    width: 900,
    height: 670,
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

  // 窗口就绪时显示
  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) return
    mainWindow.show()

    // 开发环境下打开开发者工具
    if (is.dev) {
      mainWindow.webContents.openDevTools()
    }
  })

  // 窗口关闭事件
  mainWindow.on('closed', () => {
    mainWindow = null
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

  // 获取当前鼠标位置和屏幕信息
  const mousePos = screen.getCursorScreenPoint()
  const currentDisplay = screen.getDisplayNearestPoint(mousePos)

  // 计算弹出窗口位置（在鼠标附近，但不超出屏幕边界）
  const windowWidth = 320
  const windowHeight = 400
  const padding = 20

  let x = mousePos.x - windowWidth / 2
  let y = mousePos.y - windowHeight / 2

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
    frame: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    movable: true,
    minimizable: false,
    maximizable: false,
    closable: true,
    focusable: true,
    title: '万年历',
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

  // 窗口失去焦点时隐藏（可选）
  calendarPopupWindow.on('blur', () => {
    if (!calendarPopupWindow) return
    // 延迟隐藏，避免点击窗口内容时立即隐藏
    setTimeout(() => {
      if (calendarPopupWindow && !calendarPopupWindow.isFocused()) {
        hideCalendarPopupWindow()
      }
    }, 200)
  })

  // 窗口关闭事件
  calendarPopupWindow.on('closed', () => {
    calendarPopupWindow = null
  })

  return calendarPopupWindow
}

/**
 * 显示日历弹出窗口
 */
export function showCalendarPopupWindow(): void {
  if (!calendarPopupWindow || calendarPopupWindow.isDestroyed()) {
    createCalendarPopupWindow()
  } else {
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
