import { NextRouter, withRouter } from 'next/router'
import React, { Component, ReactNode } from 'react'

interface ErrorBoundaryProps {
  fallback: React.ComponentType
  children: ReactNode
  router: NextRouter
}

interface ErrorBoundaryState {
  hasError: boolean
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('Error caught by Error Boundary: ', error, errorInfo)
  }
  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    if (this.props.router.asPath !== prevProps.router.asPath) {
      this.setState({ hasError: false })
    }
  }
  render(): any {
    if (this.state.hasError) {
      const FallbackComponent: any = this.props.fallback
      return <FallbackComponent />
    }

    return this.props.children
  }
}

export default withRouter(ErrorBoundary)
