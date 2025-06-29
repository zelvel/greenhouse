import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Alert,
} from '@mui/material';
import {
  Timeline,
  TrendingUp,
  Notifications,
  Download,
} from '@mui/icons-material';

export const Analytics = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Analytics
      </Typography>

      <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
        {/* Historical Data Analysis */}
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
              <Timeline sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6">Historical Data</Typography>
            </Box>
            <Typography color="text.secondary" paragraph>
              View and analyze historical sensor data and actuator states.
              Generate custom reports and visualizations.
            </Typography>
            <Button
              variant="outlined"
              startIcon={<Timeline />}
              sx={{ mr: 1 }}
              disabled
            >
              View History
            </Button>
            <Button
              variant="outlined"
              startIcon={<Download />}
              disabled
            >
              Export Data
            </Button>
          </CardContent>
        </Card>

        {/* Trends and Predictions */}
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
              <TrendingUp sx={{ mr: 1, color: 'secondary.main' }} />
              <Typography variant="h6">Trends & Predictions</Typography>
            </Box>
            <Typography color="text.secondary" paragraph>
              Analyze trends in environmental conditions and system performance.
              View AI-powered predictions and recommendations.
            </Typography>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<TrendingUp />}
              disabled
            >
              View Trends
            </Button>
          </CardContent>
        </Card>

        {/* Alerts and Events */}
        <Card sx={{ gridColumn: { xs: '1', md: '1 / -1' } }}>
          <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
              <Notifications sx={{ mr: 1, color: 'warning.main' }} />
              <Typography variant="h6">Alerts & Events</Typography>
            </Box>
            <Alert severity="info" sx={{ mb: 2 }}>
              This feature will be available in a future update.
            </Alert>
            <Typography color="text.secondary" paragraph>
              View system alerts, events, and notifications history.
              Configure alert thresholds and notification preferences.
            </Typography>
            <Button
              variant="outlined"
              color="warning"
              startIcon={<Notifications />}
              disabled
            >
              View Alerts
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}; 