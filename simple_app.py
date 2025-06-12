#!/usr/bin/env python3
"""
Minimal Flask app for Railway deployment testing
This app will work even if there are issues with the backend imports
"""
import os
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/', methods=['GET'])
def root():
    """Root endpoint"""
    return jsonify({
        "message": "SEO Dashboard API - Simple Mode",
        "status": "running",
        "version": "1.0.0",
        "note": "Basic health check mode - full API features loading separately"
    }), 200

@app.route('/health', methods=['GET'])
def health():
    """Simple health check for deployment platforms"""
    return "OK", 200

@app.route('/api/health', methods=['GET'])
def api_health():
    """Detailed health check"""
    return jsonify({
        "status": "healthy",
        "message": "SEO Dashboard API is running",
        "mode": "simple",
        "timestamp": "2024-01-01"
    }), 200

@app.route('/ping', methods=['GET'])
def ping():
    """Ultra simple ping endpoint"""
    return "pong", 200

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8000))
    debug_mode = os.environ.get('DEBUG', 'False').lower() == 'true'
    app.run(debug=debug_mode, host='0.0.0.0', port=port)