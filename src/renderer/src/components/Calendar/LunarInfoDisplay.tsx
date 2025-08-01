import React from 'react'
import { LunarData } from '../../hooks/useLunarDate'
import { Icon } from '../ui/Icon'
import { flatIcons } from '../../constants/icons'

interface LunarInfoDisplayProps {
  /** 农历数据 */
  lunarData: LunarData
  /** 显示模式 */
  mode?: 'compact' | 'detailed'
  /** 自定义类名 */
  className?: string
}

/**
 * 农历信息显示组件
 * 用于展示指定日期的详细农历信息
 */
export const LunarInfoDisplay: React.FC<LunarInfoDisplayProps> = ({
  lunarData,
  mode = 'compact',
  className = ''
}): React.JSX.Element => {
  const { lunarDate, lunarMonth, lunarYear, festivals, solarTerms, zodiac } = lunarData

  if (mode === 'compact') {
    return (
      <div className={`text-xs text-lunar-600 dark:text-lunar-400 ${className}`}>
        {festivals.length > 0 ? (
          <span className="text-red-600 dark:text-red-400 font-medium">{festivals[0]}</span>
        ) : solarTerms.length > 0 ? (
          <span className="text-blue-600 dark:text-blue-400 font-medium">{solarTerms[0]}</span>
        ) : (
          lunarDate
        )}
      </div>
    )
  }

  return (
    <div className={`p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg ${className}`}>
      {/* 农历年月日 */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">农历信息</h3>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Icon icon={flatIcons.calendar} size="sm" color="primary" />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {lunarYear} {lunarMonth}
              {lunarDate}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Icon icon={flatIcons.sparkles} size="sm" color="primary" />
            <span className="text-sm text-gray-700 dark:text-gray-300">生肖：{zodiac}</span>
          </div>
        </div>
      </div>

      {/* 节日信息 */}
      {festivals.length > 0 && (
        <div className="mb-4">
          <h4 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-2 flex items-center gap-2">
            <Icon icon={flatIcons.gift} size="sm" color="danger" />
            传统节日
          </h4>
          <div className="space-y-1">
            {festivals.map((festival, index) => (
              <div
                key={index}
                className="inline-block px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs rounded-md mr-2 mb-1"
              >
                {festival}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 节气信息 */}
      {solarTerms.length > 0 && (
        <div>
          <h4 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-2 flex items-center gap-2">
            <Icon icon={flatIcons.sun} size="sm" color="warning" />
            二十四节气
          </h4>
          <div className="space-y-1">
            {solarTerms.map((term, index) => (
              <div
                key={index}
                className="inline-block px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-md mr-2 mb-1"
              >
                {term}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default LunarInfoDisplay
