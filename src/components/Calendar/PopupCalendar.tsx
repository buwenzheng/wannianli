import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { listen } from '@tauri-apps/api/event'
import { getCurrentWindow } from '@tauri-apps/api/window'
import { useCalendar } from '../../hooks/useCalendar'
import { useSettings } from '../../hooks/useSettings'
import { cn } from '../../utils/classUtils'
import { NavigationButton } from './NavigationButton'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Settings } from './CalendarIcons'
import { CalendarCell } from './CalendarCell'
import { SettingsPanel } from '../Settings/SettingsPanel'
import { formatLunarDisplay, getNextHoliday, isWeekend } from '../../utils/lunarUtils'

export const PopupCalendar: React.FC = (): React.JSX.Element => {
  const [showSettings, setShowSettings] = useState(false)
  const [showAbout, setShowAbout] = useState(false)
  const [countdownKey, setCountdownKey] = useState(0)
  const { settings, save, reset } = useSettings()

  const weekStartsOn = (settings?.calendar.weekStartsOn ?? 0) as 0 | 1
  const {
    currentMonth,
    calendarDates,
    goToPrevMonth,
    goToNextMonth,
    goToPrevYear,
    goToNextYear,
    goToToday: _goToToday,
    selectDate,
  } = useCalendar({
    showLunar: settings?.ui.showLunarInfo ?? true,
    weekStartsOn,
  })

  const goToToday = useCallback((): void => {
    _goToToday()
    setCountdownKey(k => k + 1)
  }, [_goToToday])

  useEffect(() => {
    const unsub1 = listen('show-settings', () => setShowSettings(true))
    const unsub2 = listen('go-to-today', () => goToToday())
    const unsub3 = listen('show-about', () => setShowAbout(true))
    return (): void => {
      unsub1.then(fn => fn())
      unsub2.then(fn => fn())
      unsub3.then(fn => fn())
    }
  }, [goToToday])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (showSettings) return
      switch (e.key) {
        case 'Escape':
          void getCurrentWindow().hide()
          break
        case 'Enter':
          goToToday()
          break
        case 'ArrowLeft':
          e.preventDefault()
          goToPrevMonth()
          break
        case 'ArrowRight':
          e.preventDefault()
          goToNextMonth()
          break
        case 'ArrowUp':
          e.preventDefault()
          goToPrevYear()
          break
        case 'ArrowDown':
          e.preventDefault()
          goToNextYear()
          break
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return (): void => window.removeEventListener('keydown', handleKeyDown)
  }, [showSettings, goToPrevMonth, goToNextMonth, goToPrevYear, goToNextYear, goToToday])

  const handleWheel = useCallback(
    (e: React.WheelEvent): void => {
      if (e.deltaY > 0) goToNextMonth()
      else if (e.deltaY < 0) goToPrevMonth()
    },
    [goToNextMonth, goToPrevMonth],
  )

  const handleDateSelect = useCallback(
    (date: Date): void => {
      selectDate(date)
    },
    [selectDate],
  )

  const monthTitle = useMemo(() => {
    return `${currentMonth.getFullYear()}年 ${currentMonth.getMonth() + 1}月`
  }, [currentMonth])

  const [countdownText, setCountdownText] = useState('')

  useEffect(() => {
    const today = new Date()
    getNextHoliday(today).then(r => {
      if (!r) {
        setCountdownText('')
      } else if (r.days === 0) {
        setCountdownText(`${r.name}假期中`)
      } else {
        setCountdownText(`距${r.name}还有 ${r.days} 天`)
      }
    }).catch(() => setCountdownText(''))
  }, [currentMonth, countdownKey])

  const highlightToday = settings?.calendar.highlightToday ?? true
  const showFestivals = settings?.calendar.showFestivals ?? true
  const showSolarTerms = settings?.calendar.showSolarTerms ?? true
  const glassEnabled = settings?.ui.enableGlassmorphism ?? true
  const opacity = settings?.ui.windowOpacity ?? 1

  if (showSettings && settings) {
    return (
      <SettingsPanel
        settings={settings}
        onUpdate={save}
        onReset={reset}
        onBack={() => setShowSettings(false)}
      />
    )
  }

  return (
    <div
      style={opacity < 1 ? { opacity } : undefined}
      className={cn(
        'w-[320px] h-[420px]',
        glassEnabled ? 'bg-slate-50/80 backdrop-blur-[24px]' : 'bg-slate-50',
        'rounded-xl border border-white/50 shadow-xl',
        'relative flex flex-col overflow-hidden',
      )}
    >
      <header
        className="p-4 flex justify-between items-center shrink-0 cursor-move"
        data-tauri-drag-region
      >
        <div className="flex items-center gap-1">
          <NavigationButton title="上一年 (↑)" onClick={goToPrevYear}>
            <ChevronsLeft className="w-4 h-4 text-slate-600" />
          </NavigationButton>
          <NavigationButton title="上一月 (←)" onClick={goToPrevMonth}>
            <ChevronLeft className="w-4 h-4 text-slate-600" />
          </NavigationButton>
        </div>

        <h1 className="font-bold text-lg text-slate-800 cursor-pointer hover:bg-black/10 px-2 rounded-md transition-colors select-none">
          {monthTitle}
        </h1>

        <div className="flex items-center gap-1">
          <NavigationButton title="下一月 (→)" onClick={goToNextMonth}>
            <ChevronRight className="w-4 h-4 text-slate-600" />
          </NavigationButton>
          <NavigationButton title="下一年 (↓)" onClick={goToNextYear}>
            <ChevronsRight className="w-4 h-4 text-slate-600" />
          </NavigationButton>
        </div>
      </header>

      <div className="px-4 py-2 grid grid-cols-7 gap-2 text-center text-xs font-semibold text-slate-500 border-b border-black/10">
        {['日', '一', '二', '三', '四', '五', '六']
          .slice(weekStartsOn)
          .concat(['日', '一', '二', '三', '四', '五', '六'].slice(0, weekStartsOn))
          .map((d, i) => (
            <div key={d} className={i === 0 || i === 6 ? 'text-red-500' : ''}>{d}</div>
          ))}
      </div>

      <main
        role="grid"
        aria-label="日历"
        className="flex-grow p-4 grid grid-cols-7 gap-1 text-center text-sm"
        onWheel={handleWheel}
      >
        {calendarDates.map(calendarDate => {
          const { date, isToday, isCurrentMonth, isSelected, holidayInfo } = calendarDate
          const isWeekendDate = isWeekend(date)
          const isHoliday = !!holidayInfo?.isHoliday
          const isWorkday = !!holidayInfo?.isWorkday

          let lunarText = calendarDate.lunarInfo?.lunarDay || formatLunarDisplay(date)
          if (showSolarTerms && calendarDate.lunarInfo?.solarTerms?.length) {
            lunarText = calendarDate.lunarInfo.solarTerms[0]
          }
          if (showFestivals && calendarDate.lunarInfo?.festivals?.length) {
            lunarText = calendarDate.lunarInfo.festivals[0]
          }
          if (showFestivals && holidayInfo?.holidayName && holidayInfo.holidayName !== '周末') {
            lunarText = holidayInfo.holidayName
          }

          return (
            <CalendarCell
              key={`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`}
              date={date}
              isToday={isToday && highlightToday}
              isCurrentMonth={isCurrentMonth}
              isSelected={isSelected}
              isWeekend={isWeekendDate}
              isHoliday={isHoliday}
              isWorkday={isWorkday}
              holidayKind={holidayInfo?.holidayKind}
              lunarText={lunarText}
              onDateSelect={handleDateSelect}
            />
          )
        })}
      </main>

      <footer className="px-4 py-3 mt-auto border-t border-black/10 flex items-center justify-between shrink-0">
        <button
          type="button"
          title="返回今日 (Enter)"
          onClick={goToToday}
          className="px-3 py-1 text-xs bg-black/10 text-slate-700 rounded-md hover:bg-black/20 cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          aria-label="返回今日"
        >
          回到今日
        </button>

        {countdownText && (
          <span className="text-xs text-slate-500 select-none">{countdownText}</span>
        )}

        <NavigationButton
          title="设置"
          onClick={() => setShowSettings(true)}
          className="p-1.5 rounded-full"
        >
          <Settings className="w-4 h-4 text-slate-600" />
        </NavigationButton>
      </footer>

      {showAbout && (
        <div
          className="absolute inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm rounded-xl"
          onClick={() => setShowAbout(false)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl p-6 mx-8 text-center"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold text-slate-800 mb-1">万年历</h2>
            <p className="text-xs text-slate-500 mb-3">v{__APP_VERSION__}</p>
            <p className="text-sm text-slate-600 mb-4">轻量级桌面日历工具</p>
            <button
              type="button"
              onClick={() => setShowAbout(false)}
              className="px-4 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer transition-colors"
            >
              确定
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default PopupCalendar
