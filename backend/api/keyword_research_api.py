"""
Keyword Research API Module
Provides endpoints for keyword research, suggestions, and analysis.
"""
from flask import Blueprint, request, jsonify
from utils.dataforseo_client import DataForSEOClient

bp = Blueprint('keyword_research', __name__)
client = DataForSEOClient()

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
