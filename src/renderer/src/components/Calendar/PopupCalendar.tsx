import React, { useCallback, useMemo } from 'react'
import { useCalendar } from '@hooks/useCalendar'
import dayjs from 'dayjs'
import { cn } from '@utils/classUtils'
import { CALENDAR_POPUP_WINDOW } from '@renderer/constants/window'
import { NavigationButton } from './NavigationButton'
import { CalendarIcons } from './CalendarIcons'
import { CalendarCell } from './CalendarCell'
import { lunarFormatter, isWeekend } from '@utils/lunarUtils'

/**
 * macOS风格弹出窗口专用的日历组件
 * 玻璃拟态效果，紧凑布局，性能优化
 */
export const PopupCalendar: React.FC = (): React.JSX.Element => {
  const {
    currentMonth,
    calendarDates,
    goToPrevMonth,
    goToNextMonth,
    goToPrevYear,
    goToNextYear,
    goToToday,
    selectDate
  } = useCalendar({
    showLunar: true
  })

  // 使用 useCallback 缓存事件处理函数
  const handleDateSelect = useCallback(
    (date: Date): void => {
      selectDate(date)
    },
    [selectDate]
  )

  // 使用 useMemo 缓存格式化的月份标题
  const monthTitle = useMemo(() => {
    return dayjs(currentMonth).format('YYYY年 M月')
  }, [currentMonth])

  return (
    <div
      className={cn(
        'w-[var(--popup-width)] h-[var(--popup-height)]',
        'bg-slate-50/80 backdrop-blur-[24px]',
        'rounded-xl border border-white/50 shadow-xl'
      )}
      style={
        {
          '--popup-width': `${CALENDAR_POPUP_WINDOW.WIDTH}px`,
          '--popup-height': `${CALENDAR_POPUP_WINDOW.HEIGHT}px`
        } as React.CSSProperties
      }
    >
      {/* 顶部导航 */}
      <header className="p-4 flex justify-between items-center shrink-0 draggable">
        <div className="flex items-center gap-1">
          <NavigationButton title="上一年 (←)" onClick={goToPrevYear}>
            <CalendarIcons.ChevronsLeft className="w-4 h-4 text-slate-600" />
          </NavigationButton>
          <NavigationButton title="上一月 (↑)" onClick={goToPrevMonth}>
            <CalendarIcons.ChevronLeft className="w-4 h-4 text-slate-600" />
          </NavigationButton>
        </div>

        <h1 className="font-bold text-lg text-slate-800 cursor-pointer hover:bg-black/10 px-2 rounded-md transition-colors">
          {monthTitle}
        </h1>

        <div className="flex items-center gap-1">
          <NavigationButton title="下一月 (↓)" onClick={goToNextMonth}>
            <CalendarIcons.ChevronRight className="w-4 h-4 text-slate-600" />
          </NavigationButton>
          <NavigationButton title="下一年 (→)" onClick={goToNextYear}>
            <CalendarIcons.ChevronsRight className="w-4 h-4 text-slate-600" />
          </NavigationButton>
        </div>
      </header>

      {/* 星期标题 */}
      <div className="px-4 py-2 grid grid-cols-7 gap-2 text-center text-xs font-semibold text-slate-500 border-b border-black/10">
        <div className="text-red-500">日</div>
        <div>一</div>
        <div>二</div>
        <div>三</div>
        <div>四</div>
        <div>五</div>
        <div className="text-red-500">六</div>
      </div>

      {/* 日历网格 */}
      <main
        role="grid"
        aria-label="日历"
        className="flex-grow p-4 grid grid-cols-7 gap-1 text-center text-sm"
      >
        {calendarDates.map((calendarDate) => {
          const { date, isToday: isTodayDate, isCurrentMonth, isSelected, lunarInfo } = calendarDate
          const isWeekendDate = isWeekend(date)
          const lunarText = lunarInfo?.lunarDate || lunarFormatter.formatLunarDate(date)

          return (
            <CalendarCell
              key={`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`}
              date={date}
              isToday={isTodayDate}
              isCurrentMonth={isCurrentMonth}
              isSelected={isSelected}
              isWeekend={isWeekendDate}
              lunarText={lunarText}
              onDateSelect={handleDateSelect}
            />
          )
        })}
      </main>

      {/* 底部功能区 */}
      <footer className="p-4 mt-auto border-t border-black/10 flex justify-between items-center shrink-0">
        <button
          type="button"
          title="返回今日 (↵)"
          onClick={goToToday}
          className="px-4 py-1.5 text-sm bg-black/10 text-slate-700 rounded-lg hover:bg-black/20 cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          aria-label="返回今日"
        >
          回到今日
        </button>

        <div className="flex items-center gap-2">
          <NavigationButton
            title="设置"
            onClick={() => {
              // TODO: 实现设置功能
              console.log('打开设置')
            }}
            className="p-2 rounded-full"
          >
            <CalendarIcons.Settings className="w-5 h-5 text-slate-600" />
          </NavigationButton>
        </div>
      </footer>
    </div>
  )
}

export default PopupCalendar
