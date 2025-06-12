"""
Domain Analytics API Module
Provides endpoints for domain analytics and insights.
"""
from flask import Blueprint, request, jsonify
from utils.dataforseo_client import DataForSEOClient

bp = Blueprint('domain_analytics', __name__)
client = DataForSEOClient()

@bp.route('/overview', methods=['POST'])
def domain_overview():
    """Get domain overview data"""
    data = request.get_json()
    if not data or 'domain' not in data:
        return jsonify({"error": "Domain is required"}), 400
    
    domain = data['domain']
    location = data.get('location', 'United States')
    limit = data.get('limit', 10)
    
    response = client.get_domain_analytics(domain, location, limit)
    return jsonify(response)

@bp.route('/backlinks', methods=['POST'])
def backlinks():
    """Get domain backlinks data"""
    data = request.get_json()
    if not data or 'target' not in data:
        return jsonify({"error": "Target domain/URL is required"}), 400
    
    target = data['target']
    limit = data.get('limit', 10)
    target_type = data.get('target_type', 'domain')
    
    response = client.get_backlinks(target, limit, target_type)
    return jsonify(response)

@bp.route('/traffic', methods=['POST'])
def traffic_analytics():
    """Get domain traffic analytics"""
    data = request.get_json()
    if not data or 'domain' not in data:
        return jsonify({"error": "Domain is required"}), 400
    
    domain = data['domain']
    location = data.get('location', 'United States')
    
    response = client.get_traffic_analytics(domain, location)
    return jsonify(response)

@bp.route('/keywords', methods=['POST'])
def domain_keywords():
    """Get domain ranking keywords using DataForSEO Labs"""
    data = request.get_json()
    if not data or 'domain' not in data:
        return jsonify({"error": "Domain is required"}), 400
    
    domain = data['domain']
    location = data.get('location', 'United States')
    limit = data.get('limit', 100)
    
    response = client.get_ranked_keywords(domain, location, limit)
    return jsonify(response)

@bp.route('/competitors', methods=['POST'])
def domain_competitors():
    """Get competitors for a domain"""
    data = request.get_json()
    if not data or 'domain' not in data:
        return jsonify({"error": "Domain is required"}), 400
    
    domain = data['domain']
    location = data.get('location', 'United States')
    limit = data.get('limit', 10)
    
    response = client.get_domain_competitors(domain, location, limit)
    return jsonify(response)
