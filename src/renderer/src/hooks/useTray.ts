import { useState, useCallback, useEffect } from 'react'

/**
 * 托盘状态接口
 */
export interface TrayState {
  isCreated: boolean
  isSupported: boolean
}

/**
 * 系统托盘管理Hook
 */
export function useTray(): {
  state: TrayState
  create: () => Promise<boolean>
  destroy: () => Promise<boolean>
  updateMenu: () => Promise<boolean>
  updateTooltip: (text: string) => Promise<boolean>
  showNotification: (options: { title: string; content: string; icon?: string }) => Promise<boolean>
  flash: (enable?: boolean) => Promise<boolean>
  refreshState: () => Promise<void>
} {
  const [state, setState] = useState<TrayState>({
    isCreated: false,
    isSupported: false
  })

  // 刷新托盘状态
  const refreshState = useCallback(async (): Promise<void> => {
    try {
      const [supportResult, stateResult] = await Promise.all([
        window.api.tray.isSupported(),
        window.api.tray.getState()
      ])

      setState({
        isSupported: supportResult.success ? supportResult.supported || false : false,
        isCreated: stateResult.success ? stateResult.isCreated || false : false
      })
    } catch (error) {
      console.error('获取托盘状态失败:', error)
    }
  }, [])

  // 创建托盘
  const create = useCallback(async (): Promise<boolean> => {
    try {
      const result = await window.api.tray.create()
      if (result.success) {
        await refreshState()
        return true
      }
      console.error('创建托盘失败:', result.error)
      return false
    } catch (error) {
      console.error('创建托盘失败:', error)
      return false
    }
  }, [refreshState])

  // 销毁托盘
  const destroy = useCallback(async (): Promise<boolean> => {
    try {
      const result = await window.api.tray.destroy()
      if (result.success) {
        await refreshState()
        return true
      }
      console.error('销毁托盘失败:', result.error)
      return false
    } catch (error) {
      console.error('销毁托盘失败:', error)
      return false
    }
  }, [refreshState])

  // 更新托盘菜单
  const updateMenu = useCallback(async (): Promise<boolean> => {
    try {
      const result = await window.api.tray.updateMenu()
      if (result.success) {
        return true
      }
      console.error('更新托盘菜单失败:', result.error)
      return false
    } catch (error) {
      console.error('更新托盘菜单失败:', error)
      return false
    }
  }, [])

  // 更新托盘提示文本
  const updateTooltip = useCallback(async (text: string): Promise<boolean> => {
    try {
      const result = await window.api.tray.updateTooltip(text)
      if (result.success) {
        return true
      }
      console.error('更新托盘提示文本失败:', result.error)
      return false
    } catch (error) {
      console.error('更新托盘提示文本失败:', error)
      return false
    }
  }, [])

  // 显示托盘通知
  const showNotification = useCallback(
    async (options: { title: string; content: string; icon?: string }): Promise<boolean> => {
      try {
        const result = await window.api.tray.showBalloon(options)
        if (result.success) {
          return true
        }
        console.error('显示托盘通知失败:', result.error)
        return false
      } catch (error) {
        console.error('显示托盘通知失败:', error)
        return false
      }
    },
    []
  )

  // 设置托盘闪烁
  const flash = useCallback(async (enable: boolean = true): Promise<boolean> => {
    try {
      const result = await window.api.tray.flash(enable)
      if (result.success) {
        return true
      }
      console.error('设置托盘闪烁失败:', result.error)
      return false
    } catch (error) {
      console.error('设置托盘闪烁失败:', error)
      return false
    }
  }, [])

  // 组件挂载时获取初始状态
  useEffect(() => {
    refreshState()
  }, [refreshState])

  return {
    state,
    create,
    destroy,
    updateMenu,
    updateTooltip,
    showNotification,
    flash,
    refreshState
  }
}
