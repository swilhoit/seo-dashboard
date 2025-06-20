"""
Keyword Research API Module
Provides endpoints for keyword research, suggestions, and analysis.
"""
from flask import Blueprint, request, jsonify
from utils.dataforseo_client import DataForSEOClient
import os
import openai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

bp = Blueprint('keyword_research', __name__)
client = DataForSEOClient()

# Initialize OpenAI API
openai_api_key = os.environ.get('OPENAI_API_KEY')

@bp.route('/search-volume', methods=['POST'])
def search_volume():
    """Get search volume data for a list of keywords"""
    data = request.get_json()
    if not data or 'keywords' not in data:
        return jsonify({"error": "Keywords are required"}), 400
    
    keywords = data['keywords']
    location = data.get('location', 'United States')
    language = data.get('language', 'English')
    
    response = client.get_search_volume(keywords, location, language)
    return jsonify(response)

@bp.route('/suggestions', methods=['POST'])
def suggestions():
    """Get keyword suggestions for a seed keyword"""
    data = request.get_json()
    if not data or 'keyword' not in data:
        return jsonify({"error": "Keyword is required"}), 400
    
    keyword = data['keyword']
    location = data.get('location', 'United States')
    language = data.get('language', 'English')
    
    response = client.get_keyword_suggestions(keyword, location, language)
    return jsonify(response)

@bp.route('/ideas', methods=['POST'])
def keyword_ideas():
    """Get keyword ideas for a seed keyword"""
    data = request.get_json()
    if not data or 'keyword' not in data:
        return jsonify({"error": "Keyword is required"}), 400
    
    keyword = data['keyword']
    location = data.get('location', 'United States')
    language = data.get('language', 'English')
    limit = data.get('limit', 100)
    
    response = client.get_keyword_ideas(keyword, location, language, limit)
    return jsonify(response)

@bp.route('/overview', methods=['POST'])
def keyword_overview():
    """Get comprehensive keyword overview data"""
    data = request.get_json()
    if not data or 'keywords' not in data:
        return jsonify({"error": "Keywords are required"}), 400
    
    keywords = data['keywords']
    location = data.get('location', 'United States')
    language = data.get('language', 'English')
    
    response = client.get_keyword_overview(keywords, location, language)
    return jsonify(response)

@bp.route('/difficulty', methods=['POST'])
def difficulty():
    """Get keyword difficulty data for a list of keywords"""
    data = request.get_json()
    if not data or 'keywords' not in data:
        return jsonify({"error": "Keywords are required"}), 400
    
    keywords = data['keywords']
    location = data.get('location', 'United States')
    language = data.get('language', 'English')
    
    response = client.get_keyword_difficulty(keywords, location, language)
    return jsonify(response)

@bp.route('/analyze', methods=['POST'])
def analyze():
    """Comprehensive keyword analysis (combines multiple endpoints)"""
    data = request.get_json()
    if not data or 'keywords' not in data:
        return jsonify({"error": "Keywords are required"}), 400
    
    keywords = data['keywords']
    location = data.get('location', 'United States')
    language = data.get('language', 'English')
    
    # Get search volume
    volume_response = client.get_search_volume(keywords, location, language)
    
    # Get keyword difficulty
    difficulty_response = client.get_keyword_difficulty(keywords, location, language)
    
    # Combine results
    results = {
        "search_volume": volume_response,
        "difficulty": difficulty_response
    }
    
    return jsonify(results)

@bp.route('/related', methods=['POST'])
def related_keywords():
    """Get related keywords for a seed keyword"""
    data = request.get_json()
    if not data or 'keyword' not in data:
        return jsonify({"error": "Keyword is required"}), 400
    
    keyword = data['keyword']
    location = data.get('location', 'United States')
    language = data.get('language', 'English')
    limit = data.get('limit', 50)
    
    response = client.get_related_keywords(keyword, location, language, limit)
    return jsonify(response)

@bp.route('/questions', methods=['POST'])
def questions():
    """Get question-based keywords for a seed keyword"""
    data = request.get_json()
    if not data or 'keyword' not in data:
        return jsonify({"error": "Keyword is required"}), 400
    
    keyword = data['keyword']
    location = data.get('location', 'United States')
    language = data.get('language', 'English')
    limit = data.get('limit', 50)
    
    # Use keyword ideas with question filter
    response = client.get_keyword_questions(keyword, location, language, limit)
    return jsonify(response)

@bp.route('/long-tail', methods=['POST'])
def long_tail():
    """Get long-tail keywords for a seed keyword"""
    data = request.get_json()
    if not data or 'keyword' not in data:
        return jsonify({"error": "Keyword is required"}), 400
    
    keyword = data['keyword']
    location = data.get('location', 'United States')
    language = data.get('language', 'English')
    limit = data.get('limit', 50)
    
    response = client.get_long_tail_keywords(keyword, location, language, limit)
    return jsonify(response)

@bp.route('/ai-suggestions', methods=['POST'])
def ai_suggestions():
    """Get AI-powered keyword suggestions that are semantically related to the seed keyword"""
    data = request.get_json()
    if not data or 'keyword' not in data:
        return jsonify({"error": "Keyword is required"}), 400
    
    keyword = data['keyword']
    location = data.get('location', 'United States')
    language = data.get('language', 'English')
    limit = data.get('limit', 15)
    industry = data.get('industry', '')
    
    # Check if OpenAI API key is configured
    if not openai_api_key:
        return jsonify({"error": "OpenAI API key is not configured"}), 500
    
    try:
        # Get AI-generated keyword suggestions
        ai_keywords = generate_ai_keyword_suggestions(keyword, industry, limit)
        
        if len(ai_keywords) == 0:
            return jsonify({"error": "Could not generate keyword suggestions"}), 500
        
        # Get metrics for the AI-generated keywords
        metrics_response = client.get_keyword_overview(ai_keywords, location, language)
        
        # Add source info to differentiate from regular keywords
        result = {
            "source": "ai",
            "seed_keyword": keyword,
            "ai_keywords": ai_keywords,
            "metrics": metrics_response
        }
        
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def generate_ai_keyword_suggestions(keyword, industry='', limit=15):
    """
    Generate semantically related keywords using OpenAI's API
    
    Args:
        keyword (str): The seed keyword
        industry (str): Optional industry for context
        limit (int): Maximum number of keywords to generate
        
    Returns:
        list: List of AI-generated related keywords
    """
    client = openai.OpenAI(api_key=openai_api_key)
    
    industry_context = f" in the {industry} industry" if industry else ""
    
    # Prompt with clear instructions to generate diverse but relevant keywords
    system_prompt = """You are a professional SEO keyword researcher. 
    Generate semantically related keywords that would be valuable for content creation and SEO.
    Focus on a mix of:
    1. Related terms with high search intent
    2. Questions people might ask about this topic
    3. Long-tail variations with commercial/informational intent
    4. Industry-specific terminology
    
    Return ONLY a JSON array of strings with no explanation, introduction or other text.
    Example output format: {"keywords": ["keyword one", "keyword two", "keyword three"...]}
    """
    
    user_prompt = f"Generate {limit} semantically related keywords for '{keyword}'{industry_context}. Make sure they're diverse but relevant."

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            response_format={"type": "json_object"},
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.7,
            max_tokens=1000
        )
        
        # Extract the keyword array from the JSON response
        import json
        result = json.loads(response.choices[0].message.content)
        
        # Return the keywords array, or empty list if not found
        return result.get("keywords", []) if isinstance(result, dict) and "keywords" in result else []
        
    except Exception as e:
        print(f"Error generating AI keywords: {str(e)}")
        return []
