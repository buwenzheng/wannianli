import React from 'react'
import Calendar from './Calendar'
import { PopupLayout } from '../../layouts/PopupLayout'
import { useCalendar } from '../../hooks/useCalendar'
import dayjs from 'dayjs'

/**
 * 弹出窗口专用的日历组件
 * 针对小窗口优化的紧凑布局
 */
export const PopupCalendar: React.FC = (): React.JSX.Element => {
  const { currentMonth, selectedDate, selectDate } = useCalendar({
    showLunar: true
  })

  const handleDateSelect = (date: Date): void => {
    selectDate(date)
  }

  return (
    <PopupLayout title="万年历" className="w-full h-full">
      <div className="p-4 h-full flex flex-col">
        {/* 日历组件 */}
        <div className="flex-1">
          <Calendar
            currentDate={currentMonth}
            onDateSelect={handleDateSelect}
            onMonthChange={() => {
              /* 处理月份变化 */
            }}
            showLunar={true}
            events={[]}
          />
        </div>

        {/* 底部信息 */}
        {selectedDate && (
          <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {dayjs(selectedDate).format('YYYY年MM月DD日')}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                星期{['日', '一', '二', '三', '四', '五', '六'][selectedDate.getDay()]}
              </div>
            </div>
          </div>
        )}
      </div>
    </PopupLayout>
  )
}

export default PopupCalendar
