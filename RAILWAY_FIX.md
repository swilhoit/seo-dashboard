# Railway Deployment Fix Guide

## The Problem
Flask/Werkzeug version incompatibility causing import errors.

## Progressive Deployment Strategy

### Phase 1: Get Health Check Working (Current Config)

**File: `minimal_app.py`**
- Uses only Python standard library
- No external dependencies
- Simple HTTP server with health endpoints

**Railway Settings:**
```
Start Command: python minimal_app.py
Health Check Path: /ping
Health Check Timeout: 300
```

**Test URLs:**
- `/ping` → returns "pong"
- `/health` → returns "OK" 
- `/` → returns JSON status

### Phase 2: Add Flask (After Phase 1 Works)

**Update Procfile to:**
```
web: gunicorn simple_app:app --bind 0.0.0.0:$PORT --timeout 120
```

**Requirements.txt now has compatible versions:**
- flask==2.3.3
- werkzeug==2.3.7
- flask-cors==4.0.0

### Phase 3: Full API (After Phase 2 Works)

**Update Procfile to:**
```
web: gunicorn main:app --bind 0.0.0.0:$PORT --timeout 120
```

## Manual Railway Steps

1. **Current Deployment** should work with minimal_app.py
2. **Test health check**: Visit `https://your-app.railway.app/ping`
3. **If working**: Proceed to Phase 2
4. **If not working**: Check Railway logs for Python errors

## Alternative Manual Settings

If the config files don't work, manually set in Railway:

**Build:**
- Builder: Nixpacks

**Deploy:**
- Start Command: `python minimal_app.py`
- Health Check Path: `/ping`
- Health Check Timeout: 300

**Environment Variables:**
```
PORT=8000
```

## Troubleshooting

**If minimal_app.py fails:**
- Check if Python is available in build logs
- Verify PORT environment variable is set
- Try disabling health checks temporarily

**If Flask import errors persist:**
- Use the updated requirements.txt with compatible versions
- Clear Railway cache and redeploy