# CollabBoard Deployment Guide

This guide explains how to deploy CollabBoard to Vercel with optional Supabase backend integration.

## Table of Contents
1. [Quick Deploy (No Backend)](#quick-deploy-no-backend)
2. [Full Deploy with Supabase Backend](#full-deploy-with-supabase-backend)
3. [Local Development](#local-development)
4. [Environment Variables](#environment-variables)
5. [Troubleshooting](#troubleshooting)

---

## Quick Deploy (No Backend)

The app works perfectly without Supabase using localStorage and URL-based sharing.

### Deploy to Vercel (CLI)

```bash
# Install Vercel CLI globally
npm install -g vercel

# Deploy from project root
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? collabboard (or your choice)
# - Directory? ./ (current directory)
# - Override settings? No

# Once deployed, visit the provided URL!
```

### Deploy to Vercel (Dashboard)

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your Git repository (GitHub/GitLab/Bitbucket)
4. Configure:
   - **Framework Preset**: Other
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. Click "Deploy"

**Features in No-Backend Mode:**
- ✅ Create and manage boards
- ✅ URL-based sharing
- ✅ localStorage persistence
- ✅ Same-device multi-tab sync
- ❌ No cross-device real-time sync
- ❌ No authentication
- ❌ No persistent server storage

---

## Full Deploy with Supabase Backend

Enable real-time collaboration, authentication, and persistent storage.

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Fill in details:
   - **Name**: CollabBoard
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Select closest to your users
4. Click "Create new project" (takes 1-2 minutes)

### Step 2: Apply Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Click "New query"
3. Copy contents of `tools/supabase_schema.sql` from this repo
4. Paste into SQL editor
5. Click "Run" or press Ctrl/Cmd + Enter
6. Verify success: Check **Table Editor** for these tables:
   - `boards`
   - `participants`
   - `items`
   - `votes`

### Step 3: Configure Authentication

1. Go to **Authentication** → **Providers**
2. Enable **Email** provider
3. Configure settings:
   - ✅ Enable Email provider
   - ✅ Enable email confirmations (recommended)
   - ✅ Secure email change
   - ❌ Mailer autoconfirm (leave OFF)
4. Click "Save"

### Step 4: Enable Realtime

1. Go to **Database** → **Replication**
2. Enable Realtime for these tables:
   - ✅ `participants`
   - ✅ `items`
   - ✅ `votes`
3. Click "Save" for each

### Step 5: Get Credentials

1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (e.g., `https://abcdefgh.supabase.co`)
   - **anon public key** (starts with `eyJ...`)

### Step 6: Configure Vercel Environment Variables

**Option A: Via Vercel Dashboard**

1. Go to your project on [vercel.com](https://vercel.com)
2. Click **Settings** → **Environment Variables**
3. Add two variables:

   | Name | Value |
   |------|-------|
   | `SUPABASE_URL` | Your Project URL |
   | `SUPABASE_ANON_KEY` | Your anon key |

4. Select which environments: **Production**, **Preview**, **Development**
5. Click "Save"
6. Redeploy your project to apply changes

**Option B: Via Vercel CLI**

```bash
# Set production environment variables
vercel env add SUPABASE_URL production
# Paste your URL when prompted

vercel env add SUPABASE_ANON_KEY production
# Paste your anon key when prompted

# Pull env vars for local development (optional)
vercel env pull .env.local
```

### Step 7: Deploy!

```bash
# Deploy to production
vercel --prod

# Or push to your main branch (if connected to Git)
git push origin main
```

**Features with Backend:**
- ✅ Everything from no-backend mode
- ✅ Cross-device real-time synchronization
- ✅ Email magic link authentication
- ✅ Persistent server-side storage
- ✅ Proper user roles (admin/member)
- ✅ Row-Level Security (RLS)

---

## Local Development

### Without Backend (Fallback Mode)

```bash
# Build the project
npm run build

# Serve locally
npm run serve

# Open http://localhost:3000
```

### With Supabase Backend

```bash
# Create .env.local file
cp .env.example .env.local

# Edit .env.local and add your Supabase credentials:
# SUPABASE_URL=https://your-project.supabase.co
# SUPABASE_ANON_KEY=your-anon-key

# Build with environment variables
npm run build

# Serve locally
npm run serve

# Open http://localhost:3000
```

**Note**: The build script reads environment variables from your shell/system environment, not from `.env` files. To use `.env` files locally:

```bash
# Option 1: Export variables before building
export SUPABASE_URL="https://your-project.supabase.co"
export SUPABASE_ANON_KEY="your-anon-key"
npm run build

# Option 2: Use dotenv (install first)
npm install --save-dev dotenv-cli
# Then update package.json build script to:
# "build": "dotenv -e .env.local -- node build.js"
```

---

## Environment Variables

### Available Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `SUPABASE_URL` | No | Your Supabase project URL |
| `SUPABASE_ANON_KEY` | No | Your Supabase anonymous/public key |

### Security Notes

- ✅ The anon key is **safe to expose** in client-side code
- ✅ Row-Level Security (RLS) policies protect your data
- ❌ **NEVER** commit `.env` files to Git
- ❌ **NEVER** use your Supabase `service_role` key (admin key) in frontend code

---

## Troubleshooting

### Build Fails on Vercel

**Error**: `Cannot find module 'build.js'`

**Solution**: Ensure these files exist in your repository:
- `package.json`
- `build.js`
- `vercel.json`

### Environment Variables Not Working

**Symptoms**: App runs in fallback mode despite setting env vars

**Solutions**:
1. Check Vercel dashboard: Settings → Environment Variables
2. Ensure variables are set for correct environment (Production/Preview/Development)
3. Redeploy after adding variables
4. Check browser console for Supabase connection logs

### Supabase Connection Errors

**Error**: `Invalid JWT` or `Failed to fetch`

**Solutions**:
1. Verify your `SUPABASE_URL` is correct (should be `https://xxx.supabase.co`)
2. Verify your `SUPABASE_ANON_KEY` is the anon/public key (not service_role)
3. Check Supabase project isn't paused (free tier limitation)
4. Ensure schema was applied successfully

### RLS Policy Errors

**Error**: `new row violates row-level security policy`

**Solutions**:
1. Re-run the entire `tools/supabase_schema.sql` script
2. Check you're authenticated (signed in with magic link)
3. Verify policies exist in Database → Tables → [table] → RLS Policies

### Magic Links Not Arriving

**Solutions**:
1. Check spam/junk folder
2. Wait 2-3 minutes (can be slow)
3. Verify email provider is enabled in Supabase
4. For production, configure custom SMTP in Authentication → Settings

### Realtime Not Working

**Symptoms**: Changes don't appear instantly across devices

**Solutions**:
1. Verify Realtime is enabled: Database → Replication
2. Check browser console for WebSocket errors
3. Ensure Supabase project isn't paused
4. Verify you're authenticated and part of the board

---

## Production Checklist

Before going live, verify:

- [ ] Supabase project created and schema applied
- [ ] Email authentication enabled and tested
- [ ] Realtime enabled for all tables
- [ ] Environment variables set in Vercel
- [ ] Test deployment works end-to-end
- [ ] Magic link emails arrive successfully
- [ ] Real-time sync works across devices
- [ ] Mobile responsive (test on phone)
- [ ] Security headers configured (already in vercel.json)
- [ ] Custom domain configured (optional, in Vercel dashboard)

---

## Next Steps

After deployment:

1. **Custom Domain**: Add your domain in Vercel → Settings → Domains
2. **Email Templates**: Customize magic link emails in Supabase → Authentication → Email Templates
3. **Analytics**: Enable Vercel Analytics in your project settings
4. **Monitoring**: Set up Supabase monitoring in dashboard
5. **Backups**: Configure automatic backups in Supabase (paid plans)

---

## Support

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Supabase Documentation**: [supabase.com/docs](https://supabase.com/docs)
- **Report Issues**: Create an issue in this repository

---

**Enjoy your CollabBoard deployment! 🚀**
