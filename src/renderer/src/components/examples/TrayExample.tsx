import React, { useState } from 'react'
import { useTray } from '../../hooks/useTray'
import { Icon, IconButton } from '../ui'
import { flatIcons } from '../../constants/icons'

/**
 * 系统托盘功能演示组件
 * 展示托盘相关功能的使用方法和效果
 */
export const TrayExample: React.FC = (): React.JSX.Element => {
  const {
    state,
    create,
    destroy,
    updateMenu,
    updateTooltip,
    showNotification,
    flash,
    refreshState
  } = useTray()

  const [notificationTitle, setNotificationTitle] = useState('万年历提醒')
  const [notificationContent, setNotificationContent] = useState('今天是个好日子！')
  const [tooltipText, setTooltipText] = useState('万年历 - 农历日历桌面工具')

  const handleCreateTray = async (): Promise<void> => {
    const success = await create()
    if (success) {
      console.log('托盘创建成功')
    }
  }

  const handleDestroyTray = async (): Promise<void> => {
    const success = await destroy()
    if (success) {
      console.log('托盘销毁成功')
    }
  }

  const handleUpdateMenu = async (): Promise<void> => {
    const success = await updateMenu()
    if (success) {
      console.log('托盘菜单更新成功')
    }
  }

  const handleUpdateTooltip = async (): Promise<void> => {
    const success = await updateTooltip(tooltipText)
    if (success) {
      console.log('托盘提示文本更新成功')
    }
  }

  const handleShowNotification = async (): Promise<void> => {
    const success = await showNotification({
      title: notificationTitle,
      content: notificationContent
    })
    if (success) {
      console.log('托盘通知显示成功')
    }
  }

  const handleFlashTray = async (enable: boolean): Promise<void> => {
    const success = await flash(enable)
    if (success) {
      console.log(`托盘闪烁${enable ? '开启' : '关闭'}成功`)
    }
  }

  return (
    <div className="p-6 space-y-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">系统托盘功能演示</h2>

      {/* 托盘状态显示 */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">托盘状态</h3>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-gray-600 dark:text-gray-400">系统支持：</span>
              <div className="flex items-center gap-2 mt-1">
                <Icon
                  icon={state.isSupported ? flatIcons.success : flatIcons.error}
                  size="sm"
                  color={state.isSupported ? 'success' : 'danger'}
                />
                <span
                  className={`text-sm font-medium ${
                    state.isSupported
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {state.isSupported ? '支持' : '不支持'}
                </span>
              </div>
            </div>
            <div>
              <span className="text-sm text-gray-600 dark:text-gray-400">托盘状态：</span>
              <div className="flex items-center gap-2 mt-1">
                <Icon
                  icon={state.isCreated ? flatIcons.success : flatIcons.error}
                  size="sm"
                  color={state.isCreated ? 'success' : 'danger'}
                />
                <span
                  className={`text-sm font-medium ${
                    state.isCreated
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {state.isCreated ? '已创建' : '未创建'}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <IconButton icon={flatIcons.refresh} onClick={refreshState} variant="ghost" size="sm" />
            <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">刷新状态</span>
          </div>
        </div>
      </section>

      {/* 托盘基本操作 */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">托盘基本操作</h3>
        <div className="flex flex-wrap gap-4">
          <IconButton
            icon={flatIcons.plus}
            onClick={handleCreateTray}
            variant="primary"
            disabled={!state.isSupported || state.isCreated}
          />
          <span className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            创建托盘
          </span>

          <IconButton
            icon={flatIcons.trash}
            onClick={handleDestroyTray}
            variant="danger"
            disabled={!state.isCreated}
          />
          <span className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            销毁托盘
          </span>

          <IconButton
            icon={flatIcons.refresh}
            onClick={handleUpdateMenu}
            variant="secondary"
            disabled={!state.isCreated}
          />
          <span className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            更新菜单
          </span>
        </div>
      </section>

      {/* 托盘提示文本 */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">托盘提示文本</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              提示文本：
            </label>
            <input
              type="text"
              value={tooltipText}
              onChange={(e) => setTooltipText(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                       focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="输入托盘提示文本"
            />
          </div>
          <IconButton
            icon={flatIcons.edit}
            onClick={handleUpdateTooltip}
            variant="primary"
            disabled={!state.isCreated}
          />
          <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">更新提示文本</span>
        </div>
      </section>

      {/* 托盘通知 */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">托盘通知</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              通知标题：
            </label>
            <input
              type="text"
              value={notificationTitle}
              onChange={(e) => setNotificationTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                       focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="输入通知标题"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              通知内容：
            </label>
            <textarea
              value={notificationContent}
              onChange={(e) => setNotificationContent(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                       focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="输入通知内容"
            />
          </div>
          <IconButton
            icon={flatIcons.bell}
            onClick={handleShowNotification}
            variant="primary"
            disabled={!state.isCreated}
          />
          <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">显示通知</span>
        </div>
      </section>

      {/* 托盘闪烁 */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          托盘闪烁 (Windows)
        </h3>
        <div className="flex gap-4">
          <IconButton
            icon={flatIcons.sparkles}
            onClick={() => handleFlashTray(true)}
            variant="secondary"
            disabled={!state.isCreated}
          />
          <span className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            开启闪烁
          </span>

          <IconButton
            icon={flatIcons.close}
            onClick={() => handleFlashTray(false)}
            variant="secondary"
            disabled={!state.isCreated}
          />
          <span className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            关闭闪烁
          </span>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          注：托盘闪烁功能主要在 Windows 系统上有效
        </p>
      </section>

      {/* 使用说明 */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">使用说明</h3>
        <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4">
          <div className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
            <p>
              • <strong>左键点击托盘图标</strong>：切换显示/隐藏日历弹出窗口
            </p>
            <p>
              • <strong>双击托盘图标</strong>：显示主窗口
            </p>
            <p>
              • <strong>右键点击托盘图标</strong>：显示上下文菜单
            </p>
            <p>
              • <strong>关闭主窗口</strong>：最小化到系统托盘
            </p>
            <p>
              • <strong>键盘快捷键</strong>：
            </p>
            <div className="ml-4 space-y-1">
              <p>- Ctrl/Cmd + Shift + C：显示日历</p>
              <p>- Ctrl/Cmd + Shift + M：显示主窗口</p>
              <p>- Ctrl/Cmd + Q：退出应用</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default TrayExample
