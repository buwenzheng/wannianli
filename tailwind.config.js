/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/renderer/index.html', './src/renderer/src/**/*.{js,ts,jsx,tsx}'],
  // Tailwind CSS v4: 所有主题配置已移至CSS的@theme指令中
  // 主题配置已移至 CSS @theme 指令中
  plugins: [
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('@tailwindcss/forms'),
    // 添加自定义工具类插件
    function ({ addUtilities }) {
      addUtilities({
        '.draggable': {
          '-webkit-app-region': 'drag'
        },
        '.no-drag': {
          '-webkit-app-region': 'no-drag'
        }
      })
    }
  ],
  darkMode: 'class' // 支持深色模式
}
