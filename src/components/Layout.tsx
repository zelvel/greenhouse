import { useState, useEffect } from 'react';
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material';
import {
  Menu as MenuIcon,
  ShowChart,
  Settings,
  Air,
  Thermostat,
  LocalFlorist,
} from '@mui/icons-material';
import { Link, useLocation, Outlet } from 'react-router-dom';

const drawerWidth = 240;

const menuItems = [
  { text: 'Plants', icon: <LocalFlorist />, path: '/' },
  { text: 'Sensors', icon: <Thermostat />, path: '/sensors' },
  { text: 'Actuators', icon: <Air />, path: '/actuators' },
  { text: 'Analytics', icon: <ShowChart />, path: '/analytics' },
  { text: 'Settings', icon: <Settings />, path: '/settings' },
];

export const Layout = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Update document title based on current page
  useEffect(() => {
    const currentPage = menuItems.find((item) => item.path === location.pathname)?.text || 'Home';
    document.title = `GreenhouZ - ${currentPage}`;
  }, [location.pathname]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <img 
            src="/logo.png" 
            alt="Greenhouse Logo" 
            style={{ 
              height: 32, 
              width: 'auto',
              borderRadius: '4px'
            }} 
          />
          <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold' }}>
            GreenhouZ
          </Typography>
        </Box>
      </Toolbar>
      <List>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItemButton
              key={item.text}
              component={Link}
              to={item.path}
              sx={{
                bgcolor: isActive ? 'primary.light' : 'transparent',
                color: isActive ? 'primary.contrastText' : 'text.primary',
                '&:hover': {
                  bgcolor: isActive ? 'primary.light' : 'action.hover',
                },
                '& .MuiListItemIcon-root': {
                  color: isActive ? 'primary.contrastText' : 'inherit',
                },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          );
        })}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <img 
              src="/logo.png" 
              alt="Greenhouse Logo" 
              style={{ 
                height: 28, 
                width: 'auto',
                borderRadius: '4px'
              }} 
            />
            <Typography variant="h6" noWrap component="div">
              {menuItems.find((item) => item.path === location.pathname)?.text || 'Greenhouse'}
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}; 