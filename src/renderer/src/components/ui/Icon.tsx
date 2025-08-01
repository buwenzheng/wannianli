import React from 'react'
import { LucideIcon, LucideProps } from 'lucide-react'
import { cn } from '@utils/classUtils'

// 图标大小预设
const iconSizes = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8'
} as const

// 图标颜色预设
const iconColors = {
  default: 'text-gray-600 dark:text-gray-400',
  primary: 'text-primary-600 dark:text-primary-400',
  secondary: 'text-gray-500 dark:text-gray-500',
  success: 'text-green-600 dark:text-green-400',
  warning: 'text-yellow-600 dark:text-yellow-400',
  danger: 'text-red-600 dark:text-red-400',
  muted: 'text-gray-400 dark:text-gray-600'
} as const

export interface IconProps extends Omit<LucideProps, 'size'> {
  /** 图标组件 */
  icon: LucideIcon
  /** 图标大小 */
  size?: keyof typeof iconSizes
  /** 图标颜色 */
  color?: keyof typeof iconColors
  /** 自定义类名 */
  className?: string
  /** 是否可点击 */
  clickable?: boolean
}

/**
 * 统一的图标组件
 * 支持预设大小、颜色和Tailwind CSS类名
 */
export const Icon: React.FC<IconProps> = ({
  icon: IconComponent,
  size = 'md',
  color = 'default',
  className,
  clickable = false,
  ...props
}): React.JSX.Element => {
  const baseClasses = cn(
    iconSizes[size],
    iconColors[color],
    clickable && 'cursor-pointer hover:opacity-75 transition-opacity',
    className
  )

  return <IconComponent className={baseClasses} {...props} />
}

export default Icon
