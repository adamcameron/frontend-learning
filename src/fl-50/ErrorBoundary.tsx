import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: unknown
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: unknown): State {
    console.dir({ method: 'getDerivedStateFromError', error: error })
    return { hasError: true, error: error }
  }

  public componentDidCatch(error: unknown, errorInfo: ErrorInfo) {
    console.dir({
      method: 'componentDidCatch',
      error: error,
      errorInfo: errorInfo,
      state: this.state,
    })
  }

  public render() {
    if (this.state.hasError) {
      return (
        <h1 data-testid="h1">
          Sorry: there was an error: {String(this.state.error)}
        </h1>
      )
    }

    return this.props.children
  }
}
