import React from 'react'
import { cn } from '@utils/classUtils'

interface NavigationButtonProps {
  title: string
  onClick: () => void
  children: React.ReactNode
  className?: string
}

/**
 * 可复用的导航按钮组件
 */
export const NavigationButton: React.FC<NavigationButtonProps> = React.memo(({
  title,
  onClick,
  children,
  className
}) => {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={cn(
        'p-1 rounded-md hover:bg-black/10 transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-blue-500/50',
        className
      )}
      aria-label={title}
    >
      {children}
    </button>
  )
})

NavigationButton.displayName = 'NavigationButton'