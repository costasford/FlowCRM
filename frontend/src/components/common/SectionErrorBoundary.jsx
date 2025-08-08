import React from 'react';
import { ExclamationTriangleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

/**
 * Smaller, section-specific error boundary that doesn't take up the whole page
 * Ideal for dashboard widgets, data tables, and component sections
 */
class SectionErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error(`SectionErrorBoundary (${this.props.section || 'Unknown'}) caught an error:`, error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Optional error reporting
    if (this.props.onError) {
      this.props.onError(error, errorInfo, this.props.section);
    }
  }

  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null 
    });
    
    // Call optional retry callback
    if (this.props.onRetry) {
      this.props.onRetry();
    }
  };

  render() {
    if (this.state.hasError) {
      const { 
        title = 'Section Error', 
        message = 'This section failed to load.',
        size = 'normal',
        showRetry = true,
        className = ''
      } = this.props;

      const sizeClasses = {
        small: 'p-4 min-h-[120px]',
        normal: 'p-6 min-h-[200px]', 
        large: 'p-8 min-h-[300px]'
      };

      return (
        <div className={`flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200 ${sizeClasses[size]} ${className}`}>
          <div className="text-center max-w-sm">
            <div className="mx-auto mb-4">
              <div className="w-12 h-12 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
              </div>
            </div>
            
            <h3 className="text-sm font-medium text-gray-900 mb-2">
              {title}
            </h3>
            
            <p className="text-xs text-gray-600 mb-4">
              {message}
            </p>
            
            {showRetry && (
              <button
                onClick={this.handleRetry}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <ArrowPathIcon className="w-3 h-3 mr-1" />
                Retry
              </button>
            )}

            {/* Development error details */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-xs text-gray-500 hover:text-gray-700">
                  Error Details
                </summary>
                <div className="mt-2 p-2 bg-red-50 rounded text-xs text-red-700 font-mono">
                  {this.state.error.toString()}
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

export default SectionErrorBoundary;