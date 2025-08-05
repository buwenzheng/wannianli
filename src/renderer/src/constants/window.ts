/**
 * 窗口尺寸常量
 * 与主进程中的尺寸保持一致
 */

/**
 * 日历弹出窗口尺寸
 * 必须与 src/main/constants/window.ts 中的值保持一致
 */
export const CALENDAR_POPUP_WINDOW = {
  WIDTH: 420,
  HEIGHT: 480
} as const

/**
 * 主窗口尺寸
 */
export const MAIN_WINDOW = {
  WIDTH: 900,
  HEIGHT: 670
} as const

/**
 * 设置窗口尺寸
 */
export const SETTINGS_WINDOW = {
  WIDTH: 800,
  HEIGHT: 600,
  MIN_WIDTH: 600,
  MIN_HEIGHT: 500
} as const
