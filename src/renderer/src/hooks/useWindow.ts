import { useState, useCallback, useEffect } from 'react'

/**
 * 窗口状态接口
 */
export interface WindowState {
  isOpen: boolean
  isVisible: boolean
  isFocused: boolean
  isMinimized?: boolean
  isMaximized?: boolean
}

/**
 * 弹出窗口状态Hook
 */
export function usePopupWindow(): {
  state: WindowState
  show: () => Promise<boolean>
  hide: () => Promise<boolean>
  toggle: () => Promise<boolean>
  close: () => Promise<boolean>
  setPosition: (x: number, y: number) => Promise<boolean>
  refreshState: () => Promise<void>
} {
  const [state, setState] = useState<WindowState>({
    isOpen: false,
    isVisible: false,
    isFocused: false
  })

  // 刷新窗口状态
  const refreshState = useCallback(async (): Promise<void> => {
    try {
      const result = await window.api.window.getPopupState()
      if (result.success) {
        setState({
          isOpen: result.isOpen || false,
          isVisible: result.isVisible || false,
          isFocused: result.isFocused || false
        })
      }
    } catch (error) {
      console.error('获取弹出窗口状态失败:', error)
    }
  }, [])

  // 显示弹出窗口
  const show = useCallback(async (): Promise<boolean> => {
    try {
      const result = await window.api.window.showCalendarPopup()
      if (result.success) {
        await refreshState()
        return true
      }
      console.error('显示弹出窗口失败:', result.error)
      return false
    } catch (error) {
      console.error('显示弹出窗口失败:', error)
      return false
    }
  }, [refreshState])

  // 隐藏弹出窗口
  const hide = useCallback(async (): Promise<boolean> => {
    try {
      const result = await window.api.window.hideCalendarPopup()
      if (result.success) {
        await refreshState()
        return true
      }
      console.error('隐藏弹出窗口失败:', result.error)
      return false
    } catch (error) {
      console.error('隐藏弹出窗口失败:', error)
      return false
    }
  }, [refreshState])

  // 切换弹出窗口显示状态
  const toggle = useCallback(async (): Promise<boolean> => {
    try {
      const result = await window.api.window.toggleCalendarPopup()
      if (result.success) {
        await refreshState()
        return true
      }
      console.error('切换弹出窗口失败:', result.error)
      return false
    } catch (error) {
      console.error('切换弹出窗口失败:', error)
      return false
    }
  }, [refreshState])

  // 关闭弹出窗口
  const close = useCallback(async (): Promise<boolean> => {
    try {
      const result = await window.api.window.closeCalendarPopup()
      if (result.success) {
        await refreshState()
        return true
      }
      console.error('关闭弹出窗口失败:', result.error)
      return false
    } catch (error) {
      console.error('关闭弹出窗口失败:', error)
      return false
    }
  }, [refreshState])

  // 设置弹出窗口位置
  const setPosition = useCallback(async (x: number, y: number): Promise<boolean> => {
    try {
      const result = await window.api.window.setPopupPosition(x, y)
      if (result.success) {
        return true
      }
      console.error('设置弹出窗口位置失败:', result.error)
      return false
    } catch (error) {
      console.error('设置弹出窗口位置失败:', error)
      return false
    }
  }, [])

  // 组件挂载时获取初始状态
  useEffect(() => {
    refreshState()
  }, [refreshState])

  return {
    state,
    show,
    hide,
    toggle,
    close,
    setPosition,
    refreshState
  }
}

/**
 * 主窗口状态Hook
 */
export function useMainWindow(): {
  state: WindowState
  minimize: () => Promise<boolean>
  maximize: () => Promise<boolean>
  close: () => Promise<boolean>
  refreshState: () => Promise<void>
} {
  const [state, setState] = useState<WindowState>({
    isOpen: false,
    isVisible: false,
    isFocused: false,
    isMinimized: false,
    isMaximized: false
  })

  // 刷新窗口状态
  const refreshState = useCallback(async (): Promise<void> => {
    try {
      const result = await window.api.window.getMainWindowState()
      if (result.success) {
        setState({
          isOpen: result.isOpen || false,
          isVisible: result.isVisible || false,
          isFocused: result.isFocused || false,
          isMinimized: result.isMinimized || false,
          isMaximized: result.isMaximized || false
        })
      }
    } catch (error) {
      console.error('获取主窗口状态失败:', error)
    }
  }, [])

  // 最小化主窗口
  const minimize = useCallback(async (): Promise<boolean> => {
    try {
      const result = await window.api.window.minimizeMain()
      if (result.success) {
        await refreshState()
        return true
      }
      console.error('最小化主窗口失败:', result.error)
      return false
    } catch (error) {
      console.error('最小化主窗口失败:', error)
      return false
    }
  }, [refreshState])

  // 最大化/还原主窗口
  const maximize = useCallback(async (): Promise<boolean> => {
    try {
      const result = await window.api.window.maximizeMain()
      if (result.success) {
        await refreshState()
        return true
      }
      console.error('最大化主窗口失败:', result.error)
      return false
    } catch (error) {
      console.error('最大化主窗口失败:', error)
      return false
    }
  }, [refreshState])

  // 关闭主窗口
  const close = useCallback(async (): Promise<boolean> => {
    try {
      const result = await window.api.window.closeMain()
      if (result.success) {
        await refreshState()
        return true
      }
      console.error('关闭主窗口失败:', result.error)
      return false
    } catch (error) {
      console.error('关闭主窗口失败:', error)
      return false
    }
  }, [refreshState])

  // 组件挂载时获取初始状态
  useEffect(() => {
    refreshState()
  }, [refreshState])

  return {
    state,
    minimize,
    maximize,
    close,
    refreshState
  }
}
