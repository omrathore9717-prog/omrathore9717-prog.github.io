# Deployment Guide - OM Financial Service

## Deployment to Render.com

### ✅ Current Deployment Status

The project is configured and ready for deployment to Render.com.

**Configuration File:** `render.yaml`

```yaml
services:
  - type: web
    name: om-financial-service-backend
    env: python
    plan: free (can upgrade anytime)
    branch: main
    region: oregon
    buildCommand: "pip install -r requirements.txt"
    startCommand: "gunicorn app:app"
    autoDeploy: true
    envVars:
      - FLASK_ENV: production
      - PYTHONUNBUFFERED: 1
```

## Deployment Process

### Step 1: Connect GitHub to Render

1. Go to **https://dashboard.render.com**
2. Sign up / Log in with GitHub
3. Click **"New +"** → **"Web Service"**
4. Select your **GitHub repository**
   - Repository: `omrathore9717-prog/om-financial-service`
   - Branch: `main`
5. Click **"Connect"**

### Step 2: Configure Service

**Service Settings:**
- **Name:** `om-financial-service-backend`
- **Environment:** Python
- **Build Command:** `pip install -r requirements.txt`
- **Start Command:** `gunicorn app:app`
- **Plan:** Free tier (or Starter for better performance)

**Environment Variables:**
```
FLASK_ENV = production
PYTHONUNBUFFERED = 1
```

### Step 3: Deploy

1. Click **"Deploy"**
2. Render will:
   - ✅ Pull code from GitHub
   - ✅ Install dependencies
   - ✅ Start Gunicorn server
   - ✅ Generate domain URL

**Deployment typically takes 2-5 minutes**

### Step 4: Verify Deployment

Once deployed, Render provides a URL like:
```
https://om-financial-service-backend.onrender.com
```

**Test the deployed service:**

```bash
# Health check
curl https://om-financial-service-backend.onrender.com/api/health

# Test SIP calculator
curl -X POST https://om-financial-service-backend.onrender.com/api/calculators/sip \
  -H "Content-Type: application/json" \
  -d '{"monthly_amount": 5000, "annual_rate": 12, "years": 5}'

# Access Swagger API docs
https://om-financial-service-backend.onrender.com/apidocs/
```

## Automatic Deployment

### Auto-Deploy Configuration

The `render.yaml` includes:
```yaml
autoDeploy: true
branch: main
```

**This means:**
- ✅ Every push to `main` triggers automatic deployment
- ✅ No manual deployment needed
- ✅ Changes go live within 2-5 minutes

### How to Deploy New Changes

```bash
# 1. Make code changes locally
# 2. Test locally
pytest tests/ -v

# 3. Commit changes
git add .
git commit -m "Your commit message"

# 4. Push to GitHub
git push origin main

# 5. Render automatically deploys
# No additional steps needed!

# 6. Monitor deployment
# Visit: https://dashboard.render.com → Select service → Events
```

## Monitoring Deployment

### Check Deployment Status

1. Go to **https://dashboard.render.com**
2. Select **`om-financial-service-backend`** service
3. View **"Events"** tab to see:
   - Build logs
   - Deployment status
   - Error messages (if any)

### View Application Logs

```
In Render Dashboard:
Service → Logs
```

Shows real-time application output and errors.

## Troubleshooting Deployment

### Issue: Build Failed

**Common cause:** Missing dependencies

**Solution:**
```bash
# Ensure all dependencies in requirements.txt
pip freeze > requirements.txt

# Test locally before pushing
pip install -r requirements.txt
python app.py
```

### Issue: Server Not Starting

**Logs will show:**
```
error: Error R10 (Boot timeout)
```

**Common causes:**
- Flask trying to listen on wrong port
- Missing environment variables
- Syntax errors in app.py

**Solution:**
1. Check `app.py` uses `os.getenv('PORT', 5000)`
2. Verify environment variables in render.yaml
3. Test locally: `python app.py`

### Issue: Database Connection Error

**Current project doesn't use database** ✅

If adding database later:
1. Add database service in render.yaml
2. Set `DATABASE_URL` environment variable
3. Update app.py to use connection string

## Performance Optimization

### Free Tier Limitations

The **free tier** includes:
- 0.5 CPU
- 512 MB RAM
- Spins down after 15 minutes of inactivity
- Auto-starts on next request (5-10 second delay)

### Upgrading to Starter Plan

For **production use**, upgrade to **Starter** ($7/month):
- Always running (no spin-down)
- 1 CPU
- 1 GB RAM
- Better performance

**To upgrade:**
1. Go to Service → Settings
2. Click "Change Plan"
3. Select Starter ($7/month)

## Domain Configuration

### Current Setup

Your app runs at:
```
https://om-financial-service-backend.onrender.com
```

### Add Custom Domain

To use your own domain (`omfinancialservice.com`):

1. In Render Dashboard → Service Settings
2. Add Custom Domain
3. Update DNS records at your domain registrar
4. Point domain to Render nameservers

**CNAME record:**
```
om-financial-service.onrender.com
```

## Database (Future)

When adding database support:

```yaml
# Add to render.yaml
services:
  - type: web
    # ... existing config ...
    
  - type: pserv
    name: om-db
    env: postgres
    plan: free
    ipAllowList: []
```

## Environment Variables

### Current Configuration

```bash
FLASK_ENV=production        # Disables debug mode
PYTHONUNBUFFERED=1         # Real-time log output
PORT=5000                  # (Optional) Gunicorn sets this
```

### Add Additional Variables

In Render Dashboard:
1. Service → Settings
2. Environment
3. Add new variables:
   ```
   API_KEY = your_key_here
   SECRET = your_secret_here
   ```

## Deployment Checklist

Before deploying to production:

- [ ] All tests passing locally (`pytest tests/ -v`)
- [ ] No hardcoded secrets in code
- [ ] requirements.txt updated
- [ ] render.yaml configured correctly
- [ ] Environment variables set in Render dashboard
- [ ] render.yaml committed to GitHub
- [ ] Code pushed to main branch
- [ ] Deployment completes without errors
- [ ] Health check endpoint responds ✓
- [ ] Calculator endpoints work ✓
- [ ] API docs accessible at /apidocs/ ✓

## Rollback Procedure

If deployment fails or app breaks:

### Method 1: Revert Last Commit (Recommended)
```bash
git log  # View commit history
git revert <commit-hash>
git push origin main
# Render automatically redeploys
```

### Method 2: Manual Rollback in Render
1. Dashboard → Events
2. Click on previous successful deployment
3. Click "Redeploy"

## Monitoring Production

### Health Checks

Render automatically checks if app is healthy:
- Endpoint: `/api/health`
- Frequency: Every 30 seconds
- Expected: 200 status code

If health check fails 3 times, service restarts.

### Logs

```bash
# SSH into service (if enabled)
render logs <service-id>

# Or view in dashboard
Render Dashboard → Service → Logs
```

### Metrics

Monitor in Render Dashboard:
- CPU usage
- Memory usage
- Requests/sec
- Response times

## Cost Analysis

### Pricing (as of June 2026)

**Free Tier:**
- $0/month
- Limited resources
- Spins down after inactivity

**Starter Plan:**
- $7/month
- Always running
- Better performance

**Standard Plan:**
- $25/month
- 2 CPU, 2 GB RAM

## Success Criteria

Deployment is successful when:

1. ✅ Service shows "Live" in Render dashboard
2. ✅ Health endpoint returns 200 status
3. ✅ All calculators respond correctly
4. ✅ Swagger API docs load at /apidocs/
5. ✅ No errors in logs
6. ✅ Response time < 500ms

## Live Service URLs

Once deployed:

| Resource | URL |
|----------|-----|
| Homepage | `https://om-financial-service-backend.onrender.com/` |
| Health Check | `https://om-financial-service-backend.onrender.com/api/health` |
| API Docs (Swagger) | `https://om-financial-service-backend.onrender.com/apidocs/` |
| SIP Calculator | `https://om-financial-service-backend.onrender.com/api/calculators/sip` |
| EMI Calculator | `https://om-financial-service-backend.onrender.com/api/calculators/emi` |
| Lumpsum Calculator | `https://om-financial-service-backend.onrender.com/api/calculators/lumpsum` |
| Retirement Planner | `https://om-financial-service-backend.onrender.com/api/calculators/retirement` |

## Next Steps

1. ✅ Push code to GitHub main branch
2. ✅ Connect GitHub to Render.com
3. ✅ Configure service in Render dashboard
4. ✅ First deployment starts automatically
5. ✅ Verify endpoints working
6. ✅ Set up custom domain (optional)
7. ✅ Monitor in production

## Support

- **Render Documentation:** https://render.com/docs
- **GitHub Deployment:** https://render.com/docs/deploy-from-github
- **Troubleshooting:** https://render.com/docs/troubleshooting

---

**Deployment Configuration:** ✅ Ready  
**Last Updated:** June 13, 2026  
**Framework:** Flask 2.3.3 + Gunicorn 21.2.0
