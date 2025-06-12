import React from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale,
  LinearScale,
  BarElement, 
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Sample data for charts
const keywordVolumeData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Search Volume',
      data: [4000, 3500, 3800, 4200, 4500, 4300],
      backgroundColor: 'rgba(25, 118, 210, 0.6)',
    },
  ],
};

const rankingPositionsData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Avg. Position',
      data: [12, 11, 9, 7, 6, 5],
      borderColor: 'rgb(220, 0, 78)',
      tension: 0.2,
      fill: false,
    },
  ],
};

const trafficSourcesData = {
  labels: ['Organic', 'Direct', 'Referral', 'Social', 'Email'],
  datasets: [
    {
      data: [65, 15, 10, 7, 3],
      backgroundColor: [
        'rgba(25, 118, 210, 0.7)',
        'rgba(220, 0, 78, 0.7)',
        'rgba(255, 193, 7, 0.7)',
        'rgba(76, 175, 80, 0.7)',
        'rgba(121, 85, 72, 0.7)',
      ],
      borderWidth: 1,
    },
  ],
};

const Dashboard: React.FC = () => {
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
        <Button variant="contained" color="primary">
          Generate Report
        </Button>
      </Box>
      
      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Keywords Tracked
              </Typography>
              <Typography variant="h3">128</Typography>
              <Typography color="textSecondary" sx={{ display: 'flex', alignItems: 'center' }}>
                +12% from last month
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Average Position
              </Typography>
              <Typography variant="h3">5.2</Typography>
              <Typography color="textSecondary" sx={{ display: 'flex', alignItems: 'center' }}>
                +2.3 from last month
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Organic Traffic
              </Typography>
              <Typography variant="h3">24.5K</Typography>
              <Typography color="textSecondary" sx={{ display: 'flex', alignItems: 'center' }}>
                +18% from last month
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Backlinks
              </Typography>
              <Typography variant="h3">1,245</Typography>
              <Typography color="textSecondary" sx={{ display: 'flex', alignItems: 'center' }}>
                +53 from last month
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Charts */}
        <Grid item xs={12} md={8}>
          <Card sx={{ height: '100%' }}>
            <CardHeader title="Keyword Performance" />
            <CardContent>
              <Box sx={{ height: 300 }}>
                <Line 
                  data={rankingPositionsData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        reverse: true,
                        min: 1,
                        title: {
                          display: true,
                          text: 'Position'
                        }
                      }
                    }
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardHeader title="Traffic Sources" />
            <CardContent>
              <Box sx={{ height: 300, display: 'flex', justifyContent: 'center' }}>
                <Doughnut 
                  data={trafficSourcesData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12}>
          <Card>
            <CardHeader title="Keyword Volume Trends" />
            <CardContent>
              <Box sx={{ height: 300 }}>
                <Bar 
                  data={keywordVolumeData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
