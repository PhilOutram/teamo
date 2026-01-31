# Hockey Fixtures Dashboard - Split File Structure

## 📁 File Structure

```
hockey-fixtures/
├── index-split.html          # Main HTML file (minimal structure)
├── css/
│   └── styles.css           # All styling
└── js/
    ├── config.js            # ⭐ EDIT THIS - Team URLs and settings
    └── app.js               # Application logic (rarely needs editing)
```

## 🎯 Quick Start

### 1. Edit Your Configuration
Open `js/config.js` and update:

```javascript
teams: [
    { 
        name: "Dad's Team", 
        url: "https://web.teamo.chat/ical/...", // Your iCal URL
        icon: "D" 
    },
    // ... add more teams
]
```

### 2. Upload to GitHub
Upload these files to your GitHub repository:
- `index-split.html` → Rename to `index.html`
- `css/styles.css`
- `js/config.js`
- `js/app.js`

### 3. Done!
Visit your GitHub Pages URL and it should work!

## ✏️ Making Changes

### To Add/Remove Teams
**Edit:** `js/config.js`
- Add/remove team objects in the `teams` array
- Each team needs: `name`, `url`, `icon`

### To Change Styling
**Edit:** `css/styles.css`
- Change colors, fonts, spacing
- All styles are in one file

### To Modify Functionality
**Edit:** `js/app.js`
- Change how fixtures are displayed
- Modify date filtering logic
- Update parsing functions

### To Change HTML Structure
**Edit:** `index.html`
- Modify layout/structure
- Add new sections

## 🔧 Advantages of Split Files

### For Editing with Claude:
✅ Only regenerate the file you're changing  
✅ Smaller, faster edits  
✅ Less token usage  
✅ Easier to find specific code  

### For Version Control:
✅ See exactly what changed  
✅ Better git diffs  
✅ Easier to roll back changes  

### For Maintenance:
✅ Separation of concerns  
✅ Easier to debug  
✅ Config changes don't touch logic  

## 📊 File Sizes
- `index-split.html`: ~1KB (was 18KB)
- `css/styles.css`: ~5KB
- `js/config.js`: ~1KB
- `js/app.js`: ~11KB
- **Total: ~18KB** (same as single file)

## 🚀 Deployment

The split structure works perfectly with GitHub Pages:
1. GitHub Pages serves all files correctly
2. Browser caches CSS/JS separately (faster subsequent loads)
3. Still only 3 HTTP requests total (very fast)

## 🔄 Switching Back to Single File

If you prefer, you can always go back to `index.html` (the single-file version). Both versions work identically - this split structure is just easier for editing!

## 📝 Common Edits

### Adding a 5th Team
**File:** `js/config.js`
```javascript
{
    name: "Son 4's Team",
    url: "https://web.teamo.chat/ical/...",
    icon: "S4"
}
```

### Changing Colors
**File:** `css/styles.css`
```css
/* Find this section and change the colors */
body {
    background: linear-gradient(135deg, #YOUR_COLOR1 0%, #YOUR_COLOR2 100%);
}
```

### Changing Team Icon Colors
**File:** `css/styles.css`
```css
.team-icon {
    background: linear-gradient(135deg, #YOUR_COLOR1, #YOUR_COLOR2);
}
```

## 🐛 Troubleshooting

**"Failed to load config.js"**
- Ensure `js/config.js` is uploaded to GitHub
- Check browser console (F12) for errors
- Verify file paths are correct

**"CONFIG is not defined"**
- Make sure `config.js` loads before `app.js` in HTML
- Check the `<script>` tag order in `index-split.html`

**Styles not loading**
- Verify `css/styles.css` is uploaded
- Check the path in `<link rel="stylesheet" href="css/styles.css">`
- Clear browser cache (Ctrl+F5)

## 💡 Best Practices

1. **Always edit config.js for teams** - Don't edit app.js unless changing functionality
2. **Test locally first** - Use `python -m http.server 8000` before deploying
3. **Keep backups** - Git commits are your friend
4. **Comment your changes** - Future you will thank you

## 🎨 Customization Examples

### Add Friday Evening Games
**File:** `js/app.js` → `getNextWeekend()` function

### Change to 12-hour Time Format
**File:** `js/app.js` → `formatTime()` function

### Different Date Format
**File:** `js/config.js` → Change `locale` setting

---

Enjoy your streamlined editing experience! 🏒
