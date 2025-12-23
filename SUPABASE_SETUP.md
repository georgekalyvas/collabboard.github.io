# Supabase Setup Guide for CollabBoard

Follow these steps to create and configure your Supabase backend. This should take about 10-15 minutes.

## 📋 Quick Checklist

- [ ] Create Supabase account and project
- [ ] Apply database schema
- [ ] Enable email authentication
- [ ] Enable Realtime on tables
- [ ] Get API credentials
- [ ] Test authentication flow
- [ ] Configure Vercel environment variables

---

## Step 1: Create Supabase Account & Project

### 1.1 Sign Up
1. Open your browser and go to: **https://supabase.com**
2. Click **"Start your project"** or **"Sign In"**
3. Sign up with:
   - GitHub (recommended - easiest)
   - Or email/password

### 1.2 Create New Project
1. Once logged in, click **"New Project"** (green button)
2. If this is your first time, you may need to create an organization first:
   - Click **"New organization"**
   - Name it (e.g., "My Projects" or your company name)
   - Choose the Free plan
   - Click **"Create organization"**

3. Now create the project:
   - **Name**: `CollabBoard` (or your choice)
   - **Database Password**:
     - Click the **"Generate a password"** button, OR
     - Create a strong password (save it in your password manager!)
     - ⚠️ **IMPORTANT**: Copy and save this password somewhere safe!
   - **Region**: Select the region closest to your users
     - US East (North Virginia) - for US/Americas
     - Europe (Frankfurt) - for Europe
     - Southeast Asia (Singapore) - for Asia Pacific
   - **Pricing Plan**: Free (perfect for getting started)

4. Click **"Create new project"**
5. Wait 1-2 minutes for the project to initialize (you'll see a loading screen)

---

## Step 2: Apply Database Schema

### 2.1 Open SQL Editor
1. In your Supabase dashboard (left sidebar), click **"SQL Editor"**
2. Click **"New query"** button (top right)

### 2.2 Run the Schema
1. Open the file `tools/supabase_schema.sql` from this repository
2. **Copy the entire contents** (all 191 lines)
3. **Paste** into the SQL Editor in Supabase
4. Click **"Run"** (or press `Ctrl+Enter` / `Cmd+Enter`)
5. You should see: **"Success. No rows returned"** (this is good!)

### 2.3 Verify Tables Created
1. In the left sidebar, click **"Table Editor"**
2. You should see 4 new tables:
   - ✅ `boards` - Stores board meetings
   - ✅ `participants` - Stores board participants
   - ✅ `items` - Stores agenda items
   - ✅ `votes` - Stores votes on agenda items

3. Click on each table to verify it exists (you'll see empty tables with column names)

**If you don't see the tables:**
- Go back to SQL Editor
- Check for any error messages in red
- Make sure you copied the entire schema file
- Try running it again

---

## Step 3: Enable Email Authentication

### 3.1 Configure Email Provider
1. In the left sidebar, go to **"Authentication"** → **"Providers"**
2. Find **"Email"** in the list of providers
3. Click to expand it
4. Toggle **"Enable Email provider"** to ON (should turn green)
5. Configure these settings:
   - ✅ **Enable Email provider** - ON
   - ✅ **Confirm email** - ON (recommended for security)
   - ✅ **Secure email change** - ON
   - ❌ **Mailer autoconfirm** - OFF (users will receive confirmation emails)

6. Scroll down and click **"Save"**

### 3.2 Customize Email Template (Optional but Recommended)
1. Still in **Authentication**, click **"Email Templates"** (top tabs)
2. Select **"Magic Link"** from the dropdown
3. You can customize the email, or keep the default
4. Make sure it includes the `{{ .ConfirmationURL }}` variable
5. Click **"Save"** if you made changes

### 3.3 Test Email Settings
For development, Supabase uses their default email service (emails may go to spam).

For production (recommended):
1. Go to **"Authentication"** → **"Settings"**
2. Scroll to **"SMTP Settings"**
3. Configure your own email service (SendGrid, AWS SES, Mailgun, etc.)
   - This ensures better email deliverability
   - Free tiers available on most providers

---

## Step 4: Enable Realtime

### 4.1 Enable Replication
1. In the left sidebar, go to **"Database"** → **"Replication"**
2. You'll see a list of all your tables
3. Find each of these tables and enable Realtime:

   **For `participants` table:**
   - Click the toggle/checkbox next to `participants`
   - It should turn green/checked

   **For `items` table:**
   - Click the toggle/checkbox next to `items`
   - It should turn green/checked

   **For `votes` table:**
   - Click the toggle/checkbox next to `votes`
   - It should turn green/checked

4. Click **"Save"** or **"Apply changes"** if there's a button

**Note**: The `boards` table doesn't need Realtime enabled (it's only created once).

### 4.2 Verify Realtime is Enabled
Look for a green indicator or checkmark next to:
- ✅ `participants`
- ✅ `items`
- ✅ `votes`

---

## Step 5: Get Your API Credentials

### 5.1 Find Your Credentials
1. In the left sidebar, click **"Settings"** (gear icon at bottom)
2. Click **"API"** in the settings menu
3. You'll see two important values:

### 5.2 Copy Project URL
- Look for **"Project URL"**
- It will look like: `https://abcdefghijklmnop.supabase.co`
- Click the **copy icon** next to it
- Save it somewhere (you'll need it soon)

### 5.3 Copy Anon Key
- Look for **"Project API keys"** section
- Find **"anon public"** key (NOT the service_role key!)
- It's a long string starting with `eyJ...`
- Click the **copy icon** or **"Reveal"** then copy
- Save it somewhere (you'll need it soon)

⚠️ **IMPORTANT**:
- ✅ Use the **anon / public** key (safe for frontend)
- ❌ **NEVER** use the **service_role** key in your frontend code!

---

## Step 6: Test Your Setup (Optional but Recommended)

### 6.1 Test Database Connection
1. Go back to **"SQL Editor"**
2. Create a new query
3. Run this test query:

```sql
-- Test query to verify setup
SELECT
  (SELECT COUNT(*) FROM boards) as boards_count,
  (SELECT COUNT(*) FROM participants) as participants_count,
  (SELECT COUNT(*) FROM items) as items_count,
  (SELECT COUNT(*) FROM votes) as votes_count;
```

4. You should see a result with all counts as `0` (empty tables)
5. If you get an error, go back and check your schema was applied

### 6.2 Test RLS Policies
1. In SQL Editor, run this query:

```sql
-- Check RLS is enabled
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE tablename IN ('boards', 'participants', 'items', 'votes');
```

2. You should see `rowsecurity = true` for all tables
3. This means Row-Level Security is protecting your data ✅

---

## Step 7: Save Your Credentials

Create a secure note with this information:

```
CollabBoard Supabase Credentials
================================

Project Name: CollabBoard
Database Password: [the password you created]

Project URL: https://your-project.supabase.co
Anon Key: eyJhbGc...your-key-here...

Created: [today's date]
Region: [your selected region]
```

Save this in:
- Your password manager (recommended)
- A secure note-taking app
- Or encrypted file

❌ **DO NOT**:
- Commit this to Git
- Share publicly
- Email it unencrypted

---

## Step 8: Configure Your App

Now you need to add these credentials to your app. You have two options:

### Option A: Add to Vercel (Recommended for Production)

If you're deploying to Vercel:

1. Go to [vercel.com](https://vercel.com) and sign in
2. Go to your project (or deploy it first with `vercel`)
3. Click **"Settings"** → **"Environment Variables"**
4. Add these two variables:

   **Variable 1:**
   - Name: `SUPABASE_URL`
   - Value: [paste your Project URL]
   - Environments: ✅ Production, ✅ Preview, ✅ Development

   **Variable 2:**
   - Name: `SUPABASE_ANON_KEY`
   - Value: [paste your Anon Key]
   - Environments: ✅ Production, ✅ Preview, ✅ Development

5. Click **"Save"** for each
6. **Redeploy** your project to apply the changes

### Option B: Test Locally First

If you want to test locally before deploying:

1. Create a `.env.local` file in your project root:

```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
```

2. Export the variables:

```bash
export SUPABASE_URL="https://your-project.supabase.co"
export SUPABASE_ANON_KEY="your-anon-key-here"
```

3. Build and test:

```bash
npm run build
npm run serve
```

4. Open http://localhost:3000 and test creating a board

---

## Step 9: Test the Full Flow

### 9.1 Test Board Creation
1. Open your deployed app (or local version)
2. Enter your name and create a board
3. You should see the board created

### 9.2 Test Authentication
1. Share the board link (or copy it)
2. Open in an incognito/private browser window
3. You should see a "Sign in with email" section
4. Enter your email
5. Click "Send Magic Link"
6. Check your email (may take 1-2 minutes)
7. Click the magic link in the email
8. You should be redirected back to the board
9. Enter your name and join

### 9.3 Test Real-time Sync
1. Keep both windows open (original and incognito)
2. In the admin window, add an agenda item
3. Watch it appear instantly in the other window ✨
4. Cast a vote in the participant window
5. See it update in the admin window

If all this works: **Congratulations! 🎉 Your Supabase backend is fully configured!**

---

## Troubleshooting

### Problem: "Invalid API key"
- **Solution**: Double-check you copied the **anon** key, not service_role
- Verify there are no extra spaces when pasting

### Problem: "Project not found"
- **Solution**: Make sure the URL includes `https://`
- Format should be: `https://xxxxx.supabase.co` (no trailing slash)

### Problem: "Row-level security policy violation"
- **Solution**: Re-run the entire schema SQL
- Make sure you're signed in with the magic link

### Problem: Magic links not arriving
- **Solution**: Check spam/junk folder
- Wait 2-3 minutes
- For production, configure custom SMTP

### Problem: Realtime not working
- **Solution**: Verify Realtime is enabled in Database → Replication
- Check browser console for WebSocket errors
- Ensure project isn't paused (free tier sleeps after inactivity)

---

## Next Steps

After completing this setup:

1. ✅ Your Supabase backend is ready
2. ✅ Configure Vercel environment variables
3. ✅ Deploy to production
4. ✅ Share with your team!

For deployment instructions, see `DEPLOYMENT.md`.

---

## Support Resources

- **Supabase Documentation**: https://supabase.com/docs
- **Supabase Community**: https://github.com/supabase/supabase/discussions
- **CollabBoard Issues**: [Your repository issues page]

---

**Need help?** Create an issue in this repository with:
- Step number where you got stuck
- Error message (if any)
- Screenshots (helpful but remove sensitive data)
