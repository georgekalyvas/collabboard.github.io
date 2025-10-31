# CollabBoard

Professional board meeting platform with comprehensive agenda customizations, robust voting options, and auto-generated presentations.

## Optional: Supabase Realtime Backend

You can enable cross-device live updates and secure multi-user hosting by connecting a Supabase project. This preserves admin security via Row-Level Security (RLS) and gives live attendees/items/votes.

### 1) Create a Supabase project
- Go to https://supabase.com and create a project
- Get your Project URL and anon key from Project Settings → API

### 2) Apply the schema
- In the Supabase SQL Editor, paste and run `tools/supabase_schema.sql`
- This creates tables: boards, participants, items, votes and RLS policies

### 3) Configure the app
In `index.html`, set your values (or inject at runtime):

```html
<script>
  window.SUPABASE_URL = 'https://YOUR-PROJECT.supabase.co';
  window.SUPABASE_ANON_KEY = 'YOUR-ANON-KEY';
</script>
```

### 4) How it works
- The app initializes the Supabase client and anonymous auth
- On create/join, it writes participants to the database
- It subscribes to participant changes so new attendees appear live across devices
- If Supabase is not configured, it gracefully falls back to local-only mode

### 5) Next steps
- Wire agenda items and votes to Supabase (currently local), using the same pattern
- Optionally enable real Auth (magic links / OAuth) instead of anonymous auth
- Add rate-limiting or CAPTCHA on join flows if you expose publicly


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