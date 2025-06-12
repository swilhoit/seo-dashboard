"""
Competitor Analysis API Module
Provides endpoints for competitor analysis and comparisons.
"""
from flask import Blueprint, request, jsonify
from utils.dataforseo_client import DataForSEOClient

bp = Blueprint('competitor_analysis', __name__)
client = DataForSEOClient()

@bp.route('/competitors', methods=['POST'])
def get_competitors():
    """Get list of competitors for a domain"""
    data = request.get_json()
    if not data or 'domain' not in data:
        return jsonify({"error": "Domain is required"}), 400
    
    domain = data['domain']
    location = data.get('location', 'United States')
    limit = data.get('limit', 10)
    
    response = client.get_competitors(domain, location, limit)
    return jsonify(response)

@bp.route('/gap-analysis', methods=['POST'])
def gap_analysis():
    """Compare two domains for keyword gaps using DataForSEO Labs"""
    data = request.get_json()
    if not data or 'domain1' not in data or 'domain2' not in data:
        return jsonify({"error": "Both domains are required"}), 400
    
    domain1 = data['domain1']
    domain2 = data['domain2']
    location = data.get('location', 'United States')
    limit = data.get('limit', 100)
    
    response = client.get_domain_intersection(domain1, domain2, location, limit)
    return jsonify(response)

@bp.route('/common-keywords', methods=['POST'])
def common_keywords():
    """Get keywords that both domains rank for"""
    data = request.get_json()
    if not data or 'domains' not in data or len(data['domains']) < 2:
        return jsonify({"error": "At least two domains are required"}), 400
    
    domains = data['domains']
    location = data.get('location', 'United States')
    
    # We'll need to get keywords for each domain and then find the intersection
    results = {}
    
    for domain in domains:
        response = client.get_ranked_keywords(domain, location, 1000)
        results[domain] = response
    
    return jsonify({"domains": results})

@bp.route('/competitor-backlinks', methods=['POST'])
def competitor_backlinks():
    """Compare backlink profiles of competitors"""
    data = request.get_json()
    if not data or 'domains' not in data:
        return jsonify({"error": "At least one domain is required"}), 400
    
    domains = data['domains']
    limit = data.get('limit', 10)
    
    results = {}
    
    for domain in domains:
        response = client.get_backlinks(domain, limit)
        results[domain] = response
    
    return jsonify({"domains": results})

@bp.route('/domain-comparison', methods=['POST'])
def domain_comparison():
    """Compare two domains"""
    data = request.get_json()
    if not data or 'domain1' not in data or 'domain2' not in data:
        return jsonify({"error": "Both domains are required"}), 400
    
    domain1 = data['domain1']
    domain2 = data['domain2']
    location = data.get('location', 'United States')
    
    # Get domain analytics for both domains
    domain1_data = client.get_domain_analytics(domain1, location)
    domain2_data = client.get_domain_analytics(domain2, location)
    
    return jsonify({
        "domain1": domain1_data,
        "domain2": domain2_data
    })

@bp.route('/keyword-overlap', methods=['POST'])
def keyword_overlap():
    """Find keyword overlap between two domains"""
    data = request.get_json()
    if not data or 'domain1' not in data or 'domain2' not in data:
        return jsonify({"error": "Both domains are required"}), 400
    
    domain1 = data['domain1']
    domain2 = data['domain2']
    location = data.get('location', 'United States')
    limit = data.get('limit', 100)
    
    # Use domain intersection to find common keywords
    response = client.get_domain_intersection(domain1, domain2, location, limit)
    return jsonify(response)