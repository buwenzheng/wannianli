/**
 * 获取日历日期列表（包含上月和下月的填充日期）
 * @param weekStartsOn 0=周日开始, 1=周一开始
 */
export function getCalendarDates(currentMonth: Date, weekStartsOn: 0 | 1 = 0): Date[] {
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  // 当月第一天
  const firstDayOfMonth = new Date(year, month, 1);
  // 当月最后一天
  const lastDayOfMonth = new Date(year, month + 1, 0);

  // 获取当月第一天是星期几（0=周日, 1=周一...）
  const firstDayWeekday = firstDayOfMonth.getDay();

  // 计算需要显示的上月日期数
  const prevMonthDays = (firstDayWeekday - weekStartsOn + 7) % 7;

  const dates: Date[] = [];

  // 添加上月的日期
  const prevMonth = new Date(year, month, 0);
  for (let i = prevMonthDays - 1; i >= 0; i--) {
    dates.push(new Date(prevMonth.getFullYear(), prevMonth.getMonth(), prevMonth.getDate() - i));
  }

  // 添加当月的日期
  for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
    dates.push(new Date(year, month, i));
  }

  // 添加下月的日期（补齐 42 格 = 6 行 x 7 列）
  const remainingDays = 42 - dates.length;
  for (let i = 1; i <= remainingDays; i++) {
    dates.push(new Date(year, month + 1, i));
  }

  return dates;
}

/**
 * 检查是否为今天
 */
export function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

/**
 * 检查是否在当前月份
 */
export function isCurrentMonth(date: Date, currentMonth: Date): boolean {
  return (
    date.getFullYear() === currentMonth.getFullYear() &&
    date.getMonth() === currentMonth.getMonth()
  );
}

/**
 * 检查两个日期是否为同一天
 */
export function isSameDay(date1: Date | null, date2: Date | null): boolean {
  if (!date1 || !date2) return false;
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

/**
 * 格式化日期为 YYYY-MM-DD
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
