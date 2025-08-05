import React from 'react'
import { useSettings, useAutoLaunch, useTheme } from '@hooks/useSettings'
import { Icon } from '@components/ui/Icon'
import { IconButton } from '@components/ui/IconButton'
import { flatIcons } from '@renderer/constants/icons'

/**
 * 设置窗口主组件
 */
export const SettingsWindow: React.FC = () => {
  const { settings, loading, error, updateSettings, resetSettings } = useSettings()
  const { enabled: autoLaunchEnabled, setAutoLaunch } = useAutoLaunch()
  const { theme, setTheme } = useTheme()

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">加载设置中...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Icon icon={flatIcons.alertCircle} size="lg" className="text-red-500 mx-auto mb-4" />
            <p className="text-red-600 dark:text-red-400 mb-4">加载设置失败</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (!settings) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* 标题栏 */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Icon
              icon={flatIcons.settings}
              size="md"
              className="text-gray-700 dark:text-gray-300"
            />
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">设置</h1>
          </div>
          <div className="flex items-center space-x-2">
            <IconButton
              icon={flatIcons.rotateCcw}
              onClick={resetSettings}
              size="sm"
              variant="ghost"
              className="text-gray-500 hover:text-red-600"
              title="重置所有设置"
            />
          </div>
        </div>
      </div>

      {/* 设置内容 */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 通用设置 */}
          <SettingsCard
            title="通用设置"
            icon={flatIcons.settings}
            description="应用的基本设置和行为"
          >
            {/* 开机自启动 */}
            <SettingsItem
              label="开机自启动"
              description="系统启动时自动运行万年历"
              icon={flatIcons.play}
            >
              <ToggleSwitch checked={autoLaunchEnabled} onChange={setAutoLaunch} />
            </SettingsItem>

            {/* 主题设置 */}
            <SettingsItem
              label="外观主题"
              description="选择应用的显示主题"
              icon={flatIcons.palette}
            >
              <ThemeSelector value={theme} onChange={setTheme} />
            </SettingsItem>

            {/* 语言设置 */}
            <SettingsItem label="语言" description="选择应用显示语言" icon={flatIcons.globe}>
              <LanguageSelector
                value={settings.general.language}
                onChange={(language) => updateSettings('general', { language })}
              />
            </SettingsItem>

            {/* 显示农历 */}
            <SettingsItem
              label="显示农历"
              description="在日历中显示农历信息"
              icon={flatIcons.calendar}
            >
              <ToggleSwitch
                checked={settings.general.showLunarCalendar}
                onChange={(checked) => updateSettings('general', { showLunarCalendar: checked })}
              />
            </SettingsItem>
          </SettingsCard>

          {/* 日历设置 */}
          <SettingsCard title="日历设置" icon={flatIcons.calendar} description="日历显示和交互设置">
            {/* 一周开始于 */}
            <SettingsItem
              label="一周开始于"
              description="设置日历一周的开始日期"
              icon={flatIcons.calendarDays}
            >
              <WeekStartSelector
                value={settings.calendar.weekStartsOn}
                onChange={(weekStartsOn) => updateSettings('calendar', { weekStartsOn })}
              />
            </SettingsItem>

            {/* 高亮今日 */}
            <SettingsItem label="高亮今日" description="突出显示今天的日期" icon={flatIcons.target}>
              <ToggleSwitch
                checked={settings.calendar.highlightToday}
                onChange={(checked) => updateSettings('calendar', { highlightToday: checked })}
              />
            </SettingsItem>

            {/* 显示节日 */}
            <SettingsItem label="显示节日" description="在日历中显示节日信息" icon={flatIcons.gift}>
              <ToggleSwitch
                checked={settings.calendar.showFestivals}
                onChange={(checked) => updateSettings('calendar', { showFestivals: checked })}
              />
            </SettingsItem>

            {/* 显示节气 */}
            <SettingsItem
              label="显示节气"
              description="在日历中显示二十四节气"
              icon={flatIcons.sun}
            >
              <ToggleSwitch
                checked={settings.calendar.showSolarTerms}
                onChange={(checked) => updateSettings('calendar', { showSolarTerms: checked })}
              />
            </SettingsItem>
          </SettingsCard>

          {/* 界面设置 */}
          <SettingsCard title="界面设置" icon={flatIcons.eye} description="窗口和界面显示设置">
            {/* 窗口透明度 */}
            <SettingsItem label="窗口透明度" description="调整窗口的透明程度" icon={flatIcons.eye}>
              <OpacitySlider
                value={settings.ui.windowOpacity}
                onChange={(windowOpacity) => updateSettings('ui', { windowOpacity })}
              />
            </SettingsItem>

            {/* 玻璃拟态效果 */}
            <SettingsItem
              label="玻璃拟态效果"
              description="启用现代化的毛玻璃背景效果"
              icon={flatIcons.sparkles}
            >
              <ToggleSwitch
                checked={settings.ui.enableGlassmorphism}
                onChange={(checked) => updateSettings('ui', { enableGlassmorphism: checked })}
              />
            </SettingsItem>
          </SettingsCard>

          {/* 高级设置 */}
          <SettingsCard title="高级设置" icon={flatIcons.cog} description="开发者和高级功能设置">
            {/* 硬件加速 */}
            <SettingsItem
              label="硬件加速"
              description="使用GPU加速渲染（需要重启）"
              icon={flatIcons.zap}
            >
              <ToggleSwitch
                checked={settings.advanced.enableHardwareAcceleration}
                onChange={(checked) =>
                  updateSettings('advanced', { enableHardwareAcceleration: checked })
                }
              />
            </SettingsItem>

            {/* 启动时最小化 */}
            <SettingsItem
              label="启动时最小化"
              description="应用启动时最小化到系统托盘"
              icon={flatIcons.minimize2}
            >
              <ToggleSwitch
                checked={settings.advanced.launchMinimized}
                onChange={(checked) => updateSettings('advanced', { launchMinimized: checked })}
              />
            </SettingsItem>
          </SettingsCard>
        </div>
      </div>
    </div>
  )
}

// 设置卡片组件
interface SettingsCardProps {
  title: string
  icon: string
  description: string
  children: React.ReactNode
}

const SettingsCard: React.FC<SettingsCardProps> = ({ title, icon, description, children }) => (
  <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 p-6">
    <div className="flex items-center space-x-3 mb-4">
      <Icon icon={icon} size="md" className="text-blue-600 dark:text-blue-400" />
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
      </div>
    </div>
    <div className="space-y-4">{children}</div>
  </div>
)

// 设置项组件
interface SettingsItemProps {
  label: string
  description: string
  icon: string
  children: React.ReactNode
}

const SettingsItem: React.FC<SettingsItemProps> = ({ label, description, icon, children }) => (
  <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
    <div className="flex items-center space-x-3 flex-1">
      <Icon icon={icon} size="sm" className="text-gray-500 dark:text-gray-400" />
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>
        <p className="text-xs text-gray-600 dark:text-gray-400">{description}</p>
      </div>
    </div>
    <div className="ml-4">{children}</div>
  </div>
)

// 开关组件
interface ToggleSwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onChange }) => (
  <button
    onClick={() => onChange(!checked)}
    className={`
      relative inline-flex h-6 w-11 items-center rounded-full transition-colors
      ${checked ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}
    `}
  >
    <span
      className={`
        inline-block h-4 w-4 transform rounded-full bg-white transition-transform
        ${checked ? 'translate-x-6' : 'translate-x-1'}
      `}
    />
  </button>
)

// 主题选择器
interface ThemeSelectorProps {
  value: 'light' | 'dark' | 'auto'
  onChange: (theme: 'light' | 'dark' | 'auto') => void
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ value, onChange }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value as 'light' | 'dark' | 'auto')}
    className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
  >
    <option value="light">浅色</option>
    <option value="dark">深色</option>
    <option value="auto">跟随系统</option>
  </select>
)

// 语言选择器
interface LanguageSelectorProps {
  value: 'zh-CN' | 'en-US'
  onChange: (language: 'zh-CN' | 'en-US') => void
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ value, onChange }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value as 'zh-CN' | 'en-US')}
    className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
  >
    <option value="zh-CN">简体中文</option>
    <option value="en-US">English</option>
  </select>
)

// 一周开始选择器
interface WeekStartSelectorProps {
  value: 0 | 1
  onChange: (weekStartsOn: 0 | 1) => void
}

const WeekStartSelector: React.FC<WeekStartSelectorProps> = ({ value, onChange }) => (
  <select
    value={value}
    onChange={(e) => onChange(Number(e.target.value) as 0 | 1)}
    className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
  >
    <option value={1}>周一</option>
    <option value={0}>周日</option>
  </select>
)

// 透明度滑块
interface OpacitySliderProps {
  value: number
  onChange: (opacity: number) => void
}

const OpacitySlider: React.FC<OpacitySliderProps> = ({ value, onChange }) => (
  <div className="flex items-center space-x-3">
    <input
      type="range"
      min="0.1"
      max="1.0"
      step="0.05"
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="flex-1 h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
    />
    <span className="text-sm text-gray-600 dark:text-gray-400 w-10">
      {Math.round(value * 100)}%
    </span>
  </div>
)

export default SettingsWindow
