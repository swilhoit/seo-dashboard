#!/usr/bin/env python3
"""
Simple entry point for Railway deployment
"""
import os
import sys
from flask import Flask, jsonify

# Add backend directory to path
backend_path = os.path.join(os.path.dirname(__file__), 'backend')
sys.path.insert(0, backend_path)

# Create a simple app first for testing
app = Flask(__name__)

@app.route('/', methods=['GET'])
def root():
    """Root endpoint"""
    return jsonify({
        "message": "SEO Dashboard API",
        "status": "running",
        "version": "1.0.0"
    }), 200

@app.route('/health', methods=['GET'])
def health():
    """Simple health check"""
    return "OK", 200

@app.route('/api/health', methods=['GET'])
def api_health():
    """API health check"""
    return jsonify({
        "status": "healthy",
        "message": "SEO Dashboard API is running"
    }), 200

# Try to import the full app, fallback to simple app if there are issues
try:
    from app import app as full_app
    # If successful, use the full app
    app = full_app
except Exception as e:
    print(f"Warning: Could not import full app, using simple app: {e}")
    # Keep using the simple app defined above

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8000))
    app.run(debug=False, host='0.0.0.0', port=port)