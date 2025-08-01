import { useState, useMemo } from 'react'
import dayjs from 'dayjs'
import { CalendarDate, CalendarEvent } from '../types/calendar'
import { getCalendarDates, isToday, isCurrentMonth, isSameDay } from '../utils/dateUtils'

interface UseCalendarProps {
  initialDate?: Date
  events?: CalendarEvent[]
  showLunar?: boolean
}

interface UseCalendarReturn {
  currentMonth: Date
  selectedDate: Date | null
  calendarDates: CalendarDate[]
  goToPrevMonth: () => void
  goToNextMonth: () => void
  goToToday: () => void
  selectDate: (date: Date) => void
  setCurrentMonth: (date: Date) => void
}

export function useCalendar({
  initialDate = new Date(),
  events = [],
  showLunar = true
}: UseCalendarProps = {}): UseCalendarReturn {
  const [currentMonth, setCurrentMonth] = useState(initialDate)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  // 生成日历数据
  const calendarDates = useMemo(() => {
    const dates = getCalendarDates(currentMonth)

    return dates.map((date): CalendarDate => {
      const dateEvents = events.filter(
        () =>
          // 这里需要根据实际的事件数据结构来筛选
          // 暂时返回空数组，后续集成事件功能时完善
          false
      )

      return {
        date,
        day: date.getDate(),
        isToday: isToday(date),
        isCurrentMonth: isCurrentMonth(date, currentMonth),
        isSelected: isSameDay(selectedDate, date),
        events: dateEvents,
        // 农历信息暂时为空，后续集成lunar-javascript时完善
        lunarInfo: showLunar
          ? {
              lunarDate: '初一' // 占位符
            }
          : undefined
      }
    })
  }, [currentMonth, selectedDate, events, showLunar])

  // 导航函数
  const goToPrevMonth = (): void => {
    setCurrentMonth((prev) => dayjs(prev).subtract(1, 'month').toDate())
  }

  const goToNextMonth = (): void => {
    setCurrentMonth((prev) => dayjs(prev).add(1, 'month').toDate())
  }

  const goToToday = (): void => {
    const today = new Date()
    setCurrentMonth(today)
    setSelectedDate(today)
  }

  const selectDate = (date: Date): void => {
    setSelectedDate(date)
    // 如果选择的日期不在当前月，切换到对应月份
    if (!isCurrentMonth(date, currentMonth)) {
      setCurrentMonth(date)
    }
  }

  return {
    currentMonth,
    selectedDate,
    calendarDates,
    goToPrevMonth,
    goToNextMonth,
    goToToday,
    selectDate,
    setCurrentMonth
  }
}
