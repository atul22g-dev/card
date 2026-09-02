import React from 'react';

/**
 * ErrorBoundary — catches JavaScript errors in the component tree
 * and displays a fallback UI instead of a blank white screen.
 *
 * This is the only way to catch errors in React class component
 * render methods and lifecycle methods.
 */
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-[var(--bg-secondary)] px-4">
                    <div className="text-center max-w-md">
                        <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center mx-auto mb-5">
                            <i className="fa-solid fa-triangle-exclamation text-2xl text-red-500"></i>
                        </div>
                        <h1 className="text-xl font-bold text-[var(--text-primary)] mb-2">
                            Something went wrong
                        </h1>
                        <p className="text-sm text-[var(--text-muted)] mb-6">
                            An unexpected error occurred. Please try refreshing the page.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="themeBg text-white rounded-xl px-5 py-2.5 text-sm font-medium transition-all duration-200 hover:brightness-110"
                        >
                            <i className="fa-solid fa-rotate-right mr-2"></i>
                            Refresh Page
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
