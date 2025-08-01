import { Lunar } from 'lunar-javascript'

/**
 * 农历相关工具函数
 */

/**
 * 获取指定日期的农历日期显示
 * @param date 目标日期
 * @returns 农历日期字符串 (如: 初一、十五、廿九)
 */
export function getLunarDate(date: Date): string {
  try {
    const lunar = Lunar.fromDate(date)
    return lunar.getDayInChinese()
  } catch (error) {
    console.error('获取农历日期失败:', error)
    return ''
  }
}

/**
 * 获取指定日期的农历年份信息
 * @param date 目标日期
 * @returns 农历年份字符串 (如: 甲子年[鼠])
 */
export function getLunarYear(date: Date): string {
  try {
    const lunar = Lunar.fromDate(date)
    return `${lunar.getYearInGanZhi()}年[${lunar.getYearShengXiao()}]`
  } catch (error) {
    console.error('获取农历年份失败:', error)
    return ''
  }
}

/**
 * 获取指定日期的农历月份
 * @param date 目标日期
 * @returns 农历月份字符串 (如: 正月、二月、腊月)
 */
export function getLunarMonth(date: Date): string {
  try {
    const lunar = Lunar.fromDate(date)
    return lunar.getMonthInChinese()
  } catch (error) {
    console.error('获取农历月份失败:', error)
    return ''
  }
}

/**
 * 获取指定日期的节日信息
 * @param date 目标日期
 * @returns 节日名称数组
 */
export function getFestivals(date: Date): string[] {
  try {
    const lunar = Lunar.fromDate(date)
    return lunar.getFestivals()
  } catch (error) {
    console.error('获取节日信息失败:', error)
    return []
  }
}

/**
 * 获取指定日期的节气信息
 * @param date 目标日期
 * @returns 节气名称数组
 */
export function getSolarTerms(date: Date): string[] {
  try {
    const lunar = Lunar.fromDate(date)
    return lunar.getJieQi()
  } catch (error) {
    console.error('获取节气信息失败:', error)
    return []
  }
}

/**
 * 获取指定日期的生肖
 * @param date 目标日期
 * @returns 生肖字符串 (如: 鼠、牛、虎)
 */
export function getZodiac(date: Date): string {
  try {
    const lunar = Lunar.fromDate(date)
    return lunar.getYearShengXiao()
  } catch (error) {
    console.error('获取生肖失败:', error)
    return ''
  }
}

/**
 * 获取指定日期的干支信息
 * @param date 目标日期
 * @returns 干支信息对象
 */
export function getGanZhi(date: Date): {
  year: string
  month: string
  day: string
} {
  try {
    const lunar = Lunar.fromDate(date)
    return {
      year: lunar.getYearInGanZhi(),
      month: lunar.getMonthInGanZhi(),
      day: lunar.getDayInGanZhi()
    }
  } catch (error) {
    console.error('获取干支信息失败:', error)
    return {
      year: '',
      month: '',
      day: ''
    }
  }
}

/**
 * 检查指定日期是否为农历节日
 * @param date 目标日期
 * @returns 是否为节日
 */
export function isLunarFestival(date: Date): boolean {
  const festivals = getFestivals(date)
  return festivals.length > 0
}

/**
 * 检查指定日期是否为节气
 * @param date 目标日期
 * @returns 是否为节气
 */
export function isSolarTerm(date: Date): boolean {
  const solarTerms = getSolarTerms(date)
  return solarTerms.length > 0
}

/**
 * 获取指定日期的完整农历信息摘要
 * @param date 目标日期
 * @returns 农历信息摘要字符串
 */
export function getLunarSummary(date: Date): string {
  try {
    const lunar = Lunar.fromDate(date)
    const festivals = lunar.getFestivals()
    const solarTerms = lunar.getJieQi()

    let summary = lunar.getDayInChinese()

    if (festivals.length > 0) {
      summary = festivals[0] // 节日优先显示
    } else if (solarTerms.length > 0) {
      summary = solarTerms[0] // 其次显示节气
    }

    return summary
  } catch (error) {
    console.error('获取农历摘要失败:', error)
    return ''
  }
}

/**
 * 格式化农历显示文本
 * @param lunarDate 农历日期
 * @param festivals 节日列表
 * @param solarTerms 节气列表
 * @returns 格式化后的显示文本
 */
export function formatLunarDisplay(
  lunarDate: string,
  festivals: string[] = [],
  solarTerms: string[] = []
): string {
  // 节日优先级最高
  if (festivals.length > 0) {
    return festivals[0]
  }

  // 节气次之
  if (solarTerms.length > 0) {
    return solarTerms[0]
  }

  // 最后显示农历日期
  return lunarDate
}
