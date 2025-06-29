import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Switch,
  Divider,
  Button,
  Alert,
} from '@mui/material';
import {
  Notifications,
  DataUsage,
  Security,
  Tune,
  CloudSync,
  Update,
} from '@mui/icons-material';

export const Settings = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Settings
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        Settings functionality will be implemented in a future update.
        The controls below are for demonstration purposes only.
      </Alert>

      <Card>
        <CardContent>
          <List>
            {/* Notifications */}
            <ListItem>
              <ListItemIcon>
                <Notifications />
              </ListItemIcon>
              <ListItemText
                primary="Push Notifications"
                secondary="Receive alerts for critical events"
              />
              <ListItemSecondaryAction>
                <Switch disabled />
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />

            {/* Data Collection */}
            <ListItem>
              <ListItemIcon>
                <DataUsage />
              </ListItemIcon>
              <ListItemText
                primary="Data Collection"
                secondary="Sensor reading frequency and storage duration"
              />
              <ListItemSecondaryAction>
                <Button variant="outlined" size="small" disabled>
                  Configure
                </Button>
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />

            {/* Security */}
            <ListItem>
              <ListItemIcon>
                <Security />
              </ListItemIcon>
              <ListItemText
                primary="Security"
                secondary="Access control and authentication settings"
              />
              <ListItemSecondaryAction>
                <Button variant="outlined" size="small" disabled>
                  Manage
                </Button>
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />

            {/* System Configuration */}
            <ListItem>
              <ListItemIcon>
                <Tune />
              </ListItemIcon>
              <ListItemText
                primary="System Configuration"
                secondary="Hardware settings and calibration"
              />
              <ListItemSecondaryAction>
                <Button variant="outlined" size="small" disabled>
                  Configure
                </Button>
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />

            {/* Backup & Sync */}
            <ListItem>
              <ListItemIcon>
                <CloudSync />
              </ListItemIcon>
              <ListItemText
                primary="Backup & Sync"
                secondary="Cloud backup and data synchronization"
              />
              <ListItemSecondaryAction>
                <Button variant="outlined" size="small" disabled>
                  Setup
                </Button>
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />

            {/* Software Update */}
            <ListItem>
              <ListItemIcon>
                <Update />
              </ListItemIcon>
              <ListItemText
                primary="Software Update"
                secondary="Check for system updates"
              />
              <ListItemSecondaryAction>
                <Button variant="outlined" size="small" disabled>
                  Check
                </Button>
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </CardContent>
      </Card>
    </Box>
  );
}; 