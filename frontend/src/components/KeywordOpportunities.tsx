import React from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Chip
} from '@mui/material';

interface KeywordData {
  keyword: string;
  searchVolume: number;
  cpc: number;
  competition: number;
  difficulty: number;
  trend: 'up' | 'down' | 'stable';
  relevanceScore?: number;
}

interface KeywordOpportunitiesProps {
  keywords: KeywordData[];
}

const KeywordOpportunities: React.FC<KeywordOpportunitiesProps> = ({ keywords }) => {
  if (keywords.length === 0) return null;

  return (
    <Card sx={{ mb: 4, borderRadius: 3, boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)' }}>
      <CardContent sx={{ p: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, color: '#1D1D1F', mb: 3 }}>
          Keyword Opportunities
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Box sx={{ 
              p: 3, 
              borderRadius: 2, 
              backgroundColor: 'rgba(52, 199, 89, 0.1)',
              border: '1px solid rgba(52, 199, 89, 0.2)'
            }}>
              <Typography variant="h6" sx={{ color: '#34C759', mb: 1, fontWeight: 600 }}>
                Quick Wins
              </Typography>
              <Typography variant="body2" sx={{ color: '#86868B', mb: 2 }}>
                High volume, low competition keywords
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#1D1D1F' }}>
                {keywords.filter(kw => kw.searchVolume > 500 && kw.difficulty < 40).length}
              </Typography>
              <Typography variant="caption" sx={{ color: '#86868B' }}>
                opportunities found
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Box sx={{ 
              p: 3, 
              borderRadius: 2, 
              backgroundColor: 'rgba(0, 122, 255, 0.1)',
              border: '1px solid rgba(0, 122, 255, 0.2)'
            }}>
              <Typography variant="h6" sx={{ color: '#007AFF', mb: 1, fontWeight: 600 }}>
                Long-term Targets
              </Typography>
              <Typography variant="body2" sx={{ color: '#86868B', mb: 2 }}>
                High value keywords worth the investment
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#1D1D1F' }}>
                {keywords.filter(kw => kw.searchVolume > 1000 && kw.cpc > 2).length}
              </Typography>
              <Typography variant="caption" sx={{ color: '#86868B' }}>
                high-value targets
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Box sx={{ 
              p: 3, 
              borderRadius: 2, 
              backgroundColor: 'rgba(255, 149, 0, 0.1)',
              border: '1px solid rgba(255, 149, 0, 0.2)'
            }}>
              <Typography variant="h6" sx={{ color: '#FF9500', mb: 1, fontWeight: 600 }}>
                Content Ideas
              </Typography>
              <Typography variant="body2" sx={{ color: '#86868B', mb: 2 }}>
                Keywords with trending potential
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#1D1D1F' }}>
                {keywords.filter(kw => kw.trend === 'up').length}
              </Typography>
              <Typography variant="caption" sx={{ color: '#86868B' }}>
                trending keywords
              </Typography>
            </Box>
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#1D1D1F', mb: 2 }}>
            Top Opportunities
          </Typography>
          <TableContainer sx={{ borderRadius: 2, border: '1px solid rgba(0, 0, 0, 0.05)' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Keyword</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>Volume</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>Difficulty</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>CPC</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>Opportunity Score</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {keywords
                  .map(kw => ({
                    ...kw,
                    opportunityScore: ((kw.searchVolume / 1000) * (1 - kw.difficulty / 100) * kw.cpc).toFixed(1)
                  }))
                  .sort((a, b) => parseFloat(b.opportunityScore) - parseFloat(a.opportunityScore))
                  .slice(0, 5)
                  .map((kw, index) => (
                    <TableRow key={`opportunity-${index}`} hover>
                      <TableCell sx={{ fontWeight: 500 }}>{kw.keyword}</TableCell>
                      <TableCell align="right">{kw.searchVolume.toLocaleString()}</TableCell>
                      <TableCell align="right">
                        <Chip 
                          label={kw.difficulty}
                          size="small"
                          color={kw.difficulty < 30 ? 'success' : kw.difficulty < 70 ? 'warning' : 'error'}
                        />
                      </TableCell>
                      <TableCell align="right">${kw.cpc.toFixed(2)}</TableCell>
                      <TableCell align="center">
                        <Chip 
                          label={kw.opportunityScore}
                          size="small"
                          sx={{ 
                            backgroundColor: 'rgba(0, 122, 255, 0.1)',
                            color: '#007AFF',
                            fontWeight: 600
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                }
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default KeywordOpportunities;