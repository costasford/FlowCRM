# FlowCRM Deployment Guide

## GitHub Pages Deployment (Frontend Only)

### What Works on GitHub Pages:
- ✅ **React Frontend** - The entire UI and components
- ✅ **Demo/Showcase Mode** - Static demonstration of features
- ✅ **Code Portfolio** - Show off your development skills

### What Doesn't Work on GitHub Pages:
- ❌ **Node.js Backend** - GitHub Pages can't run server code
- ❌ **PostgreSQL Database** - No database hosting
- ❌ **User Authentication** - No backend to handle login
- ❌ **Data Persistence** - No real data storage

---

## Deployment Options

### Option 1: Frontend-Only Demo on GitHub Pages

**URL**: `https://costasford.github.io/FlowCRM`

**Setup Steps:**
```bash
# 1. Create GitHub repository
# 2. Install gh-pages for deployment
cd frontend
npm install --save-dev gh-pages

# 3. Add deployment scripts to package.json
# 4. Build and deploy
npm run build
npm run deploy
```

**Package.json additions:**
```json
{
  "homepage": "https://costasford.github.io/FlowCRM",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

**Features Available:**
- UI/UX demonstration
- Component showcase
- Design portfolio piece
- Code quality demonstration

---

### Option 2: Full-Stack Deployment (Recommended)

For a **fully functional FlowCRM**, you need hosting that supports:
- Node.js backend
- PostgreSQL database
- Environment variables

#### **Free Options:**

**1. Railway.app**
- ✅ Free tier with PostgreSQL
- ✅ Automatic deployments from GitHub
- ✅ Environment variables
- 📍 URL: `flowcrm-production.up.railway.app`

**2. Render.com**
- ✅ Free tier (with limitations)
- ✅ PostgreSQL hosting
- ✅ GitHub integration
- 📍 URL: `flowcrm.onrender.com`

**3. Vercel + Supabase**
- ✅ Frontend on Vercel
- ✅ PostgreSQL on Supabase
- ✅ Serverless functions for API
- 📍 URL: `flowcrm.vercel.app`

**4. Netlify + Supabase**
- ✅ Frontend on Netlify  
- ✅ PostgreSQL on Supabase
- ✅ Netlify Functions for API
- 📍 URL: `flowcrm.netlify.app`

#### **Paid Options:**

**1. DigitalOcean App Platform**
- 💰 ~$12/month
- ✅ Full stack support
- ✅ Managed PostgreSQL
- ✅ Custom domains

**2. AWS/GCP/Azure**
- 💰 Variable pricing
- ✅ Enterprise-grade
- ✅ Scalable
- ✅ Custom domains

---

## Quick Setup: GitHub Pages Demo

If you want to showcase FlowCRM on GitHub Pages as a portfolio piece:

### 1. Update Frontend for Static Demo

Create `frontend/src/utils/demoData.js`:
```javascript
// Mock data for GitHub Pages demo
export const demoDeals = [
  {
    id: '1',
    title: 'Sunset Apartments - Maintenance Contract',
    value: 180000,
    stage: 'proposal',
    contact: { name: 'Sarah Johnson' },
    company: { name: 'Sunset Apartments' }
  },
  // ... more demo data
];

export const demoStats = {
  totalDeals: 10,
  totalValue: 850000,
  avgDealSize: 85000
};
```

### 2. Create Demo Mode Toggle

Update `frontend/src/utils/api.js`:
```javascript
const isGitHubPages = window.location.hostname.includes('github.io');

if (isGitHubPages) {
  // Use mock data for GitHub Pages
  return demoData;
} else {
  // Use real API
  return api.post('/auth/login', { email, password });
}
```

### 3. Deploy to GitHub Pages

```bash
cd frontend
npm install --save-dev gh-pages
npm run deploy
```

---

## Recommended Approach: Hybrid

**Best of both worlds:**

1. **GitHub Pages**: Portfolio/demo version at `costasford.github.io/FlowCRM`
   - Shows your coding skills
   - Demonstrates UI/UX design
   - Interactive demo with mock data

2. **Production Hosting**: Fully functional version at custom domain
   - Real authentication and data
   - For actual business use
   - Your wife's property management

---

## Environment-Specific Configuration

### GitHub Pages Build
```json
// frontend/package.json
{
  "scripts": {
    "build:demo": "VITE_DEMO_MODE=true vite build",
    "build:production": "vite build"
  }
}
```

### Environment Detection
```javascript
// frontend/src/config/environment.js
export const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true';
export const isGitHubPages = window.location.hostname.includes('github.io');
export const apiBaseUrl = isDemoMode ? '/mock' : 'https://api.flowcrm.com';
```

---

## Summary

**For Portfolio/Demo**: Use GitHub Pages with mock data  
**For Business Use**: Use full-stack hosting (Railway, Render, etc.)  
**Best Practice**: Deploy both versions for different purposes

The GitHub Pages version showcases your development skills, while the production version serves your wife's business needs.