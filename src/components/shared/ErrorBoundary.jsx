import { Component } from 'react';

const isDev = import.meta.env?.DEV ?? false;

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    if (isDev) {
      console.error("ErrorBoundary caught an error:", error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '3rem', 
          textAlign: 'center', 
          color: '#e0e0e0',
          background: '#1a1a1a',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'var(--font-main, system-ui)',
        }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
            Something went wrong.
          </h2>
          {isDev && this.state.error && (
            <details style={{ 
              whiteSpace: 'pre-wrap', 
              marginTop: '1rem', 
              color: '#ff6b6b',
              maxWidth: '600px',
              textAlign: 'left',
              fontSize: '0.85rem',
            }}>
              <summary>Error Details (dev only)</summary>
              {this.state.error.toString()}
            </details>
          )}
          <button 
            onClick={() => window.location.reload()}
            style={{ 
              marginTop: '2rem', 
              padding: '0.75rem 2rem', 
              cursor: 'pointer',
              background: 'transparent',
              color: '#e0e0e0',
              border: '1px solid #444',
              borderRadius: '4px',
              fontSize: '0.9rem',
              transition: 'border-color 0.2s',
            }}
            onMouseEnter={(e) => e.target.style.borderColor = '#888'}
            onMouseLeave={(e) => e.target.style.borderColor = '#444'}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
