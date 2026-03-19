export interface LunarDateInfo {
  lunarYear: string
  lunarMonth: string
  lunarDay: string
  ganZhiYear: string
  ganZhiMonth: string
  ganZhiDay: string
  zodiac: string
}

export interface LunarInfo {
  lunarDay: string
  lunarMonth: string
  ganZhiYear: string
  zodiac: string
  festivals: string[]
  solarTerms: string[]
}

export interface CalendarDate {
  date: Date
  day: number
  isToday: boolean
  isCurrentMonth: boolean
  isSelected: boolean
  lunarInfo?: LunarInfo
  holidayInfo?: HolidayInfo
}

/** 日期类型：法定假日 / 普通周末 / 工作日（含调休上班） */
export type HolidayKind = 'statutory' | 'weekend' | 'workday'

export interface HolidayInfo {
  isHoliday: boolean
  isWorkday: boolean
  holidayName?: string
  holidayKind: HolidayKind
}

export interface DayCalendarData {
  year: number
  month: number
  day: number
  lunarInfo: LunarDateInfo
  holidayInfo: HolidayInfo
  festivals: string[]
  solarTerms: string[]
}

export interface NextHoliday {
  name: string
  days: number
}

export interface AppSettings {
  general: {
    autoLaunch: boolean
  }
  calendar: {
    weekStartsOn: number
    highlightToday: boolean
    showFestivals: boolean
    showSolarTerms: boolean
  }
  ui: {
    windowOpacity: number
    enableGlassmorphism: boolean
    showLunarInfo: boolean
  }
}
