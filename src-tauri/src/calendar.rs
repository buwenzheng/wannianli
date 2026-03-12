use chrono::{Datelike, NaiveDate, Weekday};
use serde::{Deserialize, Serialize};

// ==================== Data Types ====================

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct LunarInfo {
    pub lunar_year: String,
    pub lunar_month: String,
    pub lunar_day: String,
    pub gan_zhi_year: String,
    pub gan_zhi_month: String,
    pub gan_zhi_day: String,
    pub zodiac: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct HolidayInfo {
    pub is_holiday: bool,
    pub is_workday: bool,
    pub holiday_name: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DayCalendarData {
    pub year: i32,
    pub month: u32,
    pub day: u32,
    pub lunar_info: LunarInfo,
    pub holiday_info: HolidayInfo,
    pub festivals: Vec<String>,
    pub solar_terms: Vec<String>,
}

struct LunarDate {
    year: i32,
    month: u32,
    day: u32,
    is_leap: bool,
}

// ==================== Lunar Data Table (1900-2100) ====================
// Encoding per entry:
//   Bits 0-3:  Leap month number (0 = none)
//   Bits 4-15: Month 1-12 size; bit (16-m) → 1=30d, 0=29d
//   Bit  16:   Leap month size; 1=30d, 0=29d

#[rustfmt::skip]
const LUNAR_INFO: &[u32] = &[
    0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2, // 1900
    0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977, // 1910
    0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970, // 1920
    0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950, // 1930
    0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557, // 1940
    0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5b0, 0x14573, 0x052b0, 0x0a9a8, 0x0e950, 0x06aa0, // 1950
    0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0, // 1960
    0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b6a0, 0x195a6, // 1970
    0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570, // 1980
    0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x05ac0, 0x0ab60, 0x096d5, 0x092e0, // 1990
    0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5, // 2000
    0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930, // 2010
    0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530, // 2020
    0x05aa0, 0x076a3, 0x096d0, 0x04afb, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45, // 2030
    0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0, // 2040
    0x14b63, 0x09370, 0x049f8, 0x04970, 0x064b0, 0x168a6, 0x0ea50, 0x06b20, 0x1a6c4, 0x0aae0, // 2050
    0x092e0, 0x0d2e3, 0x0c960, 0x0d557, 0x0d4a0, 0x0da50, 0x05d55, 0x056a0, 0x0a6d0, 0x055d4, // 2060
    0x052d0, 0x0a9b8, 0x0a950, 0x0b4a0, 0x0b6a6, 0x0ad50, 0x055a0, 0x0aba4, 0x0a5b0, 0x052b0, // 2070
    0x0b273, 0x06930, 0x07337, 0x06aa0, 0x0ad50, 0x14b55, 0x04b60, 0x0a570, 0x054e4, 0x0d160, // 2080
    0x0e968, 0x0d520, 0x0daa0, 0x16aa6, 0x056d0, 0x04ae0, 0x0a9d4, 0x0a4d0, 0x0d150, 0x0f252, // 2090
    0x0d520,                                                                                      // 2100
];

const BASE_YEAR: i32 = 1900;

const GAN: &[&str] = &["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
const ZHI: &[&str] = &["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
const ZODIAC: &[&str] = &["鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪"];

const LUNAR_MONTHS: &[&str] = &[
    "正月", "二月", "三月", "四月", "五月", "六月",
    "七月", "八月", "九月", "十月", "冬月", "腊月",
];
const LUNAR_DAYS: &[&str] = &[
    "初一", "初二", "初三", "初四", "初五", "初六", "初七", "初八", "初九", "初十",
    "十一", "十二", "十三", "十四", "十五", "十六", "十七", "十八", "十九", "二十",
    "廿一", "廿二", "廿三", "廿四", "廿五", "廿六", "廿七", "廿八", "廿九", "三十",
];

// ==================== Lunar Helpers ====================

fn leap_month(yi: usize) -> u32 {
    LUNAR_INFO[yi] & 0xf
}

fn month_days(yi: usize, m: u32) -> u32 {
    if LUNAR_INFO[yi] & (0x10000 >> m) != 0 { 30 } else { 29 }
}

fn leap_month_days(yi: usize) -> u32 {
    if LUNAR_INFO[yi] & 0x10000 != 0 { 30 } else { 29 }
}

fn year_total_days(yi: usize) -> u32 {
    let mut d = 0u32;
    for m in 1..=12 {
        d += month_days(yi, m);
    }
    if leap_month(yi) > 0 {
        d += leap_month_days(yi);
    }
    d
}

fn solar_to_lunar(year: i32, month: u32, day: u32) -> Result<LunarDate, String> {
    let base = NaiveDate::from_ymd_opt(1900, 1, 31).unwrap();
    let target = NaiveDate::from_ymd_opt(year, month, day).ok_or("Invalid date")?;
    let diff = (target - base).num_days();
    if diff < 0 {
        return Err("Date before 1900-01-31 not supported".into());
    }
    let mut offset = diff as u32;

    let mut ly = BASE_YEAR;
    let mut yi = 0usize;
    while yi < LUNAR_INFO.len() {
        let yd = year_total_days(yi);
        if offset < yd {
            break;
        }
        offset -= yd;
        ly += 1;
        yi += 1;
    }
    if yi >= LUNAR_INFO.len() {
        return Err("Date out of range (1900-2100)".into());
    }

    let lp = leap_month(yi);
    let mut lm = 0u32;
    let mut is_leap = false;

    for m in 1..=12u32 {
        let md = month_days(yi, m);
        if offset < md {
            lm = m;
            break;
        }
        offset -= md;

        if lp > 0 && m == lp {
            let ld = leap_month_days(yi);
            if offset < ld {
                lm = m;
                is_leap = true;
                break;
            }
            offset -= ld;
        }
    }
    if lm == 0 {
        lm = 12;
    }

    Ok(LunarDate { year: ly, month: lm, day: offset + 1, is_leap })
}

// ==================== Gan-Zhi ====================

fn year_gan_zhi(y: i32) -> (usize, usize) {
    let o = ((y - 4) % 60 + 60) as usize % 60;
    (o % 10, o % 12)
}

fn month_gan_zhi(y: i32, m: u32) -> (usize, usize) {
    let ys = ((y - 4) % 10 + 10) as usize % 10;
    let first = (ys % 5) * 2 + 2;
    let stem = (first + m as usize - 1) % 10;
    let branch = (m as usize + 1) % 12;
    (stem, branch)
}

fn day_gan_zhi(y: i32, m: u32, d: u32) -> (usize, usize) {
    let base = NaiveDate::from_ymd_opt(1900, 1, 31).unwrap();
    let target = NaiveDate::from_ymd_opt(y, m, d).unwrap();
    let off = (target - base).num_days();
    // 1900-01-31 = 甲辰日 (stem=0, branch=4)
    let stem = ((off % 10 + 10) % 10) as usize;
    let branch = (((off + 4) % 12 + 12) % 12) as usize;
    (stem, branch)
}

// ==================== Solar Terms ====================

const TERM_NAMES: &[&str] = &[
    "小寒", "大寒", "立春", "雨水", "惊蛰", "春分",
    "清明", "谷雨", "立夏", "小满", "芒种", "夏至",
    "小暑", "大暑", "立秋", "处暑", "白露", "秋分",
    "寒露", "霜降", "立冬", "小雪", "大雪", "冬至",
];

const TERM_MONTH: &[u32] = &[
    1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6,
    7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12,
];

// Century constants (21st century 2000-2099)
#[rustfmt::skip]
const C21: &[f64] = &[
    5.4055, 20.12,  3.87,   18.73,  5.63,   20.646,
    4.81,   20.1,   5.52,   21.04,  5.678,  21.37,
    7.108,  22.83,  7.5,    23.13,  7.646,  23.042,
    8.318,  23.438, 7.438,  22.36,  7.18,   21.94,
];

// Century constants (20th century 1900-1999)
#[rustfmt::skip]
const C20: &[f64] = &[
    6.11,  20.84,  4.15,   19.04,  6.11,   20.84,
    5.59,  20.888, 6.318,  21.86,  6.5,    22.2,
    7.928, 23.65,  8.35,   23.95,  8.44,   23.822,
    9.098, 24.218, 8.218,  23.08,  7.9,    22.6,
];

fn solar_term_day(year: i32, idx: usize) -> u32 {
    let (y, c) = if year >= 2000 {
        ((year - 2000) as f64, C21[idx])
    } else {
        ((year - 1900) as f64, C20[idx])
    };
    let raw = (y * 0.2422 + c).floor() as i32;
    let leap_fix = if y >= 1.0 { (y as i32 - 1) / 4 } else { 0 };
    (raw - leap_fix) as u32
}

fn solar_terms_on(year: i32, month: u32, day: u32) -> Vec<String> {
    let mut out = Vec::new();
    for (i, &tm) in TERM_MONTH.iter().enumerate() {
        if tm == month && solar_term_day(year, i) == day {
            out.push(TERM_NAMES[i].to_string());
        }
    }
    out
}

// ==================== Festivals ====================

fn solar_festivals(m: u32, d: u32) -> Vec<String> {
    let mut f = Vec::new();
    match (m, d) {
        (1, 1) => f.push("元旦".into()),
        (2, 14) => f.push("情人节".into()),
        (3, 8) => f.push("妇女节".into()),
        (3, 12) => f.push("植树节".into()),
        (5, 1) => f.push("劳动节".into()),
        (5, 4) => f.push("青年节".into()),
        (6, 1) => f.push("儿童节".into()),
        (7, 1) => f.push("建党节".into()),
        (8, 1) => f.push("建军节".into()),
        (9, 10) => f.push("教师节".into()),
        (10, 1) => f.push("国庆节".into()),
        (12, 25) => f.push("圣诞节".into()),
        _ => {}
    }
    f
}

fn lunar_festivals(ld: &LunarDate, yi: usize) -> Vec<String> {
    if ld.is_leap {
        return vec![];
    }
    let mut f = Vec::new();
    match (ld.month, ld.day) {
        (1, 1) => f.push("春节".into()),
        (1, 15) => f.push("元宵节".into()),
        (5, 5) => f.push("端午节".into()),
        (7, 7) => f.push("七夕节".into()),
        (7, 15) => f.push("中元节".into()),
        (8, 15) => f.push("中秋节".into()),
        (9, 9) => f.push("重阳节".into()),
        _ => {}
    }
    if ld.month == 12 && ld.day == month_days(yi, 12) {
        f.push("除夕".into());
    }
    f
}

fn term_festivals(year: i32, month: u32, day: u32) -> Vec<String> {
    let mut f = Vec::new();
    if month == 4 {
        let idx = 6; // 清明 index
        if solar_term_day(year, idx) == day {
            f.push("清明节".into());
        }
    }
    f
}

// ==================== Statutory Holidays ====================

struct HolidayRange {
    name: &'static str,
    start: (u32, u32),
    end: (u32, u32),
}

fn statutory_holidays(year: i32) -> (Vec<HolidayRange>, Vec<(u32, u32)>) {
    match year {
        2025 => (
            vec![
                HolidayRange { name: "元旦", start: (1, 1), end: (1, 1) },
                HolidayRange { name: "春节", start: (1, 28), end: (2, 4) },
                HolidayRange { name: "清明", start: (4, 4), end: (4, 6) },
                HolidayRange { name: "劳动节", start: (5, 1), end: (5, 5) },
                HolidayRange { name: "端午", start: (5, 31), end: (6, 2) },
                HolidayRange { name: "国庆+中秋", start: (10, 1), end: (10, 8) },
            ],
            vec![(1, 26), (2, 8), (4, 27), (9, 28), (10, 11)],
        ),
        _ => (vec![], vec![]),
    }
}

fn in_holiday_range(ranges: &[HolidayRange], m: u32, d: u32) -> Option<&str> {
    for h in ranges {
        let after_start = m > h.start.0 || (m == h.start.0 && d >= h.start.1);
        let before_end = m < h.end.0 || (m == h.end.0 && d <= h.end.1);
        if after_start && before_end {
            return Some(h.name);
        }
    }
    None
}

fn is_adjusted_workday(workdays: &[(u32, u32)], m: u32, d: u32) -> bool {
    workdays.iter().any(|&(wm, wd)| wm == m && wd == d)
}

// ==================== Public API ====================

pub fn get_lunar_info(year: i32, month: u32, day: u32) -> Result<LunarInfo, String> {
    let ld = solar_to_lunar(year, month, day)?;
    let (ys, yb) = year_gan_zhi(ld.year);
    let (ms, mb) = month_gan_zhi(year, month);
    let (ds, db) = day_gan_zhi(year, month, day);

    let month_name = if ld.is_leap {
        format!("闰{}", LUNAR_MONTHS[(ld.month - 1) as usize])
    } else {
        LUNAR_MONTHS[(ld.month - 1) as usize].to_string()
    };

    Ok(LunarInfo {
        lunar_year: format!("{}年", ld.year),
        lunar_month: month_name,
        lunar_day: LUNAR_DAYS[(ld.day - 1) as usize].to_string(),
        gan_zhi_year: format!("{}{}", GAN[ys], ZHI[yb]),
        gan_zhi_month: format!("{}{}", GAN[ms], ZHI[mb]),
        gan_zhi_day: format!("{}{}", GAN[ds], ZHI[db]),
        zodiac: ZODIAC[yb].to_string(),
    })
}

pub fn get_festivals(year: i32, month: u32, day: u32) -> Result<Vec<String>, String> {
    let mut all = solar_festivals(month, day);
    let ld = solar_to_lunar(year, month, day)?;
    let yi = (ld.year - BASE_YEAR) as usize;
    all.extend(lunar_festivals(&ld, yi));
    all.extend(term_festivals(year, month, day));
    Ok(all)
}

pub fn get_solar_terms(year: i32, _month: u32, day: u32) -> Result<Vec<String>, String> {
    Ok(solar_terms_on(year, _month, day))
}

pub fn get_holiday_info(year: i32, month: u32, day: u32) -> Result<HolidayInfo, String> {
    let date = NaiveDate::from_ymd_opt(year, month, day).ok_or("Invalid date")?;
    let weekend = matches!(date.weekday(), Weekday::Sat | Weekday::Sun);

    let (ranges, workdays) = statutory_holidays(year);
    let in_range = in_holiday_range(&ranges, month, day);
    let adjusted = is_adjusted_workday(&workdays, month, day);

    let is_holiday = if adjusted { false } else { in_range.is_some() || weekend };
    let is_workday = adjusted;

    let holiday_name = in_range
        .map(|n| n.to_string())
        .or_else(|| {
            let fests = get_festivals(year, month, day).unwrap_or_default();
            fests.first().cloned()
        })
        .or_else(|| if weekend && !adjusted { Some("周末".into()) } else { None });

    Ok(HolidayInfo { is_holiday, is_workday, holiday_name })
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct NextHoliday {
    pub name: String,
    pub days: i64,
}

pub fn get_next_holiday(year: i32, month: u32, day: u32) -> Result<Option<NextHoliday>, String> {
    let today = NaiveDate::from_ymd_opt(year, month, day).ok_or("Invalid date")?;

    for yr in [year, year + 1] {
        let (ranges, _) = statutory_holidays(yr);
        for h in &ranges {
            let start = NaiveDate::from_ymd_opt(yr, h.start.0, h.start.1)
                .ok_or("Invalid holiday date")?;
            let end = NaiveDate::from_ymd_opt(yr, h.end.0, h.end.1)
                .ok_or("Invalid holiday date")?;
            if today >= start && today <= end {
                return Ok(Some(NextHoliday { name: h.name.into(), days: 0 }));
            }
            if today < start {
                return Ok(Some(NextHoliday {
                    name: h.name.into(),
                    days: (start - today).num_days(),
                }));
            }
        }
    }
    Ok(None)
}

pub fn get_calendar_data_batch(dates: Vec<(i32, u32, u32)>) -> Result<Vec<DayCalendarData>, String> {
    dates
        .iter()
        .map(|&(y, m, d)| {
            Ok(DayCalendarData {
                year: y,
                month: m,
                day: d,
                lunar_info: get_lunar_info(y, m, d)?,
                holiday_info: get_holiday_info(y, m, d)?,
                festivals: get_festivals(y, m, d)?,
                solar_terms: get_solar_terms(y, m, d)?,
            })
        })
        .collect()
}
