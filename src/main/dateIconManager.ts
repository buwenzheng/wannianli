/**
 * 日期图标管理器
 * 管理预生成的日期图标文件选择和加载
 */

import { join } from 'path'
import * as fs from 'fs'

/**
 * 获取当前日期对应的图标文件路径
 * @param date 可选的日期，默认使用当前日期
 * @returns 图标文件的绝对路径
 */
export async function getDateIconPath(date?: Date): Promise<string> {
  const currentDate = date || new Date()
  const dayOfMonth = currentDate.getDate()

  // 格式化日期为两位数字 (01, 02, ..., 31)
  const dayString = dayOfMonth.toString().padStart(2, '0')

  // 优先使用 PNG 格式
  const iconFileNamePng = `date-${dayString}.png`

  // 使用 process.cwd() 来获取项目根目录，这在 Electron 中更可靠
  const projectRoot = process.cwd()
  const iconPathPng = join(projectRoot, 'resources/date-icons', iconFileNamePng)

  // 检查 PNG 文件是否存在
  if (fs.existsSync(iconPathPng)) {
    console.log(`📅 当前日期: ${dayOfMonth}日，使用PNG图标: ${iconFileNamePng}`)
    return iconPathPng
  } else {
    console.warn(`⚠️  日期图标不存在: ${iconFileNamePng}，使用默认图标`)
    return getFallbackIconPath()
  }
}

/**
 * 获取日期图标的 NativeImage 对象
 */
export async function getDateIconNativeImage(
  date?: Date
): Promise<import('electron').NativeImage | null> {
  const iconPath = await getDateIconPath(date)

  try {
    const { nativeImage } = await import('electron')

    // 直接使用标准方法加载图标
    const image = nativeImage.createFromPath(iconPath)

    if (image.isEmpty()) {
      console.warn('⚠️  图标文件为空或无法解析:', iconPath)
      return null
    }

    console.log('✅ 成功加载日期图标')
    return image
  } catch (error) {
    console.error('❌ 创建图标 NativeImage 失败:', error)
    return null
  }
}

/**
 * 获取视网膜屏幕的图标路径
 * @param date 可选的日期，默认使用当前日期
 * @returns 视网膜图标文件的绝对路径
 */
export async function getRetinaDateIconPath(date?: Date): Promise<string> {
  const currentDate = date || new Date()
  const dayOfMonth = currentDate.getDate()

  const dayString = dayOfMonth.toString().padStart(2, '0')

  const iconFileName = `date-${dayString}@2x.png`
  const projectRoot = process.cwd()
  const iconPath = join(projectRoot, 'resources/date-icons', iconFileName)

  if (fs.existsSync(iconPath)) {
    console.log(`📱 视网膜图标: ${iconFileName}`)
    return iconPath
  } else {
    console.warn(`⚠️  视网膜图标不存在: ${iconFileName}，使用普通图标`)
    return await getDateIconPath(date)
  }
}

/**
 * 获取降级图标路径
 */
export function getFallbackIconPath(): string {
  const projectRoot = process.cwd()
  const fallbackPath = join(projectRoot, 'resources/icon.png')
  console.log(`🔄 使用默认图标: ${fallbackPath}`)
  return fallbackPath
}

/**
 * 判断是否应该更新图标
 * @param lastUpdateDate 上次更新日期
 * @returns 是否需要更新
 */
export function shouldUpdateIcon(lastUpdateDate?: Date): boolean {
  if (!lastUpdateDate) {
    return true
  }

  const now = new Date()
  const lastUpdate = new Date(lastUpdateDate)

  // 检查是否跨天了
  const isNewDay =
    now.getDate() !== lastUpdate.getDate() ||
    now.getMonth() !== lastUpdate.getMonth() ||
    now.getFullYear() !== lastUpdate.getFullYear()

  if (isNewDay) {
    console.log('📅 检测到日期变化，需要更新图标')
    return true
  }

  return false
}
