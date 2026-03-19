import React from 'react'
import * as Switch from '@radix-ui/react-switch'
import * as SliderPrimitive from '@radix-ui/react-slider'
import type { AppSettings } from '../../types'
import { cn } from '../../utils/classUtils'
import { ChevronLeft } from '../Calendar/CalendarIcons'
import { checkForUpdates } from '../../utils/updater'
import { enable as enableAutostart, disable as disableAutostart } from '@tauri-apps/plugin-autostart'

interface SettingsPanelProps {
  settings: AppSettings
  onUpdate: (settings: AppSettings) => void
  onReset: () => void
  onBack: () => void
}

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean
  onChange: (v: boolean) => void
}): React.JSX.Element {
  return (
    <Switch.Root
      checked={checked}
      onCheckedChange={onChange}
      className={cn(
        'relative inline-flex h-[22px] w-[38px] shrink-0 rounded-full transition-colors duration-200 cursor-pointer',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:ring-offset-1',
        checked ? 'bg-blue-500' : 'bg-slate-200',
      )}
    >
      <Switch.Thumb
        className={cn(
          'block h-[18px] w-[18px] rounded-full bg-white shadow-sm transition-transform duration-200',
          'translate-x-[2px] will-change-transform',
          checked && 'translate-x-[17px]',
        )}
      />
    </Switch.Root>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }): React.JSX.Element {
  return (
    <div className="mb-5">
      <h3 className="text-[11px] font-medium text-slate-400 mb-1.5 px-1">{title}</h3>
      <div className="bg-white/70 rounded-xl overflow-hidden shadow-sm border border-slate-100">{children}</div>
    </div>
  )
}

function Row({
  label,
  description,
  children,
  isLast = false,
}: {
  label: string
  description?: string
  children: React.ReactNode
  isLast?: boolean
}): React.JSX.Element {
  return (
    <div
      className={cn(
        'flex items-center justify-between px-4 py-3',
        !isLast && 'border-b border-slate-100/80',
      )}
    >
      <div className="flex flex-col min-w-0 mr-3">
        <span className="text-[13px] font-medium text-slate-700">{label}</span>
        {description && <span className="text-[11px] text-slate-400 mt-0.5">{description}</span>}
      </div>
      {children}
    </div>
  )
}

function Slider({
  value,
  min,
  max,
  step,
  onChange,
}: {
  value: number
  min: number
  max: number
  step: number
  onChange: (v: number) => void
}): React.JSX.Element {
  return (
    <div className="flex items-center gap-2.5">
      <span className="text-[11px] text-slate-400 tabular-nums w-8 text-right">
        {Math.round(value * 100)}%
      </span>
      <SliderPrimitive.Root
        className="relative flex items-center select-none touch-none w-20 h-5"
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={([v]) => onChange(v)}
      >
        <SliderPrimitive.Track className="bg-slate-200 relative grow rounded-full h-[3px]">
          <SliderPrimitive.Range className="absolute bg-blue-500 rounded-full h-full" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb
          className="block w-3.5 h-3.5 bg-white rounded-full shadow-md border border-slate-200 cursor-grab active:cursor-grabbing
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 transition-colors hover:border-blue-300"
        />
      </SliderPrimitive.Root>
    </div>
  )
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  settings,
  onUpdate,
  onReset,
  onBack,
}): React.JSX.Element => {
  const patch = (path: string, value: boolean | number | string): void => {
    const [section, key] = path.split('.')
    const s = settings as unknown as Record<string, Record<string, unknown>>
    const next = {
      ...settings,
      [section]: { ...s[section], [key]: value },
    }
    onUpdate(next as AppSettings)

    if (path === 'general.autoLaunch') {
      void (value ? enableAutostart() : disableAutostart())
    }
  }

  return (
    <div
      className={cn(
        'w-[320px] h-[420px]',
        'bg-slate-50/80 backdrop-blur-[24px]',
        'rounded-xl border border-white/50 shadow-xl',
        'flex flex-col overflow-hidden',
      )}
    >
      <header className="px-4 pt-4 pb-3 flex items-center gap-3 shrink-0" data-tauri-drag-region>
        <button
          type="button"
          onClick={onBack}
          className="p-1 -ml-1 rounded-lg hover:bg-black/5 active:bg-black/10 transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-[18px] h-[18px] text-slate-500" />
        </button>
        <h1 className="text-[15px] font-semibold text-slate-800 select-none">设置</h1>
      </header>

      <main className="flex-grow overflow-y-auto px-4 pb-2 scrollbar-thin">
        <Section title="通用">
          <Row label="开机自启" description="登录系统后自动启动" isLast>
            <Toggle checked={settings.general.autoLaunch} onChange={v => patch('general.autoLaunch', v)} />
          </Row>
        </Section>

        <Section title="日历">
          <Row label="周起始日" description={settings.calendar.weekStartsOn === 1 ? '周一' : '周日'}>
            <Toggle
              checked={settings.calendar.weekStartsOn === 1}
              onChange={v => patch('calendar.weekStartsOn', v ? 1 : 0)}
            />
          </Row>
          <Row label="高亮今日">
            <Toggle checked={settings.calendar.highlightToday} onChange={v => patch('calendar.highlightToday', v)} />
          </Row>
          <Row label="显示节日">
            <Toggle checked={settings.calendar.showFestivals} onChange={v => patch('calendar.showFestivals', v)} />
          </Row>
          <Row label="显示节气" isLast>
            <Toggle checked={settings.calendar.showSolarTerms} onChange={v => patch('calendar.showSolarTerms', v)} />
          </Row>
        </Section>

        <Section title="外观">
          <Row label="显示农历" description="日期下方显示农历日">
            <Toggle checked={settings.ui.showLunarInfo} onChange={v => patch('ui.showLunarInfo', v)} />
          </Row>
          <Row label="毛玻璃效果">
            <Toggle checked={settings.ui.enableGlassmorphism} onChange={v => patch('ui.enableGlassmorphism', v)} />
          </Row>
          <Row label="窗口透明度" isLast>
            <Slider
              value={settings.ui.windowOpacity}
              min={0.5}
              max={1}
              step={0.05}
              onChange={v => patch('ui.windowOpacity', v)}
            />
          </Row>
        </Section>
      </main>

      <footer className="px-4 py-3 shrink-0 flex items-center gap-2">
        <button
          type="button"
          onClick={onReset}
          className="flex-1 py-2 text-[12px] text-slate-500 bg-slate-100 rounded-xl hover:bg-slate-200 active:bg-slate-300 cursor-pointer transition-colors font-medium"
        >
          恢复默认
        </button>
        <button
          type="button"
          onClick={() => {
            void checkForUpdates()
          }}
          className="flex-1 py-2 text-[12px] text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 active:bg-blue-200 cursor-pointer transition-colors font-medium"
        >
          检查更新
        </button>
      </footer>
    </div>
  )
}

export default SettingsPanel
