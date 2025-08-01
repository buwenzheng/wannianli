/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/renderer/index.html', './src/renderer/src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // 万年历主题色彩
        primary: {
          50: '#fef2f2',
          100: '#fee2e2',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          900: '#7f1d1d'
        },
        lunar: {
          50: '#fff7ed',
          100: '#ffedd5',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c'
        }
      },
      fontFamily: {
        chinese: ['PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'sans-serif']
      },
      gridTemplateColumns: {
        calendar: 'repeat(7, 1fr)'
      },
      spacing: {
        calendar: '2.5rem'
      }
    }
  },
  plugins: [
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('@tailwindcss/forms')
  ],
  darkMode: 'class' // 支持深色模式
}
