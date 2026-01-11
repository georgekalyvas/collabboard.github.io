# CollabBoard

Professional board meeting platform with comprehensive agenda customizations, robust voting options, and auto-generated presentations.


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
