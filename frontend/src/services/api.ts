import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

/**
 * API client for connecting to the SEO Dashboard backend
 */
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Keyword Research API
export const keywordResearchApi = {
  getSearchVolume: (keywords: string[], location: string = 'United States', language: string = 'English') => 
    apiClient.post('/keyword-research/search-volume', { keywords, location, language }),
  
  getSuggestions: (keyword: string, location: string = 'United States', language: string = 'English') => 
    apiClient.post('/keyword-research/suggestions', { keyword, location, language }),
  
  getKeywordIdeas: (keyword: string, location: string = 'United States', language: string = 'English', limit: number = 100) => 
    apiClient.post('/keyword-research/ideas', { keyword, location, language, limit }),
  
  getKeywordOverview: (keywords: string[], location: string = 'United States', language: string = 'English') => 
    apiClient.post('/keyword-research/overview', { keywords, location, language }),
  
  getKeywordDifficulty: (keywords: string[], location: string = 'United States', language: string = 'English') => 
    apiClient.post('/keyword-research/difficulty', { keywords, location, language }),
  
  analyzeKeywords: (keywords: string[], location: string = 'United States', language: string = 'English') => 
    apiClient.post('/keyword-research/analyze', { keywords, location, language }),
  
  getRelatedKeywords: (keyword: string, location: string = 'United States', language: string = 'English', limit: number = 50) => 
    apiClient.post('/keyword-research/related', { keyword, location, language, limit }),
  
  getQuestions: (keyword: string, location: string = 'United States', language: string = 'English', limit: number = 50) => 
    apiClient.post('/keyword-research/questions', { keyword, location, language, limit }),
  
  getLongTailKeywords: (keyword: string, location: string = 'United States', language: string = 'English', limit: number = 50) => 
    apiClient.post('/keyword-research/long-tail', { keyword, location, language, limit }),
};

// Domain Analytics API
export const domainAnalyticsApi = {
  getDomainOverview: (domain: string, location: string = 'United States', limit: number = 10) => 
    apiClient.post('/domain-analytics/overview', { domain, location, limit }),
  
  getBacklinks: (target: string, limit: number = 10, target_type: string = 'domain') => 
    apiClient.post('/domain-analytics/backlinks', { target, limit, target_type }),
  
  getTrafficAnalytics: (domain: string, location: string = 'United States') => 
    apiClient.post('/domain-analytics/traffic', { domain, location }),
  
  getDomainKeywords: (domain: string, location: string = 'United States', limit: number = 100) => 
    apiClient.post('/domain-analytics/keywords', { domain, location, limit }),
  
  getDomainCompetitors: (domain: string, location: string = 'United States', limit: number = 10) => 
    apiClient.post('/domain-analytics/competitors', { domain, location, limit }),
};

// Competitor Analysis API
export const competitorAnalysisApi = {
  getCompetitors: (domain: string, location: string = 'United States', limit: number = 10) => 
    apiClient.post('/competitor-analysis/competitors', { domain, location, limit }),
  
  getGapAnalysis: (domain1: string, domain2: string, location: string = 'United States', limit: number = 100) => 
    apiClient.post('/competitor-analysis/gap-analysis', { domain1, domain2, location, limit }),
  
  getCommonKeywords: (domains: string[], location: string = 'United States') => 
    apiClient.post('/competitor-analysis/common-keywords', { domains, location }),
  
  getCompetitorBacklinks: (domains: string[], limit: number = 10) => 
    apiClient.post('/competitor-analysis/competitor-backlinks', { domains, limit }),
    
  // Added methods for domain comparison and keyword overlap
  getDomainComparison: (domain1: string, domain2: string, location: string = 'United States') => 
    apiClient.post('/competitor-analysis/domain-comparison', { domain1, domain2, location }),
  
  getKeywordOverlap: (domain1: string, domain2: string, location: string = 'United States', limit: number = 100) => 
    apiClient.post('/competitor-analysis/keyword-overlap', { domain1, domain2, location, limit }),
};

// SERP API
export const serpApi = {
  getSerpAnalysis: (keyword: string, location: string = 'United States', language: string = 'English', depth: number = 10) => 
    apiClient.post('/serp/analysis', { keyword, location, language, depth }),
  
  getSerpFeatures: (keyword: string, location: string = 'United States', language: string = 'English') => 
    apiClient.post('/serp/features', { keyword, location, language }),
  
  getLocalPack: (keyword: string, location: string = 'United States', language: string = 'English') => 
    apiClient.post('/serp/local-pack', { keyword, location, language }),
};
