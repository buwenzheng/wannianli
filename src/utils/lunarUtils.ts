import { invoke } from '@tauri-apps/api/core'
import type { LunarDateInfo, HolidayInfo, DayCalendarData } from '../types'

/**
 * 批量获取日历数据（单次 IPC 调用）
 */
export async function getCalendarData(dates: Date[]): Promise<DayCalendarData[]> {
  return invoke('get_calendar_data', {
    dates: dates.map(d => [d.getFullYear(), d.getMonth() + 1, d.getDate()]),
  })
}

/**
 * 获取农历信息
 */
export async function getLunarDateInfo(date: Date): Promise<LunarDateInfo> {
  return invoke('get_lunar_date', {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
  })
}

/**
 * 获取节日列表
 */
export async function getFestivals(date: Date): Promise<string[]> {
  return invoke('get_festivals', {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
  })
}

/**
 * 获取节气列表
 */
export async function getSolarTerms(date: Date): Promise<string[]> {
  return invoke('get_solar_terms', {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
  })
}

/**
 * 获取节假日信息
 */
export async function getHolidayInfo(date: Date): Promise<HolidayInfo> {
  return invoke('get_holiday_info', {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
  })
}

const LUNAR_DAYS = [
  '初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
  '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
  '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十',
]

/**
 * 格式化农历日期显示（后端数据加载前的 fallback）
 */
export function formatLunarDisplay(date: Date): string {
  const dayIndex = (date.getDate() - 1) % 30
  return LUNAR_DAYS[dayIndex] || '初一'
}

/**
 * 检查是否为周末
 */
export async function getNextHoliday(
  date: Date,
): Promise<{ name: string; days: number } | null> {
  return invoke('get_next_holiday', {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
  })
}

export function isWeekend(date: Date): boolean {
  const day = date.getDay()
  return day === 0 || day === 6
}
