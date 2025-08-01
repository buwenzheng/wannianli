/**
 * 简洁日期图标生成脚本
 * 生成只显示日期数字的简洁图标，不显示月份
 */

/* eslint-disable @typescript-eslint/explicit-function-return-type */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// 获取当前文件路径 (ESM模块中没有__dirname)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 创建图标目录
const iconsDir = path.join(__dirname, '../resources/date-icons')
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true })
}

/**
 * 生成基于提供设计的SVG日期图标（显示日期数字）
 * @param {number} day - 日期 (1-31)
 * @param {number} size - 图标尺寸
 * @returns {string} SVG字符串
 */
function generateSVGIcon(day, size = 18) {
  const dayStr = day.toString()

  // 将原始SVG适配到我们的尺寸，使用viewBox进行缩放
  return `<svg width="${size}" height="${size}" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" fill="#fff">
  <!-- 基于提供的日历设计 -->
  <path d="M109.714286 950.857143h804.571428V365.714286H109.714286v585.142857zM329.142857 256V91.428571q0-8-5.142857-13.142857t-13.142857-5.142857h-36.571429q-8 0-13.142857 5.142857t-5.142857 13.142857v164.571429q0 8 5.142857 13.142857t13.142857 5.142857h36.571429q8 0 13.142857-5.142857t5.142857-13.142857z m438.857143 0V91.428571q0-8-5.142857-13.142857t-13.142857-5.142857h-36.571429q-8 0-13.142857 5.142857t-5.142857 13.142857v164.571429q0 8 5.142857 13.142857t13.142857 5.142857h36.571429q8 0 13.142857-5.142857t5.142857-13.142857z m219.428571-36.571429v731.428572q0 29.714286-21.714285 51.428571t-51.428572 21.714286H109.714286q-29.714286 0-51.428572-21.714286t-21.714285-51.428571V219.428571q0-29.714286 21.714285-51.428571t51.428572-21.714286h73.142857v-54.857143q0-37.714286 26.857143-64.571428T274.285714 0h36.571429q37.714286 0 64.571428 26.857143t26.857143 64.571428v54.857143h219.428572v-54.857143q0-37.714286 26.857143-64.571428t64.571428-26.857143h36.571429q37.714286 0 64.571428 26.857143t26.857143 64.571428v54.857143h73.142857q29.714286 0 51.428572 21.714286t21.714285 51.428571z" 
        fill="#000"/>
  <!-- 日历内容区域白色背景 -->
  <rect x="109.714286" y="365.714286" width="804.571428" height="585.142857" fill="white"/>
  <!-- 日期数字显示在日历下半部分中央 -->
  <text x="512" y="700" 
        font-family="-apple-system, SF Pro Display, Helvetica, Arial, sans-serif" 
        font-size="520" 
        font-weight="700"
        text-anchor="middle" 
        dominant-baseline="middle"
        fill="#000">${dayStr}</text>
</svg>`
}

/**
 * 生成图标目录说明文件
 */
function generateReadme() {
  const readmeContent = `# 日期图标文件

这个目录包含预生成的日期图标文件。

## 文件命名规则

- \`date-DD.svg\` - 常规尺寸图标 (18x18px)
- \`date-DD@2x.svg\` - 视网膜屏幕图标 (36x36px)

其中：
- DD: 日期 (01-31)

## 文件数量

- 总共 62 个图标文件
- 31天 × 2种尺寸 = 62个文件

## 使用说明

这些图标由 \`scripts/generateDateIcons.mjs\` 脚本自动生成。
要重新生成图标，请运行：

\`\`\`bash
npm run generate-icons
\`\`\`

## 图标设计

- 简洁的日历图标设计
- 顶部有装订环效果
- 中央显示日期数字
- 使用系统字体确保清晰度
- 适配菜单栏尺寸 (18px) 和视网膜屏幕 (36px)
`

  const readmePath = path.join(iconsDir, 'README.md')
  fs.writeFileSync(readmePath, readmeContent)
  console.log('📄 README.md 文件已生成')
}

/**
 * 清理旧的图标文件（包括SVG和PNG）
 */
function cleanOldIcons() {
  console.log('🧹 清理旧图标文件...')
  try {
    if (fs.existsSync(iconsDir)) {
      const files = fs.readdirSync(iconsDir)
      const iconFiles = files.filter(
        (file) => file.startsWith('date-') && (file.endsWith('.svg') || file.endsWith('.png'))
      )

      iconFiles.forEach((file) => {
        const filePath = path.join(iconsDir, file)
        fs.unlinkSync(filePath)
      })

      if (iconFiles.length > 0) {
        console.log(`🗑️  删除了 ${iconFiles.length} 个旧图标文件`)
      } else {
        console.log('📝 没有发现旧图标文件')
      }
    }
  } catch (error) {
    console.error('❌ 清理旧图标失败:', error.message)
  }
}

/**
 * 创建图标文件
 */
function createIconFiles() {
  console.log('🚀 开始生成简洁版日期图标...')

  cleanOldIcons()

  let generatedCount = 0

  // 生成1-31天的图标（不再需要月份区分）
  for (let day = 1; day <= 31; day++) {
    const dayStr = day.toString().padStart(2, '0')

    try {
      // 生成常规尺寸图标 (18x18)
      const regularIconSvg = generateSVGIcon(day, 18)
      const regularIconPath = path.join(iconsDir, `date-${dayStr}.svg`)
      fs.writeFileSync(regularIconPath, regularIconSvg)

      // 生成高分辨率图标 (36x36 for @2x)
      const retinaIconSvg = generateSVGIcon(day, 36)
      const retinaIconPath = path.join(iconsDir, `date-${dayStr}@2x.svg`)
      fs.writeFileSync(retinaIconPath, retinaIconSvg)

      generatedCount += 2
    } catch (error) {
      console.error(`❌ 生成图标失败 (${day}日):`, error.message)
    }
  }

  // 生成说明文件
  generateReadme()

  console.log(`✅ 生成完成！共生成 ${generatedCount} 个图标文件`)
  console.log(`📊 详细统计: 31天 × 2种尺寸 = ${generatedCount} 个文件`)
  console.log(`📁 图标位置: ${iconsDir}`)
  console.log(`🎨 简洁设计：只显示日期数字，适合小尺寸菜单栏`)
}

/**
 * SVG 转 PNG 转换功能 (从 convertSvgToPng.mjs 移植)
 */
async function convertSvgToPng() {
  console.log('\n🔄 开始将 SVG 图标转换为 PNG...')

  // 检查是否有 sharp 库
  let sharp = null
  try {
    sharp = await import('sharp')
    console.log('✅ 使用 sharp 库进行转换')
  } catch {
    console.log('⚠️  未安装 sharp 库，跳过PNG转换')
    console.log('💡 如需PNG格式，请运行: npm install sharp')
    return
  }

  const files = fs.readdirSync(iconsDir)
  const svgFiles = files.filter((file) => file.endsWith('.svg') && file.startsWith('date-'))

  console.log(`📊 找到 ${svgFiles.length} 个 SVG 文件`)

  let successCount = 0
  let failCount = 0

  for (const svgFile of svgFiles) {
    const svgPath = path.join(iconsDir, svgFile)
    const pngFile = svgFile.replace('.svg', '.png')
    const pngPath = path.join(iconsDir, pngFile)

    // 确定尺寸 (@2x 文件用 36px，普通文件用 18px)
    const size = svgFile.includes('@2x') ? 36 : 18

    try {
      await sharp.default(svgPath).png().resize(size, size).toFile(pngPath)

      successCount++
      console.log(`✅ ${svgFile} -> ${pngFile}`)
    } catch (error) {
      failCount++
      console.error(`❌ ${svgFile} 转换失败:`, error.message)
    }
  }

  console.log(`\n🎉 PNG转换完成！`)
  console.log(`✅ 成功: ${successCount} 个文件`)
  console.log(`❌ 失败: ${failCount} 个文件`)
  if (successCount > 0) {
    console.log(`📁 PNG 文件位置: ${iconsDir}`)
  }
}

/**
 * 主执行函数
 */
async function main() {
  try {
    // 1. 生成SVG图标
    createIconFiles()

    // 2. 转换为PNG
    await convertSvgToPng()

    console.log('\n🎊 图标生成流程完成！')
  } catch (error) {
    console.error('❌ 执行过程中发生错误:', error)
  }
}

// 执行主函数
main()
