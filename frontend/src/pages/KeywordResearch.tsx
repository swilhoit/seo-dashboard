import React, { useState, useEffect, useMemo } from 'react';
import { keywordResearchApi } from '../services/api';
import { 
  Box, Typography, TextField, Button, Grid, Card, CardContent,
  Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow, Paper, CircularProgress, Chip, Tabs, Tab, InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DownloadIcon from '@mui/icons-material/Download';
import AddIcon from '@mui/icons-material/Add';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import VisibilityIcon from '@mui/icons-material/Visibility';
import KeywordOpportunities from '../components/KeywordOpportunities';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Doughnut, Scatter } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface KeywordData {
  keyword: string;
  searchVolume: number;
  cpc: number;
  competition: number;
  difficulty: number;
  trend: 'up' | 'down' | 'stable';
  relevanceScore?: number;
}

// Component for the difficulty indicator
const DifficultyIndicator: React.FC<{ value: number }> = ({ value }) => {
  let color = 'success.main';
  if (value > 80) color = 'error.main';
  else if (value > 60) color = 'warning.main';

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ position: 'relative', display: 'inline-flex', mr: 1 }}>
        <CircularProgress variant="determinate" value={value} size={35} sx={{ color }} />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="caption" component="div" color="text.secondary">
            {value}
          </Typography>
        </Box>
      </Box>
      <Typography variant="body2">
        {value > 80 ? 'Hard' : value > 60 ? 'Medium' : 'Easy'}
      </Typography>
    </Box>
  );
};

// Advanced semantic word associations for context understanding
const semanticContexts = {
  ai: ['artificial', 'intelligence', 'machine', 'learning', 'neural', 'algorithm', 'automated', 'smart', 'cognitive', 'generative', 'chatgpt', 'openai', 'llm', 'gpt', 'midjourney', 'stable diffusion'],
  design: ['graphic', 'visual', 'creative', 'layout', 'typography', 'branding', 'logo', 'illustration', 'photoshop', 'figma', 'sketch', 'canva', 'adobe', 'ui', 'ux', 'interface'],
  digital: ['software', 'app', 'online', 'web', 'digital', 'virtual', 'cloud', 'saas', 'platform', 'dashboard', 'api', 'tech', 'technology'],
  construction: ['ryobi', 'dewalt', 'milwaukee', 'makita', 'bosch', 'craftsman', 'kobalt', 'ridgid', 'grizzly', 'delta', 'porter', 'cable', 'drill', 'saw', 'hammer', 'wrench', 'screwdriver', 'toolbox', 'workshop', 'garage', 'hardware', 'power tools', 'hand tools'],
  automotive: ['car', 'auto', 'vehicle', 'engine', 'mechanic', 'garage', 'automotive', 'repair', 'maintenance', 'parts'],
  cooking: ['recipe', 'kitchen', 'cooking', 'baking', 'chef', 'food', 'culinary', 'ingredient', 'meal'],
  fitness: ['workout', 'exercise', 'gym', 'fitness', 'training', 'muscle', 'cardio', 'strength', 'health'],
  finance: ['money', 'investment', 'trading', 'stock', 'crypto', 'bitcoin', 'financial', 'bank', 'loan', 'credit']
};

// Function to get semantic context of a term
const getSemanticContext = (term: string): string[] => {
  const termLower = term.toLowerCase();
  const contexts: string[] = [];
  
  for (const [context, words] of Object.entries(semanticContexts)) {
    if (words.some(word => termLower.includes(word) || word.includes(termLower))) {
      contexts.push(context);
    }
  }
  
  return contexts;
};

// Function to calculate semantic similarity between two terms
const calculateSemanticSimilarity = (term1: string, term2: string): number => {
  const context1 = getSemanticContext(term1);
  const context2 = getSemanticContext(term2);
  
  if (context1.length === 0 || context2.length === 0) {
    return 0.5; // Neutral if no context found
  }
  
  const commonContexts = context1.filter(c => context2.includes(c));
  const totalContexts = new Set([...context1, ...context2]).size;
  
  return commonContexts.length / totalContexts;
};

// Function to detect conflicting contexts
const hasConflictingContext = (seedTerm: string, keyword: string): boolean => {
  const seedContexts = getSemanticContext(seedTerm);
  const keywordContexts = getSemanticContext(keyword);
  
  // Specific conflicts we want to catch
  const conflicts = [
    ['ai', 'construction'],
    ['ai', 'automotive'],
    ['design', 'construction'],
    ['design', 'automotive'],
    ['digital', 'construction'],
    ['digital', 'automotive'],
    ['software', 'construction'],
    ['tech', 'construction']
  ];
  
  for (const [context1, context2] of conflicts) {
    if (seedContexts.includes(context1) && keywordContexts.includes(context2)) {
      return true;
    }
    if (seedContexts.includes(context2) && keywordContexts.includes(context1)) {
      return true;
    }
  }
  
  return false;
};

// Advanced relevance scoring with semantic understanding
const calculateRelevanceScore = (keyword: string, seedTerm: string): number => {
  if (!seedTerm.trim()) return 0;
  
  const keywordLower = keyword.toLowerCase();
  const seedLower = seedTerm.toLowerCase();
  const seedWords = seedLower.split(/\s+/).filter(word => word.length > 2);
  
  // Check for conflicting semantic contexts first
  if (hasConflictingContext(seedTerm, keyword)) {
    return 0; // Immediately reject conflicting contexts
  }
  
  // Exact match gets highest score
  if (keywordLower === seedLower) {
    return 100;
  }
  
  // Contains the full seed term as a phrase (very high score)
  if (keywordLower.includes(seedLower)) {
    return 90;
  }
  
  // Calculate strict word overlap with context awareness
  const keywordWords = keywordLower.split(/\s+/);
  let exactWordMatches = 0;
  let contextualMatches = 0;
  
  seedWords.forEach(seedWord => {
    if (keywordWords.includes(seedWord)) {
      exactWordMatches++;
    } else {
      // Check for contextually similar words
      const seedContext = getSemanticContext(seedWord);
      const hasContextualMatch = keywordWords.some(kwWord => {
        const kwContext = getSemanticContext(kwWord);
        return seedContext.some(sc => kwContext.includes(sc));
      });
      if (hasContextualMatch) {
        contextualMatches++;
      }
    }
  });
  
  // Require significant word overlap for any score
  const totalMatches = exactWordMatches + (contextualMatches * 0.7); // Contextual matches worth 70% of exact matches
  const overlapPercentage = totalMatches / seedWords.length;
  
  if (overlapPercentage < 0.4) {
    return 0; // No score if less than 40% meaningful overlap
  }
  
  // Base score from word overlap
  let score = overlapPercentage * 60;
  
  // Semantic similarity bonus
  const semanticSim = calculateSemanticSimilarity(seedTerm, keyword);
  score += semanticSim * 30;
  
  // Bonus for exact word matches
  score += (exactWordMatches / seedWords.length) * 20;
  
  // Bonus for high overlap
  if (overlapPercentage >= 0.8) {
    score += 15;
  } else if (overlapPercentage >= 0.6) {
    score += 8;
  }
  
  // Positional bonuses
  if (keywordLower.startsWith(seedWords[0])) {
    score += 5;
  }
  
  // Penalty for overly long keywords
  const lengthRatio = keyword.length / seedTerm.length;
  if (lengthRatio > 3) {
    score -= 20;
  } else if (lengthRatio > 2) {
    score -= 10;
  }
  
  return Math.min(100, Math.max(0, score));
};

// Function to categorize keywords into broad categories
const categorizeKeyword = (keyword: string): string[] => {
  const categories: string[] = [];
  const keywordLower = keyword.toLowerCase();
  
  // Animal/Pet/Farm related
  if (/\b(chicken|hen|rooster|coop|farm|barn|animal|pet|livestock|poultry|cattle|horse|pig|sheep|goat|duck|rabbit|feed|vet|veterinary)\b/.test(keywordLower)) {
    categories.push("animals");
  }
  
  // Technology/Software
  if (/\b(app|software|digital|online|website|tech|computer|mobile|programming|code|development|ai|artificial|intelligence|saas|platform|api)\b/.test(keywordLower)) {
    categories.push("technology");
  }
  
  // Business/Marketing/Agency
  if (/\b(business|marketing|seo|agency|service|company|professional|corporate|enterprise|consulting|strategy|branding|advertising)\b/.test(keywordLower)) {
    categories.push("business");
  }
  
  // Design/Creative
  if (/\b(design|creative|graphic|logo|branding|ui|ux|web\s*design|visual|artist|portfolio|typography|color)\b/.test(keywordLower)) {
    categories.push("design");
  }
  
  // Health/Medical
  if (/\b(health|medical|doctor|clinic|hospital|treatment|medicine|therapy|wellness|fitness|nutrition)\b/.test(keywordLower)) {
    categories.push("health");
  }
  
  // Education/Learning
  if (/\b(education|school|course|training|learning|study|tutorial|university|college|certification)\b/.test(keywordLower)) {
    categories.push("education");
  }
  
  // Finance/Money
  if (/\b(finance|money|investment|loan|credit|bank|insurance|tax|accounting|financial|budget)\b/.test(keywordLower)) {
    categories.push("finance");
  }
  
  // Real Estate/Property
  if (/\b(real\s*estate|property|house|home|apartment|rent|buy|sell|mortgage|realtor|listing)\b/.test(keywordLower)) {
    categories.push("real_estate");
  }
  
  // Food/Restaurant
  if (/\b(food|restaurant|recipe|cooking|chef|kitchen|meal|dining|cuisine|menu)\b/.test(keywordLower)) {
    categories.push("food");
  }
  
  // Travel/Tourism
  if (/\b(travel|vacation|hotel|flight|tourism|trip|destination|booking|resort|cruise)\b/.test(keywordLower)) {
    categories.push("travel");
  }
  
  // If no specific category found, add general
  if (categories.length === 0) {
    categories.push("general");
  }
  
  return categories;
};

// Function to analyze compound terms and their primary focus
const getCompoundTermFocus = (term: string): string[] => {
  const termLower = term.toLowerCase();
  const focuses: string[] = [];
  
  // AI/Technology compound terms
  if (/\b(ai|artificial\s*intelligence|machine\s*learning|neural|algorithm)\s+\w+/.test(termLower)) {
    focuses.push('ai_primary');
  }
  if (/\w+\s+(ai|artificial\s*intelligence|machine\s*learning|neural|algorithm)\b/.test(termLower)) {
    focuses.push('ai_secondary');
  }
  
  // Design compound terms
  if (/\b(design|graphic|visual|creative|ui|ux)\s+\w+/.test(termLower)) {
    focuses.push('design_primary');
  }
  if (/\w+\s+(design|graphic|visual|creative|ui|ux)\b/.test(termLower)) {
    focuses.push('design_secondary');
  }
  
  // Software/Digital compound terms
  if (/\b(software|digital|online|app|platform|tool)\s+\w+/.test(termLower)) {
    focuses.push('software_primary');
  }
  if (/\w+\s+(software|digital|online|app|platform|tool)\b/.test(termLower)) {
    focuses.push('software_secondary');
  }
  
  // Construction/Physical tools compound terms
  if (/\b(power|hand|construction|workshop|garage)\s+(tool|equipment)\b/.test(termLower)) {
    focuses.push('physical_tools_primary');
  }
  if (/\b(ryobi|dewalt|milwaukee|makita|grizzly|craftsman)\s+\w+/.test(termLower)) {
    focuses.push('physical_tools_primary');
  }
  
  return focuses;
};

// Enhanced relevance check with compound term analysis
const isCompoundTermRelevant = (keyword: string, seedTerm: string): boolean => {
  const keywordFocus = getCompoundTermFocus(keyword);
  const seedFocus = getCompoundTermFocus(seedTerm);
  
  // If seed term has AI/design focus, reject physical tool focused keywords
  if (seedFocus.includes('ai_primary') || seedFocus.includes('design_primary') || seedFocus.includes('software_primary')) {
    if (keywordFocus.includes('physical_tools_primary')) {
      return false;
    }
  }
  
  // If seed term is about digital tools, reject physical tool brands
  if (/\b(ai|digital|software|online)\s+\w*tools?\b/.test(seedTerm.toLowerCase())) {
    if (/\b(ryobi|dewalt|milwaukee|makita|grizzly|craftsman|kobalt|ridgid|delta|porter|cable)\b/.test(keyword.toLowerCase())) {
      return false;
    }
  }
  
  return true;
};

// Function to check if keyword is relevant to seed term
const isKeywordRelevant = (keyword: string, seedTerm: string, threshold: number = 60): boolean => {
  // First check compound term relevance
  if (!isCompoundTermRelevant(keyword, seedTerm)) {
    return false;
  }
  
  const relevanceScore = calculateRelevanceScore(keyword, seedTerm);
  
  // If relevance score is above threshold, it is relevant
  if (relevanceScore >= threshold) {
    return true;
  }
  
  // Strict semantic filters for obviously irrelevant content
  const keywordLower = keyword.toLowerCase();
  
  // Comprehensive spam and irrelevant keyword patterns
  const spamPatterns = [
    // Social media spam
    /\b(free|buy|get|cheap|instant)\s*(followers|likes|views|subscribers|shares)\b/,
    /\b(tiktok|instagram|facebook|twitter|youtube|snapchat)\s*(followers|likes|views|bot|hack)\b/,
    /\b(social\s*media)\s*(boost|growth|automation|bot)\b/,
    
    // Tech/Gaming spam
    /\b(download|hack|cheat|generator|mod|crack|keygen|serial)\b/,
    /\b(minecraft|fortnite|roblox|pokemon)\s*(hack|cheat|free|generator)\b/,
    /\b(app|software|game)\s*(hack|crack|free|download|generator)\b/,
    
    // Adult/inappropriate content
    /\b(porn|xxx|adult|sex|nude|naked|escort|dating)\b/,
    /\b(cam|webcam|live|chat)\s*(girls|boys|sex|adult)\b/,
    
    // Financial/crypto spam
    /\b(casino|gambling|poker|bet|lottery|jackpot)\b/,
    /\b(crypto|bitcoin|ethereum|forex|trading|investment)\s*(bot|signal|strategy|scam)\b/,
    /\b(get\s*rich|make\s*money|easy\s*money|passive\s*income)\b/,
    
    // Shopping/ecommerce spam
    /\b(cheap|discount|sale|deals|coupon|promo)\s*(online|buy|shop|store)\b/,
    /\b(wholesale|dropshipping|affiliate|mlm|pyramid)\b/,
    
    // Health/medical spam
    /\b(lose\s*weight|weight\s*loss|diet\s*pills|supplements)\b/,
    /\b(viagra|cialis|pharmacy|pills|medication)\s*(online|cheap|buy)\b/,
    
    // Generic spam indicators
    /\b(how\s*to\s*(get|make|earn))\s*(free|easy|fast|quick)\b/,
    /\b(click\s*here|visit\s*now|limited\s*time|act\s*now)\b/,
    /\b(work\s*from\s*home|make\s*money\s*online|get\s*paid)\b/,
    
    // Physical tool brands (when looking for digital tools)
    /\b(ryobi|dewalt|milwaukee|makita|bosch|craftsman|kobalt|ridgid|grizzly|delta|porter\s*cable|black\s*decker|stanley)\s*(tools?|equipment|drill|saw|wrench)\b/,
    
    // Construction/hardware terms (when looking for digital tools)
    /\b(drill|hammer|saw|wrench|screwdriver|toolbox|workshop|garage|hardware\s*store|home\s*depot|lowes)\b/,
    
    // Automotive terms (when looking for digital tools)
    /\b(car|auto|vehicle|engine|mechanic|automotive|tire|brake|oil\s*change)\b/
  ];
  
  // Context-specific filtering based on seed term
  const seedLower = seedTerm.toLowerCase();
  
  // If seed is about AI/digital tools, apply stricter physical tool filtering
  if (/\b(ai|artificial|digital|software|online)\s+\w*(tool|design|platform)\b/.test(seedLower)) {
    // Block all physical tool brands regardless of context
    if (/\b(ryobi|dewalt|milwaukee|makita|bosch|craftsman|kobalt|ridgid|grizzly|delta|porter|cable|black|decker|stanley|snap|on|klein|husky|kobalt)\b/.test(keywordLower)) {
      return false;
    }
    // Block construction/workshop terms
    if (/\b(workshop|garage|construction|hardware|drill|saw|hammer|wrench|screwdriver|power\s*tools|hand\s*tools)\b/.test(keywordLower)) {
      return false;
    }
  }
  
  // Check if keyword matches general spam patterns
  const isSpam = spamPatterns.some(pattern => pattern.test(keywordLower));
  if (isSpam) {
    return false;
  }
  
  // Enhanced category mismatch detection
  const seedCategory = categorizeKeyword(seedTerm);
  const keywordCategory = categorizeKeyword(keyword);
  
  // Stricter category filtering for low relevance scores
  if (relevanceScore < 40 && seedCategory.length > 0 && keywordCategory.length > 0) {
    const hasCommonCategory = seedCategory.some(cat => keywordCategory.includes(cat));
    if (!hasCommonCategory) {
      return false;
    }
  }
  
  // Additional context-aware filtering
  const seedContexts = getSemanticContext(seedTerm);
  const keywordContexts = getSemanticContext(keyword);
  
  // If seed is clearly in one domain and keyword is clearly in a conflicting domain, reject
  if (relevanceScore < 60 && seedContexts.length > 0 && keywordContexts.length > 0) {
    if (seedContexts.includes('ai') && keywordContexts.includes('construction')) return false;
    if (seedContexts.includes('design') && keywordContexts.includes('construction')) return false;
    if (seedContexts.includes('digital') && keywordContexts.includes('construction')) return false;
    if (seedContexts.includes('ai') && keywordContexts.includes('automotive')) return false;
    if (seedContexts.includes('design') && keywordContexts.includes('automotive')) return false;
  }
  
  return true;
};

const KeywordResearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [keywords, setKeywords] = useState<KeywordData[]>([]);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'relevance' | 'volume' | 'difficulty' | 'cpc'>('relevance');
  const [relevanceThreshold, setRelevanceThreshold] = useState(60);
  
  // Calculate aggregated metrics
  const aggregatedMetrics = useMemo(() => {
    if (keywords.length === 0) return null;
    
    const totalVolume = keywords.reduce((sum, kw) => sum + kw.searchVolume, 0);
    const avgCpc = keywords.reduce((sum, kw) => sum + kw.cpc, 0) / keywords.length;
    const avgDifficulty = keywords.reduce((sum, kw) => sum + kw.difficulty, 0) / keywords.length;
    const avgCompetition = keywords.reduce((sum, kw) => sum + kw.competition, 0) / keywords.length;
    
    const trendCounts = keywords.reduce((acc, kw) => {
      acc[kw.trend] = (acc[kw.trend] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const difficultyDistribution = {
      easy: keywords.filter(kw => kw.difficulty <= 30).length,
      medium: keywords.filter(kw => kw.difficulty > 30 && kw.difficulty <= 70).length,
      hard: keywords.filter(kw => kw.difficulty > 70).length,
    };
    
    return {
      totalKeywords: keywords.length,
      totalVolume,
      avgCpc,
      avgDifficulty,
      avgCompetition,
      trendCounts,
      difficultyDistribution,
      highVolumeKeywords: keywords.filter(kw => kw.searchVolume > 1000).length,
      lowCompetitionKeywords: keywords.filter(kw => kw.competition < 0.3).length,
    };
  }, [keywords]);
  
  // Load initial data when component mounts
  useEffect(() => {
    setLoading(true);
    // Start with some default keywords related to SEO
    const defaultKeywords = ['seo tools', 'keyword research'];
    
    keywordResearchApi.getKeywordOverview(defaultKeywords)
      .then(response => {
        if (response.data && response.data.tasks && response.data.tasks[0].result && response.data.tasks[0].result[0].items) {
          const resultData = response.data.tasks[0].result[0].items;
          // Transform API response to our KeywordData format using rich DataForSEO Labs data
          const apiKeywords: KeywordData[] = resultData
            .map((item: any) => {
              const keyword = item.keyword || '';
              return {
                keyword,
                searchVolume: item.keyword_info?.search_volume || 0,
                cpc: item.keyword_info?.cpc || 0,
                competition: item.keyword_info?.competition || 0,
                difficulty: item.keyword_properties?.keyword_difficulty || 0,
                trend: item.keyword_info?.search_volume_trend?.monthly > 0 ? 'up' : 
                       item.keyword_info?.search_volume_trend?.monthly < 0 ? 'down' : 'stable',
                relevanceScore: calculateRelevanceScore(keyword, defaultKeywords.join(' '))
              };
            })
            .filter((keyword: KeywordData) => {
              const keywordText = keyword.keyword.trim();
              return keywordText !== '' && isKeywordRelevant(keywordText, defaultKeywords.join(' '), relevanceThreshold);
            }) // Filter out empty and irrelevant keywords
            .sort((a: KeywordData, b: KeywordData) => (b.relevanceScore || 0) - (a.relevanceScore || 0)); // Sort by relevance
          setKeywords(apiKeywords);
        }
      })
      .catch(error => {
        console.error('Error fetching initial keyword data:', error);
        setKeywords([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [relevanceThreshold]);

  // Sorted keywords based on current sort option
  const sortedKeywords = useMemo(() => {
    const keywordsToSort = [...keywords];
    
    switch (sortBy) {
      case 'relevance':
        return keywordsToSort.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));
      case 'volume':
        return keywordsToSort.sort((a, b) => b.searchVolume - a.searchVolume);
      case 'difficulty':
        return keywordsToSort.sort((a, b) => a.difficulty - b.difficulty);
      case 'cpc':
        return keywordsToSort.sort((a, b) => b.cpc - a.cpc);
      default:
        return keywordsToSort;
    }
  }, [keywords, sortBy]);
  
  // Handle adding/removing keywords from selection
  const toggleKeywordSelection = (keyword: string) => {
    if (selectedKeywords.includes(keyword)) {
      setSelectedKeywords(selectedKeywords.filter(k => k !== keyword));
    } else {
      setSelectedKeywords([...selectedKeywords, keyword]);
    }
  };

  // Handle search submission
  const handleSearch = () => {
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    
    // Use different API endpoints based on selected tab
    let apiCall;
    
    switch (tabValue) {
      case 0: // Keyword Overview
        apiCall = keywordResearchApi.getKeywordIdeas(searchTerm, 'United States', 'English', 50);
        break;
      case 1: // Related Keywords
        apiCall = keywordResearchApi.getRelatedKeywords(searchTerm, 'United States', 'English', 50);
        break;
      case 2: // Questions
        apiCall = keywordResearchApi.getQuestions(searchTerm, 'United States', 'English', 50);
        break;
      case 3: // Long-tail Keywords
        apiCall = keywordResearchApi.getLongTailKeywords(searchTerm, 'United States', 'English', 50);
        break;
      default:
        apiCall = keywordResearchApi.getKeywordIdeas(searchTerm, 'United States', 'English', 50);
    }
    
    apiCall
      .then(response => {
        if (response.data && response.data.tasks && response.data.tasks[0].result && response.data.tasks[0].result[0].items) {
          const resultData = response.data.tasks[0].result[0].items;
          // Transform API response to our KeywordData format using DataForSEO Labs data
          const apiKeywords: KeywordData[] = resultData
            .map((item: any) => {
              const keyword = item.keyword || '';
              return {
                keyword,
                searchVolume: item.keyword_info?.search_volume || 0,
                cpc: item.keyword_info?.cpc || 0,
                competition: item.keyword_info?.competition || 0,
                difficulty: item.keyword_properties?.keyword_difficulty || 0,
                trend: item.keyword_info?.search_volume_trend?.monthly > 0 ? 'up' : 
                       item.keyword_info?.search_volume_trend?.monthly < 0 ? 'down' : 'stable',
                relevanceScore: calculateRelevanceScore(keyword, searchTerm)
              };
            })
            .filter((keyword: KeywordData) => {
              const keywordText = keyword.keyword.trim();
              return keywordText !== '' && isKeywordRelevant(keywordText, searchTerm, relevanceThreshold);
            }) // Filter out empty and irrelevant keywords
            .sort((a: KeywordData, b: KeywordData) => (b.relevanceScore || 0) - (a.relevanceScore || 0)); // Sort by relevance
          setKeywords(apiKeywords);
        } else {
          // If no results, set empty array
          setKeywords([]);
        }
      })
      .catch(error => {
        console.error('Error fetching keyword data:', error);
        setKeywords([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Handle tab changes
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    // If we have a search term, refresh data for the new tab
    if (searchTerm.trim()) {
      setTimeout(() => handleSearch(), 100); // Small delay to let tab value update
    }
  };

  return (
    <Box sx={{ p: { xs: 0, sm: 2 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ fontWeight: 700, color: '#1D1D1F', mb: 1 }}>
          Keyword Research
        </Typography>
        <Typography variant="body1" sx={{ color: '#86868B', fontSize: '1.1rem' }}>
          Discover high-value keywords and opportunities to improve your search rankings
        </Typography>
      </Box>
      
      <Card sx={{ mb: 4, borderRadius: 3, boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)' }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#1D1D1F', mb: 3 }}>
            Find Keywords
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Enter a keyword or domain"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: '#86868B' }} />
                    </InputAdornment>
                  ),
                }}
                placeholder="e.g., design agency or yourwebsite.com"
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
            <Grid item xs={12} md={4}>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleSearch}
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
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Research Keywords'}
              </Button>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                variant="outlined"
                fullWidth
                sx={{ 
                  height: '56px',
                  fontSize: '1rem',
                  fontWeight: 500,
                  borderRadius: 2,
                  textTransform: 'none',
                  borderColor: '#007AFF',
                  color: '#007AFF',
                  '&:hover': {
                    borderColor: '#0051D5',
                    backgroundColor: 'rgba(0, 122, 255, 0.05)'
                  }
                }}
                disabled={selectedKeywords.length === 0}
                startIcon={<AddIcon />}
              >
                Add to List
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      
      <Box sx={{ mb: 4 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTab-root': {
              fontSize: '1rem',
              fontWeight: 500,
              px: 3,
              py: 2
            }
          }}
        >
          <Tab label="Keyword Overview" />
          <Tab label="Related Keywords" />
          <Tab label="Questions" />
          <Tab label="Long-tail Keywords" />
        </Tabs>
      </Box>
      
      {/* Aggregated Metrics */}
      {aggregatedMetrics && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 2, boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)' }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <VisibilityIcon sx={{ fontSize: 40, color: '#007AFF', mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#1D1D1F', mb: 0.5 }}>
                  {aggregatedMetrics.totalVolume.toLocaleString()}
                </Typography>
                <Typography variant="body2" sx={{ color: '#86868B' }}>
                  Total Search Volume
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 2, boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)' }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <AttachMoneyIcon sx={{ fontSize: 40, color: '#5AC8FA', mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#1D1D1F', mb: 0.5 }}>
                  ${aggregatedMetrics.avgCpc.toFixed(2)}
                </Typography>
                <Typography variant="body2" sx={{ color: '#86868B' }}>
                  Average CPC
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 2, boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)' }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <TrendingUpIcon sx={{ fontSize: 40, color: '#34C759', mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#1D1D1F', mb: 0.5 }}>
                  {aggregatedMetrics.highVolumeKeywords}
                </Typography>
                <Typography variant="body2" sx={{ color: '#86868B' }}>
                  High Volume (1K+)
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 2, boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)' }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <TrendingDownIcon sx={{ fontSize: 40, color: '#FF9500', mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#1D1D1F', mb: 0.5 }}>
                  {aggregatedMetrics.lowCompetitionKeywords}
                </Typography>
                <Typography variant="body2" sx={{ color: '#86868B' }}>
                  Low Competition
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
      
      {/* Charts Section */}
      {aggregatedMetrics && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)' }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1D1D1F', mb: 3 }}>
                  Difficulty Distribution
                </Typography>
                <Box sx={{ height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Doughnut
                    data={{
                      labels: ['Easy (0-30)', 'Medium (31-70)', 'Hard (71-100)'],
                      datasets: [{
                        data: [
                          aggregatedMetrics.difficultyDistribution.easy,
                          aggregatedMetrics.difficultyDistribution.medium,
                          aggregatedMetrics.difficultyDistribution.hard
                        ],
                        backgroundColor: [
                          'rgba(52, 199, 89, 0.8)',
                          'rgba(255, 149, 0, 0.8)',
                          'rgba(255, 59, 48, 0.8)'
                        ],
                        borderWidth: 0,
                      }]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'bottom',
                          labels: {
                            padding: 20,
                            usePointStyle: true,
                          }
                        }
                      }
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)' }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1D1D1F', mb: 3 }}>
                  Search Volume vs CPC
                </Typography>
                <Box sx={{ height: 300 }}>
                  <Scatter
                    data={{
                      datasets: [{
                        label: 'Keywords',
                        data: keywords.map(kw => ({
                          x: kw.searchVolume,
                          y: kw.cpc
                        })),
                        backgroundColor: 'rgba(0, 122, 255, 0.6)',
                        borderColor: 'rgba(0, 122, 255, 0.8)',
                        borderWidth: 1,
                        pointRadius: 6,
                      }]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        x: {
                          title: {
                            display: true,
                            text: 'Search Volume'
                          },
                          type: 'linear',
                          position: 'bottom'
                        },
                        y: {
                          title: {
                            display: true,
                            text: 'CPC ($)'
                          }
                        }
                      },
                      plugins: {
                        legend: {
                          display: false
                        },
                        tooltip: {
                          callbacks: {
                            label: function(context: any) {
                              const keyword = keywords[context.dataIndex];
                              return `${keyword?.keyword || ''}: Volume ${context.parsed.x.toLocaleString()}, CPC $${context.parsed.y.toFixed(2)}`;
                            }
                          }
                        }
                      }
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
      

      {/* Keyword Opportunities Section */}
      <KeywordOpportunities keywords={sortedKeywords} />
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        mb: 3, 
        alignItems: 'center',
        p: 3,
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        borderRadius: 2,
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(0, 0, 0, 0.05)'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#1D1D1F' }}>
            {selectedKeywords.length} keywords selected
          </Typography>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel sx={{ color: '#86868B' }}>Sort by</InputLabel>
            <Select
              value={sortBy}
              label="Sort by"
              onChange={(e) => setSortBy(e.target.value as any)}
              sx={{
                borderRadius: 2,
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(0, 0, 0, 0.1)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#007AFF',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#007AFF',
                }
              }}
            >
              <MenuItem value="relevance">Relevance</MenuItem>
              <MenuItem value="volume">Search Volume</MenuItem>
              <MenuItem value="difficulty">Difficulty</MenuItem>
              <MenuItem value="cpc">CPC</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel sx={{ color: '#86868B' }}>Relevance Filter</InputLabel>
            <Select
              value={relevanceThreshold}
              label="Relevance Filter"
              onChange={(e) => setRelevanceThreshold(Number(e.target.value))}
              sx={{
                borderRadius: 2,
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(0, 0, 0, 0.1)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#007AFF',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#007AFF',
                }
              }}
            >
              <MenuItem value={0}>All Keywords</MenuItem>
              <MenuItem value={40}>40%+ Relevant</MenuItem>
              <MenuItem value={60}>60%+ Relevant</MenuItem>
              <MenuItem value={75}>75%+ Relevant</MenuItem>
              <MenuItem value={90}>90%+ Relevant</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Button 
          startIcon={<DownloadIcon />} 
          disabled={keywords.length === 0}
          variant="outlined"
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 500,
            borderColor: '#007AFF',
            color: '#007AFF',
            '&:hover': {
              borderColor: '#0051D5',
              backgroundColor: 'rgba(0, 122, 255, 0.05)'
            }
          }}
        >
          Export CSV
        </Button>
      </Box>
      
      <TableContainer 
        component={Paper}
        sx={{
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(0, 0, 0, 0.05)',
          overflow: 'hidden'
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox"></TableCell>
              <TableCell>Keyword</TableCell>
              <TableCell align="right">Search Volume</TableCell>
              <TableCell align="right">CPC ($)</TableCell>
              <TableCell align="right">Competition</TableCell>
              <TableCell align="right">Difficulty</TableCell>
              <TableCell align="right">Trend</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedKeywords.map((row, index) => (
              <TableRow 
                key={`${row.keyword || 'empty'}-${index}`}
                hover
                selected={selectedKeywords.includes(row.keyword)}
                onClick={() => toggleKeywordSelection(row.keyword)}
                sx={{ cursor: 'pointer' }}
              >
                <TableCell padding="checkbox">
                  <input 
                    type="checkbox" 
                    checked={selectedKeywords.includes(row.keyword)} 
                    onChange={() => {}} 
                  />
                </TableCell>
                <TableCell component="th" scope="row" sx={{ fontWeight: 500 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {row.keyword}
                    {sortBy === 'relevance' && row.relevanceScore && (
                      <Chip
                        label={`${row.relevanceScore.toFixed(0)}%`}
                        size="small"
                        sx={{
                          backgroundColor: 'rgba(0, 122, 255, 0.1)',
                          color: '#007AFF',
                          fontSize: '0.7rem',
                          height: '20px'
                        }}
                      />
                    )}
                  </Box>
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 500 }}>{row.searchVolume.toLocaleString()}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 500 }}>${row.cpc.toFixed(2)}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 500 }}>{(row.competition * 100).toFixed(0)}%</TableCell>
                <TableCell align="right">
                  <DifficultyIndicator value={row.difficulty} />
                </TableCell>
                <TableCell align="right">
                  <Chip 
                    label={row.trend} 
                    color={row.trend === 'up' ? 'success' : row.trend === 'down' ? 'error' : 'default'} 
                    size="small"
                  />
                </TableCell>
              </TableRow>
            ))}
            {sortedKeywords.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                  {loading ? (
                    <CircularProgress size={40} />
                  ) : (
                    <Typography variant="body1">No keywords found. Try a different search term.</Typography>
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default KeywordResearch;
