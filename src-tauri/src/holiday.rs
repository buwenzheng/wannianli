//! 法定假日数据：从 holidays.js 在线拉取、解析、按年缓存。
//! 数据源仅包含 2020 年及以后；更早或之后未覆盖的年份不处理。

use regex::Regex;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::fs;
use std::path::PathBuf;
use std::thread;
use std::time::Duration;

const HOLIDAYS_JS_URLS: &[&str] = &[
    "https://raw.githubusercontent.com/zfdang/chinese-lunar-calendar-for-mac/master/WanNianLi/WanNianLi/Resources/vendors/holidays.js",
    "https://cdn.jsdelivr.net/gh/zfdang/chinese-lunar-calendar-for-mac@master/WanNianLi/WanNianLi/Resources/vendors/holidays.js",
    "https://fastly.jsdelivr.net/gh/zfdang/chinese-lunar-calendar-for-mac@master/WanNianLi/WanNianLi/Resources/vendors/holidays.js",
];

/// 某年缓存：调整表(YYYYMMDD -> +/-) + 假期范围(用于范围内周末也标休)
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct YearHolidayData {
    /// "YYYYMMDD" -> '+' 放假, '-' 调休上班
    pub adjustments: HashMap<String, String>,
    /// 假期范围，用于判定某日是否在法定假期内（含周末）
    pub ranges: Vec<HolidayRangeCached>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct HolidayRangeCached {
    pub name: String,
    pub start_month: u32,
    pub start_day: u32,
    pub end_month: u32,
    pub end_day: u32,
}

/// 从网络拉取 holidays.js 内容
fn fetch_holidays_js() -> Result<String, String> {
    let client = reqwest::blocking::Client::builder()
        .timeout(std::time::Duration::from_secs(15))
        .build()
        .map_err(|e| e.to_string())?;

    let mut errors = Vec::new();
    for &url in HOLIDAYS_JS_URLS {
        for attempt in 1..=2 {
            let resp = client
                .get(url)
                .header(
                    reqwest::header::USER_AGENT,
                    "wannianli/1.0 (+https://github.com/username/wannianli)",
                )
                .send();

            match resp {
                Ok(r) => {
                    if !r.status().is_success() {
                        errors.push(format!(
                            "{} attempt {} status {}",
                            url,
                            attempt,
                            r.status()
                        ));
                    } else {
                        let text = r.text().map_err(|e| e.to_string())?;
                        #[cfg(debug_assertions)]
                        {
                            println!("[holiday] fetched from {} bytes={}", url, text.len());
                            println!("[holiday] holidays.js >>>\n{}\n<<< [holiday] holidays.js", text);
                        }
                        return Ok(text);
                    }
                }
                Err(e) => {
                    errors.push(format!("{} attempt {} error {}", url, attempt, e));
                }
            }

            if attempt < 2 {
                thread::sleep(Duration::from_millis(300));
            }
        }
    }

    Err(format!("fetch holidays.js failed: {}", errors.join(" | ")))
}

/// 解析 HOLIDAYADJUSTMENT：提取 "YYYYMMDD": "+"|"-"
fn parse_adjustments(js: &str) -> HashMap<String, String> {
    let re = Regex::new(r#""(\d{8})"\s*:\s*"([+-])""#).unwrap();
    let mut map = HashMap::new();
    for cap in re.captures_iter(js) {
        map.insert(cap[1].to_string(), cap[2].to_string());
    }
    map
}

/// 解析注释中的假期范围：一、元旦：1月1日至3日 或 X月Y日至U月V日
fn parse_ranges_from_comments(js: &str) -> Vec<(i32, HolidayRangeCached)> {
    // 按行，找到 "YYYYMMDD" 时认为前面注释属于该年
    let key_re = Regex::new(r#""(\d{4})(\d{2})(\d{2})""#).unwrap();
    // 匹配：一、节名：M月D日至 然后 同月E日 或 U月V日
    let range_re_same_month = Regex::new(r"[一二三四五六七八九十]、([^：]+)：(\d+)月(\d+)日[^至]*至\s*(\d+)日").unwrap();
    let range_re_cross_month = Regex::new(r"[一二三四五六七八九十]、([^：]+)：(\d+)月(\d+)日[^至]*至\s*(\d+)月(\d+)日").unwrap();

    let mut result = Vec::new();
    let lines: Vec<&str> = js.lines().collect();
    let mut i = 0;
    while i < lines.len() {
        let line = lines[i];
        if let Some(cap) = key_re.captures(line) {
            let year: i32 = cap[1].parse().unwrap_or(0);
            let _month: u32 = cap[2].parse().unwrap_or(0);
            let _day: u32 = cap[3].parse().unwrap_or(0);
            // 向前收集连续注释行，解析范围
            let mut j = i;
            while j > 0 && lines[j - 1].trim_start().starts_with("//") {
                j -= 1;
                let comment = lines[j];
                if let Some(m) = range_re_cross_month.captures(comment) {
                    let name = m[1].trim().to_string();
                    let start_m: u32 = m[2].parse().unwrap_or(1);
                    let start_d: u32 = m[3].parse().unwrap_or(1);
                    let end_m: u32 = m[4].parse().unwrap_or(1);
                    let end_d: u32 = m[5].parse().unwrap_or(1);
                    result.push((
                        year,
                        HolidayRangeCached {
                            name,
                            start_month: start_m,
                            start_day: start_d,
                            end_month: end_m,
                            end_day: end_d,
                        },
                    ));
                } else if let Some(m) = range_re_same_month.captures(comment) {
                    let name = m[1].trim().to_string();
                    let start_m: u32 = m[2].parse().unwrap_or(1);
                    let start_d: u32 = m[3].parse().unwrap_or(1);
                    let end_d: u32 = m[4].parse().unwrap_or(1);
                    result.push((
                        year,
                        HolidayRangeCached {
                            name: name,
                            start_month: start_m,
                            start_day: start_d,
                            end_month: start_m,
                            end_day: end_d,
                        },
                    ));
                }
            }
        }
        i += 1;
    }
    result
}

/// 从完整 js 中按年拆出 YearHolidayData，并返回数据源包含的年份范围
fn parse_js_to_year_data(js: &str) -> (HashMap<i32, YearHolidayData>, i32, i32) {
    let adjustments = parse_adjustments(js);
    let ranges_by_year = parse_ranges_from_comments(js);

    let mut year_min = i32::MAX;
    let mut year_max = i32::MIN;
    for key in adjustments.keys() {
        if key.len() >= 4 {
            if let Ok(y) = key[..4].parse::<i32>() {
                year_min = year_min.min(y);
                year_max = year_max.max(y);
            }
        }
    }

    let mut by_year: HashMap<i32, YearHolidayData> = HashMap::new();
    for (key, value) in &adjustments {
        if key.len() < 8 {
            continue;
        }
        let y: i32 = key[..4].parse().unwrap_or(0);
        if y < 2000 || y > 2100 {
            continue;
        }
        by_year
            .entry(y)
            .or_insert_with(|| YearHolidayData {
                adjustments: HashMap::new(),
                ranges: ranges_by_year
                    .iter()
                    .filter(|(yr, _)| *yr == y)
                    .map(|(_, r)| r.clone())
                    .collect(),
            })
            .adjustments
            .insert(key.clone(), value.clone());
    }
    (by_year, year_min, year_max)
}

fn cache_dir(app_data_dir: &PathBuf) -> PathBuf {
    let dir = app_data_dir.join("holiday_cache");
    let _ = fs::create_dir_all(&dir);
    dir
}

fn cache_path(app_data_dir: &PathBuf, year: i32) -> PathBuf {
    cache_dir(app_data_dir).join(format!("{}.json", year))
}

/// 从缓存读取某年数据
fn load_cached_year(app_data_dir: &PathBuf, year: i32) -> Option<YearHolidayData> {
    let path = cache_path(app_data_dir, year);
    let s = fs::read_to_string(&path).ok()?;
    serde_json::from_str(&s).ok()
}

/// 写入某年缓存
fn save_cached_year(app_data_dir: &PathBuf, year: i32, data: &YearHolidayData) {
    let path = cache_path(app_data_dir, year);
    if let Ok(s) = serde_json::to_string_pretty(data) {
        let _ = fs::write(path, s);
    }
}

/// 获取某年的假日数据：优先缓存，无则拉取并解析后缓存。仅数据源包含的年份返回 Some。
pub fn get_year_holiday_data(
    app_data_dir: Option<&PathBuf>,
    year: i32,
) -> Result<Option<YearHolidayData>, String> {
    // app_data_dir 为空时仍允许在线拉取并解析（仅不写缓存）
    let dir_opt = app_data_dir.cloned();

    if let Some(ref dir) = dir_opt {
        if let Some(cached) = load_cached_year(dir, year) {
            return Ok(Some(cached));
        }
    }

    let js = fetch_holidays_js()?;
    let (mut by_year, _min, _max) = parse_js_to_year_data(&js);
    let data = by_year.remove(&year);
    if let (Some(ref d), Some(ref dir)) = (&data, &dir_opt) {
        save_cached_year(dir, year, d);
    }
    Ok(data)
}

/// 某日是否为调整表中的调休上班
pub fn is_adjusted_workday(adjustments: &HashMap<String, String>, year: i32, month: u32, day: u32) -> bool {
    let key = format!("{:04}{:02}{:02}", year, month, day);
    adjustments.get(&key).map(String::as_str) == Some("-")
}

/// 某日是否在调整表中为放假
pub fn is_adjusted_holiday(adjustments: &HashMap<String, String>, year: i32, month: u32, day: u32) -> bool {
    let key = format!("{:04}{:02}{:02}", year, month, day);
    adjustments.get(&key).map(String::as_str) == Some("+")
}
