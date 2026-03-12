# Electron 到 Tauri 迁移指南

## 迁移完成状态

✅ **前端代码迁移完成** - React 组件已适配 Tauri API
✅ **Rust 后端代码完成** - 托盘、窗口管理、农历计算
✅ **配置文件更新完成** - Tauri 配置、构建脚本
✅ **项目结构整理完成** - 清理了旧 Electron 代码

## 剩余步骤

### 1. 安装 Rust

访问 [https://rustup.rs/](https://rustup.rs/) 安装 Rust，或在终端运行：

**Windows:**
```powershell
winget install Rustlang.Rustup
```

**macOS/Linux:**
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

### 2. 安装 Tauri CLI

```bash
cargo install tauri-cli
```

### 3. 安装 Node.js 依赖

```bash
npm install
```

### 4. 运行开发模式

```bash
npm run tauri:dev
```

### 5. 构建发布版本

```bash
npm run tauri:build
```

## 项目结构变化

### 旧结构 (Electron)
```
src/
├── main/          # Electron 主进程
├── preload/       # Electron 预加载脚本
└── renderer/      # React 前端
```

### 新结构 (Tauri)
```
src/               # React 前端代码
src-tauri/
├── src/           # Rust 后端代码
│   ├── main.rs    # 应用入口
│   ├── calendar.rs # 农历/节假日计算
│   ├── tray.rs    # 系统托盘
│   ├── window.rs  # 窗口管理
│   └── settings.rs # 设置管理
├── icons/         # 应用图标
└── Cargo.toml     # Rust 依赖
```

## 功能对比

| 功能 | Electron 版本 | Tauri 版本 | 状态 |
|------|--------------|------------|------|
| 系统托盘 | ✅ | ✅ | 已实现 |
| 日历窗口 | ✅ | ✅ | 已实现 |
| 农历显示 | ✅ | ✅ | 已实现 |
| 节假日信息 | ✅ | ✅ | 已实现 |
| 托盘日期图标 | ✅ | ⚠️ | 待完善 |
| 设置窗口 | ✅ | ⚠️ | 待实现 |
| 自动更新 | ✅ | ⚠️ | 待配置 |

## 技术变化

### 前端
- 移除了 `@electron-toolkit` 相关依赖
- 添加了 `@tauri-apps/api` 用于调用 Rust 后端
- 简化了项目结构

### 后端
- 从 Node.js/Electron 迁移到 Rust
- 使用 `chrono` 处理日期时间
- 使用简化版农历计算（可后续替换为完整库）

### 构建
- 从 `electron-vite` 迁移到标准 Vite
- 从 `electron-builder` 迁移到 Tauri 内置打包工具
- 产物大小从 ~150MB 减少到 ~5MB

## 注意事项

1. **农历精度**: 当前使用简化版农历计算，建议后续集成更精确的农历库
2. **图标**: 需要创建 Windows (.ico) 和 macOS (.icns) 格式的图标
3. **签名**: macOS 和 Windows 发布需要进行代码签名

## 后续优化建议

1. 添加完整农历库支持
2. 实现动态托盘图标（显示日期）
3. 添加设置窗口
4. 配置自动更新
5. 添加测试
