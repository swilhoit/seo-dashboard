import React, { useState, useEffect } from 'react';
import { competitorAnalysisApi } from '../services/api';
import {
  Box, Typography, TextField, Button, Grid, Card, CardContent,
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, CircularProgress, Chip, InputAdornment,
  Autocomplete, FormControl, FormLabel, RadioGroup, 
  FormControlLabel, Radio
} from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Define competitor data type
interface CompetitorData {
  domain: string;
  organicTraffic: number;
  organicKeywords: number;
  backlinks: number;
  trafficCost: number;
  socialSignals: {
    facebook: number;
    twitter: number;
    linkedin: number;
  };
  commonKeywords: string[];
};

// Define keyword overlap type
interface KeywordOverlap {
  keyword: string;
  yourRank: number;
  competitorRank: number;
  searchVolume: number;
  difficulty: number;
};

const CompetitorAnalysis: React.FC = () => {
  const [mainDomain, setMainDomain] = useState('');
  const [competitorDomain, setCompetitorDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [comparisonData, setComparisonData] = useState<{ main: CompetitorData, competitor: CompetitorData } | null>(null);
  const [keywordOverlaps, setKeywordOverlaps] = useState<KeywordOverlap[]>([]);
  const [gapKeywords, setGapKeywords] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Handle analyzing competitors
  const handleCompare = () => {
    if (!mainDomain || !competitorDomain) return;
    
    setLoading(true);
    setError(null);
    
    // Call the real competitor analysis APIs
    Promise.all([
      competitorAnalysisApi.getDomainComparison(mainDomain, competitorDomain),
      competitorAnalysisApi.getKeywordOverlap(mainDomain, competitorDomain),
      competitorAnalysisApi.getGapAnalysis(mainDomain, competitorDomain)
    ])
      .then(([comparisonResponse, overlapResponse, gapResponse]) => {
        // Process domain comparison data - handle actual DataForSEO response format
        if (comparisonResponse.data && comparisonResponse.data.domain1 && comparisonResponse.data.domain2) {
          const domain1Data = comparisonResponse.data.domain1;
          const domain2Data = comparisonResponse.data.domain2;
          
          // Extract metrics from DataForSEO domain rank overview response
          const domain1Items = domain1Data.tasks?.[0]?.result?.[0]?.items?.[0];
          const domain2Items = domain2Data.tasks?.[0]?.result?.[0]?.items?.[0];
          
          const mainDomainData: CompetitorData = {
            domain: mainDomain,
            organicTraffic: domain1Items?.metrics?.organic?.etv || 0,
            organicKeywords: domain1Items?.metrics?.organic?.count || 0,
            backlinks: domain1Items?.metrics?.organic?.pos_1 || 0, // Using pos_1 as proxy for backlinks
            trafficCost: domain1Items?.metrics?.organic?.estimated_paid_traffic_cost || 0,
            socialSignals: {
              facebook: 0,
              twitter: 0,
              linkedin: 0
            },
            commonKeywords: []
          };
          
          const competitorDomainData: CompetitorData = {
            domain: competitorDomain,
            organicTraffic: domain2Items?.metrics?.organic?.etv || 0,
            organicKeywords: domain2Items?.metrics?.organic?.count || 0,
            backlinks: domain2Items?.metrics?.organic?.pos_1 || 0, // Using pos_1 as proxy for backlinks
            trafficCost: domain2Items?.metrics?.organic?.estimated_paid_traffic_cost || 0,
            socialSignals: {
              facebook: 0,
              twitter: 0,
              linkedin: 0
            },
            commonKeywords: []
          };
          
          setComparisonData({ 
            main: mainDomainData, 
            competitor: competitorDomainData 
          });
        }
        
        // Process keyword overlap data - handle DataForSEO domain intersection response
        if (overlapResponse.data && overlapResponse.data.tasks && overlapResponse.data.tasks[0].result && overlapResponse.data.tasks[0].result[0].items) {
          const overlapItems = overlapResponse.data.tasks[0].result[0].items;
          
          // Transform to KeywordOverlap format using actual DataForSEO intersection response
          const keywordsOverlapData: KeywordOverlap[] = overlapItems.map((item: any) => ({
            keyword: item.keyword_data?.keyword || '',
            yourRank: item.first_domain_serp_element?.rank_absolute || 0,
            competitorRank: item.second_domain_serp_element?.rank_absolute || 0,
            searchVolume: item.keyword_data?.keyword_info?.search_volume || 0,
            difficulty: item.keyword_data?.keyword_properties?.keyword_difficulty || 0
          })).filter((item: KeywordOverlap) => item.keyword.trim() !== ''); // Filter out empty keywords
          
          setKeywordOverlaps(keywordsOverlapData);
        }
        
        // Process gap analysis data - keywords competitor ranks for but we don't
        if (gapResponse.data && gapResponse.data.tasks && gapResponse.data.tasks[0].result && gapResponse.data.tasks[0].result[0].items) {
          const gapItems = gapResponse.data.tasks[0].result[0].items;
          const gapKeywordsData = gapItems
            .map((item: any) => ({
              keyword: item.keyword_data?.keyword || '',
              competitorRank: item.second_domain_serp_element?.rank_absolute || 0,
              searchVolume: item.keyword_data?.keyword_info?.search_volume || 0,
              difficulty: item.keyword_data?.keyword_properties?.keyword_difficulty || 0,
              cpc: item.keyword_data?.keyword_info?.cpc || 0
            }))
            .filter((item: any) => item.keyword.trim() !== '' && !item.first_domain_serp_element); // Only keywords where main domain doesn't rank
          setGapKeywords(gapKeywordsData);
        }
      })
      .catch(error => {
        console.error('Error fetching competitor data:', error);
        setError('Error fetching competitor data. Please check the domains and try again.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Box sx={{ p: { xs: 0, sm: 2 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ fontWeight: 700, color: '#1D1D1F', mb: 1 }}>
          Competitor Analysis
        </Typography>
        <Typography variant="body1" sx={{ color: '#86868B', fontSize: '1.1rem' }}>
          Analyze your competitors' organic search strategies and discover new opportunities
        </Typography>
      </Box>
      
      <Card sx={{ mb: 4, borderRadius: 3, boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)' }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#1D1D1F', mb: 3 }}>
            Analyze Competitors
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Your Domain"
                value={mainDomain}
                onChange={(e) => setMainDomain(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LanguageIcon sx={{ color: '#86868B' }} />
                    </InputAdornment>
                  ),
                }}
                placeholder="e.g., yourdomain.com"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    fontSize: '1rem',
                    '& input': {
                      py: 2
                    }
                  }
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Competitor Domain"
                value={competitorDomain}
                onChange={(e) => setCompetitorDomain(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CompareArrowsIcon sx={{ color: '#86868B' }} />
                    </InputAdornment>
                  ),
                }}
                placeholder="e.g., competitor.com"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    fontSize: '1rem',
                    '& input': {
                      py: 2
                    }
                  }
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleCompare}
                disabled={loading || !mainDomain || !competitorDomain}
                sx={{
                  py: 2,
                  px: 4,
                  fontSize: '1rem',
                  fontWeight: 600,
                  borderRadius: 2,
                  textTransform: 'none'
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Compare Domains'}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      
      {error && (
        <Card sx={{ 
          mb: 3, 
          borderRadius: 2, 
          border: '1px solid #FF3B30',
          backgroundColor: 'rgba(255, 59, 48, 0.05)'
        }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="body1" sx={{ color: '#FF3B30', fontWeight: 500 }}>
              {error}
            </Typography>
          </CardContent>
        </Card>
      )}
      
      {comparisonData && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)' }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, color: '#1D1D1F', mb: 3 }}>Competitor Comparison</Typography>
                <Box sx={{ height: 400, mt: 2 }}>
                  <Bar 
                    key={`comparison-${mainDomain}-${competitorDomain}`}
                    data={{
                      labels: ['Traffic', 'Keywords', 'Backlinks'],
                      datasets: [
                        {
                          label: mainDomain,
                          data: [Math.round(comparisonData.main.organicTraffic), comparisonData.main.organicKeywords, comparisonData.main.backlinks],
                          backgroundColor: 'rgba(0, 122, 255, 0.8)',
                          borderRadius: 8,
                        },
                        {
                          label: competitorDomain,
                          data: [Math.round(comparisonData.competitor.organicTraffic), comparisonData.competitor.organicKeywords, comparisonData.competitor.backlinks],
                          backgroundColor: 'rgba(90, 200, 250, 0.8)',
                          borderRadius: 8,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        title: {
                          display: true,
                          text: 'Competitive Analysis'
                        }
                      },
                      scales: {
                        y: {
                          beginAtZero: true
                        }
                      }
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)' }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, color: '#1D1D1F', mb: 3 }}>Competitors Overview</Typography>
                
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Domain</TableCell>
                        <TableCell align="right">Organic Traffic</TableCell>
                        <TableCell align="right">Organic Keywords</TableCell>
                        <TableCell align="right">Backlinks</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow key={comparisonData.main.domain}>
                        <TableCell component="th" scope="row">
                          {comparisonData.main.domain}
                        </TableCell>
                        <TableCell align="right">{Math.round(comparisonData.main.organicTraffic).toLocaleString()}</TableCell>
                        <TableCell align="right">{comparisonData.main.organicKeywords.toLocaleString()}</TableCell>
                        <TableCell align="right">{comparisonData.main.backlinks.toLocaleString()}</TableCell>
                      </TableRow>
                      <TableRow key={comparisonData.competitor.domain}>
                        <TableCell component="th" scope="row">
                          {comparisonData.competitor.domain}
                        </TableCell>
                        <TableCell align="right">{Math.round(comparisonData.competitor.organicTraffic).toLocaleString()}</TableCell>
                        <TableCell align="right">{comparisonData.competitor.organicKeywords.toLocaleString()}</TableCell>
                        <TableCell align="right">{comparisonData.competitor.backlinks.toLocaleString()}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)' }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, color: '#1D1D1F', mb: 1 }}>Common Keywords</Typography>
                <Typography variant="body1" sx={{ color: '#86868B', mb: 3 }}>
                  Keywords that you and your competitors both rank for.
                </Typography>
                
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Keyword</TableCell>
                        <TableCell align="right">Search Volume</TableCell>
                        <TableCell align="center">Your Position</TableCell>
                        <TableCell align="center">Competitor Position</TableCell>
                        <TableCell align="center">Difficulty</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {keywordOverlaps.map((row: KeywordOverlap) => (
                        <TableRow key={row.keyword}>
                          <TableCell component="th" scope="row">
                            {row.keyword}
                          </TableCell>
                          <TableCell align="right">{row.searchVolume.toLocaleString()}</TableCell>
                          <TableCell align="center">
                            <Chip label={row.yourRank} color="primary" size="small" />
                          </TableCell>
                          <TableCell align="center">{row.competitorRank}</TableCell>
                          <TableCell align="center">{row.difficulty}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)' }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, color: '#1D1D1F', mb: 1 }}>Gap Analysis</Typography>
                <Typography variant="body1" sx={{ color: '#86868B', mb: 3 }}>
                  Keywords that your competitors rank for, but you don't.
                </Typography>
                
                <TableContainer sx={{ mt: 2 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Keyword</TableCell>
                        <TableCell align="right">Search Volume</TableCell>
                        <TableCell align="center">Competitor Position</TableCell>
                        <TableCell align="right">CPC ($)</TableCell>
                        <TableCell align="right">Difficulty</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {gapKeywords.map((row, index) => (
                        <TableRow key={`gap-${index}`}>
                          <TableCell component="th" scope="row">
                            {row.keyword}
                          </TableCell>
                          <TableCell align="right">{row.searchVolume.toLocaleString()}</TableCell>
                          <TableCell align="center">
                            <Chip label={row.competitorRank} color="secondary" size="small" />
                          </TableCell>
                          <TableCell align="right">${row.cpc.toFixed(2)}</TableCell>
                          <TableCell align="right">{row.difficulty}</TableCell>
                        </TableRow>
                      ))}
                      {gapKeywords.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                            <Typography variant="body1">
                              {loading ? 'Loading gap analysis...' : 'No gap opportunities found or data not available.'}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
      
      {!comparisonData && !loading && (
        <Card sx={{ borderRadius: 3, boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)' }}>
          <CardContent sx={{ textAlign: 'center', py: 8, px: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 600, color: '#1D1D1F', mb: 2 }}>
              Enter your domain to analyze competitors
            </Typography>
            <Typography variant="body1" sx={{ color: '#86868B', fontSize: '1.1rem', maxWidth: 600, mx: 'auto' }}>
              Identify your top competitors and analyze their organic search strategies.
              Discover common keywords, gaps, and opportunities to improve your rankings.
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default CompetitorAnalysis;
