import React from 'react'
import { getMonthName, getWeekDays } from '../../utils/dateUtils'
import { Icon } from '../ui/Icon'
import { flatIcons } from '../../constants/icons'

interface CalendarHeaderProps {
  currentDate: Date
  onPrevMonth: () => void
  onNextMonth: () => void
  onToday: () => void
  compact?: boolean
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentDate,
  onPrevMonth,
  onNextMonth,
  onToday
}) => {
  const weekDays = getWeekDays()

  return (
    <div className="calendar-header">
      {/* 月份导航 */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {getMonthName(currentDate)}
        </h2>

        <div className="flex items-center gap-2">
          <button
            onClick={onPrevMonth}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            aria-label="上一月"
          >
            <Icon icon={flatIcons.prev} size="sm" />
          </button>

          <button
            onClick={onToday}
            className="px-3 py-1 text-xs bg-primary-500 hover:bg-primary-600 text-white rounded-md transition-colors"
          >
            今天
          </button>

          <button
            onClick={onNextMonth}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            aria-label="下一月"
          >
            <Icon icon={flatIcons.next} size="sm" />
          </button>
        </div>
      </div>

      {/* 星期标题 */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day) => (
          <div
            key={day}
            className="h-8 flex items-center justify-center text-sm font-medium text-gray-600 dark:text-gray-400"
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  )
}

export default CalendarHeader
