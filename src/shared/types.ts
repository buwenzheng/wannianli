/**
 * 应用设置数据结构
 * 共享给 main、preload、renderer 进程使用
 */
export interface AppSettings {
  general: {
    autoLaunch: boolean // 开机自启动
    language: 'zh-CN' | 'en-US' // 语言设置
    theme: 'light' | 'dark' | 'auto' // 主题模式
    showLunarCalendar: boolean // 显示农历
  }
  calendar: {
    weekStartsOn: 0 | 1 // 一周开始于 (0=周日, 1=周一)
    showWeekNumbers: boolean // 显示周数
    highlightToday: boolean // 高亮今日
    showFestivals: boolean // 显示节日
    showSolarTerms: boolean // 显示节气
  }
  ui: {
    windowOpacity: number // 窗口透明度 (0.1-1.0)
    enableGlassmorphism: boolean // 启用玻璃拟态效果
    showLunarInfo: boolean // 显示农历信息
  }
  advanced: {
    enableDebugMode: boolean // 开发者模式
    enableHardwareAcceleration: boolean // 硬件加速
    launchMinimized: boolean // 启动时最小化
  }
}
