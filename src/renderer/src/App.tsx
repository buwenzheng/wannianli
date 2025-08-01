import { useState } from 'react'
import { Calendar } from './components/Calendar'
import Versions from './components/Versions'
import { IconButton } from './components/ui'
import { flatIcons } from './constants/icons'
import { usePopupWindow } from './hooks/useWindow'
import { useTray } from './hooks/useTray'

function App(): React.JSX.Element {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const { toggle: togglePopup, state: popupState } = usePopupWindow()
  const { state: trayState } = useTray()

  const handleDateSelect = (date: Date): void => {
    setSelectedDate(date)
    console.log('选择的日期:', date)
  }

  const handleMonthChange = (date: Date): void => {
    console.log('月份变化:', date)
  }

  const handleTogglePopup = async (): Promise<void> => {
    await togglePopup()
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-4xl">
        {/* 应用标题 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">万年历应用</h1>
          <p className="text-gray-600 dark:text-gray-400">
            基于 React + TypeScript + Electron 构建的现代万年历
          </p>
        </div>

        {/* 主要内容区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 日历组件 */}
          <div className="lg:col-span-2">
            <Calendar
              onDateSelect={handleDateSelect}
              onMonthChange={handleMonthChange}
              showLunar={true}
            />
          </div>

          {/* 侧边栏信息 */}
          <div className="space-y-6">
            {/* 选中日期信息 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                日期信息
              </h3>
              {selectedDate ? (
                <div className="space-y-2">
                  <p className="text-gray-600 dark:text-gray-400">
                    公历: {selectedDate.toLocaleDateString('zh-CN')}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    星期: {['日', '一', '二', '三', '四', '五', '六'][selectedDate.getDay()]}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">农历: 暂未集成</p>
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-500">请选择一个日期</p>
              )}
            </div>

            {/* 开发信息 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                开发信息
              </h3>
              <div className="space-y-4">
                <p className="text-xs text-gray-500 dark:text-gray-500">按 F12 打开开发者工具</p>
                <Versions />

                {/* 窗口功能演示 */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <IconButton
                      icon={flatIcons.calendar}
                      variant="primary"
                      size="sm"
                      onClick={handleTogglePopup}
                    />
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      弹出日历 {popupState.isVisible ? '(已打开)' : '(已关闭)'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <IconButton
                      icon={flatIcons.settings}
                      variant={trayState.isCreated ? 'primary' : 'secondary'}
                      size="sm"
                      disabled
                    />
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      系统托盘 {trayState.isCreated ? '(已启用)' : '(未启用)'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
