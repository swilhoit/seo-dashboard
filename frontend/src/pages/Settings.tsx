import React, { useState, useEffect } from 'react';
import {
  Box, Typography, TextField, Button, Grid, Card, CardContent,
  Alert, Snackbar, Divider, FormControlLabel, Switch, InputAdornment,
  IconButton
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import SaveIcon from '@mui/icons-material/Save';
import VpnKeyIcon from '@mui/icons-material/VpnKey';

const Settings: React.FC = () => {
  const [apiUsername, setApiUsername] = useState('');
  const [apiPassword, setApiPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  const [exportFormat, setExportFormat] = useState('csv');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  // Load settings on component mount
  useEffect(() => {
    // In a real app, this would load from localStorage or a backend API
    const savedUsername = localStorage.getItem('dataforseo_username');
    const savedPassword = localStorage.getItem('dataforseo_password');
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    const savedAutoSave = localStorage.getItem('autoSave') !== 'false';
    const savedExportFormat = localStorage.getItem('exportFormat') || 'csv';
    
    if (savedUsername) setApiUsername(savedUsername);
    if (savedPassword) setApiPassword(savedPassword);
    setDarkMode(savedDarkMode);
    setAutoSave(savedAutoSave);
    setExportFormat(savedExportFormat);
  }, []);

  const handleSaveSettings = () => {
    // Save API credentials
    localStorage.setItem('dataforseo_username', apiUsername);
    localStorage.setItem('dataforseo_password', apiPassword);
    localStorage.setItem('darkMode', darkMode.toString());
    localStorage.setItem('autoSave', autoSave.toString());
    localStorage.setItem('exportFormat', exportFormat);
    
    // Display success message
    setSnackbarMessage('Settings saved successfully');
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
  };

  const handleTestConnection = async () => {
    if (!apiUsername || !apiPassword) {
      setSnackbarMessage('Please enter your API credentials first');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }
    
    try {
      // Make an actual API call to test the connection
      const response = await fetch('http://localhost:5001/api/test-connection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: apiUsername,
          password: apiPassword
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSnackbarMessage('API connection successful');
        setSnackbarSeverity('success');
      } else {
        setSnackbarMessage(`API connection failed: ${data.message || 'Unknown error'}`);
        setSnackbarSeverity('error');
      }
    } catch (error) {
      console.error('Connection test error:', error);
      setSnackbarMessage('API connection failed. Please check your network connection.');
      setSnackbarSeverity('error');
    }
    
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                DataForSEO API Configuration
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  label="API Username"
                  value={apiUsername}
                  onChange={(e) => setApiUsername(e.target.value)}
                  margin="normal"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <VpnKeyIcon />
                      </InputAdornment>
                    ),
                  }}
                />
                
                <TextField
                  fullWidth
                  label="API Password"
                  type={showPassword ? 'text' : 'password'}
                  value={apiPassword}
                  onChange={(e) => setApiPassword(e.target.value)}
                  margin="normal"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                
                <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={handleSaveSettings}
                    startIcon={<SaveIcon />}
                  >
                    Save Credentials
                  </Button>
                  
                  <Button 
                    variant="outlined"
                    onClick={handleTestConnection}
                  >
                    Test Connection
                  </Button>
                </Box>
              </Box>
              
              <Divider sx={{ my: 3 }} />
              
              <Typography variant="subtitle1" gutterBottom>
                API Usage
              </Typography>
              
              <Typography variant="body2" color="textSecondary" paragraph>
                Your current DataForSEO API usage:
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2">Daily Limit:</Typography>
                  <Typography variant="h6">5,000 requests</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">Used Today:</Typography>
                  <Typography variant="h6">847 requests</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Application Settings
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <FormControlLabel
                  control={
                    <Switch 
                      checked={darkMode}
                      onChange={(e) => setDarkMode(e.target.checked)}
                    />
                  }
                  label="Dark Mode"
                />
                
                <FormControlLabel
                  control={
                    <Switch 
                      checked={autoSave}
                      onChange={(e) => setAutoSave(e.target.checked)}
                    />
                  }
                  label="Auto-save keyword lists"
                />
                
                <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                  Export Format
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button 
                    variant={exportFormat === 'csv' ? 'contained' : 'outlined'}
                    onClick={() => setExportFormat('csv')}
                  >
                    CSV
                  </Button>
                  <Button 
                    variant={exportFormat === 'excel' ? 'contained' : 'outlined'}
                    onClick={() => setExportFormat('excel')}
                  >
                    Excel
                  </Button>
                  <Button 
                    variant={exportFormat === 'json' ? 'contained' : 'outlined'}
                    onClick={() => setExportFormat('json')}
                  >
                    JSON
                  </Button>
                </Box>
              </Box>
              
              <Divider sx={{ my: 3 }} />
              
              <Typography variant="subtitle1" gutterBottom>
                Data Management
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                <Button variant="outlined" color="error">
                  Clear Local Cache
                </Button>
                
                <Button variant="outlined" color="error">
                  Reset to Default Settings
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                About
              </Typography>
              
              <Typography variant="body2" paragraph>
                SEO Dashboard v1.0.0
              </Typography>
              
              <Typography variant="body2" paragraph>
                Built with React and Material-UI. Powered by DataForSEO API.
              </Typography>
              
              <Typography variant="body2">
                © 2025 SEO Dashboard. All rights reserved.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Settings;
