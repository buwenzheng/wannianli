import { useState, useEffect } from 'react'
import { Lunar } from 'lunar-javascript'

export interface LunarData {
  /** 农历日期显示 (如: 初一、初二、十五) */
  lunarDate: string
  /** 农历月份 (如: 正月、二月) */
  lunarMonth: string
  /** 农历年份 (如: 甲子年[鼠]) */
  lunarYear: string
  /** 节日列表 */
  festivals: string[]
  /** 节气列表 */
  solarTerms: string[]
  /** 生肖 */
  zodiac: string
  /** 干支纪年 */
  yearGanZhi: string
  /** 干支纪月 */
  monthGanZhi: string
  /** 干支纪日 */
  dayGanZhi: string
}

export interface UseLunarDateOptions {
  /** 是否启用农历计算，默认true */
  enabled?: boolean
}

/**
 * 农历日期计算Hook
 * 基于lunar-javascript库计算指定日期的农历信息
 *
 * @param date 目标日期
 * @param options 配置选项
 * @returns 农历数据对象
 */
export function useLunarDate(date: Date, options: UseLunarDateOptions = {}): LunarData {
  const { enabled = true } = options

  const [lunarData, setLunarData] = useState<LunarData>({
    lunarDate: '',
    lunarMonth: '',
    lunarYear: '',
    festivals: [],
    solarTerms: [],
    zodiac: '',
    yearGanZhi: '',
    monthGanZhi: '',
    dayGanZhi: ''
  })

  useEffect(() => {
    if (!enabled) {
      return
    }

    const calculateLunar = (): void => {
      try {
        const lunar = Lunar.fromDate(date)

        setLunarData({
          lunarDate: lunar.getDayInChinese(),
          lunarMonth: lunar.getMonthInChinese(),
          lunarYear: `${lunar.getYearInGanZhi()}年[${lunar.getYearShengXiao()}]`,
          festivals: lunar.getFestivals(),
          solarTerms: lunar.getJieQi(),
          zodiac: lunar.getYearShengXiao(),
          yearGanZhi: lunar.getYearInGanZhi(),
          monthGanZhi: lunar.getMonthInGanZhi(),
          dayGanZhi: lunar.getDayInGanZhi()
        })
      } catch (error) {
        console.error('农历计算错误:', error)
        // 发生错误时使用空数据
        setLunarData({
          lunarDate: '',
          lunarMonth: '',
          lunarYear: '',
          festivals: [],
          solarTerms: [],
          zodiac: '',
          yearGanZhi: '',
          monthGanZhi: '',
          dayGanZhi: ''
        })
      }
    }

    calculateLunar()
  }, [date, enabled])

  return lunarData
}

export default useLunarDate
