import React from 'react';
import { ExclamationTriangleIcon, ArrowPathIcon, WifiIcon } from '@heroicons/react/24/outline';

/**
 * Error boundary specifically designed for async operations and data loading
 * Provides specialized UI for network errors, timeouts, and API failures
 */
class AsyncErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null,
      isNetworkError: false,
      isTimeoutError: false
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error(`AsyncErrorBoundary (${this.props.operation || 'Unknown operation'}) caught an error:`, error, errorInfo);
    
    // Detect error types
    const isNetworkError = error.message?.includes('fetch') || 
                          error.message?.includes('network') ||
                          error.name === 'NetworkError' ||
                          error.code === 'NETWORK_ERROR';
                          
    const isTimeoutError = error.message?.includes('timeout') ||
                          error.name === 'TimeoutError' ||
                          error.code === 'TIMEOUT_ERROR';

    this.setState({
      error: error,
      errorInfo: errorInfo,
      isNetworkError,
      isTimeoutError
    });

    // Report error with context
    if (this.props.onError) {
      this.props.onError(error, errorInfo, {
        operation: this.props.operation,
        isNetworkError,
        isTimeoutError
      });
    }
  }

  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null,
      isNetworkError: false,
      isTimeoutError: false
    });
    
    if (this.props.onRetry) {
      this.props.onRetry();
    }
  };

  getErrorMessage() {
    const { isNetworkError, isTimeoutError } = this.state;
    const { operation = 'operation' } = this.props;

    if (isNetworkError) {
      return `Unable to connect to the server. Please check your internet connection and try again.`;
    }
    
    if (isTimeoutError) {
      return `The ${operation} is taking longer than expected. Please try again.`;
    }

    return `Failed to complete ${operation}. Please try again.`;
  }

  getErrorIcon() {
    const { isNetworkError, isTimeoutError } = this.state;

    if (isNetworkError) {
      return <WifiIcon className="w-6 h-6 text-amber-600" />;
    }
    
    return <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />;
  }

  getErrorColor() {
    const { isNetworkError } = this.state;
    return isNetworkError ? 'amber' : 'red';
  }

  render() {
    if (this.state.hasError) {
      const { 
        title,
        showRetry = true,
        size = 'normal',
        className = ''
      } = this.props;

      const color = this.getErrorColor();
      const errorMessage = this.getErrorMessage();
      const errorIcon = this.getErrorIcon();

      const sizeClasses = {
        small: 'p-4 min-h-[120px]',
        normal: 'p-6 min-h-[200px]', 
        large: 'p-8 min-h-[300px]'
      };

      return (
        <div className={`flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200 ${sizeClasses[size]} ${className}`}>
          <div className="text-center max-w-sm">
            <div className="mx-auto mb-4">
              <div className={`w-12 h-12 mx-auto bg-${color}-100 rounded-full flex items-center justify-center`}>
                {errorIcon}
              </div>
            </div>
            
            <h3 className="text-sm font-medium text-gray-900 mb-2">
              {title || (this.state.isNetworkError ? 'Connection Error' : 'Loading Error')}
            </h3>
            
            <p className="text-xs text-gray-600 mb-4">
              {errorMessage}
            </p>
            
            {showRetry && (
              <div className="space-y-2">
                <button
                  onClick={this.handleRetry}
                  className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-${color}-700 bg-${color}-100 hover:bg-${color}-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${color}-500`}
                >
                  <ArrowPathIcon className="w-3 h-3 mr-1" />
                  Retry
                </button>
                
                {this.state.isNetworkError && (
                  <div className="text-xs text-gray-500">
                    Check your connection and try again
                  </div>
                )}
              </div>
            )}

            {/* Development error details */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-xs text-gray-500 hover:text-gray-700">
                  Technical Details
                </summary>
                <div className={`mt-2 p-2 bg-${color}-50 rounded text-xs text-${color}-700 font-mono`}>
                  <div className="font-semibold mb-1">Error Type:</div>
                  <div className="mb-2">{this.state.error.name || 'Unknown'}</div>
                  <div className="font-semibold mb-1">Message:</div>
                  <div>{this.state.error.message}</div>
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

export default AsyncErrorBoundary;