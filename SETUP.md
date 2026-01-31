# Quick Setup Guide

Follow these steps to get your hockey fixtures dashboard up and running.

## Step 1: Get Your iCal URLs

1. Open the Teamo app for each team
2. Navigate to Fixtures/Calendar
3. Look for "Subscribe", "Export", or "Share Calendar"
4. Copy the iCal/ICS URL (usually looks like: `https://teamoapp.com/calendar/.../.ics`)

Repeat for all four teams.

## Step 2: Choose Your Approach

### Option A: Quick Setup (CORS Proxy) - 5 minutes

**Best for:** Getting started quickly

1. Use `hockey-fixtures.html`
2. Edit the `TEAMS` array (line ~225):
   ```javascript
   const TEAMS = [
       { name: "Your Team Name", url: "PASTE_ICAL_URL_HERE", icon: "D" },
       // ... repeat for all teams
   ];
   ```
3. Upload to GitHub Pages
4. Done!

**Note:** Relies on third-party CORS proxy (corsproxy.io)

### Option B: Production Setup (GitHub Actions) - 15 minutes

**Best for:** Reliability and no third-party dependencies

1. Use `hockey-fixtures-local.html` (rename to `index.html`)
2. Edit team names and icons only (line ~190):
   ```javascript
   const TEAMS = [
       { name: "Your Team Name", file: "feed1.ics", icon: "D" },
       // ... keep file names as feed1.ics, feed2.ics, etc.
   ];
   ```
3. Set up GitHub Actions workflow:
   - Copy `.github/workflows/fetch-fixtures.yml` to your repo
   - Go to Settings → Secrets and variables → Actions
   - Add secrets:
     - `ICAL_FEED_1` = Your first iCal URL
     - `ICAL_FEED_2` = Your second iCal URL
     - `ICAL_FEED_3` = Your third iCal URL
     - `ICAL_FEED_4` = Your fourth iCal URL
4. Manually trigger the workflow once (Actions tab → Fetch Hockey Fixtures → Run workflow)
5. Enable GitHub Pages (Settings → Pages → Deploy from branch)
6. Your site is live!

**Benefits:** 
- Automatic updates every 6 hours
- No external dependencies
- Cached feeds work offline

## Step 3: Test

Visit your GitHub Pages URL:
`https://YOUR_USERNAME.github.io/REPO_NAME/`

You should see fixtures for the upcoming weekend!

## Step 4: Share

Send the URL to your phone or bookmark it. The page works great on mobile!

## Troubleshooting

**No fixtures showing up?**
- Check browser console (F12) for errors
- Verify your iCal URLs work (paste in browser)
- Make sure you edited the correct lines in the code

**GitHub Actions not working?**
- Check the Actions tab for error messages
- Verify secrets are correctly named (all caps, underscores)
- Ensure your iCal URLs don't require authentication

**Need help?**
Check the full README.md for detailed troubleshooting.

## Next Steps

Once working, you can:
- Customize the colors/styling
- Add email notifications
- Set up automatic emails each Friday
- Include Friday evening games
- Add team logos

Enjoy your streamlined hockey schedule! 🏒
