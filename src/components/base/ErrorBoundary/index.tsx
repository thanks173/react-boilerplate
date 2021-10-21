import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'

interface State {
  hasError?: boolean
}

class ErrorBoundary extends Component<any, State> {
  constructor(props: any) {
    super(props)
    this.state = { hasError: false }
  }

  componentDidCatch(error: any, errorInfo: React.ErrorInfo) {
    console.debug('errorBoundary: ' + errorInfo.componentStack)
    this.setState({ hasError: true })
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>
    }
    return this.props.children
  }
}

export default withRouter(ErrorBoundary)
