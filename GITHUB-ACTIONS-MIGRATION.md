# Quick Migration to GitHub Actions - Step by Step

This will fix your 403 CORS errors permanently! ✅

## 🎯 What This Does

Instead of fetching iCal feeds from the browser (CORS issues), GitHub Actions:
1. Fetches feeds every 6 hours automatically
2. Saves them as `feed1.ics`, `feed2.ics`, etc. in your repo
3. Your site reads the local files (no CORS!)

## ⏱️ Time: 10 minutes

---

## Step 1: Update Your Config (2 min)

Edit `js/config.js` and change the `teams` array:

**From this:**
```javascript
teams: [
    { name: "Dad's Team", url: "https://web.teamo.chat/ical/...", icon: "D" },
    { name: "Son 1's Team", url: "https://web.teamo.chat/ical/...", icon: "S1" },
    //...
]
```

**To this:**
```javascript
teams: [
    { name: "Dad's Team", file: "feed1.ics", icon: "D" },
    { name: "Son 1's Team", file: "feed2.ics", icon: "S1" },
    { name: "Son 2's Team", file: "feed3.ics", icon: "S2" },
    { name: "Son 3's Team", file: "feed4.ics", icon: "S3" }
]
```

**Change:** `url:` → `file:` and use `feed1.ics`, `feed2.ics`, etc.

---

## Step 2: Update app.js to use `file` (1 min)

Edit `js/app.js`, find line ~234 (in the `loadFixtures` function):

**From this:**
```javascript
const response = await fetch(proxyUrl);
```

**To this:**
```javascript
const response = await fetch(team.file);  // Uses team.file instead of team.url
```

And remove the proxyUrl line above it (line ~233).

**Before:**
```javascript
const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(team.url)}`;
const response = await fetch(proxyUrl);
```

**After:**
```javascript
const response = await fetch(team.file);
```

---

## Step 3: Upload GitHub Actions Workflow (2 min)

Upload this file to your repo:
- File: `.github/workflows/fetch-fixtures.yml` (you already have it!)
- Location: Must be in `.github/workflows/` folder

**Important:** The folder MUST be called `.github` (with the dot) and it MUST be at the root of your repo.

```
your-repo/
├── .github/
│   └── workflows/
│       └── fetch-fixtures.yml  ← Upload this
├── css/
├── js/
└── index.html
```

---

## Step 4: Add GitHub Secrets (3 min)

1. Go to your GitHub repo
2. Click **Settings** (top right)
3. Click **Secrets and variables** → **Actions** (left sidebar)
4. Click **New repository secret** (green button)

Add **4 secrets** (one for each team):

| Name | Value |
|------|-------|
| `ICAL_FEED_1` | Your first Teamo iCal URL |
| `ICAL_FEED_2` | Your second Teamo iCal URL |
| `ICAL_FEED_3` | Your third Teamo iCal URL |
| `ICAL_FEED_4` | Your fourth Teamo iCal URL |

**For each one:**
- Click "New repository secret"
- Name: `ICAL_FEED_1` (exactly as shown)
- Value: Paste your full iCal URL (e.g., `https://web.teamo.chat/ical/...`)
- Click "Add secret"

**Important:** 
- Name must be EXACTLY: `ICAL_FEED_1`, `ICAL_FEED_2`, etc. (all caps, underscore)
- Value should start with `https://web.teamo.chat/`

---

## Step 5: Run the Workflow Manually (2 min)

1. Go to **Actions** tab (top of repo)
2. Click **Fetch Hockey Fixtures** (left sidebar)
3. Click **Run workflow** (right side, blue button)
4. Click green **Run workflow** button
5. Wait 30-60 seconds
6. Refresh the page

**You should see:**
- ✅ Green checkmark = success!
- ❌ Red X = something failed (click it to see logs)

**If successful, check your repo:**
- You should now see: `feed1.ics`, `feed2.ics`, `feed3.ics`, `feed4.ics`
- You should see: `last_updated.txt`

---

## Step 6: Test Your Site (1 min)

1. Visit your GitHub Pages site
2. It should load without 403 errors!
3. You should see fixtures!

**If it works:** 🎉 Done! It will auto-update every 6 hours.

**If it doesn't work:** Check the troubleshooting section below.

---

## ✅ Success Checklist

- [ ] Updated `config.js` to use `file:` instead of `url:`
- [ ] Updated `app.js` to `fetch(team.file)`
- [ ] Uploaded `.github/workflows/fetch-fixtures.yml`
- [ ] Added 4 GitHub Secrets (ICAL_FEED_1, etc.)
- [ ] Ran workflow manually
- [ ] Saw green checkmark
- [ ] See `.ics` files in repo
- [ ] Site loads without errors!

---

## 🐛 Troubleshooting

### "No such file or directory: feed1.ics"

**Cause:** Workflow hasn't run yet or failed

**Fix:**
1. Go to Actions tab
2. Click the failed workflow
3. Check the logs for errors
4. Common issues:
   - Secret names wrong (must be `ICAL_FEED_1` exactly)
   - iCal URL is incorrect
   - Teamo URL requires authentication

### Workflow has red X

**Check the logs:**
1. Click the red X workflow
2. Click **fetch-fixtures** job
3. Read the error message

**Common errors:**
- "curl: (22) The requested URL returned error: 403"
  - Your iCal URL might be wrong or require login
  - Test the URL in a browser first
  
- "Permission denied"
  - GitHub Actions needs write permission
  - Go to Settings → Actions → General → Workflow permissions
  - Select "Read and write permissions"
  - Click Save

### Site still shows 403 error

**Check:**
1. Did you update `config.js` to use `file:` instead of `url:`?
2. Did you update `app.js` to remove the proxy line?
3. Did you upload the changes to GitHub?
4. Hard refresh (Ctrl+F5) to clear cache

### Green checkmark but no .ics files

**Possible causes:**
1. Check workflow logs - did it actually fetch anything?
2. Files might be there but you need to refresh
3. Check the "Commit and push" step in logs

---

## 🔄 How Auto-Update Works

Once set up, GitHub Actions will:
1. Run every 6 hours automatically
2. Fetch fresh iCal data
3. Update the `.ics` files
4. Commit to your repo
5. GitHub Pages automatically deploys
6. Your site shows fresh data!

**No action needed from you!** ✨

---

## 📝 Summary

**What changed:**
- ❌ Before: Fetch from Teamo URLs → CORS proxy → 403 errors
- ✅ After: GitHub Actions fetches → Local files → No errors!

**Benefits:**
- ✅ No more CORS issues
- ✅ Faster loading (cached files)
- ✅ Free forever
- ✅ Auto-updates every 6 hours
- ✅ More reliable

**Maintenance:**
- None! Set it and forget it.

---

## 🎉 You're Done!

Your site now:
- ✅ Loads fixtures without CORS errors
- ✅ Auto-updates every 6 hours
- ✅ Works perfectly on GitHub Pages
- ✅ Has all your recent improvements (prev/next, compact layout, etc.)

Welcome to the reliable side! 🏑
