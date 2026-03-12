import React from 'react'
import { cn } from '../../utils/classUtils'

interface CalendarCellProps {
  date: Date
  isToday: boolean
  isCurrentMonth: boolean
  isSelected: boolean
  isWeekend: boolean
  isHoliday: boolean
  isWorkday: boolean
  lunarText: string
  onDateSelect: (date: Date) => void
}

export const CalendarCell: React.FC<CalendarCellProps> = ({
  date,
  isToday,
  isCurrentMonth,
  isSelected,
  isWeekend,
  isHoliday,
  isWorkday,
  lunarText,
  onDateSelect,
}): React.JSX.Element => {
  const showRest = isHoliday && !isWeekend && isCurrentMonth
  const showWork = isWorkday && isWeekend && isCurrentMonth

  return (
    <button
      type="button"
      onClick={() => onDateSelect(date)}
      className={cn(
        'relative flex flex-col items-center justify-center',
        'h-14 w-full rounded-lg transition-all cursor-pointer',
        'hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-blue-500/50',
        !isCurrentMonth && 'text-slate-400',
        isCurrentMonth && isWeekend && !isWorkday && 'text-red-500',
        isCurrentMonth && (!isWeekend || isWorkday) && 'text-slate-700',
        isSelected && 'bg-blue-500 text-white hover:bg-blue-600',
        isToday && !isSelected && 'ring-2 ring-blue-500 bg-blue-50',
      )}
    >
      {(showRest || showWork) && (
        <span
          className={cn(
            'absolute top-0 right-0.5 text-[9px] font-bold leading-none',
            showRest && 'text-green-600',
            showWork && 'text-red-500',
          )}
        >
          {showRest ? '休' : '班'}
        </span>
      )}
      <span className={cn('text-sm font-medium', isSelected && 'text-white')}>
        {date.getDate()}
      </span>
      <span
        className={cn(
          'text-[10px] mt-0.5 truncate max-w-full px-0.5',
          isSelected ? 'text-white/80' : isHoliday ? 'text-green-600' : 'text-slate-400',
        )}
      >
        {lunarText}
      </span>
    </button>
  )
}
