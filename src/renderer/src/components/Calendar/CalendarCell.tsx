import React, { useMemo, useCallback } from 'react'
import { cn } from '@utils/classUtils'

interface CalendarCellProps {
  date: Date
  isToday: boolean
  isCurrentMonth: boolean
  isSelected: boolean
  isWeekend: boolean
  lunarText: string
  onDateSelect: (date: Date) => void
}

/**
 * 日历单元格组件 - 经过性能优化
 */
export const CalendarCell: React.FC<CalendarCellProps> = React.memo(({
  date,
  isToday,
  isCurrentMonth,
  isSelected,
  isWeekend,
  lunarText,
  onDateSelect
}) => {
  // 使用 useCallback 缓存点击处理函数
  const handleClick = useCallback(() => {
    onDateSelect(date)
  }, [date, onDateSelect])

  // 使用 useMemo 缓存样式计算
  const cellStyles = useMemo(() => {
    return cn(
      'p-1 rounded-lg cursor-pointer transition-all',
      'focus:outline-none focus:ring-2 focus:ring-blue-500/50',
      {
        'bg-amber-400 ring-2 ring-amber-500/50': isToday,
        'bg-blue-500 text-white': isSelected && !isToday,
        'hover:bg-black/5': !isToday && !isSelected,
        'text-slate-400': !isCurrentMonth
      }
    )
  }, [isToday, isSelected, isCurrentMonth])

  const dateStyles = useMemo(() => {
    return cn({
      'text-red-500': isWeekend && isCurrentMonth && !isToday && !isSelected,
      'text-amber-900 font-bold': isToday,
      'text-white': isSelected && !isToday
    })
  }, [isWeekend, isCurrentMonth, isToday, isSelected])

  const lunarStyles = useMemo(() => {
    return cn(
      'text-[10px] scale-90 truncate',
      {
        'text-amber-900 font-bold': isToday,
        'text-white/80': isSelected && !isToday,
        'text-slate-500': !isToday && !isSelected && isCurrentMonth,
        'text-slate-400': !isCurrentMonth
      }
    )
  }, [isToday, isSelected, isCurrentMonth])

  const dayOfMonth = useMemo(() => date.getDate(), [date])

  // 键盘事件处理
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleClick()
    }
  }, [handleClick])

  return (
    <div
      role="gridcell"
      tabIndex={0}
      aria-label={`${date.getFullYear()}年${date.getMonth() + 1}月${dayOfMonth}日`}
      aria-selected={isSelected}
      className={cellStyles}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <div className={dateStyles}>
        {dayOfMonth}
      </div>
      <div className={lunarStyles}>
        {lunarText}
      </div>
    </div>
  )
})

CalendarCell.displayName = 'CalendarCell'