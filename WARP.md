# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

**NOON TV** is a professional Arabic IPTV (Internet Protocol Television) web application for watching live Arabic satellite channels. It's a static web application built with vanilla HTML5, CSS3, and JavaScript (ES6+) with no build system required.

### Key Features
- 100+ Arabic channels from various Arab countries
- Live HLS (m3u8) streaming with adaptive quality
- Advanced admin panel for channel management
- Cloud synchronization with GitHub/GitLab
- Favorites system with local storage
- Multiple streaming protocol support (HLS, MP4, WebM, FLV, RTMP, RTSP, DASH, WebRTC, YouTube, SHLS)
- Service Worker for offline capabilities
- Comprehensive customization system (themes, colors, layouts, zoom)
- RTL (right-to-left) Arabic interface

### Architecture
- **No build process**: Direct browser execution
- **Data persistence**: localStorage + optional cloud sync (GitHub/GitLab API)
- **Video playback**: HLS.js library for streaming
- **Authentication**: SHA-256 hashed password for admin panel
- **State management**: Plain JavaScript with localStorage

## Project Structure

```
noon.tv/
├── index.html              # Main application page
├── iptv-checker.html       # IPTV link testing tool
├── script.js               # Core application logic (~3000+ lines)
├── sw.js                   # Service Worker for PWA/offline
├── style.css               # Main stylesheet
├── style-clean.css         # Clean/minimal theme variant
├── mobile-*.css            # Mobile-specific stylesheets
├── no-channels.css         # Empty state styling
├── channels.json           # Channel database (JSON format)
├── favicon.svg             # App icon
├── site.webmanifest        # PWA manifest
└── README.md               # Arabic documentation
```

## Development Commands

### Local Development
Since this is a static site with no build process, simply open the files in a browser:

```powershell
# Open main app in default browser (Windows)
Start-Process index.html

# Or use a local server for better CORS handling
python -m http.server 8000
# Then navigate to: http://localhost:8000
```

### Testing
There's no automated test suite. Manual testing workflow:

1. **Test channel playback**: Open index.html → Click any channel
2. **Test admin panel**: Click "لوحة التحكم" (Admin Panel) → Default password: `admin`
3. **Test IPTV links**: Open `iptv-checker.html` to validate m3u8/stream URLs
4. **Test cloud sync**: Admin Panel → General Settings → Enable Remote Storage

### Code Quality
No linters configured. Follow existing patterns:
- Arabic comments and variable names for UI strings
- English for technical variable names
- RTL-aware CSS (direction: rtl)
- Consistent indentation (4 spaces for HTML/CSS, variable for JS)

## Key Technical Concepts

### Data Flow Architecture

1. **Channel Loading**:
   - Checks for updates from GitHub repo (automatic on app load)
   - Loads from `channels.json` or localStorage
   - Cloud sync pulls from GitHub/GitLab if configured
   - Filters and renders to DOM

2. **Admin Panel**:
   - SHA-256 password authentication (`admin` default)
   - CRUD operations on channels array
   - Drag-and-drop reordering with visual feedback
   - Auto-saves to localStorage
   - Optional cloud push to GitHub/GitLab

3. **Cloud Sync System**:
   - Uses GitHub/GitLab REST APIs
   - Conflict resolution: timestamp-based (last write wins)
   - Auto-sync on channel add/edit/delete if enabled
   - Manual sync via "مزامنة الآن" (Sync Now) button

4. **Video Player**:
   - HLS.js for m3u8 streams
   - Native HTML5 video for MP4/WebM
   - Quality selection (auto, 1080p, 720p, 480p, 360p, 240p)
   - Picture-in-Picture support
   - Channel navigation (previous/next) within player

### State Management

All state stored in `localStorage`:
- `channels`: Array of channel objects
- `favorites`: Array of channel IDs
- `adminPassword`: SHA-256 hash
- `customizations`: User preferences (theme, zoom, colors, etc.)
- `remoteStorageSettings`: Cloud sync configuration
- `lastUpdate`: Timestamp of last channel update

### Channel Object Schema

```javascript
{
  id: number,
  name: string,          // Arabic channel name
  url: string,           // Stream URL (m3u8, mp4, etc.)
  logo: string,          // Logo image URL
  category: string,      // 'news' | 'sports' | 'entertainment' | 'religious' | 'music' | 'movies' | 'documentary' | 'kids'
  country: string,       // Arabic country name
  status: string,        // 'active' | 'inactive'
  requiresVpn: boolean,  // VPN requirement flag
  order: number          // Display order
}
```

### Important Functions (script.js)

- `loadChannels()`: Primary data loading function
- `saveChannels()`: Persists to localStorage + cloud sync
- `renderChannels()`: DOM rendering with filtering
- `openChannel()`: Video modal with player initialization
- `app.loginToAdmin()`: Admin authentication
- `app.syncWithRemote()`: Cloud synchronization
- `updateChannels()`: Fetch latest from GitHub repository

## Common Tasks

### Adding a New Channel
1. Open Admin Panel (password: `admin`)
2. Go to "إضافة قناة" (Add Channel) tab
3. Fill form: name, URL (m3u8/mp4/etc.), logo, category, country
4. Click "إضافة القناة" (Add Channel)
5. Auto-saves locally and syncs to cloud if enabled

### Modifying Channels Programmatically
```javascript
// Access channels from browser console
let channels = JSON.parse(localStorage.getItem('channels'));

// Modify as needed
channels[0].name = "New Name";

// Save back
localStorage.setItem('channels', JSON.stringify(channels));
location.reload(); // Refresh to see changes
```

### Changing Admin Password
1. Admin Panel → Security tab → "الأمان"
2. Enter current password (default: `admin`)
3. Enter new password (shows strength indicator)
4. Confirm new password
5. Saves SHA-256 hash to localStorage

### Cloud Sync Setup
1. Create GitHub/GitLab repository
2. Generate Personal Access Token (PAT) with repo write permissions
3. Admin Panel → General Settings → "الإعدادات العامة"
4. Enable "التخزين السحابي" (Remote Storage)
5. Enter: provider, repository URL, access token, branch name
6. Click "اختبار الاتصال" (Test Connection)
7. Click "مزامنة الآن" (Sync Now) for initial sync

### Exporting/Importing Channels
```javascript
// Export (browser console or Admin Panel button)
app.exportChannels(); // Downloads channels.json

// Import (Admin Panel → Diagnostic Tools → Import)
// Or via console:
app.importChannels(); // Opens file picker
```

## Deployment

### GitHub Pages
Already configured for GitHub Pages deployment. The app runs entirely client-side.

**Note**: Some IPTV streams may have CORS restrictions on GitHub Pages. Users may need VPN or proxy.

### Custom Hosting
Simply upload all files to any static web host:
```powershell
# Copy all files to hosting directory
Copy-Item *.html, *.js, *.css, *.json, *.svg, *.webmanifest <destination>
```

## Important Notes

- **Language**: UI is fully in Arabic (RTL layout). Code comments mix Arabic and English.
- **Browser compatibility**: Requires modern browser with HTML5 video, HLS.js, localStorage
- **CORS issues**: Some streams require VPN due to geographic restrictions or CORS policies
- **No backend**: Everything runs in browser. Admin password stored as SHA-256 hash locally.
- **Channel source**: Default channels loaded from GitHub repository, can be overridden with cloud sync
- **PWA support**: Service Worker (`sw.js`) enables offline caching and installation

## Security Considerations

- Admin password hashed with SHA-256 (client-side only, not secure for production)
- GitHub/GitLab tokens stored in localStorage (unencrypted)
- No server-side validation
- Consider this suitable for personal/small team use, not production-grade security

## Troubleshooting

### Channels not loading
1. Check browser console for errors
2. Verify `channels.json` exists and is valid JSON
3. Clear localStorage: `localStorage.clear()` then reload
4. Check automatic update from GitHub succeeded

### Video player not working
1. Verify stream URL is accessible (use iptv-checker.html)
2. Check if VPN required for channel
3. Ensure HLS.js loaded (check Network tab)
4. Try different quality settings

### Cloud sync failing
1. Verify GitHub/GitLab token has write permissions
2. Check repository URL format: `username/repo-name`
3. Ensure branch exists (default: `main`)
4. Test connection via Admin Panel diagnostic button

### Admin panel locked
If you forgot admin password, reset via browser console:
```javascript
localStorage.removeItem('adminPassword');
location.reload();
// Default password 'admin' will work again
```

## External Dependencies

Loaded via CDN:
- **HLS.js**: Video streaming library (https://cdn.jsdelivr.net/npm/hls.js)
- **Font Awesome 6.4.0**: Icons (https://cdnjs.cloudflare.com)
- **Cairo Font**: Arabic typography (Google Fonts)

## Version
Current version: **2.0.1**
