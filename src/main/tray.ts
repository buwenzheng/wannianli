import { Tray, Menu, nativeImage, app, NativeImage } from 'electron'
import { join } from 'path'
import {
  getMainWindow,
  showCalendarPopupWindow,
  hideCalendarPopupWindow,
  toggleCalendarPopupWindow,
  getCalendarPopupWindow,
  createSettingsWindow
} from '@main/window'
import {
  shouldUpdateIcon,
  getDateIconNativeImage,
  getFallbackIconPath
} from '@main/dateIconManager'

/**
 * 系统托盘管理模块
 * 负责创建和管理应用的系统托盘功能
 */

let tray: Tray | null = null
let lastIconUpdateDate: Date | null = null
let iconUpdateTimer: NodeJS.Timeout | null = null

/**
 * 获取托盘实例
 */
export function getTray(): Tray | null {
  return tray
}

/**
 * 创建系统托盘
 */
export async function createTray(): Promise<Tray | null> {
  if (tray) {
    console.log('托盘已存在，返回现有实例')
    return tray
  }

  console.log(`📱 开始创建托盘，当前平台: ${process.platform}`)

  try {
    // 加载预生成的日期图标
    console.log('📅 加载日期图标...')

    let iconImage = await getDateIconNativeImage()

    if (iconImage && !iconImage.isEmpty()) {
      console.log('✅ 使用预生成的PNG图标')
    } else {
      // 降级方案: 使用默认图标
      console.log('⚠️  预生成图标失败，使用默认图标')
      const { nativeImage } = await import('electron')
      const fallbackPath = getFallbackIconPath()
      iconImage = nativeImage.createFromPath(fallbackPath)

      if (iconImage.isEmpty()) {
        console.error('❌ 连默认图标都加载失败，无法创建托盘')
        return null
      }
    }

    lastIconUpdateDate = new Date()
    console.log('🚀 创建 Tray 实例...')
    tray = new Tray(iconImage)

    // 设置托盘提示文本
    tray.setToolTip('万年历 - 农历日历桌面工具')
    console.log('📝 设置托盘提示文本完成')

    // macOS菜单栏应用通常不需要右键菜单
    if (process.platform !== 'darwin') {
      console.log('🔧 为非 macOS 平台设置托盘菜单...')
      await updateTrayMenu()
    } else {
      console.log('🍎 macOS 菜单栏应用不设置右键菜单')
    }

    // 托盘点击事件
    tray.on('click', (_event, bounds) => {
      console.log('👆 托盘左键点击', { platform: process.platform, bounds })
      handleTrayClick()
    })

    tray.on('right-click', (_event, bounds) => {
      console.log('👆 托盘右键点击', { platform: process.platform, bounds })
      handleTrayRightClick()
    })

    // 双击事件主要用于Windows/Linux
    if (process.platform !== 'darwin') {
      tray.on('double-click', () => {
        console.log('👆 托盘双击')
        handleTrayDoubleClick()
      })
    }

    console.log('✅ 系统托盘创建成功！')

    // 设置定时器，每小时检查一次是否需要更新图标
    setupIconUpdateTimer()

    return tray
  } catch (error) {
    console.error('❌ 创建系统托盘失败:', error)
    return null
  }
}

/**
 * macOS菜单栏应用：在图标附近显示日历弹出窗口
 */
async function showCalendarPopupNearTray(): Promise<void> {
  if (!tray) return

  try {
    // 获取托盘图标的位置
    const trayBounds = tray.getBounds()
    console.log('托盘图标位置:', trayBounds)

    // 计算弹出窗口位置（在图标下方）
    const x = Math.round(trayBounds.x + trayBounds.width / 2 - 150) // 窗口宽度300的一半
    const y = Math.round(trayBounds.y + trayBounds.height + 5) // 图标下方留5px间距

    // 显示日历弹出窗口
    const { showCalendarPopupWindow } = await import('./window')
    await showCalendarPopupWindow(x, y)
  } catch (error) {
    console.error('显示菜单栏日历失败:', error)
    // 降级方案：使用默认位置
    const { showCalendarPopupWindow } = await import('./window')
    await showCalendarPopupWindow()
  }
}

/**
 * 更新托盘菜单
 */
export async function updateTrayMenu(): Promise<void> {
  if (!tray) return

  // macOS菜单栏应用通常不显示右键菜单
  if (process.platform === 'darwin') {
    return
  }

  const mainWindow = getMainWindow()
  const popupWindow = getCalendarPopupWindow()

  const contextMenu = Menu.buildFromTemplate([
    {
      label: '万年历',
      type: 'normal',
      enabled: false,
      icon: await getMenuIcon()
    },
    { type: 'separator' },
    {
      label: '显示日历',
      type: 'normal',
      click: () => showCalendarPopupWindow(),
      accelerator: 'CmdOrCtrl+Shift+C'
    },
    {
      label: '隐藏日历',
      type: 'normal',
      click: () => hideCalendarPopupWindow(),
      enabled: !!(popupWindow && !popupWindow.isDestroyed() && popupWindow.isVisible())
    },

    {
      label: '最小化到托盘',
      type: 'normal',
      click: () => {
        if (mainWindow && !mainWindow.isDestroyed()) {
          mainWindow.hide()
        }
      },
      enabled: !!(mainWindow && !mainWindow.isDestroyed() && mainWindow.isVisible())
    },
    { type: 'separator' },
    {
      label: '设置',
      type: 'normal',
      click: () => {
        createSettingsWindow()
      },
      accelerator: 'CmdOrCtrl+,'
    },
    {
      label: '关于',
      type: 'normal',
      click: () => {
        // TODO: 显示关于对话框
        console.log('显示关于信息')
      }
    },
    { type: 'separator' },
    {
      label: '退出',
      type: 'normal',
      click: () => {
        app.quit()
      },
      accelerator: 'CmdOrCtrl+Q'
    }
  ])

  tray.setContextMenu(contextMenu)
}

/**
 * 销毁系统托盘
 */
export function destroyTray(): void {
  // 清理定时器
  if (iconUpdateTimer) {
    clearInterval(iconUpdateTimer)
    iconUpdateTimer = null
  }

  if (tray) {
    tray.destroy()
    tray = null
    lastIconUpdateDate = null
    console.log('系统托盘已销毁')
  }
}

/**
 * 处理托盘左键点击
 */
function handleTrayClick(): void {
  console.log('托盘左键点击')

  if (process.platform === 'darwin') {
    // macOS: 点击菜单栏图标弹出日历窗口在图标下方
    showCalendarPopupNearTray()
  } else {
    // Windows/Linux: 切换弹出日历窗口
    toggleCalendarPopupWindow()
  }
}

/**
 * 处理托盘右键点击
 */
function handleTrayRightClick(): void {
  console.log('托盘右键点击')

  if (process.platform === 'darwin') {
    // macOS: 右键也弹出日历窗口，或者显示简化菜单
    showCalendarPopupNearTray()
  }
  // Windows/Linux: 显示上下文菜单（由系统自动处理）
}

/**
 * 处理托盘双击
 */
function handleTrayDoubleClick(): void {
  console.log('托盘双击')

  // 菜单栏应用：双击也显示弹出日历窗口
  if (process.platform === 'darwin') {
    showCalendarPopupNearTray()
  } else {
    toggleCalendarPopupWindow()
  }
}

/**
 * 获取托盘图标路径
 */
async function getIconPath(): Promise<string> {
  // 根据操作系统返回不同的图标
  if (process.platform === 'win32') {
    const iconPath = join(__dirname, '../../../resources/icon.ico')
    console.log(`🪟 Windows 图标路径: ${iconPath}`)
    return iconPath
  } else if (process.platform === 'darwin') {
    // 对于 macOS，直接使用默认的 PNG 图标
    const defaultIcon = join(__dirname, '../../../resources/icon.png')
    console.log(`🍎 macOS 图标路径: ${defaultIcon}`)

    // 检查文件是否存在
    try {
      const fs = await import('fs')
      fs.accessSync(defaultIcon)
      console.log('✅ 图标文件存在')
    } catch (error) {
      console.error('❌ 图标文件不存在:', error)
    }

    return defaultIcon
  } else {
    const iconPath = join(__dirname, '../../../resources/icon.png')
    console.log(`🐧 Linux 图标路径: ${iconPath}`)
    return iconPath
  }
}

/**
 * 获取菜单图标
 */
async function getMenuIcon(): Promise<NativeImage | undefined> {
  const iconPath = await getIconPath()
  try {
    const icon = nativeImage.createFromPath(iconPath)
    return icon.resize({ width: 16, height: 16 })
  } catch (error) {
    console.error('创建菜单图标失败:', error)
    return undefined
  }
}

/**
 * 设置托盘闪烁（用于通知）
 */
export function flashTray(enable: boolean = true): void {
  if (!tray) return

  // Windows系统支持托盘闪烁
  if (process.platform === 'win32') {
    try {
      // @ts-ignore - Electron类型定义可能不完整
      tray.setHighlightMode(enable ? 'always' : 'never')
    } catch (error) {
      console.error('设置托盘闪烁失败:', error)
    }
  }
}

/**
 * 更新托盘提示文本
 */
export function updateTrayTooltip(text: string): void {
  if (tray) {
    tray.setToolTip(text)
  }
}

/**
 * 显示托盘气泡通知
 */
export function showTrayBalloon(options: { title: string; content: string; icon?: string }): void {
  if (!tray) return

  try {
    let icon: NativeImage | undefined = undefined
    if (options.icon) {
      icon = nativeImage.createFromPath(options.icon)
    }

    tray.displayBalloon({
      title: options.title,
      content: options.content,
      icon: icon
    })
  } catch (error) {
    console.error('显示托盘通知失败:', error)
  }
}

/**
 * 设置图标更新定时器
 */
function setupIconUpdateTimer(): void {
  // 每小时检查一次是否需要更新图标
  iconUpdateTimer = setInterval(
    () => {
      if (lastIconUpdateDate && shouldUpdateIcon(lastIconUpdateDate)) {
        console.log('📅 日期已变化，更新托盘图标...')
        updateTrayIcon().catch((error) => {
          console.error('定时更新托盘图标失败:', error)
        })
      }
    },
    60 * 60 * 1000
  ) // 1小时

  console.log('⏰ 图标更新定时器已设置')
}

/**
 * 更新托盘图标
 */
async function updateTrayIcon(): Promise<void> {
  if (!tray || tray.isDestroyed()) {
    console.warn('⚠️  托盘不存在，无法更新图标')
    return
  }

  try {
    // 使用预生成的PNG图标
    const newIcon = await getDateIconNativeImage()

    if (!newIcon || newIcon.isEmpty()) {
      // 降级方案: 使用默认图标
      console.log('⚠️  日期图标加载失败，保持当前图标')
      return // 保持当前图标，不更新
    }

    tray.setImage(newIcon)
    lastIconUpdateDate = new Date()
    console.log(`✅ 托盘图标已更新`)
  } catch (error) {
    console.error('❌ 更新托盘图标失败:', error)
  }
}

/**
 * 手动更新托盘图标（用于外部调用）
 */
export function refreshTrayIcon(): void {
  updateTrayIcon().catch((error) => {
    console.error('刷新托盘图标失败:', error)
  })
}

/**
 * 检查托盘是否可用
 */
export function isTraySupported(): boolean {
  try {
    // 尝试创建一个临时托盘来测试支持性
    // 在大多数现代系统上都支持托盘
    return (
      process.platform === 'win32' || process.platform === 'darwin' || process.platform === 'linux'
    )
  } catch (error) {
    console.error('检查托盘支持失败:', error)
    return false
  }
}
