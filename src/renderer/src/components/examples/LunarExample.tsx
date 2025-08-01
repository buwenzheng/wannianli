import React, { useState } from 'react'
import { useLunarDate } from '../../hooks/useLunarDate'
import { LunarInfoDisplay } from '../Calendar/LunarInfoDisplay'
import { Icon, IconButton } from '../ui'
import { flatIcons } from '../../constants/icons'
import dayjs from 'dayjs'

/**
 * 农历功能演示组件
 * 展示农历相关功能的使用方法和效果
 */
export const LunarExample: React.FC = (): React.JSX.Element => {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const lunarData = useLunarDate(selectedDate)

  const goToPrevDay = (): void => {
    setSelectedDate(dayjs(selectedDate).subtract(1, 'day').toDate())
  }

  const goToNextDay = (): void => {
    setSelectedDate(dayjs(selectedDate).add(1, 'day').toDate())
  }

  const goToToday = (): void => {
    setSelectedDate(new Date())
  }

  return (
    <div className="p-6 space-y-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">农历功能演示</h2>
      
      {/* 日期选择器 */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">选择日期</h3>
        <div className="flex items-center gap-4">
          <IconButton icon={flatIcons.prev} onClick={goToPrevDay} variant="ghost" />
          
          <div className="flex-1 text-center">
            <div className="text-lg font-medium text-gray-900 dark:text-gray-100">
              {dayjs(selectedDate).format('YYYY年MM月DD日')}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              星期{['日', '一', '二', '三', '四', '五', '六'][selectedDate.getDay()]}
            </div>
          </div>
          
          <IconButton icon={flatIcons.next} onClick={goToNextDay} variant="ghost" />
        </div>
        
        <div className="text-center">
          <IconButton 
            icon={flatIcons.home} 
            onClick={goToToday} 
            variant="primary"
          />
          <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">回到今天</span>
        </div>
      </section>

      {/* 农历信息显示 */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">农历信息</h3>
        
        {/* 紧凑模式 */}
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h4 className="text-md font-medium mb-2">紧凑模式</h4>
          <LunarInfoDisplay lunarData={lunarData} mode="compact" />
        </div>
        
        {/* 详细模式 */}
        <div>
          <h4 className="text-md font-medium mb-2">详细模式</h4>
          <LunarInfoDisplay lunarData={lunarData} mode="detailed" />
        </div>
      </section>

      {/* 特殊日期展示 */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">快速跳转到特殊日期</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* 春节 */}
          <button 
            onClick={() => setSelectedDate(new Date(2024, 1, 10))} // 2024年春节
            className="p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
          >
            <Icon icon={flatIcons.gift} className="mx-auto mb-1" />
            <div className="text-sm font-medium">春节</div>
          </button>
          
          {/* 中秋节 */}
          <button 
            onClick={() => setSelectedDate(new Date(2024, 8, 17))} // 2024年中秋节
            className="p-3 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-lg hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-colors"
          >
            <Icon icon={flatIcons.moon} className="mx-auto mb-1" />
            <div className="text-sm font-medium">中秋节</div>
          </button>
          
          {/* 端午节 */}
          <button 
            onClick={() => setSelectedDate(new Date(2024, 5, 10))} // 2024年端午节
            className="p-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
          >
            <Icon icon={flatIcons.sparkles} className="mx-auto mb-1" />
            <div className="text-sm font-medium">端午节</div>
          </button>
          
          {/* 今天 */}
          <button 
            onClick={goToToday}
            className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
          >
            <Icon icon={flatIcons.calendarDays} className="mx-auto mb-1" />
            <div className="text-sm font-medium">今天</div>
          </button>
        </div>
      </section>

      {/* 农历数据详情 */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">农历数据详情</h3>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
            {JSON.stringify(lunarData, null, 2)}
          </pre>
        </div>
      </section>
    </div>
  )
}

export default LunarExample