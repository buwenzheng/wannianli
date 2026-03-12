// Prevents additional console window on Windows in release
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;

mod calendar;
mod settings;
mod tray;
mod window;

use settings::SettingsManager;
use tray::setup_tray;
use window::setup_window;

#[tauri::command]
fn get_lunar_date(year: i32, month: u32, day: u32) -> Result<calendar::LunarInfo, String> {
    calendar::get_lunar_info(year, month, day)
}

#[tauri::command]
fn get_festivals(year: i32, month: u32, day: u32) -> Result<Vec<String>, String> {
    calendar::get_festivals(year, month, day)
}

#[tauri::command]
fn get_solar_terms(year: i32, month: u32, day: u32) -> Result<Vec<String>, String> {
    calendar::get_solar_terms(year, month, day)
}

#[tauri::command]
fn get_holiday_info(year: i32, month: u32, day: u32) -> Result<calendar::HolidayInfo, String> {
    calendar::get_holiday_info(year, month, day)
}

#[tauri::command]
fn get_calendar_data(dates: Vec<(i32, u32, u32)>) -> Result<Vec<calendar::DayCalendarData>, String> {
    calendar::get_calendar_data_batch(dates)
}

#[tauri::command]
fn get_next_holiday(year: i32, month: u32, day: u32) -> Result<Option<calendar::NextHoliday>, String> {
    calendar::get_next_holiday(year, month, day)
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_autostart::init(
            tauri_plugin_autostart::MacosLauncher::LaunchAgent,
            Some(vec!["--minimized"]),
        ))
        .setup(|app| {
            // 初始化设置管理器
            let settings_manager = SettingsManager::new(app.handle().clone());
            app.manage(settings_manager);

            // 设置托盘
            setup_tray(app.handle().clone())?;

            // 设置窗口行为
            setup_window(app.handle().clone())?;

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            get_lunar_date,
            get_festivals,
            get_solar_terms,
            get_holiday_info,
            get_calendar_data,
            get_next_holiday,
            settings::get_settings,
            settings::update_settings,
            settings::reset_settings,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
