import React from 'react'
import { CalendarDate } from '../../types/calendar'
import { cn } from '../../utils/classUtils'

interface CalendarGridProps {
  dates: CalendarDate[]
  onDateClick: (date: Date) => void
}

const CalendarGrid: React.FC<CalendarGridProps> = ({ dates, onDateClick }) => {
  return (
    <div className="calendar-grid">
      {dates.map((dateInfo, index) => (
        <div
          key={index}
          onClick={() => onDateClick(dateInfo.date)}
          className={cn(
            'calendar-cell',
            'relative cursor-pointer select-none',
            dateInfo.isToday && 'today',
            dateInfo.isSelected && 'selected',
            !dateInfo.isCurrentMonth && 'other-month'
          )}
        >
          {/* 日期数字 */}
          <div className="flex flex-col items-center">
            <span className="text-sm font-medium">{dateInfo.day}</span>

            {/* 农历信息 */}
            {dateInfo.lunarInfo && (
              <span className="lunar-info">{dateInfo.lunarInfo.lunarDate}</span>
            )}
          </div>

          {/* 节日标记 */}
          {dateInfo.lunarInfo?.festival && <div className="festival-dot" />}

          {/* 事件标记 */}
          {dateInfo.events && dateInfo.events.length > 0 && <div className="event-dot" />}
        </div>
      ))}
    </div>
  )
}

export default CalendarGrid
