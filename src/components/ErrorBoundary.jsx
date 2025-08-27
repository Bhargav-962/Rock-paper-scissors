import React from 'react'

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props)
        this.state = { hasError: false, error: null, errorInfo: null }
    }

    static getDerivedStateFromError() {
        return { hasError: true }
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error caught by ErrorBoundary:', error, errorInfo)
        this.setState({
            error: error,
            errorInfo: errorInfo
        })
    }

    render() {
        if (!this.state.hasError) {
            return this.props.children;
        }
        return (
            <div>
                <h2 style={{ color: '#d63031', marginBottom: '16px' }}>🚨 Something went wrong!</h2>
                <p style={{ color: '#636e72', marginBottom: '16px' }}>We're sorry, but something unexpected happened. Please try refreshing the page.</p>
            </div>
        )
    }
}

export default ErrorBoundary
