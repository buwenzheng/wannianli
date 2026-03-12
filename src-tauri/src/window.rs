use chrono::Datelike;
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::Arc;
use tauri::{AppHandle, Manager, Runtime};

/// 显示日历窗口（near 为托盘点击坐标时定位到托盘附近，None 时居中）
pub fn show_calendar_window<R: Runtime>(
    app: AppHandle<R>,
    near: Option<(f64, f64)>,
) -> Result<(), String> {
    if let Some(window) = app.get_webview_window("calendar") {
        let window_size = window.outer_size().map_err(|e| e.to_string())?;
        let w = window_size.width as i32;
        let h = window_size.height as i32;

        let (x, y) = match near {
            Some((cx, cy)) => calculate_near_position(&app, cx, cy, w, h)?,
            None => calculate_center_position(&app, w, h)?,
        };

        window
            .set_position(tauri::Position::Physical(tauri::PhysicalPosition { x, y }))
            .map_err(|e| e.to_string())?;
        window.show().map_err(|e| e.to_string())?;
        window.set_focus().map_err(|e| e.to_string())?;

        Ok(())
    } else {
        Err("Calendar window not found".to_string())
    }
}

/// 隐藏日历窗口
pub fn hide_calendar_window<R: Runtime>(app: AppHandle<R>) {
    if let Some(window) = app.get_webview_window("calendar") {
        let _ = window.hide();
    }
}

/// 计算托盘附近的窗口位置
fn calculate_near_position<R: Runtime>(
    app: &AppHandle<R>,
    click_x: f64,
    click_y: f64,
    window_width: i32,
    window_height: i32,
) -> Result<(i32, i32), String> {
    let monitor = app
        .primary_monitor()
        .map_err(|e| e.to_string())?
        .ok_or("No monitor found")?;
    let screen_height = monitor.size().height as i32;
    let screen_width = monitor.size().width as i32;

    let x = (click_x as i32 - window_width / 2).clamp(0, screen_width - window_width);

    // 点击位于屏幕上半部分（macOS 菜单栏）→ 窗口显示在下方
    // 点击位于屏幕下半部分（Windows 任务栏）→ 窗口显示在上方
    let y = if (click_y as i32) < screen_height / 2 {
        click_y as i32 + 8
    } else {
        (click_y as i32 - window_height - 8).max(0)
    };

    Ok((x, y))
}

/// 计算屏幕居中的窗口位置
fn calculate_center_position<R: Runtime>(
    app: &AppHandle<R>,
    window_width: i32,
    window_height: i32,
) -> Result<(i32, i32), String> {
    let monitor = app
        .primary_monitor()
        .map_err(|e| e.to_string())?
        .ok_or("No monitor found")?;
    let pos = monitor.position();
    let size = monitor.size();
    let x = pos.x + (size.width as i32 - window_width) / 2;
    let y = pos.y + (size.height as i32 - window_height) / 2;
    Ok((x, y))
}

/// 设置窗口行为
pub fn setup_window<R: Runtime>(app: AppHandle<R>) -> Result<(), Box<dyn std::error::Error>> {
    if let Some(window) = app.get_webview_window("calendar") {
        let app_handle = app.clone();
        let pending_hide = Arc::new(AtomicBool::new(false));

        window.on_window_event(move |event| {
            if let tauri::WindowEvent::Focused(focused) = event {
                if *focused {
                    pending_hide.store(false, Ordering::SeqCst);
                } else {
                    pending_hide.store(true, Ordering::SeqCst);
                    let app = app_handle.clone();
                    let flag = pending_hide.clone();
                    std::thread::spawn(move || {
                        std::thread::sleep(std::time::Duration::from_millis(200));
                        if flag.load(Ordering::SeqCst) {
                            hide_calendar_window(app);
                        }
                    });
                }
            }
        });
    }

    Ok(())
}

/// 更新托盘图标和 tooltip 为当前日期
pub fn update_tray_icon_with_date<R: Runtime>(app: &AppHandle<R>) -> Result<(), String> {
    let now = chrono::Local::now();
    let day = now.day();
    let rgba = render_date_icon(day);
    let icon = tauri::image::Image::new_owned(rgba, 32, 32);

    if let Some(tray) = app.tray_by_id("main-tray") {
        tray.set_icon(Some(icon)).map_err(|e| e.to_string())?;
        let tooltip = build_tooltip(now.year(), now.month(), now.day(), now.weekday());
        let _ = tray.set_tooltip(Some(&tooltip));
    }
    Ok(())
}

fn build_tooltip(y: i32, m: u32, d: u32, wd: chrono::Weekday) -> String {
    let weekday = match wd {
        chrono::Weekday::Mon => "星期一",
        chrono::Weekday::Tue => "星期二",
        chrono::Weekday::Wed => "星期三",
        chrono::Weekday::Thu => "星期四",
        chrono::Weekday::Fri => "星期五",
        chrono::Weekday::Sat => "星期六",
        chrono::Weekday::Sun => "星期日",
    };
    let mut tip = format!("万年历\n{}年{}月{}日 {}", y, m, d, weekday);
    if let Ok(info) = crate::calendar::get_lunar_info(y, m, d) {
        tip.push_str(&format!("\n农历: {}{}", info.lunar_month, info.lunar_day));
    }
    if let Ok(terms) = crate::calendar::get_solar_terms(y, m, d) {
        if let Some(t) = terms.first() {
            tip.push_str(&format!("\n{}", t));
        }
    }
    tip
}

// 5x7 bitmap font for digits 0-9
#[rustfmt::skip]
const DIGIT_FONT: [[u8; 7]; 10] = [
    [0b01110, 0b10001, 0b10011, 0b10101, 0b11001, 0b10001, 0b01110], // 0
    [0b00100, 0b01100, 0b00100, 0b00100, 0b00100, 0b00100, 0b01110], // 1
    [0b01110, 0b10001, 0b00001, 0b00010, 0b00100, 0b01000, 0b11111], // 2
    [0b11111, 0b00010, 0b00100, 0b00010, 0b00001, 0b10001, 0b01110], // 3
    [0b00010, 0b00110, 0b01010, 0b10010, 0b11111, 0b00010, 0b00010], // 4
    [0b11111, 0b10000, 0b11110, 0b00001, 0b00001, 0b10001, 0b01110], // 5
    [0b00110, 0b01000, 0b10000, 0b11110, 0b10001, 0b10001, 0b01110], // 6
    [0b11111, 0b00001, 0b00010, 0b00100, 0b01000, 0b01000, 0b01000], // 7
    [0b01110, 0b10001, 0b10001, 0b01110, 0b10001, 0b10001, 0b01110], // 8
    [0b01110, 0b10001, 0b10001, 0b01111, 0b00001, 0b00010, 0b01100], // 9
];

fn render_date_icon(day: u32) -> Vec<u8> {
    const S: usize = 32;
    let mut buf = vec![0u8; S * S * 4];

    let c = S as f64 / 2.0;
    let r = 14.0f64;
    for y in 0..S {
        for x in 0..S {
            let d = ((x as f64 - c + 0.5).powi(2) + (y as f64 - c + 0.5).powi(2)).sqrt();
            let a = if d <= r {
                255u8
            } else if d <= r + 1.0 {
                ((r + 1.0 - d) * 255.0) as u8
            } else {
                0u8
            };
            if a > 0 {
                let i = (y * S + x) * 4;
                buf[i] = 255;
                buf[i + 1] = 255;
                buf[i + 2] = 255;
                buf[i + 3] = a;
            }
        }
    }

    let digits: Vec<usize> = if day >= 10 {
        vec![(day / 10) as usize, (day % 10) as usize]
    } else {
        vec![day as usize]
    };
    let scale: usize = if digits.len() == 1 { 3 } else { 2 };
    let cw = 5 * scale;
    let ch = 7 * scale;
    let gap: usize = if digits.len() > 1 { scale } else { 0 };
    let tw = cw * digits.len() + gap * digits.len().saturating_sub(1);
    let ox = S.saturating_sub(tw) / 2;
    let oy = S.saturating_sub(ch) / 2;

    for (di, &digit) in digits.iter().enumerate() {
        let dx = ox + di * (cw + gap);
        for row in 0..7usize {
            for col in 0..5usize {
                if DIGIT_FONT[digit][row] & (1 << (4 - col)) != 0 {
                    for sy in 0..scale {
                        for sx in 0..scale {
                            let px = dx + col * scale + sx;
                            let py = oy + row * scale + sy;
                            if px < S && py < S {
                                let i = (py * S + px) * 4;
                                buf[i] = 50;
                                buf[i + 1] = 50;
                                buf[i + 2] = 50;
                                buf[i + 3] = 255;
                            }
                        }
                    }
                }
            }
        }
    }

    buf
}
