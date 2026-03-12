import { type ClassValue, clsx } from 'clsx';

/**
 * 合并 Tailwind CSS 类名
 */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}
