use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;
use std::sync::Mutex;
use tauri::{AppHandle, Manager, Runtime};

/// 应用设置
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AppSettings {
    pub general: GeneralSettings,
    pub calendar: CalendarSettings,
    pub ui: UiSettings,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GeneralSettings {
    pub auto_launch: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CalendarSettings {
    pub week_starts_on: u8,
    pub highlight_today: bool,
    pub show_festivals: bool,
    pub show_solar_terms: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct UiSettings {
    pub window_opacity: f64,
    pub enable_glassmorphism: bool,
    pub show_lunar_info: bool,
}

impl Default for AppSettings {
    fn default() -> Self {
        Self {
            general: GeneralSettings {
                auto_launch: false,
            },
            calendar: CalendarSettings {
                week_starts_on: 0, // 周日开始
                highlight_today: true,
                show_festivals: true,
                show_solar_terms: true,
            },
            ui: UiSettings {
                window_opacity: 1.0,
                enable_glassmorphism: false,
                show_lunar_info: true,
            },
        }
    }
}

/// 设置管理器
pub struct SettingsManager {
    settings_path: PathBuf,
    settings: Mutex<AppSettings>,
}

impl SettingsManager {
    /// 创建新的设置管理器
    pub fn new<R: Runtime>(app: AppHandle<R>) -> Self {
        let settings_dir = app.path().app_data_dir().unwrap_or_else(|_| PathBuf::from("."));
        let settings_path = settings_dir.join("settings.json");
        
        // 确保目录存在
        if let Some(parent) = settings_path.parent() {
            let _ = fs::create_dir_all(parent);
        }
        
        // 加载或创建默认设置
        let settings = Self::load_settings(&settings_path);
        
        Self {
            settings_path,
            settings: Mutex::new(settings),
        }
    }
    
    /// 加载设置
    fn load_settings(path: &PathBuf) -> AppSettings {
        if let Ok(content) = fs::read_to_string(path) {
            if let Ok(settings) = serde_json::from_str(&content) {
                return settings;
            }
        }
        AppSettings::default()
    }
    
    /// 保存设置
    fn save_settings(&self, settings: &AppSettings) -> Result<(), String> {
        let content = serde_json::to_string_pretty(settings)
            .map_err(|e| e.to_string())?;
        fs::write(&self.settings_path, content)
            .map_err(|e| e.to_string())
    }
    
    /// 获取设置
    pub fn get_settings(&self) -> AppSettings {
        self.settings
            .lock()
            .unwrap_or_else(|e| e.into_inner())
            .clone()
    }
    
    /// 更新设置
    pub fn update_settings(&self, new_settings: AppSettings) -> Result<(), String> {
        self.save_settings(&new_settings)?;
        *self.settings.lock().unwrap_or_else(|e| e.into_inner()) = new_settings;
        Ok(())
    }
    
    /// 重置设置
    pub fn reset_settings(&self) -> Result<(), String> {
        let default = AppSettings::default();
        self.update_settings(default)
    }
}

// Tauri 命令

#[tauri::command]
pub fn get_settings(settings: tauri::State<'_, SettingsManager>) -> AppSettings {
    settings.get_settings()
}

#[tauri::command]
pub fn update_settings(
    settings: tauri::State<'_, SettingsManager>,
    new_settings: AppSettings,
) -> Result<(), String> {
    settings.update_settings(new_settings)
}

#[tauri::command]
pub fn reset_settings(settings: tauri::State<'_, SettingsManager>) -> Result<(), String> {
    settings.reset_settings()
}
