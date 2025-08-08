import React from 'react';
import { ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/outline';

/**
 * Error boundary specifically for modal components
 * Provides a compact error UI that fits within modal constraints
 */
class ModalErrorBoundary extends React.Component {
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
    console.error(`ModalErrorBoundary (${this.props.modalName || 'Unknown modal'}) caught an error:`, error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    if (this.props.onError) {
      this.props.onError(error, errorInfo, this.props.modalName);
    }
  }

  handleClose = () => {
    // Reset error state and close modal
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null 
    });
    
    if (this.props.onClose) {
      this.props.onClose();
    }
  };

  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null 
    });
    
    if (this.props.onRetry) {
      this.props.onRetry();
    }
  };

  render() {
    if (this.state.hasError) {
      const { 
        modalName = 'Modal',
        showClose = true,
        showRetry = true,
        title = `${modalName} Error`
      } = this.props;

      return (
        <div className="relative bg-white rounded-lg shadow-xl">
          {/* Modal Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              {title}
            </h3>
            {showClose && (
              <button
                onClick={this.handleClose}
                className="text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Error Content */}
          <div className="p-6 text-center">
            <div className="mx-auto mb-4">
              <div className="w-12 h-12 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
              </div>
            </div>

            <h4 className="text-base font-medium text-gray-900 mb-2">
              Something went wrong
            </h4>

            <p className="text-sm text-gray-600 mb-6">
              The {modalName.toLowerCase()} encountered an error and couldn't be displayed properly.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {showRetry && (
                <button
                  onClick={this.handleRetry}
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Try Again
                </button>
              )}
              
              {showClose && (
                <button
                  onClick={this.handleClose}
                  className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Close
                </button>
              )}
            </div>

            {/* Development Error Details */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700 text-center">
                  Error Details (Dev Only)
                </summary>
                <div className="mt-3 p-3 bg-red-50 rounded text-xs text-red-700 font-mono max-h-32 overflow-y-auto">
                  <div className="font-semibold mb-2">Error:</div>
                  <div className="mb-3">{this.state.error.toString()}</div>
                  {this.state.errorInfo?.componentStack && (
                    <>
                      <div className="font-semibold mb-2">Component Stack:</div>
                      <pre className="whitespace-pre-wrap text-xs">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </>
                  )}
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

export default ModalErrorBoundary;