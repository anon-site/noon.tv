// Arabic Satellite TV Channels Application
class ArabicTVApp {
    constructor() {
        this.channels = [
            // News Channels
            {
                id: 1,
                name: "الجزيرة",
                logo: "https://i.imgur.com/7bRVpnu.png",
                url: "https://live-hls-web-aje.getaj.net/AJE/01.m3u8",
                category: "news",
                country: "قطر"
            },
            {
                id: 2,
                name: "العربية",
                logo: "https://i.imgur.com/Dj16oKL.png",
                url: "https://live.alarabiya.net/alarabiapublish/alarabiya.smil/playlist.m3u8",
                category: "news",
                country: "الإمارات"
            },
            {
                id: 3,
                name: "سكاي نيوز عربية",
                logo: "https://i.imgur.com/McQv1xE.png",
                url: "https://stream.skynewsarabia.com/hls/sna.m3u8",
                category: "news",
                country: "الإمارات"
            },
            {
                id: 4,
                name: "BBC عربي",
                logo: "https://i.imgur.com/2P4m5Eb.png",
                url: "https://vs-cmaf-pushb-ww-live.akamaized.net/x=3/i=urn:bbc:pips:service:bbc_arabic_tv/iptv_hd_abr_v1.m3u8",
                category: "news",
                country: "بريطانيا"
            },
            {
                id: 5,
                name: "الحدث",
                logo: "https://i.imgur.com/8dUS3Ih.png",
                url: "https://av.alarabiya.net/alarabiapublish/alhadath.smil/playlist.m3u8",
                category: "news",
                country: "الإمارات"
            },
            
            // Entertainment Channels
            {
                id: 6,
                name: "MBC 1",
                logo: "https://i.imgur.com/eKKOX8x.png",
                url: "https://mbc1-enc.edgenextcdn.net/out/v1/84ab37e99d6e4b16b33c6600ace5daa6/index.m3u8",
                category: "entertainment",
                country: "الإمارات"
            },
            {
                id: 7,
                name: "MBC 4",
                logo: "https://i.imgur.com/pfF61uH.png",
                url: "https://mbc4-prod-dub-ak.akamaized.net/out/v1/c08681f81775496ab4afa2ee7ef2a4a6/index.m3u8",
                category: "entertainment",
                country: "الإمارات"
            },
            {
                id: 8,
                name: "روتانا سينما",
                logo: "https://i.imgur.com/X1h2ML8.png",
                url: "https://rotana-cinema.hibridmedia.com/live/rotana-cinema/playlist.m3u8",
                category: "entertainment",
                country: "السعودية"
            },
            {
                id: 9,
                name: "أبو ظبي الأولى",
                logo: "https://i.imgur.com/5XV8bXB.png",
                url: "https://vo-live.cdb.cdn.orange.com/Content/Channel/AbuDhabiChannel/HLS/index.m3u8",
                category: "entertainment",
                country: "الإمارات"
            },
            {
                id: 10,
                name: "دبي",
                logo: "https://i.imgur.com/H1PfYOY.png",
                url: "https://dmisxthvll.cdn.mangomolo.com/dubaitv/smil:dubaitv.stream.smil/playlist.m3u8",
                category: "entertainment",
                country: "الإمارات"
            },
            
            // Sports Channels
            {
                id: 11,
                name: "بي إن سبورت 1",
                logo: "https://i.imgur.com/6BVWk8z.png",
                url: "https://webhdrus.onlinehdhls.ru/lb/premium132/index.m3u8",
                category: "sports",
                country: "قطر"
            },
            {
                id: 12,
                name: "بي إن سبورت 2",
                logo: "https://i.imgur.com/JkbAMnU.png",
                url: "https://webhdrus.onlinehdhls.ru/lb/premium133/index.m3u8",
                category: "sports",
                country: "قطر"
            },
            {
                id: 13,
                name: "أبو ظبي الرياضية",
                logo: "https://i.imgur.com/ooyKqbW.png",
                url: "https://vo-live.cdb.cdn.orange.com/Content/Channel/AbuDhabiSportsChannel/HLS/index.m3u8",
                category: "sports",
                country: "الإمارات"
            },
            {
                id: 14,
                name: "دبي الرياضية",
                logo: "https://i.imgur.com/UdxqMQh.png",
                url: "https://dmithrvll.cdn.mangomolo.com/dubaisports/smil:dubaisports.stream.smil/playlist.m3u8",
                category: "sports",
                country: "الإمارات"
            },
            
            // Religious Channels
            {
                id: 15,
                name: "المجد للقرآن الكريم",
                logo: "https://i.imgur.com/fNA3O4y.png",
                url: "https://live.al-majd.net/live/MajdQuraan/chunklist.m3u8",
                category: "religious",
                country: "السعودية"
            },
            {
                id: 16,
                name: "قناة السنة النبوية",
                logo: "https://i.imgur.com/GF9Nq2x.png",
                url: "https://svs.itworkscdn.net/sunnah/sunnah/chunklist.m3u8",
                category: "religious",
                country: "السعودية"
            },
            {
                id: 17,
                name: "الرسالة",
                logo: "https://i.imgur.com/8gJ4KhP.png",
                url: "https://live.al-resalah.net/live/alresalah/chunklist.m3u8",
                category: "religious",
                country: "لبنان"
            },
            
            // Music Channels
            {
                id: 18,
                name: "روتانا موسيقى",
                logo: "https://i.imgur.com/WaFdYon.png",
                url: "https://rotana-music.hibridmedia.com/live/rotana-music/playlist.m3u8",
                category: "music",
                country: "السعودية"
            },
            {
                id: 19,
                name: "نغم",
                logo: "https://i.imgur.com/T4Q6XLV.png",
                url: "https://f24hls-i.akamaihd.net/hls/live/221147/NAGH/playlist.m3u8",
                category: "music",
                country: "لبنان"
            },
            {
                id: 20,
                name: "MTV لبنان",
                logo: "https://i.imgur.com/5Q8zBUN.png",
                url: "https://live.mtv.com.lb/hls/live/578407/Live/playlist.m3u8",
                category: "music",
                country: "لبنان"
            }
        ];

        this.currentChannel = null;
        this.hls = null;
        this.isPictureInPicture = false;
        this.settings = {
            autoQuality: true,
            autoplay: true,
            volume: 80,
            theme: 'dark',
            showNewsTicker: false,
            // New customization settings
            zoomLevel: 100, // 75% to 150%
            colorTheme: 'default', // default, blue, green, purple, orange, red
            layoutMode: 'compact', // grid, list, compact
            fontSize: 'small', // small, medium, large, xlarge
            animationsEnabled: true,
            compactMode: true,
            highContrast: false,
            borderRadius: 'rounded' // minimal, normal, rounded
        };
        this.filteredChannels = [...this.channels];
        this.currentCategory = 'all';
        this.editingChannelId = null; // Track which channel is being edited
        this.notificationQueue = []; // Queue for notifications
        this.activeNotifications = new Set(); // Track active notifications
        this.originalOrder = [...this.channels]; // Track original order for comparison
        this.hasOrderChanged = false; // Track if order has been modified
        this.isMobileSidebarOpen = false; // Track mobile sidebar state
        this.isDesktopSidebarOpen = false; // Track desktop sidebar state
        this.favorites = new Set(); // Track favorite channels
        this.currentCountryFilter = 'all'; // Track country filter
        this.showFavoritesOnly = false; // Track favorites filter
        this.categories = this.getDefaultCategories(); // Track categories
        
        // Remote Storage Configuration
        this.remoteStorage = {
            enabled: false,
            provider: 'github', // 'github' or 'gitlab'
            repository: '',
            token: '',
            branch: 'main',
            filename: 'channels.json',
            lastSync: null,
            autoSync: true
        };

        this.init();
    }

    init() {
        this.testLocalStorage(); // Test if localStorage is working
        this.loadRemoteStorageSettings(); // Load remote storage configuration
        this.loadDataFromFile(); // Load data from channels.json first
        this.loadChannelsFromStorage(); // Load saved channels first
        this.loadFavorites(); // Load saved favorites
        this.filteredChannels = [...this.channels]; // Ensure filtered channels match loaded channels
        this.loadSettings();
        this.renderChannels();
        this.bindEvents();
        this.bindRemoteStorageEvents();
        this.setupMobileSearch();
        this.setupRepositoryAutoSuggest();
        this.setupPictureInPictureEvents();
        this.checkAndSetupPictureInPicture();
        
        // Attempt auto-sync if enabled
        if (this.remoteStorage.enabled && this.remoteStorage.autoSync) {
            this.syncFromRemote();
        }
        this.syncMobileNavTabs();
        this.initializeNewFeatures(); // Initialize new navigation features
        this.updateChannelStats(); // Update channel statistics
        this.updateChannelCategoryOptions(); // Update category options
        this.updateNavigationTabs(); // Update navigation tabs
        this.updateSidebarCounts(); // Update sidebar counts
        this.hideLoading();
        
        // تشخيص أولي
        console.log('تم تهيئة التطبيق مع', this.channels.length, 'قناة');
    }

    async loadDataFromFile() {
        try {
            const response = await fetch('channels.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            
            // Load channels from JSON file
            if (data.channels && Array.isArray(data.channels)) {
                this.channels = data.channels;
                console.log('تم تحميل القنوات من channels.json:', this.channels.length, 'قناة');
            }
            
            // Load categories from JSON file
            if (data.categories && Array.isArray(data.categories)) {
                this.categories = data.categories;
                console.log('تم تحميل الفئات من channels.json:', this.categories.length, 'فئة');
            }
            
            // Load settings from JSON file
            if (data.settings && typeof data.settings === 'object') {
                this.settings = { ...this.settings, ...data.settings };
                console.log('تم تحميل الإعدادات من channels.json');
            }
            
            // Load favorites from JSON file
            if (data.favorites && Array.isArray(data.favorites)) {
                this.favorites = new Set(data.favorites);
                console.log('تم تحميل المفضلة من channels.json:', this.favorites.size, 'قناة');
            }
            
        } catch (error) {
            console.error('خطأ في تحميل البيانات من channels.json:', error);
            console.log('سيتم استخدام البيانات الافتراضية');
        }
    }

    testLocalStorage() {
        try {
            const testKey = 'test-storage';
            const testValue = 'test-value';
            localStorage.setItem(testKey, testValue);
            const retrieved = localStorage.getItem(testKey);
            localStorage.removeItem(testKey);
            
            if (retrieved === testValue) {
                console.log('✅ Local Storage يعمل بشكل صحيح');
                return true;
            } else {
                console.error('❌ Local Storage لا يعمل بشكل صحيح');
                return false;
            }
        } catch (error) {
            console.error('❌ خطأ في Local Storage:', error);
            alert('تحذير: لا يمكن حفظ الإعدادات! قد يكون المتصفح في وضع الخصوصية أو مساحة التخزين ممتلئة.');
            return false;
        }
    }

    loadSettings() {
        try {
            const savedSettings = localStorage.getItem('arabicTVSettings');
            if (savedSettings) {
                const parsedSettings = JSON.parse(savedSettings);
                this.settings = { ...this.settings, ...parsedSettings };
                console.log('تم تحميل الإعدادات المحفوظة:', this.settings);
            } else {
                console.log('لا توجد إعدادات محفوظة، سيتم استخدام الإعدادات الافتراضية');
                // Save default settings
                this.saveSettings();
            }
        } catch (error) {
            console.error('خطأ في تحميل الإعدادات:', error);
            console.log('سيتم استخدام الإعدادات الافتراضية');
        }
        this.applySettings();
    }

    saveSettings() {
        try {
            const settingsJson = JSON.stringify(this.settings);
            localStorage.setItem('arabicTVSettings', settingsJson);
            console.log('تم حفظ الإعدادات:', this.settings);
            
            // Verify save was successful
            const verifySettings = localStorage.getItem('arabicTVSettings');
            if (verifySettings === settingsJson) {
                console.log('✅ تأكيد حفظ الإعدادات بنجاح');
            } else {
                console.error('❌ فشل في حفظ الإعدادات');
            }
        } catch (error) {
            console.error('خطأ في حفظ الإعدادات:', error);
            this.notifyError('خطأ في حفظ الإعدادات! قد تكون مساحة التخزين ممتلئة.');
        }
    }

    applySettings() {
        // Apply theme first
        this.applyTheme();
        
        // Apply settings to controls with detailed error handling
        console.log('تطبيق الإعدادات:', this.settings);
        
        try {
            const autoQualityEl = document.getElementById('autoQuality');
            if (autoQualityEl) {
                autoQualityEl.checked = this.settings.autoQuality;
                console.log('جودة تلقائية:', this.settings.autoQuality);
            }
            
            const autoplayEl = document.getElementById('autoplay');
            if (autoplayEl) {
                autoplayEl.checked = this.settings.autoplay;
                console.log('تشغيل تلقائي:', this.settings.autoplay);
            }
            
            const volumeEl = document.getElementById('volume');
            if (volumeEl) {
                volumeEl.value = this.settings.volume;
                console.log('مستوى الصوت:', this.settings.volume);
            }
            
            const themeEl = document.getElementById('theme');
            if (themeEl) {
                themeEl.value = this.settings.theme;
                console.log('النمط:', this.settings.theme);
            }
            
            const customControlsEl = document.getElementById('showCustomControls');
            if (customControlsEl) {
                customControlsEl.checked = this.settings.showCustomControls;
                console.log('أزرار التحكم المخصصة:', this.settings.showCustomControls);
            }

            // Apply new customization settings
            this.applyZoomLevel();
            this.applyColorTheme();
            this.applyLayoutMode();
            this.applyFontSize();
            this.applyAnimations();
            this.applyCompactMode();
            this.applyHighContrast();
            this.applyBorderRadius();
            
            console.log('✅ تم تطبيق جميع الإعدادات بنجاح');
            
        } catch (error) {
            console.error('خطأ في تطبيق الإعدادات:', error);
        }
    }

    applyTheme() {
        // Apply theme to body
        document.body.setAttribute('data-theme', this.settings.theme);
        
        // Handle auto theme based on system preference
        if (this.settings.theme === 'auto') {
            const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
            document.body.setAttribute('data-theme', 'auto');
            console.log('نمط تلقائي:', isDarkMode ? 'داكن' : 'فاتح');
        }
        
        console.log('تم تطبيق النمط:', this.settings.theme);
    }

    applyZoomLevel() {
        const zoomLevel = this.settings.zoomLevel;
        document.documentElement.style.setProperty('--zoom-level', `${zoomLevel}%`);
        document.body.style.zoom = `${zoomLevel}%`;
        
        if (document.getElementById('zoomLevel')) {
            document.getElementById('zoomLevel').value = zoomLevel;
        }
        if (document.getElementById('zoomValue')) {
            document.getElementById('zoomValue').textContent = `${zoomLevel}%`;
        }
    }

    applyColorTheme() {
        const colorTheme = this.settings.colorTheme;
        document.body.setAttribute('data-color-theme', colorTheme);
        
        if (document.getElementById('colorTheme')) {
            document.getElementById('colorTheme').value = colorTheme;
        }
    }

    applyLayoutMode() {
        const layoutMode = this.settings.layoutMode;
        document.body.setAttribute('data-layout', layoutMode);
        
        if (document.getElementById('layoutMode')) {
            document.getElementById('layoutMode').value = layoutMode;
        }
        
        // Update grid classes
        const channelsGrid = document.getElementById('channelsGrid');
        if (channelsGrid) {
            channelsGrid.className = 'channels-grid';
            if (layoutMode === 'list') {
                channelsGrid.classList.add('list-layout');
            } else if (layoutMode === 'compact') {
                channelsGrid.classList.add('compact-layout');
            }
        }
    }

    applyFontSize() {
        const fontSize = this.settings.fontSize;
        document.body.setAttribute('data-font-size', fontSize);
        
        if (document.getElementById('fontSize')) {
            document.getElementById('fontSize').value = fontSize;
        }
    }

    applyAnimations() {
        const animationsEnabled = this.settings.animationsEnabled;
        document.body.classList.toggle('animations-disabled', !animationsEnabled);
        
        if (document.getElementById('animationsEnabled')) {
            document.getElementById('animationsEnabled').checked = animationsEnabled;
        }
    }

    applyCompactMode() {
        const compactMode = this.settings.compactMode;
        document.body.classList.toggle('compact-mode', compactMode);
        
        if (document.getElementById('compactMode')) {
            document.getElementById('compactMode').checked = compactMode;
        }
    }

    applyHighContrast() {
        const highContrast = this.settings.highContrast;
        document.body.classList.toggle('high-contrast', highContrast);
        
        if (document.getElementById('highContrast')) {
            document.getElementById('highContrast').checked = highContrast;
        }
    }

    applyBorderRadius() {
        const borderRadius = this.settings.borderRadius;
        document.body.setAttribute('data-border-radius', borderRadius);
        
        if (document.getElementById('borderRadius')) {
            document.getElementById('borderRadius').value = borderRadius;
        }
    }

    bindEvents() {

        // Search functionality
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.searchChannels(e.target.value);
        });

        // Settings controls with enhanced saving
        document.getElementById('autoQuality').addEventListener('change', (e) => {
            this.settings.autoQuality = e.target.checked;
            this.saveSettings();
            console.log('تم تغيير الجودة التلقائية إلى:', e.target.checked);
        });

        document.getElementById('autoplay').addEventListener('change', (e) => {
            this.settings.autoplay = e.target.checked;
            this.saveSettings();
            console.log('تم تغيير التشغيل التلقائي إلى:', e.target.checked);
        });

        document.getElementById('volume').addEventListener('input', (e) => {
            this.settings.volume = parseInt(e.target.value);
            this.saveSettings();
            if (this.currentChannel) {
                document.getElementById('videoPlayer').volume = e.target.value / 100;
            }
            console.log('تم تغيير مستوى الصوت إلى:', e.target.value);
        });

        document.getElementById('theme').addEventListener('change', (e) => {
            this.settings.theme = e.target.value;
            this.saveSettings();
            this.applyTheme(); // Apply theme immediately
            console.log('تم تغيير النمط إلى:', e.target.value);
        });


        // New customization controls
        const zoomLevelSlider = document.getElementById('zoomLevel');
        if (zoomLevelSlider) {
            zoomLevelSlider.addEventListener('input', (e) => {
                this.settings.zoomLevel = parseInt(e.target.value);
                this.saveSettings();
                this.applyZoomLevel();
            });
        }

        const colorThemeSelect = document.getElementById('colorTheme');
        if (colorThemeSelect) {
            colorThemeSelect.addEventListener('change', (e) => {
                this.settings.colorTheme = e.target.value;
                this.saveSettings();
                this.applyColorTheme();
            });
        }

        const layoutModeSelect = document.getElementById('layoutMode');
        if (layoutModeSelect) {
            layoutModeSelect.addEventListener('change', (e) => {
                this.settings.layoutMode = e.target.value;
                this.saveSettings();
                this.applyLayoutMode();
            });
        }

        const fontSizeSelect = document.getElementById('fontSize');
        if (fontSizeSelect) {
            fontSizeSelect.addEventListener('change', (e) => {
                this.settings.fontSize = e.target.value;
                this.saveSettings();
                this.applyFontSize();
            });
        }

        const animationsCheckbox = document.getElementById('animationsEnabled');
        if (animationsCheckbox) {
            animationsCheckbox.addEventListener('change', (e) => {
                this.settings.animationsEnabled = e.target.checked;
                this.saveSettings();
                this.applyAnimations();
            });
        }

        const compactModeCheckbox = document.getElementById('compactMode');
        if (compactModeCheckbox) {
            compactModeCheckbox.addEventListener('change', (e) => {
                this.settings.compactMode = e.target.checked;
                this.saveSettings();
                this.applyCompactMode();
            });
        }

        const highContrastCheckbox = document.getElementById('highContrast');
        if (highContrastCheckbox) {
            highContrastCheckbox.addEventListener('change', (e) => {
                this.settings.highContrast = e.target.checked;
                this.saveSettings();
                this.applyHighContrast();
            });
        }

        const borderRadiusSelect = document.getElementById('borderRadius');
        if (borderRadiusSelect) {
            borderRadiusSelect.addEventListener('change', (e) => {
                this.settings.borderRadius = e.target.value;
                this.saveSettings();
                this.applyBorderRadius();
            });
        }

        // Admin panel events
        this.bindAdminEvents();

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
                this.closeSettings();
                this.closeAdminPanel();
            }
        });
    }

    bindAdminEvents() {
        // Admin tabs
        document.querySelectorAll('.admin-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchAdminTab(e.target.dataset.tab);
            });
        });

        // Add channel form
        document.getElementById('addChannelForm').addEventListener('submit', (e) => {
            e.preventDefault();
            if (this.editingChannelId) {
                this.updateChannel(this.editingChannelId);
            } else {
                this.addChannel();
            }
        });

        // Admin search
                    document.getElementById('adminSearchInput').addEventListener('input', (e) => {
                this.filterAdminChannels(e.target.value);
            });

            // Close mobile menu on Escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.isMobileSidebarOpen) {
                    this.closeMobileMenu();
                }
                if (e.key === 'Escape' && this.isDesktopSidebarOpen) {
                    this.toggleSidebar();
                }
            });

            // Add event listeners for desktop sidebar nav tabs
            document.querySelectorAll('.sidebar-nav-tab').forEach(tab => {
                tab.addEventListener('click', () => {
                    const category = tab.dataset.category;
                    this.filterChannels(category);
                    
                    // Update active tab
                    document.querySelectorAll('.sidebar-nav-tab, .mobile-sidebar-nav-tab').forEach(t => {
                        t.classList.remove('active');
                    });
                    document.querySelectorAll(`[data-category="${category}"]`).forEach(t => {
                        t.classList.add('active');
                    });
                    
                    // Close desktop sidebar after selecting category (if open)
                    if (this.isDesktopSidebarOpen) {
                        this.toggleSidebar();
                    }
                });
            });

            // Add event listeners for sidebar action buttons
            document.querySelectorAll('.sidebar-action-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    // Close sidebar after action
                    this.toggleSidebar();
                });
            });


            // Add event listeners for mobile sidebar nav tabs
            document.querySelectorAll('.mobile-sidebar-nav-tab').forEach(tab => {
                tab.addEventListener('click', () => {
                    const category = tab.dataset.category;
                    this.filterChannels(category);
                    
                    // Update active tab
                    document.querySelectorAll('.sidebar-nav-tab, .mobile-sidebar-nav-tab').forEach(t => {
                        t.classList.remove('active');
                    });
                    document.querySelectorAll(`[data-category="${category}"]`).forEach(t => {
                        t.classList.add('active');
                    });
                    
                    // Close mobile sidebar after selecting category
                    this.closeMobileMenu();
                });
            });
    }

    renderChannels() {
        const grid = document.getElementById('channelsGrid');
        if (!grid) {
            console.error('لم يتم العثور على عنصر channelsGrid');
            return;
        }
        
        grid.innerHTML = '';
        console.log('عرض القنوات:', this.filteredChannels.length, 'قناة');

        this.filteredChannels.forEach(channel => {
            const channelCard = this.createChannelCard(channel);
            grid.appendChild(channelCard);
        });

        // Update navigation tabs first
        this.updateNavigationTabs();
        
        // Update sidebar counts after updating tabs
        this.updateSidebarCounts();
    }

    createChannelCard(channel) {
        const card = document.createElement('div');
        card.className = 'channel-card';
        card.dataset.category = channel.category;
        
        // إنشاء placeholder محسن للشعار
        const logoPlaceholder = this.createLogoPlaceholder(channel);
        
        card.innerHTML = `
            <img src="${channel.logo}" alt="${channel.name}" class="channel-logo" 
                 onerror="this.src='${logoPlaceholder}'; this.classList.add('placeholder-logo');">
            <div class="channel-info">
                <h3 class="channel-name">${channel.name}</h3>
                <div class="channel-meta">
                    <span class="channel-country">${channel.country}</span>
                    <span class="channel-category">${this.getCategoryName(channel.category)}</span>
                </div>
            </div>
            <div class="play-overlay">
                <button class="play-btn">
                    <i class="fas fa-play"></i>
                </button>
            </div>
        `;

        card.addEventListener('click', () => this.playChannel(channel));
        return card;
    }

    createLogoPlaceholder(channel) {
        // إنشاء أيقونة SVG محسنة للقناة
        const categoryIcons = {
            'news': '📰',
            'entertainment': '🎬',
            'sports': '⚽',
            'religious': '🕌',
            'music': '🎵'
        };
        
        const icon = categoryIcons[channel.category] || '📺';
        const shortName = this.getShortChannelName(channel.name);
        
        // تحديد الألوان حسب النمط الحالي
        const isLightTheme = document.body.getAttribute('data-theme') === 'light';
        const bgColors = isLightTheme 
            ? { start: '#f8fafc', end: '#3b82f6' }
            : { start: '#1a1a2e', end: '#0f3460' };
        const textColor = isLightTheme ? '#1e293b' : '#ffffff';
        const accentColor = isLightTheme ? '#3b82f6' : '#e94560';
        const secondaryColor = isLightTheme ? '#64748b' : '#b8b8b8';
        
        // إنشاء Data URL لصورة SVG مخصصة
        const svg = `
            <svg width="200" height="120" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:${bgColors.start};stop-opacity:1" />
                        <stop offset="100%" style="stop-color:${bgColors.end};stop-opacity:1" />
                    </linearGradient>
                </defs>
                <rect width="200" height="120" fill="url(#bg)" rx="8"/>
                <text x="100" y="40" font-family="Arial, sans-serif" font-size="20" 
                      text-anchor="middle" fill="${textColor}" font-weight="bold">${shortName}</text>
                <text x="100" y="68" font-family="Arial, sans-serif" font-size="24" 
                      text-anchor="middle" fill="${accentColor}">${icon}</text>
                <text x="100" y="95" font-family="Arial, sans-serif" font-size="11" 
                      text-anchor="middle" fill="${secondaryColor}">${channel.country}</text>
            </svg>
        `;
        
        return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    }

    getShortChannelName(name) {
        // اختصار اسم القناة للعرض في الأيقونة
        if (name.length <= 8) return name;
        
        const words = name.split(' ');
        if (words.length === 1) {
            return name.substring(0, 6) + '..';
        } else if (words.length === 2) {
            return words[0].substring(0, 3) + ' ' + words[1].substring(0, 3);
        } else {
            return words[0].substring(0, 3) + ' ' + words[1].substring(0, 2);
        }
    }

    createAdminLogoPlaceholder(channel) {
        // إنشاء أيقونة SVG مصغرة للوحة التحكم
        const categoryIcons = {
            'news': '📰',
            'entertainment': '🎬',
            'sports': '⚽',
            'religious': '🕌',
            'music': '🎵'
        };
        
        const icon = categoryIcons[channel.category] || '📺';
        const firstLetter = channel.name.charAt(0);
        
        // تحديد الألوان حسب النمط الحالي للوحة التحكم
        const isLightTheme = document.body.getAttribute('data-theme') === 'light';
        const adminBgColors = isLightTheme 
            ? { start: '#3b82f6', end: '#1d4ed8' }
            : { start: '#e94560', end: '#0f3460' };
        
        const svg = `
            <svg width="45" height="45" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="adminBg" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:${adminBgColors.start};stop-opacity:1" />
                        <stop offset="100%" style="stop-color:${adminBgColors.end};stop-opacity:1" />
                    </linearGradient>
                </defs>
                <rect width="45" height="45" fill="url(#adminBg)" rx="6"/>
                <text x="22.5" y="18" font-family="Arial, sans-serif" font-size="11" 
                      text-anchor="middle" fill="white" font-weight="bold">${firstLetter}</text>
                <text x="22.5" y="34" font-family="Arial, sans-serif" font-size="14" 
                      text-anchor="middle" fill="white">${icon}</text>
            </svg>
        `;
        
        return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    }

    getCategoryName(category) {
        const categories = {
            'news': 'الأخبار',
            'entertainment': 'الترفيه',
            'sports': 'الرياضة',
            'religious': 'الدينية',
            'music': 'الموسيقى',
            'movies': 'الأفلام',
            'documentary': 'الوثائقية'
        };
        return categories[category] || category;
    }

    filterChannels(category) {
        console.log('تصفية القنوات حسب الفئة:', category);
        this.currentCategory = category;
        
        // Update active tab
        const allTabs = document.querySelectorAll('.sidebar-nav-tab, .mobile-sidebar-nav-tab');
        console.log('عدد التبويبات الموجودة:', allTabs.length);
        
        allTabs.forEach(tab => {
            tab.classList.remove('active');
        });
        
        const activeTabs = document.querySelectorAll(`[data-category="${category}"]`);
        console.log('عدد التبويبات النشطة:', activeTabs.length);
        
        activeTabs.forEach(tab => {
            tab.classList.add('active');
        });

        // Use the new unified filter system
        this.applyAllFilters();
    }

    searchChannels(query) {
        // Use the new unified filter system
        this.applyAllFilters();
    }

    async playChannel(channel) {
        this.currentChannel = channel;
        this.showVideoModal(channel);
        const type = channel.type || (this.isYouTubeUrl(channel.url) ? 'youtube' : 'hls');
        await this.loadVideoStream(channel.url, type);
    }

    showVideoModal(channel) {
        const modal = document.getElementById('videoModal');
        const title = document.getElementById('channelTitle');
        
        title.textContent = channel.name;
        // Channel logo overlay is now hidden
        
        modal.classList.add('active');
        
        // Show video loading
        document.getElementById('videoLoading').style.display = 'flex';
        
        // News ticker is now disabled by default
        // if (this.settings.showNewsTicker) {
        //     this.startNewsTicker();
        // }
        
        // Time display is now disabled
        // if (channel.category === 'news') {
        //     this.showTimeDisplay();
        // }
        
        // Use default video controls
        document.getElementById('videoPlayer').controls = true;
    }

    async loadVideoStream(url, type = 'hls') {
        const video = document.getElementById('videoPlayer');
        const source = document.getElementById('videoSource');
        const loading = document.getElementById('videoLoading');

        try {
            // Check if it's a YouTube URL
            if (type === 'youtube' || this.isYouTubeUrl(url)) {
                const currentQuality = this.getCurrentQuality();
                await this.loadYouTubeVideo(url, currentQuality);
                return;
            }

            // HLS streaming
            if (Hls.isSupported()) {
                if (this.hls) {
                    this.hls.destroy();
                }

                this.hls = new Hls({
                    enableWorker: true,
                    lowLatencyMode: true,
                    backBufferLength: 90,
                    maxBufferLength: 0,
                    maxMaxBufferLength: 600,
                    maxBufferSize: 60 * 1000 * 1000,
                    maxBufferHole: 0.5,
                    highBufferWatchdogPeriod: 2,
                    nudgeOffset: 0.1,
                    nudgeMaxRetry: 3,
                    maxFragLookUpTolerance: 0.20,
                    liveSyncDurationCount: 3,
                    liveMaxLatencyDurationCount: Infinity,
                    liveDurationInfinity: true,
                    enableSoftwareAES: true,
                    manifestLoadingTimeOut: 10000,
                    manifestLoadingMaxRetry: 1,
                    manifestLoadingRetryDelay: 1000,
                    fragLoadingTimeOut: 20000,
                    fragLoadingMaxRetry: 6,
                    fragLoadingRetryDelay: 1000,
                    startFragPrefetch: true
                });

                this.hls.loadSource(url);
                this.hls.attachMedia(video);

                this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
                    loading.style.display = 'none';
                    if (this.settings.autoplay) {
                        video.play().catch(console.error);
                    }
                    
                    // Initialize quality display
                    this.updateQualityDisplayFromHLS();
                });

                this.hls.on(Hls.Events.ERROR, (event, data) => {
                    console.error('HLS Error:', data);
                    
                    // Show specific error messages
                    if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
                        this.showVideoError('خطأ في الشبكة - تحقق من اتصال الإنترنت');
                    } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
                        this.showVideoError('خطأ في تنسيق الفيديو - الرابط قد يكون غير صحيح');
                    } else if (data.details === Hls.ErrorDetails.MANIFEST_LOAD_ERROR) {
                        this.showVideoError('لا يمكن تحميل قائمة التشغيل - الرابط غير متاح');
                    } else if (data.details === Hls.ErrorDetails.MANIFEST_LOAD_TIMEOUT) {
                        this.showVideoError('انتهت مهلة تحميل قائمة التشغيل - الخادم بطيء');
                    }
                    
                    if (data.fatal) {
                        this.handleVideoError();
                    }
                });

                // Auto quality selection
                if (this.settings.autoQuality) {
                    this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
                        this.hls.startLevel = -1; // Auto quality
                    });
                }

                // Listen for level changes to update quality display
                this.hls.on(Hls.Events.LEVEL_SWITCHED, () => {
                    this.updateQualityDisplayFromHLS();
                });

            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                // Native HLS support (Safari)
                source.src = url;
                video.load();
                loading.style.display = 'none';
                
                if (this.settings.autoplay) {
                    video.play().catch(console.error);
                }
            } else {
                throw new Error('HLS not supported');
            }

            // Set volume
            video.volume = this.settings.volume / 100;

        } catch (error) {
            console.error('Error loading video:', error);
            this.handleVideoError();
        }
    }

    showVideoError(message) {
        const loading = document.getElementById('videoLoading');
        loading.innerHTML = `
            <div class="error-icon" style="font-size: 3rem; color: #e94560; margin-bottom: 1rem;">
                <i class="fas fa-exclamation-triangle"></i>
            </div>
            <p style="color: #e94560; font-size: 1.1rem; margin-bottom: 1rem;">${message}</p>
            <button onclick="app.retryVideo()" style="
                background: #e94560; 
                color: white; 
                border: none; 
                padding: 0.5rem 1rem; 
                border-radius: 5px; 
                cursor: pointer;
                font-size: 0.9rem;
            ">إعادة المحاولة</button>
        `;
    }

    handleVideoError() {
        const loading = document.getElementById('videoLoading');
        loading.innerHTML = `
            <div class="spinner" style="border-top-color: #e94560;"></div>
            <p style="color: #e94560;">خطأ في تحميل البث - جارٍ المحاولة مرة أخرى...</p>
        `;
        
        // Retry after 3 seconds
        setTimeout(() => {
            if (this.currentChannel) {
                this.loadVideoStream(this.currentChannel.url);
            }
        }, 3000);
    }

    retryVideo() {
        if (this.currentChannel) {
            const type = this.currentChannel.type || 'hls';
            this.loadVideoStream(this.currentChannel.url, type);
        }
    }

    // Detect URL type automatically
    detectUrlType() {
        const channelUrl = document.getElementById('channelUrl');
        const urlTypeIndicator = document.getElementById('urlTypeIndicator');
        const urlTypeIcon = document.getElementById('urlTypeIcon');
        const urlTypeValue = document.getElementById('urlTypeValue');
        
        const url = channelUrl.value.trim();
        
        if (!url) {
            urlTypeIndicator.style.display = 'none';
            return;
        }
        
        // Detect URL type
        let urlType = 'unknown';
        let iconClass = 'fas fa-question-circle';
        let typeText = 'غير معروف';
        let indicatorColor = '#666';
        
        if (this.isYouTubeUrl(url)) {
            urlType = 'youtube';
            iconClass = 'fab fa-youtube';
            typeText = 'يوتيوب';
            indicatorColor = '#ff0000';
        } else if (url.includes('.m3u8') || url.includes('playlist.m3u8') || url.includes('index.m3u8')) {
            urlType = 'hls';
            iconClass = 'fas fa-broadcast-tower';
            typeText = 'HLS (مباشر)';
            indicatorColor = '#00a8ff';
        } else if (url.includes('.mp4') || url.includes('.webm') || url.includes('.avi')) {
            urlType = 'video';
            iconClass = 'fas fa-video';
            typeText = 'فيديو مباشر';
            indicatorColor = '#00d2d3';
        } else if (url.includes('rtmp://') || url.includes('rtsp://')) {
            urlType = 'stream';
            iconClass = 'fas fa-satellite-dish';
            typeText = 'بث مباشر';
            indicatorColor = '#ff9ff3';
        }
        
        // Update indicator
        urlTypeIcon.className = iconClass;
        urlTypeValue.textContent = typeText;
        urlTypeIndicator.style.display = 'block';
        urlTypeIndicator.style.backgroundColor = indicatorColor + '20';
        urlTypeIndicator.style.border = '1px solid ' + indicatorColor;
        urlTypeIndicator.style.color = indicatorColor;
        
        // Store detected type for form submission
        this.detectedUrlType = urlType;
    }

    // Check if URL is a YouTube URL
    isYouTubeUrl(url) {
        const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/)|youtu\.be\/|m\.youtube\.com\/watch\?v=)/;
        return youtubeRegex.test(url);
    }

    // Extract YouTube video ID from URL
    getYouTubeVideoId(url) {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    }

    // Load YouTube video using iframe
    async loadYouTubeVideo(url, quality = 'auto') {
        const video = document.getElementById('videoPlayer');
        const loading = document.getElementById('videoLoading');
        
        try {
            const videoId = this.getYouTubeVideoId(url);
            if (!videoId) {
                throw new Error('Invalid YouTube URL');
            }

            // Hide the video element and show iframe
            video.style.display = 'none';
            
            // Create or update YouTube iframe
            let iframe = document.getElementById('youtubePlayer');
            if (!iframe) {
                iframe = document.createElement('iframe');
                iframe.id = 'youtubePlayer';
                iframe.style.width = '100%';
                iframe.style.height = '100%';
                iframe.style.border = 'none';
                iframe.allowFullscreen = true;
                iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
                
                // Insert iframe after video element
                video.parentNode.insertBefore(iframe, video.nextSibling);
            }

            // Build embed URL with quality parameters
            const embedUrl = this.buildYouTubeEmbedUrl(videoId, quality);
            iframe.src = embedUrl;
            
            // Hide loading
            loading.style.display = 'none';
            
            // Show iframe
            iframe.style.display = 'block';
            
            // Update quality display
            this.updateYouTubeQualityDisplay(quality);
            
        } catch (error) {
            console.error('Error loading YouTube video:', error);
            this.showVideoError('خطأ في تحميل فيديو اليوتيوب - تحقق من الرابط');
        }
    }

    // Build YouTube embed URL with quality parameters
    buildYouTubeEmbedUrl(videoId, quality) {
        let embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&showinfo=0&controls=1`;
        
        // Add quality parameters based on selection
        switch (quality) {
            case '1080':
                embedUrl += '&vq=hd1080';
                break;
            case '720':
                embedUrl += '&vq=hd720';
                break;
            case '480':
                embedUrl += '&vq=large';
                break;
            case '360':
                embedUrl += '&vq=medium';
                break;
            case '240':
                embedUrl += '&vq=small';
                break;
            default: // auto
                embedUrl += '&vq=auto';
                break;
        }
        
        return embedUrl;
    }

    // Update quality display for YouTube videos
    updateYouTubeQualityDisplay(quality) {
        const qualityDisplay = document.getElementById('currentQualityText');
        if (qualityDisplay) {
            const qualityTexts = {
                'auto': 'تلقائي (يوتيوب)',
                '1080': '1080p (يوتيوب)',
                '720': '720p (يوتيوب)',
                '480': '480p (يوتيوب)',
                '360': '360p (يوتيوب)',
                '240': '240p (يوتيوب)'
            };
            qualityDisplay.textContent = qualityTexts[quality] || 'تلقائي (يوتيوب)';
        }
    }

    // Get current quality setting
    getCurrentQuality() {
        const activeQuality = document.querySelector('.quality-option.active');
        return activeQuality ? activeQuality.dataset.quality : 'auto';
    }


    closeModal() {
        const modal = document.getElementById('videoModal');
        const video = document.getElementById('videoPlayer');
        const iframe = document.getElementById('youtubePlayer');
        
        // Hide modal
        modal.classList.remove('active');
        
        // Reset video display
        video.style.display = 'block';
        
        // Hide YouTube iframe if exists
        if (iframe) {
            iframe.style.display = 'none';
            iframe.src = '';
        }
        
        // Stop video playback
        if (video.pause) {
            video.pause();
        }
        
        // Destroy HLS instance if exists
        if (this.hls) {
            this.hls.destroy();
            this.hls = null;
        }
        
        // Clear video source
        video.src = '';
        
        // Ensure news ticker is stopped and hidden
        this.stopNewsTicker();
        const newsTicker = document.getElementById('newsTicker');
        if (newsTicker) {
            newsTicker.style.display = 'none';
        }
        
        // Ensure time display is hidden
        this.hideTimeDisplay();
        const timeDisplay = document.getElementById('timeDisplay');
        if (timeDisplay) {
            timeDisplay.style.display = 'none';
            timeDisplay.remove(); // Remove completely
        }
        
        this.currentChannel = null;
    }

    toggleQuality() {
        if (!this.hls) return;

        const qualityBtn = document.getElementById('qualityText');
        const levels = this.hls.levels;
        
        if (this.hls.currentLevel === -1) {
            // Switch to highest quality
            this.hls.currentLevel = levels.length - 1;
            qualityBtn.textContent = 'جودة البث';
            qualityBtn.title = `${levels[levels.length - 1].height}p`;
            this.updateQualityDisplay(levels[levels.length - 1].height.toString());
        } else {
            // Switch to auto
            this.hls.currentLevel = -1;
            qualityBtn.textContent = 'جودة البث';
            qualityBtn.title = 'تلقائي';
            this.updateQualityDisplay('auto');
        }
    }

    toggleFullscreen() {
        const video = document.getElementById('videoPlayer');
        
        if (!document.fullscreenElement) {
            video.requestFullscreen().catch(console.error);
        } else {
            document.exitFullscreen().catch(console.error);
        }
    }

    openSettings() {
        document.getElementById('settingsModal').classList.add('active');
        // Reload and apply settings when opening settings modal
        this.applySettings();
        console.log('فتح لوحة الإعدادات وإعادة تطبيق الإعدادات');
    }

    closeSettings() {
        document.getElementById('settingsModal').classList.remove('active');
    }

    openAdminPanel() {
        document.getElementById('adminModal').classList.add('active');
        this.renderAdminChannels();
        this.updateSaveOrderButton();
        this.updateChannelCategoryOptions();
    }

    closeAdminPanel() {
        document.getElementById('adminModal').classList.remove('active');
    }

    switchAdminTab(tab) {
        // Update active tab
        document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
        document.querySelector(`[data-tab="${tab}"]`).classList.add('active');

        // Show tab content
        document.querySelectorAll('.admin-tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tab}Tab`).classList.add('active');

        // Reset form when switching to add tab (unless we're editing)
        if (tab === 'add' && !this.editingChannelId) {
            this.resetAddChannelForm();
        }

        // Load categories when switching to categories tab
        if (tab === 'categories') {
            this.renderCategories();
        }
        
        // Update category options when switching to add tab
        if (tab === 'add') {
            this.updateChannelCategoryOptions();
        }
    }

    renderAdminChannels() {
        const list = document.getElementById('adminChannelsList');
        list.innerHTML = '';

        this.channels.forEach((channel, index) => {
            const item = document.createElement('div');
            item.className = 'admin-channel-item';
            item.draggable = true;
            item.dataset.channelId = channel.id;
            item.dataset.index = index;
            
            // إنشاء placeholder مصغر للوحة التحكم
            const adminPlaceholder = this.createAdminLogoPlaceholder(channel);
            
            item.innerHTML = `
                <div class="admin-channel-info">
                    <i class="fas fa-grip-vertical drag-handle"></i>
                    <img src="${channel.logo}" alt="${channel.name}" class="admin-channel-logo"
                         onerror="this.src='${adminPlaceholder}'; this.classList.add('admin-placeholder-logo');">
                    <div>
                        <h4>${channel.name}</h4>
                        <p style="color: var(--text-secondary); font-size: 0.9rem;">${this.getCategoryName(channel.category)} • ${channel.country}</p>
                    </div>
                </div>
                <div class="admin-channel-actions">
                    <div class="move-buttons">
                        <button class="move-btn" onclick="app.moveChannelUp(${index})" ${index === 0 ? 'disabled' : ''}>
                            <i class="fas fa-chevron-up"></i>
                        </button>
                        <button class="move-btn" onclick="app.moveChannelDown(${index})" ${index === this.channels.length - 1 ? 'disabled' : ''}>
                            <i class="fas fa-chevron-down"></i>
                        </button>
                    </div>
                    <button class="edit-btn" onclick="app.editChannel(${channel.id}, event)">
                        <i class="fas fa-edit"></i> تعديل
                    </button>
                    <button class="delete-btn" onclick="app.deleteChannel(${channel.id}, event)">
                        <i class="fas fa-trash"></i> حذف
                    </button>
                </div>
            `;
            
            // إضافة event listeners للسحب والإفلات
            this.addDragListeners(item);
            
            list.appendChild(item);
        });
        
        // إظهار أو إخفاء زر حفظ الترتيب
        this.updateSaveOrderButton();
    }

    filterAdminChannels(query) {
        const searchTerm = query.toLowerCase().trim();
        const items = document.querySelectorAll('.admin-channel-item');

        items.forEach(item => {
            const name = item.querySelector('h4').textContent.toLowerCase();
            const shouldShow = name.includes(searchTerm);
            item.style.display = shouldShow ? 'flex' : 'none';
        });
    }

    addChannel() {
        // Get form values
        const name = document.getElementById('channelName').value.trim();
        const url = document.getElementById('channelUrl').value.trim();
        const logo = document.getElementById('channelLogo').value.trim();
        const category = document.getElementById('channelCategory').value;
        const country = document.getElementById('channelCountry').value.trim();
        
        // Auto-detect URL type
        let type = 'hls'; // default
        if (this.detectedUrlType) {
            type = this.detectedUrlType;
        } else if (this.isYouTubeUrl(url)) {
            type = 'youtube';
        } else if (url.includes('.m3u8')) {
            type = 'hls';
        }

        // Validate required fields
        if (!name || !url || !logo || !category || !country) {
            this.notifyWarning('يرجى ملء جميع الحقول المطلوبة!');
            return;
        }

        // Check if we're editing an existing channel
        if (this.editingChannelId) {
            this.updateChannel(this.editingChannelId);
            return;
        }

        // Add new channel
        const newChannel = {
            id: Math.max(...this.channels.map(c => c.id), 0) + 1, // Generate proper unique ID
            name: name,
            url: url,
            logo: logo,
            category: category,
            country: country,
            type: type
        };

        this.channels.push(newChannel);
        this.saveChannelsToStorage();
        this.filteredChannels = [...this.channels]; // Update filtered channels too
        this.renderChannels();
        this.renderAdminChannels();
        
        this.resetAddChannelForm();
        this.showNotification('success', 'تم إضافة القناة', 'تم إضافة القناة بنجاح وحفظها!');
    }

    resetAddChannelForm() {
        // Clear editing state
        this.editingChannelId = null;
        
        // Clear all form fields manually instead of using reset()
        document.getElementById('channelName').value = '';
        document.getElementById('channelUrl').value = '';
        document.getElementById('channelLogo').value = '';
        document.getElementById('channelCategory').value = '';
        document.getElementById('channelCountry').value = '';
        
        // Hide URL type indicator
        const urlTypeIndicator = document.getElementById('urlTypeIndicator');
        if (urlTypeIndicator) {
            urlTypeIndicator.style.display = 'none';
        }
        
        // Reset detected URL type
        this.detectedUrlType = null;
        
        // Reset button text and class
        const submitBtn = document.querySelector('#addChannelForm button[type="submit"]');
        if (submitBtn) {
            submitBtn.textContent = 'إضافة القناة';
            submitBtn.className = 'add-btn';
        }
        
        // Reset form title if it exists
        const formTitle = document.querySelector('#addTab h5, #addTab .form-title');
        if (formTitle) {
            formTitle.textContent = 'إضافة قناة جديدة';
        }
        
        // Update category options to ensure latest categories are available
        this.updateChannelCategoryOptions();
    }

    editChannel(id, event) {
        // Prevent event propagation if event is provided
        if (event) {
            event.stopPropagation();
        }
        
        const channel = this.channels.find(c => c.id === id);
        if (!channel) return;

        // Set editing mode
        this.editingChannelId = id;

        // Switch to add tab and populate with channel data
        this.switchAdminTab('add');
        
        document.getElementById('channelName').value = channel.name;
        document.getElementById('channelUrl').value = channel.url;
        document.getElementById('channelLogo').value = channel.logo;
        document.getElementById('channelCategory').value = channel.category;
        document.getElementById('channelCountry').value = channel.country;
        
        // Auto-detect URL type for editing
        this.detectedUrlType = channel.type || 'hls';
        this.detectUrlType();

        // Update button text to indicate editing mode
        document.querySelector('.add-btn').textContent = 'تحديث القناة';
        
        // Show notification
        this.showNotification('success', 'تم فتح نموذج التعديل', 'يمكنك الآن تعديل بيانات القناة');
    }

    updateChannel(id) {
        const channelIndex = this.channels.findIndex(c => c.id === id);
        if (channelIndex === -1) {
            this.notifyError('لم يتم العثور على القناة المطلوبة!');
            return;
        }

        // Get form values
        const name = document.getElementById('channelName').value.trim();
        const url = document.getElementById('channelUrl').value.trim();
        const logo = document.getElementById('channelLogo').value.trim();
        const category = document.getElementById('channelCategory').value;
        const country = document.getElementById('channelCountry').value.trim();
        
        // Auto-detect URL type
        let type = 'hls'; // default
        if (this.detectedUrlType) {
            type = this.detectedUrlType;
        } else if (this.isYouTubeUrl(url)) {
            type = 'youtube';
        } else if (url.includes('.m3u8')) {
            type = 'hls';
        }

        // Validate required fields
        if (!name || !url || !logo || !category || !country) {
            this.notifyWarning('يرجى ملء جميع الحقول المطلوبة!');
            return;
        }

        // Update the channel
        this.channels[channelIndex] = {
            ...this.channels[channelIndex],
            name: name,
            url: url,
            logo: logo,
            category: category,
            country: country,
            type: type
        };

        // Save and refresh
        this.saveChannelsToStorage();
        this.filteredChannels = [...this.channels]; // Update filtered channels too
        this.renderChannels();
        this.renderAdminChannels();
        
        // Reset editing state and form
        this.resetAddChannelForm();
        
        this.showNotification('success', 'تم تحديث القناة', 'تم تحديث القناة وحفظ التغييرات بنجاح!');
        
        // Switch back to channels list tab
        this.switchAdminTab('channels');
    }

    deleteChannel(id, event) {
        // Prevent event propagation if event is provided
        if (event) {
            event.stopPropagation();
        }
        
        const channel = this.channels.find(c => c.id === id);
        if (!channel) return;
        
        if (confirm(`هل أنت متأكد من حذف قناة "${channel.name}"؟\n\nهذا الإجراء لا يمكن التراجع عنه.`)) {
            // Remove from favorites if favorited
            if (this.favorites.has(id)) {
                this.favorites.delete(id);
                this.saveFavorites();
            }
            
            // Remove from channels array
            this.channels = this.channels.filter(c => c.id !== id);
            this.filteredChannels = [...this.channels]; // Update filtered channels too
            
            // Save to storage
            this.saveChannelsToStorage();
            
            // Re-render channels
            this.renderChannels();
            this.renderAdminChannels();
            
            // Show success notification
            this.showNotification('success', 'تم حذف القناة', `تم حذف قناة "${channel.name}" بنجاح`);
        }
    }

    saveChannelsToStorage() {
        try {
            const channelsData = JSON.stringify(this.channels);
            localStorage.setItem('arabicTVChannels', channelsData);
            console.log('تم حفظ القنوات بنجاح:', this.channels.length, 'قناة');
            console.log('بيانات القنوات المحفوظة:', this.channels);
            
            // تحقق من نجاح الحفظ
            const verifyChannels = localStorage.getItem('arabicTVChannels');
            if (verifyChannels === channelsData) {
                console.log('✅ تأكيد حفظ القنوات بنجاح');
                
                // Save last modified time
                localStorage.setItem('arabicTVLastSaved', new Date().toISOString());
                
                // Auto-sync to remote if enabled
                if (this.remoteStorage.enabled && this.remoteStorage.autoSync) {
                    this.syncToRemote().catch(error => {
                        console.error('فشل في المزامنة التلقائية:', error);
                    });
                }
            } else {
                console.error('❌ فشل في حفظ القنوات');
                this.notifyError('فشل في حفظ القنوات! يرجى المحاولة مرة أخرى.');
            }
        } catch (error) {
            console.error('خطأ في حفظ القنوات:', error);
            this.notifyError('خطأ في حفظ القنوات! يرجى المحاولة مرة أخرى.');
        }
    }

    loadChannelsFromStorage() {
        try {
            const savedChannels = localStorage.getItem('arabicTVChannels');
            if (savedChannels) {
                const parsedChannels = JSON.parse(savedChannels);
                if (parsedChannels && parsedChannels.length > 0) {
                    this.channels = parsedChannels;
                    console.log('تم تحميل القنوات المحفوظة:', this.channels.length, 'قناة');
                    // تحديث عداد القنوات
                    this.updateSidebarCounts();
                    return;
                }
            }
            
            // إذا لم توجد قنوات محفوظة أو كانت فارغة، احفظ القنوات الافتراضية
            console.log('لا توجد قنوات محفوظة، سيتم حفظ القنوات الافتراضية');
            this.saveChannelsToStorage();
            // تحديث عداد القنوات
            this.updateSidebarCounts();
        
        } catch (error) {
            console.error('خطأ في تحميل القنوات المحفوظة:', error);
            console.log('سيتم استخدام القنوات الافتراضية وحفظها');
            this.saveChannelsToStorage();
            // تحديث عداد القنوات
            this.updateSidebarCounts();
        }
        
        // تحديث الترتيب الأصلي في جميع الحالات
        this.originalOrder = [...this.channels];
        this.hasOrderChanged = false;
        
        // تحديث عداد القنوات
        this.updateSidebarCounts();
    }

    saveGeneralSettings() {
        const appTitle = document.getElementById('appTitle').value;
        const maxChannels = document.getElementById('maxChannels').value;

        // Update page title
        document.title = appTitle;
        document.querySelector('.logo h1').textContent = appTitle;

        const generalSettings = {
            appTitle,
            maxChannels: parseInt(maxChannels)
        };

        localStorage.setItem('arabicTVGeneralSettings', JSON.stringify(generalSettings));
        this.notifySuccess('تم حفظ الإعدادات العامة بنجاح!');
    }

    // ===== Remote Storage Management =====
    
    loadRemoteStorageSettings() {
        try {
            const savedRemoteStorage = localStorage.getItem('arabicTVRemoteStorage');
            if (savedRemoteStorage) {
                const parsed = JSON.parse(savedRemoteStorage);
                this.remoteStorage = { ...this.remoteStorage, ...parsed };
                console.log('تم تحميل إعدادات التخزين السحابي:', this.remoteStorage);
            }
        } catch (error) {
            console.error('خطأ في تحميل إعدادات التخزين السحابي:', error);
        }
    }

    saveRemoteStorageSettings() {
        try {
            localStorage.setItem('arabicTVRemoteStorage', JSON.stringify(this.remoteStorage));
            console.log('تم حفظ إعدادات التخزين السحابي');
        } catch (error) {
            console.error('خطأ في حفظ إعدادات التخزين السحابي:', error);
        }
    }

    async syncToRemote() {
        if (!this.remoteStorage.enabled || !this.remoteStorage.repository || !this.remoteStorage.token) {
            this.notifyError('يجب تكوين إعدادات التخزين السحابي أولاً');
            return false;
        }

        try {
            this.notifyInfo('جارٍ رفع البيانات إلى المستودع...');
            
            const data = {
                channels: this.channels,
                favorites: Array.from(this.favorites),
                settings: this.settings,
                categories: this.categories,
                lastModified: new Date().toISOString(),
                version: '1.0'
            };

            const success = await this.uploadToRepository(data);
            
            if (success) {
                this.remoteStorage.lastSync = new Date().toISOString();
                this.saveRemoteStorageSettings();
                this.notifySuccess('تم رفع البيانات إلى المستودع بنجاح!');
                return true;
            } else {
                this.notifyError('فشل في رفع البيانات إلى المستودع');
                return false;
            }
        } catch (error) {
            console.error('خطأ في المزامنة إلى المستودع:', error);
            this.notifyError('خطأ في المزامنة: ' + error.message);
            return false;
        }
    }

    async syncFromRemote() {
        if (!this.remoteStorage.enabled || !this.remoteStorage.repository || !this.remoteStorage.token) {
            console.log('التخزين السحابي غير مُعدّ، تخطي المزامنة');
            return false;
        }

        try {
            this.notifyInfo('جارٍ تحميل البيانات من المستودع...');
            
            const data = await this.downloadFromRepository();
            
            if (data) {
                // Compare versions and merge data
                const shouldUpdate = this.shouldUpdateFromRemote(data);
                
                if (shouldUpdate) {
                    await this.mergeRemoteData(data);
                    this.remoteStorage.lastSync = new Date().toISOString();
                    this.saveRemoteStorageSettings();
                    this.notifySuccess('تم تحديث البيانات من المستودع!');
                    return true;
                } else {
                    console.log('البيانات المحلية أحدث من المستودع');
                    this.notifyInfo('البيانات المحلية محدثة');
                    return false;
                }
            } else {
                console.log('لم يتم العثور على بيانات في المستودع');
                this.notifyInfo('لم يتم العثور على بيانات محفوظة في المستودع');
                return false;
            }
        } catch (error) {
            console.error('خطأ في المزامنة من المستودع:', error);
            this.notifyError('خطأ في تحميل البيانات: ' + error.message);
            return false;
        }
    }

    async uploadToRepository(data) {
        const { provider, repository, token, branch, filename } = this.remoteStorage;
        
        // Validate required parameters
        if (!provider || !repository || !token || !filename) {
            throw new Error('معلومات التخزين السحابي غير مكتملة');
        }
        
        try {
            if (provider === 'github') {
                return await this.uploadToGitHub(data, repository, token, branch || 'main', filename);
            } else if (provider === 'gitlab') {
                return await this.uploadToGitLab(data, repository, token, branch || 'main', filename);
            } else {
                throw new Error('مزود التخزين غير مدعوم');
            }
        } catch (error) {
            console.error('خطأ في رفع البيانات:', error);
            throw error;
        }
    }

    async downloadFromRepository() {
        const { provider, repository, token, branch, filename } = this.remoteStorage;
        
        // Validate required parameters
        if (!provider || !repository || !token || !filename) {
            throw new Error('معلومات التخزين السحابي غير مكتملة');
        }
        
        try {
            if (provider === 'github') {
                return await this.downloadFromGitHub(repository, token, branch || 'main', filename);
            } else if (provider === 'gitlab') {
                return await this.downloadFromGitLab(repository, token, branch || 'main', filename);
            } else {
                throw new Error('مزود التخزين غير مدعوم');
            }
        } catch (error) {
            console.error('خطأ في تحميل البيانات:', error);
            throw error;
        }
    }

    async uploadToGitHub(data, repository, token, branch, filename) {
        const url = `https://api.github.com/repos/${repository}/contents/${filename}`;
        
        // First, try to get the current file SHA
        let sha = null;
        try {
            const getResponse = await fetch(url, {
                headers: {
                    'Authorization': `token ${token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            
            if (getResponse.ok) {
                const fileData = await getResponse.json();
                sha = fileData.sha;
            }
        } catch (error) {
            console.log('الملف غير موجود، سيتم إنشاؤه');
        }

        const content = btoa(unescape(encodeURIComponent(JSON.stringify(data, null, 2))));
        
        const body = {
            message: `تحديث قنوات التلفزيون - ${new Date().toLocaleString('ar')}`,
            content: content,
            branch: branch
        };

        if (sha) {
            body.sha = sha;
        }

        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`GitHub API Error: ${response.status} - ${error}`);
        }

        return true;
    }

    async downloadFromGitHub(repository, token, branch, filename) {
        const url = `https://api.github.com/repos/${repository}/contents/${filename}?ref=${branch}`;
        
        const response = await fetch(url, {
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        if (response.status === 404) {
            return null; // File doesn't exist
        }

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`GitHub API Error: ${response.status} - ${error}`);
        }

        const fileData = await response.json();
        const content = decodeURIComponent(escape(atob(fileData.content)));
        return JSON.parse(content);
    }

    async uploadToGitLab(data, repository, token, branch, filename) {
        const encodedPath = encodeURIComponent(filename);
        const url = `https://gitlab.com/api/v4/projects/${encodeURIComponent(repository)}/repository/files/${encodedPath}`;
        
        const content = JSON.stringify(data, null, 2);
        
        // Try to update first
        try {
            const updateResponse = await fetch(url, {
                method: 'PUT',
                headers: {
                    'PRIVATE-TOKEN': token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    branch: branch,
                    content: content,
                    commit_message: `تحديث قنوات التلفزيون - ${new Date().toLocaleString('ar')}`
                })
            });

            if (updateResponse.ok) {
                return true;
            }
        } catch (error) {
            console.log('فشل التحديث، جارٍ المحاولة لإنشاء ملف جديد');
        }

        // If update failed, try to create
        const createResponse = await fetch(url, {
            method: 'POST',
            headers: {
                'PRIVATE-TOKEN': token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                branch: branch,
                content: content,
                commit_message: `إنشاء ملف قنوات التلفزيون - ${new Date().toLocaleString('ar')}`
            })
        });

        if (!createResponse.ok) {
            const error = await createResponse.text();
            throw new Error(`GitLab API Error: ${createResponse.status} - ${error}`);
        }

        return true;
    }

    async downloadFromGitLab(repository, token, branch, filename) {
        const encodedPath = encodeURIComponent(filename);
        const url = `https://gitlab.com/api/v4/projects/${encodeURIComponent(repository)}/repository/files/${encodedPath}?ref=${branch}`;
        
        const response = await fetch(url, {
            headers: {
                'PRIVATE-TOKEN': token
            }
        });

        if (response.status === 404) {
            return null; // File doesn't exist
        }

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`GitLab API Error: ${response.status} - ${error}`);
        }

        const fileData = await response.json();
        const content = decodeURIComponent(escape(atob(fileData.content)));
        return JSON.parse(content);
    }

    shouldUpdateFromRemote(remoteData) {
        if (!remoteData.lastModified) {
            return true; // No timestamp, assume we should update
        }

        const remoteTime = new Date(remoteData.lastModified);
        const localTime = this.remoteStorage.lastSync ? new Date(this.remoteStorage.lastSync) : new Date(0);
        
        return remoteTime > localTime;
    }

    async mergeRemoteData(remoteData) {
        // Check for conflicts
        const hasConflicts = await this.detectConflicts(remoteData);
        
        if (hasConflicts) {
            return await this.resolveConflicts(remoteData);
        }

        // Backup current data
        const backup = {
            channels: [...this.channels],
            favorites: new Set(this.favorites),
            settings: { ...this.settings }
        };

        try {
            // Update channels
            if (remoteData.channels && Array.isArray(remoteData.channels)) {
                this.channels = remoteData.channels;
                this.filteredChannels = [...this.channels];
                this.saveChannelsToStorage();
            }

            // Update favorites
            if (remoteData.favorites && Array.isArray(remoteData.favorites)) {
                this.favorites = new Set(remoteData.favorites);
                this.saveFavorites();
            }

            // Update settings
            if (remoteData.settings && typeof remoteData.settings === 'object') {
                this.settings = { ...this.settings, ...remoteData.settings };
                this.saveSettings();
                this.applySettings();
            }

            // Update categories
            if (remoteData.categories && Array.isArray(remoteData.categories)) {
                this.categories = remoteData.categories;
            }

            // Re-render everything
            this.renderChannels();
            this.renderAdminChannels();
            this.updateFavoritesCount();
            
        } catch (error) {
            console.error('خطأ في دمج البيانات، استعادة النسخة الاحتياطية:', error);
            
            // Restore backup
            this.channels = backup.channels;
            this.favorites = backup.favorites;
            this.settings = backup.settings;
            
            throw error;
        }
    }

    async detectConflicts(remoteData) {
        // Check if there are significant differences
        const localChannelsCount = this.channels.length;
        const remoteChannelsCount = remoteData.channels ? remoteData.channels.length : 0;
        
        // Consider it a conflict if:
        // 1. Channel counts differ significantly (more than 10% difference)
        // 2. Both local and remote have been modified recently
        const countDifference = Math.abs(localChannelsCount - remoteChannelsCount);
        const significantDifference = countDifference > Math.max(localChannelsCount, remoteChannelsCount) * 0.1;
        
        const localLastModified = this.getLocalLastModified();
        const remoteLastModified = new Date(remoteData.lastModified || 0);
        const timeDifference = Math.abs(localLastModified - remoteLastModified);
        
        // Consider conflict if both were modified within the last hour and have significant differences
        return significantDifference && timeDifference < 3600000; // 1 hour in milliseconds
    }

    getLocalLastModified() {
        // Get the last modified time from localStorage or current time
        const lastSaved = localStorage.getItem('arabicTVLastSaved');
        return lastSaved ? new Date(lastSaved) : new Date();
    }

    async resolveConflicts(remoteData) {
        return new Promise((resolve) => {
            const conflictModal = this.createConflictResolutionModal(remoteData);
            document.body.appendChild(conflictModal);
            
            conflictModal.querySelector('.use-local-btn').addEventListener('click', () => {
                this.notifyInfo('تم الاحتفاظ بالبيانات المحلية');
                document.body.removeChild(conflictModal);
                resolve(false); // Don't merge
            });
            
            conflictModal.querySelector('.use-remote-btn').addEventListener('click', async () => {
                try {
                    await this.forceOverwriteWithRemote(remoteData);
                    this.notifySuccess('تم استخدام البيانات السحابية');
                    document.body.removeChild(conflictModal);
                    resolve(true);
                } catch (error) {
                    this.notifyError('فشل في تطبيق البيانات السحابية');
                    document.body.removeChild(conflictModal);
                    resolve(false);
                }
            });
            
            conflictModal.querySelector('.merge-btn').addEventListener('click', async () => {
                try {
                    await this.smartMerge(remoteData);
                    this.notifySuccess('تم دمج البيانات بذكاء');
                    document.body.removeChild(conflictModal);
                    resolve(true);
                } catch (error) {
                    this.notifyError('فشل في دمج البيانات');
                    document.body.removeChild(conflictModal);
                    resolve(false);
                }
            });
        });
    }

    createConflictResolutionModal(remoteData) {
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content conflict-resolution-modal">
                <div class="modal-header">
                    <h3>⚠️ تضارب في البيانات</h3>
                </div>
                <div class="conflict-details">
                    <p>تم اكتشاف تضارب بين البيانات المحلية والبيانات السحابية. يرجى اختيار كيفية التعامل مع هذا التضارب:</p>
                    
                    <div class="conflict-comparison">
                        <div class="local-data">
                            <h4>البيانات المحلية</h4>
                            <p>عدد القنوات: <strong>${this.channels.length}</strong></p>
                            <p>عدد المفضلة: <strong>${this.favorites.size}</strong></p>
                            <p>آخر تعديل: <strong>${this.getLocalLastModified().toLocaleString('ar')}</strong></p>
                        </div>
                        
                        <div class="remote-data">
                            <h4>البيانات السحابية</h4>
                            <p>عدد القنوات: <strong>${remoteData.channels ? remoteData.channels.length : 0}</strong></p>
                            <p>عدد المفضلة: <strong>${remoteData.favorites ? remoteData.favorites.length : 0}</strong></p>
                            <p>آخر تعديل: <strong>${new Date(remoteData.lastModified || 0).toLocaleString('ar')}</strong></p>
                        </div>
                    </div>
                    
                    <div class="conflict-actions">
                        <button class="conflict-btn use-local-btn">
                            <i class="fas fa-laptop"></i>
                            استخدام البيانات المحلية
                        </button>
                        <button class="conflict-btn use-remote-btn">
                            <i class="fas fa-cloud"></i>
                            استخدام البيانات السحابية
                        </button>
                        <button class="conflict-btn merge-btn">
                            <i class="fas fa-code-branch"></i>
                            دمج ذكي للبيانات
                        </button>
                    </div>
                </div>
            </div>
            <div class="modal-overlay"></div>
        `;
        return modal;
    }

    async forceOverwriteWithRemote(remoteData) {
        // Simply overwrite everything with remote data
        if (remoteData.channels && Array.isArray(remoteData.channels)) {
            this.channels = remoteData.channels;
            this.filteredChannels = [...this.channels];
            this.saveChannelsToStorage();
        }

        if (remoteData.favorites && Array.isArray(remoteData.favorites)) {
            this.favorites = new Set(remoteData.favorites);
            this.saveFavorites();
        }

        if (remoteData.settings && typeof remoteData.settings === 'object') {
            this.settings = { ...this.settings, ...remoteData.settings };
            this.saveSettings();
            this.applySettings();
        }

        if (remoteData.categories && Array.isArray(remoteData.categories)) {
            this.categories = remoteData.categories;
        }

        this.renderChannels();
        this.renderAdminChannels();
        this.updateFavoritesCount();
    }

    async smartMerge(remoteData) {
        // Smart merge logic
        const mergedChannels = this.mergeChannels(this.channels, remoteData.channels || []);
        const mergedFavorites = this.mergeFavorites(this.favorites, new Set(remoteData.favorites || []));
        const mergedSettings = { ...this.settings, ...remoteData.settings };

        this.channels = mergedChannels;
        this.filteredChannels = [...this.channels];
        this.favorites = mergedFavorites;
        this.settings = mergedSettings;

        if (remoteData.categories && Array.isArray(remoteData.categories)) {
            this.categories = this.mergeCategories(this.categories, remoteData.categories);
        }

        this.saveChannelsToStorage();
        this.saveFavorites();
        this.saveSettings();
        this.applySettings();
        this.renderChannels();
        this.renderAdminChannels();
        this.updateFavoritesCount();
    }

    mergeChannels(localChannels, remoteChannels) {
        const merged = [...localChannels];
        const localIds = new Set(localChannels.map(ch => ch.id));

        // Add remote channels that don't exist locally
        remoteChannels.forEach(remoteChannel => {
            if (!localIds.has(remoteChannel.id)) {
                merged.push(remoteChannel);
            }
        });

        return merged;
    }

    mergeFavorites(localFavorites, remoteFavorites) {
        // Combine all favorites
        return new Set([...localFavorites, ...remoteFavorites]);
    }

    mergeCategories(localCategories, remoteCategories) {
        const merged = [...localCategories];
        const localKeys = new Set(localCategories.map(cat => cat.key));

        remoteCategories.forEach(remoteCategory => {
            if (!localKeys.has(remoteCategory.key)) {
                merged.push(remoteCategory);
            }
        });

        return merged;
    }

    async testConnection() {
        const { provider, repository, token } = this.remoteStorage;
        
        if (!repository || !token) {
            this.notifyError('يرجى ملء جميع الحقول المطلوبة');
            return false;
        }

        try {
            let url;
            let headers;

            if (provider === 'github') {
                url = `https://api.github.com/repos/${repository}`;
                headers = {
                    'Authorization': `token ${token}`,
                    'Accept': 'application/vnd.github.v3+json'
                };
            } else if (provider === 'gitlab') {
                url = `https://gitlab.com/api/v4/projects/${encodeURIComponent(repository)}`;
                headers = {
                    'PRIVATE-TOKEN': token
                };
            }

            const response = await fetch(url, { headers });
            
            if (response.ok) {
                this.notifySuccess('تم الاتصال بالمستودع بنجاح!');
                return true;
            } else {
                this.notifyError(`فشل الاتصال: ${response.status} - ${response.statusText}`);
                return false;
            }
        } catch (error) {
            console.error('خطأ في اختبار الاتصال:', error);
            this.notifyError('خطأ في الاتصال: ' + error.message);
            return false;
        }
    }

    resetCustomizations() {
        // Reset customization settings to defaults
        this.settings.zoomLevel = 100;
        this.settings.colorTheme = 'default';
        this.settings.layoutMode = 'compact';
        this.settings.fontSize = 'small';
        this.settings.animationsEnabled = true;
        this.settings.compactMode = true;
        this.settings.highContrast = false;
        this.settings.borderRadius = 'rounded';
        
        // Save and apply
        this.saveSettings();
        this.applySettings();
        
        this.notifySuccess('تم إعادة تعيين جميع التخصيصات!');
    }

    // Remote Storage UI Management
    bindRemoteStorageEvents() {
        // Enable/disable remote storage
        const enableRemoteStorageCheckbox = document.getElementById('enableRemoteStorage');
        if (enableRemoteStorageCheckbox) {
            enableRemoteStorageCheckbox.addEventListener('change', (e) => {
                this.remoteStorage.enabled = e.target.checked;
                this.toggleRemoteStorageConfig(e.target.checked);
                this.saveRemoteStorageSettings();
                this.updateSyncStatus();
            });
        }

        // Provider selection
        const storageProviderSelect = document.getElementById('storageProvider');
        if (storageProviderSelect) {
            storageProviderSelect.addEventListener('change', (e) => {
                this.remoteStorage.provider = e.target.value;
                this.saveRemoteStorageSettings();
            });
        }

        // Repository URL
        const repositoryUrlInput = document.getElementById('repositoryUrl');
        if (repositoryUrlInput) {
            repositoryUrlInput.addEventListener('blur', (e) => {
                this.remoteStorage.repository = e.target.value.trim();
                this.saveRemoteStorageSettings();
            });
        }

        // Access Token
        const accessTokenInput = document.getElementById('accessToken');
        if (accessTokenInput) {
            accessTokenInput.addEventListener('blur', (e) => {
                this.remoteStorage.token = e.target.value.trim();
                this.saveRemoteStorageSettings();
            });
        }

        // Branch Name
        const branchNameInput = document.getElementById('branchName');
        if (branchNameInput) {
            branchNameInput.addEventListener('blur', (e) => {
                this.remoteStorage.branch = e.target.value.trim() || 'main';
                this.saveRemoteStorageSettings();
            });
        }

        // Auto Sync
        const autoSyncCheckbox = document.getElementById('autoSync');
        if (autoSyncCheckbox) {
            autoSyncCheckbox.addEventListener('change', (e) => {
                this.remoteStorage.autoSync = e.target.checked;
                this.saveRemoteStorageSettings();
            });
        }

        // Load existing settings
        this.loadRemoteStorageUI();
    }

    loadRemoteStorageUI() {
        const enableCheckbox = document.getElementById('enableRemoteStorage');
        const providerSelect = document.getElementById('storageProvider');
        const repositoryInput = document.getElementById('repositoryUrl');
        const tokenInput = document.getElementById('accessToken');
        const branchInput = document.getElementById('branchName');
        const autoSyncCheckbox = document.getElementById('autoSync');

        if (enableCheckbox) {
            enableCheckbox.checked = this.remoteStorage.enabled;
            this.toggleRemoteStorageConfig(this.remoteStorage.enabled);
        }

        if (providerSelect) {
            providerSelect.value = this.remoteStorage.provider;
        }

        if (repositoryInput) {
            repositoryInput.value = this.remoteStorage.repository;
        }

        if (tokenInput) {
            tokenInput.value = this.remoteStorage.token;
        }

        if (branchInput) {
            branchInput.value = this.remoteStorage.branch;
        }

        if (autoSyncCheckbox) {
            autoSyncCheckbox.checked = this.remoteStorage.autoSync;
        }

        this.updateSyncStatus();
    }

    toggleRemoteStorageConfig(enabled) {
        const configDiv = document.getElementById('remoteStorageConfig');
        if (configDiv) {
            configDiv.style.display = enabled ? 'block' : 'none';
        }
    }

    updateSyncStatus() {
        const syncStatusText = document.getElementById('syncStatusText');
        const lastSyncTime = document.getElementById('lastSyncTime');

        if (syncStatusText) {
            if (this.remoteStorage.enabled) {
                if (this.remoteStorage.repository && this.remoteStorage.token) {
                    syncStatusText.textContent = 'جاهز للمزامنة';
                    syncStatusText.style.color = 'var(--highlight-color)';
                } else {
                    syncStatusText.textContent = 'يتطلب إعداد';
                    syncStatusText.style.color = '#f59e0b';
                }
            } else {
                syncStatusText.textContent = 'معطل';
                syncStatusText.style.color = 'var(--text-secondary)';
            }
        }

        if (lastSyncTime) {
            if (this.remoteStorage.lastSync) {
                const syncDate = new Date(this.remoteStorage.lastSync);
                lastSyncTime.textContent = syncDate.toLocaleString('ar');
            } else {
                lastSyncTime.textContent = 'لم يتم';
            }
        }
    }

    // ===== Setup Wizard Functions =====
    
    openRepositoryCreation(provider) {
        let url;
        if (provider === 'github') {
            url = 'https://github.com/new';
        } else if (provider === 'gitlab') {
            url = 'https://gitlab.com/projects/new';
        }
        
        if (url) {
            window.open(url, '_blank');
            this.notifyInfo(`تم فتح صفحة إنشاء مستودع جديد على ${provider === 'github' ? 'GitHub' : 'GitLab'}`);
            
            // Mark step as completed and move to next
            this.markStepCompleted(1);
            this.activateStep(2);
        }
    }

    openTokenCreation() {
        const provider = document.getElementById('storageProvider')?.value || 'github';
        let url;
        
        if (provider === 'github') {
            url = 'https://github.com/settings/tokens/new';
        } else if (provider === 'gitlab') {
            url = 'https://gitlab.com/-/profile/personal_access_tokens';
        }
        
        if (url) {
            window.open(url, '_blank');
            this.notifyInfo(`تم فتح صفحة إنشاء رمز الوصول على ${provider === 'github' ? 'GitHub' : 'GitLab'}`);
            
            // Mark step as completed and move to next
            this.markStepCompleted(2);
            this.activateStep(3);
        }
    }

    showAdvancedConfig() {
        const quickSetupSection = document.querySelector('.quick-setup-section');
        const advancedConfigSection = document.getElementById('advancedConfigSection');
        
        if (quickSetupSection && advancedConfigSection) {
            quickSetupSection.style.display = 'none';
            advancedConfigSection.style.display = 'block';
            
            // Enable remote storage checkbox
            const enableCheckbox = document.getElementById('enableRemoteStorage');
            if (enableCheckbox) {
                enableCheckbox.checked = true;
                this.remoteStorage.enabled = true;
                this.toggleRemoteStorageConfig(true);
                this.saveRemoteStorageSettings();
            }
            
            this.notifyInfo('تم فتح الإعدادات المتقدمة');
        }
    }

    showSimpleConfig() {
        const quickSetupSection = document.querySelector('.quick-setup-section');
        const advancedConfigSection = document.getElementById('advancedConfigSection');
        
        if (quickSetupSection && advancedConfigSection) {
            quickSetupSection.style.display = 'block';
            advancedConfigSection.style.display = 'none';
        }
    }

    showSetupHelp() {
        const modal = document.getElementById('setupHelpModal');
        if (modal) {
            modal.style.display = 'flex';
            
            // Bind help tab events
            this.bindHelpTabEvents();
        }
    }

    bindHelpTabEvents() {
        const helpTabs = document.querySelectorAll('.help-tab');
        const helpContents = document.querySelectorAll('.help-tab-content');
        
        helpTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetTab = tab.dataset.tab;
                
                // Remove active class from all tabs and contents
                helpTabs.forEach(t => t.classList.remove('active'));
                helpContents.forEach(c => c.classList.remove('active'));
                
                // Add active class to clicked tab and corresponding content
                tab.classList.add('active');
                const targetContent = document.getElementById(`${targetTab}Help`);
                if (targetContent) {
                    targetContent.classList.add('active');
                }
            });
        });
    }

    markStepCompleted(stepNumber) {
        const step = document.querySelector(`[data-step="${stepNumber}"]`);
        if (step) {
            step.classList.add('completed');
            step.classList.remove('active');
            
            // Add checkmark
            const stepNumberEl = step.querySelector('.step-number');
            if (stepNumberEl) {
                stepNumberEl.innerHTML = '<i class="fas fa-check"></i>';
                stepNumberEl.style.background = '#10b981';
            }
        }
    }

    activateStep(stepNumber) {
        const step = document.querySelector(`[data-step="${stepNumber}"]`);
        if (step) {
            step.classList.add('active');
        }
    }

    // Enhanced error handling for beginners
    async testConnection() {
        if (!this.remoteStorage.repository || !this.remoteStorage.token) {
            this.notifyError('يرجى إدخال رابط المستودع ورمز الوصول أولاً');
            return;
        }

        try {
            this.notifyInfo('جاري اختبار الاتصال...');
            
            // Test by trying to fetch repository info
            const testData = await this.downloadFromRepository();
            
            if (testData) {
                this.notifySuccess('تم اختبار الاتصال بنجاح! يمكنك الآن المزامنة');
                this.updateSyncStatus();
            } else {
                this.notifyError('فشل في الاتصال. تحقق من البيانات المدخلة');
            }
        } catch (error) {
            console.error('Connection test failed:', error);
            
            // Provide user-friendly error messages
            let errorMessage = 'فشل في الاتصال. ';
            
            if (error.message.includes('401') || error.message.includes('403')) {
                errorMessage += 'رمز الوصول غير صحيح أو منتهي الصلاحية';
            } else if (error.message.includes('404')) {
                errorMessage += 'المستودع غير موجود أو غير متاح';
            } else if (error.message.includes('network')) {
                errorMessage += 'مشكلة في الاتصال بالإنترنت';
            } else {
                errorMessage += 'تحقق من صحة البيانات المدخلة';
            }
            
            this.notifyError(errorMessage);
        }
    }

    // Enhanced manual sync with better error handling
    async manualSync() {
        if (!this.remoteStorage.enabled) {
            this.notifyError('يرجى تفعيل التخزين السحابي أولاً');
            return;
        }

        if (!this.remoteStorage.repository || !this.remoteStorage.token) {
            this.notifyError('يرجى إدخال رابط المستودع ورمز الوصول أولاً');
            return;
        }

        try {
            this.notifyInfo('جاري المزامنة...');
            
            // First try to sync from remote
            await this.syncFromRemote();
            
            // Then sync to remote
            await this.syncToRemote();
            
            this.notifySuccess('تمت المزامنة بنجاح!');
            this.updateSyncStatus();
            
        } catch (error) {
            console.error('Manual sync failed:', error);
            
            let errorMessage = 'فشلت المزامنة. ';
            
            if (error.message.includes('401') || error.message.includes('403')) {
                errorMessage += 'رمز الوصول غير صحيح';
            } else if (error.message.includes('404')) {
                errorMessage += 'المستودع غير موجود';
            } else if (error.message.includes('network')) {
                errorMessage += 'مشكلة في الاتصال';
            } else {
                errorMessage += 'حدث خطأ غير متوقع';
            }
            
            this.notifyError(errorMessage);
        }
    }

    // ===== Auto Detection Functions =====
    
    showAutoDetect() {
        const modal = document.getElementById('autoDetectModal');
        if (modal) {
            modal.style.display = 'flex';
            
            // Reset form
            document.getElementById('detectProvider').value = 'github';
            document.getElementById('detectUsername').value = '';
            document.getElementById('detectToken').value = '';
            
            // Hide results and loading
            document.getElementById('detectResults').style.display = 'none';
            document.getElementById('detectLoading').style.display = 'none';
        }
    }

    async detectRepositories() {
        const provider = document.getElementById('detectProvider').value;
        const username = document.getElementById('detectUsername').value.trim();
        const token = document.getElementById('detectToken').value.trim();
        
        if (!username) {
            this.notifyError('يرجى إدخال اسم المستخدم');
            return;
        }
        
        const loadingEl = document.getElementById('detectLoading');
        const resultsEl = document.getElementById('detectResults');
        const repositoriesListEl = document.getElementById('repositoriesList');
        
        try {
            // Show loading
            loadingEl.style.display = 'block';
            resultsEl.style.display = 'none';
            
            let repositories = [];
            
            if (provider === 'github') {
                repositories = await this.fetchGitHubRepositories(username, token);
            } else if (provider === 'gitlab') {
                repositories = await this.fetchGitLabRepositories(username, token);
            }
            
            // Hide loading
            loadingEl.style.display = 'none';
            
            if (repositories.length === 0) {
                this.notifyInfo('لم يتم العثور على أي مستودعات');
                return;
            }
            
            // Display results
            this.displayRepositories(repositories, provider);
            resultsEl.style.display = 'block';
            
            this.notifySuccess(`تم العثور على ${repositories.length} مستودع`);
            
        } catch (error) {
            console.error('Repository detection failed:', error);
            
            loadingEl.style.display = 'none';
            
            let errorMessage = 'فشل في البحث عن المستودعات. ';
            
            if (error.message.includes('401') || error.message.includes('403')) {
                errorMessage += 'رمز الوصول غير صحيح أو منتهي الصلاحية';
            } else if (error.message.includes('404')) {
                errorMessage += 'اسم المستخدم غير موجود';
            } else if (error.message.includes('network')) {
                errorMessage += 'مشكلة في الاتصال بالإنترنت';
            } else {
                errorMessage += 'حدث خطأ غير متوقع';
            }
            
            this.notifyError(errorMessage);
        }
    }

    async fetchGitHubRepositories(username, token) {
        const url = `https://api.github.com/users/${username}/repos?sort=updated&per_page=50`;
        const headers = {
            'Accept': 'application/vnd.github.v3+json'
        };
        
        if (token) {
            headers['Authorization'] = `token ${token}`;
        }
        
        const response = await fetch(url, { headers });
        
        if (!response.ok) {
            throw new Error(`GitHub API Error: ${response.status}`);
        }
        
        const repos = await response.json();
        
        return repos.map(repo => ({
            name: repo.name,
            fullName: repo.full_name,
            description: repo.description || 'لا يوجد وصف',
            visibility: repo.private ? 'private' : 'public',
            updatedAt: repo.updated_at,
            url: repo.html_url
        }));
    }

    async fetchGitLabRepositories(username, token) {
        const url = `https://gitlab.com/api/v4/users/${username}/projects?order_by=last_activity_at&per_page=50`;
        const headers = {
            'Accept': 'application/json'
        };
        
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        const response = await fetch(url, { headers });
        
        if (!response.ok) {
            throw new Error(`GitLab API Error: ${response.status}`);
        }
        
        const repos = await response.json();
        
        return repos.map(repo => ({
            name: repo.name,
            fullName: repo.path_with_namespace,
            description: repo.description || 'لا يوجد وصف',
            visibility: repo.visibility,
            updatedAt: repo.last_activity_at,
            url: repo.web_url
        }));
    }

    displayRepositories(repositories, provider) {
        const repositoriesListEl = document.getElementById('repositoriesList');
        
        repositoriesListEl.innerHTML = repositories.map(repo => `
            <div class="repository-item">
                <div class="repository-info">
                    <div class="repository-name">${repo.name}</div>
                    <div class="repository-description">${repo.description}</div>
                </div>
                <div class="repository-visibility ${repo.visibility}">
                    ${repo.visibility === 'public' ? 'عام' : 'خاص'}
                </div>
                <button class="use-repository-btn" onclick="app.useRepository('${repo.fullName}', '${provider}')">
                    <i class="fas fa-check"></i>
                    استخدام
                </button>
            </div>
        `).join('');
    }

    useRepository(repositoryName, provider) {
        // Set the provider
        const providerSelect = document.getElementById('storageProvider');
        if (providerSelect) {
            providerSelect.value = provider;
            this.remoteStorage.provider = provider;
        }
        
        // Set the repository
        const repositoryInput = document.getElementById('repositoryUrl');
        if (repositoryInput) {
            repositoryInput.value = repositoryName;
            this.remoteStorage.repository = repositoryName;
        }
        
        // Save settings
        this.saveRemoteStorageSettings();
        
        // Close modal
        closeAutoDetect();
        
        // Show advanced config
        this.showAdvancedConfig();
        
        this.notifySuccess(`تم تحديد المستودع: ${repositoryName}`);
    }

    // ===== Smart Repository & Token Functions =====
    
    async fetchUserRepositories() {
        const repositoryInput = document.getElementById('repositoryUrl');
        const tokenInput = document.getElementById('accessToken');
        const provider = document.getElementById('storageProvider')?.value || 'github';
        
        if (!repositoryInput.value.trim()) {
            this.notifyError('يرجى إدخال اسم المستخدم أولاً (مثل: username)');
            return;
        }
        
        const username = repositoryInput.value.trim().split('/')[0]; // Extract username from input
        const token = tokenInput.value.trim();
        
        if (!token) {
            this.notifyError('يرجى إدخال رمز الوصول أولاً للوصول للمستودعات الخاصة');
            return;
        }
        
        try {
            this.notifyInfo('جاري البحث عن المستودعات...');
            
            let repositories = [];
            if (provider === 'github') {
                repositories = await this.fetchGitHubRepositories(username, token);
            } else if (provider === 'gitlab') {
                repositories = await this.fetchGitLabRepositories(username, token);
            }
            
            if (repositories.length === 0) {
                this.notifyInfo('لم يتم العثور على أي مستودعات');
                return;
            }
            
            this.displayRepositorySuggestions(repositories);
            this.notifySuccess(`تم العثور على ${repositories.length} مستودع`);
            
        } catch (error) {
            console.error('Repository fetch failed:', error);
            this.notifyError('فشل في جلب المستودعات. تحقق من اسم المستخدم ورمز الوصول');
        }
    }

    displayRepositorySuggestions(repositories) {
        const suggestionsContainer = document.getElementById('repoSuggestions');
        
        if (repositories.length === 0) {
            suggestionsContainer.style.display = 'none';
            return;
        }
        
        suggestionsContainer.innerHTML = repositories.map(repo => `
            <div class="repo-suggestion-item" onclick="app.selectRepository('${repo.fullName}')">
                <div class="repo-suggestion-info">
                    <div class="repo-suggestion-name">${repo.name}</div>
                    <div class="repo-suggestion-description">${repo.description}</div>
                </div>
                <div class="repo-suggestion-visibility ${repo.visibility}">
                    ${repo.visibility === 'public' ? 'عام' : 'خاص'}
                </div>
            </div>
        `).join('');
        
        suggestionsContainer.style.display = 'block';
    }

    selectRepository(repositoryName) {
        const repositoryInput = document.getElementById('repositoryUrl');
        const suggestionsContainer = document.getElementById('repoSuggestions');
        
        repositoryInput.value = repositoryName;
        suggestionsContainer.style.display = 'none';
        
        this.remoteStorage.repository = repositoryName;
        this.saveRemoteStorageSettings();
        
        this.notifySuccess(`تم تحديد المستودع: ${repositoryName}`);
    }

    async validateToken() {
        const tokenInput = document.getElementById('accessToken');
        const provider = document.getElementById('storageProvider')?.value || 'github';
        const tokenStatus = document.getElementById('tokenStatus');
        
        if (!tokenInput.value.trim()) {
            this.notifyError('يرجى إدخال رمز الوصول أولاً');
            return;
        }
        
        const token = tokenInput.value.trim();
        
        try {
            // Show validating status
            tokenStatus.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري التحقق من الرمز...';
            tokenStatus.className = 'token-status validating';
            tokenStatus.style.display = 'flex';
            
            let isValid = false;
            let userInfo = null;
            
            if (provider === 'github') {
                const response = await fetch('https://api.github.com/user', {
                    headers: {
                        'Authorization': `token ${token}`,
                        'Accept': 'application/vnd.github.v3+json'
                    }
                });
                
                if (response.ok) {
                    userInfo = await response.json();
                    isValid = true;
                }
            } else if (provider === 'gitlab') {
                const response = await fetch('https://gitlab.com/api/v4/user', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    userInfo = await response.json();
                    isValid = true;
                }
            }
            
            if (isValid && userInfo) {
                tokenStatus.innerHTML = `<i class="fas fa-check-circle"></i> الرمز صحيح - المستخدم: ${userInfo.login || userInfo.username}`;
                tokenStatus.className = 'token-status valid';
                
                this.remoteStorage.token = token;
                this.saveRemoteStorageSettings();
                
                this.notifySuccess('رمز الوصول صحيح!');
            } else {
                tokenStatus.innerHTML = '<i class="fas fa-times-circle"></i> الرمز غير صحيح أو منتهي الصلاحية';
                tokenStatus.className = 'token-status invalid';
                this.notifyError('رمز الوصول غير صحيح');
            }
            
        } catch (error) {
            console.error('Token validation failed:', error);
            tokenStatus.innerHTML = '<i class="fas fa-times-circle"></i> فشل في التحقق من الرمز';
            tokenStatus.className = 'token-status invalid';
            this.notifyError('فشل في التحقق من رمز الوصول');
        }
    }

    toggleTokenVisibility() {
        const tokenInput = document.getElementById('accessToken');
        const toggleBtn = document.querySelector('.toggle-token-visibility i');
        
        if (tokenInput.type === 'password') {
            tokenInput.type = 'text';
            toggleBtn.className = 'fas fa-eye-slash';
        } else {
            tokenInput.type = 'password';
            toggleBtn.className = 'fas fa-eye';
        }
    }

    // Auto-suggest repositories when typing
    setupRepositoryAutoSuggest() {
        const repositoryInput = document.getElementById('repositoryUrl');
        if (repositoryInput) {
            let timeoutId;
            repositoryInput.addEventListener('input', (e) => {
                clearTimeout(timeoutId);
                const value = e.target.value.trim();
                
                // If user types just a username (no slash), suggest fetching repos
                if (value && !value.includes('/') && value.length > 2) {
                    timeoutId = setTimeout(() => {
                        this.showRepositoryFetchHint(value);
                    }, 1000);
                } else {
                    this.hideRepositoryFetchHint();
                }
            });
        }
    }

    showRepositoryFetchHint(username) {
        const repositoryInput = document.getElementById('repositoryUrl');
        const hintDiv = document.createElement('div');
        hintDiv.className = 'repo-fetch-hint';
        hintDiv.innerHTML = `
            <div class="hint-content">
                <i class="fas fa-lightbulb"></i>
                <span>يبدو أنك أدخلت اسم مستخدم. هل تريد جلب المستودعات الخاصة به؟</span>
                <button class="hint-btn" onclick="app.fetchUserRepositories()">
                    <i class="fas fa-search"></i> جلب المستودعات
                </button>
            </div>
        `;
        
        // Remove existing hint
        this.hideRepositoryFetchHint();
        
        // Add hint after input
        repositoryInput.parentNode.appendChild(hintDiv);
    }

    hideRepositoryFetchHint() {
        const existingHint = document.querySelector('.repo-fetch-hint');
        if (existingHint) {
            existingHint.remove();
        }
    }

    // ===== Enhanced Backup & Restore Functions =====
    
    createFullBackup() {
        try {
            const backupData = {
                version: '1.0',
                timestamp: new Date().toISOString(),
                channels: this.channels,
                favorites: Array.from(this.favorites),
                settings: this.settings,
                categories: this.categories,
                remoteStorage: this.remoteStorage,
                generalSettings: JSON.parse(localStorage.getItem('arabicTVGeneralSettings') || '{}')
            };
            
            const dataStr = JSON.stringify(backupData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            
            const link = document.createElement('a');
            link.href = URL.createObjectURL(dataBlob);
            link.download = `tv-channels-backup-${new Date().toISOString().split('T')[0]}.json`;
            link.click();
            
            this.notifySuccess('تم إنشاء النسخة الاحتياطية بنجاح!');
            
        } catch (error) {
            console.error('Backup creation failed:', error);
            this.notifyError('فشل في إنشاء النسخة الاحتياطية');
        }
    }

    restoreFromBackup() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const backupData = JSON.parse(e.target.result);
                        this.processBackupData(backupData);
                    } catch (error) {
                        console.error('Backup restore failed:', error);
                        this.notifyError('ملف النسخة الاحتياطية غير صحيح');
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    }

    processBackupData(backupData) {
        if (!backupData.version || !backupData.channels) {
            this.notifyError('ملف النسخة الاحتياطية غير صحيح أو قديم');
            return;
        }
        
        // Show confirmation dialog
        const confirmed = confirm(
            'هل أنت متأكد من استعادة النسخة الاحتياطية؟\n' +
            'سيتم استبدال جميع البيانات الحالية بالبيانات من النسخة الاحتياطية.\n' +
            'تاريخ النسخة: ' + new Date(backupData.timestamp).toLocaleString('ar')
        );
        
        if (!confirmed) return;
        
        try {
            // Restore channels
            if (backupData.channels && Array.isArray(backupData.channels)) {
                this.channels = backupData.channels;
                this.saveChannelsToStorage();
            }
            
            // Restore favorites
            if (backupData.favorites && Array.isArray(backupData.favorites)) {
                this.favorites = new Set(backupData.favorites);
            }
            
            // Restore settings
            if (backupData.settings && typeof backupData.settings === 'object') {
                this.settings = { ...this.settings, ...backupData.settings };
                this.saveSettings();
            }
            
            // Restore categories
            if (backupData.categories && Array.isArray(backupData.categories)) {
                this.categories = backupData.categories;
            }
            
            // Restore remote storage settings
            if (backupData.remoteStorage && typeof backupData.remoteStorage === 'object') {
                this.remoteStorage = { ...this.remoteStorage, ...backupData.remoteStorage };
                this.saveRemoteStorageSettings();
            }
            
            // Restore general settings
            if (backupData.generalSettings && typeof backupData.generalSettings === 'object') {
                localStorage.setItem('arabicTVGeneralSettings', JSON.stringify(backupData.generalSettings));
            }
            
            // Refresh UI
            this.loadRemoteStorageUI();
            this.renderChannels();
            this.updateChannelCount();
            
            this.notifySuccess('تم استعادة النسخة الاحتياطية بنجاح!');
            
        } catch (error) {
            console.error('Backup restore failed:', error);
            this.notifyError('فشل في استعادة النسخة الاحتياطية');
        }
    }

    async syncToCloudBackup() {
        if (!this.remoteStorage.enabled || !this.remoteStorage.repository || !this.remoteStorage.token) {
            this.notifyError('يرجى إعداد التخزين السحابي أولاً');
            return;
        }
        
        // Ensure filename is set
        if (!this.remoteStorage.filename) {
            this.remoteStorage.filename = 'backup.json';
            this.saveRemoteStorageSettings();
        }
        
        try {
            this.notifyInfo('جاري رفع النسخة الاحتياطية للسحابة...');
            
            // Create backup data without sensitive information
            const backupData = {
                version: '1.0',
                timestamp: new Date().toISOString(),
                channels: this.channels,
                favorites: Array.from(this.favorites),
                settings: this.settings,
                categories: this.categories,
                // Exclude sensitive remote storage data
                remoteStorage: {
                    enabled: this.remoteStorage.enabled,
                    provider: this.remoteStorage.provider,
                    repository: this.remoteStorage.repository,
                    branch: this.remoteStorage.branch,
                    filename: this.remoteStorage.filename,
                    autoSync: this.remoteStorage.autoSync,
                    lastSync: this.remoteStorage.lastSync
                    // Note: token is excluded for security
                },
                generalSettings: JSON.parse(localStorage.getItem('arabicTVGeneralSettings') || '{}')
            };
            
            // Upload backup to cloud
            const success = await this.uploadToRepository(backupData);
            
            if (success) {
                this.notifySuccess('تم رفع النسخة الاحتياطية للسحابة بنجاح!');
            } else {
                this.notifyError('فشل في رفع النسخة الاحتياطية للسحابة');
            }
            
        } catch (error) {
            console.error('Cloud backup failed:', error);
            this.notifyError(`فشل في رفع النسخة الاحتياطية للسحابة: ${error.message}`);
        }
    }

    async downloadCloudBackup() {
        if (!this.remoteStorage.enabled || !this.remoteStorage.repository || !this.remoteStorage.token) {
            this.notifyError('يرجى إعداد التخزين السحابي أولاً');
            return;
        }
        
        // Ensure filename is set
        if (!this.remoteStorage.filename) {
            this.remoteStorage.filename = 'backup.json';
            this.saveRemoteStorageSettings();
        }
        
        try {
            this.notifyInfo('جاري تحميل النسخة الاحتياطية من السحابة...');
            
            // Download backup from cloud
            const backupData = await this.downloadFromRepository();
            
            if (backupData) {
                this.processBackupData(backupData);
            } else {
                this.notifyError('لم يتم العثور على نسخة احتياطية في السحابة');
            }
            
        } catch (error) {
            console.error('Cloud backup download failed:', error);
            this.notifyError(`فشل في تحميل النسخة الاحتياطية من السحابة: ${error.message}`);
        }
    }

    saveRemoteStorageSettingsUI() {
        this.saveRemoteStorageSettings();
        this.notifySuccess('تم حفظ إعدادات التخزين السحابي!');
        this.updateSyncStatus();
    }

    async manualSync() {
        if (!this.remoteStorage.enabled) {
            this.notifyError('التخزين السحابي غير مُفعّل');
            return;
        }

        const button = document.querySelector('.sync-now-btn');
        const originalText = button.innerHTML;
        
        try {
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جارٍ المزامنة...';
            button.disabled = true;

            // Try to sync from remote first
            const downloadSuccess = await this.syncFromRemote();
            
            // Then sync to remote
            const uploadSuccess = await this.syncToRemote();

            if (downloadSuccess || uploadSuccess) {
                this.updateSyncStatus();
                this.notifySuccess('تمت المزامنة بنجاح!');
            } else {
                this.notifyInfo('لا توجد تغييرات للمزامنة');
            }
        } catch (error) {
            console.error('خطأ في المزامنة اليدوية:', error);
            this.notifyError('فشل في المزامنة: ' + error.message);
        } finally {
            button.innerHTML = originalText;
            button.disabled = false;
        }
    }

    // وظيفة تشخيصية لتصدير القنوات
    exportChannels() {
        try {
            const channelsData = JSON.stringify(this.channels, null, 2);
            const blob = new Blob([channelsData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'channels-backup.json';
            a.click();
            URL.revokeObjectURL(url);
            console.log('تم تصدير القنوات بنجاح');
            this.notifySuccess('تم تصدير القنوات كملف نسخ احتياطي بنجاح!');
        } catch (error) {
            console.error('خطأ في تصدير القنوات:', error);
            this.notifyError('فشل في تصدير القنوات. يرجى المحاولة مرة أخرى.');
        }
    }

    importChannels() {
        const fileInput = document.getElementById('importFileInput');
        
        // Set up file input event listener
        fileInput.onchange = (event) => {
            const file = event.target.files[0];
            if (!file) return;
            
            if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
                this.notifyError('يرجى اختيار ملف JSON صحيح');
                return;
            }
            
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const importedData = JSON.parse(e.target.result);
                    
                    // Validate imported data
                    if (!Array.isArray(importedData)) {
                        this.notifyError('تنسيق الملف غير صحيح - يجب أن يكون مصفوفة من القنوات');
                        return;
                    }
                    
                    // Validate each channel has required properties
                    const isValidChannels = importedData.every(channel => 
                        channel.id && channel.name && channel.url && channel.category
                    );
                    
                    if (!isValidChannels) {
                        this.notifyError('بعض القنوات في الملف لا تحتوي على البيانات المطلوبة');
                        return;
                    }
                    
                    // Show confirmation dialog
                    this.showImportConfirmation(importedData);
                    
                } catch (error) {
                    console.error('خطأ في قراءة ملف الاستيراد:', error);
                    this.notifyError('فشل في قراءة الملف - تأكد من أنه ملف JSON صحيح');
                }
            };
            
            reader.readAsText(file);
            // Reset file input
            fileInput.value = '';
        };
        
        // Trigger file selection
        fileInput.click();
    }

    showImportConfirmation(importedChannels) {
        // Create confirmation notification
        const notification = this.showNotification(
            'تأكيد الاستيراد', 
            `هل تريد استيراد ${importedChannels.length} قناة؟\n\nتحذير: سيتم استبدال ${this.channels.length} قناة موجودة!`,
            'warning',
            0 // Don't auto-close
        );
        
        // Add custom buttons to notification
        setTimeout(() => {
            const notificationElement = Array.from(document.querySelectorAll('.notification')).find(el => 
                el.querySelector('.notification-title')?.textContent === 'تأكيد الاستيراد'
            );
            
            if (notificationElement) {
                // Remove default close button
                const defaultCloseBtn = notificationElement.querySelector('.notification-close');
                if (defaultCloseBtn) defaultCloseBtn.remove();
                
                // Add custom buttons
                const buttonsContainer = document.createElement('div');
                buttonsContainer.style.cssText = 'display: flex; gap: 10px; margin-top: 15px; justify-content: flex-end;';
                
                const confirmBtn = document.createElement('button');
                confirmBtn.textContent = 'تأكيد الاستيراد';
                confirmBtn.style.cssText = 'background: #10b981; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 0.9rem;';
                confirmBtn.onclick = () => {
                    this.performImport(importedChannels);
                    this.closeNotification(notification);
                };
                
                const cancelBtn = document.createElement('button');
                cancelBtn.textContent = 'إلغاء';
                cancelBtn.style.cssText = 'background: #6b7280; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 0.9rem;';
                cancelBtn.onclick = () => {
                    this.closeNotification(notification);
                    this.notifyInfo('تم إلغاء عملية الاستيراد');
                };
                
                buttonsContainer.appendChild(confirmBtn);
                buttonsContainer.appendChild(cancelBtn);
                notificationElement.querySelector('.notification-content').appendChild(buttonsContainer);
            }
        }, 100);
    }

    performImport(importedChannels) {
        try {
            // Replace channels with imported ones
            this.channels = importedChannels.map(channel => ({
                ...channel,
                id: channel.id || Date.now() + Math.random() // Ensure unique IDs
            }));
            
            // Update filtered channels
            this.filteredChannels = [...this.channels];
            
            // Save to storage
            this.saveChannelsToStorage();
            
            // Update original order tracking
            this.originalOrder = [...this.channels];
            this.hasOrderChanged = false;
            
            // Re-render everything
            this.renderChannels();
            this.renderAdminChannels();
            
            // Reset current category
            this.currentCategory = 'all';
            
            // Update nav tabs
            const navTabs = document.querySelectorAll('.mobile-nav-tab');
            navTabs.forEach(tab => {
                tab.classList.remove('active');
                if (tab.dataset.category === 'all') {
                    tab.classList.add('active');
                }
            });
            
            this.notifySuccess(`تم استيراد ${importedChannels.length} قناة بنجاح!`);
            
        } catch (error) {
            console.error('خطأ في استيراد القنوات:', error);
            this.notifyError('فشل في استيراد القنوات');
        }
    }

    // وظيفة تشخيصية لعرض حالة التخزين
    debugStorage() {
        this.openDiagnosticModal();
    }

    openDiagnosticModal() {
        // Log to console for developers
        console.log('=== تشخيص التخزين ===');
        console.log('القنوات الحالية:', this.channels.length);
        console.log('القنوات في الذاكرة:', this.channels);
        
        const modal = document.getElementById('diagnosticModal');
        modal.style.display = 'block';
        
        // Populate modal with diagnostic data
        this.updateDiagnosticData();
    }

    updateDiagnosticData() {
        // Memory state
        document.getElementById('memoryChannelsCount').textContent = this.channels.length;
        document.getElementById('activeCategory').textContent = this.getCategoryName(this.currentCategory);
        document.getElementById('filteredChannelsCount').textContent = this.filteredChannels.length;
        
        // Storage state
        const savedChannels = localStorage.getItem('arabicTVChannels');
        let savedCount = 0;
        let storageStatus = 'غير متوفر';
        let syncStatus = '';
        
        if (savedChannels) {
            try {
                const parsedChannels = JSON.parse(savedChannels);
                savedCount = parsedChannels.length;
                storageStatus = savedCount.toString();
                console.log('القنوات المحفوظة:', parsedChannels.length);
                console.log('القنوات المحفوظة في Local Storage:', parsedChannels);
            } catch (error) {
                storageStatus = 'خطأ في القراءة';
                console.error('خطأ في تحليل البيانات المحفوظة:', error);
            }
        } else {
            console.log('لا توجد قنوات محفوظة في Local Storage');
        }
        
        // Sync status
        if (this.channels.length === savedCount) {
            syncStatus = '✅ متزامن';
            document.getElementById('syncStatus').className = 'diagnostic-value status-ok';
        } else {
            syncStatus = '⚠️ غير متزامن';
            document.getElementById('syncStatus').className = 'diagnostic-value status-warning';
        }
        
        document.getElementById('savedChannelsCount').textContent = storageStatus;
        document.getElementById('syncStatus').textContent = syncStatus;
        
        // Data size
        const dataSize = (new Blob([savedChannels || '']).size / 1024).toFixed(2);
        document.getElementById('dataSize').textContent = `${dataSize} KB`;
        console.log('حجم البيانات المحفوظة:', dataSize, 'KB');
        
        // System information
        const isLocalStorageAvailable = this.testLocalStorageAvailability();
        document.getElementById('localStorageAvailable').textContent = isLocalStorageAvailable ? '✅ متاح' : '❌ غير متاح';
        document.getElementById('localStorageAvailable').className = `diagnostic-value ${isLocalStorageAvailable ? 'status-ok' : 'status-error'}`;
        
        // Storage usage (rough estimate)
        const totalStorage = this.estimateStorageUsage();
        document.getElementById('storageUsage').textContent = `${totalStorage} KB`;
        
        // Last saved time
        const lastSaved = localStorage.getItem('arabicTVChannels_timestamp');
        if (lastSaved) {
            const date = new Date(parseInt(lastSaved));
            document.getElementById('lastSaved').textContent = date.toLocaleString('ar-SA');
        } else {
            document.getElementById('lastSaved').textContent = 'غير محدد';
        }
    }

    getCategoryName(category) {
        const categoryNames = {
            'all': 'جميع القنوات',
            'news': 'الأخبار',
            'entertainment': 'الترفيه',
            'sports': 'الرياضة',
            'religious': 'الدينية',
            'music': 'الموسيقى',
            'movies': 'الأفلام',
            'documentary': 'الوثائقية'
        };
        return categoryNames[category] || category;
    }

    testLocalStorageAvailability() {
        try {
            const test = 'test';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (error) {
            return false;
        }
    }

    estimateStorageUsage() {
        let total = 0;
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                total += localStorage[key].length;
            }
        }
        return (total / 1024).toFixed(2);
    }

    closeDiagnosticModal() {
        const modal = document.getElementById('diagnosticModal');
        modal.style.display = 'none';
    }

    // نظام الإشعارات الجميل
    showNotification(title, message, type = 'info', duration = 4000) {
        const container = document.getElementById('notificationsContainer');
        if (!container) return;

        // إنشاء الإشعار
        const notification = document.createElement('div');
        notification.className = 'notification entering';
        
        const notificationId = Date.now() + Math.random();
        notification.dataset.id = notificationId;

        // تحديد الأيقونة حسب النوع
        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };

        notification.innerHTML = `
            <div class="notification-icon ${type}">
                ${icons[type] || icons.info}
            </div>
            <div class="notification-content">
                <div class="notification-title">${title}</div>
                <div class="notification-message">${message}</div>
            </div>
            <button class="notification-close" onclick="app.closeNotification('${notificationId}')">
                <i class="fas fa-times"></i>
            </button>
        `;

        // إضافة الإشعار للحاوية
        container.appendChild(notification);
        this.activeNotifications.add(notificationId);

        // إظهار الإشعار بعد إضافته للـ DOM
        setTimeout(() => {
            notification.classList.remove('entering');
            notification.classList.add('show');
        }, 50);

        // إخفاء الإشعار تلقائياً
        if (duration > 0) {
            setTimeout(() => {
                this.closeNotification(notificationId);
            }, duration);
        }

        // التحكم في عدد الإشعارات المعروضة
        this.limitNotifications();

        return notificationId;
    }

    closeNotification(notificationId) {
        const notification = document.querySelector(`[data-id="${notificationId}"]`);
        if (!notification) return;

        notification.classList.remove('show');
        notification.classList.add('hide');
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
            this.activeNotifications.delete(notificationId);
        }, 300);
    }

    limitNotifications() {
        const container = document.getElementById('notificationsContainer');
        const notifications = container.querySelectorAll('.notification');
        
        // الحد الأقصى 5 إشعارات
        if (notifications.length > 5) {
            const oldestNotification = notifications[0];
            const oldestId = oldestNotification.dataset.id;
            this.closeNotification(oldestId);
        }
    }

    // إشعارات مخصصة للتطبيق
    notifySuccess(message, title = 'نجح!') {
        return this.showNotification(title, message, 'success');
    }

    notifyError(message, title = 'خطأ!') {
        return this.showNotification(title, message, 'error');
    }

    notifyWarning(message, title = 'تحذير!') {
        return this.showNotification(title, message, 'warning');
    }

    notifyInfo(message, title = 'معلومة') {
        return this.showNotification(title, message, 'info');
    }

    // وظائف ترتيب القنوات
    addDragListeners(item) {
        item.addEventListener('dragstart', (e) => {
            e.target.classList.add('dragging');
            e.dataTransfer.setData('text/plain', e.target.dataset.index);
        });

        item.addEventListener('dragend', (e) => {
            e.target.classList.remove('dragging');
        });

        item.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.target.closest('.admin-channel-item')?.classList.add('drag-over');
        });

        item.addEventListener('dragleave', (e) => {
            e.target.closest('.admin-channel-item')?.classList.remove('drag-over');
        });

        item.addEventListener('drop', (e) => {
            e.preventDefault();
            const draggedIndex = parseInt(e.dataTransfer.getData('text/plain'));
            const targetItem = e.target.closest('.admin-channel-item');
            
            if (targetItem) {
                const targetIndex = parseInt(targetItem.dataset.index);
                this.moveChannel(draggedIndex, targetIndex);
                targetItem.classList.remove('drag-over');
            }
        });
    }

    moveChannelUp(index) {
        if (index > 0) {
            this.moveChannel(index, index - 1);
        }
    }

    moveChannelDown(index) {
        if (index < this.channels.length - 1) {
            this.moveChannel(index, index + 1);
        }
    }

    moveChannel(fromIndex, toIndex) {
        if (fromIndex === toIndex) return;

        // نقل القناة في المصفوفة
        const [movedChannel] = this.channels.splice(fromIndex, 1);
        this.channels.splice(toIndex, 0, movedChannel);

        // تحديث القنوات المفلترة
        this.filteredChannels = [...this.channels];

        // تسجيل أن الترتيب تغير
        this.hasOrderChanged = true;

        // إعادة رسم القائمة
        this.renderAdminChannels();
        this.renderChannels(); // تحديث العرض الرئيسي أيضاً

        // إظهار زر الحفظ
        this.updateSaveOrderButton();

        this.notifyInfo(`تم نقل "${movedChannel.name}" إلى الموضع الجديد`);
    }

    updateSaveOrderButton() {
        const container = document.getElementById('saveOrderContainer');
        const button = document.getElementById('saveOrderBtn');
        
        if (this.hasOrderChanged) {
            container.style.display = 'block';
            button.disabled = false;
        } else {
            container.style.display = 'none';
            button.disabled = true;
        }
    }

    saveChannelsOrder() {
        if (!this.hasOrderChanged) {
            this.notifyWarning('لم يتم تغيير ترتيب القنوات');
            return;
        }

        try {
            // حفظ الترتيب الجديد
            this.saveChannelsToStorage();
            
            // تحديث الترتيب الأصلي المحفوظ
            this.originalOrder = [...this.channels];
            this.hasOrderChanged = false;
            
            // تحديث زر الحفظ
            this.updateSaveOrderButton();
            
            this.notifySuccess('تم حفظ الترتيب الجديد للقنوات بنجاح!');
            
        } catch (error) {
            console.error('خطأ في حفظ ترتيب القنوات:', error);
            this.notifyError('فشل في حفظ ترتيب القنوات');
        }
    }

    resetChannelsOrder() {
        if (!this.hasOrderChanged) return;

        this.channels = [...this.originalOrder];
        this.filteredChannels = [...this.channels];
        this.hasOrderChanged = false;
        
        this.renderAdminChannels();
        this.renderChannels();
        this.updateSaveOrderButton();
        
        this.notifyInfo('تم إعادة تعيين ترتيب القنوات');
    }

    // Mobile Sidebar Functions
    toggleMobileMenu() {
        this.isMobileSidebarOpen = !this.isMobileSidebarOpen;
        
        // Use requestAnimationFrame for smoother animation
        requestAnimationFrame(() => {
            const sidebar = document.getElementById('mobileSidebar');
            const overlay = document.getElementById('mobileSidebarOverlay');
            
            if (this.isMobileSidebarOpen) {
                sidebar.classList.add('active');
                overlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            } else {
                sidebar.classList.remove('active');
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    closeMobileMenu() {
        if (this.isMobileSidebarOpen) {
            this.toggleMobileMenu();
        }
    }

    // Desktop Sidebar Functions
    toggleSidebar() {
        console.log('تبديل القائمة الجانبية - الحالة الحالية:', this.isDesktopSidebarOpen);
        this.isDesktopSidebarOpen = !this.isDesktopSidebarOpen;
        console.log('الحالة الجديدة:', this.isDesktopSidebarOpen);
        
        // Use requestAnimationFrame for smoother animation
        requestAnimationFrame(() => {
            const sidebar = document.getElementById('desktopSidebar');
            const mainContent = document.querySelector('.main-content');
            const overlay = document.querySelector('.sidebar-overlay') || this.createSidebarOverlay();
            
            console.log('عناصر DOM:', { sidebar, mainContent, overlay });
            
            if (this.isDesktopSidebarOpen) {
                sidebar.classList.add('active');
                mainContent.classList.add('sidebar-open');
                overlay.classList.add('active');
                console.log('تم فتح القائمة الجانبية');
            } else {
                sidebar.classList.remove('active');
                mainContent.classList.remove('sidebar-open');
                overlay.classList.remove('active');
                console.log('تم إغلاق القائمة الجانبية');
            }
        });
    }

    createSidebarOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        overlay.onclick = () => this.toggleSidebar();
        document.body.appendChild(overlay);
        return overlay;
    }

    toggleFavorites() {
        // Toggle favorites filter
        this.toggleFavoritesFilter();
    }


    // Update sidebar counts
    updateSidebarCounts() {
        console.log('بدء تحديث عداد القنوات - عدد القنوات الإجمالي:', this.channels.length);
        
        // Use dynamic categories instead of hardcoded list
        const categories = this.categories.map(cat => cat.key);
        
        categories.forEach(category => {
            // Update desktop sidebar counts
            const countElement = document.getElementById(`${category}Count`);
            if (countElement) {
                let count = 0;
                if (category === 'all') {
                    count = this.channels.length;
                } else {
                    count = this.channels.filter(channel => channel.category === category).length;
                }
                countElement.textContent = count;
                console.log(`عداد ${category}:`, count);
            } else {
                console.warn(`لم يتم العثور على عنصر ${category}Count`);
            }
            
            // Update mobile sidebar counts
            const mobileCountElement = document.getElementById(`mobile${category.charAt(0).toUpperCase() + category.slice(1)}Count`);
            if (mobileCountElement) {
                let count = 0;
                if (category === 'all') {
                    count = this.channels.length;
                } else {
                    count = this.channels.filter(channel => channel.category === category).length;
                }
                mobileCountElement.textContent = count;
                console.log(`عداد الموبايل ${category}:`, count);
            } else {
                console.warn(`لم يتم العثور على عنصر mobile${category.charAt(0).toUpperCase() + category.slice(1)}Count`);
            }
        });

        // Update favorites count
        const favoritesCountElements = document.querySelectorAll('.favorites-count, #headerFavoritesCount');
        favoritesCountElements.forEach(element => {
            element.textContent = this.favorites.size;
        });
        
        // Debug log
        console.log('تم تحديث عداد القنوات:', {
            all: this.channels.length,
            news: this.channels.filter(c => c.category === 'news').length,
            entertainment: this.channels.filter(c => c.category === 'entertainment').length,
            sports: this.channels.filter(c => c.category === 'sports').length,
            religious: this.channels.filter(c => c.category === 'religious').length,
            music: this.channels.filter(c => c.category === 'music').length
        });
    }

    // Sync mobile nav tabs with desktop nav tabs
    syncMobileNavTabs() {
        const mobileNavTabs = document.querySelectorAll('.mobile-nav-tab');
        const desktopNavTabs = document.querySelectorAll('.sidebar-nav-tab');
        
        mobileNavTabs.forEach((mobileTab, index) => {
            mobileTab.addEventListener('click', () => {
                // Remove active class from all mobile tabs
                mobileNavTabs.forEach(tab => tab.classList.remove('active'));
                // Add active class to clicked mobile tab
                mobileTab.classList.add('active');
                
                // Sync with desktop tabs
                desktopNavTabs.forEach(tab => tab.classList.remove('active'));
                if (desktopNavTabs[index]) {
                    desktopNavTabs[index].classList.add('active');
                }
                
                // Get category from clicked tab
                const category = mobileTab.dataset.category;
                this.currentCategory = category;
                this.filterChannels(category);
                
                // Close mobile menu after selection
                this.closeMobileMenu();
            });
        });
    }

    // Sync mobile search with desktop search
    setupMobileSearch() {
        const mobileSearchInput = document.getElementById('mobileSearchInput');
        const desktopSearchInput = document.getElementById('searchInput');
        
        if (mobileSearchInput) {
            mobileSearchInput.addEventListener('input', (e) => {
                const query = e.target.value;
                // Sync with desktop search
                if (desktopSearchInput) {
                    desktopSearchInput.value = query;
                }
                this.searchChannels(query);
            });
        }
    }

    hideLoading() {
        const loading = document.getElementById('loading');
        setTimeout(() => {
            loading.style.display = 'none';
        }, 1000);
    }

    // Connection quality detection
    detectConnectionQuality() {
        if (navigator.connection) {
            const connection = navigator.connection;
            const downlink = connection.downlink;
            
            if (downlink >= 10) {
                return 'high'; // 1080p
            } else if (downlink >= 5) {
                return 'medium'; // 720p
            } else {
                return 'low'; // 480p
            }
        }
        return 'auto';
    }

    // News ticker functionality
    startNewsTicker() {
        const newsTickerText = document.getElementById('newsTickerText');
        const newsTicker = document.getElementById('newsTicker');
        
        // Show news ticker
        newsTicker.style.display = 'flex';
        
        // Restart animation
        newsTickerText.style.animation = 'none';
        setTimeout(() => {
            newsTickerText.style.animation = 'tickerMove 60s linear infinite';
        }, 100);
        
        // Update news content periodically
        this.newsUpdateInterval = setInterval(() => {
            this.updateNewsContent();
        }, 300000); // Update every 5 minutes
    }

    stopNewsTicker() {
        const newsTicker = document.getElementById('newsTicker');
        newsTicker.style.display = 'none';
        
        if (this.newsUpdateInterval) {
            clearInterval(this.newsUpdateInterval);
            this.newsUpdateInterval = null;
        }
    }

    updateNewsContent() {
        const newsItems = [
            'عاجل: القمة العربية تناقش أهم القضايا الإقليمية والدولية',
            'مؤتمر دولي حول التغيرات المناخية يبدأ أعماله في دبي',
            'ارتفاع أسعار النفط في الأسواق العالمية',
            'منتخب مصر يحقق فوزاً مهماً في تصفيات كأس العالم',
            'افتتاح معرض الكتاب الدولي في الرياض',
            'إنجازات جديدة في مجال الطاقة المتجددة بدول الخليج',
            'توقيع اتفاقيات تجارية جديدة بين الدول العربية',
            'إطلاق مشاريع تنموية ضخمة في منطقة الشرق الأوسط',
            'مؤتمر صحفي مهم للرئاسة حول آخر التطورات',
            'انطلاق فعاليات ثقافية كبرى في العاصمة',
            'تطورات جديدة في مجال التكنولوجيا والذكاء الاصطناعي',
            'أخبار اقتصادية مهمة تؤثر على الأسواق العربية'
        ];
        
        // Shuffle news items
        const shuffledNews = newsItems.sort(() => Math.random() - 0.5);
        const newsText = shuffledNews.join(' • • • ');
        
        const newsTickerText = document.getElementById('newsTickerText');
        newsTickerText.textContent = newsText;
    }

    // Time display functionality
    showTimeDisplay() {
        // Create time display if it doesn't exist
        let timeDisplay = document.getElementById('timeDisplay');
        if (!timeDisplay) {
            timeDisplay = document.createElement('div');
            timeDisplay.id = 'timeDisplay';
            timeDisplay.className = 'time-display';
            document.querySelector('.video-container').appendChild(timeDisplay);
        }
        
        timeDisplay.style.display = 'block';
        this.updateTime();
        
        // Update time every second
        this.timeUpdateInterval = setInterval(() => {
            this.updateTime();
        }, 1000);
    }

    hideTimeDisplay() {
        const timeDisplay = document.getElementById('timeDisplay');
        if (timeDisplay) {
            timeDisplay.style.display = 'none';
        }
        
        if (this.timeUpdateInterval) {
            clearInterval(this.timeUpdateInterval);
            this.timeUpdateInterval = null;
        }
    }

    updateTime() {
        const timeDisplay = document.getElementById('timeDisplay');
        if (!timeDisplay) return;
        
        const now = new Date();
        const options = {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
            timeZone: 'Asia/Riyadh'
        };
        
        const timeString = now.toLocaleTimeString('ar-SA', options);
        const dateString = now.toLocaleDateString('ar-SA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        timeDisplay.innerHTML = `
            <div style="font-size: 1rem; font-weight: 600;">${timeString}</div>
            <div style="font-size: 0.8rem; opacity: 0.8;">${dateString}</div>
        `;
    }

    // Enhanced channel info display (disabled)
    updateChannelInfo(channel) {
        // Channel logo overlay is now hidden
    }


    // Initialize quality menu
    initQualityMenu() {
        const qualityOptions = document.querySelectorAll('.quality-option');
        
        qualityOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                const quality = option.dataset.quality;
                this.setVideoQuality(quality);
                this.hideQualityMenu();
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.quality-control-container')) {
                this.hideQualityMenu();
            }
        });
    }

    // Toggle quality menu
    toggleQualityMenu() {
        const qualityMenu = document.getElementById('qualityMenu');
        const isVisible = qualityMenu.classList.contains('show');
        
        if (isVisible) {
            this.hideQualityMenu();
        } else {
            this.showQualityMenu();
        }
    }

    // Show quality menu
    showQualityMenu() {
        const qualityMenu = document.getElementById('qualityMenu');
        const qualityBtn = document.querySelector('.quality-btn');
        qualityMenu.classList.add('show');
        qualityBtn.classList.add('open');
        
        // Update available qualities based on current stream
        this.updateAvailableQualities();
    }

    // Hide quality menu
    hideQualityMenu() {
        const qualityMenu = document.getElementById('qualityMenu');
        const qualityBtn = document.querySelector('.quality-btn');
        qualityMenu.classList.remove('show');
        qualityBtn.classList.remove('open');
    }

    // Set video quality
    setVideoQuality(quality) {
        // Remove active class from all options
        document.querySelectorAll('.quality-option').forEach(option => {
            option.classList.remove('active');
        });

        // Add active class to selected option
        const selectedOption = document.querySelector(`[data-quality="${quality}"]`);
        if (selectedOption) {
            selectedOption.classList.add('active');
        }

        // Check if current channel is YouTube
        if (this.currentChannel && (this.currentChannel.type === 'youtube' || this.isYouTubeUrl(this.currentChannel.url))) {
            // Reload YouTube video with new quality
            this.loadYouTubeVideo(this.currentChannel.url, quality);
            return;
        }

        // Handle HLS quality
        if (!this.hls) return;

        // Apply quality setting
        if (quality === 'auto') {
            this.hls.currentLevel = -1; // Auto quality
            console.log('Quality set to: Auto');
        } else {
            const levels = this.hls.levels;
            const targetHeight = parseInt(quality);
            
            // Find the level closest to target height
            let bestLevel = -1;
            let bestMatch = Infinity;
            
            levels.forEach((level, index) => {
                const heightDiff = Math.abs(level.height - targetHeight);
                if (heightDiff < bestMatch) {
                    bestMatch = heightDiff;
                    bestLevel = index;
                }
            });
            
            if (bestLevel !== -1) {
                this.hls.currentLevel = bestLevel;
                console.log(`Quality set to: ${levels[bestLevel].height}p`);
            }
        }

        // Update quality text in header
        const qualityText = document.getElementById('qualityText');
        if (qualityText) {
            // Keep the button text as "جودة البث" and show current quality in a tooltip or separate element
            qualityText.textContent = 'جودة البث';
            qualityText.title = quality === 'auto' ? 'تلقائي' : `${quality}p`;
        }

        // Update quality display in video player
        this.updateQualityDisplay(quality);
    }

    // Update quality display in video player
    updateQualityDisplay(quality) {
        const qualityDisplay = document.getElementById('qualityDisplay');
        const currentQualityText = document.getElementById('currentQualityText');
        
        if (qualityDisplay && currentQualityText) {
            // Check if current channel is YouTube
            if (this.currentChannel && (this.currentChannel.type === 'youtube' || this.isYouTubeUrl(this.currentChannel.url))) {
                this.updateYouTubeQualityDisplay(quality);
            } else {
                if (quality === 'auto') {
                    currentQualityText.textContent = 'تلقائي';
                } else {
                    currentQualityText.textContent = `${quality}p`;
                }
            }
            
            // Show the quality display
            qualityDisplay.style.display = 'flex';
        }
    }

    // Update quality display based on current HLS level
    updateQualityDisplayFromHLS() {
        if (!this.hls || !this.hls.levels) return;
        
        const currentLevel = this.hls.currentLevel;
        const levels = this.hls.levels;
        
        if (currentLevel === -1) {
            // Auto quality
            this.updateQualityDisplay('auto');
        } else if (currentLevel >= 0 && currentLevel < levels.length) {
            // Specific quality
            const height = levels[currentLevel].height;
            this.updateQualityDisplay(height.toString());
        }
    }

    // Update available qualities based on stream
    updateAvailableQualities() {
        if (!this.hls || !this.hls.levels) return;

        const levels = this.hls.levels;
        const qualityOptions = document.querySelectorAll('.quality-option');
        
        qualityOptions.forEach(option => {
            const quality = option.dataset.quality;
            
            if (quality === 'auto') {
                // Auto is always available
                option.style.display = 'flex';
                return;
            }
            
            const targetHeight = parseInt(quality);
            const hasQuality = levels.some(level => 
                Math.abs(level.height - targetHeight) <= 50
            );
            
            // Show/hide option based on availability
            option.style.display = hasQuality ? 'flex' : 'none';
        });
    }

    // New Navigation Features Implementation
    
    initializeNewFeatures() {
        this.bindNewNavigationEvents();
        this.updateFavoritesCount();
        this.setupFilterDropdowns();
        this.loadCategories();
    }

    bindNewNavigationEvents() {



        // Breadcrumb navigation
        const breadcrumbHome = document.querySelector('.breadcrumb-item[data-category="all"]');
        if (breadcrumbHome) {
            breadcrumbHome.addEventListener('click', (e) => {
                e.preventDefault();
                this.resetAllFilters();
            });
        }

        // Close dropdowns when clicking outside
        document.addEventListener('click', () => {
            this.closeAllFilterDropdowns();
        });

        // Reposition dropdowns on window resize
        window.addEventListener('resize', () => {
            this.closeAllFilterDropdowns();
        });

        // Mobile main filter buttons (outside sidebar)
        const mobileMainSearchInput = document.getElementById('mobileMainSearchInput');

        if (mobileMainSearchInput) {
            mobileMainSearchInput.addEventListener('input', (e) => {
                // Sync with desktop search
                const desktopSearchInput = document.getElementById('searchInput');
                if (desktopSearchInput) {
                    desktopSearchInput.value = e.target.value;
                }
                this.applyAllFilters();
            });
        }



    }

    setupFilterDropdowns() {


    }


    // Favorites Management
    loadFavorites() {
        try {
            const savedFavorites = localStorage.getItem('arabicTVFavorites');
            if (savedFavorites) {
                this.favorites = new Set(JSON.parse(savedFavorites));
                console.log('تم تحميل المفضلة:', this.favorites.size, 'قناة');
            }
        } catch (error) {
            console.error('خطأ في تحميل المفضلة:', error);
            this.favorites = new Set();
        }
    }

    saveFavorites() {
        try {
            const favoritesArray = Array.from(this.favorites);
            localStorage.setItem('arabicTVFavorites', JSON.stringify(favoritesArray));
            console.log('تم حفظ المفضلة:', favoritesArray.length, 'قناة');
        } catch (error) {
            console.error('خطأ في حفظ المفضلة:', error);
        }
    }

    toggleFavorite(channelId, event) {
        if (event) {
            event.stopPropagation();
        }

        if (this.favorites.has(channelId)) {
            this.favorites.delete(channelId);
            this.notifyInfo('تم إزالة القناة من المفضلة');
        } else {
            this.favorites.add(channelId);
            this.notifySuccess('تم إضافة القناة للمفضلة');
        }

        this.saveFavorites();
        this.updateFavoritesCount();
        this.renderChannels(); // Re-render to update favorite buttons
        
        // Update filters if showing favorites only
        if (this.showFavoritesOnly) {
            this.applyAllFilters();
        }
    }

    updateFavoritesCount() {
        const count = this.favorites.size;
        
        // Update header favorites count
        const headerFavoritesCountElement = document.getElementById('headerFavoritesCount');
        if (headerFavoritesCountElement) {
            headerFavoritesCountElement.textContent = count;
        }
    }

    toggleFavoritesFilter() {
        this.showFavoritesOnly = !this.showFavoritesOnly;
        
        const favoritesFilterBtn = document.getElementById('favoritesFilterBtn');
        
        if (favoritesFilterBtn) {
            if (this.showFavoritesOnly) {
                favoritesFilterBtn.classList.add('active');
                this.notifyInfo('عرض المفضلة فقط');
            } else {
                favoritesFilterBtn.classList.remove('active');
                this.notifyInfo('عرض جميع القنوات');
            }
        }

        this.applyAllFilters();
        this.updateBreadcrumbs();
    }

    // Filter Management
    toggleFilterDropdown(filterType) {
        const dropdown = document.getElementById(`${filterType}Dropdown`);
        const button = document.getElementById(`${filterType}FilterBtn`);
        
        if (!dropdown || !button) return;

        // Close other dropdowns first
        this.closeAllFilterDropdowns();

        // Toggle current dropdown
        const isVisible = dropdown.classList.contains('show');
        
        if (!isVisible) {
            // Position dropdown relative to button
            const buttonRect = button.getBoundingClientRect();
            const dropdownWidth = 200; // min-width from CSS
            
            // Calculate position
            let leftPosition = buttonRect.left + (buttonRect.width / 2) - (dropdownWidth / 2);
            
            // Keep dropdown within viewport
            const viewportWidth = window.innerWidth;
            const padding = 20;
            
            if (leftPosition < padding) {
                leftPosition = padding;
            } else if (leftPosition + dropdownWidth > viewportWidth - padding) {
                leftPosition = viewportWidth - dropdownWidth - padding;
            }
            
            // Set position
            dropdown.style.left = leftPosition + 'px';
            dropdown.style.top = (buttonRect.bottom + 10) + 'px';
            
            // Position the arrow relative to the button
            const arrowPosition = buttonRect.left + (buttonRect.width / 2) - leftPosition;
            dropdown.style.setProperty('--arrow-position', arrowPosition + 'px');
            
            dropdown.classList.add('show');
            button.classList.add('open');
        }
    }

    closeAllFilterDropdowns() {
        const dropdowns = document.querySelectorAll('.filter-dropdown, .header-filter-dropdown');
        const buttons = document.querySelectorAll('.filter-btn, .header-filter-btn');
        
        dropdowns.forEach(dropdown => dropdown.classList.remove('show'));
        buttons.forEach(button => button.classList.remove('open'));
    }

    setCountryFilter(country) {
        this.currentCountryFilter = country;
        


        // Update mobile button text
        this.updateMobileCountryButton();

        this.applyAllFilters();
        this.updateBreadcrumbs();
    }



    applyAllFilters() {
        let filtered = [...this.channels];
        console.log('تطبيق الفلاتر - القنوات الأصلية:', this.channels.length);

        // Apply category filter
        if (this.currentCategory !== 'all') {
            filtered = filtered.filter(channel => channel.category === this.currentCategory);
            console.log('بعد تصفية الفئة:', filtered.length);
        }

        // Apply country filter
        if (this.currentCountryFilter !== 'all') {
            filtered = filtered.filter(channel => channel.country === this.currentCountryFilter);
            console.log('بعد تصفية البلد:', filtered.length);
        }

        // Apply favorites filter
        if (this.showFavoritesOnly) {
            filtered = filtered.filter(channel => this.favorites.has(channel.id));
            console.log('بعد تصفية المفضلة:', filtered.length);
        }

        // Apply search filter
        const searchInput = document.getElementById('searchInput');
        if (searchInput && searchInput.value.trim()) {
            const searchTerm = searchInput.value.toLowerCase().trim();
            filtered = filtered.filter(channel => {
                return channel.name.toLowerCase().includes(searchTerm) ||
                       channel.country.toLowerCase().includes(searchTerm);
            });
            console.log('بعد تصفية البحث:', filtered.length);
        }

        this.filteredChannels = filtered;
        console.log('النتيجة النهائية:', this.filteredChannels.length, 'قناة');
        this.renderChannels();
        this.updateChannelStats();
    }

    resetAllFilters() {
        this.currentCategory = 'all';
        this.currentCountryFilter = 'all';
        this.showFavoritesOnly = false;

        // Reset UI elements





        // Clear search
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.value = '';
        }

        this.applyAllFilters();
        this.updateBreadcrumbs();
        this.notifyInfo('تم إعادة تعيين جميع الفلاتر');
    }

    // Quick Actions
    playRandomChannel() {
        if (this.filteredChannels.length === 0) {
            this.notifyWarning('لا توجد قنوات متاحة للعرض العشوائي');
            return;
        }

        const randomIndex = Math.floor(Math.random() * this.filteredChannels.length);
        const randomChannel = this.filteredChannels[randomIndex];
        
        this.playChannel(randomChannel);
        this.notifySuccess(`تم اختيار قناة "${randomChannel.name}" عشوائياً`);
    }

    refreshChannels() {
        const refreshBtn = document.getElementById('refreshChannelsBtn');
        if (refreshBtn) {
            refreshBtn.classList.add('spinning');
            const icon = refreshBtn.querySelector('i');
            icon.style.animation = 'spin 1s linear infinite';
        }

        // Simulate refresh delay
        setTimeout(() => {
            this.applyAllFilters();
            this.updateChannelStats();
            
            if (refreshBtn) {
                refreshBtn.classList.remove('spinning');
                const icon = refreshBtn.querySelector('i');
                icon.style.animation = '';
            }
            
            this.notifySuccess('تم تحديث القنوات بنجاح');
        }, 1000);
    }

    // Breadcrumbs and Stats
    updateBreadcrumbs() {
        const currentBreadcrumb = document.getElementById('currentBreadcrumb');
        if (!currentBreadcrumb) return;

        let breadcrumbText = this.getCategoryName(this.currentCategory);
        
        // Add additional filters to breadcrumb
        const activeFilters = [];
        
        if (this.currentCountryFilter !== 'all') {
            activeFilters.push(this.currentCountryFilter);
        }
        
        if (this.currentQualityFilter !== 'all') {
            activeFilters.push(this.currentQualityFilter);
        }
        
        if (this.showFavoritesOnly) {
            activeFilters.push('المفضلة');
        }

        if (activeFilters.length > 0) {
            breadcrumbText += ' • ' + activeFilters.join(' • ');
        }

        currentBreadcrumb.textContent = breadcrumbText;
    }

    updateChannelStats() {
        const channelCountElement = document.getElementById('channelCount');
        if (channelCountElement) {
            channelCountElement.textContent = this.filteredChannels.length;
        }
        
        this.updateBreadcrumbs();
    }

    // Enhanced Channel Card Creation (Override existing method)
    createChannelCard(channel) {
        const card = document.createElement('div');
        card.className = 'channel-card';
        
        // إنشاء placeholder محسن للشعار
        const logoPlaceholder = this.createLogoPlaceholder(channel);
        
        // Check if channel is favorited
        const isFavorited = this.favorites.has(channel.id);
        const heartClass = isFavorited ? 'fas fa-heart' : 'far fa-heart';
        const favoritedClass = isFavorited ? 'favorited' : '';
        
        card.innerHTML = `
            <img src="${channel.logo}" alt="${channel.name}" class="channel-logo" 
                 onerror="this.src='${logoPlaceholder}'; this.classList.add('placeholder-logo');">
            <div class="channel-info">
                <h3 class="channel-name">${channel.name}</h3>
                <div class="channel-meta">
                    <span class="channel-country">${channel.country}</span>
                    <span class="channel-category">${this.getCategoryName(channel.category)}</span>
                </div>
            </div>
            <div class="play-overlay">
                <button class="play-btn">
                    <i class="fas fa-play"></i>
                </button>
            </div>
            <button class="favorite-btn ${favoritedClass}" onclick="app.toggleFavorite(${channel.id}, event)">
                <i class="${heartClass}"></i>
            </button>
            <div class="channel-actions">
                <button class="channel-edit-btn" onclick="app.editChannel(${channel.id}, event)" title="تعديل القناة">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="channel-delete-btn" onclick="app.deleteChannel(${channel.id}, event)" title="حذف القناة">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;

        card.addEventListener('click', () => this.playChannel(channel));
        return card;
    }

    // Edit Channel Function
    editChannel(channelId, event) {
        event.stopPropagation(); // Prevent triggering the card click
        
        const channel = this.channels.find(c => c.id === channelId);
        if (!channel) return;
        
        // Open admin panel and switch to add channel tab
        this.openAdminPanel();
        
        // Switch to add channel tab
        setTimeout(() => {
            const addTab = document.querySelector('[data-tab="add"]');
            if (addTab) {
                addTab.click();
            }
            
            // Fill the form with channel data
            document.getElementById('channelName').value = channel.name;
            document.getElementById('channelUrl').value = channel.url;
            document.getElementById('channelLogo').value = channel.logo;
            document.getElementById('channelCategory').value = channel.category;
            document.getElementById('channelCountry').value = channel.country;
            
            // Change form title and button text
            const formTitle = document.querySelector('#addTab h5, #addTab .form-title');
            if (formTitle) {
                formTitle.textContent = 'تعديل القناة';
            }
            
            const submitBtn = document.querySelector('#addChannelForm button[type="submit"]');
            if (submitBtn) {
                submitBtn.textContent = 'حفظ التعديلات';
                submitBtn.className = 'add-btn edit-mode';
            }
            
            // Store the channel ID for editing
            this.editingChannelId = channelId;
            
            // Show notification
            this.showNotification('success', 'تم فتح نموذج التعديل', 'يمكنك الآن تعديل بيانات القناة');
        }, 100);
    }

    // Delete Channel Function
    deleteChannel(channelId, event) {
        event.stopPropagation(); // Prevent triggering the card click
        
        const channel = this.channels.find(c => c.id === channelId);
        if (!channel) return;
        
        // Show confirmation dialog
        if (confirm(`هل أنت متأكد من حذف قناة "${channel.name}"؟\n\nهذا الإجراء لا يمكن التراجع عنه.`)) {
            // Remove from favorites if favorited
            if (this.favorites.has(channelId)) {
                this.favorites.delete(channelId);
                this.saveFavorites();
            }
            
            // Remove from channels array
            const channelIndex = this.channels.findIndex(c => c.id === channelId);
            if (channelIndex !== -1) {
                this.channels.splice(channelIndex, 1);
            }
            
            // Update filtered channels
            this.filteredChannels = [...this.channels];
            
            // Save to localStorage
            this.saveChannelsToStorage();
            
            // Re-render channels
            this.renderChannels();
            this.renderAdminChannels();
            
            // Show success notification
            this.showNotification('success', 'تم حذف القناة', `تم حذف قناة "${channel.name}" بنجاح`);
        }
    }

    // Picture-in-Picture Functions
    async togglePictureInPicture() {
        const video = document.getElementById('videoPlayer');
        if (!video) return;

        // Check if Picture-in-Picture is supported
        if (!this.checkPictureInPictureSupport()) {
            this.showNotification('warning', 'غير مدعوم', 
                'المتصفح الحالي لا يدعم خاصية Picture-in-Picture');
            return;
        }

        try {
            if (this.isPictureInPicture) {
                // Exit Picture-in-Picture
                await document.exitPictureInPicture();
            } else {
                // Check if video is playing
                if (video.paused) {
                    this.showNotification('info', 'ابدأ التشغيل أولاً', 
                        'يجب تشغيل الفيديو قبل إخراجه خارج المتصفح');
                    return;
                }
                
                // Enter Picture-in-Picture
                await video.requestPictureInPicture();
            }
        } catch (error) {
            console.error('Picture-in-Picture error:', error);
            
            // Handle specific error cases
            if (error.name === 'NotAllowedError') {
                this.showNotification('error', 'تم رفض الطلب', 
                    'يرجى السماح للموقع بإخراج الفيديو خارج المتصفح');
            } else if (error.name === 'NotSupportedError') {
                this.showNotification('error', 'غير مدعوم', 
                    'المتصفح لا يدعم هذه الميزة');
            } else {
                this.showNotification('error', 'خطأ في Picture-in-Picture', 
                    'حدث خطأ أثناء التفعيل: ' + error.message);
            }
        }
    }

    // Handle Picture-in-Picture events
    setupPictureInPictureEvents() {
        const video = document.getElementById('videoPlayer');
        if (!video) return;

        // Listen for Picture-in-Picture enter event
        video.addEventListener('enterpictureinpicture', () => {
            this.isPictureInPicture = true;
            this.updatePictureInPictureButtons();
            this.showNotification('success', 'تم تفعيل Picture-in-Picture', 
                'يمكنك الآن مشاهدة الفيديو خارج المتصفح');
            
            // Optional: Keep modal open or close it based on user preference
            // Uncomment the next line if you want to close the modal when entering PiP
            // this.closeModal();
        });

        // Listen for Picture-in-Picture leave event
        video.addEventListener('leavepictureinpicture', () => {
            this.isPictureInPicture = false;
            this.updatePictureInPictureButtons();
            this.showNotification('info', 'تم إلغاء Picture-in-Picture', 
                'تم إرجاع الفيديو إلى المتصفح');
        });

        // Listen for Picture-in-Picture error event
        video.addEventListener('error', (event) => {
            if (this.isPictureInPicture) {
                console.error('Video error in Picture-in-Picture mode:', event);
                this.showNotification('error', 'خطأ في الفيديو', 
                    'حدث خطأ أثناء تشغيل الفيديو في وضع Picture-in-Picture');
            }
        });

        // Listen for Picture-in-Picture change event (when window is resized)
        video.addEventListener('resize', () => {
            if (this.isPictureInPicture) {
                console.log('Picture-in-Picture window resized');
            }
        });

        // Listen for page visibility change (when user switches tabs)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && this.isPictureInPicture) {
                console.log('Page hidden while in Picture-in-Picture mode');
            } else if (!document.hidden && this.isPictureInPicture) {
                console.log('Page visible while in Picture-in-Picture mode');
            }
        });

        // Listen for beforeunload event to handle cleanup
        window.addEventListener('beforeunload', () => {
            if (this.isPictureInPicture) {
                // Try to exit Picture-in-Picture before page unload
                if (document.pictureInPictureElement) {
                    document.exitPictureInPicture().catch(console.error);
                }
            }
        });

        // Listen for focus events to handle Picture-in-Picture state
        window.addEventListener('focus', () => {
            if (this.isPictureInPicture) {
                console.log('Window focused while in Picture-in-Picture mode');
            }
        });

        window.addEventListener('blur', () => {
            if (this.isPictureInPicture) {
                console.log('Window blurred while in Picture-in-Picture mode');
            }
        });
    }

    // Update Picture-in-Picture button states
    updatePictureInPictureButtons() {
        const pipHeaderBtn = document.querySelector('.pip-btn');
        
        if (pipHeaderBtn) {
            pipHeaderBtn.classList.toggle('pip-active', this.isPictureInPicture);
        }
    }

    // Check Picture-in-Picture support
    checkPictureInPictureSupport() {
        const video = document.getElementById('videoPlayer');
        if (!video) return false;

        // Check for Picture-in-Picture API support
        return (
            'pictureInPictureEnabled' in document || 
            'requestPictureInPicture' in video ||
            (document.pictureInPictureElement !== undefined)
        );
    }

    // Check and setup Picture-in-Picture support
    checkAndSetupPictureInPicture() {
        const isSupported = this.checkPictureInPictureSupport();
        
        if (!isSupported) {
            // Hide Picture-in-Picture buttons if not supported
            const pipHeaderBtn = document.querySelector('.pip-btn');
            
            if (pipHeaderBtn) {
                pipHeaderBtn.style.display = 'none';
            }
            
            console.log('Picture-in-Picture is not supported in this browser');
            
            // Show a helpful message for unsupported browsers
            setTimeout(() => {
                this.showNotification('info', 'ميزة غير مدعومة', 
                    'Picture-in-Picture غير مدعوم في هذا المتصفح. يرجى استخدام Chrome, Firefox, أو Edge الحديث');
            }, 3000);
        } else {
            console.log('Picture-in-Picture is supported in this browser');
        }
    }






    // Categories Management
    getDefaultCategories() {
        return [
            { key: 'all', name: 'جميع القنوات', icon: 'fas fa-th' },
            { key: 'news', name: 'الأخبار', icon: 'fas fa-newspaper' },
            { key: 'entertainment', name: 'الترفيه', icon: 'fas fa-tv' },
            { key: 'sports', name: 'الرياضة', icon: 'fas fa-futbol' },
            { key: 'religious', name: 'الدينية', icon: 'fas fa-pray' },
            { key: 'music', name: 'الموسيقى', icon: 'fas fa-music' },
            { key: 'movies', name: 'الأفلام', icon: 'fas fa-film' },
            { key: 'documentary', name: 'الوثائقية', icon: 'fas fa-book-open' }
        ];
    }

    loadCategories() {
        try {
            const savedCategories = localStorage.getItem('arabicTVCategories');
            if (savedCategories) {
                this.categories = JSON.parse(savedCategories);
                console.log('تم تحميل الفئات:', this.categories.length, 'فئة');
            } else {
                this.categories = this.getDefaultCategories();
                this.saveCategories();
            }
            
            // Update navigation tabs after loading categories
            this.updateNavigationTabs();
        } catch (error) {
            console.error('خطأ في تحميل الفئات:', error);
            this.categories = this.getDefaultCategories();
            this.updateNavigationTabs();
        }
    }

    saveCategories() {
        try {
            localStorage.setItem('arabicTVCategories', JSON.stringify(this.categories));
            console.log('تم حفظ الفئات بنجاح');
        } catch (error) {
            console.error('خطأ في حفظ الفئات:', error);
            this.notifyError('فشل في حفظ الفئات');
        }
    }

    renderCategories() {
        const categoriesList = document.getElementById('categoriesList');
        if (!categoriesList) return;

        categoriesList.innerHTML = '';

        // Skip 'all' category as it's not editable
        const editableCategories = this.categories.filter(cat => cat.key !== 'all');

        editableCategories.forEach((category, index) => {
            const categoryItem = document.createElement('div');
            categoryItem.className = 'category-item';
            categoryItem.innerHTML = `
                <div class="category-info">
                    <i class="${category.icon} category-icon"></i>
                    <div class="category-details">
                        <h6>${category.name}</h6>
                        <p>المفتاح: ${category.key}</p>
                    </div>
                </div>
                <div class="category-actions">
                    <button class="edit-category-btn" onclick="editCategory(${index + 1})">
                        <i class="fas fa-edit"></i>
                        تعديل
                    </button>
                    <button class="delete-category-btn" onclick="deleteCategory(${index + 1})">
                        <i class="fas fa-trash"></i>
                        حذف
                    </button>
                </div>
            `;
            categoriesList.appendChild(categoryItem);
        });
    }

    addCategory(categoryData) {
        // Check if category key already exists
        const existingCategory = this.categories.find(cat => cat.key === categoryData.key);
        if (existingCategory) {
            this.notifyError('مفتاح الفئة موجود بالفعل');
            return false;
        }

        this.categories.push(categoryData);
        this.saveCategories();
        this.renderCategories();
        this.updateNavigationTabs();
        this.updateChannelCategoryOptions();
        this.notifySuccess('تم إضافة الفئة بنجاح');
        return true;
    }

    updateCategory(index, categoryData) {
        if (index < 0 || index >= this.categories.length) return false;

        // Don't allow editing the 'all' category
        if (this.categories[index].key === 'all') {
            this.notifyError('لا يمكن تعديل فئة "جميع القنوات"');
            return false;
        }

        // Check if new key conflicts with existing categories (except current one)
        const existingCategory = this.categories.find((cat, i) => 
            cat.key === categoryData.key && i !== index
        );
        if (existingCategory) {
            this.notifyError('مفتاح الفئة موجود بالفعل');
            return false;
        }

        this.categories[index] = categoryData;
        this.saveCategories();
        this.renderCategories();
        this.updateNavigationTabs();
        this.updateChannelCategoryOptions();
        this.notifySuccess('تم تحديث الفئة بنجاح');
        return true;
    }

    deleteCategory(index) {
        if (index < 0 || index >= this.categories.length) return false;

        const category = this.categories[index];
        
        // Don't allow deleting the 'all' category
        if (category.key === 'all') {
            this.notifyError('لا يمكن حذف فئة "جميع القنوات"');
            return false;
        }

        // Check if there are channels using this category
        const channelsUsingCategory = this.channels.filter(channel => channel.category === category.key);
        if (channelsUsingCategory.length > 0) {
            const confirmDelete = confirm(
                `هناك ${channelsUsingCategory.length} قناة تستخدم هذه الفئة. هل تريد حذف الفئة وتحويل القنوات إلى فئة "الترفيه"؟`
            );
            
            if (confirmDelete) {
                // Move channels to entertainment category
                channelsUsingCategory.forEach(channel => {
                    channel.category = 'entertainment';
                });
                this.saveChannels();
            } else {
                return false;
            }
        }

        this.categories.splice(index, 1);
        this.saveCategories();
        this.renderCategories();
        this.updateNavigationTabs();
        this.updateChannelCategoryOptions();
        this.notifySuccess('تم حذف الفئة بنجاح');
        return true;
    }

    updateNavigationTabs() {
        console.log('تحديث أزرار التنقل - الفئات:', this.categories.length);
        
        // Update desktop sidebar navigation
        const sidebarNavTabsContainer = document.querySelector('.sidebar-nav-tabs');
        if (sidebarNavTabsContainer) {
            // Clear existing tabs
            sidebarNavTabsContainer.innerHTML = '';
            
            // Create new tabs for all categories
            this.categories.forEach(category => {
                const tab = document.createElement('button');
                tab.className = 'sidebar-nav-tab';
                tab.dataset.category = category.key;
                if (category.key === 'all') {
                    tab.classList.add('active');
                }
                tab.innerHTML = `<i class="${category.icon}"></i> <span>${category.name}</span> <span class="tab-count" id="${category.key}Count">0</span>`;
                
                // Add click event listener
                tab.addEventListener('click', () => {
                    this.filterChannels(category.key);
                });
                
                sidebarNavTabsContainer.appendChild(tab);
                console.log('تم إنشاء تبويب:', category.name);
            });
        } else {
            console.warn('لم يتم العثور على حاوية أزرار القائمة الجانبية');
        }
        
        // Update mobile navigation
        const mobileNavTabs = document.querySelector('.mobile-nav-tabs');
        if (mobileNavTabs) {
            mobileNavTabs.innerHTML = '';
            this.categories.forEach(category => {
                const tab = document.createElement('button');
                tab.className = 'mobile-nav-tab';
                tab.dataset.category = category.key;
                if (category.key === 'all') {
                    tab.classList.add('active');
                }
                tab.innerHTML = `<i class="${category.icon}"></i> <span>${category.name}</span> <span class="tab-count" id="mobile${category.key.charAt(0).toUpperCase() + category.key.slice(1)}Count">0</span>`;
                
                // Add click event listener
                tab.addEventListener('click', () => {
                    this.filterChannels(category.key);
                    this.closeMobileMenu();
                });
                
                mobileNavTabs.appendChild(tab);
            });
            console.log('تم تحديث قائمة الموبايل');
        } else {
            console.warn('لم يتم العثور على قائمة الموبايل');
        }
        
        // Update sidebar counts after updating all tabs
        this.updateSidebarCounts();
        
        console.log('تم الانتهاء من تحديث جميع أزرار التنقل');
    }

    updateChannelCategoryOptions() {
        const categorySelect = document.getElementById('channelCategory');
        if (categorySelect) {
            categorySelect.innerHTML = '';
            // Skip 'all' category for channel assignment
            const assignableCategories = this.categories.filter(cat => cat.key !== 'all');
            assignableCategories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.key;
                option.textContent = category.name;
                categorySelect.appendChild(option);
            });
        }
    }
}

// Global functions for inline event handlers
function openSettings() {
    app.openSettings();
}

function closeSettings() {
    app.closeSettings();
}

function openAdminPanel() {
    app.openAdminPanel();
}

function closeAdminPanel() {
    app.closeAdminPanel();
}

function openIPTVChecker() {
    window.location.href = 'iptv-checker.html';
}

function closeModal() {
    app.closeModal();
}

function closeSetupHelp() {
    const modal = document.getElementById('setupHelpModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function closeAutoDetect() {
    const modal = document.getElementById('autoDetectModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function toggleQuality() {
    app.toggleQuality();
}

function toggleQualityMenu() {
    app.toggleQualityMenu();
}

function toggleFullscreen() {
    app.toggleFullscreen();
}

function togglePictureInPicture() {
    app.togglePictureInPicture();
}

function saveGeneralSettings() {
    app.saveGeneralSettings();
}

function debugStorage() {
    app.debugStorage();
}

function closeDiagnosticModal() {
    app.closeDiagnosticModal();
}

function refreshDiagnostic() {
    app.updateDiagnosticData();
}

function openConsoleInfo() {
    console.log('=== تفاصيل تشخيص التخزين ===');
    console.log('القنوات المحملة:', app.channels);
    console.log('القنوات المفلترة:', app.filteredChannels);
    console.log('الإعدادات:', app.settings);
    console.log('Local Storage:', localStorage);
    app.notifyInfo('تم عرض التفاصيل الكاملة في Console (F12)', 'معلومات المطور');
}

// Categories Management Functions
function showAddCategoryForm() {
    const container = document.getElementById('categoryFormContainer');
    const form = document.getElementById('categoryForm');
    const title = document.getElementById('categoryFormTitle');
    const editingIndex = document.getElementById('editingCategoryIndex');
    
    // Reset form
    form.reset();
    editingIndex.value = '-1';
    title.textContent = 'إضافة فئة جديدة';
    
    // Show form
    container.style.display = 'block';
    container.scrollIntoView({ behavior: 'smooth' });
    
    // Focus on first input
    document.getElementById('categoryKey').focus();
}

function hideCategoryForm() {
    const container = document.getElementById('categoryFormContainer');
    container.style.display = 'none';
}

function editCategory(index) {
    const category = app.categories[index];
    if (!category || category.key === 'all') return;
    
    const container = document.getElementById('categoryFormContainer');
    const form = document.getElementById('categoryForm');
    const title = document.getElementById('categoryFormTitle');
    const editingIndex = document.getElementById('editingCategoryIndex');
    
    // Fill form with category data
    document.getElementById('categoryKey').value = category.key;
    document.getElementById('categoryName').value = category.name;
    document.getElementById('categoryIcon').value = category.icon;
    
    // Set editing mode
    editingIndex.value = index.toString();
    title.textContent = `تعديل فئة: ${category.name}`;
    
    // Show form
    container.style.display = 'block';
    container.scrollIntoView({ behavior: 'smooth' });
    
    // Focus on first input
    document.getElementById('categoryKey').focus();
}

function deleteCategory(index) {
    const category = app.categories[index];
    if (!category || category.key === 'all') return;
    
    const confirmDelete = confirm(`هل أنت متأكد من حذف فئة "${category.name}"؟`);
    if (confirmDelete) {
        app.deleteCategory(index);
    }
}

// Handle category form submission
document.addEventListener('DOMContentLoaded', function() {
    const categoryForm = document.getElementById('categoryForm');
    if (categoryForm) {
        categoryForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const key = document.getElementById('categoryKey').value.trim().toLowerCase();
            const name = document.getElementById('categoryName').value.trim();
            const icon = document.getElementById('categoryIcon').value;
            const editingIndex = parseInt(document.getElementById('editingCategoryIndex').value);
            
            // Validate input
            if (!key || !name || !icon) {
                app.notifyError('يرجى ملء جميع الحقول المطلوبة');
                return;
            }
            
            // Validate key format (English letters and numbers only, no spaces)
            if (!/^[a-z0-9_]+$/.test(key)) {
                app.notifyError('مفتاح الفئة يجب أن يحتوي على أحرف إنجليزية وأرقام فقط، بدون مسافات');
                return;
            }
            
            const categoryData = { key, name, icon };
            
            let success = false;
            if (editingIndex === -1) {
                // Add new category
                success = app.addCategory(categoryData);
            } else {
                // Update existing category
                success = app.updateCategory(editingIndex, categoryData);
            }
            
            if (success) {
                hideCategoryForm();
            }
        });
    }
});

// Global function for URL type detection
function detectUrlType() {
    if (window.app) {
        window.app.detectUrlType();
    }
}


// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new ArabicTVApp();
    // Initialize quality menu
    if (window.app && window.app.initQualityMenu) {
        window.app.initQualityMenu();
    }
});

// Service Worker for offline functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
