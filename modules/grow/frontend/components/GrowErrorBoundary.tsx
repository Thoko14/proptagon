import { Component, ErrorInfo, ReactNode } from 'react';
import Button from '../../../../platform/src/components/Button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class GrowErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });

    // Log error to console for development
    console.error('Grow Error Boundary caught an error:', error, errorInfo);

    // TODO: Send to error reporting service (Sentry, etc.)
    // logErrorToService(error, errorInfo);
  }

  handleReloadGrow = () => {
    // Soft reload of current route
    window.location.reload();
  };

  handleResetGrowSettings = () => {
    // Clear persisted Grow state only
    try {
      localStorage.removeItem('propbase:grow:v1');
      this.setState({ hasError: false });
      window.location.reload();
    } catch (error) {
      console.error('Failed to reset Grow settings:', error);
    }
  };

  handleReportIssue = () => {
    // TODO: Open bug form or Sentry user feedback
    const errorDetails = this.state.error?.message || 'Unknown error';
    const stackTrace = this.state.errorInfo?.componentStack || '';
    
    // For now, just log to console
    // Error details for reporting:
    console.log({
      error: errorDetails,
      stack: stackTrace,
      timestamp: new Date().toISOString(),
      url: window.location.href
    });

    alert('Error details have been logged to console. Please report this issue to the development team.');
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
            <div className="text-center">
              {/* Error Icon */}
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>

              {/* Error Title */}
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Something went wrong in Grow
              </h3>

              {/* Error Description */}
              <p className="text-sm text-gray-500 mb-6">
                We encountered an unexpected error while loading the Grow module. 
                Don't worry, your data is safe.
              </p>

              {/* Error Details (Collapsible) */}
              {this.state.error && (
                <details className="text-left mb-6">
                  <summary className="text-sm text-gray-600 cursor-pointer hover:text-gray-800 mb-2">
                    Error Details
                  </summary>
                  <div className="bg-gray-50 rounded p-3 text-xs font-mono text-gray-700 overflow-auto max-h-32">
                    <div className="mb-2">
                      <strong>Error:</strong> {this.state.error.message}
                    </div>
                    {this.state.errorInfo?.componentStack && (
                      <div>
                        <strong>Component Stack:</strong>
                        <pre className="whitespace-pre-wrap mt-1">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </div>
                    )}
                  </div>
                </details>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={this.handleReloadGrow}
                  className="w-full"
                >
                  Reload Grow
                </Button>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={this.handleResetGrowSettings}
                  className="w-full"
                >
                  Reset Grow Settings
                </Button>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={this.handleReportIssue}
                  className="w-full"
                >
                  Report Issue
                </Button>
              </div>

              {/* Additional Help */}
              <p className="text-xs text-gray-400 mt-4">
                If the problem persists, try refreshing the page or contact support.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
