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

/**
 * 格式化农历日期显示（后端数据加载前的 fallback）
 * 后端数据未就绪时返回空字符串，避免显示不准确的占位农历
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function formatLunarDisplay(_date: Date): string {
  return ''
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
