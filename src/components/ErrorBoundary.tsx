import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorMsg: string;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorMsg: ''
  };

  public static getDerivedStateFromError(error: Error): State {
    // Check if it's our serialized Firestore error
    let errorMsg = error.message;
    try {
      const parsed = JSON.parse(error.message);
      if (parsed.error) {
        errorMsg = parsed.error;
      }
    } catch (e) {
      // not a json string, use original message
    }
    return { hasError: true, errorMsg };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 text-center">
          <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-red-100">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Terjadi Kesalahan</h1>
            <p className="text-gray-600 mb-6">
              Maaf, terjadi kesalahan saat memuat data atau mengakses database.
            </p>
            <div className="bg-red-50 p-4 rounded-lg text-left text-sm text-red-800 font-mono overflow-auto mb-6">
              {this.state.errorMsg}
            </div>
            <button
              onClick={() => window.location.reload()}
              className="bg-primary text-white font-medium py-2 px-6 rounded-lg hover:bg-primary-dark transition-colors"
            >
              Muat Ulang Halaman
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
