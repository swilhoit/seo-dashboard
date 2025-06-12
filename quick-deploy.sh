#!/bin/bash

echo "🚀 Quick Deploy Script for SEO Dashboard"
echo "========================================"

# Change to project directory
cd "/Users/samwilhoit/Documents/seo tool/seo_dashboard"

echo ""
echo "Step 1: Checking Railway status..."
if command -v railway &> /dev/null; then
    echo "✅ Railway CLI is installed"
    echo "🔗 Attempting to get Railway info..."
    
    # Try to get Railway status (will fail if not logged in/linked)
    if railway status 2>/dev/null; then
        echo "✅ Railway project is linked"
        echo ""
        echo "🌍 Getting Railway domain..."
        railway domain
    else
        echo "❌ Railway not linked. Please run:"
        echo "   railway login"
        echo "   railway link"
    fi
else
    echo "❌ Railway CLI not found"
fi

echo ""
echo "Step 2: Checking Vercel setup..."
if command -v vercel &> /dev/null; then
    echo "✅ Vercel CLI is installed"
    echo "📁 Checking if frontend can be deployed..."
    
    if [ -d "frontend" ]; then
        echo "✅ Frontend directory found"
        echo "📦 Frontend package.json exists: $([ -f "frontend/package.json" ] && echo "✅" || echo "❌")"
        
        echo ""
        echo "🚀 To deploy frontend with Vercel, run:"
        echo "   vercel --cwd frontend"
        echo ""
        echo "💡 After deployment, set environment variable:"
        echo "   vercel env add REACT_APP_API_URL"
        echo "   # Use your Railway URL from above"
    else
        echo "❌ Frontend directory not found"
    fi
else
    echo "❌ Vercel CLI not found"
fi

echo ""
echo "🔍 Quick Health Check:"
echo "====================="
echo "If you have your Railway URL, test it:"
echo "   curl https://YOUR_RAILWAY_URL.railway.app/ping"
echo ""
echo "Expected response: 'pong'"

echo ""
echo "📋 Manual Commands Summary:"
echo "=========================="
echo "railway login && railway link && railway domain"
echo "vercel login && vercel --cwd frontend"
echo "vercel env add REACT_APP_API_URL"