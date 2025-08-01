import React from 'react'
import { LucideIcon } from 'lucide-react'
import { cn } from '@utils/classUtils'
import { Icon, IconProps } from './Icon'

// 按钮变体
const buttonVariants = {
  default: 'bg-white hover:bg-gray-50 border border-gray-200 text-gray-900',
  primary: 'bg-primary-500 hover:bg-primary-600 text-white',
  secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-700',
  ghost: 'hover:bg-gray-100 text-gray-600',
  danger: 'bg-red-500 hover:bg-red-600 text-white'
} as const

// 按钮大小
const buttonSizes = {
  sm: 'p-1.5',
  md: 'p-2',
  lg: 'p-3'
} as const

export interface IconButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  /** 图标组件 */
  icon: LucideIcon
  /** 按钮变体 */
  variant?: keyof typeof buttonVariants
  /** 按钮大小 */
  size?: keyof typeof buttonSizes
  /** 图标大小 */
  iconSize?: IconProps['size']
  /** 是否为圆形 */
  rounded?: boolean
  /** 自定义类名 */
  className?: string
  /** 按钮类型 */
  type?: 'button' | 'submit' | 'reset'
}

/**
 * 图标按钮组件
 * 预设样式的图标按钮，支持多种变体和大小
 */
export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  variant = 'default',
  size = 'md',
  iconSize,
  rounded = true,
  className,
  type = 'button',
  disabled,
  ...props
}): React.JSX.Element => {
  // 根据按钮大小自动设置图标大小
  const defaultIconSize = iconSize || (size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'md')

  const buttonClasses = cn(
    // 基础样式
    'inline-flex items-center justify-center transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',

    // 大小
    buttonSizes[size],

    // 形状
    rounded ? 'rounded-md' : '',

    // 变体样式
    buttonVariants[variant],

    // 禁用状态
    disabled && 'opacity-50 cursor-not-allowed',

    // 深色模式
    'dark:focus:ring-offset-gray-900',

    className
  )

  return (
    <button type={type} className={buttonClasses} disabled={disabled} {...props}>
      <Icon
        icon={icon}
        size={defaultIconSize}
        color={variant === 'primary' || variant === 'danger' ? 'default' : undefined}
        className={variant === 'primary' || variant === 'danger' ? 'text-white' : undefined}
      />
    </button>
  )
}

export default IconButton
