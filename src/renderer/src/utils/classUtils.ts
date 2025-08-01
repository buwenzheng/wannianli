import { clsx, type ClassValue } from 'clsx'

/**
 * 合并CSS类名的工具函数
 * 支持条件类名和样式覆盖
 */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs)
}

/**
 * 创建CSS模块类名绑定器
 */
export function createClassNameBinder(styles: Record<string, string>) {
  return (...classNames: ClassValue[]) => {
    return cn(
      classNames.map((className) =>
        typeof className === 'string' ? styles[className] || className : className
      )
    )
  }
}
