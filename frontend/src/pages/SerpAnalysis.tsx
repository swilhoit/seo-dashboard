import React, { useState, useEffect } from 'react';
import { serpApi } from '../services/api';
import {
  Box, Typography, TextField, Button, Grid, Card, CardContent,
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, CircularProgress, Chip, InputAdornment,
  Divider, List, ListItem, ListItemText, Avatar
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DescriptionIcon from '@mui/icons-material/Description';
import LinkIcon from '@mui/icons-material/Link';
import StarIcon from '@mui/icons-material/Star';

// Interface for SERP results data
interface SerpResult {
  position: number;
  title: string;
  url: string;
  displayUrl?: string; // Made optional to match API response structure
  snippet: string;
  featured?: boolean;
  sitelinks?: { title: string; url: string }[];
  type?: string;
  domain?: string;
  businesses?: any[];
  features?: string[];
}

// Define SERP feature types
interface FeatureDistribution {
  [key: string]: number;
}

// Mock data for initial display (will be replaced with API data)
const initialSerpData: SerpResult[] = [
  { 
    type: 'organic', 
    position: 1, 
    title: 'Top Design Agency Services | Creative Solutions',
    url: 'https://example.com/services',
    snippet: 'Award-winning design agency offering branding, web design, UX/UI and digital marketing services for businesses of all sizes.',
    domain: 'example.com',
    features: ['sitelinks', 'review stars']
  },
  { 
    type: 'featured_snippet', 
    position: 0, 
    title: 'What is a Design Agency? - Creative Design Services',
    url: 'https://competitor1.com/design-agency',
    snippet: 'A design agency is a company that specializes in creating visual assets, branding, websites, and other creative solutions for businesses. Design agencies typically offer services like logo design, website design, branding, packaging design, and more.',
    domain: 'competitor1.com',
    features: ['featured snippet']
  },
  { 
    type: 'organic', 
    position: 2, 
    title: 'Creative Design Agency | Award-Winning Services',
    url: 'https://competitor2.com/',
    snippet: 'Full-service design agency with 10+ years of experience. We create beautiful, functional designs that drive results. View our portfolio.',
    domain: 'competitor2.com',
    features: []
  },
  { 
    type: 'organic', 
    position: 3, 
    title: 'Design Agency - Branding, Web Design & UX Experts',
    url: 'https://competitor3.com/',
    snippet: 'Strategic design agency focused on creating memorable brands and digital experiences. Trusted by Fortune 500 companies and startups alike.',
    domain: 'competitor3.com',
    features: ['image pack']
  },
  { 
    type: 'local_pack', 
    position: 4, 
    title: 'Top Design Agencies Near You',
    url: 'https://google.com/maps',
    snippet: 'Design agencies in your local area with top ratings and reviews.',
    businesses: [
      { name: 'Creative Design Co.', rating: 4.8, reviews: 124, address: '123 Main St' },
      { name: 'Digital Artisans', rating: 4.7, reviews: 98, address: '456 Oak Ave' },
      { name: 'Studio Visuals', rating: 4.9, reviews: 87, address: '789 Pine Blvd' }
    ]
  },
  { 
    type: 'organic', 
    position: 5, 
    title: 'Best Design Agencies - Top 10 Design Firms',
    url: 'https://competitor4.com/best-design-agencies',
    snippet: 'Comprehensive list of the best design agencies to hire in 2025. Compare services, pricing, and portfolios to find the right match for your business.',
    domain: 'competitor4.com',
    features: []
  },
  { 
    type: 'organic', 
    position: 6, 
    title: 'Custom Design Services | Professional Design Agency',
    url: 'https://competitor5.com/services',
    snippet: 'Get custom design solutions tailored to your business needs. Our experienced team delivers high-quality design work on time and on budget.',
    domain: 'competitor5.com',
    features: []
  },
  { 
    type: 'organic', 
    position: 7, 
    title: 'Design Agency Pricing Guide - How Much Does Design Cost?',
    url: 'https://competitor6.com/pricing',
    snippet: 'Learn about typical design agency pricing models and how much you should expect to pay for professional design services in 2025.',
    domain: 'competitor6.com',
    features: ['review stars']
  }
];

// SERP feature distribution
const initialFeatureDistribution: FeatureDistribution = {
  featured_snippets: 23,
  local_pack: 45,
  images: 67,
  videos: 12,
  sitelinks: 34,
  review_stars: 28,
  knowledge_panel: 8,
  people_also_ask: 56
};

const SerpAnalysis: React.FC = () => {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('United States');
  const [loading, setLoading] = useState(false);
  const [serpResults, setSerpResults] = useState<SerpResult[]>([]);
  const [featureDistribution, setFeatureDistribution] = useState<FeatureDistribution>(initialFeatureDistribution);

  // Handle analyzing SERP
  const handleAnalyze = () => {
    if (!keyword) return;
    setLoading(true);
    
    // Call the real SERP API
    serpApi.getSerpAnalysis(keyword, location)
      .then((response: any) => {
        if (response.data && response.data.tasks && response.data.tasks[0].result) {
          const serpData = response.data.tasks[0].result;
          
          // Transform API data to our SerpResult format
          const apiSerpResults: SerpResult[] = serpData.items.organic.map((item: any) => ({
            position: item.rank_position || 0,
            title: item.title || '',
            url: item.url || '',
            displayUrl: item.displayed_url || item.url || '',
            snippet: item.description || '',
            featured: item.is_featured || false,
            sitelinks: item.sitelinks ? item.sitelinks.map((link: any) => ({
              title: link.title || '',
              url: link.url || ''
            })) : undefined
          }));
          
          setSerpResults(apiSerpResults);
          
          // Calculate feature distribution
          const features: FeatureDistribution = {
            'Organic Results': serpData.items.organic ? serpData.items.organic.length : 0,
            'Featured Snippets': serpData.items.featured_snippet ? 1 : 0,
            'Knowledge Panel': serpData.items.knowledge_graph ? 1 : 0,
            'Local Pack': serpData.items.local_pack ? serpData.items.local_pack.length : 0,
            'Images': serpData.items.images ? 1 : 0,
            'Videos': serpData.items.videos ? 1 : 0,
            'News': serpData.items.news ? 1 : 0,
            'Shopping': serpData.items.shopping ? 1 : 0,
          };
          
          setFeatureDistribution(features);
        } else {
          setSerpResults([]);
          setFeatureDistribution(initialFeatureDistribution);
        }
      })
      .catch((error: any) => {
        console.error('Error fetching SERP data:', error);
        setSerpResults([]);
        setFeatureDistribution(initialFeatureDistribution);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Function to render different SERP result types
  const renderResult = (result: any, index: number) => {
    if (result.type === 'organic') {
      return (
        <Card key={index} sx={{ mb: 2, borderRadius: 2, boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)' }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Chip 
                label={`#${result.position}`}
                color="primary"
                size="small"
                sx={{ mr: 1 }}
              />
              <Typography variant="caption" color="text.secondary">
                {result.domain}
              </Typography>
              
              {result.features && result.features.length > 0 && (
                <Box sx={{ ml: 'auto' }}>
                  {result.features.map((feature: string, idx: number) => (
                    <Chip 
                      key={idx}
                      label={feature}
                      size="small"
                      variant="outlined"
                      color="secondary"
                      sx={{ ml: 0.5 }}
                    />
                  ))}
                </Box>
              )}
            </Box>
            
            <Typography variant="h6" component="h3" sx={{ fontSize: '1rem', fontWeight: 500 }}>
              <a href="#" style={{ textDecoration: 'none', color: '#1a0dab' }}>
                {result.title}
              </a>
            </Typography>
            
            <Typography 
              variant="subtitle2" 
              component="div" 
              color="success.main"
              sx={{ fontSize: '0.8rem', mb: 1 }}
            >
              {result.url}
            </Typography>
            
            <Typography variant="body2" color="text.secondary">
              {result.snippet}
            </Typography>
          </CardContent>
        </Card>
      );
    } else if (result.type === 'featured_snippet') {
      return (
        <Card key={index} sx={{ mb: 2, borderRadius: 2, boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)', border: '1px solid #007AFF' }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Chip 
                label="Featured Snippet"
                color="secondary"
                size="small"
                sx={{ mr: 1 }}
              />
              <Typography variant="caption" color="text.secondary">
                {result.domain}
              </Typography>
            </Box>
            
            <Typography variant="h6" component="h3" sx={{ fontSize: '1rem', fontWeight: 500 }}>
              <a href="#" style={{ textDecoration: 'none', color: '#1a0dab' }}>
                {result.title}
              </a>
            </Typography>
            
            <Typography 
              variant="subtitle2" 
              component="div" 
              color="success.main"
              sx={{ fontSize: '0.8rem', mb: 1 }}
            >
              {result.url}
            </Typography>
            
            <Paper variant="outlined" sx={{ p: 2, bgcolor: '#f5f5f5' }}>
              <Typography variant="body2">
                {result.snippet}
              </Typography>
            </Paper>
          </CardContent>
        </Card>
      );
    } else if (result.type === 'local_pack') {
      return (
        <Card key={index} sx={{ mb: 2, borderRadius: 2, boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)', border: '1px solid #5AC8FA' }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Chip 
                label="Local Pack"
                color="info"
                size="small"
                sx={{ mr: 1 }}
              />
              <Typography variant="h6" component="h3" sx={{ fontSize: '1rem', fontWeight: 500 }}>
                {result.title}
              </Typography>
            </Box>
            
            <Grid container spacing={2}>
              {result.businesses.map((business: any, bidx: number) => (
                <Grid item xs={12} sm={4} key={bidx}>
                  <Card variant="outlined" sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight={500}>
                        {business.name}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', my: 1 }}>
                        <StarIcon sx={{ color: '#FFC107', fontSize: '1rem' }} />
                        <Typography variant="body2" sx={{ ml: 0.5 }}>
                          {business.rating} ({business.reviews} reviews)
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <LocationOnIcon sx={{ color: 'text.secondary', fontSize: '1rem' }} />
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                          {business.address}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      );
    } else {
      return null;
    }
  };

  return (
    <Box sx={{ p: { xs: 0, sm: 2 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ fontWeight: 700, color: '#1D1D1F', mb: 1 }}>
          SERP Analysis
        </Typography>
        <Typography variant="body1" sx={{ color: '#86868B', fontSize: '1.1rem' }}>
          Examine search engine results pages to understand competition and ranking opportunities
        </Typography>
      </Box>
      
      <Card sx={{ mb: 4, borderRadius: 3, boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)' }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#1D1D1F', mb: 3 }}>
            Analyze Search Results
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Enter a keyword"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAnalyze()}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: '#86868B' }} />
                    </InputAdornment>
                  ),
                }}
                placeholder="e.g., design agency"
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
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOnIcon sx={{ color: '#86868B' }} />
                    </InputAdornment>
                  ),
                }}
                placeholder="e.g., United States"
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
            <Grid item xs={12} md={3}>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleAnalyze}
                disabled={loading}
                fullWidth
                sx={{ 
                  height: '56px',
                  fontSize: '1rem',
                  fontWeight: 600,
                  borderRadius: 2,
                  textTransform: 'none'
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Analyze SERP'}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      
      {serpResults && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Typography variant="h5" sx={{ fontWeight: 600, color: '#1D1D1F', mb: 3 }}>
              Search Results for "{keyword}"
            </Typography>
            
            {serpResults.map((result, index) => renderResult(result, index))}
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card sx={{ mb: 3, borderRadius: 3, boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)' }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, color: '#1D1D1F', mb: 3 }}>
                  SERP Features
                </Typography>
                
                <List>
                  {Object.entries(featureDistribution).map(([feature, count]) => (
                    <ListItem key={feature} divider sx={{ py: 1 }}>
                      <ListItemText 
                        primary={feature.replace('_', ' ')} 
                        secondary={`${count}% of results`}
                      />
                      <Box 
                        sx={{ 
                          width: `${count}%`, 
                          height: 4, 
                          bgcolor: 'primary.main',
                          borderRadius: 1 
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
            
            <Card sx={{ borderRadius: 3, boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)' }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, color: '#1D1D1F', mb: 3 }}>
                  Ranking Factors
                </Typography>
                
                <Typography variant="body2" paragraph>
                  Based on our analysis, these are the key factors that appear to influence rankings for this keyword:
                </Typography>
                
                <List>
                  <ListItem>
                    <ListItemText 
                      primary="Content Depth" 
                      secondary="Top results have comprehensive content (1500+ words)" 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Page Authority" 
                      secondary="Average PA of top 3 results: 48" 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Backlinks" 
                      secondary="Average of 87 referring domains to top pages" 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Page Speed" 
                      secondary="Top results load in under 2.5 seconds" 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Schema Markup" 
                      secondary="80% of top results use organization schema" 
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
      
      {!serpResults && !loading && (
        <Card sx={{ borderRadius: 3, boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)' }}>
          <CardContent sx={{ textAlign: 'center', py: 8, px: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 600, color: '#1D1D1F', mb: 2 }}>
              Enter a keyword to analyze search results
            </Typography>
            <Typography variant="body1" sx={{ color: '#86868B', fontSize: '1.1rem', maxWidth: 600, mx: 'auto' }}>
              Examine the SERP features, competition, and ranking factors for any keyword.
              Understand what it takes to rank on the first page.
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default SerpAnalysis;
