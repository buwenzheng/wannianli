import Versions from './components/Versions'
import electronLogo from './assets/electron.svg'

function App(): React.JSX.Element {
  const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-8">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
        <img alt="logo" src={electronLogo} className="w-20 h-20 mx-auto mb-6 animate-spin" />

        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">万年历应用</h1>

        <p className="text-gray-600 dark:text-gray-400 mb-6">
          使用 <span className="text-blue-600 font-semibold">React</span>
          &nbsp;和 <span className="text-blue-800 font-semibold">TypeScript</span> 构建
        </p>

        <div className="space-y-4">
          <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg p-4">
            <p className="text-primary-700 dark:text-primary-300 text-sm">
              按 <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">F12</kbd>{' '}
              打开开发者工具
            </p>
          </div>

          <div className="flex gap-4">
            <a
              href="https://electron-vite.org/"
              target="_blank"
              rel="noreferrer"
              className="flex-1 bg-primary-500 hover:bg-primary-600 text-white py-2 px-4 rounded-md transition-colors duration-200"
            >
              文档
            </a>
            <button
              onClick={ipcHandle}
              className="flex-1 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 py-2 px-4 rounded-md transition-colors duration-200 text-gray-700 dark:text-gray-300"
            >
              发送 IPC
            </button>
          </div>
        </div>

        <div className="mt-8">
          <Versions />
        </div>
      </div>
    </div>
  )
}

export default App
