import React from 'react'
import type { AppSettings } from '../../types'
import { cn } from '../../utils/classUtils'
import { ChevronLeft } from '../Calendar/CalendarIcons'

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
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative inline-flex h-5 w-9 shrink-0 rounded-full transition-colors cursor-pointer',
        checked ? 'bg-blue-500' : 'bg-slate-300',
      )}
    >
      <span
        className={cn(
          'pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform mt-0.5',
          checked ? 'translate-x-4 ml-0.5' : 'translate-x-0.5',
        )}
      />
    </button>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }): React.JSX.Element {
  return (
    <div className="mb-4">
      <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-1">{title}</h3>
      <div className="bg-white/60 rounded-lg divide-y divide-slate-200/60">{children}</div>
    </div>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }): React.JSX.Element {
  return (
    <div className="flex items-center justify-between px-3 py-2.5">
      <span className="text-sm text-slate-700">{label}</span>
      {children}
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
      <header className="p-4 flex items-center gap-2 shrink-0 border-b border-black/10" data-tauri-drag-region>
        <button
          type="button"
          onClick={onBack}
          className="p-1 rounded-md hover:bg-black/10 transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4 text-slate-600" />
        </button>
        <h1 className="font-bold text-lg text-slate-800 select-none">设置</h1>
      </header>

      <main className="flex-grow overflow-y-auto p-4">
        <Section title="通用">
          <Row label="开机自启">
            <Toggle checked={settings.general.autoLaunch} onChange={v => patch('general.autoLaunch', v)} />
          </Row>
        </Section>

        <Section title="日历">
          <Row label="高亮今日">
            <Toggle checked={settings.calendar.highlightToday} onChange={v => patch('calendar.highlightToday', v)} />
          </Row>
          <Row label="显示节日">
            <Toggle checked={settings.calendar.showFestivals} onChange={v => patch('calendar.showFestivals', v)} />
          </Row>
          <Row label="显示节气">
            <Toggle checked={settings.calendar.showSolarTerms} onChange={v => patch('calendar.showSolarTerms', v)} />
          </Row>
        </Section>

        <Section title="界面">
          <Row label="显示农历">
            <Toggle checked={settings.ui.showLunarInfo} onChange={v => patch('ui.showLunarInfo', v)} />
          </Row>
          <Row label="毛玻璃效果">
            <Toggle checked={settings.ui.enableGlassmorphism} onChange={v => patch('ui.enableGlassmorphism', v)} />
          </Row>
          <Row label="窗口透明度">
            <input
              type="range"
              min={0.5}
              max={1}
              step={0.05}
              value={settings.ui.windowOpacity}
              onChange={e => patch('ui.windowOpacity', parseFloat(e.target.value))}
              className="w-24 accent-blue-500 cursor-pointer"
            />
          </Row>
        </Section>
      </main>

      <footer className="p-4 border-t border-black/10 shrink-0">
        <button
          type="button"
          onClick={onReset}
          className="w-full py-1.5 text-sm text-red-600 bg-red-50 rounded-lg hover:bg-red-100 cursor-pointer transition-colors"
        >
          恢复默认设置
        </button>
      </footer>
    </div>
  )
}

export default SettingsPanel
