# Hockey Fixtures Dashboard

A simple, clean web app to display upcoming weekend hockey fixtures from Teamo iCal feeds.

## Features

- ✅ Fetches fixtures from multiple team iCal feeds
- 📅 Automatically identifies "next weekend" (Saturday & Sunday)
- 🎨 Clean, responsive design
- 🔄 One-click refresh
- 📧 Email summary capability (optional)
- 📱 Mobile-friendly
- 🚀 Hosted on GitHub Pages (no backend needed)

## Quick Start

### 1. Get Your iCal Feed URLs

For each team in Teamo:
1. Open the Teamo app
2. Navigate to the team's fixtures/calendar
3. Look for "Subscribe" or "Export Calendar" option
4. Copy the iCal/ICS feed URL (usually ends in `.ics`)

### 2. Configure the App

Edit `hockey-fixtures.html` and update the `TEAMS` array (around line 225):

```javascript
const TEAMS = [
    { name: "Dad's Team", url: "YOUR_ICAL_URL_1", icon: "D" },
    { name: "Son 1's Team", url: "YOUR_ICAL_URL_2", icon: "S1" },
    { name: "Son 2's Team", url: "YOUR_ICAL_URL_3", icon: "S2" },
    { name: "Son 3's Team", url: "YOUR_ICAL_URL_4", icon: "S3" }
];
```

Replace:
- `name`: Display name for the team
- `url`: The iCal feed URL from Teamo
- `icon`: Short text to display in the team icon (1-2 characters)

### 3. Deploy to GitHub Pages

1. Create a new GitHub repository
2. Upload `hockey-fixtures.html`
3. Go to Settings → Pages
4. Select your branch (main/master)
5. Your site will be live at: `https://YOUR_USERNAME.github.io/REPO_NAME/hockey-fixtures.html`

## CORS Configuration

### The Challenge
Browsers block cross-origin requests for security. Since Teamo's iCal feeds likely don't allow direct browser access, we need a workaround.

### Solutions

#### Option 1: CORS Proxy (Quick Setup)
The code includes `corsproxy.io` by default. This works immediately but relies on a third-party service.

```javascript
const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(team.url)}`;
```

**Pros:** Works immediately  
**Cons:** Third-party dependency, potential rate limits

#### Option 2: GitHub Actions (Recommended for Production)
Create a scheduled workflow to fetch feeds and commit them to your repo.

1. Create `.github/workflows/fetch-fixtures.yml`:

```yaml
name: Fetch Hockey Fixtures

on:
  schedule:
    - cron: '0 */6 * * *'  # Every 6 hours
  workflow_dispatch:  # Manual trigger

jobs:
  fetch:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Fetch iCal feeds
        run: |
          curl -o feed1.ics "YOUR_ICAL_URL_1"
          curl -o feed2.ics "YOUR_ICAL_URL_2"
          curl -o feed3.ics "YOUR_ICAL_URL_3"
          curl -o feed4.ics "YOUR_ICAL_URL_4"
      
      - name: Commit feeds
        run: |
          git config user.name "GitHub Actions"
          git config user.email "actions@github.com"
          git add *.ics
          git diff --quiet && git diff --staged --quiet || git commit -m "Update fixture feeds"
          git push
```

2. Update the JavaScript to use local files:

```javascript
const TEAMS = [
    { name: "Dad's Team", url: "./feed1.ics", icon: "D" },
    // ...
];
```

3. Change the fetch line (around line 397):

```javascript
const response = await fetch(team.url);  // Direct fetch of local file
```

**Pros:** Reliable, no third-party dependency, cached data  
**Cons:** Slight setup complexity

#### Option 3: Cloudflare Worker (Advanced)
Create a free Cloudflare Worker to proxy requests with CORS headers.

## Email Setup (Optional)

To enable email summaries:

### 1. Sign up for EmailJS
1. Go to [emailjs.com](https://www.emailjs.com)
2. Create a free account
3. Set up an email service (Gmail, Outlook, etc.)
4. Create an email template

### 2. Configure EmailJS

Update the configuration in `hockey-fixtures.html` (around line 232):

```javascript
const EMAILJS_CONFIG = {
    serviceId: 'YOUR_SERVICE_ID',      // From EmailJS dashboard
    templateId: 'YOUR_TEMPLATE_ID',    // From EmailJS dashboard
    userId: 'YOUR_USER_ID',            // From EmailJS dashboard
    recipientEmail: 'your@email.com'   // Your email address
};
```

### 3. Add EmailJS SDK

Add this line in the `<head>` section:

```html
<script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
```

### 4. Uncomment Email Code

In the `sendEmail()` function (around line 486), uncomment the EmailJS implementation.

### 5. Create Email Template

In EmailJS dashboard, create a template with these variables:
- `{{to_email}}` - recipient
- `{{message}}` - fixture summary
- `{{link}}` - link to dashboard

## Customization

### Change Weekend Definition

Edit the `getNextWeekend()` function to include Friday or extend to Monday:

```javascript
// Include Friday evening
const friday = new Date(saturday);
friday.setDate(saturday.getDate() - 1);
friday.setHours(18, 0, 0, 0);  // From 6 PM Friday

return { start: friday, end: mondayMorning };
```

### Styling

All CSS is in the `<style>` section. Key variables:
- Colors: `#1e3c72` (dark blue), `#2a5298` (medium blue)
- Update `.team-icon` background for team colors
- Modify `body` gradient for different theme

### Date Parsing

If Teamo uses non-standard date formats, update `parseICSDate()` function.

## Troubleshooting

### No fixtures showing
1. Check browser console (F12) for errors
2. Verify iCal URLs are correct
3. Test URLs directly in browser
4. Check CORS proxy is working

### "Error loading fixtures"
- iCal feed URL may be invalid
- CORS proxy may be down (try Option 2)
- Feed may require authentication

### Dates seem wrong
- Check timezone handling in `parseICSDate()`
- Teamo might use UTC times

### Mobile layout issues
- The design is responsive, but test on actual devices
- Adjust `@media` queries if needed

## Development

### Local Testing

Simply open `hockey-fixtures.html` in a browser. However, CORS restrictions mean you'll need:
- A local server: `python -m http.server 8000`
- Or use the CORS proxy

### Browser Support

Works on all modern browsers (Chrome, Firefox, Safari, Edge).

## Technical Details

### How It Works

1. **Weekend Calculation**: Identifies next Sat/Sun based on current day
2. **Fetch Feeds**: Downloads each team's iCal feed (via proxy if needed)
3. **Parse iCal**: Extracts VEVENT entries with dates, locations, summaries
4. **Filter**: Keeps only events within weekend date range
5. **Display**: Renders in team-grouped sections with clean formatting

### iCal Format

The parser handles standard iCal (RFC 5545) format:
- `DTSTART`: Event date/time
- `SUMMARY`: Event title (contains teams)
- `LOCATION`: Venue information
- `DESCRIPTION`: Additional details

### Data Flow

```
Teamo iCal Feed → CORS Proxy → Parse ICS → Filter by Weekend → Display
```

## Future Enhancements

Ideas for extending the app:
- Add "This Weekend" vs "Next Weekend" toggle
- Include past results
- Show league standings
- Add calendar export
- Progressive Web App (PWA) for offline access
- Push notifications for fixture changes

## License

Free to use and modify for personal use.

## Credits

Built with vanilla JavaScript for simplicity and GitHub Pages compatibility.
