/**
 * 万年历应用类型定义
 * 包含日历、事件等相关类型
 */

// ==================== 日历相关类型 ====================

export interface CalendarDate {
  date: Date
  day: number
  isToday: boolean
  isCurrentMonth: boolean
  isSelected: boolean
  lunarInfo?: {
    lunarDate: string
    festivals: string[]
    solarTerms: string[]
  }
  events?: CalendarEvent[]
}

export interface CalendarEvent {
  id: string
  title: string
  type: 'personal' | 'holiday' | 'festival'
  color?: string
}

export interface CalendarProps {
  currentDate?: Date
  selectedDate?: Date
  onDateSelect?: (date: Date) => void
  onMonthChange?: (date: Date) => void
  showLunar?: boolean
  events?: CalendarEvent[]
}

export interface CalendarState {
  currentMonth: Date
  selectedDate: Date | null
  viewMode: 'month' | 'year'
  events: CalendarEvent[]
}

// ==================== 设置相关类型 ====================

export interface UISettings {
  theme: 'light' | 'dark' | 'auto'
  language: 'zh-CN' | 'en-US'
  showLunar: boolean
  showHolidays: boolean
}

export interface WindowSettings {
  alwaysOnTop: boolean
  autoHide: boolean
  opacity: number
}

// ==================== 通用类型 ====================

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export type DateFormat = 'YYYY-MM-DD' | 'YYYY/MM/DD' | 'MM/DD/YYYY' | 'DD/MM/YYYY'

export type ViewMode = 'month' | 'year' | 'decade'
