import React from 'react'
import { PopupCalendar } from '@components/Calendar/PopupCalendar'

/**
 * 万年历应用主界面
 * 支持路由：默认显示日历，#settings显示设置
 */
function App(): React.JSX.Element {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* macOS风格日历弹窗 */}
      <PopupCalendar />
    </div>
  )
}

export default App
