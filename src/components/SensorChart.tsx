import { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Box, Card, CardContent, Typography, CircularProgress, Alert } from '@mui/material';
import { useSensorLogs } from '../hooks/useSensorData';
import type { SensorType } from '../types';

interface SensorChartProps {
  sensorType: SensorType;
  title: string;
  color?: string;
}

export const SensorChart = ({ sensorType, title, color = '#2e7d32' }: SensorChartProps) => {
  const [timeRange] = useState({
    start_time: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Last 24 hours
    end_time: new Date().toISOString(),
  });

  const { data: logs, isLoading, error } = useSensorLogs(sensorType, timeRange);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height={300}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        Failed to load sensor data: {error instanceof Error ? error.message : 'Unknown error'}
      </Alert>
    );
  }

  if (!logs || logs.length === 0) {
    return (
      <Alert severity="info" sx={{ mt: 2 }}>
        No data available for this sensor
      </Alert>
    );
  }

  const firstLog = logs[0];
  if (!firstLog) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        Invalid sensor data format
      </Alert>
    );
  }

  const data = logs.map((log) => ({
    timestamp: new Date(log.timestamp).toLocaleTimeString(),
    value: log.value,
    unit: log.unit,
  }));

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Box sx={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <Line
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={2}
                dot={false}
              />
              <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
              <XAxis
                dataKey="timestamp"
                tick={{ fontSize: 12 }}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fontSize: 12 }}
                label={{
                  value: firstLog.unit,
                  angle: -90,
                  position: 'insideLeft',
                  style: { textAnchor: 'middle' },
                }}
              />
              <Tooltip
                contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}
                labelStyle={{ fontWeight: 'bold' }}
                formatter={(value: number) => [`${value.toFixed(1)} ${firstLog.unit}`, 'Value']}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
}; 