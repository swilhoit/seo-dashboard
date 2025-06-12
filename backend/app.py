#!/usr/bin/env python3
"""
SEO Dashboard Backend Application
A Flask application that serves as the backend for our SEO dashboard tool.
"""
import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
from api import keyword_research_api, domain_analytics_api, competitor_analysis_api, serp_api

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Register API blueprints
app.register_blueprint(keyword_research_api.bp, url_prefix='/api/keyword-research')
app.register_blueprint(domain_analytics_api.bp, url_prefix='/api/domain-analytics')
app.register_blueprint(competitor_analysis_api.bp, url_prefix='/api/competitor-analysis')
app.register_blueprint(serp_api.bp, url_prefix='/api/serp')

@app.route('/api/status', methods=['GET'])
def status():
    """API status check endpoint"""
    return jsonify({
        "status": "online",
        "version": "1.0.0",
        "service": "SEO Dashboard API"
    })

@app.route('/api/test-connection', methods=['POST'])
def test_connection():
    """Test DataForSEO API credentials"""
    from utils.dataforseo_client import DataForSEOClient
    
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return jsonify({
            "success": False,
            "message": "Username and password are required"
        }), 400
    
    try:
        # Create a temporary client and try to authenticate
        client = DataForSEOClient(username, password)
        result = client.test_connection()
        
        if result['success']:
            return jsonify({
                "success": True,
                "message": "Connection successful"
            })
        else:
            return jsonify({
                "success": False,
                "message": result.get('message', 'Authentication failed')
            }), 401
    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint for deployment platforms"""
    return jsonify({
        "status": "healthy",
        "message": "SEO Dashboard API is running"
    }), 200

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    # Use 0.0.0.0 to listen on all interfaces for Railway
    # Disable debug mode in production
    debug_mode = os.environ.get('DEBUG', 'False').lower() == 'true'
    app.run(debug=debug_mode, host='0.0.0.0', port=port)
