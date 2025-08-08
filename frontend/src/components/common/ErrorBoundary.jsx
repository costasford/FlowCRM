import React from 'react';
import { ExclamationTriangleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console and potentially to an error reporting service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Store error details in state for display
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // You could also log the error to an error reporting service here
    // logErrorToService(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null 
    });
  };

  render() {
    if (this.state.hasError) {
      // Render fallback UI
      return (
        <div className="min-h-[400px] flex items-center justify-center p-8">
          <div className="max-w-md w-full text-center">
            <div className="mx-auto mb-6">
              <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                <ExclamationTriangleIcon className="w-8 h-8 text-red-600" />
              </div>
            </div>
            
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {this.props.title || 'Something went wrong'}
            </h2>
            
            <p className="text-gray-600 mb-6">
              {this.props.message || 'An unexpected error occurred. Please try refreshing the page or contact support if the problem persists.'}
            </p>
            
            <div className="space-y-3">
              <button
                onClick={this.handleRetry}
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <ArrowPathIcon className="w-4 h-4 mr-2" />
                Try Again
              </button>
              
              <button
                onClick={() => window.location.reload()}
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Refresh Page
              </button>
            </div>

            {/* Error details for development */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                  Technical Details (Development Only)
                </summary>
                <div className="mt-3 p-3 bg-gray-50 rounded text-xs text-gray-600 font-mono">
                  <div className="mb-2">
                    <strong>Error:</strong> {this.state.error.toString()}
                  </div>
                  <div>
                    <strong>Stack Trace:</strong>
                    <pre className="mt-1 whitespace-pre-wrap">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </div>
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Higher-order component that wraps a component with error boundary
 * @param {React.Component} WrappedComponent - Component to wrap
 * @param {Object} errorBoundaryProps - Props for the error boundary
 * @returns {React.Component}
 */
export const withErrorBoundary = (WrappedComponent, errorBoundaryProps = {}) => {
  const WithErrorBoundaryComponent = (props) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <WrappedComponent {...props} />
    </ErrorBoundary>
  );

  WithErrorBoundaryComponent.displayName = `withErrorBoundary(${WrappedComponent.displayName || WrappedComponent.name})`;
  
  return WithErrorBoundaryComponent;
};

/**
 * Specialized error boundary for page-level components
 */
export const PageErrorBoundary = ({ children }) => (
  <ErrorBoundary
    title="Page Error"
    message="This page encountered an error. Please try refreshing or navigate to another page."
  >
    {children}
  </ErrorBoundary>
);

/**
 * Specialized error boundary for components that fetch data
 */
export const DataErrorBoundary = ({ children, onRetry }) => (
  <ErrorBoundary
    title="Data Loading Error"
    message="Failed to load data. Please check your connection and try again."
  >
    {children}
  </ErrorBoundary>
);

/**
 * Specialized error boundary for form components
 */
export const FormErrorBoundary = ({ children }) => (
  <ErrorBoundary
    title="Form Error"
    message="The form encountered an error. Please refresh and try again."
  >
    {children}
  </ErrorBoundary>
);

export default ErrorBoundary;