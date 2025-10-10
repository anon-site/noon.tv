# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

**NOON TV** is a Progressive Web Application (PWA) for streaming Arabic satellite TV channels. It's a client-side web application built with vanilla JavaScript, HTML5, and CSS3, featuring:

- 100+ Arabic TV channels with HLS streaming
- Advanced video player with multi-quality support
- Admin panel for channel management
- Cloud synchronization via GitHub/GitLab APIs
- Favorites system with localStorage persistence
- Extensive customization options (themes, layouts, fonts, zoom levels)
- Service Worker for offline support and background audio
- SHA-256 encrypted admin authentication

## Architecture

### Core Application Structure

The application follows a **single-class architecture** centered around the `ArabicTVApp` class in `script.js`:

```
ArabicTVApp (main controller)
├── Data Layer
│   ├── channels: Array of channel objects
│   ├── filteredChannels: Currently displayed channels
│   ├── favorites: Set of favorited channel IDs
│   ├── categories: Array of category definitions
│   ├── settings: User preferences object
│   └── remoteStorage: Cloud sync configuration
├── State Management
│   ├── currentChannel: Currently playing channel
│   ├── currentCategory: Active category filter
│   ├── isLoggedIn: Admin authentication state
│   └── hls: HLS.js video player instance
└── Feature Modules
    ├── Channel Management (CRUD operations)
    ├── Authentication System
    ├── Cloud Synchronization (GitHub/GitLab)
    ├── Notification System
    └── UI Rendering
```

### Data Flow

1. **Initialization Flow** (`init()` method):
   - Test localStorage availability
   - Load remote storage settings
   - Load categories, then channels from localStorage
   - Fallback to `channels.json` if localStorage empty
   - Load favorites, settings, admin state
   - Render UI and bind events
   - Auto-update from GitHub on page load (if enabled)

2. **Channel Update Flow** (`updateChannels()` function):
   - Fetch from `https://raw.githubusercontent.com/anon-site/TV-AR/main/channels.json`
   - Create backup of current channels
   - Update app state with new channels
   - Save to localStorage
   - If cloud sync enabled: trigger `syncToRemote()`
   - Re-render UI

3. **Cloud Sync Flow**:
   - **Upload** (`syncToRemote()`): Package channels, favorites, settings, categories, admin password → GitHub/GitLab API
   - **Download** (`syncFromRemote()`): Fetch from remote → detect conflicts → merge or resolve
   - Conflict resolution: User chooses local/remote/smart merge via modal

### Key State Management

- **localStorage keys**:
  - `arabicTVChannels`: Main channel data
  - `arabicTVSettings`: User customization settings
  - `arabicTVFavorites`: Favorited channel IDs
  - `arabicTVRemoteStorage`: Cloud sync configuration
  - `anon_tv_admin_password`: SHA-256 hashed admin password
  - `anon_tv_login_state`: Admin session state (24hr expiry)
  - `lastUpdateTime`: Timestamp of last channel update

- **Session state** (in-memory):
  - `hls`: HLS.js player instance for current stream
  - `editingChannelId`: Channel ID being edited in admin panel
  - `notificationQueue`: Queue for managing notification display

## Common Development Commands

### Testing and Running

```powershell
# Serve locally (Python)
python -m http.server 8000

# Open in browser
Start-Process "http://localhost:8000"

# Test on mobile (requires local network)
# Get local IP first
ipconfig
# Then access from mobile: http://YOUR-IP:8000
```

### File Operations

```powershell
# Validate channels.json
Get-Content channels.json | ConvertFrom-Json

# Check file sizes
Get-ChildItem -File | Select-Object Name, @{N='Size(KB)';E={[math]::Round($_.Length/1KB,2)}} | Sort-Object 'Size(KB)' -Descending

# Find all localStorage references
Select-String -Path script.js -Pattern "localStorage" -Context 0,2
```

### Backup and Restore

```powershell
# Backup channels.json with timestamp
Copy-Item channels.json "channels.backup.$(Get-Date -Format 'yyyyMMdd_HHmmss').json"

# Test JSON validity
try { Get-Content channels.json | ConvertFrom-Json } catch { Write-Host "Invalid JSON!" }
```

## Important Implementation Details

### Channel Object Schema

Each channel in `channels.json` must have:

```javascript
{
  "id": number,           // Unique identifier
  "name": "string",       // Channel name (Arabic)
  "url": "string",        // M3U8 stream URL or embed URL
  "logo": "string",       // Logo image URL or base64
  "category": "string",   // Category key (news, sports, etc.)
  "country": "string",    // Country name (Arabic)
  "type": "string",       // hls, youtube, elahmad, iframe
  "status": "string",     // active, inactive
  "vpn": boolean,         // Whether VPN is required
  "lastModified": "ISO"   // ISO timestamp (auto-added)
}
```

### Video Player Types

The app supports multiple stream types via the `type` field:

- **`hls`**: Standard HLS streams (m3u8) - uses HLS.js
- **`youtube`**: YouTube embeds
- **`elahmad`**: Special iframe handler for elahmad.com streams
- **`iframe`**: Generic iframe embeds

Stream type detection logic is in `playChannel()` method.

### Admin Authentication

- Password is SHA-256 hashed before storage
- Default password: `@admin123` (hash: `3129ccfbd7c...`)
- Login state persists for 24 hours
- Password syncs to cloud if cloud storage enabled
- Change password via "Security Settings" in admin panel

### Cloud Synchronization

**GitHub/GitLab API Integration:**

- Uses personal access tokens for authentication
- Uploads to specific branch/filename (configurable)
- Data structure includes: channels, favorites, settings, categories, adminPassword
- Conflict detection based on:
  - Channel count differences (>20%)
  - Last modified timestamps
  - Local vs remote channel changes

**Conflict Resolution:**
- Modal prompts user to choose: Local / Remote / Smart Merge
- Smart merge combines unique channels from both sources
- Automatic backup created before destructive operations

### Notification System

The app uses a custom notification queue system:

```javascript
// Usage in code
app.notifySuccess('Message', 'Title', duration);
app.notifyError('Message', 'Title', duration);
app.notifyWarning('Message', 'Title', duration);
app.notifyInfo('Message', 'Title', duration);
```

Notifications support auto-dismiss and manual close.

## Working with the Codebase

### Adding a New Channel Type

1. Update channel object in `channels.json` with new `type` value
2. Modify `playChannel()` method in `script.js` to handle new type
3. Add conditional logic for stream URL processing
4. Test with example channel

### Modifying Cloud Sync Behavior

Cloud sync is triggered automatically in these scenarios:
- After adding/editing/deleting channels (if `autoSync: true`)
- After updating from GitHub (in `updateChannels()`)
- Manually via "Sync Now" button

To modify: Edit `syncToRemote()` and `syncFromRemote()` methods.

### Customizing Themes

Themes are CSS-based via `data-theme` attribute on `<body>`:

- Defined in `style.css` under `[data-theme="..."]` selectors
- Controlled via `applyTheme()` method
- Persisted in `settings.theme` property

Color themes (blue, green, purple, etc.) use `data-color-theme` attribute.

### Extending Admin Panel

Admin panel uses tab system:
1. Add tab button in HTML (`.admin-tab` class)
2. Add content section (`.admin-content`)
3. Wire up via `switchAdminTab(tab)` method
4. Bind events in `bindEvents()` method

## Testing

### Manual Testing Checklist

1. **Channel Playback**:
   ```powershell
   # Test HLS stream
   # Open app → Click any channel → Verify video plays
   ```

2. **Admin Panel**:
   ```powershell
   # Login: Use password "@admin123"
   # Test CRUD: Add → Edit → Delete channel
   # Verify persistence: Refresh page → Check changes saved
   ```

3. **Cloud Sync**:
   ```powershell
   # Configure GitHub token in Admin > General Settings
   # Click "Sync Now"
   # Open app on another device → Verify data synced
   ```

4. **Favorites**:
   ```powershell
   # Click heart icon on channels
   # Navigate to Favorites tab
   # Verify channels appear
   # Refresh page → Verify persistence
   ```

### Debugging

Common issues and solutions:

**Channels not loading:**
```javascript
// Check in browser console:
localStorage.getItem('arabicTVChannels')
// If empty, channels.json failed to load
```

**Video not playing:**
```javascript
// Check stream type and HLS.js initialization
console.log(app.currentChannel)
console.log(app.hls)
```

**Cloud sync failing:**
```javascript
// Verify remote storage config
console.log(app.remoteStorage)
// Check token permissions (needs repo read/write)
```

## Important Notes

- **localStorage Quota**: Browser limit ~5-10MB. Monitor with diagnostic modal (Admin > Storage Diagnostic).
- **CORS**: Some streams may require CORS proxy. Current proxy: `https://api.allorigins.win/raw?url=`
- **HLS.js**: Loaded from CDN (jsdelivr). Required for HLS stream playback in non-Safari browsers.
- **Service Worker**: Caches static assets for offline access. Clear with `Ctrl+Shift+Delete` → Clear cache.
- **Admin Session**: Auto-logout after 24 hours for security.
- **VPN Flag**: Some channels require VPN. Visual indicator shown to users.

## File Structure

```
├── index.html              # Main application page
├── script.js               # Core JavaScript (ArabicTVApp class)
├── style.css               # Main stylesheet
├── channels.json           # Channel database (primary data source)
├── iptv-checker.html       # Standalone stream testing tool
├── sw.js                   # Service Worker (offline support)
├── favicon.svg             # App icon
├── .htaccess               # Apache config (CORS, caching)
└── README.md               # User documentation (Arabic)
```

## External Dependencies

- **HLS.js**: `https://cdn.jsdelivr.net/npm/hls.js@latest` - HLS stream playback
- **Font Awesome**: `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/` - Icons
- **Cairo Font**: `https://fonts.googleapis.com/css2?family=Cairo` - Arabic typography

## Security Considerations

- Admin password uses SHA-256 hashing (via Web Crypto API)
- No plaintext passwords in localStorage
- Cloud tokens stored in localStorage (consider encryption for production)
- Content Security Policy defined in HTML meta tag
- XSS prevention: No `eval()`, input sanitization in channel forms

## Performance Optimization

- Lazy loading: Channels rendered in chunks (not implemented yet - optimization opportunity)
- Service Worker: Caches static assets
- HLS.js: Adaptive bitrate streaming
- localStorage: Faster than repeated JSON fetches
- CSS Grid/Flexbox: GPU-accelerated layouts

## Common Gotchas

1. **Admin password reset**: If locked out, clear `anon_tv_admin_password` in localStorage or use default hash.
2. **Cloud sync conflicts**: Always backup before resolving conflicts. Use "Smart Merge" for safety.
3. **Channel IDs**: Must be unique. Auto-generated as `Date.now()` when adding new channels.
4. **Category keys**: English lowercase only (e.g., `news`, `sports`). Category names can be Arabic.
5. **Stream URL validation**: App checks for m3u8, youtube.com, or elahmad.com domains. Adjust in `isValidUrl()` method.
6. **CORS Issues with SHLS streams**: See detailed solution in `CORS-SOLUTION.md`

## CORS Issues (GitHub Pages)

### Problem

Streams from `shls-live-enc.edgenextcdn.net` work on localhost but **fail on GitHub Pages** due to CORS restrictions.

### Why?

- Browsers are lenient with localhost
- HTTPS deployments (GitHub Pages) enforce strict CORS
- The stream server doesn't send `Access-Control-Allow-Origin: *` header

### Solutions

#### ✅ Best Solution: CloudFlare Worker (FREE)

1. **Create CloudFlare Worker**:
   - Go to https://dash.cloudflare.com/
   - Workers & Pages → Create Worker
   - Copy code from `cloudflare-worker.js`
   - Deploy (free 100K requests/day)

2. **Update script.js**:
   ```javascript
   // Add after class definition
   const CORS_PROXY = 'https://your-worker.workers.dev';
   
   // In loadShlsVideo method:
   const proxiedUrl = `${CORS_PROXY}/?url=${encodeURIComponent(streamUrl)}`;
   this.hls.loadSource(proxiedUrl);
   ```

3. **Test**:
   ```powershell
   # Test Worker in Console
   curl "https://your-worker.workers.dev/?url=https://shls-live-enc.edgenextcdn.net/out/v1/example/index.m3u8"
   ```

#### Alternative: PHP Proxy

If you have a PHP server:
1. Upload `cors-proxy.php` to your server
2. Use: `https://yourdomain.com/cors-proxy.php?url=STREAM_URL`

**See `CORS-SOLUTION.md` for complete documentation.**
