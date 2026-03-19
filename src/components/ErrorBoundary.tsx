import React from 'react'

interface ErrorBoundaryProps {
  children: React.ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('Calendar Error:', error, errorInfo)
  }

  override render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div className="w-[320px] h-[420px] bg-slate-50 rounded-xl border border-white/50 shadow-xl flex flex-col items-center justify-center p-6 text-center">
          <div className="text-2xl mb-3">⚠️</div>
          <h2 className="text-sm font-bold text-slate-800 mb-2">出了点问题</h2>
          <p className="text-xs text-slate-500 mb-4">
            {this.state.error?.message ?? '未知错误'}
          </p>
          <button
            type="button"
            onClick={() => {
              this.setState({ hasError: false, error: null })
              window.location.reload()
            }}
            className="px-4 py-1.5 text-xs bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer transition-colors"
          >
            重新加载
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
