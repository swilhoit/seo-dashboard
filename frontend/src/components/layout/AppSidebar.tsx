import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import SearchIcon from '@mui/icons-material/Search';
import LanguageIcon from '@mui/icons-material/Language';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import BarChartIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';

const drawerWidth = 240;

interface AppSidebarProps {
  open: boolean;
}

const AppSidebar: React.FC<AppSidebarProps> = ({ open }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: 'Keyword Research', icon: <SearchIcon />, path: '/' },
    { text: 'Domain Analytics', icon: <LanguageIcon />, path: '/domain-analytics' },
    { text: 'Competitor Analysis', icon: <CompareArrowsIcon />, path: '/competitor-analysis' },
    { text: 'SERP Analysis', icon: <BarChartIcon />, path: '/serp-analysis' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' }
  ];

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={open}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(20px)',
          borderRight: '1px solid rgba(0, 0, 0, 0.05)',
        },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto', p: 2 }}>
        <List sx={{ '& .MuiListItem-root': { mb: 1 } }}>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => navigate(item.path)}
                sx={{
                  borderRadius: '12px',
                  mb: 0.5,
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(0, 122, 255, 0.1)',
                    color: '#007AFF',
                    '& .MuiListItemIcon-root': {
                      color: '#007AFF',
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(0, 122, 255, 0.15)',
                    },
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(0, 122, 255, 0.05)',
                  },
                  px: 2,
                  py: 1.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    color: location.pathname === item.path ? '#007AFF' : '#86868B',
                    minWidth: 40,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text}
                  sx={{
                    '& .MuiTypography-root': {
                      fontWeight: location.pathname === item.path ? 600 : 500,
                      fontSize: '0.95rem',
                      color: location.pathname === item.path ? '#007AFF' : '#1D1D1F',
                    }
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default AppSidebar;
