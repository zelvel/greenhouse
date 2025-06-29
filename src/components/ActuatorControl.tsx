import { useState } from 'react';
import {
  Box,
  Slider,
  IconButton,
  CircularProgress,
  Alert,
  Typography,
} from '@mui/material';
import { PowerSettingsNew } from '@mui/icons-material';
import { useActuatorControl } from '../hooks/useActuatorControl';
import type { ActuatorType } from '../types';

interface ActuatorControlProps {
  type: ActuatorType;
  name: string;
  icon: React.ReactNode;
  color?: string;
  currentValue: number;
}

export const ActuatorControl = ({
  type,
  color = '#2e7d32',
  currentValue,
}: ActuatorControlProps) => {
  const [value, setValue] = useState(currentValue);
  const [isOn, setIsOn] = useState(currentValue > 0);

  const { mutate: updateActuator, isPending, error } = useActuatorControl(type);

  const handlePowerToggle = () => {
    const newIsOn = !isOn;
    setIsOn(newIsOn);
    if (!newIsOn) {
      setValue(0);
      updateActuator(0);
    } else {
      setValue(currentValue > 0 ? currentValue : 50);
      updateActuator(currentValue > 0 ? currentValue : 50);
    }
  };

  const handleSliderChange = (_: Event | React.SyntheticEvent, newValue: number | number[]) => {
    const sliderValue = Array.isArray(newValue) ? newValue[0] : newValue;
    if (typeof sliderValue === 'number') {
      setValue(sliderValue);
    }
  };

  const handleSliderChangeCommitted = (_: Event | React.SyntheticEvent, newValue: number | number[]) => {
    const sliderValue = Array.isArray(newValue) ? newValue[0] : newValue;
    if (typeof sliderValue === 'number') {
      updateActuator(sliderValue);
      setIsOn(sliderValue > 0);
    }
  };

  return (
    <Box>
      {error ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to update actuator: {error instanceof Error ? error.message : 'Unknown error'}
        </Alert>
      ) : (
        <Box>
          {/* Power Toggle Button */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <IconButton
              onClick={handlePowerToggle}
              color={isOn ? 'primary' : 'default'}
              disabled={isPending}
              size="large"
              sx={{
                border: 2,
                borderColor: isOn ? 'primary.main' : 'divider',
                '&:hover': {
                  borderColor: isOn ? 'primary.dark' : 'primary.main',
                }
              }}
            >
              <PowerSettingsNew />
            </IconButton>
          </Box>

          {/* Slider Control */}
          <Box position="relative" sx={{ px: 1 }}>
            <Slider
              value={value}
              onChange={handleSliderChange}
              onChangeCommitted={handleSliderChangeCommitted}
              disabled={!isOn || isPending}
              valueLabelDisplay="auto"
              valueLabelFormat={(v) => `${v}%`}
              sx={{
                color: color,
                opacity: !isOn ? 0.5 : 1,
                '& .MuiSlider-thumb': {
                  width: 20,
                  height: 20,
                },
                '& .MuiSlider-track': {
                  height: 6,
                },
                '& .MuiSlider-rail': {
                  height: 6,
                },
              }}
            />
            {isPending && (
              <CircularProgress
                size={24}
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  marginTop: '-12px',
                  marginLeft: '-12px',
                }}
              />
            )}
          </Box>

          {/* Status Text */}
          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            sx={{ mt: 1 }}
          >
            {isOn ? `Set to ${value}%` : 'Turned off'}
          </Typography>
        </Box>
      )}
    </Box>
  );
}; 