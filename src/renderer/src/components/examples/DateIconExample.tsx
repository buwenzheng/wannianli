import React, { useState, useEffect } from 'react'
import { IconButton } from '@components/ui'
import { flatIcons } from '@renderer/constants/icons'

/**
 * 动态日期图标演示组件
 * 展示日期图标的功能和实时更新
 */
export const DateIconExample: React.FC = (): React.JSX.Element => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  // 每秒更新当前时间（用于演示）
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleRefreshIcon = async (): Promise<void> => {
    try {
      // 调用托盘图标刷新函数
      const result = await window.api.tray.updateMenu()
      if (result.success) {
        console.log('✅ 托盘图标已刷新')
      } else {
        console.error('❌ 刷新托盘图标失败:', result.error)
      }
    } catch (error) {
      console.error('❌ 刷新托盘图标失败:', error)
    }
  }

  const handleDateChange = (days: number): void => {
    const newDate = new Date()
    newDate.setDate(newDate.getDate() + days)
    setSelectedDate(newDate)
  }

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    })
  }

  const getDayOfMonth = (date: Date): number => {
    return date.getDate()
  }

  return (
    <div className="p-6 space-y-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">动态日期图标演示</h2>

      {/* 当前时间显示 */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">当前时间</h3>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">完整日期时间</p>
              <p className="text-lg font-mono text-gray-900 dark:text-gray-100">
                {formatDate(currentDate)}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                {currentDate.toLocaleTimeString('zh-CN')}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">菜单栏图标显示</p>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {getDayOfMonth(currentDate).toString().padStart(2, '0')}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-500">模拟菜单栏图标</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    日期: {getDayOfMonth(currentDate)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 图标控制操作 */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">图标控制</h3>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex flex-wrap gap-4">
            <IconButton icon={flatIcons.refresh} onClick={handleRefreshIcon} variant="primary" />
            <span className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              刷新托盘图标
            </span>
          </div>

          <div className="mt-4 text-xs text-gray-500 dark:text-gray-500">
            <p>• 图标会自动在每天午夜更新</p>
            <p>• 手动刷新可以立即更新图标</p>
            <p>• 图标显示当前日期的日数字</p>
          </div>
        </div>
      </section>

      {/* 日期模拟测试 */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">日期模拟测试</h3>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">模拟不同日期的图标显示效果</p>

            <div className="flex flex-wrap gap-2">
              {[-5, -1, 0, 1, 5, 10, 15].map((days) => (
                <button
                  key={days}
                  onClick={() => handleDateChange(days)}
                  className="px-3 py-2 text-xs bg-gray-100 dark:bg-gray-700 rounded-md 
                           hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  {days === 0 ? '今天' : `${days > 0 ? '+' : ''}${days}天`}
                </button>
              ))}
            </div>

            {selectedDate && (
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center shadow-sm">
                    <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      {getDayOfMonth(selectedDate).toString().padStart(2, '0')}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                      {formatDate(selectedDate)}
                    </p>
                    <p className="text-xs text-blue-600 dark:text-blue-300">
                      图标将显示: {getDayOfMonth(selectedDate)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 功能说明 */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">功能特性</h3>
        <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">自动更新</h4>
              <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                <li>• 每小时检查日期变化</li>
                <li>• 自动更新为当前日期</li>
                <li>• 跨平台统一显示</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">图标设计</h4>
              <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                <li>• macOS: 18x18 像素</li>
                <li>• Windows/Linux: 16x16 像素</li>
                <li>• 清晰的像素字体</li>
                <li>• 日历背景设计</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 开发信息 */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">开发信息</h3>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
            <p>
              <strong>实现方式:</strong> 代码生成像素图标，无需外部图片文件
            </p>
            <p>
              <strong>更新机制:</strong> 定时器 + 手动刷新
            </p>
            <p>
              <strong>降级方案:</strong> 多层降级确保图标显示
            </p>
            <p>
              <strong>性能优化:</strong> 缓存机制避免重复生成
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default DateIconExample
