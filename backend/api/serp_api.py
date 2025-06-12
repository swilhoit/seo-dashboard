"""
SERP API Module
Provides endpoints for SERP (Search Engine Results Page) analysis.
"""
from flask import Blueprint, request, jsonify
from utils.dataforseo_client import DataForSEOClient

bp = Blueprint('serp', __name__)
client = DataForSEOClient()

@bp.route('/analysis', methods=['POST'])
def serp_analysis():
    """Get SERP data for a keyword"""
    data = request.get_json()
    if not data or 'keyword' not in data:
        return jsonify({"error": "Keyword is required"}), 400
    
    keyword = data['keyword']
    location = data.get('location', 'United States')
    language = data.get('language', 'English')
    depth = data.get('depth', 10)
    
    response = client.get_serp_data(keyword, location, language, depth)
    return jsonify(response)

@bp.route('/features', methods=['POST'])
def serp_features():
    """Get SERP features (knowledge graph, featured snippets, etc.)"""
    data = request.get_json()
    if not data or 'keyword' not in data:
        return jsonify({"error": "Keyword is required"}), 400
    
    keyword = data['keyword']
    location = data.get('location', 'United States')
    language = data.get('language', 'English')
    
    # Using advanced SERP API for features
    req_data = [{
        "keyword": keyword,
        "location_name": location,
        "language_name": language,
        "depth": 20  # Need enough depth to catch various features
    }]
    
    response = client.make_request("serp/google/organic/live/advanced", req_data)
    return jsonify(response)

@bp.route('/local-pack', methods=['POST'])
def local_pack():
    """Get local pack results for a keyword"""
    data = request.get_json()
    if not data or 'keyword' not in data:
        return jsonify({"error": "Keyword is required"}), 400
    
    keyword = data['keyword']
    location = data.get('location', 'United States')
    language = data.get('language', 'English')
    
    # Using regular SERP API but filtering for local pack
    req_data = [{
        "keyword": keyword,
        "location_name": location,
        "language_name": language,
        "depth": 10
    }]
    
    response = client.make_request("serp/google/organic/live/regular", req_data)
    
    # Process to extract just local pack data
    # Full implementation would need additional processing
    
    return jsonify(response)
