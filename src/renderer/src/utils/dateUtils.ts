import dayjs from 'dayjs'

/**
 * 获取月份的所有日期（包括前后月份的填充日期）
 * 生成日历网格需要的42个日期（6周 × 7天）
 */
export function getCalendarDates(date: Date): Date[] {
  const currentMonth = dayjs(date)
  const startOfMonth = currentMonth.startOf('month')

  // 获取月初是星期几（0=周日, 1=周一, ...）
  const startWeekday = startOfMonth.day()

  // 计算需要显示的日期范围
  const startDate = startOfMonth.subtract(startWeekday, 'day')

  // 生成42个日期（6周）
  const dates: Date[] = []
  for (let i = 0; i < 42; i++) {
    dates.push(startDate.add(i, 'day').toDate())
  }

  return dates
}

/**
 * 检查日期是否为今天
 */
export function isToday(date: Date): boolean {
  return dayjs(date).isSame(dayjs(), 'day')
}

/**
 * 检查日期是否在当前月份
 */
export function isCurrentMonth(date: Date, currentMonth: Date): boolean {
  return dayjs(date).isSame(dayjs(currentMonth), 'month')
}

/**
 * 检查两个日期是否相同
 */
export function isSameDay(date1: Date | null, date2: Date): boolean {
  if (!date1) return false
  return dayjs(date1).isSame(dayjs(date2), 'day')
}

/**
 * 格式化日期显示
 */
export function formatDate(date: Date, format: string = 'YYYY-MM-DD'): string {
  return dayjs(date).format(format)
}

/**
 * 获取月份名称
 */
export function getMonthName(date: Date): string {
  return dayjs(date).format('YYYY年MM月')
}

/**
 * 获取星期名称数组
 */
export function getWeekDays(): string[] {
  return ['日', '一', '二', '三', '四', '五', '六']
}
