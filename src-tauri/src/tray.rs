use chrono::Datelike;
use tauri::{
    menu::{Menu, MenuItem, PredefinedMenuItem},
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
    AppHandle, Emitter, Manager, Runtime,
};

use crate::window::{hide_calendar_window, show_calendar_window, update_tray_icon_with_date};

/// 设置系统托盘
pub fn setup_tray<R: Runtime>(app: AppHandle<R>) -> Result<(), Box<dyn std::error::Error>> {
    let show_i = MenuItem::with_id(&app, "show", "显示日历", true, None::<&str>)?;
    let hide_i = MenuItem::with_id(&app, "hide", "隐藏日历", true, None::<&str>)?;
    let today_i = MenuItem::with_id(&app, "today", "回到今天", true, None::<&str>)?;
    let settings_i = MenuItem::with_id(&app, "settings", "设置", true, None::<&str>)?;
    let about_i = MenuItem::with_id(&app, "about", "关于", true, None::<&str>)?;
    let quit_i = MenuItem::with_id(&app, "quit", "退出", true, None::<&str>)?;

    let menu = Menu::with_items(
        &app,
        &[
            &show_i,
            &hide_i,
            &today_i,
            &PredefinedMenuItem::separator(&app)?,
            &settings_i,
            &about_i,
            &PredefinedMenuItem::separator(&app)?,
            &quit_i,
        ],
    )?;

    let icon = app
        .default_window_icon()
        .ok_or("No default window icon found")?
        .clone();

    let _tray = TrayIconBuilder::with_id("main-tray")
        .icon(icon)
        .tooltip("万年历 - 农历日历桌面工具")
        .menu(&menu)
        .show_menu_on_left_click(false)
        .on_menu_event(move |app, event| match event.id.as_ref() {
            "show" => {
                let _ = show_calendar_window(app.clone(), None);
            }
            "hide" => {
                hide_calendar_window(app.clone());
            }
            "today" => {
                let _ = show_calendar_window(app.clone(), None);
                if let Some(w) = app.get_webview_window("calendar") {
                    let _ = w.emit("go-to-today", ());
                }
            }
            "settings" => {
                let _ = show_calendar_window(app.clone(), None);
                if let Some(w) = app.get_webview_window("calendar") {
                    let _ = w.emit("show-settings", ());
                }
            }
            "about" => {
                let _ = show_calendar_window(app.clone(), None);
                if let Some(w) = app.get_webview_window("calendar") {
                    let _ = w.emit("show-about", ());
                }
            }
            "quit" => {
                app.exit(0);
            }
            _ => {}
        })
        .on_tray_icon_event(|tray, event| {
            if let TrayIconEvent::Click {
                button: MouseButton::Left,
                button_state: MouseButtonState::Up,
                position,
                ..
            } = event
            {
                let app = tray.app_handle();
                toggle_calendar_window(app, position.x, position.y);
            }
        })
        .build(&app)?;

    let _ = update_tray_icon_with_date(&app);
    setup_icon_update_timer(app);

    Ok(())
}

/// 切换日历窗口显示
fn toggle_calendar_window<R: Runtime>(app: &AppHandle<R>, tray_x: f64, tray_y: f64) {
    if let Some(window) = app.get_webview_window("calendar") {
        if let Ok(true) = window.is_visible() {
            hide_calendar_window(app.clone());
        } else {
            let _ = show_calendar_window(app.clone(), Some((tray_x, tray_y)));
        }
    }
}

/// 设置图标更新定时器（进程退出时线程自动终止）
fn setup_icon_update_timer<R: Runtime>(app: AppHandle<R>) {
    std::thread::spawn(move || {
        let mut last_day = 0u32;

        loop {
            // 分段 sleep，每 10 秒检查一次，提高退出响应速度
            for _ in 0..6 {
                std::thread::sleep(std::time::Duration::from_secs(10));
            }

            let now = chrono::Local::now();
            let current_day = now.day();

            if current_day != last_day {
                last_day = current_day;
                let _ = update_tray_icon_with_date(&app);
            }
        }
    });
}
