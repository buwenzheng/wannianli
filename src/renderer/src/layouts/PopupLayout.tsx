import React from 'react'
import { Icon, IconButton } from '../components/ui'
import { flatIcons } from '../constants/icons'
import { usePopupWindow } from '../hooks/useWindow'

interface PopupLayoutProps {
  /** 子组件 */
  children: React.ReactNode
  /** 标题 */
  title?: string
  /** 是否显示关闭按钮 */
  showCloseButton?: boolean
  /** 自定义类名 */
  className?: string
}

/**
 * 弹出窗口布局组件
 * 提供弹出窗口的统一布局和标题栏
 */
export const PopupLayout: React.FC<PopupLayoutProps> = ({
  children,
  title = '万年历',
  showCloseButton = true,
  className = ''
}): React.JSX.Element => {
  const { close } = usePopupWindow()

  const handleClose = async (): Promise<void> => {
    await close()
  }

  return (
    <div
      className={`h-full flex flex-col bg-white dark:bg-gray-900 shadow-xl rounded-lg overflow-hidden ${className}`}
    >
      {/* 标题栏 */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 select-none">
        {/* 应用图标和标题 */}
        <div className="flex items-center gap-2">
          <Icon icon={flatIcons.calendar} size="sm" color="primary" />
          <h1 className="text-sm font-medium text-gray-900 dark:text-gray-100">{title}</h1>
        </div>

        {/* 窗口控制按钮 */}
        {showCloseButton && (
          <div className="flex items-center gap-1">
            <IconButton
              icon={flatIcons.close}
              size="sm"
              variant="ghost"
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              title="关闭"
            />
          </div>
        )}
      </div>

      {/* 主内容区域 */}
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  )
}

export default PopupLayout
