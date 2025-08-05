import { Lunar } from 'lunar-javascript'

/**
 * 农历日期格式化工具
 * 使用缓存来提高性能
 */
class LunarDateFormatter {
  private cache = new Map<string, string>()

  /**
   * 格式化农历日期
   * @param date 公历日期
   * @returns 农历日期字符串
   */
  formatLunarDate(date: Date): string {
    const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
    
    // 检查缓存
    if (this.cache.has(dateKey)) {
      return this.cache.get(dateKey)!
    }

    try {
      const lunar = Lunar.fromDate(date)
      const lunarText = lunar.getDayInChinese() || '初一'
      
      // 缓存结果（限制缓存大小）
      if (this.cache.size > 100) {
        // 清理一半的缓存
        const entries = Array.from(this.cache.entries())
        entries.slice(0, 50).forEach(([key]) => {
          this.cache.delete(key)
        })
      }
      
      this.cache.set(dateKey, lunarText)
      return lunarText
    } catch (error) {
      console.warn('Failed to format lunar date:', error)
      return '初一'
    }
  }

  /**
   * 清理缓存
   */
  clearCache(): void {
    this.cache.clear()
  }
}

// 单例实例
export const lunarFormatter = new LunarDateFormatter()

/**
 * 检查是否为周末
 * @param date 日期
 * @returns 是否为周末
 */
export const isWeekend = (date: Date): boolean => {
  const day = date.getDay()
  return day === 0 || day === 6
}

/**
 * 获取农历日期字符串
 * @param date 公历日期
 * @returns 农历日期字符串
 */
export const getLunarDate = (date: Date): string => {
  return lunarFormatter.formatLunarDate(date)
}

/**
 * 获取节日信息
 * @param date 公历日期
 * @returns 节日数组
 */
export const getFestivals = (date: Date): string[] => {
  try {
    const lunar = Lunar.fromDate(date)
    const festivals = lunar.getFestivals()
    return festivals || []
  } catch (error) {
    console.warn('Failed to get festivals:', error)
    return []
  }
}

/**
 * 获取节气信息
 * @param date 公历日期
 * @returns 节气数组
 */
export const getSolarTerms = (date: Date): string[] => {
  try {
    const lunar = Lunar.fromDate(date)
    const solarTerms = lunar.getJieQi()
    return solarTerms || []
  } catch (error) {
    console.warn('Failed to get solar terms:', error)
    return []
  }
}