import React, { useState, useEffect, useRef } from 'react';
import type { PlantProfile, GrowthStage, SensorThreshold, GrowthStageModifiers, SensorThresholds } from '@/types/plants';
import { 
  Card, 
  TextField, 
  Slider, 
  Button, 
  Box, 
  Typography, 
  IconButton, 
  Tooltip,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
  Grid,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { 
  InfoOutlined, 
  LocalFlorist, 
  WbSunny, 
  Opacity, 
  Thermostat,
  ExpandMore,
  CheckCircle,
  Circle,
  Upload,
  FileUpload
} from '@mui/icons-material';

interface AddPlantFormProps {
  initialData?: PlantProfile;
  onSubmit: (plant: PlantProfile) => void;
  onCancel: () => void;
}

const defaultGrowthStage: GrowthStage = {
  duration: 0,
  modifiers: {
    temperature: { optimal: 20 },
    humidity: { optimal: 60 },
    soilMoisture: { optimal: 60 },
    light: { optimal: 3000 }
  }
};

const defaultPlantProfile: PlantProfile = {
  name: '',
  scientificName: '',
  thresholds: {
    temperature: {
      min: 15,
      max: 30,
      optimal: 22,
      unit: '°C'
    },
    humidity: {
      min: 40,
      max: 80,
      optimal: 60,
      unit: '%'
    },
    soilMoisture: {
      min: 40,
      max: 80,
      optimal: 60,
      unit: '%'
    },
    light: {
      min: 2000,
      max: 6000,
      optimal: 4000,
      unit: 'lux'
    }
  },
  growthStages: {
    seedling: { ...defaultGrowthStage },
    vegetative: { ...defaultGrowthStage },
    flowering: { ...defaultGrowthStage },
    fruiting: { ...defaultGrowthStage }
  }
};

const sensorIcons = {
  temperature: <Thermostat />,
  humidity: <Opacity />,
  light: <WbSunny />,
  soilMoisture: <LocalFlorist />
} as const;

const sensorNames = {
  temperature: 'Temperature',
  humidity: 'Humidity',
  light: 'Light Level',
  soilMoisture: 'Soil Moisture'
} as const;

type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`;
}[keyof ObjectType & (string | number)];

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`form-tabpanel-${index}`}
      aria-labelledby={`form-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export const AddPlantForm: React.FC<AddPlantFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<PlantProfile>(defaultPlantProfile);
  const [tabValue, setTabValue] = useState(0);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleInputChange = (path: NestedKeyOf<PlantProfile>, value: number | string) => {
    const keys = path.split('.');
    setFormData(prev => {
      const newData = { ...prev };
      let current = newData as Record<string, unknown>;

      for (const key of keys.slice(0, -1)) {
        if (current[key] === undefined) break;
        current = current[key] as Record<string, unknown>;
      }

      const finalKey = keys[keys.length - 1];
      if (finalKey && current[finalKey] !== undefined) {
        current[finalKey] = value;
      }

      return newData;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleImportClick = () => {
    setImportDialogOpen(true);
    setImportError(null);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const plantConfig = JSON.parse(content);
        
        // Validate the imported configuration
        if (!plantConfig.name || !plantConfig.scientificName) {
          throw new Error('Invalid plant configuration: missing name or scientific name');
        }
        
        if (!plantConfig.thresholds || !plantConfig.growthStages) {
          throw new Error('Invalid plant configuration: missing thresholds or growth stages');
        }

        // Validate required thresholds
        const requiredThresholds = ['temperature', 'humidity', 'light', 'soilMoisture'];
        for (const threshold of requiredThresholds) {
          if (!plantConfig.thresholds[threshold]) {
            throw new Error(`Invalid plant configuration: missing ${threshold} threshold`);
          }
          const t = plantConfig.thresholds[threshold];
          if (typeof t.min !== 'number' || typeof t.max !== 'number' || typeof t.optimal !== 'number') {
            throw new Error(`Invalid plant configuration: ${threshold} threshold values must be numbers`);
          }
        }

        // Validate growth stages
        const requiredStages = ['seedling', 'vegetative', 'flowering', 'fruiting'];
        for (const stage of requiredStages) {
          if (!plantConfig.growthStages[stage]) {
            throw new Error(`Invalid plant configuration: missing ${stage} growth stage`);
          }
        }

        setFormData(plantConfig);
        setImportDialogOpen(false);
        setImportError(null);
        
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        setImportError(error instanceof Error ? error.message : 'Failed to parse configuration file');
      }
    };
    
    reader.readAsText(file);
  };

  const handleExportConfig = () => {
    const configData = JSON.stringify(formData, null, 2);
    const blob = new Blob([configData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${formData.name.toLowerCase().replace(/\s+/g, '_')}_config.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const isBasicInfoComplete = formData.name.trim() !== '' && formData.scientificName.trim() !== '';
  const isThresholdsComplete = Object.values(formData.thresholds).every(
    threshold => threshold.min < threshold.optimal && threshold.optimal < threshold.max
  );

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Card elevation={2} sx={{ maxWidth: '100%', mx: 'auto' }}>
          {/* Header */}
          <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Box>
                <Typography variant="h4" component="h1" color="primary" gutterBottom>
                  {initialData ? 'Edit Plant Profile' : 'Add New Plant'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Configure your plant's growing requirements and environmental preferences
                </Typography>
              </Box>
              
              {/* Import/Export Buttons */}
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={<Upload />}
                  onClick={handleImportClick}
                  size="small"
                >
                  Import Config
                </Button>
                {isBasicInfoComplete && (
                  <Button
                    variant="outlined"
                    startIcon={<FileUpload />}
                    onClick={handleExportConfig}
                    size="small"
                  >
                    Export Config
                  </Button>
                )}
              </Box>
            </Box>
          </Box>

          {/* Progress Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              variant="fullWidth"
              sx={{ px: 2 }}
            >
              <Tab 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {isBasicInfoComplete ? <CheckCircle color="success" /> : <Circle />}
                    <span>Basic Info</span>
                  </Box>
                }
              />
              <Tab 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {isThresholdsComplete ? <CheckCircle color="success" /> : <Circle />}
                    <span>Requirements</span>
                  </Box>
                }
              />
              <Tab 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Circle />
                    <span>Growth Stages</span>
                  </Box>
                }
              />
            </Tabs>
          </Box>

          {/* Tab Content */}
          <Box sx={{ p: 3 }}>
            {/* Basic Information Tab */}
            <TabPanel value={tabValue} index={0}>
              <Box sx={{ maxWidth: 600, mx: 'auto' }}>
                <Typography variant="h6" gutterBottom className="flex items-center">
                  Plant Information
                  <Tooltip title="Enter the common and scientific names of the plant">
                    <IconButton size="small" sx={{ ml: 1 }}>
                      <InfoOutlined fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Plant Name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      fullWidth
                      required
                      variant="outlined"
                      placeholder="e.g., Cherry Tomato"
                      helperText="Common name of the plant"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Scientific Name"
                      value={formData.scientificName}
                      onChange={(e) => handleInputChange('scientificName', e.target.value)}
                      fullWidth
                      required
                      variant="outlined"
                      placeholder="e.g., Solanum lycopersicum"
                      helperText="Scientific/Latin name"
                    />
                  </Grid>
                </Grid>

                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
                  <Button
                    variant="outlined"
                    onClick={onCancel}
                    size="large"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => setTabValue(1)}
                    disabled={!isBasicInfoComplete}
                    size="large"
                  >
                    Next: Environmental Requirements
                  </Button>
                </Box>
              </Box>
            </TabPanel>

            {/* Environmental Requirements Tab */}
            <TabPanel value={tabValue} index={1}>
              <Box sx={{ maxWidth: 800, mx: 'auto' }}>
                <Typography variant="h6" gutterBottom className="flex items-center">
                  Environmental Requirements
                  <Tooltip title="Set the optimal growing conditions for your plant">
                    <IconButton size="small" sx={{ ml: 1 }}>
                      <InfoOutlined fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Configure the temperature, humidity, light, and soil moisture ranges for optimal growth
                </Typography>

                {(Object.entries(formData.thresholds) as Array<[keyof SensorThresholds, SensorThreshold]>).map(([sensor, values]) => (
                  <Paper key={String(sensor)} sx={{ p: 3, mb: 3, border: 1, borderColor: 'divider' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      {sensorIcons[sensor as keyof typeof sensorIcons]}
                      <Typography variant="h6" sx={{ ml: 1 }}>
                        {sensorNames[sensor as keyof typeof sensorNames]}
                      </Typography>
                      <Chip 
                        label={values.unit} 
                        size="small" 
                        variant="outlined" 
                        sx={{ ml: 'auto' }}
                      />
                    </Box>
                    
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          label="Minimum"
                          type="number"
                          value={values.min}
                          onChange={(e) => handleInputChange(`thresholds.${String(sensor)}.min` as NestedKeyOf<PlantProfile>, Number(e.target.value))}
                          fullWidth
                          required
                          variant="outlined"
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          label="Optimal"
                          type="number"
                          value={values.optimal}
                          onChange={(e) => handleInputChange(`thresholds.${String(sensor)}.optimal` as NestedKeyOf<PlantProfile>, Number(e.target.value))}
                          fullWidth
                          required
                          variant="outlined"
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          label="Maximum"
                          type="number"
                          value={values.max}
                          onChange={(e) => handleInputChange(`thresholds.${String(sensor)}.max` as NestedKeyOf<PlantProfile>, Number(e.target.value))}
                          fullWidth
                          required
                          variant="outlined"
                          size="small"
                        />
                      </Grid>
                    </Grid>
                    
                    <Slider
                      value={[values.min, values.optimal, values.max]}
                      onChange={(_, newValue) => {
                        if (Array.isArray(newValue) && newValue.length === 3) {
                          const defaultValue = sensor === 'light' ? 0 : -10;
                          const [min = defaultValue, optimal = defaultValue, max = defaultValue] = newValue.map(v => Number(v));
                          handleInputChange(`thresholds.${String(sensor)}.min` as NestedKeyOf<PlantProfile>, min);
                          handleInputChange(`thresholds.${String(sensor)}.optimal` as NestedKeyOf<PlantProfile>, optimal);
                          handleInputChange(`thresholds.${String(sensor)}.max` as NestedKeyOf<PlantProfile>, max);
                        }
                      }}
                      min={sensor === 'light' ? 0 : -10}
                      max={sensor === 'light' ? 10000 : 100}
                      step={sensor === 'light' ? 100 : 1}
                      valueLabelDisplay="auto"
                      marks
                      sx={{ mt: 2 }}
                    />
                  </Paper>
                ))}

                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
                  <Button
                    variant="outlined"
                    onClick={() => setTabValue(0)}
                    size="large"
                  >
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => setTabValue(2)}
                    disabled={!isThresholdsComplete}
                    size="large"
                  >
                    Next: Growth Stages
                  </Button>
                </Box>
              </Box>
            </TabPanel>

            {/* Growth Stages Tab */}
            <TabPanel value={tabValue} index={2}>
              <Box sx={{ maxWidth: 800, mx: 'auto' }}>
                <Typography variant="h6" gutterBottom className="flex items-center">
                  Growth Stages
                  <Tooltip title="Configure settings for each growth stage">
                    <IconButton size="small" sx={{ ml: 1 }}>
                      <InfoOutlined fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Set duration and environmental preferences for each growth phase
                </Typography>

                {Object.entries(formData.growthStages).map(([stage, data]) => (
                  <Accordion key={stage} sx={{ mb: 2 }}>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Typography variant="h6" sx={{ textTransform: 'capitalize' }}>
                        {stage} Stage
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                          <TextField
                            label="Duration (days)"
                            type="number"
                            value={data.duration}
                            onChange={(e) => handleInputChange(`growthStages.${stage}.duration` as NestedKeyOf<PlantProfile>, Number(e.target.value))}
                            fullWidth
                            required
                            variant="outlined"
                            helperText="How long this stage typically lasts"
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle2" sx={{ mb: 2 }}>
                            Environmental Modifiers
                          </Typography>
                          <Grid container spacing={2}>
                            {Object.entries(data.modifiers as GrowthStageModifiers).map(([sensor, values]) => (
                              <Grid item xs={6} key={sensor}>
                                <TextField
                                  label={`${sensorNames[sensor as keyof typeof sensorNames]} Optimal`}
                                  type="number"
                                  value={values.optimal}
                                  onChange={(e) => handleInputChange(
                                    `growthStages.${stage}.modifiers.${sensor}.optimal` as NestedKeyOf<PlantProfile>,
                                    Number(e.target.value)
                                  )}
                                  fullWidth
                                  variant="outlined"
                                  size="small"
                                  InputProps={{
                                    startAdornment: sensorIcons[sensor as keyof typeof sensorIcons]
                                  }}
                                />
                              </Grid>
                            ))}
                          </Grid>
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                ))}

                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
                  <Button
                    variant="outlined"
                    onClick={() => setTabValue(1)}
                    size="large"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                  >
                    {initialData ? 'Save Changes' : 'Create Plant Profile'}
                  </Button>
                </Box>
              </Box>
            </TabPanel>
          </Box>
        </Card>
      </form>

      {/* Import Configuration Dialog */}
      <Dialog open={importDialogOpen} onClose={() => setImportDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Import Plant Configuration</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Upload a JSON configuration file for a plant. The file should contain all required fields including name, scientific name, thresholds, and growth stages.
          </Typography>
          
          {importError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {importError}
            </Alert>
          )}
          
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
            <Button
              variant="outlined"
              startIcon={<Upload />}
              onClick={() => fileInputRef.current?.click()}
              size="large"
            >
              Choose JSON File
            </Button>
          </Box>
          
          <Typography variant="caption" color="text.secondary">
            <strong>Expected JSON format:</strong>
            <pre style={{ fontSize: '0.75rem', backgroundColor: '#f5f5f5', padding: '8px', borderRadius: '4px', marginTop: '8px' }}>
{`{
  "name": "Plant Name",
  "scientificName": "Scientific Name",
  "thresholds": {
    "temperature": { "min": 15, "max": 30, "optimal": 22, "unit": "°C" },
    "humidity": { "min": 40, "max": 80, "optimal": 60, "unit": "%" },
    "light": { "min": 2000, "max": 6000, "optimal": 4000, "unit": "lux" },
    "soilMoisture": { "min": 40, "max": 80, "optimal": 60, "unit": "%" }
  },
  "growthStages": {
    "seedling": { "duration": 21, "modifiers": { ... } },
    "vegetative": { "duration": 30, "modifiers": { ... } },
    "flowering": { "duration": 40, "modifiers": { ... } },
    "fruiting": { "duration": 50, "modifiers": { ... } }
  }
}`}
            </pre>
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImportDialogOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}; 