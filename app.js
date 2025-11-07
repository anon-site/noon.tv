// IPTV Player Advanced
// يدعم جميع أنواع روابط IPTV والبث المباشر

class IPTVPlayer {
    constructor() {
        this.video = document.getElementById('videoPlayer');
        this.urlInput = document.getElementById('urlInput');
        this.playBtn = document.getElementById('playBtn');
        this.playlistContainer = document.getElementById('playlistContainer');
        this.searchInput = document.getElementById('searchInput');
        this.currentChannelEl = document.getElementById('currentChannel');
        this.videoOverlay = document.getElementById('videoOverlay');
        
        this.playlist = [];
        this.currentChannelIndex = -1;
        this.hls = null;
        this.dash = null;
        
        this.init();
        this.loadPlaylistFromStorage();
    }

    init() {
        // Event Listeners
        this.playBtn.addEventListener('click', () => this.playFromInput());
        this.urlInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.playFromInput();
        });

        // Search functionality
        this.searchInput.addEventListener('input', (e) => this.filterPlaylist(e.target.value));

        // Add channel button
        document.getElementById('addChannelBtn').addEventListener('click', () => {
            document.getElementById('addChannelModal').classList.add('show');
        });

        // Close modal buttons
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', () => {
                document.getElementById('addChannelModal').classList.remove('show');
            });
        });

        // Save channel
        document.getElementById('saveChannelBtn').addEventListener('click', () => this.saveChannel());

        // Import M3U
        document.getElementById('importM3uBtn').addEventListener('click', () => {
            document.getElementById('m3uFileInput').click();
        });

        document.getElementById('m3uFileInput').addEventListener('change', (e) => {
            this.importM3U(e.target.files[0]);
        });

        // Load sample M3U
        document.getElementById('loadSampleM3uBtn').addEventListener('click', () => {
            this.loadSampleM3U();
        });

        // Clear playlist
        document.getElementById('clearPlaylistBtn').addEventListener('click', () => {
            if (confirm('هل أنت متأكد من حذف جميع القنوات؟')) {
                this.playlist = [];
                this.savePlaylistToStorage();
                this.renderPlaylist();
                this.showNotification('تم حذف جميع القنوات', 'success');
            }
        });

        // Sample channels
        document.querySelectorAll('.sample-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const url = btn.getAttribute('data-url');
                this.playStream(url, btn.textContent.trim());
            });
        });

        // Video events
        this.video.addEventListener('loadstart', () => this.onVideoLoadStart());
        this.video.addEventListener('loadedmetadata', () => this.onVideoLoaded());
        this.video.addEventListener('error', (e) => this.onVideoError(e));
        this.video.addEventListener('play', () => this.hideOverlay());
        this.video.addEventListener('timeupdate', () => this.updateDuration());

        // URL Help
        document.getElementById('showUrlHelp').addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('urlHelpModal').classList.add('show');
        });

        // Modal click outside to close
        document.getElementById('addChannelModal').addEventListener('click', (e) => {
            if (e.target.id === 'addChannelModal') {
                document.getElementById('addChannelModal').classList.remove('show');
            }
        });

        document.getElementById('urlHelpModal')?.addEventListener('click', (e) => {
            if (e.target.id === 'urlHelpModal') {
                document.getElementById('urlHelpModal').classList.remove('show');
            }
        });
    }

    playFromInput() {
        let url = this.urlInput.value.trim();
        if (!url) {
            this.showNotification('الرجاء إدخال رابط صحيح', 'error');
            return;
        }

        // Clean URL - remove @ symbol if exists at the beginning
        url = this.cleanUrl(url);
        this.urlInput.value = url; // Update input with cleaned URL

        this.playStream(url, 'قناة مباشرة');
    }

    cleanUrl(url) {
        // Remove @ symbol from the beginning
        url = url.replace(/^@+/, '');
        
        // Remove extra spaces
        url = url.trim();
        
        // If URL doesn't start with http:// or https://, add http://
        if (!url.match(/^https?:\/\//i)) {
            url = 'http://' + url;
        }
        
        return url;
    }

    playStream(url, name = 'قناة غير معروفة') {
        this.currentChannelEl.textContent = name;
        this.urlInput.value = url;
        
        // Cleanup previous instances
        this.cleanup();
        
        // Check if force native player is enabled
        const forceNative = document.getElementById('forceNativePlayer')?.checked;
        
        let streamType = 'native';
        if (!forceNative) {
            streamType = this.detectStreamType(url);
        }
        
        this.showNotification(`جاري تحميل: ${name}`, 'info');
        
        switch (streamType) {
            case 'hls':
                this.playHLS(url);
                break;
            case 'dash':
                this.playDASH(url);
                break;
            default:
                this.playNative(url);
                break;
        }
    }

    detectStreamType(url) {
        const urlLower = url.toLowerCase();
        
        // HLS detection
        if (urlLower.includes('.m3u8') || urlLower.includes('.m3u') || 
            urlLower.includes('playlist.m3u') || urlLower.includes('/hls/')) {
            return 'hls';
        }
        
        // DASH detection
        if (urlLower.includes('.mpd') || urlLower.includes('/dash/')) {
            return 'dash';
        }
        
        // Known video formats - use native player
        if (urlLower.match(/\.(mp4|webm|ogg|avi|mkv|flv|mov|wmv|m4v)(\?|$)/)) {
            return 'native';
        }
        
        // TS streams
        if (urlLower.includes('.ts') || urlLower.includes('/stream.') || urlLower.includes('/play/')) {
            return 'hls'; // Try HLS first for TS streams
        }
        
        // Default to native for direct streaming URLs
        return 'native';
    }

    playHLS(url) {
        if (Hls.isSupported()) {
            this.hls = new Hls({
                enableWorker: true,
                lowLatencyMode: true,
                backBufferLength: 90
            });
            
            this.hls.loadSource(url);
            this.hls.attachMedia(this.video);
            
            this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
                this.video.play().catch(e => {
                    this.showNotification('خطأ في التشغيل التلقائي. اضغط على زر التشغيل', 'error');
                });
                this.updateQuality('HLS Stream');
            });
            
            this.hls.on(Hls.Events.ERROR, (event, data) => {
                if (data.fatal) {
                    this.handleHLSError(data);
                }
            });
        } else if (this.video.canPlayType('application/vnd.apple.mpegurl')) {
            // Safari native HLS support
            this.video.src = url;
            this.video.play().catch(e => console.error('Play error:', e));
            this.updateQuality('HLS Native');
        } else {
            this.showNotification('متصفحك لا يدعم HLS', 'error');
        }
    }

    playDASH(url) {
        if (typeof dashjs !== 'undefined') {
            this.dash = dashjs.MediaPlayer().create();
            this.dash.initialize(this.video, url, true);
            this.updateQuality('DASH Stream');
        } else {
            this.showNotification('فشل تحميل مشغل DASH', 'error');
        }
    }

    playNative(url) {
        // Set video source
        this.video.src = url;
        
        // Try to detect content type and set it
        const contentType = this.getContentType(url);
        if (contentType) {
            this.video.setAttribute('type', contentType);
        }
        
        // Check if CORS should be disabled
        const disableCors = document.getElementById('disableCors')?.checked;
        if (disableCors) {
            this.video.removeAttribute('crossorigin');
        } else {
            this.video.setAttribute('crossorigin', 'anonymous');
        }
        
        // Load and play
        this.video.load();
        
        const playPromise = this.video.play();
        if (playPromise !== undefined) {
            playPromise.catch(e => {
                console.error('Native play error:', e);
                // Try without CORS first
                if (!disableCors && e.name === 'NotAllowedError') {
                    this.showNotification('جاري المحاولة بدون CORS...', 'info');
                    this.video.removeAttribute('crossorigin');
                    this.video.load();
                    this.video.play().catch(e2 => {
                        // Try HLS as last resort
                        this.showNotification('جاري المحاولة بمشغل HLS...', 'info');
                        this.playHLS(url);
                    });
                } else if (e.name === 'NotSupportedError') {
                    this.showNotification('جاري المحاولة بمشغل HLS...', 'info');
                    this.playHLS(url);
                } else {
                    this.showNotification('خطأ في تشغيل الرابط. جرب تفعيل "فرض المشغل الأصلي"', 'error');
                }
            });
        }
        
        this.updateQuality('Direct Stream');
    }

    getContentType(url) {
        const urlLower = url.toLowerCase();
        const contentTypes = {
            'mp4': 'video/mp4',
            'webm': 'video/webm',
            'ogg': 'video/ogg',
            'mkv': 'video/x-matroska',
            'avi': 'video/x-msvideo',
            'flv': 'video/x-flv',
            'ts': 'video/mp2t',
            'm3u8': 'application/x-mpegURL',
            'mpd': 'application/dash+xml'
        };
        
        for (const [ext, type] of Object.entries(contentTypes)) {
            if (urlLower.includes('.' + ext)) {
                return type;
            }
        }
        
        // Default for streaming
        return 'video/mp2t'; // MPEG-TS for most IPTV streams
    }

    handleHLSError(data) {
        switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
                this.showNotification('خطأ في الشبكة. جاري إعادة المحاولة...', 'error');
                this.hls.startLoad();
                break;
            case Hls.ErrorTypes.MEDIA_ERROR:
                this.showNotification('خطأ في الوسائط. جاري إعادة المحاولة...', 'error');
                this.hls.recoverMediaError();
                break;
            default:
                this.showNotification('فشل HLS، جاري المحاولة بالمشغل الأصلي...', 'info');
                const currentUrl = this.urlInput.value;
                this.cleanup();
                // Try native player as fallback
                setTimeout(() => {
                    this.video.src = currentUrl;
                    this.video.setAttribute('crossorigin', 'anonymous');
                    this.video.load();
                    this.video.play().catch(e => {
                        this.showNotification('فشل تحميل البث. تحقق من الرابط', 'error');
                    });
                }, 500);
                break;
        }
    }

    cleanup() {
        if (this.hls) {
            this.hls.destroy();
            this.hls = null;
        }
        if (this.dash) {
            this.dash.reset();
            this.dash = null;
        }
        this.video.src = '';
    }

    // Playlist Management
    addChannel(name, url, logo = '') {
        const channel = {
            id: Date.now(),
            name: name,
            url: url,
            logo: logo
        };
        
        this.playlist.push(channel);
        this.savePlaylistToStorage();
        this.renderPlaylist();
        this.showNotification(`تمت إضافة: ${name}`, 'success');
    }

    removeChannel(id) {
        this.playlist = this.playlist.filter(ch => ch.id !== id);
        this.savePlaylistToStorage();
        this.renderPlaylist();
        this.showNotification('تم حذف القناة', 'success');
    }

    saveChannel() {
        const name = document.getElementById('channelName').value.trim();
        const url = document.getElementById('channelUrl').value.trim();
        const logo = document.getElementById('channelLogo').value.trim();

        if (!name || !url) {
            this.showNotification('الرجاء إدخال اسم القناة والرابط', 'error');
            return;
        }

        this.addChannel(name, url, logo);
        
        // Clear form and close modal
        document.getElementById('channelName').value = '';
        document.getElementById('channelUrl').value = '';
        document.getElementById('channelLogo').value = '';
        document.getElementById('addChannelModal').classList.remove('show');
    }

    renderPlaylist(channels = this.playlist) {
        if (channels.length === 0) {
            this.playlistContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-broadcast-tower"></i>
                    <p>لا توجد قنوات في القائمة</p>
                    <small>أضف قنوات أو استورد ملف M3U للبدء</small>
                </div>
            `;
            return;
        }

        this.playlistContainer.innerHTML = channels.map(channel => `
            <div class="channel-item" data-id="${channel.id}">
                <div class="channel-logo">
                    ${channel.logo ? 
                        `<img src="${channel.logo}" onerror="this.parentElement.innerHTML='<i class=\\'fas fa-tv\\'></i>'" alt="${channel.name}">` : 
                        '<i class="fas fa-tv"></i>'
                    }
                </div>
                <div class="channel-info">
                    <div class="channel-name">${channel.name}</div>
                    <div class="channel-url">${this.truncateUrl(channel.url)}</div>
                </div>
                <div class="channel-actions">
                    <button onclick="player.playChannelById(${channel.id})" title="تشغيل">
                        <i class="fas fa-play"></i>
                    </button>
                    <button onclick="player.removeChannel(${channel.id})" title="حذف">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    playChannelById(id) {
        const channel = this.playlist.find(ch => ch.id === id);
        if (channel) {
            this.playStream(channel.url, channel.name);
            
            // Highlight active channel
            document.querySelectorAll('.channel-item').forEach(item => {
                item.classList.remove('active');
            });
            document.querySelector(`[data-id="${id}"]`)?.classList.add('active');
        }
    }

    filterPlaylist(searchTerm) {
        const filtered = this.playlist.filter(channel => 
            channel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            channel.url.toLowerCase().includes(searchTerm.toLowerCase())
        );
        this.renderPlaylist(filtered);
    }

    truncateUrl(url, maxLength = 40) {
        return url.length > maxLength ? url.substring(0, maxLength) + '...' : url;
    }

    // M3U Import
    async importM3U(file) {
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target.result;
            this.parseM3U(content);
        };
        reader.readAsText(file);
    }

    async loadSampleM3U() {
        try {
            const response = await fetch('sample-channels.m3u');
            if (!response.ok) throw new Error('Failed to load sample M3U');
            const content = await response.text();
            this.parseM3U(content);
        } catch (error) {
            console.error('Error loading sample M3U:', error);
            this.showNotification('فشل تحميل القنوات التجريبية', 'error');
        }
    }

    parseM3U(content) {
        const lines = content.split('\n');
        let currentChannel = {};
        let channelsAdded = 0;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();

            if (line.startsWith('#EXTINF:')) {
                // Parse channel info
                const nameMatch = line.match(/,(.+)$/);
                const logoMatch = line.match(/tvg-logo="([^"]+)"/);
                
                currentChannel.name = nameMatch ? nameMatch[1].trim() : `قناة ${i}`;
                currentChannel.logo = logoMatch ? logoMatch[1] : '';
            } else if (line && !line.startsWith('#')) {
                // This is the URL
                currentChannel.url = line;
                
                if (currentChannel.name && currentChannel.url) {
                    this.addChannel(currentChannel.name, currentChannel.url, currentChannel.logo);
                    channelsAdded++;
                }
                
                currentChannel = {};
            }
        }

        this.showNotification(`تم استيراد ${channelsAdded} قناة بنجاح`, 'success');
    }

    // Storage
    savePlaylistToStorage() {
        try {
            localStorage.setItem('iptv_playlist', JSON.stringify(this.playlist));
        } catch (e) {
            console.error('Failed to save playlist:', e);
        }
    }

    loadPlaylistFromStorage() {
        try {
            const saved = localStorage.getItem('iptv_playlist');
            if (saved) {
                this.playlist = JSON.parse(saved);
                this.renderPlaylist();
            }
        } catch (e) {
            console.error('Failed to load playlist:', e);
        }
    }

    // UI Updates
    showNotification(message, type = 'info') {
        const existing = document.querySelector('.notification');
        if (existing) existing.remove();

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideDown 0.3s ease reverse';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    hideOverlay() {
        this.videoOverlay.classList.add('hidden');
    }

    showOverlay() {
        this.videoOverlay.classList.remove('hidden');
    }

    onVideoLoadStart() {
        this.showOverlay();
    }

    onVideoLoaded() {
        this.showNotification('تم التحميل بنجاح', 'success');
    }

    onVideoError(e) {
        console.error('Video error:', e);
        this.showNotification('خطأ في تحميل الفيديو. تحقق من الرابط', 'error');
        this.showOverlay();
    }

    updateQuality(quality) {
        document.getElementById('quality').textContent = quality;
    }

    updateDuration() {
        const duration = this.video.duration;
        const currentTime = this.video.currentTime;
        
        if (!isNaN(duration) && isFinite(duration)) {
            const remaining = duration - currentTime;
            document.getElementById('duration').textContent = this.formatTime(remaining);
        } else {
            document.getElementById('duration').textContent = 'مباشر';
        }
    }

    formatTime(seconds) {
        if (!isFinite(seconds)) return '00:00';
        
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);
        
        if (h > 0) {
            return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        }
        return `${m}:${s.toString().padStart(2, '0')}`;
    }
}

// Initialize player
let player;
document.addEventListener('DOMContentLoaded', () => {
    player = new IPTVPlayer();
    console.log('IPTV Player initialized successfully');
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT') return;
    
    const video = document.getElementById('videoPlayer');
    
    switch(e.key) {
        case ' ':
            e.preventDefault();
            video.paused ? video.play() : video.pause();
            break;
        case 'ArrowRight':
            video.currentTime += 10;
            break;
        case 'ArrowLeft':
            video.currentTime -= 10;
            break;
        case 'ArrowUp':
            video.volume = Math.min(1, video.volume + 0.1);
            break;
        case 'ArrowDown':
            video.volume = Math.max(0, video.volume - 0.1);
            break;
        case 'f':
            if (video.requestFullscreen) {
                video.requestFullscreen();
            }
            break;
        case 'm':
            video.muted = !video.muted;
            break;
    }
});

