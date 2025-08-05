import React from 'react'
import { PopupCalendar } from './components/Calendar/PopupCalendar'
import { SettingsWindow } from './components/Settings/SettingsWindow'

/**
 * 万年历应用主界面
 * 支持路由：默认显示日历，#settings显示设置
 */
function App(): React.JSX.Element {
  // 根据hash路由决定显示哪个组件
  const hash = window.location.hash

  if (hash === '#settings') {
    return <SettingsWindow />
  }

  return (
    <div className="flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* macOS风格日历弹窗 */}
      <PopupCalendar />
    </div>
  )
}

export default App
