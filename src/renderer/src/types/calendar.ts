// 日历相关类型定义

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
