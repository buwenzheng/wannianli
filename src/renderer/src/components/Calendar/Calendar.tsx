import React from 'react'
import type { CalendarProps } from '../../types/calendar'
import { useCalendar } from '@hooks/useCalendar'
import CalendarHeader from '@components/Calendar/CalendarHeader'
import CalendarGrid from '@components/Calendar/CalendarGrid'

const Calendar: React.FC<CalendarProps> = ({
  currentDate,
  onDateSelect,
  onMonthChange,
  showLunar = true,
  events = []
}) => {
  const {
    currentMonth,
    selectedDate: internalSelectedDate,
    calendarDates,
    goToPrevMonth,
    goToNextMonth,
    goToToday,
    selectDate
  } = useCalendar({
    initialDate: currentDate,
    events,
    showLunar
  })

  // 处理日期选择
  const handleDateSelect = (date: Date): void => {
    selectDate(date)
    onDateSelect?.(date)
  }

  // 处理月份变化
  const handlePrevMonth = (): void => {
    goToPrevMonth()
    onMonthChange?.(currentMonth)
  }

  const handleNextMonth = (): void => {
    goToNextMonth()
    onMonthChange?.(currentMonth)
  }

  const handleToday = (): void => {
    goToToday()
    onMonthChange?.(new Date())
  }

  return (
    <div className="calendar-container w-full max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <CalendarHeader
        currentDate={currentMonth}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        onToday={handleToday}
      />

      <CalendarGrid dates={calendarDates} onDateClick={handleDateSelect} />

      {/* 选中日期显示 */}
      {internalSelectedDate && (
        <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            选中日期: {internalSelectedDate.toLocaleDateString('zh-CN')}
          </p>
        </div>
      )}
    </div>
  )
}

export default Calendar
