// 万年历项目常用图标映射
import {
  // 导航类图标
  ChevronLeft,
  ChevronRight,
  Home,
  Calendar,
  Settings,
  Menu,

  // 日历类图标
  CalendarDays,
  Clock,
  Bell,
  Plus,
  Edit,
  Trash2,

  // 状态类图标
  Star,
  Heart,
  Check,
  X,

  // 系统类图标
  Minus,
  Square,
  Maximize2,

  // 农历/节日类图标
  Moon,
  Sun,
  Gift,
  Sparkles,

  // 功能类图标
  Search,
  Filter,
  Download,
  Upload,
  RefreshCw,
  RotateCcw,
  Play,
  Palette,
  Globe,
  Target,
  Eye,
  Cog,
  Zap,
  Minimize2,

  // 信息类图标
  Info,
  AlertCircle,
  CheckCircle,
  XCircle,
  type LucideIcon
} from 'lucide-react'

// 图标分类映射
export const icons = {
  // 导航类
  navigation: {
    prev: ChevronLeft,
    next: ChevronRight,
    home: Home,
    calendar: Calendar,
    settings: Settings,
    menu: Menu
  },

  // 日历类
  calendar: {
    calendar: CalendarDays,
    clock: Clock,
    reminder: Bell,
    add: Plus,
    edit: Edit,
    delete: Trash2
  },

  // 状态类
  status: {
    favorite: Star,
    like: Heart,
    done: Check,
    close: X
  },

  // 系统类
  system: {
    minimize: Minus,
    maximize: Square,
    fullscreen: Maximize2
  },

  // 农历/节日类
  lunar: {
    moon: Moon,
    sun: Sun,
    festival: Gift,
    special: Sparkles
  },

  // 功能类
  action: {
    search: Search,
    filter: Filter,
    download: Download,
    upload: Upload,
    refresh: RefreshCw
  },

  // 信息类
  feedback: {
    info: Info,
    warning: AlertCircle,
    success: CheckCircle,
    error: XCircle
  }
} as const

// 扁平化图标映射（便于直接使用）
export const flatIcons = {
  // 导航
  prev: ChevronLeft,
  next: ChevronRight,
  home: Home,
  calendar: Calendar,
  settings: Settings,
  menu: Menu,

  // 日历操作
  calendarDays: CalendarDays,
  clock: Clock,
  bell: Bell,
  plus: Plus,
  edit: Edit,
  trash: Trash2,

  // 状态
  star: Star,
  heart: Heart,
  check: Check,
  close: X,

  // 系统
  minimize: Minus,
  maximize: Square,
  fullscreen: Maximize2,

  // 农历
  moon: Moon,
  sun: Sun,
  gift: Gift,
  sparkles: Sparkles,

  // 功能
  search: Search,
  filter: Filter,
  download: Download,
  upload: Upload,
  refresh: RefreshCw,

  // 反馈
  info: Info,
  warning: AlertCircle,
  alertCircle: AlertCircle,
  success: CheckCircle,
  error: XCircle,

  // 扩展功能图标
  rotateCcw: RotateCcw,
  play: Play,
  palette: Palette,
  globe: Globe,
  target: Target,
  eye: Eye,
  cog: Cog,
  zap: Zap,
  minimize2: Minimize2
} as const

// 类型定义
export type IconName = keyof typeof flatIcons
export type IconCategory = keyof typeof icons
export { type LucideIcon }
