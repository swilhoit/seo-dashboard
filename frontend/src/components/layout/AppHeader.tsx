import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

interface AppHeaderProps {
  open: boolean;
  toggleDrawer: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ open, toggleDrawer }) => {
  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
        boxShadow: '0 2px 20px rgba(0, 0, 0, 0.05)',
      }}
    >
      <Toolbar sx={{ minHeight: '72px !important' }}>
        <IconButton
          edge="start"
          aria-label="open drawer"
          onClick={toggleDrawer}
          sx={{ 
            marginRight: 2,
            color: '#1D1D1F',
            '&:hover': {
              backgroundColor: 'rgba(0, 122, 255, 0.1)',
            }
          }}
        >
          <MenuIcon />
        </IconButton>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              fontWeight: 600,
              color: 'white',
            }}
          >
            S
          </Box>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ 
              display: { xs: 'none', sm: 'block' },
              color: '#1D1D1F',
              fontWeight: 600,
              fontSize: '1.25rem',
              letterSpacing: '-0.01em',
            }}
          >
            SEO Analytics
          </Typography>
        </Box>

        <Box sx={{ flexGrow: 1 }} />
        
        <Search>
          <SearchIconWrapper>
            <SearchIcon sx={{ color: '#86868B' }} />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search insights..."
            inputProps={{ 'aria-label': 'search' }}
            sx={{ color: '#1D1D1F' }}
          />
        </Search>
        
        <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
          <IconButton 
            sx={{ 
              color: '#86868B',
              '&:hover': {
                backgroundColor: 'rgba(0, 122, 255, 0.1)',
                color: '#007AFF',
              }
            }}
          >
            <Badge badgeContent={2} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton
            edge="end"
            aria-label="account of current user"
            sx={{ 
              color: '#86868B',
              '&:hover': {
                backgroundColor: 'rgba(0, 122, 255, 0.1)',
                color: '#007AFF',
              }
            }}
          >
            <AccountCircle />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AppHeader;
