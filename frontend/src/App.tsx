import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';

// Layout components
import AppHeader from './components/layout/AppHeader';
import AppSidebar from './components/layout/AppSidebar';

// Pages
import KeywordResearch from './pages/KeywordResearch';
import DomainAnalytics from './pages/DomainAnalytics';
import CompetitorAnalysis from './pages/CompetitorAnalysis';
import SerpAnalysis from './pages/SerpAnalysis';
import Settings from './pages/Settings';

// Create theme with Apple-inspired design
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#007AFF',
      light: '#5AC8FA',
      dark: '#0051D5',
    },
    secondary: {
      main: '#FF3B30',
      light: '#FF6961',
      dark: '#C7001E',
    },
    background: {
      default: '#F2F2F7',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1D1D1F',
      secondary: '#86868B',
    },
    grey: {
      50: '#F2F2F7',
      100: '#E5E5EA',
      200: '#D1D1D6',
      300: '#C7C7CC',
      400: '#AEAEB2',
      500: '#8E8E93',
      600: '#636366',
      700: '#48484A',
      800: '#3A3A3C',
      900: '#1D1D1F',
    },
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif',
    h1: {
      fontSize: '3rem',
      fontWeight: 700,
      letterSpacing: '-0.02em',
      color: '#1D1D1F',
    },
    h2: {
      fontSize: '2.5rem',
      fontWeight: 600,
      letterSpacing: '-0.01em',
      color: '#1D1D1F',
    },
    h3: {
      fontSize: '2rem',
      fontWeight: 600,
      letterSpacing: '-0.01em',
      color: '#1D1D1F',
    },
    h4: {
      fontSize: '1.75rem',
      fontWeight: 600,
      letterSpacing: '-0.005em',
      color: '#1D1D1F',
    },
    h5: {
      fontSize: '1.5rem',
      fontWeight: 600,
      color: '#1D1D1F',
    },
    h6: {
      fontSize: '1.25rem',
      fontWeight: 600,
      color: '#1D1D1F',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
      color: '#1D1D1F',
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.43,
      color: '#86868B',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
      letterSpacing: '0.01em',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
          border: '1px solid rgba(0, 0, 0, 0.05)',
          backdropFilter: 'blur(20px)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '12px 24px',
          fontSize: '1rem',
          fontWeight: 500,
          textTransform: 'none',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 122, 255, 0.3)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #0051D5 0%, #007AFF 100%)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(20px)',
            '& fieldset': {
              borderColor: 'rgba(0, 0, 0, 0.1)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(0, 122, 255, 0.5)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#007AFF',
              borderWidth: 2,
            },
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          borderRadius: 12,
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(0, 0, 0, 0.05)',
        },
        indicator: {
          backgroundColor: '#007AFF',
          height: 3,
          borderRadius: 1.5,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          fontSize: '1rem',
          color: '#86868B',
          '&.Mui-selected': {
            color: '#007AFF',
            fontWeight: 600,
          },
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: '1px solid rgba(0, 0, 0, 0.05)',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(20px)',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(242, 242, 247, 0.5)',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
          color: '#1D1D1F',
          borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
        },
        body: {
          borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
  },
});

function App() {
  const [open, setOpen] = React.useState(true);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', height: '100vh' }}>
        <AppHeader open={open} toggleDrawer={toggleDrawer} />
        <AppSidebar open={open} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: { xs: 2, sm: 3, md: 4 },
            mt: { xs: '72px', sm: '72px' },
            overflow: 'auto',
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #F2F2F7 0%, #E5E5EA 100%)',
          }}
        >
          <Routes>
            <Route path="/" element={<KeywordResearch />} />
            <Route path="/keyword-research" element={<KeywordResearch />} />
            <Route path="/domain-analytics" element={<DomainAnalytics />} />
            <Route path="/competitor-analysis" element={<CompetitorAnalysis />} />
            <Route path="/serp-analysis" element={<SerpAnalysis />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
