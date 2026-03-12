import { useState, useMemo, useEffect, useCallback } from 'react'
import type { CalendarDate, DayCalendarData } from '../types'
import { getCalendarDates, isToday, isCurrentMonth, isSameDay } from '../utils/dateUtils'
import { formatLunarDisplay, getCalendarData } from '../utils/lunarUtils'

interface UseCalendarProps {
  initialDate?: Date
  showLunar?: boolean
}

interface UseCalendarReturn {
  currentMonth: Date
  selectedDate: Date | null
  calendarDates: CalendarDate[]
  goToPrevMonth: () => void
  goToNextMonth: () => void
  goToPrevYear: () => void
  goToNextYear: () => void
  goToToday: () => void
  selectDate: (date: Date) => void
  setCurrentMonth: (date: Date) => void
}

export function useCalendar({
  initialDate = new Date(),
  showLunar = true,
}: UseCalendarProps = {}): UseCalendarReturn {
  const [currentMonth, setCurrentMonth] = useState(initialDate)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [backendData, setBackendData] = useState<Map<string, DayCalendarData>>(new Map())

  useEffect(() => {
    const dates = getCalendarDates(currentMonth)
    getCalendarData(dates)
      .then(data => {
        const map = new Map<string, DayCalendarData>()
        data.forEach(d => map.set(`${d.year}-${d.month}-${d.day}`, d))
        setBackendData(map)
      })
      .catch(err => console.error('Failed to load calendar data:', err))
  }, [currentMonth])

  const calendarDates = useMemo(() => {
    const dates = getCalendarDates(currentMonth)

    return dates.map((date): CalendarDate => {
      const key = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
      const data = backendData.get(key)

      return {
        date,
        day: date.getDate(),
        isToday: isToday(date),
        isCurrentMonth: isCurrentMonth(date, currentMonth),
        isSelected: isSameDay(selectedDate, date),
        lunarInfo: showLunar
          ? data
            ? {
                lunarDay: data.lunarInfo.lunarDay,
                lunarMonth: data.lunarInfo.lunarMonth,
                ganZhiYear: data.lunarInfo.ganZhiYear,
                zodiac: data.lunarInfo.zodiac,
                festivals: data.festivals,
                solarTerms: data.solarTerms,
              }
            : {
                lunarDay: formatLunarDisplay(date),
                lunarMonth: '',
                ganZhiYear: '',
                zodiac: '',
                festivals: [],
                solarTerms: [],
              }
          : undefined,
        holidayInfo: data?.holidayInfo,
      }
    })
  }, [currentMonth, selectedDate, backendData, showLunar])

  const goToPrevMonth = useCallback((): void => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
  }, [])

  const goToNextMonth = useCallback((): void => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
  }, [])

  const goToPrevYear = useCallback((): void => {
    setCurrentMonth(prev => new Date(prev.getFullYear() - 1, prev.getMonth(), 1))
  }, [])

  const goToNextYear = useCallback((): void => {
    setCurrentMonth(prev => new Date(prev.getFullYear() + 1, prev.getMonth(), 1))
  }, [])

  const goToToday = useCallback((): void => {
    const today = new Date()
    setCurrentMonth(today)
    setSelectedDate(today)
  }, [])

  const selectDate = useCallback(
    (date: Date): void => {
      setSelectedDate(date)
      if (!isCurrentMonth(date, currentMonth)) {
        setCurrentMonth(date)
      }
    },
    [currentMonth],
  )

  return {
    currentMonth,
    selectedDate,
    calendarDates,
    goToPrevMonth,
    goToNextMonth,
    goToPrevYear,
    goToNextYear,
    goToToday,
    selectDate,
    setCurrentMonth,
  }
}
