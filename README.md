# CollabBoard

Professional board meeting platform with comprehensive agenda customizations, robust voting options, and auto-generated presentations.

## Optional: Supabase Realtime Backend

You can enable cross-device live updates and secure multi-user hosting by connecting a Supabase project. This provides real-time synchronization of participants, agenda items, and votes across all devices, with proper authentication and Row-Level Security (RLS).

### 1) Create a Supabase project
1. Go to [https://supabase.com](https://supabase.com) and sign up or log in
2. Click **"New Project"**
3. Fill in your project details:
   - **Name**: e.g., "CollabBoard"
   - **Database Password**: Choose a strong password (save it securely)
   - **Region**: Select the region closest to your users
4. Click **"Create new project"** and wait for it to initialize (1-2 minutes)

### 2) Get your project credentials
1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (under "Project URL")
   - **anon public key** (under "Project API keys")

### 3) Configure email authentication
1. In your Supabase dashboard, go to **Authentication** → **Providers**
2. Find **Email** in the providers list
3. Enable the toggle for **"Enable Email provider"**
4. Configure email settings:
   - **Enable email confirmations**: Toggle ON (recommended for security)
   - **Secure email change**: Toggle ON
   - **Mailer autoconfirm**: Toggle OFF (users will receive confirmation emails)
5. Scroll down to **Email Templates** and customize if desired:
   - **Confirm signup**: Email sent when users sign up
   - **Magic Link**: Email sent for passwordless login
6. Click **"Save"**

### 4) Configure email templates (optional but recommended)
1. Go to **Authentication** → **Email Templates**
2. Edit the **Magic Link** template:
   ```html
   <h2>Magic Link for CollabBoard</h2>
   <p>Click the link below to sign in to your board meeting:</p>
   <p><a href="{{ .ConfirmationURL }}">Sign in to CollabBoard</a></p>
   <p>This link expires in 1 hour.</p>
   ```
3. Click **"Save"**

### 5) Apply the database schema
1. In the Supabase SQL Editor, go to **SQL Editor** (left sidebar)
2. Click **"New query"**
3. Copy the entire contents of `tools/supabase_schema.sql`
4. Paste it into the SQL editor
5. Click **"Run"** or press `Ctrl/Cmd + Enter`
6. Verify success: You should see "Success. No rows returned" message
7. Confirm tables were created by going to **Table Editor** - you should see:
   - `boards`
   - `participants`
   - `items`
   - `votes`

### 6) Enable Realtime for live updates
1. Go to **Database** → **Replication**
2. Find and enable Realtime for these tables:
   - ✅ `participants`
   - ✅ `items`
   - ✅ `votes`
3. Click **"Save"** for each table

### 7) Configure the app
In `index.html`, update the Supabase configuration (around line 21):

```html
<script>
  window.SUPABASE_URL = 'https://YOUR-PROJECT.supabase.co';
  window.SUPABASE_ANON_KEY = 'YOUR-ANON-KEY';
</script>
```

**Alternative**: Set these as environment variables if deploying to a hosting platform:
- Netlify: Site Settings → Environment Variables
- Vercel: Project Settings → Environment Variables
- GitHub Pages: Use GitHub Secrets and inject during build

### 8) Test the authentication flow
1. Open your CollabBoard app
2. Create a new board meeting
3. Share the link with another device or browser (incognito mode)
4. On the join page, you'll see the authentication section
5. Enter your email and click **"Send Magic Link"**
6. Check your email for the magic link
7. Click the link to authenticate
8. Return to the board and enter your name to join

### 9) How it works

**Authentication Flow:**
- Users authenticate via email magic links (passwordless)
- Each user gets a unique Supabase user ID
- Sessions persist across page refreshes

**Board Creator (Admin):**
- Creates the board and is automatically registered as admin
- Has full permissions: create/edit/delete items, manage settings
- Admin status is tied to the Supabase user who created the board

**Participants (Members):**
- Must authenticate with email before joining
- Can view all board content
- Can cast votes on agenda items
- Cannot create or modify agenda items

**Real-time Synchronization:**
- All participants see live updates when:
  - New participants join or go offline
  - Agenda items are added or updated
  - Votes are cast or changed
- Updates appear instantly across all connected devices

**Security (Row-Level Security):**
- Users can only see boards they're participants in
- Only board creators can modify board details
- Only admins can create/edit/delete agenda items
- Users can only vote once per item and can update their own votes
- All data access is validated server-side

### 10) Troubleshooting

**Magic links not arriving:**
- Check spam/junk folder
- Verify SMTP settings in Supabase (Authentication → Settings)
- For production, configure a custom SMTP provider (SendGrid, AWS SES, etc.)

**Authentication errors:**
- Verify your Project URL and anon key are correct
- Check browser console for detailed error messages
- Ensure email provider is enabled in Supabase dashboard

**RLS policy errors:**
- Run the schema SQL again to ensure all policies are created
- Check table permissions in Database → Tables → [table name] → RLS Policies

**Realtime not working:**
- Verify Realtime is enabled for all tables (Database → Replication)
- Check browser console for WebSocket connection errors
- Ensure your Supabase project isn't paused (free tier limitation)

### 11) Fallback Mode

If Supabase is not configured or unavailable, CollabBoard automatically falls back to:
- Local browser storage for data persistence
- URL-based sharing (data embedded in the link)
- BroadcastChannel API for same-device cross-tab updates
- No server-side storage or real-time cross-device sync

This ensures the app works even without a backend!


## Features

- **Create & Manage Board Meetings**: Organize meetings with customizable titles and participant names.
- **Advanced Voting Tools**: Includes a range of voting mechanisms for secure and transparent decision-making.
- **Auto-Generated Presentations**: Built-in presentation creator that generates business-ready decks from meeting agendas and votes.
- **User-Friendly Interface**: Simple form-based setup to quickly launch and manage board activities.
- **Cross-Browser Collaboration**: Share meeting links that work across any browser without requiring a backend server.
- **No Database Required**: Uses URL-based data sharing - all meeting data is embedded in the shareable link.

## How It Works

CollabBoard uses a clever URL-based data sharing system that doesn't require a backend server or database:

1. When you create a meeting, all the meeting data is encoded and embedded in the URL
2. Share the generated link with participants via email, Teams, Slack, or QR code
3. Anyone opening the link on any browser can immediately join and contribute
4. All votes and changes update the URL in real-time for seamless collaboration

This approach means:
- ✅ No server setup needed
- ✅ Works on any browser
- ✅ Instant sharing without authentication
- ✅ All data travels with the link
- ✅ Perfect for quick board meetings and decision-making

## Usage

1. **Create a Board Meeting**: Enter your name and meeting title in the provided fields and click "Create Board Meeting."
2. **Share the Link**: Click the "📤 Share" button to get a shareable link with embedded meeting data
3. **Participants Join**: Others can click the link from any browser to join and participate
4. **Manage Agendas and Voting**: Use on-screen options to set agendas, cast votes, and view auto-generated presentations.

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript
- **Data Sharing**: URL Hash-based encoding (no backend required)
- **Charts**: Chart.js for analytics visualization
- **QR Codes**: QRCode.js for mobile sharing

## Contributing

Contributions, feedback, and issue reports are welcome! Please submit pull requests or open an issue for discussion.

## License

Copyright