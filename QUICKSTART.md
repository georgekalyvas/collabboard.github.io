# CollabBoard Quick Start ⚡

**Goal**: Get your CollabBoard app deployed with Supabase backend in under 30 minutes.

---

## 🎯 Before You Start

You need:
- [ ] A web browser
- [ ] GitHub account (for Supabase signup - recommended)
- [ ] Vercel account (free - sign up at vercel.com)
- [ ] Email address for testing

---

## ⏱️ 10-Minute Supabase Setup

### 1. Create Supabase Project (2 min)
```
→ Go to: https://supabase.com
→ Sign in with GitHub
→ Click "New Project"
→ Fill in:
   Name: CollabBoard
   Password: [generate & save it!]
   Region: [closest to you]
→ Click "Create new project"
→ Wait for initialization (~2 min)
```

### 2. Apply Database Schema (1 min)
```
→ Click "SQL Editor" (left sidebar)
→ Click "New query"
→ Open: tools/supabase_schema.sql
→ Copy ALL contents
→ Paste into Supabase SQL Editor
→ Click "Run" (or Ctrl+Enter)
→ See "Success. No rows returned" ✅
```

### 3. Verify Setup (30 sec)
```
→ Click "Table Editor" (left sidebar)
→ See 4 tables:
   ✅ boards
   ✅ participants
   ✅ items
   ✅ votes
```

### 4. Enable Email Auth (1 min)
```
→ Click "Authentication" → "Providers"
→ Find "Email" in list
→ Toggle ON
→ Ensure "Confirm email" is ON
→ Click "Save"
```

### 5. Enable Realtime (1 min)
```
→ Click "Database" → "Replication"
→ Enable these tables:
   ✅ participants
   ✅ items
   ✅ votes
→ Click "Save"
```

### 6. Get API Credentials (1 min)
```
→ Click "Settings" → "API"
→ Copy "Project URL": _______________________
→ Copy "anon public" key: ___________________
→ Save both somewhere safe! 🔐
```

---

## ⚡ 5-Minute Vercel Deployment

### 7. Install Vercel CLI (1 min)
```bash
npm install -g vercel
```

### 8. Deploy (2 min)
```bash
# From your project directory
vercel

# Answer prompts:
# Set up and deploy? → Yes
# Link to existing project? → No
# Project name? → collabboard (or your choice)
# Directory? → ./ (press Enter)
# Override settings? → No

# Wait for deployment...
# Copy the deployment URL! 🎉
```

### 9. Add Environment Variables (2 min)
```
→ Go to: https://vercel.com
→ Go to your project
→ Click "Settings" → "Environment Variables"
→ Add variable 1:
   Name: SUPABASE_URL
   Value: [paste your Project URL]
   Environments: ✅ Production, Preview, Development
   Click "Save"

→ Add variable 2:
   Name: SUPABASE_ANON_KEY
   Value: [paste your anon key]
   Environments: ✅ Production, Preview, Development
   Click "Save"
```

### 10. Redeploy (1 min)
```bash
# From your project directory
vercel --prod

# Or in Vercel dashboard:
# Click "Deployments" → "..." → "Redeploy"
```

---

## ✅ Test Your App (5 min)

### 11. Test Board Creation
```
→ Open your Vercel deployment URL
→ Enter your name: [your name]
→ Enter meeting title: "Test Board"
→ Click "Create Board Meeting"
→ You should see the board! ✅
```

### 12. Test Authentication & Sharing
```
→ Click "📤 Share" button
→ Copy the share link
→ Open link in incognito/private window
→ See "Sign in with email" section
→ Enter your email
→ Click "Send Magic Link"
→ Check your email (may take 1-2 min)
→ Click the magic link
→ Return to board
→ Enter your name and join
→ You're in! ✅
```

### 13. Test Real-time Sync
```
→ Keep both windows open (admin & participant)
→ In admin window: Add an agenda item
→ Watch it appear in participant window ✨
→ In participant window: Cast a vote
→ See vote update in admin window ⚡
→ Real-time works! ✅
```

---

## 🎉 You're Done!

Your CollabBoard is now live with:
- ✅ Real-time collaboration
- ✅ Email authentication
- ✅ Persistent storage
- ✅ Secure backend (RLS)
- ✅ Production-ready deployment

---

## 📚 What's Next?

**Customize Your App:**
- Add custom domain in Vercel Settings → Domains
- Customize email templates in Supabase Authentication
- Invite team members to test

**Learn More:**
- Full setup guide: `SUPABASE_SETUP.md`
- Deployment details: `DEPLOYMENT.md`
- Troubleshooting: See guides above

**Production Checklist:**
- [ ] Custom SMTP configured (for reliable emails)
- [ ] Custom domain added
- [ ] Tested on mobile devices
- [ ] Shared with beta users
- [ ] Set up monitoring/analytics

---

## 🆘 Common Issues

**"Invalid API key"**
→ Make sure you copied the **anon** key, not service_role

**Magic links not arriving**
→ Check spam folder
→ Wait 2-3 minutes
→ Configure custom SMTP for production

**Changes not syncing**
→ Verify Realtime enabled in Database → Replication
→ Check browser console for errors

**"Permission denied"**
→ Re-run the schema SQL completely
→ Make sure you signed in with magic link

---

## 🎯 Time Breakdown

- Supabase setup: ~10 minutes
- Vercel deployment: ~5 minutes
- Testing: ~5 minutes
- **Total**: ~20 minutes ⚡

---

**Questions?** Check `SUPABASE_SETUP.md` for detailed instructions!
