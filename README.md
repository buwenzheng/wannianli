# 万年历 (Wannianli)

轻量级万年历桌面应用，支持农历、节假日和节气显示。

## 特性

- 📅 **农历显示** - 支持完整的农历日期、节气显示
- 🎉 **节假日信息** - 自动获取中国法定节假日和调休信息
- 🖥️ **系统托盘** - 点击托盘图标快速查看日历
- 🎨 **精美界面** - 毛玻璃效果，现代化设计
- 🚀 **轻量快速** - 基于 Tauri 构建，体积小、启动快
- 💻 **跨平台** - 支持 Windows、macOS 和 Linux

## 技术栈

- **前端**: React + TypeScript + Tailwind CSS
- **后端**: Rust + Tauri
- **农历计算**: 简化算法（基于 chrono）

---

## 快速开始

### 环境要求

- [Node.js](https://nodejs.org/) (v18 或更高)
- [Rust](https://www.rust-lang.org/) (最新稳定版)

### 1. 安装 Node.js

**Windows**:
```powershell
winget install OpenJS.NodeJS
```

**macOS**:
```bash
brew install node
```

**Linux (Ubuntu/Debian)**:
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

验证安装:
```bash
node --version  # v18.x.x 或更高
npm --version   # 9.x.x 或更高
```

### 2. 安装 Rust

**Windows**:

1. 先安装 Visual Studio Build Tools（编译 Rust 必需）:
   ```powershell
   winget install Microsoft.VisualStudio.2022.BuildTools --override "--wait --add Microsoft.VisualStudio.Workload.VCTools --includeRecommended"
   ```
   > 或者手动下载：https://visualstudio.microsoft.com/visual-cpp-build-tools/
   > 安装时选择 **"使用 C++ 的桌面开发"** 工作负载

2. 安装 Rust:
   ```powershell
   winget install Rustlang.Rustup
   ```

**macOS/Linux**:
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env
```

验证安装:
```bash
rustc --version
cargo --version
```

### 3. 配置 Rust 镜像（推荐）

**中国用户建议配置国内镜像**，否则可能下载失败：

创建 Cargo 配置文件:
```bash
# Windows
mkdir %USERPROFILE%\.cargo

# macOS/Linux
mkdir -p ~/.cargo
```

添加镜像配置到 `~/.cargo/config.toml` (macOS/Linux) 或 `%USERPROFILE%\.cargo\config.toml` (Windows):

```toml
[source.crates-io]
replace-with = 'ustc'

[source.ustc]
registry = "sparse+https://mirrors.ustc.edu.cn/crates.io-index/"

[net]
git-fetch-with-cli = true
```

其他可用镜像:
- **清华源**: `registry = "https://mirrors.tuna.tsinghua.edu.cn/git/crates.io-index.git"`
- **阿里云**: `registry = "https://mirrors.aliyun.com/crates.io-index/"`

### 4. 克隆项目并安装依赖

```bash
# 克隆项目
git clone <repository-url>
cd wannianli

# 安装 Node.js 依赖
npm install
```

### 5. 运行开发模式

```bash
# 方式1: 使用 npm 脚本
npm run tauri:dev

# 方式2: 使用 cargo (需先进入 src-tauri 目录)
cd src-tauri
cargo tauri dev
```

首次运行会自动下载 Rust 依赖（可能需要几分钟，取决于网络）。

成功后你会看到:
- 一个日历窗口弹出
- 系统托盘出现日历图标

### 6. 构建发布版本

```bash
# 构建当前平台的可执行文件
npm run tauri:build
```

构建产物位于:
- **Windows**: `src-tauri/target/release/wannianli.exe`
- **macOS**: `src-tauri/target/release/bundle/macos/万年历.app`
- **Linux**: `src-tauri/target/release/wannianli`

---

## 开发指南

### 项目结构

```
wannianli/
├── src/                      # 前端源代码 (React)
│   ├── components/           # React 组件
│   ├── hooks/                # 自定义 Hooks
│   ├── utils/                # 工具函数
│   ├── types/                # TypeScript 类型
│   ├── App.tsx               # 应用主组件
│   ├── main.tsx              # 应用入口
│   └── styles.css            # 全局样式
├── src-tauri/                # Rust 后端源代码
│   ├── src/
│   │   ├── main.rs           # 应用入口
│   │   ├── calendar.rs       # 农历/节假日计算
│   │   ├── tray.rs           # 系统托盘
│   │   ├── window.rs         # 窗口管理
│   │   └── settings.rs       # 设置管理
│   ├── icons/                # 应用图标
│   ├── Cargo.toml            # Rust 依赖配置
│   └── tauri.conf.json       # Tauri 配置
├── index.html                # 前端 HTML 模板
├── vite.config.ts            # Vite 配置
├── package.json              # Node.js 依赖
└── README.md                 # 本文件
```

### 常用命令

```bash
# 开发模式（带热重载）
npm run tauri:dev

# 仅运行前端（调试用）
npm run dev

# 构建发布版本
npm run tauri:build

# 仅构建前端
npm run build

# 格式化代码
npm run format

# 检查代码
npm run lint

# Rust 相关命令（需在 src-tauri 目录执行）
cd src-tauri
cargo check      # 检查代码
cargo build      # 构建 Debug 版本
cargo run        # 运行
cargo clippy     # Lint 检查
```

### 开发提示

1. **前端修改**: 修改 `src/` 下的文件，保存后自动热重载
2. **后端修改**: 修改 `src-tauri/src/` 下的 Rust 文件，保存后自动重新编译
3. **调试前端**: 在开发模式下按 `F12` 或 `Ctrl+Shift+I` 打开 DevTools
4. **调试后端**: 使用 `cargo run` 或 IDE 的调试功能

---

## 常见问题

### Q: 运行 `npm run tauri:dev` 时提示找不到 cargo?
**A**: 确保 Rust 已正确安装，并重启终端。如果仍有问题，尝试手动添加环境变量:
- Windows: 将 `%USERPROFILE%\.cargo\bin` 添加到 PATH
- macOS/Linux: 添加 `source $HOME/.cargo/env` 到 `~/.bashrc` 或 `~/.zshrc`

### Q: Rust 依赖下载超时或失败?
**A**: 配置国内镜像（见步骤3）。如果仍失败，尝试:
```bash
cargo clean
# 然后重试
npm run tauri:dev
```

### Q: 报错 `linker 'link.exe' not found`?
**A**: Windows 需要安装 Visual Studio Build Tools:
```powershell
winget install Microsoft.VisualStudio.2022.BuildTools --override "--wait --add Microsoft.VisualStudio.Workload.VCTools --includeRecommended"
```
安装后重启终端再试。

### Q: 报错 `icons/icon.ico is not in 3.00 format`?
**A**: 需要生成正确的 ICO 格式图标:
```bash
npx tauri icon src-tauri/icons/icon.png --output src-tauri/icons/
```

### Q: 如何修改应用图标?
**A**: 替换 `src-tauri/icons/` 目录下的图标文件，然后重新构建。

### Q: 支持哪些平台?
**A**: 
- Windows 10/11
- macOS 12+ (Monterey)
- Linux (Ubuntu 20.04+, 其他发行版需测试)

---

## 许可证

MIT License
