import React from 'react'
import { Icon, IconButton } from '@components/ui'
import { flatIcons } from '@renderer/constants/icons'

/**
 * 图标使用示例组件
 * 展示各种图标的使用方法和效果
 */
export const IconExample: React.FC = (): React.JSX.Element => {
  return (
    <div className="p-6 space-y-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">图标使用示例</h2>

      {/* 基础图标 */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">基础图标</h3>
        <div className="flex items-center gap-4 flex-wrap">
          <Icon icon={flatIcons.calendar} size="xs" />
          <Icon icon={flatIcons.calendar} size="sm" />
          <Icon icon={flatIcons.calendar} size="md" />
          <Icon icon={flatIcons.calendar} size="lg" />
          <Icon icon={flatIcons.calendar} size="xl" />
        </div>
      </section>

      {/* 颜色变体 */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">颜色变体</h3>
        <div className="flex items-center gap-4 flex-wrap">
          <Icon icon={flatIcons.star} color="default" />
          <Icon icon={flatIcons.star} color="primary" />
          <Icon icon={flatIcons.star} color="success" />
          <Icon icon={flatIcons.star} color="warning" />
          <Icon icon={flatIcons.star} color="danger" />
          <Icon icon={flatIcons.star} color="muted" />
        </div>
      </section>

      {/* 图标按钮 */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">图标按钮</h3>
        <div className="flex items-center gap-4 flex-wrap">
          <IconButton icon={flatIcons.plus} variant="primary" />
          <IconButton icon={flatIcons.edit} variant="secondary" />
          <IconButton icon={flatIcons.trash} variant="danger" />
          <IconButton icon={flatIcons.settings} variant="ghost" />
        </div>
      </section>

      {/* 按钮大小 */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">按钮大小</h3>
        <div className="flex items-center gap-4">
          <IconButton icon={flatIcons.home} size="sm" />
          <IconButton icon={flatIcons.home} size="md" />
          <IconButton icon={flatIcons.home} size="lg" />
        </div>
      </section>

      {/* 日历相关图标 */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">日历相关图标</h3>
        <div className="grid grid-cols-6 gap-4">
          <div className="flex flex-col items-center gap-2">
            <Icon icon={flatIcons.calendarDays} size="lg" color="primary" />
            <span className="text-xs text-gray-600">日历</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon icon={flatIcons.clock} size="lg" color="primary" />
            <span className="text-xs text-gray-600">时间</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon icon={flatIcons.bell} size="lg" color="primary" />
            <span className="text-xs text-gray-600">提醒</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon icon={flatIcons.moon} size="lg" color="primary" />
            <span className="text-xs text-gray-600">农历</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon icon={flatIcons.gift} size="lg" color="primary" />
            <span className="text-xs text-gray-600">节日</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon icon={flatIcons.sparkles} size="lg" color="primary" />
            <span className="text-xs text-gray-600">特殊</span>
          </div>
        </div>
      </section>

      {/* 交互示例 */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">交互示例</h3>
        <div className="flex items-center gap-4">
          <IconButton
            icon={flatIcons.refresh}
            variant="ghost"
            onClick={() => alert('刷新!')}
            title="刷新数据"
          />
          <IconButton
            icon={flatIcons.download}
            variant="secondary"
            onClick={() => alert('下载!')}
            title="下载"
          />
          <IconButton
            icon={flatIcons.upload}
            variant="primary"
            onClick={() => alert('上传!')}
            title="上传"
          />
        </div>
      </section>
    </div>
  )
}

export default IconExample
