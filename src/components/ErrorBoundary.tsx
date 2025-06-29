import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { Alert, Button, Box, Typography } from '@mui/material';
import logger from '../utils/logger';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public override state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error('Uncaught error:', { error: error.message, errorInfo });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public override render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            <Typography variant="h6" component="div" gutterBottom>
              Something went wrong
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {this.state.error?.message || 'An unexpected error occurred'}
            </Typography>
          </Alert>
          <Button
            variant="contained"
            color="primary"
            onClick={this.handleReset}
          >
            Try Again
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 