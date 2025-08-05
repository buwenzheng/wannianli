import React from 'react'
import { useCalendar } from '@hooks/useCalendar'
import dayjs from 'dayjs'
import { Lunar } from 'lunar-javascript'
import { cn } from '@utils/classUtils'
import { CALENDAR_POPUP_WINDOW } from '@renderer/constants/window'

/**
 * macOS风格弹出窗口专用的日历组件
 * 玻璃拟态效果，紧凑布局
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

  const handleDateSelect = (date: Date): void => {
    selectDate(date)
  }

  const isWeekend = (date: Date): boolean => {
    const day = date.getDay()
    return day === 0 || day === 6
  }

  const formatLunarDate = (date: Date): string => {
    try {
      const lunar = Lunar.fromDate(date)
      return lunar.getDayInChinese() || '初一'
    } catch {
      return '初一'
    }
  }

  return (
    <div
      className={cn(
        `w-[${CALENDAR_POPUP_WINDOW.WIDTH}px] h-[${CALENDAR_POPUP_WINDOW.HEIGHT}px]`, // 使用窗口常量
        'bg-slate-50/80 backdrop-blur-[24px]',
        'rounded-xl border border-white/50 shadow-xl',
        'overflow-hidden'
      )}
    >
      {/* 顶部导航 */}
      <header className="p-4 flex justify-between items-center shrink-0 draggable">
        <div className="flex items-center gap-1">
          <button
            title="上一年 (←)"
            onClick={goToPrevYear}
            className="p-1 rounded-md hover:bg-black/10 transition-colors no-drag"
          >
            <svg
              className="w-4 h-4 text-slate-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            title="上一月 (↑)"
            onClick={goToPrevMonth}
            className="p-1 rounded-md hover:bg-black/10 transition-colors no-drag"
          >
            <svg
              className="w-4 h-4 text-slate-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        </div>

        <h1 className="font-bold text-lg text-slate-800 cursor-pointer hover:bg-black/10 px-2 rounded-md transition-colors no-drag">
          {dayjs(currentMonth).format('YYYY年 M月')}
        </h1>

        <div className="flex items-center gap-1">
          <button
            title="下一月 (↓)"
            onClick={goToNextMonth}
            className="p-1 rounded-md hover:bg-black/10 transition-colors no-drag"
          >
            <svg
              className="w-4 h-4 text-slate-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <button
            title="下一年 (→)"
            onClick={goToNextYear}
            className="p-1 rounded-md hover:bg-black/10 transition-colors no-drag"
          >
            <svg
              className="w-4 h-4 text-slate-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 5l7 7-7 7M5 5l7 7-7 7"
              />
            </svg>
          </button>
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
      <main className="flex-grow p-4 grid grid-cols-7 gap-1 text-center text-sm">
        {calendarDates.map((calendarDate, index) => {
          const { date, isToday: isTodayDate, isCurrentMonth, isSelected, lunarInfo } = calendarDate
          const isWeekendDate = isWeekend(date)
          const lunarText = lunarInfo?.lunarDate || formatLunarDate(date)

          return (
            <div
              key={index}
              onClick={() => handleDateSelect(date)}
              className={`
                p-1 rounded-lg cursor-pointer transition-all
                ${
                  isTodayDate
                    ? 'bg-amber-400 ring-2 ring-amber-500/50'
                    : isSelected
                      ? 'bg-blue-500 text-white'
                      : 'hover:bg-black/5'
                }
                ${!isCurrentMonth ? 'text-slate-400' : ''}
              `}
            >
              <div
                className={`
                ${isWeekendDate && isCurrentMonth ? 'text-red-500' : ''}
                ${isTodayDate ? 'text-amber-900 font-bold' : ''}
                ${isSelected ? 'text-white' : ''}
              `}
              >
                {date.getDate()}
              </div>
              <div
                className={`
                text-[10px] scale-90 truncate
                ${isTodayDate ? 'text-amber-900 font-bold' : 'text-slate-500'}
                ${isSelected ? 'text-white/80' : ''}
                ${!isCurrentMonth ? 'text-slate-400' : ''}
              `}
              >
                {lunarText}
              </div>
            </div>
          )
        })}
      </main>

      {/* 底部功能区 */}
      <footer className="p-4 mt-auto border-t border-black/10 flex justify-between items-center shrink-0">
        <button
          title="返回今日 (↵)"
          onClick={goToToday}
          className="px-4 py-1.5 text-sm bg-black/10 text-slate-700 rounded-lg hover:bg-black/20 cursor-pointer transition-all"
        >
          回到今日
        </button>

        <div className="flex items-center gap-2">
          <button
            title="设置"
            className="p-2 rounded-full hover:bg-black/10 transition-all cursor-pointer"
          >
            <svg
              className="w-5 h-5 text-slate-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>
        </div>
      </footer>
    </div>
  )
}

export default PopupCalendar
