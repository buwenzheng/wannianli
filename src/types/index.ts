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

export interface HolidayInfo {
  isHoliday: boolean
  isWorkday: boolean
  holidayName?: string
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
    language: string
    theme: string
  }
  calendar: {
    weekStartsOn: number
    showWeekNumbers: boolean
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
