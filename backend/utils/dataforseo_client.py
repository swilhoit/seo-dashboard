#!/usr/bin/env python3
"""
DataForSEO API Client
This module provides a unified client for interacting with the DataForSEO API.
"""
import requests
import json
import base64
import os
from dotenv import load_dotenv

load_dotenv()

class DataForSEOClient:
    """
    Client class for interacting with the DataForSEO API.
    """
    def __init__(self, username=None, password=None):
        """Initialize the client with credentials from environment variables or provided values."""
        self.username = username or os.environ.get('DATAFORSEO_USERNAME')
        self.password = password or os.environ.get('DATAFORSEO_PASSWORD')
        
        if not self.username or not self.password:
            raise ValueError("DataForSEO credentials must be provided either as parameters or environment variables (DATAFORSEO_USERNAME, DATAFORSEO_PASSWORD)")
        
        self.base_url = "https://api.dataforseo.com/v3"
        
    def test_connection(self):
        """
        Test the connection to the DataForSEO API with the current credentials
        
        Returns:
            dict: Success status and message
        """
        try:
            # Try to access a simple API endpoint to test connection
            url = f"{self.base_url}/appendix/user_data"
            
            # Encode credentials
            encoded_credentials = base64.b64encode(
                f"{self.username}:{self.password}".encode()
            ).decode()
            
            headers = {
                'Authorization': f'Basic {encoded_credentials}',
                'Content-Type': 'application/json'
            }
            
            response = requests.get(url, headers=headers)
            if response.status_code == 200:
                return {
                    "success": True,
                    "message": "Connection successful"
                }
            else:
                return {
                    "success": False,
                    "message": f"API returned status code {response.status_code}: {response.text}"
                }
        except Exception as e:
            return {
                "success": False,
                "message": str(e)
            }
    
    def make_request(self, endpoint, data):
        """
        Make a request to the DataForSEO API
        
        Args:
            endpoint (str): API endpoint to call
            data (dict): Data to send with the request
            
        Returns:
            dict: Response from the API
        """
        url = f"{self.base_url}/{endpoint}"
        
        # Encode credentials
        encoded_credentials = base64.b64encode(
            f"{self.username}:{self.password}".encode()
        ).decode()
        
        headers = {
            'Authorization': f'Basic {encoded_credentials}',
            'Content-Type': 'application/json'
        }
        
        try:
            response = requests.post(url, headers=headers, data=json.dumps(data))
            return response.json()
        except Exception as e:
            return {
                "status_code": 500,
                "status_message": f"Error making request: {str(e)}"
            }

    def get_search_volume(self, keywords, location="United States", language="English"):
        """
        Get search volume data for a list of keywords
        
        Args:
            keywords (list): List of keywords to get data for
            location (str): Location name for search data
            language (str): Language for search data
            
        Returns:
            dict: Response from the API
        """
        data = [{
            "keywords": keywords,
            "location_name": location,
            "language_name": language
        }]
        
        return self.make_request("keywords_data/google/search_volume/live", data)
    
    def get_keyword_suggestions(self, keyword, location="United States", language="English"):
        """
        Get keyword suggestions using DataForSEO Labs
        
        Args:
            keyword (str): Seed keyword
            location (str): Location name for search data
            language (str): Language for search data
            
        Returns:
            dict: Response from the API
        """
        data = [{
            "keyword": keyword,
            "location_name": location,
            "language_name": language,
            "limit": 100
        }]
        
        return self.make_request("dataforseo_labs/google/keyword_suggestions/live", data)
    
    def get_serp_data(self, keyword, location="United States", language="English", depth=10):
        """
        Get SERP data for a keyword
        
        Args:
            keyword (str): Keyword to get data for
            location (str): Location name for search data
            language (str): Language for search data
            depth (int): Number of results to return
            
        Returns:
            dict: Response from the API
        """
        data = [{
            "keyword": keyword,
            "location_name": location,
            "language_name": language,
            "depth": depth
        }]
        
        return self.make_request("serp/google/organic/live/regular", data)
    
    def get_domain_analytics(self, domain, location="United States", limit=10):
        """
        Get domain analytics data using DataForSEO Labs
        
        Args:
            domain (str): Domain to analyze
            location (str): Location name for search data
            limit (int): Number of results to return
            
        Returns:
            dict: Response from the API
        """
        data = [{
            "target": domain,
            "location_name": location,
            "limit": limit
        }]
        
        return self.make_request("dataforseo_labs/google/domain_rank_overview/live", data)
    
    def get_competitors(self, domain, location="United States", limit=10):
        """
        Get domain competitors using DataForSEO Labs
        
        Args:
            domain (str): Domain to get competitors for
            location (str): Location name for search data
            limit (int): Number of results to return
            
        Returns:
            dict: Response from the API
        """
        data = [{
            "target": domain,
            "location_name": location,
            "limit": limit
        }]
        
        return self.make_request("dataforseo_labs/google/competitors_domain/live", data)
    
    def get_backlinks(self, target, limit=10, target_type="domain"):
        """
        Get backlinks for a domain or URL
        
        Args:
            target (str): Domain or URL to get backlinks for
            limit (int): Number of results to return
            target_type (str): Type of target (domain, url)
            
        Returns:
            dict: Response from the API
        """
        data = [{
            "target": target,
            "limit": limit,
            "target_type": target_type
        }]
        
        return self.make_request("backlinks/overview/live", data)
    
    def get_keyword_difficulty(self, keywords, location="United States", language="English"):
        """
        Get keyword difficulty data using DataForSEO Labs
        
        Args:
            keywords (list): List of keywords to get data for
            location (str): Location name for search data
            language (str): Language for search data
            
        Returns:
            dict: Response from the API
        """
        data = [{
            "keywords": keywords,
            "location_name": location,
            "language_name": language
        }]
        
        return self.make_request("dataforseo_labs/google/bulk_keyword_difficulty/live", data)
    
    def get_traffic_analytics(self, domain, location="United States"):
        """
        Get traffic analytics for a domain
        
        Args:
            domain (str): Domain to analyze
            location (str): Location name for search data
            
        Returns:
            dict: Response from the API
        """
        data = [{
            "target": domain,
            "location_name": location
        }]
        
        return self.make_request("traffic_analytics/google/overview/live", data)
    
    def get_keyword_ideas(self, keyword, location="United States", language="English", limit=100):
        """
        Get keyword ideas using DataForSEO Labs
        
        Args:
            keyword (str): Seed keyword
            location (str): Location name
            language (str): Language name  
            limit (int): Number of results
            
        Returns:
            dict: Response from the API
        """
        data = [{
            "keywords": [keyword],
            "location_name": location,
            "language_name": language,
            "limit": limit
        }]
        
        return self.make_request("dataforseo_labs/google/keyword_ideas/live", data)
    
    def get_ranked_keywords(self, domain, location="United States", limit=100):
        """
        Get keywords that a domain ranks for using DataForSEO Labs
        
        Args:
            domain (str): Target domain
            location (str): Location name
            limit (int): Number of results
            
        Returns:
            dict: Response from the API
        """
        data = [{
            "target": domain,
            "location_name": location,
            "limit": limit
        }]
        
        return self.make_request("dataforseo_labs/google/ranked_keywords/live", data)
    
    def get_keyword_overview(self, keywords, location="United States", language="English"):
        """
        Get comprehensive keyword overview using DataForSEO Labs
        
        Args:
            keywords (list): List of keywords (up to 700)
            location (str): Location name
            language (str): Language name
            
        Returns:
            dict: Response from the API
        """
        data = [{
            "keywords": keywords,
            "location_name": location,
            "language_name": language
        }]
        
        return self.make_request("dataforseo_labs/google/keyword_overview/live", data)
    
    def get_domain_intersection(self, domain1, domain2, location="United States", limit=100):
        """
        Find common keywords between two domains using DataForSEO Labs
        
        Args:
            domain1 (str): First domain
            domain2 (str): Second domain  
            location (str): Location name
            limit (int): Number of results
            
        Returns:
            dict: Response from the API
        """
        data = [{
            "target1": domain1,
            "target2": domain2,
            "location_name": location,
            "limit": limit
        }]
        
        return self.make_request("dataforseo_labs/google/domain_intersection/live", data)
    
    def get_related_keywords(self, keyword, location="United States", language="English", limit=50):
        """
        Get related keywords using DataForSEO Labs
        
        Args:
            keyword (str): Seed keyword
            location (str): Location name
            language (str): Language name
            limit (int): Number of results
            
        Returns:
            dict: Response from the API
        """
        data = [{
            "keyword": keyword,
            "location_name": location,
            "language_name": language,
            "limit": limit
        }]
        
        return self.make_request("dataforseo_labs/google/related_keywords/live", data)
    
    def get_keyword_questions(self, keyword, location="United States", language="English", limit=50):
        """
        Get question-based keywords using DataForSEO Labs keyword ideas with filters
        
        Args:
            keyword (str): Seed keyword
            location (str): Location name
            language (str): Language name
            limit (int): Number of results
            
        Returns:
            dict: Response from the API
        """
        data = [{
            "keywords": [keyword],
            "location_name": location,
            "language_name": language,
            "limit": limit,
            "filters": [
                ["keyword_data.keyword", "regex", "^(what|how|why|when|where|who|which|can|is|are|do|does|will|would|could|should).*"]
            ]
        }]
        
        return self.make_request("dataforseo_labs/google/keyword_ideas/live", data)
    
    def get_long_tail_keywords(self, keyword, location="United States", language="English", limit=50):
        """
        Get long-tail keywords using DataForSEO Labs keyword ideas with word count filter
        
        Args:
            keyword (str): Seed keyword
            location (str): Location name
            language (str): Language name
            limit (int): Number of results
            
        Returns:
            dict: Response from the API
        """
        data = [{
            "keywords": [keyword],
            "location_name": location,
            "language_name": language,
            "limit": limit,
            "filters": [
                ["keyword_data.keyword", "regex", "^\\S+\\s+\\S+\\s+\\S+.*"]
            ]
        }]
        
        return self.make_request("dataforseo_labs/google/keyword_ideas/live", data)
    
    def get_domain_competitors(self, domain, location="United States", limit=10):
        """
        Get domain competitors using DataForSEO Labs
        
        Args:
            domain (str): Target domain
            location (str): Location name
            limit (int): Number of results
            
        Returns:
            dict: Response from the API
        """
        data = [{
            "target": domain,
            "location_name": location,
            "limit": limit
        }]
        
        return self.make_request("dataforseo_labs/google/competitors_domain/live", data)
