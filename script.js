// Arabic Satellite TV Channels Application
class ArabicTVApp {
    constructor() {
        this.channels = [
            // News Channels

        ];

        this.currentChannel = null;
        this.hls = null;
        this.flvPlayer = null;
        this.dashPlayer = null;
        this.mpegtsPlayer = null;
        this.isPictureInPicture = false;
        this.isLoggedIn = false;
        this.loadAttempts = 0;
        this.maxLoadAttempts = 3;
        
        // Unified toggle function for all toggle operations
        this.toggleElement = (elementId, options = {}) => {
            const element = document.getElementById(elementId);
            if (!element) return false;
            
            const {
                toggleClass = 'active',
                showClass = 'show',
                hideClass = 'hide',
                callback = null,
                preventDefault = false
            } = options;
            
            const isActive = element.classList.contains(toggleClass) || element.classList.contains(showClass);
            
            if (isActive) {
                element.classList.remove(toggleClass, showClass);
                element.classList.add(hideClass);
                element.style.display = 'none';
            } else {
                element.classList.add(toggleClass, showClass);
                element.classList.remove(hideClass);
                element.style.display = 'block';
            }
            
            if (callback && typeof callback === 'function') {
                callback(isActive);
            }
            
            return !isActive;
        };
        
        // Unified display management functions
        this.showElement = (elementId, displayType = 'block') => {
            const element = document.getElementById(elementId);
            if (element) {
                element.style.display = displayType;
                element.classList.remove('hide');
                element.classList.add('show', 'active');
            }
        };
        
        this.hideElement = (elementId) => {
            const element = document.getElementById(elementId);
            if (element) {
                element.style.display = 'none';
                element.classList.remove('show', 'active');
                element.classList.add('hide');
            }
        };
        
        this.toggleDisplay = (elementId, displayType = 'block') => {
            const element = document.getElementById(elementId);
            if (element) {
                const isHidden = element.style.display === 'none' || element.classList.contains('hide');
                if (isHidden) {
                    this.showElement(elementId, displayType);
                } else {
                    this.hideElement(elementId);
                }
                return !isHidden;
            }
            return false;
        };
        // كلمة المرور مشفرة بـ SHA-256 Hash (أكثر أماناً)
        // قراءة كلمة المرور من localStorage أو استخدام الافتراضية
        this.adminPassword = localStorage.getItem('anon_tv_admin_password') || '3129ccfbd7c678b625faa7779878bda416afa77071c0867126e7f68b0b8ed657'; // كلمة مرور @admin123 مشفرة بـ SHA-256
        this.settings = {
            autoQuality: true,
            autoplay: true,
            volume: 100,
            theme: 'dark',
            showNewsTicker: false,
            // New customization settings
            zoomLevel: 100, // 75% to 150%
            colorTheme: 'default', // default, blue, green, purple, orange, red
            layoutMode: 'compact', // grid, list, compact
            fontSize: 'small', // small, medium, large, xlarge
            animationsEnabled: false,
            compactMode: true,
            highContrast: false,
            borderRadius: 'rounded', // minimal, normal, rounded
            showAutoNotifications: false, // التحكم في الإشعارات التلقائية
            backgroundAudio: true, // تشغيل الصوت في الخلفية
            autoUpdateEnabled: true, // التحديث التلقائي للقنوات
            // إعدادات التشغيل التلقائي المحسن
            forceAutoplay: true, // فرض التشغيل التلقائي حتى لو كان محظوراً
            autoplayRetryAttempts: 3, // عدد محاولات إعادة التشغيل التلقائي
            autoplayDelay: 1000 // تأخير قبل محاولة التشغيل التلقائي
        };
        this.filteredChannels = [...this.channels];
        this.currentCategory = 'all';
        this.editingChannelId = null; // Track which channel is being edited
        this.notificationQueue = []; // Queue for notifications
        this.activeNotifications = new Set(); // Track active notifications
        this.isAutomaticUpdate = false; // Track if update is automatic
        this.originalOrder = [...this.channels]; // Track original order for comparison
        this.hasOrderChanged = false; // Track if order has been modified
        this.isMobileSidebarOpen = false; // Track mobile sidebar state
        this.isDesktopSidebarOpen = false; // Track desktop sidebar state
        this.currentCountryFilter = 'all'; // Track country filter
        this.categories = this.getDefaultCategories(); // Track categories
        this.favorites = []; // Track favorite channels
        
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

    async init() {
        this.testLocalStorage(); // Test if localStorage is working
        this.loadRemoteStorageSettings(); // Load remote storage configuration
        this.loadCategories(); // Load categories first
        this.loadChannelsFromStorage(); // Load saved channels first (priority)
        await this.loadDataFromFile(); // Load data from channels.json as fallback
        this.filteredChannels = [...this.channels]; // Ensure filtered channels match loaded channels
        this.loadSettings();
        this.loadAdminPassword(); // تحميل كلمة المرور المحفوظة
        this.loadLastUpdateTime(); // تحميل آخر تحديث محفوظ
        this.loadFavorites(); // تحميل القنوات المفضلة
        this.loadLoginState(); // تحميل حالة تسجيل الدخول بعد تحميل البيانات
        this.renderChannels(); // عرض القنوات بعد تحميل حالة تسجيل الدخول
        // إعادة عرض القنوات مرة أخرى لضمان ظهور الأيقونات بشكل صحيح
        setTimeout(() => {
            this.renderChannels();
        }, 100);
        this.bindEvents();
        this.bindRemoteStorageEvents();
        
        // Simple auto-update on page load
        this.setupAutoUpdate();
        this.syncMobileNavTabs();
        this.initializeNewFeatures(); // Initialize new navigation features (includes loadCategories)
        this.initializeFooter(); // Initialize footer functionality
        this.updateChannelStats(); // Update channel statistics
        this.updateChannelCategoryOptions(); // Update category options
        this.updateNavigationTabs(); // Update navigation tabs
        this.updateSidebarCounts(); // Update sidebar counts
        // لا نحتاج toggleChannelActions هنا لأن loadLoginState يتولى ذلك
        this.hideLoading();
        
        // إظهار الرسالة الترحيبية إذا لزم الأمر
        if (this.shouldShowWelcome()) {
            setTimeout(() => {
                this.showWelcomeModal();
            }, 1000); // تأخير قصير لضمان تحميل الواجهة
        }
        
        // تشخيص أولي
        console.log('تم تهيئة التطبيق مع', this.channels.length, 'قناة');
    }

    async loadDataFromFile() {
        // Only load from file if no channels are already loaded from localStorage
        if (this.channels && this.channels.length > 0) {
            console.log('القنوات محملة بالفعل من localStorage، تخطي تحميل channels.json');
            return;
        }
        
        try {
            const response = await fetch('channels.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            
            // Load channels from JSON file if no channels in localStorage
            if (data.channels && Array.isArray(data.channels) && data.channels.length > 0) {
                this.channels = data.channels.map(channel => ({
                    ...channel,
                    lastModified: channel.lastModified || new Date().toISOString()
                }));
                console.log('تم تحميل القنوات من channels.json:', this.channels.length, 'قناة');
            } else {
                console.log('لا توجد قنوات في channels.json، سيتم البدء بقائمة فارغة');
                this.channels = [];
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
            
            
            // Update filtered channels
            this.filteredChannels = [...this.channels];
            
            // Update sidebar counts
            this.updateSidebarCounts();
            
        } catch (error) {
            console.error('خطأ في تحميل البيانات من channels.json:', error);
            console.log('سيتم استخدام البيانات الافتراضية');
            this.channels = [];
            this.filteredChannels = [];
            this.updateSidebarCounts();
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

    loadAdminPassword() {
        try {
            const savedPassword = localStorage.getItem('anon_tv_admin_password');
            if (savedPassword) {
                this.adminPassword = savedPassword;
                console.log('تم تحميل كلمة المرور المحفوظة');
                
                // تحذير المستخدم إذا لم تكن المزامنة السحابية مفعلة (فقط عند عدم إظهار الإشعار من قبل)
                if (!this.remoteStorage.enabled && !localStorage.getItem('passwordWarningShown')) {
                    setTimeout(() => {
                        this.notifyWarning('كلمة المرور محفوظة محلياً فقط. فعّل المزامنة السحابية لاستخدامها على جميع الأجهزة');
                        localStorage.setItem('passwordWarningShown', 'true');
                    }, 3000);
                }
            } else {
                console.log('لا توجد كلمة مرور محفوظة، سيتم استخدام كلمة المرور الافتراضية');
            }
        } catch (error) {
            console.error('خطأ في تحميل كلمة المرور:', error);
            console.log('سيتم استخدام كلمة المرور الافتراضية');
        }
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

            const autoUpdateEnabledEl = document.getElementById('autoUpdateEnabled');
            if (autoUpdateEnabledEl) {
                autoUpdateEnabledEl.checked = this.settings.autoUpdateEnabled;
                console.log('التحديث التلقائي:', this.settings.autoUpdateEnabled);
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
            this.applyAutoNotifications();
            this.applyBackgroundAudio();
            this.updateAutoUpdateButton();
            
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
        
        // Update theme toggle switch state
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.checked = this.settings.theme === 'dark';
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

    applyAutoNotifications() {
        const showAutoNotifications = this.settings.showAutoNotifications;
        
        if (document.getElementById('showAutoNotifications')) {
            document.getElementById('showAutoNotifications').checked = showAutoNotifications;
        }
    }

    applyBackgroundAudio() {
        const backgroundAudio = this.settings.backgroundAudio;
        
        if (document.getElementById('backgroundAudio')) {
            document.getElementById('backgroundAudio').checked = backgroundAudio;
        }
    }

    resetNotifications() {
        // إعادة تعيين الإشعارات المحفوظة
        localStorage.removeItem('passwordWarningShown');
        localStorage.removeItem('welcomeShown');
        localStorage.removeItem('hasVisitedBefore');
        localStorage.removeItem('lastUpdateCheck');
        
        // إعادة تعيين إعداد الإشعارات التلقائية
        this.settings.showAutoNotifications = false;
        this.saveSettings();
        this.applyAutoNotifications();
        
        this.notifySuccess('تم إعادة تعيين جميع الإشعارات! ستظهر الإشعارات مرة أخرى عند الحاجة.');
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

        // Theme toggle switch event listener
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('change', (e) => {
                const isDarkMode = e.target.checked;
                this.settings.theme = isDarkMode ? 'dark' : 'light';
                this.saveSettings();
                this.applyTheme();
                console.log('تم تغيير النمط إلى:', isDarkMode ? 'داكن' : 'فاتح');
            });
        }


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

        const showAutoNotificationsCheckbox = document.getElementById('showAutoNotifications');
        if (showAutoNotificationsCheckbox) {
            showAutoNotificationsCheckbox.addEventListener('change', (e) => {
                this.settings.showAutoNotifications = e.target.checked;
                this.saveSettings();
                this.applyAutoNotifications();
            });
        }

        const backgroundAudioCheckbox = document.getElementById('backgroundAudio');
        if (backgroundAudioCheckbox) {
            backgroundAudioCheckbox.addEventListener('change', (e) => {
                this.settings.backgroundAudio = e.target.checked;
                this.saveSettings();
                this.applyBackgroundAudio();
            });
        }

        const autoUpdateEnabledCheckbox = document.getElementById('autoUpdateEnabled');
        if (autoUpdateEnabledCheckbox) {
            autoUpdateEnabledCheckbox.addEventListener('change', (e) => {
                this.settings.autoUpdateEnabled = e.target.checked;
                this.saveSettings();
                this.updateAutoUpdateButton();
                console.log('تم تغيير التحديث التلقائي إلى:', e.target.checked);
            });
        }

        // Admin panel events
        this.bindAdminEvents();
        
        // Security tab events
        this.bindSecurityEvents();
        
        // Sidebar events
        this.bindSidebarEvents();

    }

    bindAdminTabEvents() {
        // استخدام event delegation على مستوى admin-layout لضمان عمل الأحداث
        const adminModal = document.getElementById('adminModal');
        
        if (!adminModal) {
            console.warn('⚠️ لم يتم العثور على adminModal');
            return;
        }
        
        // إزالة أي مستمع سابق إذا وجد
        if (this._adminTabClickHandler) {
            adminModal.removeEventListener('click', this._adminTabClickHandler);
        }
        
        // إنشاء مستمع جديد
        this._adminTabClickHandler = (e) => {
            const tab = e.target.closest('.admin-tab');
            if (tab && tab.dataset.tab) {
                e.preventDefault();
                e.stopPropagation();
                this.switchAdminTab(tab.dataset.tab);
                console.log(`✅ تم التبديل إلى تبويب: ${tab.dataset.tab}`);
            }
        };
        
        // إضافة المستمع الجديد
        adminModal.addEventListener('click', this._adminTabClickHandler);
        
        console.log('✅ تم ربط أحداث التبويبات بنجاح');
    }

    bindStatusToggleEvents() {
        // إزالة الأحداث السابقة لتجنب التكرار
        document.querySelectorAll('.status-toggle').forEach(toggle => {
            const newToggle = toggle.cloneNode(true);
            toggle.parentNode.replaceChild(newToggle, toggle);
        });
        
        // ربط الأحداث الجديدة
        document.querySelectorAll('.status-toggle').forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const status = toggle.dataset.status;
                this.setChannelStatus(status);
            });
        });
    }

    bindVpnToggleEvents() {
        // إزالة الأحداث السابقة لتجنب التكرار
        document.querySelectorAll('.vpn-toggle').forEach(toggle => {
            const newToggle = toggle.cloneNode(true);
            toggle.parentNode.replaceChild(newToggle, toggle);
        });
        
        // ربط الأحداث الجديدة
        document.querySelectorAll('.vpn-toggle').forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const vpn = toggle.dataset.vpn === 'true';
                this.setChannelVpn(vpn);
            });
        });
    }

    setChannelStatus(status) {
        // تحديث القيمة المخفية
        const statusInput = document.getElementById('channelStatus');
        if (statusInput) {
            statusInput.value = status;
        }
        
        // تحديث واجهة المستخدم
        this.updateStatusToggleUI(status);
    }

    setChannelVpn(vpn) {
        // تحديث القيمة المخفية
        const vpnInput = document.getElementById('channelVpn');
        if (vpnInput) {
            vpnInput.value = vpn.toString();
        }
        
        // تحديث واجهة المستخدم
        this.updateVpnToggleUI(vpn);
    }

    updateStatusToggleUI(status) {
        // التأكد من وجود العناصر
        const toggles = document.querySelectorAll('.status-toggle');
        if (toggles.length === 0) {
            return;
        }
        
        // إزالة الكلاس النشط من جميع التبديلات
        toggles.forEach(toggle => {
            toggle.classList.remove('active');
        });
        
        // إضافة الكلاس النشط للتبديل المحدد
        const activeToggle = document.querySelector(`[data-status="${status}"]`);
        if (activeToggle) {
            activeToggle.classList.add('active');
        }
        
        // تحديث الأيقونات
        document.querySelectorAll('.status-icon').forEach(icon => {
            icon.classList.remove('active', 'inactive');
            const toggle = icon.closest('.status-toggle');
            if (toggle) {
                const toggleStatus = toggle.dataset.status;
                if (toggleStatus === status) {
                    icon.classList.add('active');
                } else {
                    icon.classList.add('inactive');
                }
            }
        });
    }

    updateVpnToggleUI(vpn) {
        // تحديث القيمة المخفية أولاً
        const vpnInput = document.getElementById('channelVpn');
        if (vpnInput) {
            vpnInput.value = vpn.toString();
        }
        
        // التأكد من وجود العناصر
        const toggles = document.querySelectorAll('.vpn-toggle');
        if (toggles.length === 0) {
            return;
        }
        
        // إزالة الكلاس النشط من جميع التبديلات
        toggles.forEach(toggle => {
            toggle.classList.remove('active');
        });
        
        // إضافة الكلاس النشط للتبديل المحدد
        const activeToggle = document.querySelector(`[data-vpn="${vpn}"]`);
        if (activeToggle) {
            activeToggle.classList.add('active');
        }
        
        // تحديث الأيقونات
        document.querySelectorAll('.vpn-icon').forEach(icon => {
            const toggle = icon.closest('.vpn-toggle');
            if (toggle) {
                const toggleVpn = toggle.dataset.vpn === 'true';
                if (toggleVpn === vpn) {
                    icon.style.color = '';
                } else {
                    icon.style.color = 'var(--text-muted)';
                }
            }
        });
    }

    bindAdminEvents() {
        // Admin tabs - إضافة تأخير للتأكد من وجود العناصر
        setTimeout(() => {
            this.bindAdminTabEvents();
        }, 100);

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

            // Mobile menu handling is now integrated in the main keyboard shortcuts handler
    }

    bindSecurityEvents() {
        // ربط أحداث تغيير كلمة المرور
        setTimeout(() => {
            const changePasswordForm = document.getElementById('changePasswordForm');
            if (changePasswordForm) {
                changePasswordForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.changePassword();
                });
            }

            // ربط أحداث حقول كلمة المرور
            const newPasswordInput = document.getElementById('newPassword');
            const confirmPasswordInput = document.getElementById('confirmPassword');

            if (newPasswordInput) {
                newPasswordInput.addEventListener('input', (e) => {
                    const password = e.target.value;
                    this.updatePasswordStrength(password);
                    this.updatePasswordRequirements(password);
                    
                    // تحديث مؤشر التطابق إذا كان حقل التأكيد مملوء
                    const confirmPassword = document.getElementById('confirmPassword').value;
                    if (confirmPassword.length > 0) {
                        this.updatePasswordMatch(password, confirmPassword);
                    }
                });
            }

            if (confirmPasswordInput) {
                confirmPasswordInput.addEventListener('input', (e) => {
                    const newPassword = document.getElementById('newPassword').value;
                    const confirmPassword = e.target.value;
                    this.updatePasswordMatch(newPassword, confirmPassword);
                });
            }
        }, 100);
    }

    bindSidebarEvents() {
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
        
        // إضافة رسالة تشخيصية إذا لم توجد قنوات
        if (!this.filteredChannels || this.filteredChannels.length === 0) {
            console.log('لا توجد قنوات للعرض - القنوات المحملة:', this.channels.length);
            grid.innerHTML = `
                <div class="no-channels-message">
                    <i class="fas fa-tv"></i>
                    <h3>لا توجد قنوات متاحة</h3>
                    <p>اضغط على زر "تحديث القنوات" لتحميل القنوات من الخادم</p>
                    <button class="update-channels-btn" onclick="updateChannels()">
                        <i class="fas fa-sync-alt"></i>
                        تحديث القنوات
                    </button>
                </div>
            `;
            return;
        }

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
        
        // العثور على رقم القناة (الفهرس + 1)
        const channelIndex = this.channels.findIndex(ch => ch.id === channel.id);
        const channelNumber = channelIndex + 1;
        
        card.innerHTML = `
            <div class="channel-number">${channelNumber}</div>
            <img src="${channel.logo}" alt="${channel.name}" class="channel-logo" 
                 loading="lazy" decoding="async"
                 onerror="this.src='${logoPlaceholder}'; this.classList.add('placeholder-logo');">
            <div class="channel-info">
                <h3 class="channel-name">${channel.name}</h3>
                <div class="channel-meta">
                    <span class="channel-country">${channel.country}</span>
                    <span class="channel-category">${this.getCategoryName(channel.category)}</span>
                    ${channel.vpn === true ? '<span class="channel-vpn-badge"><i class="fas fa-shield-alt"></i> VPN</span>' : ''}
                </div>
            </div>
        `;

        // حاول استخدام WebP إن توفر
        const imgEl = card.querySelector('.channel-logo');
        this.applyWebpLogo(imgEl, channel.logo);

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

    // محاولة استخدام WebP للشعارات إن كان المتصفح يدعم والصورة متوفرة
    applyWebpLogo(imgEl, originalUrl) {
        try {
            if (!imgEl || !originalUrl) return;
            // إذا كان الرابط بالفعل WebP، لا حاجة للتبديل
            if (/\.webp(\?|$|#)/i.test(originalUrl)) return;
            
            if (!this.browserSupportsWebp()) return;
            
            const candidate = this.toWebpUrl(originalUrl);
            if (!candidate || candidate === originalUrl) return;
            
            const testImg = new Image();
            testImg.onload = () => {
                // الصورة WebP موجودة وتعمل
                imgEl.src = candidate;
                imgEl.dataset.fallback = originalUrl;
            };
            testImg.onerror = () => {
                // تجاهل، سيبقى على النسخة الأصلية أو يتجه للـ placeholder عبر onerror
            };
            testImg.decoding = 'async';
            testImg.loading = 'eager';
            testImg.src = candidate;
        } catch (e) {
            console.log('WEBP apply error:', e);
        }
    }

    browserSupportsWebp() {
        try {
            const elem = document.createElement('canvas');
            if (!!(elem.getContext && elem.getContext('2d'))) {
                // was able or not to get WebP representation
                return elem.toDataURL('image/webp').indexOf('data:image/webp') === 0;
            }
            return false;
        } catch (e) {
            return false;
        }
    }

    toWebpUrl(url) {
        try {
            // يحافظ على الاستعلام إن وجد
            const match = url.match(/^(.*)\.(png|jpg|jpeg)(\?.*)?$/i);
            if (!match) return url;
            const base = match[1];
            const query = match[3] || '';
            return `${base}.webp${query}`;
        } catch (e) {
            return url;
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


    filterChannels(category) {
        console.log('تصفية القنوات حسب الفئة:', category);
        this.currentCategory = category;
        
        // Handle favorites category
        if (category === 'favorites') {
            this.filteredChannels = this.channels.filter(ch => this.isFavorite(ch.id));
            this.renderChannels();
            this.updateChannelStats();
            this.updateBreadcrumbs();
            
            // Update active tab
            const allTabs = document.querySelectorAll('.sidebar-nav-tab, .mobile-sidebar-nav-tab');
            allTabs.forEach(tab => {
                tab.classList.remove('active');
            });
            const activeTabs = document.querySelectorAll(`[data-category="${category}"]`);
            activeTabs.forEach(tab => {
                tab.classList.add('active');
            });
            
            // Scroll to top
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            return;
        }
        
        // عند تغيير الفئة، أزل قائمة البحث المخصصة من شريط القنوات
        if (window.channelBarCustomList) {
            window.channelBarCustomList = null;
        }
        
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

        // Scroll to top when category is selected (both mobile and desktop)
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

        // Use the new unified filter system
        this.applyAllFilters();
        
        // Sync with player category filter
        if (typeof window.currentPlayerCategoryFilter !== 'undefined' && window.currentPlayerCategoryFilter !== category) {
            window.currentPlayerCategoryFilter = category;
            if (typeof updatePlayerCategoryDropdown === 'function') {
                updatePlayerCategoryDropdown();
            }
            
            // Update channel bar if it's open
            const channelBar = document.getElementById('channelBar');
            if (channelBar && channelBar.classList.contains('show')) {
                if (typeof loadChannelBarContentWithFilter === 'function') {
                    loadChannelBarContentWithFilter(category);
                }
            }
        }
    }

    searchChannels(query) {
        // Use the new unified filter system
        this.applyAllFilters();
        
        // عند البحث، اربط نتيجة التصفية الحالية بالقائمة المخصصة لشريط القنوات
        const q = (query || '').trim();
        if (q.length > 0) {
            window.channelBarCustomList = [...this.filteredChannels];
        } else {
            window.channelBarCustomList = null;
        }
        
        // Scroll to top when searching on desktop
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    async playChannel(channel) {
        // Prevent multiple simultaneous channel loads
        if (this.isLoadingChannel) {
            console.log('Channel loading in progress, skipping...');
            return;
        }
        
        // If same channel is already playing, don't reload
        if (this.currentChannel && this.currentChannel.id === channel.id) {
            console.log('Same channel already playing, skipping...');
            return;
        }
        
        // Check if channel is inactive
        if (channel.status === 'inactive') {
            this.showInactiveChannelMessage(channel);
            return;
        }
        
        this.isLoadingChannel = true;
        this.currentChannel = channel;
        
        // Reset load attempts counter for new channel
        this.loadAttempts = 0;
        
        this.showVideoModal(channel);
        
        // Auto-detect stream type using the new detection system
        const streamType = this.detectStreamType(channel.url);
        console.log('🔍 نوع البث المكتشف:', streamType, 'للقناة:', channel.name);
        
        try {
            await this.loadVideoStream(channel.url, streamType);
            
            // Preload next channel for faster switching
            this.preloadNextChannel(channel);
            
        } finally {
            this.isLoadingChannel = false;
        }
        
        // Channel bar remains visible when playing a channel for better navigation
    }
    
    // Preload next channel for faster switching
    preloadNextChannel(currentChannel) {
        try {
            // Find current channel index
            const currentIndex = this.filteredChannels.findIndex(ch => ch.id === currentChannel.id);
            
            if (currentIndex === -1 || currentIndex >= this.filteredChannels.length - 1) {
                return; // No next channel
            }
            
            const nextChannel = this.filteredChannels[currentIndex + 1];
            
            // Skip if next channel is inactive
            if (nextChannel.status === 'inactive') {
                return;
            }
            
            console.log('📥 Preloading next channel:', nextChannel.name);
            
            // Preload using DNS prefetch and link preconnect
            const url = new URL(nextChannel.url);
            
            // Create DNS prefetch
            const dnsPrefetch = document.createElement('link');
            dnsPrefetch.rel = 'dns-prefetch';
            dnsPrefetch.href = url.origin;
            dnsPrefetch.id = 'preload-dns';
            
            // Remove old prefetch if exists
            const oldDns = document.getElementById('preload-dns');
            if (oldDns) oldDns.remove();
            
            document.head.appendChild(dnsPrefetch);
            
            // Create preconnect
            const preconnect = document.createElement('link');
            preconnect.rel = 'preconnect';
            preconnect.href = url.origin;
            preconnect.crossOrigin = 'anonymous';
            preconnect.id = 'preload-connect';
            
            // Remove old preconnect if exists
            const oldConnect = document.getElementById('preload-connect');
            if (oldConnect) oldConnect.remove();
            
            document.head.appendChild(preconnect);
            
            console.log('✅ Preloaded next channel DNS/connection');
            
        } catch (error) {
            console.warn('Error preloading next channel:', error);
        }
    }

    showVideoModal(channel) {
        const modal = document.getElementById('videoModal');
        const title = document.getElementById('channelTitle');
        const countryText = document.querySelector('.country-text');
        const vpnIndicator = document.getElementById('channelVpnIndicator');
        
        title.textContent = channel.name;
        countryText.textContent = channel.country || '-';
        
        // Show/hide VPN indicator
        if (channel.vpn === true) {
            vpnIndicator.style.display = 'flex';
        } else {
            this.hideElement('channelVpnIndicator');
        }
        
        // Channel logo overlay is now hidden
        
        modal.classList.add('active');
        
        // Show video loading
        document.getElementById('videoLoading').style.display = 'flex';
        
        // Auto-show channel bar on mobile
        if (window.innerWidth <= 768) {
            setTimeout(() => {
                const channelBar = document.getElementById('channelBar');
                const channelsBtn = document.querySelector('.channels-btn');
                if (channelBar && !channelBar.classList.contains('show')) {
                    showChannelBar();
                    if (channelsBtn) {
                        channelsBtn.classList.add('active');
                    }
                }
            }, 100);
        } else {
            // على الكمبيوتر: إذا كان هناك قائمة بحث مخصصة فعِّل الشريط تلقائياً
            if (window.channelBarCustomList && window.channelBarCustomList.length > 0) {
                const channelBar = document.getElementById('channelBar');
                if (channelBar && !channelBar.classList.contains('show')) {
                    showChannelBar();
                } else {
                    // تأكد من تحميل القائمة الحالية
                    loadChannelBarContent();
                }
            }
        }
        
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
        
        // Setup channel bar event listeners
        this.setupChannelBarEvents();
        
        // Update active channel in channel bar if it's visible
        this.updateActiveChannelInBar(channel);
        
        // Update player category dropdown to maintain filter state
        updatePlayerCategoryDropdown();
    }

    showInactiveChannelMessage(channel) {
        const modal = document.getElementById('videoModal');
        const title = document.getElementById('channelTitle');
        const countryText = document.querySelector('.country-text');
        const vpnIndicator = document.getElementById('channelVpnIndicator');
        const loading = document.getElementById('videoLoading');
        
        // Set channel info
        title.textContent = channel.name;
        countryText.textContent = channel.country || '-';
        
        // Hide VPN indicator for inactive channels
        vpnIndicator.style.display = 'none';
        
        // Show modal
        modal.classList.add('active');
        
        // Show inactive channel message
        loading.style.display = 'flex';
        loading.innerHTML = `
            <div class="loading-spinner">
                <div class="spinner"></div>
                <p>القناة متوقفة مؤقتاً</p>
            </div>
        `;
        
        // Show video player for retry functionality
        const video = document.getElementById('videoPlayer');
        if (video) {
            video.style.display = 'block';
        }
    }

    // دالة لإيقاف البث مؤقتاً عند إخفاء الصفحة
    pauseCurrentVideo() {
        try {
            const video = document.getElementById('videoPlayer');
            if (video && !video.paused) {
                video.pause();
                console.log('⏸️ تم إيقاف الفيديو مؤقتاً');
            }
            
            // إيقاف aflam iframe مؤقتاً
            const aflamIframe = document.getElementById('aflamPlayer');
            if (aflamIframe) {
                try {
                    if (aflamIframe.contentWindow) {
                        aflamIframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
                    }
                } catch (e) {
                    console.log('Cannot pause aflam iframe');
                }
            }
            
            // إيقاف elahmad iframe مؤقتاً
            const elahmadIframe = document.getElementById('elahmadPlayer');
            if (elahmadIframe) {
                try {
                    if (elahmadIframe.contentWindow) {
                        elahmadIframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
                    }
                } catch (e) {
                    console.log('Cannot pause elahmad iframe');
                }
            }
            
        } catch (error) {
            console.log('Error pausing current video:', error);
        }
    }
    
    // دالة لاستئناف البث عند إظهار الصفحة
    resumeCurrentVideo() {
        try {
            const video = document.getElementById('videoPlayer');
            if (video && video.paused && this.currentChannel) {
                video.play().catch(console.error);
                console.log('▶️ تم استئناف الفيديو');
            }
            
            // استئناف aflam iframe
            const aflamIframe = document.getElementById('aflamPlayer');
            if (aflamIframe) {
                try {
                    if (aflamIframe.contentWindow) {
                        aflamIframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
                    }
                } catch (e) {
                    console.log('Cannot resume aflam iframe');
                }
            }
            
            // استئناف elahmad iframe
            const elahmadIframe = document.getElementById('elahmadPlayer');
            if (elahmadIframe) {
                try {
                    if (elahmadIframe.contentWindow) {
                        elahmadIframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
                    }
                } catch (e) {
                    console.log('Cannot resume elahmad iframe');
                }
            }
            
        } catch (error) {
            console.log('Error resuming current video:', error);
        }
    }

    // دالة مساعدة لتنظيف جميع أنواع البث
    cleanupAllMedia() {
        console.log('🧹 تنظيف جميع أنواع البث...');
        
        // تنظيف aflam iframe - بدون حذف العنصر، فقط إيقاف وإخفاء
        const aflamIframe = document.getElementById('aflamPlayer');
        if (aflamIframe) {
            console.log('🛑 تنظيف aflam iframe...');
            
            try {
                if (aflamIframe.contentWindow) {
                    aflamIframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
                    aflamIframe.contentWindow.postMessage('{"event":"command","func":"stopVideo","args":""}', '*');
                    aflamIframe.contentWindow.postMessage('{"event":"command","func":"pause","args":""}', '*');
                }
            } catch (e) {
                console.log('Cannot access aflam iframe content');
            }
            
            // إفراغ المصدر وإخفاء iframe بدلاً من حذفه
            aflamIframe.src = 'about:blank';
            aflamIframe.style.display = 'none';
            console.log('✅ تم إيقاف وإخفاء aflam iframe');
        }
        
        // تنظيف elahmad iframe - بدون حذف العنصر، فقط إيقاف وإخفاء
        const elahmadIframe = document.getElementById('elahmadPlayer');
        if (elahmadIframe) {
            console.log('🛑 تنظيف elahmad iframe...');
            
            try {
                if (elahmadIframe.contentWindow) {
                    elahmadIframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
                }
            } catch (e) {
                console.log('Cannot access elahmad iframe content');
            }
            
            // إفراغ المصدر وإخفاء iframe بدلاً من حذفه
            elahmadIframe.src = 'about:blank';
            elahmadIframe.style.display = 'none';
            console.log('✅ تم إيقاف وإخفاء elahmad iframe');
        }
        
        // تنظيف HLS instance للـ SHLS streams
        if (this.hls) {
            console.log('🛑 تنظيف HLS instance...');
            try {
                this.hls.destroy();
                this.hls = null;
                console.log('✅ تم تنظيف HLS player');
            } catch (e) {
                console.log('Error destroying HLS:', e);
            }
        }
        
        // تنظيف FLV player
        if (this.flvPlayer) {
            console.log('🛑 تنظيف FLV player...');
            try {
                this.flvPlayer.pause();
                this.flvPlayer.unload();
                this.flvPlayer.detachMediaElement();
                this.flvPlayer.destroy();
                this.flvPlayer = null;
                console.log('✅ تم تنظيف FLV player');
            } catch (e) {
                console.log('Error destroying FLV player:', e);
            }
        }
        
        // تنظيف DASH player
        if (this.dashPlayer) {
            console.log('🛑 تنظيف DASH player...');
            try {
                this.dashPlayer.reset();
                this.dashPlayer = null;
                console.log('✅ تم تنظيف DASH player');
            } catch (e) {
                console.log('Error destroying DASH player:', e);
            }
        }
        
        // تنظيف mpegts player
        if (this.mpegtsPlayer) {
            console.log('🛑 تنظيف mpegts player...');
            try {
                this.mpegtsPlayer.pause();
                this.mpegtsPlayer.unload();
                this.mpegtsPlayer.detachMediaElement();
                this.mpegtsPlayer.destroy();
                this.mpegtsPlayer = null;
                console.log('✅ تم تنظيف mpegts player');
            } catch (e) {
                console.log('Error destroying mpegts player:', e);
            }
        }
        
        // تنظيف YouTube iframe - بدون حذف العنصر، فقط إيقاف وإخفاء
        const youtubeIframe = document.getElementById('youtubePlayer');
        if (youtubeIframe) {
            console.log('🛑 تنظيف YouTube iframe...');
            
            // إفراغ المصدر وإخفاء iframe بدلاً من حذفه
            youtubeIframe.src = 'about:blank';
            youtubeIframe.style.display = 'none';
            console.log('✅ تم إيقاف وإخفاء YouTube iframe');
        }
        
        // تنظيف إضافي للذاكرة
        try {
            // إيقاف جميع العناصر الصوتية والفيديو في الصفحة
            const allVideos = document.querySelectorAll('video');
            allVideos.forEach(video => {
                if (!video.paused) {
                    video.pause();
                }
                video.currentTime = 0;
                video.src = '';
            });
            
            const allAudios = document.querySelectorAll('audio');
            allAudios.forEach(audio => {
                if (!audio.paused) {
                    audio.pause();
                }
                audio.currentTime = 0;
                audio.src = '';
            });
            
            // تنظيف MediaSession إذا كان موجوداً
            if ('mediaSession' in navigator) {
                navigator.mediaSession.setActionHandler('play', null);
                navigator.mediaSession.setActionHandler('pause', null);
                navigator.mediaSession.setActionHandler('stop', null);
            }
            
        } catch (memoryCleanupError) {
            console.log('Error in memory cleanup:', memoryCleanupError);
        }
        
        console.log('✅ تم تنظيف جميع أنواع البث والذاكرة بنجاح');
    }

    stopCurrentVideo() {
        const video = document.getElementById('videoPlayer');
        const source = document.getElementById('videoSource');
        
        try {
            // تنظيف جميع أنواع البث أولاً
            this.cleanupAllMedia();
            
            // Pause and reset video
            if (video) {
                video.pause();
                video.currentTime = 0;
                video.src = '';
                video.load();
                video.style.display = 'block'; // Show video element
            }
            
            // Clear source
            if (source) {
                source.src = '';
            }
            
            // Destroy HLS instance if exists
            if (this.hls) {
                this.hls.destroy();
                this.hls = null;
            }
            
            // Clear YouTube player if exists
            if (this.youtubePlayer) {
                this.youtubePlayer.destroy();
                this.youtubePlayer = null;
            }
            
            // تنظيف جميع أنواع البث يتم الآن في دالة cleanupAllMedia()
            
            console.log('Current video stopped successfully');
        } catch (error) {
            console.error('Error stopping current video:', error);
        }
    }

    async loadVideoStream(url, type = 'hls') {
        const video = document.getElementById('videoPlayer');
        const source = document.getElementById('videoSource');
        const loading = document.getElementById('videoLoading');

        try {
            // Ensure video player is visible
            if (video) {
                video.style.display = 'block';
            }
            
            // Validate URL
            if (!url || url.trim() === '') {
                throw new Error('رابط الفيديو فارغ أو غير صحيح');
            }

            // Stop current video completely to prevent conflicts
            this.stopCurrentVideo();
            
            // تنظيف إضافي لضمان عدم استمرار البث السابق
            this.cleanupAllMedia();

            // Show loading
            loading.style.display = 'flex';
            loading.innerHTML = `
                <div class="spinner"></div>
            `;

            // Auto-detect stream type if not provided
            if (type === 'hls' || type === 'auto') {
                type = this.detectStreamType(url);
                console.log('🔍 تم كشف نوع البث:', type);
            }

            // Route to appropriate loader based on detected type
            switch (type) {
                case 'youtube':
                    const currentQuality = this.getCurrentQuality();
                    await this.loadYouTubeVideo(url, currentQuality);
                    return;

                case 'elahmad':
                    await this.loadElahmadVideo(url);
                    return;

                case 'aflam':
                    await this.loadAflamVideo(url);
                    return;

                case 'shls':
                    await this.loadShlsVideo(url);
                    return;

                case 'mp4':
                    await this.loadMp4Video(url);
                    return;

                case 'webm':
                    await this.loadWebMVideo(url);
                    return;

                case 'flv':
                    await this.loadFlvVideo(url);
                    return;

                case 'rtmp':
                    await this.loadRtmpVideo(url);
                    return;

                case 'rtsp':
                    await this.loadRtspVideo(url);
                    return;

                case 'dash':
                    await this.loadDashVideo(url);
                    return;

                case 'webrtc':
                    await this.loadWebRtcVideo(url);
                    return;

                case 'direct':
                    // Try to load as direct video
                    await this.loadDirectVideo(url);
                    return;

                case 'hls':
                default:
                    // Continue with HLS processing below
                    break;
            }

            // HLS streaming
            if (typeof Hls !== 'undefined' && Hls.isSupported()) {
                // Ensure previous HLS instance is destroyed
                if (this.hls) {
                    this.hls.destroy();
                    this.hls = null;
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
                    
                    // تشغيل تلقائي محسن
                    if (this.settings.autoplay) {
                        this.enhancedAutoplay(video);
                    }
                    
                    // Initialize quality display
                    this.updateQualityDisplayFromHLS();
                    
                    // Setup Media Session for background audio
                    setupMediaSession();
                });

                this.hls.on(Hls.Events.ERROR, (event, data) => {
                    console.error('HLS Error:', data);
                    
                    // Show generic loading message instead of specific errors
                    this.showVideoError('جارٍ تحميل البث...');
                    
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
                    this.enhancedAutoplay(video);
                }
                
                // Update quality display for native HLS
                this.updateQualityDisplayFromNativeHLS();
                
                // Setup Media Session for background audio
                setupMediaSession();
            } else if (typeof Hls === 'undefined') {
                throw new Error('مكتبة HLS.js غير محملة - تحقق من اتصال الإنترنت');
            } else {
                throw new Error('HLS not supported');
            }

            // Set volume
            video.volume = this.settings.volume / 100;
            
            // Enable background audio if setting is enabled
            if (this.settings.backgroundAudio) {
                video.setAttribute('playsinline', 'true');
                video.setAttribute('webkit-playsinline', 'true');
                video.setAttribute('x5-playsinline', 'true');
                video.setAttribute('x5-video-player-type', 'h5');
                video.setAttribute('x5-video-player-fullscreen', 'false');
            }

        } catch (error) {
            console.error('Error loading video:', error);
            this.showVideoError('جارٍ تحميل البث...');
            this.handleVideoError();
        }
    }

    updateQualityDisplayFromNativeHLS() {
        const qualityDisplay = document.getElementById('currentQualityText');
        if (qualityDisplay) {
            qualityDisplay.textContent = 'تلقائي (Safari)';
        }
    }

    showVideoError(message) {
        const loading = document.getElementById('videoLoading');
        
        // Check if current channel requires VPN and show appropriate message
        if (this.currentChannel && this.currentChannel.vpn === true) {
            loading.innerHTML = `
                <div class="loading-spinner">
                    <div class="spinner"></div>
                    <p>يتطلب VPN</p>
                </div>
            `;
        } else {
            loading.innerHTML = `
                <div class="loading-spinner">
                    <div class="spinner"></div>
                    <p>جارٍ تحميل البث...</p>
                </div>
            `;
        }
    }
    
    // Enhanced autoplay function with retry mechanism
    async enhancedAutoplay(video, retryCount = 0) {
        const maxRetries = this.settings.autoplayRetryAttempts || 3;
        
        try {
            // محاولة التشغيل مباشرة بدون كتم الصوت
            video.muted = false;
            
            // انتظار قصير قبل المحاولة
            await new Promise(resolve => setTimeout(resolve, this.settings.autoplayDelay || 1000));
            
            await video.play();
            console.log('✅ تم تشغيل الفيديو تلقائياً بنجاح');
            
            // تأكيد بقاء الصوت مفعل
            setTimeout(() => {
                if (video.muted) {
                    video.muted = false;
                }
            }, 300);
            
            return true;
            
        } catch (error) {
            console.warn(`⚠️ فشل التشغيل التلقائي (محاولة ${retryCount + 1}/${maxRetries}):`, error.message);
            
            if (retryCount < maxRetries - 1) {
                // إعادة المحاولة مع تأخير أطول
                await new Promise(resolve => setTimeout(resolve, (retryCount + 1) * 1000));
                return this.enhancedAutoplay(video, retryCount + 1);
            } else {
                // فشلت جميع المحاولات - محاولة أخيرة مع كتم الصوت
                console.log('🔄 محاولة أخيرة مع كتم الصوت...');
                try {
                    video.muted = true;
                    await video.play();
                    // إلغاء كتم الصوت بعد التشغيل
                    setTimeout(() => {
                        video.muted = false;
                        console.log('🔊 تم إلغاء كتم الصوت بعد التشغيل');
                    }, 500);
                    return true;
                } catch (finalError) {
                    console.error('❌ فشلت جميع المحاولات:', finalError);
                    // إخفاء شاشة التحميل فقط
                    const loading = document.getElementById('videoLoading');
                    if (loading) {
                        loading.style.display = 'none';
                    }
                    return false;
                }
            }
        }
    }
    
    // Attempt autoplay for Aflam4You iframe
    attemptAflamAutoplay(iframe) {
        try {
            console.log('🎬 محاولة التشغيل التلقائي لـ Aflam4You...');
            
            // محاولة العثور على عنصر الفيديو داخل iframe
            if (iframe.contentDocument) {
                const videos = iframe.contentDocument.querySelectorAll('video');
                if (videos.length > 0) {
                    const video = videos[0];
                    // إلغاء كتم الصوت بشكل فوري
                    video.muted = false;
                    video.volume = 1.0; // تعيين مستوى الصوت إلى الأقصى
                    
                    video.play().then(() => {
                        console.log('✅ تم تشغيل الفيديو تلقائياً في Aflam4You');
                        // تأكيد بقاء الصوت مفعل بشكل متكرر
                        const unmuteInterval = setInterval(() => {
                            if (video.muted) {
                                video.muted = false;
                                video.volume = 1.0;
                                console.log('🔊 إعادة تفعيل الصوت في Aflam4You');
                            }
                        }, 100);
                        
                        // إيقاف المراقبة بعد 5 ثوان
                        setTimeout(() => {
                            clearInterval(unmuteInterval);
                            console.log('✅ تم إيقاف مراقبة الصوت في Aflam4You');
                        }, 5000);
                    }).catch(error => {
                        console.warn('⚠️ فشل التشغيل التلقائي في Aflam4You:', error.message);
                        // محاولة التشغيل مع كتم الصوت ثم إلغاء الكتم
                        video.muted = true;
                        video.play().then(() => {
                            console.log('✅ تم تشغيل الفيديو مع كتم الصوت في Aflam4You');
                            // إلغاء كتم الصوت بعد التشغيل
                            setTimeout(() => {
                                video.muted = false;
                                video.volume = 1.0;
                                console.log('🔊 تم إلغاء كتم الصوت في Aflam4You');
                            }, 500);
                        }).catch(err => {
                            console.error('❌ فشل التشغيل حتى مع كتم الصوت:', err);
                            // إخفاء شاشة التحميل فقط بدون إظهار زر
                            const loading = document.getElementById('videoLoading');
                            if (loading) {
                                loading.style.display = 'none';
                            }
                        });
                    });
                } else {
                    // محاولة النقر على زر التشغيل إذا وُجد
                    this.clickAflamPlayButton(iframe);
                }
            } else {
                // Cross-origin - محاولة النقر على زر التشغيل
                this.clickAflamPlayButton(iframe);
            }
        } catch (error) {
            console.warn('⚠️ خطأ في محاولة التشغيل التلقائي لـ Aflam4You:', error.message);
            // إخفاء شاشة التحميل فقط
            const loading = document.getElementById('videoLoading');
            if (loading) {
                loading.style.display = 'none';
            }
        }
    }
    
    // Click play button in Aflam4You iframe
    clickAflamPlayButton(iframe) {
        try {
            console.log('🖱️ محاولة النقر على زر التشغيل في Aflam4You...');
            
            if (iframe.contentDocument) {
                // البحث عن أزرار التشغيل المختلفة
                const playButtons = [
                    'button[class*="play"]',
                    'button[class*="Play"]',
                    '.play-button',
                    '.PlayButton',
                    'button[title*="play"]',
                    'button[title*="Play"]',
                    'button[aria-label*="play"]',
                    'button[aria-label*="Play"]',
                    '.video-play-button',
                    '.player-play-button'
                ];
                
                for (const selector of playButtons) {
                    const button = iframe.contentDocument.querySelector(selector);
                    if (button) {
                        button.click();
                        console.log('✅ تم النقر على زر التشغيل في Aflam4You');
                        return;
                    }
                }
                
                // البحث عن عناصر الفيديو والنقر عليها
                const videos = iframe.contentDocument.querySelectorAll('video');
                videos.forEach(video => {
                    video.click();
                    console.log('✅ تم النقر على الفيديو في Aflam4You');
                });
            }
        } catch (error) {
            console.warn('⚠️ فشل النقر على زر التشغيل في Aflam4You:', error.message);
        }
    }
    
    // Hide ads and attempt autoplay in Aflam4You
    hideAflamAdsAndAutoplay(iframe) {
        try {
            console.log('🚫 محاولة إخفاء الإعلانات والتشغيل التلقائي في Aflam4You...');
            
            if (iframe.contentDocument) {
                // إخفاء الإعلانات
                const adSelectors = [
                    '[class*="ad"]',
                    '[class*="advertisement"]',
                    '[class*="popup"]',
                    '[class*="unmute"]',
                    '[id*="ad"]',
                    '[id*="advertisement"]'
                ];
                
                adSelectors.forEach(selector => {
                    const elements = iframe.contentDocument.querySelectorAll(selector);
                    elements.forEach(element => {
                        element.style.display = 'none';
                        console.log('🚫 تم إخفاء عنصر إعلاني في Aflam4You');
                    });
                });
                
                // إزالة النصوص الإعلانية
                const textNodes = iframe.contentDocument.querySelectorAll('*');
                textNodes.forEach(node => {
                    if (node.textContent && (
                        node.textContent.includes('unmute') ||
                        node.textContent.includes('click here') ||
                        node.textContent.includes('advertisement')
                    )) {
                        node.style.display = 'none';
                    }
                });
                
                // محاولة التشغيل التلقائي بعد إخفاء الإعلانات
                setTimeout(() => {
                    this.attemptAflamAutoplay(iframe);
                }, 1000);
            }
        } catch (error) {
            console.warn('⚠️ خطأ في إخفاء الإعلانات في Aflam4You:', error.message);
        }
    }
    
    // Force unmute for Aflam4You iframe
    forceUnmuteAflam(iframe) {
        try {
            if (iframe.contentDocument) {
                const videos = iframe.contentDocument.querySelectorAll('video');
                videos.forEach(video => {
                    video.muted = false;
                    video.volume = 1.0;
                    console.log('🔊 تم فرض إلغاء كتم الصوت في Aflam4You');
                });
            }
        } catch (error) {
            // Cross-origin error متوقع
            console.log('⚠️ لا يمكن الوصول لـ iframe content (Cross-origin)');
        }
    }

    handleVideoError() {
        const loading = document.getElementById('videoLoading');
        
        // Check if current channel is inactive
        if (this.currentChannel && this.currentChannel.status === 'inactive') {
            loading.innerHTML = `
                <div class="loading-spinner">
                    <div class="spinner"></div>
                    <p>القناة متوقفة مؤقتاً</p>
                </div>
            `;
            
            // Show video player for retry functionality
            const video = document.getElementById('videoPlayer');
            if (video) {
                video.style.display = 'block';
            }
            return;
        }
        
        // Check if current channel requires VPN
        if (this.currentChannel && this.currentChannel.vpn === true) {
            loading.innerHTML = `
                <div class="loading-spinner">
                    <div class="spinner"></div>
                    <p>يتطلب VPN</p>
                </div>
            `;
        } else {
            loading.innerHTML = `
                <div class="spinner" style="border-top-color: #e94560;"></div>
            `;
            
            // Retry after 3 seconds only if not VPN required
            setTimeout(() => {
                if (this.currentChannel) {
                    this.loadVideoStream(this.currentChannel.url);
                }
            }, 3000);
        }
    }

    retryVideo() {
        if (this.currentChannel) {
            // Show video player again
            const video = document.getElementById('videoPlayer');
            if (video) {
                video.style.display = 'block';
            }
            
            // Hide loading error message
            const loading = document.getElementById('videoLoading');
            if (loading) {
                loading.style.display = 'none';
            }
            
            const type = this.currentChannel.type || 'hls';
            this.loadVideoStream(this.currentChannel.url, type);
        }
    }

    // Detect URL type automatically
    detectUrlType() {
        // Use the new detection system
        this.detectUrlTypeNew();
    }

    // Updated detectUrlType method using new detection system
    detectUrlTypeNew() {
        const channelUrl = document.getElementById('channelUrl');
        const urlTypeIndicator = document.getElementById('urlTypeIndicator');
        const urlTypeIcon = document.getElementById('urlTypeIcon');
        const urlTypeValue = document.getElementById('urlTypeValue');
        
        const url = channelUrl.value.trim();
        
        if (!url) {
            urlTypeIndicator.style.display = 'none';
            return;
        }
        
        // Use the new detection system
        const detectedType = this.detectStreamType(url);
        const typeDisplayName = this.getStreamTypeDisplayName(detectedType);
        
        // Set appropriate icon and color based on type
        let iconClass = 'fas fa-question-circle';
        let indicatorColor = '#666';
        
        const typeConfig = {
            'youtube': { icon: 'fab fa-youtube', color: '#ff0000' },
            'hls': { icon: 'fas fa-broadcast-tower', color: '#00a8ff' },
            'mp4': { icon: 'fas fa-video', color: '#00d2d3' },
            'webm': { icon: 'fas fa-video', color: '#00d2d3' },
            'flv': { icon: 'fas fa-video', color: '#00d2d3' },
            'rtmp': { icon: 'fas fa-satellite-dish', color: '#f39c12' },
            'rtsp': { icon: 'fas fa-satellite-dish', color: '#f39c12' },
            'dash': { icon: 'fas fa-stream', color: '#9b59b6' },
            'webrtc': { icon: 'fas fa-network-wired', color: '#2ecc71' },
            'direct': { icon: 'fas fa-file-video', color: '#00d2d3' },
            'elahmad': { icon: 'fas fa-tv', color: '#8e44ad' },
            'aflam': { icon: 'fas fa-film', color: '#e74c3c' },
            'shls': { icon: 'fas fa-server', color: '#3498db' },
            'unknown': { icon: 'fas fa-question-circle', color: '#666' }
        };
        
        const config = typeConfig[detectedType] || typeConfig['unknown'];
        iconClass = config.icon;
        indicatorColor = config.color;
        
        // Show indicator
        urlTypeIndicator.style.display = 'block';
        urlTypeIcon.className = iconClass;
        urlTypeValue.textContent = typeDisplayName;
        urlTypeIndicator.style.backgroundColor = indicatorColor + '20';
        urlTypeIndicator.style.borderColor = indicatorColor;
        
        // Store detected type for form submission
        this.detectedUrlType = detectedType;
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

    // Check if URL is from elahmad.com
    isElahmadUrl(url) {
        const elahmadRegex = /^(https?:\/\/)?(www\.)?elahmad\.com/;
        return elahmadRegex.test(url);
    }

    // Check if URL is from aflam4you.net
    isAflamUrl(url) {
        const aflamRegex = /^(https?:\/\/)?(www\.)?direct\.aflam4you\.net/;
        return aflamRegex.test(url);
    }

    // Check if URL is from shls-live-enc.edgenextcdn.net
    isShlsUrl(url) {
        const shlsRegex = /^(https?:\/\/)?shls-live-enc\.edgenextcdn\.net/;
        return shlsRegex.test(url);
    }

    // === دوال كشف أنواع الصيغ والروابط الجديدة ===
    
    // Check if URL is MP4 video
    isMp4Url(url) {
        const mp4Regex = /\.mp4(\?|$|#)/i;
        return mp4Regex.test(url);
    }

    // Check if URL is WebM video
    isWebMUrl(url) {
        const webmRegex = /\.webm(\?|$|#)/i;
        return webmRegex.test(url);
    }

    // Check if URL is FLV video
    isFlvUrl(url) {
        const flvRegex = /\.flv(\?|$|#)/i;
        return flvRegex.test(url);
    }

    // Check if URL is RTMP stream
    isRtmpUrl(url) {
        const rtmpRegex = /^rtmp:\/\//i;
        return rtmpRegex.test(url);
    }

    // Check if URL is RTSP stream
    isRtspUrl(url) {
        const rtspRegex = /^rtsp:\/\//i;
        return rtspRegex.test(url);
    }

    // Check if URL is DASH stream
    isDashUrl(url) {
        const dashRegex = /\.mpd(\?|$|#)/i;
        return dashRegex.test(url);
    }

    // Check if URL is WebRTC stream
    isWebRtcUrl(url) {
        const webrtcRegex = /^(https?:\/\/)?.*webrtc/i;
        return webrtcRegex.test(url);
    }

    // Check if URL is M3U8 playlist
    isM3u8Url(url) {
        const m3u8Regex = /\.m3u8(\?|$|#)/i;
        return m3u8Regex.test(url);
    }

    // Check if URL is direct video file
    isDirectVideoUrl(url) {
        const videoExtensions = /\.(mp4|webm|ogg|avi|mov|wmv|flv|mkv|3gp|m4v)(\?|$|#)/i;
        return videoExtensions.test(url);
    }

    // Check if URL is streaming protocol
    isStreamingUrl(url) {
        const streamingRegex = /^(rtmp|rtsp|webrtc):\/\//i;
        return streamingRegex.test(url);
    }

    // Universal URL type detection (enhanced)
    detectStreamType(url) {
        if (!url) return 'unknown';
        
        // Normalize URL for better detection
        const normalizedUrl = url.toLowerCase().trim();
        
        // Priority 1: Special platforms
        if (this.isYouTubeUrl(url)) return 'youtube';
        if (this.isElahmadUrl(url)) return 'elahmad';
        if (this.isAflamUrl(url)) return 'aflam';
        if (this.isShlsUrl(url)) return 'shls';
        
        // Priority 2: Streaming protocols
        if (this.isRtmpUrl(url)) return 'rtmp';
        if (this.isRtspUrl(url)) return 'rtsp';
        if (this.isWebRtcUrl(url)) return 'webrtc';
        
        // Priority 3: Adaptive streaming formats
        if (this.isM3u8Url(url)) return 'hls';
        if (this.isDashUrl(url)) return 'dash';
        
        // Priority 4: Container formats
        if (this.isFlvUrl(url)) return 'flv';
        if (this.isMp4Url(url)) return 'mp4';
        if (this.isWebMUrl(url)) return 'webm';
        
        // Priority 5: Check for TS segments (often used in HLS)
        if (normalizedUrl.includes('.ts')) return 'hls';
        
        // Priority 6: Check for common streaming patterns
        if (normalizedUrl.includes('/live/') || normalizedUrl.includes('/stream/')) {
            // Likely a streaming URL, default to HLS
            return 'hls';
        }
        
        // Priority 7: Check file extensions in URL parameters
        const urlParams = new URLSearchParams(url.split('?')[1] || '');
        const fileParam = urlParams.get('file') || urlParams.get('url') || urlParams.get('src');
        if (fileParam) {
            return this.detectStreamType(fileParam);
        }
        
        // Priority 8: Generic direct video by extension
        if (this.isDirectVideoUrl(url)) return 'direct';
        
        // Priority 9: Content-Type based detection (for blob URLs)
        if (normalizedUrl.startsWith('blob:')) return 'direct';
        
        // Default: Try HLS for unknown streaming URLs
        if (normalizedUrl.startsWith('http')) return 'hls';
        
        return 'unknown';
    }

    // Get stream type display name
    getStreamTypeDisplayName(type) {
        const typeNames = {
            'youtube': 'يوتيوب',
            'elahmad': 'ElAhmad TV',
            'aflam': 'Aflam4You',
            'shls': 'SHLS Stream',
            'hls': 'HLS (مباشر)',
            'mp4': 'MP4 فيديو',
            'webm': 'WebM فيديو',
            'flv': 'FLV فيديو',
            'rtmp': 'RTMP بث',
            'rtsp': 'RTSP بث',
            'dash': 'DASH بث',
            'webrtc': 'WebRTC بث',
            'direct': 'فيديو مباشر',
            'unknown': 'غير معروف'
        };
        return typeNames[type] || 'غير معروف';
    }

    // Load shls-live-enc.edgenextcdn.net video with proxy support
    async loadShlsVideo(url) {
        const video = document.getElementById('videoPlayer');
        const loading = document.getElementById('videoLoading');
        
        try {
            // Validate URL
            if (!url || url.trim() === '') {
                throw new Error('رابط shls-live-enc.edgenextcdn.net فارغ أو غير صحيح');
            }

            if (!this.isShlsUrl(url)) {
                throw new Error('رابط shls-live-enc.edgenextcdn.net غير صحيح - تحقق من الرابط');
            }

            // Show loading
            loading.style.display = 'flex';
            loading.innerHTML = `
                <div class="spinner"></div>
                <p>جارٍ تحميل البث...</p>
            `;

            console.log('🔄 محاولة تحميل SHLS stream:', url);

            // Check if we're on a server (not localhost)
            const isServer = !window.location.hostname.includes('localhost') && 
                           !window.location.hostname.includes('127.0.0.1') &&
                           !window.location.hostname.includes('file://') &&
                           !window.location.hostname.includes('github.io');

            // Special handling for GitHub Pages
            const isGitHubPages = window.location.hostname.includes('github.io');
            
            // Use enhanced GitHub Pages function if on GitHub Pages
            if (isGitHubPages) {
                console.log('🌐 تم الكشف عن GitHub Pages - استخدام الدالة المحسنة...');
                return await this.loadShlsVideoForGitHub(url);
            }
            
            let streamUrl = url;
            
            if (isServer) {
                console.log('🌐 تم الكشف عن السيرفر - استخدام الوكلاء...');
                
                // Try multiple CORS proxies for server environments
                const proxies = [
                    `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
                    `https://cors-anywhere.herokuapp.com/${url}`,
                    `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
                    `https://thingproxy.freeboard.io/fetch/${url}`,
                    `https://corsproxy.io/?${encodeURIComponent(url)}`
                ];
                
                let proxySuccess = false;
                
                // Try each proxy until one works
                for (const proxyUrl of proxies) {
                    try {
                        console.log('🔄 جاري المحاولة مع وكيل:', proxyUrl.split('?')[0]);
                        const response = await fetch(proxyUrl, {
                            method: 'GET',
                            headers: {
                                'Accept': 'application/vnd.apple.mpegurl, application/x-mpegurl, */*',
                                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                            }
                        });
                        
                        if (!response.ok) {
                            throw new Error(`HTTP ${response.status}`);
                        }
                        
                        const data = await response.json();
                        const content = data.contents || data;
                        
                        if (content && content.includes('#EXTM3U')) {
                            console.log('✅ نجح التحميل مع وكيل:', proxyUrl.split('?')[0]);
                            streamUrl = proxyUrl;
                            proxySuccess = true;
                            break;
                        }
                    } catch (error) {
                        console.log('❌ فشل مع وكيل:', proxyUrl.split('?')[0], error.message);
                        continue;
                    }
                }
                
                if (!proxySuccess) {
                    console.log('⚠️ فشل جميع الوكلاء - محاولة الوصول المباشر...');
                }
            } else if (isGitHubPages) {
                console.log('🐙 تم الكشف عن GitHub Pages - استخدام طريقة خاصة...');
                
                // For GitHub Pages, try a different approach
                try {
                    // Try to fetch the M3U8 content directly and create a blob URL
                    const response = await fetch(url, {
                        method: 'GET',
                        mode: 'cors',
                        headers: {
                            'Accept': 'application/vnd.apple.mpegurl, application/x-mpegurl, */*',
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                        }
                    });
                    
                    if (response.ok) {
                        const content = await response.text();
                        if (content.includes('#EXTM3U')) {
                            console.log('✅ نجح الوصول المباشر على GitHub Pages');
                            streamUrl = url;
                        } else {
                            throw new Error('المحتوى ليس ملف M3U8 صالح');
                        }
                    } else {
                        throw new Error(`HTTP ${response.status}`);
                    }
                } catch (error) {
                    console.log('❌ فشل الوصول المباشر على GitHub Pages:', error.message);
                    console.log('🔄 محاولة استخدام الوكلاء البديلة...');
                    
                    // Fallback to alternative proxies that work better with GitHub Pages
                    const githubProxies = [
                        `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
                        `https://corsproxy.io/?${encodeURIComponent(url)}`,
                        `https://thingproxy.freeboard.io/fetch/${url}`
                    ];
                    
                    for (const proxyUrl of githubProxies) {
                        try {
                            console.log('🔄 جاري المحاولة مع وكيل GitHub:', proxyUrl.split('?')[0]);
                            const response = await fetch(proxyUrl, {
                                method: 'GET',
                                headers: {
                                    'Accept': 'application/vnd.apple.mpegurl, application/x-mpegurl, */*',
                                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                                }
                            });
                            
                            if (!response.ok) {
                                throw new Error(`HTTP ${response.status}`);
                            }
                            
                            const data = await response.json();
                            const content = data.contents || data;
                            
                            if (content && content.includes('#EXTM3U')) {
                                console.log('✅ نجح التحميل مع وكيل GitHub:', proxyUrl.split('?')[0]);
                                streamUrl = proxyUrl;
                                break;
                            }
                        } catch (error) {
                            console.log('❌ فشل مع وكيل GitHub:', proxyUrl.split('?')[0], error.message);
                            continue;
                        }
                    }
                }
            } else {
                console.log('🏠 تم الكشف عن البيئة المحلية - استخدام الوصول المباشر...');
            }

            // Hide loading and show video
            loading.style.display = 'none';
            video.style.display = 'block';
            
            // Check if HLS.js is available and needed
            if (typeof Hls !== 'undefined' && Hls.isSupported()) {
                console.log('🔄 استخدام HLS.js لتشغيل البث...');
                
                // Destroy previous HLS instance if exists
                if (this.hls) {
                    this.hls.destroy();
                }
                
                // Create new HLS instance
                this.hls = new Hls({
                    enableWorker: true,
                    lowLatencyMode: true,
                    backBufferLength: 90,
                    // Add CORS configuration for server environments
                    xhrSetup: function(xhr, url) {
                        if (isServer) {
                            xhr.withCredentials = false;
                        }
                    }
                });
                
                // Load the source
                this.hls.loadSource(streamUrl);
                this.hls.attachMedia(video);
                
                // Add HLS event listeners
                this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
                    console.log('✅ تم تحليل المانيفست بنجاح');
                });
                
                this.hls.on(Hls.Events.ERROR, (event, data) => {
                    console.error('❌ خطأ في HLS:', data);
                    if (data.fatal) {
                        loading.style.display = 'flex';
                        loading.innerHTML = `
                            <div class="loading-spinner">
                                <div class="spinner"></div>
                                <p>جارٍ تحميل البث...</p>
                            </div>
                        `;
                    }
                });
                
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                console.log('🔄 استخدام دعم المتصفح الأصلي لـ HLS...');
                // Set video source directly - browsers can handle M3U8 streams natively
                video.src = streamUrl;
                video.load();
            } else {
                throw new Error('المتصفح لا يدعم تشغيل ملفات M3U8');
            }
            
            // Add event listeners for better error handling
            video.addEventListener('loadstart', () => {
                console.log('🔄 بدء تحميل الفيديو...');
            });
            
            video.addEventListener('canplay', () => {
                console.log('✅ يمكن تشغيل الفيديو');
            });
            
            video.addEventListener('error', (e) => {
                console.error('❌ خطأ في تشغيل الفيديو:', e);
                loading.style.display = 'flex';
                loading.innerHTML = `
                    <div class="loading-spinner">
                        <div class="spinner"></div>
                        <p>جارٍ تحميل البث...</p>
                    </div>
                `;
            });
            
            console.log('✅ تم تحميل البث من shls-live-enc.edgenextcdn.net بنجاح');
            
        } catch (error) {
            console.error('❌ خطأ في تحميل البث من shls-live-enc.edgenextcdn.net:', error);
            loading.innerHTML = `
                <div class="loading-spinner">
                    <div class="spinner"></div>
                    <p>جارٍ تحميل البث...</p>
                </div>
            `;
        }
    }

    // Enhanced GitHub Pages support for SHLS streams
    async loadShlsVideoForGitHub(url) {
        const video = document.getElementById('videoPlayer');
        const loading = document.getElementById('videoLoading');
        
        try {
            console.log('🔄 تحميل SHLS stream محسن لـ GitHub Pages:', url);
            
            // Show loading with specific message for GitHub Pages
            loading.style.display = 'flex';
            loading.innerHTML = `
                <div class="spinner"></div>
                <p>جارٍ تحميل البث (GitHub Pages)...</p>
            `;

            // Enhanced proxy list specifically for GitHub Pages
            const githubProxies = [
                `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
                `https://corsproxy.io/?${encodeURIComponent(url)}`,
                `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
                `https://thingproxy.freeboard.io/fetch/${url}`,
                `https://cors-anywhere.herokuapp.com/${url}`,
                `https://proxy.cors.sh/${url}`,
                `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`
            ];
            
            let streamUrl = url;
            let proxySuccess = false;
            
            // Try each proxy with enhanced error handling
            for (const proxyUrl of githubProxies) {
                try {
                    console.log('🔄 جاري المحاولة مع وكيل GitHub:', proxyUrl.split('?')[0]);
                    
                    const response = await fetch(proxyUrl, {
                        method: 'GET',
                        headers: {
                            'Accept': 'application/vnd.apple.mpegurl, application/x-mpegurl, */*',
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                            'Referer': window.location.origin,
                            'Origin': window.location.origin
                        },
                        mode: 'cors',
                        credentials: 'omit'
                    });
                    
                    if (!response.ok) {
                        throw new Error(`HTTP ${response.status}`);
                    }
                    
                    // Handle different proxy response formats
                    let content;
                    if (proxyUrl.includes('allorigins.win')) {
                        const data = await response.json();
                        content = data.contents || data;
                    } else {
                        content = await response.text();
                    }
                    
                    if (content && content.includes('#EXTM3U')) {
                        console.log('✅ نجح التحميل مع وكيل GitHub:', proxyUrl.split('?')[0]);
                        streamUrl = proxyUrl;
                        proxySuccess = true;
                        break;
                    }
                } catch (error) {
                    console.log('❌ فشل مع وكيل GitHub:', proxyUrl.split('?')[0], error.message);
                    continue;
                }
            }
            
            if (!proxySuccess) {
                throw new Error('فشل في الوصول للبث عبر جميع الوكلاء المتاحة على GitHub Pages');
            }

            // Hide loading and show video
            loading.style.display = 'none';
            video.style.display = 'block';
            
            // Enhanced HLS configuration for GitHub Pages
            if (typeof Hls !== 'undefined' && Hls.isSupported()) {
                console.log('🔄 استخدام HLS.js محسن لـ GitHub Pages...');
                
                // Destroy previous HLS instance if exists
                if (this.hls) {
                    this.hls.destroy();
                }
                
                // Create new HLS instance with GitHub Pages optimizations
                this.hls = new Hls({
                    enableWorker: true,
                    lowLatencyMode: false, // Disable for better compatibility
                    backBufferLength: 30,
                    maxBufferLength: 60,
                    maxMaxBufferLength: 300,
                    maxBufferSize: 30 * 1000 * 1000,
                    maxBufferHole: 0.5,
                    highBufferWatchdogPeriod: 2,
                    nudgeOffset: 0.1,
                    nudgeMaxRetry: 3,
                    maxFragLookUpTolerance: 0.20,
                    liveSyncDurationCount: 3,
                    liveMaxLatencyDurationCount: Infinity,
                    liveDurationInfinity: true,
                    enableSoftwareAES: true,
                    manifestLoadingTimeOut: 20000, // Increased timeout for GitHub Pages
                    manifestLoadingMaxRetry: 5,   // More retries for GitHub Pages
                    manifestLoadingRetryDelay: 3000,
                    fragLoadingTimeOut: 45000,    // Increased timeout
                    fragLoadingMaxRetry: 8,
                    fragLoadingRetryDelay: 3000,
                    startFragPrefetch: false, // Disable for GitHub Pages
                    // Enhanced headers for GitHub Pages
                    xhrSetup: function(xhr, url) {
                        xhr.setRequestHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
                        xhr.setRequestHeader('Referer', window.location.origin);
                        xhr.setRequestHeader('Accept', 'application/vnd.apple.mpegurl, application/x-mpegurl, */*');
                        xhr.setRequestHeader('Origin', window.location.origin);
                    }
                });

                this.hls.loadSource(streamUrl);
                this.hls.attachMedia(video);

                this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
                    console.log('✅ تم تحميل البث بنجاح على GitHub Pages');
                    
                    if (this.settings.autoplay) {
                        this.enhancedAutoplay(video);
                    }
                    
                    this.updateQualityDisplayFromHLS();
                    setupMediaSession();
                });

                this.hls.on(Hls.Events.ERROR, (event, data) => {
                    console.error('❌ خطأ في تشغيل البث على GitHub Pages:', data);
                    
                    if (data.fatal) {
                        switch (data.type) {
                            case Hls.ErrorTypes.NETWORK_ERROR:
                                console.log('🔄 محاولة إعادة التحميل بعد خطأ الشبكة...');
                                setTimeout(() => {
                                    this.hls.startLoad();
                                }, 2000);
                                break;
                            case Hls.ErrorTypes.MEDIA_ERROR:
                                console.log('🔄 محاولة إعادة التحميل بعد خطأ الوسائط...');
                                setTimeout(() => {
                                    this.hls.recoverMediaError();
                                }, 2000);
                                break;
                            default:
                                console.log('❌ خطأ غير قابل للإصلاح');
                                this.showVideoError('خطأ في تشغيل البث على GitHub Pages - جرب استخدام VPN أو تحديث الصفحة');
                                break;
                        }
                    }
                });

            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                // Native HLS support (Safari) - not recommended for GitHub Pages
                console.log('🔄 استخدام دعم HLS الأصلي للمتصفح...');
                const source = document.getElementById('videoSource');
                source.src = streamUrl;
                video.load();
                
                if (this.settings.autoplay) {
                    this.enhancedAutoplay(video);
                }
                
                this.updateQualityDisplayFromNativeHLS();
                setupMediaSession();
            } else {
                throw new Error('المتصفح لا يدعم تشغيل البث المباشر');
            }
            
            // Enhanced error handling for video element
            video.addEventListener('error', (e) => {
                console.error('❌ خطأ في تشغيل الفيديو على GitHub Pages:', e);
                loading.style.display = 'flex';
                loading.innerHTML = `
                    <div class="loading-spinner">
                        <div class="spinner"></div>
                        <p>جارٍ تحميل البث...</p>
                    </div>
                `;
            });
            
            console.log('✅ تم تحميل البث من shls-live-enc.edgenextcdn.net بنجاح على GitHub Pages');
            
        } catch (error) {
            console.error('❌ خطأ في تحميل البث على GitHub Pages:', error);
            loading.innerHTML = `
                <div class="loading-spinner">
                    <div class="spinner"></div>
                    <p>مشكلة في الوصول للبث على GitHub Pages</p>
                </div>
            `;
            
            // Show specific error message for GitHub Pages
            this.showVideoError('مشكلة في الوصول للبث على GitHub Pages - جرب استخدام VPN أو تحديث الصفحة');
        }
    }

    // === دوال تحميل الصيغ الجديدة ===
    
    // Load MP4 video
    async loadMp4Video(url) {
        const video = document.getElementById('videoPlayer');
        const source = document.getElementById('videoSource');
        const loading = document.getElementById('videoLoading');
        
        try {
            console.log('🔄 تحميل MP4 فيديو:', url);
            
            // Show loading
            loading.style.display = 'flex';
            loading.innerHTML = `
                <div class="spinner"></div>
                <p>جارٍ تحميل MP4...</p>
            `;

            // Set video source
            source.src = url;
            source.type = 'video/mp4';
            video.load();

            // Wait for video to be ready
            await new Promise((resolve, reject) => {
                const timeout = setTimeout(() => {
                    reject(new Error('انتهت مهلة تحميل MP4'));
                }, 30000);

                video.addEventListener('loadedmetadata', () => {
                    clearTimeout(timeout);
                    loading.style.display = 'none';
                    
                    if (this.settings.autoplay) {
                        this.enhancedAutoplay(video);
                    }
                    
                    this.updateQualityDisplayForDirectVideo('MP4');
                    setupMediaSession();
                    resolve();
                }, { once: true });

                video.addEventListener('error', (e) => {
                    clearTimeout(timeout);
                    reject(new Error('خطأ في تحميل MP4: ' + e.message));
                }, { once: true });
            });

        } catch (error) {
            console.error('خطأ في تحميل MP4:', error);
            this.showVideoError('خطأ في تحميل MP4');
            this.handleVideoError();
        }
    }

    // Load WebM video
    async loadWebMVideo(url) {
        const video = document.getElementById('videoPlayer');
        const source = document.getElementById('videoSource');
        const loading = document.getElementById('videoLoading');
        
        try {
            console.log('🔄 تحميل WebM فيديو:', url);
            
            // Show loading
            loading.style.display = 'flex';
            loading.innerHTML = `
                <div class="spinner"></div>
                <p>جارٍ تحميل WebM...</p>
            `;

            // Set video source
            source.src = url;
            source.type = 'video/webm';
            video.load();

            // Wait for video to be ready
            await new Promise((resolve, reject) => {
                const timeout = setTimeout(() => {
                    reject(new Error('انتهت مهلة تحميل WebM'));
                }, 30000);

                video.addEventListener('loadedmetadata', () => {
                    clearTimeout(timeout);
                    loading.style.display = 'none';
                    
                    if (this.settings.autoplay) {
                        this.enhancedAutoplay(video);
                    }
                    
                    this.updateQualityDisplayForDirectVideo('WebM');
                    setupMediaSession();
                    resolve();
                }, { once: true });

                video.addEventListener('error', (e) => {
                    clearTimeout(timeout);
                    reject(new Error('خطأ في تحميل WebM: ' + e.message));
                }, { once: true });
            });

        } catch (error) {
            console.error('خطأ في تحميل WebM:', error);
            this.showVideoError('خطأ في تحميل WebM');
            this.handleVideoError();
        }
    }

    // Load FLV video with FLV.js or mpegts.js support
    async loadFlvVideo(url) {
        const video = document.getElementById('videoPlayer');
        const loading = document.getElementById('videoLoading');
        
        try {
            console.log('🔄 تحميل FLV فيديو:', url);
            
            // Show loading
            loading.style.display = 'flex';
            loading.innerHTML = `
                <div class="spinner"></div>
                <p>جارِ تحميل FLV...</p>
            `;

            // Ensure video player is visible
            video.style.display = 'block';
            
            // Try FLV.js first
            if (typeof flvjs !== 'undefined' && flvjs.isSupported()) {
                console.log('✅ استخدام FLV.js');
                
                // Clean up previous player
                if (this.flvPlayer) {
                    this.flvPlayer.destroy();
                    this.flvPlayer = null;
                }
                
                this.flvPlayer = flvjs.createPlayer({
                    type: 'flv',
                    url: url,
                    isLive: true,
                    hasAudio: true,
                    hasVideo: true
                }, {
                    enableWorker: true,
                    enableStashBuffer: true,
                    stashInitialSize: 128,
                    autoCleanupSourceBuffer: true
                });
                
                this.flvPlayer.attachMediaElement(video);
                this.flvPlayer.load();
                
                // Handle events
                this.flvPlayer.on(flvjs.Events.LOADING_COMPLETE, () => {
                    loading.style.display = 'none';
                    if (this.settings.autoplay) {
                        this.enhancedAutoplay(video);
                    }
                    this.updateQualityDisplayForDirectVideo('FLV (FLV.js)');
                    setupMediaSession();
                });
                
                this.flvPlayer.on(flvjs.Events.ERROR, (errorType, errorDetail) => {
                    console.error('FLV.js Error:', errorType, errorDetail);
                    // Try fallback to mpegts.js
                    this.loadFlvWithMpegts(url);
                });
                
                return;
            }
            
            // Try mpegts.js as fallback
            if (typeof mpegts !== 'undefined' && mpegts.getFeatureList().mseLiveFlvPlayback) {
                console.log('✅ استخدام mpegts.js لـ FLV');
                await this.loadFlvWithMpegts(url);
                return;
            }
            
            // No library available
            throw new Error('FLV غير مدعوم - يرجى تحويله إلى HLS أو MP4');

        } catch (error) {
            console.error('خطأ في تحميل FLV:', error);
            this.showVideoError('جارِ تحميل البث...');
            // Try fallback loading method
            if (this.loadAttempts < this.maxLoadAttempts) {
                this.loadAttempts++;
                setTimeout(() => this.loadVideoWithFallback(url, 'mp4'), 2000);
            } else {
                this.handleVideoError();
            }
        }
    }
    
    // Load FLV with mpegts.js
    async loadFlvWithMpegts(url) {
        const video = document.getElementById('videoPlayer');
        const loading = document.getElementById('videoLoading');
        
        try {
            // Clean up previous player
            if (this.mpegtsPlayer) {
                this.mpegtsPlayer.destroy();
                this.mpegtsPlayer = null;
            }
            
            this.mpegtsPlayer = mpegts.createPlayer({
                type: 'flv',
                url: url,
                isLive: true
            }, {
                enableWorker: true,
                enableStashBuffer: true,
                stashInitialSize: 128
            });
            
            this.mpegtsPlayer.attachMediaElement(video);
            this.mpegtsPlayer.load();
            
            // Handle events
            this.mpegtsPlayer.on(mpegts.Events.LOADING_COMPLETE, () => {
                loading.style.display = 'none';
                if (this.settings.autoplay) {
                    this.enhancedAutoplay(video);
                }
                this.updateQualityDisplayForDirectVideo('FLV (mpegts.js)');
                setupMediaSession();
            });
            
            this.mpegtsPlayer.on(mpegts.Events.ERROR, (errorType, errorDetail) => {
                console.error('mpegts.js Error:', errorType, errorDetail);
                throw new Error('FLV playback failed');
            });
            
        } catch (error) {
            console.error('Error loading FLV with mpegts.js:', error);
            throw error;
        }
    }

    // Load RTMP stream (requires special handling)
    async loadRtmpVideo(url) {
        const loading = document.getElementById('videoLoading');
        
        try {
            console.log('🔄 تحميل RTMP stream:', url);
            
            // Show loading
            loading.style.display = 'flex';
            loading.innerHTML = `
                <div class="spinner"></div>
                <p>جارٍ تحميل RTMP...</p>
            `;

            // RTMP is not directly supported by HTML5 video
            // We need to use a WebRTC gateway or convert to HLS
            throw new Error('RTMP يتطلب خادم وسيط أو تحويل إلى HLS');

        } catch (error) {
            console.error('خطأ في تحميل RTMP:', error);
            this.showVideoError('RTMP غير مدعوم مباشرة - يرجى تحويله إلى HLS');
            this.handleVideoError();
        }
    }

    // Load RTSP stream (requires special handling)
    async loadRtspVideo(url) {
        const loading = document.getElementById('videoLoading');
        
        try {
            console.log('🔄 تحميل RTSP stream:', url);
            
            // Show loading
            loading.style.display = 'flex';
            loading.innerHTML = `
                <div class="spinner"></div>
                <p>جارٍ تحميل RTSP...</p>
            `;

            // RTSP is not directly supported by HTML5 video
            // We need to use a WebRTC gateway or convert to HLS
            throw new Error('RTSP يتطلب خادم وسيط أو تحويل إلى HLS');

        } catch (error) {
            console.error('خطأ في تحميل RTSP:', error);
            this.showVideoError('RTSP غير مدعوم مباشرة - يرجى تحويله إلى HLS');
            this.handleVideoError();
        }
    }

    // Load DASH stream with DASH.js
    async loadDashVideo(url) {
        const video = document.getElementById('videoPlayer');
        const loading = document.getElementById('videoLoading');
        
        try {
            console.log('🔄 تحميل DASH stream:', url);
            
            // Show loading
            loading.style.display = 'flex';
            loading.innerHTML = `
                <div class="spinner"></div>
                <p>جارِ تحميل DASH...</p>
            `;

            // Ensure video player is visible
            video.style.display = 'block';
            
            // Try DASH.js first
            if (typeof dashjs !== 'undefined') {
                console.log('✅ استخدام DASH.js');
                
                // Clean up previous player
                if (this.dashPlayer) {
                    this.dashPlayer.reset();
                    this.dashPlayer = null;
                }
                
                this.dashPlayer = dashjs.MediaPlayer().create();
                this.dashPlayer.initialize(video, url, this.settings.autoplay);
                
                // Configure DASH player for better performance
                this.dashPlayer.updateSettings({
                    streaming: {
                        buffer: {
                            fastSwitchEnabled: true,
                            bufferTimeAtTopQuality: 30,
                            bufferTimeAtTopQualityLongForm: 60
                        },
                        abr: {
                            autoSwitchBitrate: {
                                video: this.settings.autoQuality
                            }
                        },
                        lowLatencyEnabled: true
                    }
                });
                
                // Handle events
                this.dashPlayer.on(dashjs.MediaPlayer.events.STREAM_INITIALIZED, () => {
                    console.log('✅ DASH stream initialized');
                    loading.style.display = 'none';
                    this.updateQualityDisplayForDirectVideo('DASH (DASH.js)');
                    setupMediaSession();
                });
                
                this.dashPlayer.on(dashjs.MediaPlayer.events.ERROR, (e) => {
                    console.error('DASH.js Error:', e);
                    this.showVideoError('جارِ تحميل البث...');
                    // Try fallback
                    if (this.loadAttempts < this.maxLoadAttempts) {
                        this.loadAttempts++;
                        setTimeout(() => this.loadVideoWithFallback(url, 'hls'), 2000);
                    }
                });
                
                return;
            }

            // Check if browser supports DASH natively
            if (video.canPlayType('application/dash+xml')) {
                console.log('✅ استخدام DASH native');
                const source = document.getElementById('videoSource');
                source.src = url;
                source.type = 'application/dash+xml';
                video.load();

                await new Promise((resolve, reject) => {
                    const timeout = setTimeout(() => {
                        reject(new Error('انتهت مهلة تحميل DASH'));
                    }, 30000);

                    video.addEventListener('loadedmetadata', () => {
                        clearTimeout(timeout);
                        loading.style.display = 'none';
                        
                        if (this.settings.autoplay) {
                            this.enhancedAutoplay(video);
                        }
                        
                        this.updateQualityDisplayForDirectVideo('DASH (Native)');
                        setupMediaSession();
                        resolve();
                    }, { once: true });

                    video.addEventListener('error', (e) => {
                        clearTimeout(timeout);
                        reject(new Error('خطأ في تحميل DASH: ' + e.message));
                    }, { once: true });
                });
            } else {
                throw new Error('DASH غير مدعوم في هذا المتصفح');
            }

        } catch (error) {
            console.error('خطأ في تحميل DASH:', error);
            this.showVideoError('جارِ تحميل البث...');
            // Try fallback
            if (this.loadAttempts < this.maxLoadAttempts) {
                this.loadAttempts++;
                setTimeout(() => this.loadVideoWithFallback(url, 'hls'), 2000);
            } else {
                this.handleVideoError();
            }
        }
    }

    // Load WebRTC stream
    async loadWebRtcVideo(url) {
        const video = document.getElementById('videoPlayer');
        const loading = document.getElementById('videoLoading');
        
        try {
            console.log('🔄 تحميل WebRTC stream:', url);
            
            // Show loading
            loading.style.display = 'flex';
            loading.innerHTML = `
                <div class="spinner"></div>
                <p>جارٍ تحميل WebRTC...</p>
            `;

            // WebRTC requires special handling with RTCPeerConnection
            // This is a simplified implementation
            throw new Error('WebRTC يتطلب تطبيق خاص');

        } catch (error) {
            console.error('خطأ في تحميل WebRTC:', error);
            this.showVideoError('WebRTC يتطلب تطبيق خاص');
            this.handleVideoError();
        }
    }

    // Update quality display for direct video formats
    updateQualityDisplayForDirectVideo(format) {
        const qualityDisplay = document.getElementById('currentQualityText');
        if (qualityDisplay) {
            qualityDisplay.textContent = `${format} - مباشر`;
        }
    }

    // Smart fallback system - tries alternative formats if loading fails
    async loadVideoWithFallback(url, fallbackType = 'auto') {
        console.log(`🔄 محاولة تحميل بديل: ${fallbackType}`);
        
        try {
            // Reset load attempts for new fallback
            this.loadAttempts = 0;
            
            // Define fallback chain based on original type
            const fallbackChain = {
                'flv': ['mp4', 'hls', 'direct'],
                'dash': ['hls', 'mp4', 'direct'],
                'rtmp': ['hls', 'mp4'],
                'rtsp': ['hls', 'mp4'],
                'webrtc': ['hls', 'mp4'],
                'mp4': ['webm', 'hls'],
                'webm': ['mp4', 'hls'],
                'hls': ['mp4', 'webm', 'direct'],
                'auto': ['hls', 'mp4', 'webm', 'direct']
            };
            
            const chain = fallbackChain[fallbackType] || fallbackChain['auto'];
            
            for (const type of chain) {
                try {
                    console.log(`➡️ تجربة تحميل بصيغة: ${type}`);
                    await this.loadVideoStream(url, type);
                    console.log(`✅ نجح التحميل بصيغة: ${type}`);
                    return; // Success
                } catch (error) {
                    console.warn(`⚠️ فشل التحميل بصيغة ${type}:`, error.message);
                    // Continue to next fallback
                }
            }
            
            // All fallbacks failed
            throw new Error('فشلت جميع محاولات التحميل');
            
        } catch (error) {
            console.error('خطأ في نظام Fallback:', error);
            this.showVideoError('جارِ تحميل البث...');
            this.handleVideoError();
        }
    }
    
    // Load direct video (generic fallback)
    async loadDirectVideo(url) {
        const video = document.getElementById('videoPlayer');
        const source = document.getElementById('videoSource');
        const loading = document.getElementById('videoLoading');
        
        try {
            console.log('🔄 تحميل فيديو مباشر:', url);
            
            // Show loading
            loading.style.display = 'flex';
            loading.innerHTML = `
                <div class="spinner"></div>
                <p>جارٍ تحميل الفيديو...</p>
            `;

            // Try to detect MIME type from URL
            let mimeType = 'video/mp4'; // default
            if (this.isWebMUrl(url)) {
                mimeType = 'video/webm';
            } else if (this.isMp4Url(url)) {
                mimeType = 'video/mp4';
            } else if (this.isFlvUrl(url)) {
                mimeType = 'video/x-flv';
            }

            // Set video source
            source.src = url;
            source.type = mimeType;
            video.load();

            // Wait for video to be ready
            await new Promise((resolve, reject) => {
                const timeout = setTimeout(() => {
                    reject(new Error('انتهت مهلة تحميل الفيديو'));
                }, 30000);

                video.addEventListener('loadedmetadata', () => {
                    clearTimeout(timeout);
                    loading.style.display = 'none';
                    
                    if (this.settings.autoplay) {
                        this.enhancedAutoplay(video);
                    }
                    
                    this.updateQualityDisplayForDirectVideo('مباشر');
                    setupMediaSession();
                    resolve();
                }, { once: true });

                video.addEventListener('error', (e) => {
                    clearTimeout(timeout);
                    reject(new Error('خطأ في تحميل الفيديو: ' + e.message));
                }, { once: true });
            });

        } catch (error) {
            console.error('خطأ في تحميل الفيديو المباشر:', error);
            this.showVideoError('خطأ في تحميل الفيديو');
            this.handleVideoError();
        }
    }
    async loadElahmadVideo(url) {
        const video = document.getElementById('videoPlayer');
        const loading = document.getElementById('videoLoading');
        
        try {
            // Validate URL
            if (!url || url.trim() === '') {
                throw new Error('رابط elahmad.com فارغ أو غير صحيح');
            }

            if (!this.isElahmadUrl(url)) {
                throw new Error('رابط elahmad.com غير صحيح - تحقق من الرابط');
            }

            // Stop any existing iframe
            const existingIframe = document.getElementById('elahmadPlayer');
            if (existingIframe) {
                // إيقاف البث السابق فقط بدون حذف العنصر
                try {
                    if (existingIframe.contentWindow) {
                        existingIframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
                    }
                } catch (e) {
                    console.log('Cannot access existing iframe content');
                }
                existingIframe.src = 'about:blank';
                existingIframe.style.display = 'none';
                console.log('✅ تم إيقاف elahmad iframe السابق');
            }

            // Hide the video element and show iframe
            video.style.display = 'none';
            
            // إعادة استخدام iframe الموجود أو إنشاء واحد جديد
            let iframe = document.getElementById('elahmadPlayer');
            if (!iframe) {
                console.log('🆕 إنشاء iframe جديد لـ elahmad.com');
                iframe = document.createElement('iframe');
                iframe.id = 'elahmadPlayer';
                iframe.style.width = '100%';
                iframe.style.height = '100%';
                iframe.style.border = 'none';
                iframe.allowFullscreen = true;
                iframe.allow = 'autoplay; fullscreen; picture-in-picture; xr-spatial-tracking; encrypted-media';
                
                // إضافة حماية من الإعلانات وإعادة التوجيه
                iframe.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
                iframe.setAttribute('loading', 'lazy');
                
                // منع إعادة التوجيه غير المرغوب فيها
                iframe.onload = () => {
                    console.log('✅ تم تحميل iframe من elahmad.com بنجاح');
                    loading.style.display = 'none';
                    
                    // فحص الإعلانات وإعادة التوجيه
                    setTimeout(() => {
                        try {
                            if (iframe.contentDocument && iframe.contentDocument.body) {
                                const bodyText = iframe.contentDocument.body.textContent.toLowerCase();
                                if (bodyText.includes('advertisement') || bodyText.includes('ad') || bodyText.includes('إعلان')) {
                                    console.warn('⚠️ تم اكتشاف إعلانات في المحتوى');
                                }
                                if (bodyText.includes('please wait') || bodyText.includes('انتظر')) {
                                    console.warn('⚠️ تم اكتشاف رسالة انتظار - قد تكون إعادة توجيه');
                                }
                            }
                        } catch (e) {
                            // Cross-origin error is expected for successful loads
                            console.log('✅ iframe محمل بنجاح (Cross-origin)');
                        }
                    }, 2000);
                };
                
                // Insert iframe after video element only if newly created
                video.parentNode.insertBefore(iframe, video.nextSibling);
            } else {
                console.log('♻️ إعادة استخدام iframe موجود لـ elahmad.com');
                // إعادة تعيين خصائص iframe الموجود
                iframe.style.display = 'block';
            }

            // Set iframe source
            iframe.src = url;
            
            // Hide loading
            loading.style.display = 'none';
            
            // Show iframe
            iframe.style.display = 'block';
            
            // Add double-click fullscreen support for elahmad iframe
            iframe.addEventListener('dblclick', () => {
                console.log('🖱️ ضغط مزدوج على elahmad iframe - محاولة التكبير');
                this.toggleFullscreen();
            });
            
            console.log('✅ تم تحميل iframe من elahmad.com بنجاح');
            
        } catch (error) {
            console.error('❌ خطأ في تحميل iframe من elahmad.com:', error);
            loading.innerHTML = `
                <div class="loading-spinner">
                    <div class="spinner"></div>
                    <p>جارٍ تحميل المحتوى...</p>
                </div>
            `;
            throw error;
        }
    }

    // Extract direct stream URL from aflam4you.net page (Enhanced)
    async extractAflamStreamUrl(pageUrl) {
        try {
            console.log('🔍 جاري استخراج رابط البث المباشر من:', pageUrl);
            
            // Try multiple CORS proxies
            const proxies = [
                `https://api.allorigins.win/get?url=${encodeURIComponent(pageUrl)}`,
                `https://cors-anywhere.herokuapp.com/${pageUrl}`,
                `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(pageUrl)}`
            ];
            
            let htmlContent = '';
            let lastError = null;
            
            // Try each proxy until one works
            for (const proxyUrl of proxies) {
                try {
                    console.log('🔄 جاري المحاولة مع:', proxyUrl.split('?')[0]);
                    const response = await fetch(proxyUrl, {
                        method: 'GET',
                        headers: {
                            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                        }
                    });
                    
                    if (!response.ok) {
                        throw new Error(`HTTP ${response.status}`);
                    }
                    
                    const data = await response.json();
                    htmlContent = data.contents || data;
                    
                    if (htmlContent && htmlContent.length > 100) {
                        console.log('✅ نجح التحميل مع:', proxyUrl.split('?')[0]);
                        break;
                    }
                } catch (error) {
                    console.log('❌ فشل مع:', proxyUrl.split('?')[0], error.message);
                    lastError = error;
                    continue;
                }
            }
            
            if (!htmlContent || htmlContent.length < 100) {
                throw new Error('لا يمكن الوصول لمحتوى الصفحة من أي خادم وكيل');
            }
            
            console.log('📄 تم تحميل المحتوى بنجاح، حجم:', htmlContent.length, 'حرف');
            
            // إزالة الإعلانات والنوافذ المنبقة من المحتوى المحمل
            htmlContent = htmlContent.replace(/<[^>]*class[^>]*ad[^>]*>.*?<\/[^>]*>/gi, '');
            htmlContent = htmlContent.replace(/<[^>]*class[^>]*advertisement[^>]*>.*?<\/[^>]*>/gi, '');
            htmlContent = htmlContent.replace(/<[^>]*class[^>]*popup[^>]*>.*?<\/[^>]*>/gi, '');
            htmlContent = htmlContent.replace(/<[^>]*class[^>]*unmute[^>]*>.*?<\/[^>]*>/gi, '');
            htmlContent = htmlContent.replace(/<a[^>]*href[^>]*unmute[^>]*>.*?<\/a>/gi, '');
            htmlContent = htmlContent.replace(/<a[^>]*href[^>]*advertisement[^>]*>.*?<\/a>/gi, '');
            htmlContent = htmlContent.replace(/<a[^>]*href[^>]*popup[^>]*>.*?<\/a>/gi, '');
            
            // إزالة النصوص التي تحتوي على unmute
            htmlContent = htmlContent.replace(/click here to unmute/gi, '');
            htmlContent = htmlContent.replace(/Click here to unmute/gi, '');
            htmlContent = htmlContent.replace(/CLICK HERE TO UNMUTE/gi, '');
            htmlContent = htmlContent.replace(/unmute/gi, '');
            
            console.log('🛡️ تم تنظيف المحتوى من الإعلانات والنوافذ المنبقة');
            
            // Enhanced patterns for finding stream URLs
            const streamPatterns = [
                // Pattern 1: Direct HLS URLs in quotes
                /["'](https?:\/\/[^"'\s]+\.m3u8[^"'\s]*)["']/gi,
                // Pattern 2: HLS URLs in video sources
                /<source[^>]*src=["']([^"']*\.m3u8[^"']*)["'][^>]*>/gi,
                // Pattern 3: HLS URLs in JavaScript variables
                /(?:src|url|stream|hls|source)["\s]*[:=]["\s]*["']([^"']*\.m3u8[^"']*)["']/gi,
                // Pattern 4: HLS URLs in data attributes
                /data-[^=]*=["']([^"']*\.m3u8[^"']*)["']/gi,
                // Pattern 5: HLS URLs in object/embed tags
                /<(?:object|embed)[^>]*src=["']([^"']*\.m3u8[^"']*)["'][^>]*>/gi,
                // Pattern 6: HLS URLs in iframe src
                /<iframe[^>]*src=["']([^"']*\.m3u8[^"']*)["'][^>]*>/gi,
                // Pattern 7: HLS URLs in player configurations
                /(?:player|video|stream)["\s]*[:=]["\s]*["']([^"']*\.m3u8[^"']*)["']/gi,
                // Pattern 8: HLS URLs in JSON-like structures
                /"url"["\s]*:["\s]*["']([^"']*\.m3u8[^"']*)["']/gi,
                // Pattern 9: HLS URLs in base64 encoded data
                /data:application\/json;base64,[A-Za-z0-9+/=]+/gi
            ];
            
            const foundStreams = new Set();
            
            // Extract streams using all patterns
            streamPatterns.forEach((pattern, index) => {
                let match;
                while ((match = pattern.exec(htmlContent)) !== null) {
                    const streamUrl = match[1] || match[0];
                    if (streamUrl && streamUrl.includes('.m3u8')) {
                        foundStreams.add(streamUrl);
                        console.log(`🎯 تم العثور على رابط في النمط ${index + 1}:`, streamUrl);
                    }
                }
            });
            
            // Also try to find URLs in script tags
            const scriptMatches = htmlContent.match(/<script[^>]*>[\s\S]*?<\/script>/gi);
            if (scriptMatches) {
                scriptMatches.forEach(script => {
                    const scriptStreams = script.match(/(https?:\/\/[^"'\s]+\.m3u8[^"'\s]*)/gi);
                    if (scriptStreams) {
                        scriptStreams.forEach(stream => foundStreams.add(stream));
                    }
                });
            }
            
            // Convert Set to Array and filter valid URLs
            const validStreams = Array.from(foundStreams).filter(url => {
                try {
                    const urlObj = new URL(url);
                    return url.includes('.m3u8') && 
                           !url.includes('placeholder') && 
                           !url.includes('example') &&
                           !url.includes('test') &&
                           (urlObj.protocol === 'http:' || urlObj.protocol === 'https:');
                } catch {
                    return false;
                }
            });
            
            console.log('📊 إجمالي الروابط الموجودة:', foundStreams.size);
            console.log('✅ الروابط الصحيحة:', validStreams.length);
            
            if (validStreams.length === 0) {
                // Try to find any video-related URLs as fallback
                const videoPatterns = [
                    /(https?:\/\/[^"'\s]+\.(?:mp4|webm|avi|mov)[^"'\s]*)/gi,
                    /(https?:\/\/[^"'\s]+\.(?:ts|m4s)[^"'\s]*)/gi
                ];
                
                const videoUrls = new Set();
                videoPatterns.forEach(pattern => {
                    let match;
                    while ((match = pattern.exec(htmlContent)) !== null) {
                        videoUrls.add(match[1]);
                    }
                });
                
                if (videoUrls.size > 0) {
                    console.log('🎥 تم العثور على روابط فيديو بديلة:', Array.from(videoUrls));
                    return Array.from(videoUrls)[0];
                }
                
                throw new Error('لم يتم العثور على رابط بث مباشر في الصفحة');
            }
            
            // Return the first valid stream URL
            const streamUrl = validStreams[0];
            console.log('✅ تم العثور على رابط البث المباشر:', streamUrl);
            
            return streamUrl;
            
        } catch (error) {
            console.error('❌ خطأ في استخراج رابط البث المباشر:', error);
            throw new Error(`فشل في استخراج رابط البث المباشر: ${error.message}`);
        }
    }

    // Load aflam4you.net video
    async loadAflamVideo(url) {
        const video = document.getElementById('videoPlayer');
        const loading = document.getElementById('videoLoading');
        
        try {
            // Validate URL
            if (!url || url.trim() === '') {
                throw new Error('رابط aflam4you.net فارغ أو غير صحيح');
            }

            if (!this.isAflamUrl(url)) {
                throw new Error('رابط aflam4you.net غير صحيح - تحقق من الرابط');
            }

            // Show loading
            loading.style.display = 'flex';
            loading.innerHTML = `
                <div class="spinner"></div>
            `;

            try {
                // Try to extract direct stream URL first
                const streamUrl = await this.extractAflamStreamUrl(url);
                
                // Update loading message
                loading.innerHTML = `
                    <div class="spinner"></div>
                `;

                // Load the direct stream using HLS
                await this.loadDirectStream(streamUrl);
                
            } catch (extractError) {
                console.log('⚠️ فشل استخراج البث المباشر، جاري المحاولة مع iframe:', extractError.message);
                
                // Fallback to iframe method with improvements
                await this.loadAflamIframe(url);
            }
            
        } catch (error) {
            console.error('❌ خطأ في تحميل aflam4you.net:', error);
            this.showAflamError(error.message);
            throw error;
        }
    }

    // Load aflam4you.net using iframe (Fallback method)
    async loadAflamIframe(url) {
        const video = document.getElementById('videoPlayer');
        const loading = document.getElementById('videoLoading');
        
        try {
            // Stop any existing iframe
            const existingIframe = document.getElementById('aflamPlayer');
            if (existingIframe) {
                // إيقاف البث السابق فقط بدون حذف العنصر
                try {
                    if (existingIframe.contentWindow) {
                        existingIframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
                        existingIframe.contentWindow.postMessage('{"event":"command","func":"stopVideo","args":""}', '*');
                    }
                } catch (e) {
                    console.log('Cannot access existing iframe content');
                }
                existingIframe.src = 'about:blank';
                existingIframe.style.display = 'none';
                console.log('✅ تم إيقاف iframe السابق');
            }

            // Hide the video element and show iframe
            video.style.display = 'none';
            
            // Update loading message
            loading.innerHTML = `
                <div class="spinner"></div>
            `;
            
            // إعادة استخدام iframe الموجود أو إنشاء واحد جديد
            let iframe = document.getElementById('aflamPlayer');
            const isNewIframe = !iframe;
            if (!iframe) {
                console.log('🆕 إنشاء iframe جديد لـ Aflam4You');
                iframe = document.createElement('iframe');
            iframe.id = 'aflamPlayer';
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            iframe.style.border = 'none';
            iframe.style.background = '#000';
                iframe.allowFullscreen = true;
                iframe.allow = 'autoplay; fullscreen; picture-in-picture; xr-spatial-tracking; encrypted-media';
                // إزالة sandbox لتجنب التحذيرات
                // iframe.sandbox = 'allow-scripts allow-same-origin allow-presentation allow-forms';
            
                // Add error handling
                iframe.onerror = () => {
                    console.error('❌ خطأ في تحميل iframe من aflam4you.net');
                    this.showAflamError('فشل في تحميل المحتوى');
                };
            
                // إضافة حماية من الإعلانات وإعادة التوجيه
                iframe.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
                iframe.setAttribute('loading', 'lazy');
                
                // إزالة sandbox للسماح بالتشغيل الكامل بدون قيود
                // iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-presentation allow-forms allow-popups-to-escape-sandbox allow-autoplay');
            
                // منع النوافذ المنبقة من iframe - فقط للإطارات الجديدة
                if (isNewIframe) {
                    iframe.addEventListener('load', function() {
                        try {
                            // منع النوافذ المنبقة من داخل iframe
                            if (iframe.contentWindow) {
                                const originalIframeOpen = iframe.contentWindow.open;
                                iframe.contentWindow.open = function(url) {
                                    console.log('🚫 تم منع نافذة منبقة من aflam4you iframe:', url);
                                    return null;
                                };
                                
                                // منع النوافذ المنبقة عند النقر
                                iframe.contentWindow.addEventListener('click', function(e) {
                                    if (e.target && (
                                        e.target.textContent && (
                                            e.target.textContent.includes('unmute') ||
                                            e.target.textContent.includes('click here') ||
                                            e.target.textContent.includes('Click here')
                                        )
                                    )) {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        console.log('🚫 تم منع النقر على رابط unmute');
                                        return false;
                                    }
                                });
                            }
                        } catch (e) {
                            // Cross-origin error متوقع
                            console.log('✅ حماية iframe مفعلة (Cross-origin)');
                        }
                    });
                }
            
                // منع إعادة التوجيه غير المرغوب فيها مع التشغيل التلقائي - فقط للإطارات الجديدة
                if (isNewIframe) {
                    iframe.onload = () => {
                        console.log('✅ تم تحميل iframe من aflam4you.net');
                        loading.style.display = 'none';
                        
                        // محاولة التشغيل التلقائي للفيديو داخل iframe بشكل فوري
                        setTimeout(() => {
                            this.attemptAflamAutoplay(iframe);
                        }, 500);
                        
                        // Check for blocking after a delay
                        setTimeout(() => {
                            try {
                                if (iframe.contentDocument && iframe.contentDocument.body) {
                                    const bodyText = iframe.contentDocument.body.textContent.toLowerCase();
                                    if (bodyText.includes('blocked') || bodyText.includes('contact the site owner')) {
                                        this.showAflamError('المحتوى محجوب من الموقع');
                                    }
                                    // فحص الإعلانات والنوافذ المنبقة
                                    if (bodyText.includes('advertisement') || bodyText.includes('ad') || bodyText.includes('إعلان') ||
                                        bodyText.includes('unmute') || bodyText.includes('click here to unmute')) {
                                        console.warn('⚠️ تم اكتشاف إعلانات أو نوافذ منبقة في المحتوى');
                                        // محاولة إخفاء الإعلانات والتشغيل التلقائي
                                        this.hideAflamAdsAndAutoplay(iframe);
                                    }
                                }
                            } catch (e) {
                                // Cross-origin error is expected for successful loads
                                console.log('✅ iframe محمل بنجاح (Cross-origin)');
                                // محاولة التشغيل التلقائي حتى مع Cross-origin
                                this.attemptAflamAutoplay(iframe);
                            }
                        }, 1000);
                    };
                }
            
                // Insert iframe after video element only if newly created
                video.parentNode.insertBefore(iframe, video.nextSibling);
            } else {
                console.log('♻️ إعادة استخدام iframe موجود لـ Aflam4You');
                // إعادة تعيين خصائص iframe الموجود
                iframe.style.display = 'block';
                // تأكد من إخفاء شاشة التحميل عند استخدام iframe موجود
                loading.style.display = 'none';
            }
            
            // Set iframe source with autoplay parameters and unmuted audio
            let aflamUrl = url;
            if (!aflamUrl.includes('autoplay')) {
                // إضافة معاملات التشغيل التلقائي بدون كتم الصوت
                aflamUrl += (aflamUrl.includes('?') ? '&' : '?') + 'autoplay=1&muted=0&mute=0&volume=100';
            }
            
            // إعادة تعيين المصدر دائماً لتحميل القناة الجديدة
            iframe.src = aflamUrl;
            console.log('🔄 تم تعيين مصدر جديد لـ iframe:', aflamUrl);
            
            // Show iframe
            iframe.style.display = 'block';
            
            // Add double-click fullscreen support for aflam iframe - فقط للإطارات الجديدة
            if (isNewIframe) {
                iframe.addEventListener('dblclick', () => {
                    console.log('🖱️ ضغط مزدوج على aflam iframe - محاولة التكبير');
                    this.toggleFullscreen();
                });
            }
            
            // إزالة جميع مستمعي الأحداث القدامى وإضافة جديدة
            const newIframe = iframe.cloneNode(false);
            if (iframe.parentNode) {
                iframe.parentNode.replaceChild(newIframe, iframe);
                iframe = newIframe;
                // تحديث الخصائص بعد الاستنساخ
                iframe.id = 'aflamPlayer';
                iframe.src = aflamUrl;
                iframe.style.width = '100%';
                iframe.style.height = '100%';
                iframe.style.border = 'none';
                iframe.style.background = '#000';
                iframe.style.display = 'block';
                iframe.allowFullscreen = true;
                iframe.allow = 'autoplay; fullscreen; picture-in-picture; xr-spatial-tracking; encrypted-media';
                iframe.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
                iframe.setAttribute('loading', 'lazy');
                // إزالة sandbox للسماح بالتشغيل الكامل بدون قيود
                // iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-presentation allow-forms allow-popups-to-escape-sandbox allow-autoplay');
                
                // إضافة مستمع حدث التحميل الجديد
                iframe.addEventListener('load', () => {
                    console.log('✅ تم تحميل القناة الجديدة في Aflam4You');
                    loading.style.display = 'none';
                    
                    // محاولة فورية للتشغيل التلقائي
                    setTimeout(() => {
                        console.log('🔄 محاولة إضافية للتشغيل التلقائي في Aflam4You...');
                        this.attemptAflamAutoplay(iframe);
                        // محاولة إلغاء كتم الصوت بشكل متكرر
                        this.forceUnmuteAflam(iframe);
                    }, 1000);
                    
                    // محاولة ثانية بعد ثانيتين
                    setTimeout(() => {
                        console.log('🔄 محاولة ثانية للتشغيل التلقائي في Aflam4You...');
                        this.attemptAflamAutoplay(iframe);
                        this.forceUnmuteAflam(iframe);
                    }, 2000);
                });
                
                // إضافة مستمع حدث الضغط المزدوج
                iframe.addEventListener('dblclick', () => {
                    console.log('🖱️ ضغط مزدوج على aflam iframe - محاولة التكبير');
                    this.toggleFullscreen();
                });
                
                console.log('✅ تم تحديث iframe مع مستمعي أحداث جديدة');
            }
            
        } catch (error) {
            console.error('❌ خطأ في تحميل iframe من aflam4you.net:', error);
            this.showAflamError(error.message);
            throw error;
        }
    }

    // Load direct HLS stream
    async loadDirectStream(streamUrl) {
        const video = document.getElementById('videoPlayer');
        const loading = document.getElementById('videoLoading');
        
        try {
            // Show video element
            video.style.display = 'block';
            
            // Hide any existing iframes
            const aflamIframe = document.getElementById('aflamPlayer');
            if (aflamIframe) {
                aflamIframe.style.display = 'none';
            }
            
            // Load HLS stream
            if (typeof Hls !== 'undefined' && Hls.isSupported()) {
                // Destroy existing HLS instance
                if (this.hls) {
                    this.hls.destroy();
                    this.hls = null;
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

                this.hls.loadSource(streamUrl);
                this.hls.attachMedia(video);

                this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
                    loading.style.display = 'none';
                    if (this.settings.autoplay) {
                        video.play().catch(console.error);
                    }
                });

                this.hls.on(Hls.Events.ERROR, (event, data) => {
                    console.error('HLS Error:', data);
                    if (data.fatal) {
                        this.showStreamError('جارٍ تحميل البث...');
                    }
                });

            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                // Native HLS support (Safari)
                video.src = streamUrl;
                loading.style.display = 'none';
                if (this.settings.autoplay) {
                    this.enhancedAutoplay(video);
                }
            } else {
                throw new Error('المتصفح لا يدعم تشغيل البث المباشر');
            }
            
            console.log('✅ تم تحميل البث المباشر بنجاح:', streamUrl);
            
            // Add double-click fullscreen support for video element
            video.addEventListener('dblclick', () => {
                console.log('🖱️ ضغط مزدوج على الفيديو - محاولة التكبير');
                this.toggleFullscreen();
            });
            
        } catch (error) {
            console.error('❌ خطأ في تحميل البث المباشر:', error);
            this.showStreamError(error.message);
            throw error;
        }
    }

    // Show stream error message
    showStreamError(message) {
        const loading = document.getElementById('videoLoading');
        loading.style.display = 'flex';
        loading.innerHTML = `
            <div class="loading-spinner">
                <div class="spinner"></div>
                <p>جارٍ تحميل البث...</p>
            </div>
        `;
    }

    // Show aflam error message
    showAflamError(errorMessage = '') {
        const loading = document.getElementById('videoLoading');
        const iframe = document.getElementById('aflamPlayer');
        
        if (iframe) {
            iframe.style.display = 'none';
        }
        
        loading.style.display = 'flex';
        loading.innerHTML = `
            <div class="error-icon">🚫</div>
            <p>المحتوى محجوب</p>
            <small>${errorMessage || 'لا يمكن تحميل المحتوى من aflam4you.net'}</small>
            <div class="error-solutions">
                <p><strong>الحلول المقترحة:</strong></p>
                <ul>
                    <li>تأكد من أن الموقع غير محجوب في منطقتك</li>
                    <li>جرب استخدام VPN</li>
                    <li>تحقق من الرابط في المتصفح مباشرة</li>
                    <li>اتصل بمالك الموقع لحل المشكلة</li>
                </ul>
                <button class="retry-btn" onclick="app.retryAflamLoad()">
                    <i class="fas fa-redo"></i>
                    إعادة المحاولة
                </button>
                <button class="open-external-btn" onclick="app.openAflamExternal()">
                    <i class="fas fa-external-link-alt"></i>
                    فتح في نافذة جديدة
                </button>
            </div>
        `;
    }

    // Retry aflam load
    retryAflamLoad() {
        if (this.currentChannel && this.currentChannel.url) {
            this.loadAflamVideo(this.currentChannel.url);
        }
    }

    // Open aflam in external window
    openAflamExternal() {
        if (this.currentChannel && this.currentChannel.url) {
            window.open(this.currentChannel.url, '_blank', 'noopener,noreferrer');
        }
    }

    // Load YouTube video using iframe
    async loadYouTubeVideo(url, quality = 'auto') {
        const video = document.getElementById('videoPlayer');
        const loading = document.getElementById('videoLoading');
        
        try {
            // Validate URL
            if (!url || url.trim() === '') {
                throw new Error('رابط اليوتيوب فارغ أو غير صحيح');
            }

            const videoId = this.getYouTubeVideoId(url);
            if (!videoId) {
                throw new Error('رابط اليوتيوب غير صحيح - تحقق من الرابط');
            }

            // Stop any existing YouTube player
            const existingIframe = document.getElementById('youtubePlayer');
            if (existingIframe) {
                existingIframe.src = '';
                existingIframe.remove();
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
                // إزالة sandbox لتجنب التحذيرات
                // iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-presentation');
                
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
            
            // Add double-click fullscreen support for YouTube iframe
            iframe.addEventListener('dblclick', () => {
                console.log('🖱️ ضغط مزدوج على YouTube iframe - محاولة التكبير');
                this.toggleFullscreen();
            });
            
            // Show ad block notification
            this.showAdBlockNotification();
            
            // Update quality display
            this.updateYouTubeQualityDisplay(quality);
            
        } catch (error) {
            console.error('Error loading YouTube video:', error);
            this.showVideoError('جارٍ تحميل البث...');
        }
    }

    // Build YouTube embed URL with quality parameters and ad blocking
    buildYouTubeEmbedUrl(videoId, quality) {
        let embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&showinfo=0&controls=1&iv_load_policy=3&cc_load_policy=0&fs=1&disablekb=0&enablejsapi=1&origin=${window.location.origin}`;
        
        // Add ad blocking parameters
        embedUrl += '&adblock=1&no_ads=1&adblocker=1';
        
        // إضافة معاملات للتشغيل التلقائي المحسن
        embedUrl += '&mute=1&start=0&loop=0&playlist=' + videoId;
        
        // إضافة معاملات الجودة
        if (quality !== 'auto') {
            embedUrl += `&vq=${quality}`;
        }
        
        console.log('🔗 رابط YouTube المحسن:', embedUrl);
        
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

    // Show ad block notification for YouTube videos
    showAdBlockNotification() {
        const notification = document.getElementById('adBlockNotification');
        if (notification) {
            notification.classList.add('show');
            
            // Hide notification after 3 seconds
            setTimeout(() => {
                notification.classList.remove('show');
            }, 3000);
        }
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
        
        // تنظيف جميع أنواع البث باستخدام الدالة المساعدة
        this.cleanupAllMedia();
        
        // Hide ad block notification
        const adBlockNotification = document.getElementById('adBlockNotification');
        if (adBlockNotification) {
            adBlockNotification.classList.remove('show');
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

    getActivePlayer() {
        const video = document.getElementById('videoPlayer');
        const youtubePlayer = document.getElementById('youtubePlayer');
        const aflamPlayer = document.getElementById('aflamPlayer');
        const elahmadPlayer = document.getElementById('elahmadPlayer');
        
        // Check video player (HLS streams and SHLS)
        if (video && video.style.display !== 'none' && video.src) {
            // Check if it's a SHLS stream
            if (this.isShlsUrl(video.src)) {
                return { player: video, type: 'shls' };
            }
            return { player: video, type: 'video' };
        }
        
        // Check YouTube player
        if (youtubePlayer && youtubePlayer.style.display !== 'none' && youtubePlayer.src) {
            return { player: youtubePlayer, type: 'youtube' };
        }
        
        // Check Aflam player
        if (aflamPlayer && aflamPlayer.style.display !== 'none' && aflamPlayer.src) {
            return { player: aflamPlayer, type: 'aflam' };
        }
        
        // Check Elahmad player
        if (elahmadPlayer && elahmadPlayer.style.display !== 'none' && elahmadPlayer.src) {
            return { player: elahmadPlayer, type: 'elahmad' };
        }
        
        return null;
    }

    toggleFullscreen() {
        const activePlayerInfo = this.getActivePlayer();
        
        if (!activePlayerInfo) {
            console.warn('لا يوجد مشغل نشط للتكبير');
            return;
        }
        
        const activePlayer = activePlayerInfo.player;
        const playerType = activePlayerInfo.type;
        
        // Check if already in fullscreen
        const isFullscreen = document.fullscreenElement || 
                           document.webkitFullscreenElement || 
                           document.mozFullScreenElement || 
                           document.msFullscreenElement;
        
        if (!isFullscreen) {
            // Enter fullscreen
            console.log(`🎬 محاولة الدخول إلى وضع التكبير مع مشغل ${playerType}`);
            
            // Special handling for elahmad iframe
            if (playerType === 'elahmad') {
                console.log('📺 معالجة خاصة لـ elahmad iframe');
                // Ensure iframe has proper attributes for fullscreen
                if (!activePlayer.allowFullscreen) {
                    activePlayer.allowFullscreen = true;
                }
                if (!activePlayer.allow || !activePlayer.allow.includes('fullscreen')) {
                    activePlayer.allow = 'autoplay; fullscreen; picture-in-picture; xr-spatial-tracking; encrypted-media';
                }
            }
            
            // Special handling for SHLS streams
            if (playerType === 'shls') {
                console.log('📺 معالجة خاصة لـ SHLS stream');
                // Ensure video has proper attributes for fullscreen
                if (!activePlayer.webkitSupportsFullscreen) {
                    activePlayer.webkitSupportsFullscreen = true;
                }
            }
            
            const requestFullscreen = activePlayer.requestFullscreen || 
                                    activePlayer.webkitRequestFullscreen || 
                                    activePlayer.mozRequestFullScreen || 
                                    activePlayer.msRequestFullscreen;
            
            if (requestFullscreen) {
                requestFullscreen.call(activePlayer).catch(error => {
                    console.error('خطأ في دخول وضع التكبير:', error);
                    // Fallback: try to fullscreen the video container
                    const videoContainer = document.querySelector('.video-container');
                    if (videoContainer) {
                        console.log('🔄 محاولة التكبير باستخدام الحاوي كبديل');
                        const containerRequestFullscreen = videoContainer.requestFullscreen || 
                                                        videoContainer.webkitRequestFullscreen || 
                                                        videoContainer.mozRequestFullScreen || 
                                                        videoContainer.msRequestFullscreen;
                        if (containerRequestFullscreen) {
                            containerRequestFullscreen.call(videoContainer).catch(console.error);
                        }
                    }
                });
        } else {
                console.error('المتصفح لا يدعم وضع التكبير');
                // Show user notification
                if (this.notifyError) {
                    this.notifyError('المتصفح لا يدعم وضع التكبير');
                }
            }
        } else {
            // Exit fullscreen
            console.log('🚪 الخروج من وضع التكبير');
            
            const exitFullscreen = document.exitFullscreen || 
                                 document.webkitExitFullscreen || 
                                 document.mozCancelFullScreen || 
                                 document.msExitFullscreen;
            
            if (exitFullscreen) {
                exitFullscreen.call(document).catch(error => {
                    console.error('خطأ في الخروج من وضع التكبير:', error);
                });
            }
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
        if (!this.isLoggedIn) {
            this.showLoginModal();
            return;
        }
        
        document.getElementById('adminModal').classList.add('active');
        this.renderAdminChannels();
        this.updateSaveOrderButton();
        
        // Reset admin search to remove any previous filtering and show all items
        const adminSearch = document.getElementById('adminSearchInput');
        if (adminSearch) {
            adminSearch.value = '';
            setTimeout(() => this.filterAdminChannels(''), 0);
        }

        // Update category options to ensure latest categories are available
        this.updateChannelCategoryOptions();
        
        // إعادة ربط أحداث التبويبات عند فتح لوحة التحكم
        setTimeout(() => {
            this.bindAdminTabEvents();
            this.bindStatusToggleEvents();
            this.bindVpnToggleEvents();
        }, 50);
    }

    closeAdminPanel() {
        document.getElementById('adminModal').classList.remove('active');
    }

    // Login System Functions
    showLoginModal() {
        document.getElementById('loginModal').classList.add('active');
        document.querySelector('.login-content').classList.add('active');
        document.getElementById('adminPassword').focus();
        
        // Add Enter key support
        document.getElementById('adminPassword').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.loginToAdmin();
            }
        });
    }

    closeLoginModal() {
        document.getElementById('loginModal').classList.remove('active');
        document.querySelector('.login-content').classList.remove('active');
        document.getElementById('adminPassword').value = '';
        document.getElementById('loginError').style.display = 'none';
    }

    togglePasswordVisibility() {
        const passwordInput = document.getElementById('adminPassword');
        const toggleIcon = document.querySelector('.toggle-password');
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            toggleIcon.classList.remove('fa-eye');
            toggleIcon.classList.add('fa-eye-slash');
        } else {
            passwordInput.type = 'password';
            toggleIcon.classList.remove('fa-eye-slash');
            toggleIcon.classList.add('fa-eye');
        }
    }

    // دالة لتشفير كلمة المرور باستخدام SHA-256
    async hashPassword(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    // دالة للتحقق من صحة كلمة المرور
    validatePassword(password) {
        // تنظيف المدخل من المسافات الزائدة
        password = password.trim();
        
        // التحقق من الطول (8-50 حرف)
        if (password.length < 8 || password.length > 50) {
            return false;
        }
        
        // التحقق من عدم احتواء رموز خطيرة
        const dangerousChars = /[<>'"&]/;
        if (dangerousChars.test(password)) {
            return false;
        }
        
        return true;
    }

    // دالة لتقييم قوة كلمة المرور
    checkPasswordStrength(password) {
        let score = 0;
        const requirements = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /\d/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        };

        // حساب النقاط
        Object.values(requirements).forEach(req => {
            if (req) score++;
        });

        // تحديد مستوى القوة
        if (score < 2) return { level: 'weak', score: 1 };
        if (score < 4) return { level: 'fair', score: 2 };
        if (score < 5) return { level: 'good', score: 3 };
        return { level: 'strong', score: 4 };
    }

    // دالة لتحديث مؤشر قوة كلمة المرور
    updatePasswordStrength(password) {
        const strengthIndicator = this.checkPasswordStrength(password);
        const strengthFill = document.getElementById('strengthFill');
        const strengthText = document.getElementById('strengthText');
        
        // إزالة جميع الفئات السابقة
        strengthFill.className = 'strength-fill';
        
        if (password.length > 0) {
            strengthFill.classList.add(strengthIndicator.level);
            
            const strengthLabels = {
                weak: 'ضعيفة',
                fair: 'متوسطة',
                good: 'جيدة',
                strong: 'قوية جداً'
            };
            
            strengthText.textContent = strengthLabels[strengthIndicator.level];
        } else {
            strengthText.textContent = 'أدخل كلمة مرور';
        }
    }

    // دالة لتحديث متطلبات كلمة المرور
    updatePasswordRequirements(password) {
        const requirements = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /\d/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        };

        Object.keys(requirements).forEach(req => {
            const element = document.getElementById(`req-${req}`);
            if (element) {
                element.classList.toggle('valid', requirements[req]);
                element.classList.toggle('invalid', !requirements[req]);
            }
        });
    }

    // دالة لتحديث مؤشر تطابق كلمة المرور
    updatePasswordMatch(newPassword, confirmPassword) {
        const matchIcon = document.getElementById('matchIcon');
        const matchText = document.getElementById('matchText');
        
        if (confirmPassword.length === 0) {
            matchIcon.className = 'fas fa-check-circle match-icon';
            matchText.className = 'match-text';
            matchText.textContent = 'تطابق كلمة المرور';
            return false;
        }
        
        if (newPassword === confirmPassword) {
            matchIcon.classList.add('valid');
            matchIcon.classList.remove('invalid');
            matchText.classList.add('valid');
            matchText.classList.remove('invalid');
            matchText.textContent = 'تطابق كلمة المرور';
            return true;
        } else {
            matchIcon.classList.add('invalid');
            matchIcon.classList.remove('valid');
            matchText.classList.add('invalid');
            matchText.classList.remove('valid');
            matchText.textContent = 'كلمة المرور غير متطابقة';
            return false;
        }
    }

    // دوال إظهار/إخفاء كلمة المرور
    toggleCurrentPasswordVisibility() {
        const passwordInput = document.getElementById('currentPassword');
        const toggleIcon = document.querySelector('.toggle-current-password');
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            toggleIcon.classList.remove('fa-eye');
            toggleIcon.classList.add('fa-eye-slash');
        } else {
            passwordInput.type = 'password';
            toggleIcon.classList.remove('fa-eye-slash');
            toggleIcon.classList.add('fa-eye');
        }
    }

    toggleNewPasswordVisibility() {
        const passwordInput = document.getElementById('newPassword');
        const toggleIcon = document.querySelector('.toggle-new-password');
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            toggleIcon.classList.remove('fa-eye');
            toggleIcon.classList.add('fa-eye-slash');
        } else {
            passwordInput.type = 'password';
            toggleIcon.classList.remove('fa-eye-slash');
            toggleIcon.classList.add('fa-eye');
        }
    }

    toggleConfirmPasswordVisibility() {
        const passwordInput = document.getElementById('confirmPassword');
        const toggleIcon = document.querySelector('.toggle-confirm-password');
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            toggleIcon.classList.remove('fa-eye');
            toggleIcon.classList.add('fa-eye-slash');
        } else {
            passwordInput.type = 'password';
            toggleIcon.classList.remove('fa-eye-slash');
            toggleIcon.classList.add('fa-eye');
        }
    }

    // دالة تغيير كلمة المرور
    async changePassword() {
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        // التحقق من كلمة المرور الحالية
        const currentHashedPassword = await this.hashPassword(currentPassword);
        if (currentHashedPassword !== this.adminPassword) {
            this.notifyError('كلمة المرور الحالية غير صحيحة');
            return;
        }
        
        // التحقق من صحة كلمة المرور الجديدة
        if (!this.validatePassword(newPassword)) {
            this.notifyError('كلمة المرور الجديدة لا تلبي المتطلبات');
            return;
        }
        
        // التحقق من تطابق كلمة المرور
        if (newPassword !== confirmPassword) {
            this.notifyError('كلمة المرور الجديدة غير متطابقة');
            return;
        }
        
        // التحقق من أن كلمة المرور الجديدة مختلفة عن الحالية
        if (currentPassword === newPassword) {
            this.notifyError('كلمة المرور الجديدة يجب أن تكون مختلفة عن الحالية');
            return;
        }
        
        try {
            // تشفير كلمة المرور الجديدة وحفظها
            const newHashedPassword = await this.hashPassword(newPassword);
            this.adminPassword = newHashedPassword;
            
            // حفظ كلمة المرور الجديدة في localStorage
            localStorage.setItem('anon_tv_admin_password', newHashedPassword);
            
            // حفظ تاريخ آخر تغيير
            localStorage.setItem('anon_tv_last_password_change', new Date().toISOString());
            
            // مسح النموذج
            this.resetPasswordForm();
            
            // إظهار رسالة نجاح
            this.notifySuccess('تم تغيير كلمة المرور بنجاح');
            
            // محاولة المزامنة التلقائية مع السحابة
            if (this.remoteStorage.enabled && this.remoteStorage.repository && this.remoteStorage.token) {
                this.notifyInfo('جارٍ مزامنة كلمة المرور الجديدة مع السحابة...');
                
                try {
                    const syncSuccess = await this.syncToRemote();
                    if (syncSuccess) {
                        setTimeout(() => {
                            this.notifySuccess('تم مزامنة كلمة المرور الجديدة مع جميع الأجهزة المتصلة');
                        }, 1000);
                    } else {
                        setTimeout(() => {
                            this.notifyWarning('تم تغيير كلمة المرور محلياً، لكن فشلت المزامنة مع السحابة. تأكد من إعدادات المزامنة السحابية');
                        }, 1000);
                    }
                } catch (syncError) {
                    console.error('خطأ في مزامنة كلمة المرور:', syncError);
                    setTimeout(() => {
                        this.notifyWarning('تم تغيير كلمة المرور محلياً، لكن فشلت المزامنة مع السحابة');
                    }, 1000);
                }
            } else {
                // إشعار المستخدم بضرورة تفعيل المزامنة السحابية
                setTimeout(() => {
                    this.notifyWarning('كلمة المرور تغيرت محلياً فقط. لاستخدامها على أجهزة أخرى، فعّل المزامنة السحابية من إعدادات عامة');
                }, 2000);
                
                // إظهار زر سريع لتفعيل المزامنة السحابية
                setTimeout(() => {
                    this.showCloudSyncPrompt();
                }, 4000);
            }
            
            // تحديث معلومات الأمان
            this.updateSecurityInfo();
            
        } catch (error) {
            console.error('خطأ في تغيير كلمة المرور:', error);
            this.notifyError('حدث خطأ أثناء تغيير كلمة المرور');
        }
    }

    // دالة إعادة تعيين نموذج كلمة المرور
    resetPasswordForm() {
        document.getElementById('currentPassword').value = '';
        document.getElementById('newPassword').value = '';
        document.getElementById('confirmPassword').value = '';
        
        // إعادة تعيين مؤشرات القوة والتطابق
        this.updatePasswordStrength('');
        this.updatePasswordRequirements('');
        this.updatePasswordMatch('', '');
    }

    // دالة إظهار نافذة سريعة لتفعيل المزامنة السحابية
    showCloudSyncPrompt() {
        const notification = document.createElement('div');
        notification.className = 'notification cloud-sync-prompt';
        notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-icon">
                    <i class="fas fa-cloud-upload-alt"></i>
                </div>
                <div class="notification-text">
                    <h4>فعّل المزامنة السحابية</h4>
                    <p>للاستفادة من مزامنة كلمة المرور والقنوات بين جميع أجهزتك. عند التحديث من GitHub، ستتم مزامنة التحديثات تلقائياً مع جميع الأجهزة المتصلة.</p>
                </div>
                <div class="notification-actions">
                    <button class="btn-primary" onclick="app.openSettings(); app.closeNotification(this)">
                        <i class="fas fa-cog"></i>
                        الإعدادات
                    </button>
                    <button class="btn-secondary" onclick="app.closeNotification(this)">
                        <i class="fas fa-times"></i>
                        لاحقاً
                    </button>
                </div>
            </div>
        `;
        
        document.getElementById('notificationsContainer').appendChild(notification);
        
        // إظهار الإشعار مع تأثير
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // إخفاء الإشعار تلقائياً بعد 10 ثوان
        setTimeout(() => {
            if (notification.parentNode) {
                notification.classList.remove('show');
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }
        }, 10000);
    }

    // دالة إغلاق الإشعارات
    closeNotification(button) {
        const notification = button.closest('.notification');
        if (notification) {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
    }

    // دالة إلغاء تغيير كلمة المرور
    cancelPasswordChange() {
        this.resetPasswordForm();
        this.notifyInfo('تم إلغاء تغيير كلمة المرور');
    }

    // دالة تحديث معلومات الأمان
    updateSecurityInfo() {
        const lastChange = localStorage.getItem('anon_tv_last_password_change');
        const lastChangeElement = document.getElementById('lastPasswordChange');
        
        if (lastChange) {
            const changeDate = new Date(lastChange);
            lastChangeElement.textContent = changeDate.toLocaleString('ar-SA');
        } else {
            lastChangeElement.textContent = 'لم يتم تغييرها من قبل';
        }
        
        // تحديث حالة الجلسة
        const sessionStatus = document.getElementById('sessionStatus');
        sessionStatus.textContent = this.isLoggedIn ? 'نشطة' : 'غير نشطة';
    }

    async loginToAdmin() {
        const password = document.getElementById('adminPassword').value;
        const errorElement = document.getElementById('loginError');
        
        // التحقق من صحة كلمة المرور
        if (!this.validatePassword(password)) {
            errorElement.style.display = 'flex';
            document.getElementById('adminPassword').value = '';
            document.getElementById('adminPassword').focus();
            this.notifyError('كلمة المرور غير صحيحة أو تحتوي على رموز غير مسموحة');
            return;
        }
        
        // تشفير كلمة المرور المدخلة ومقارنتها مع المخزنة
        const hashedPassword = await this.hashPassword(password);
        
        // رسائل التشخيص (يمكن حذفها لاحقاً)
        console.log('كلمة المرور المدخلة:', password);
        console.log('كلمة المرور المشفرة:', hashedPassword);
        console.log('كلمة المرور المخزنة:', this.adminPassword);
        console.log('هل تتطابق؟', hashedPassword === this.adminPassword);
        
        if (hashedPassword === this.adminPassword) {
            this.isLoggedIn = true;
            this.saveLoginState(); // حفظ حالة تسجيل الدخول
            this.closeLoginModal();
            this.toggleChannelActions(true);
            this.toggleAdminBadge(true); // إظهار Admin badge
            this.openAdminPanel();
            this.notifySuccess('مرحباً بك في لوحة التحكم - مزود الخدمة');
        } else {
            errorElement.style.display = 'flex';
            document.getElementById('adminPassword').value = '';
            document.getElementById('adminPassword').focus();
            this.notifyError('كلمة المرور غير صحيحة');
        }
    }

    logoutFromAdmin() {
        this.isLoggedIn = false;
        this.saveLoginState(); // حفظ حالة تسجيل الخروج
        this.closeAdminPanel();
        this.toggleChannelActions(false);
        this.toggleAdminBadge(false); // إخفاء Admin badge
        this.notifyInfo('تم تسجيل الخروج من مزود الخدمة');
    }

    // دالة للتحقق من حالة تسجيل الدخول الإداري
    isAdminLoggedIn() {
        return this.isLoggedIn;
    }

    // حفظ حالة تسجيل الدخول في localStorage
    saveLoginState() {
        try {
            localStorage.setItem('anon_tv_login_state', JSON.stringify({
                isLoggedIn: this.isLoggedIn,
                timestamp: Date.now()
            }));
        } catch (error) {
            console.warn('لا يمكن حفظ حالة تسجيل الدخول:', error);
        }
    }

    // تحميل حالة تسجيل الدخول من localStorage
    loadLoginState() {
        try {
            const savedState = localStorage.getItem('anon_tv_login_state');
            if (savedState) {
                const loginData = JSON.parse(savedState);
                // التحقق من أن البيانات حديثة (أقل من 24 ساعة)
                const isRecent = (Date.now() - loginData.timestamp) < (24 * 60 * 60 * 1000);
                if (isRecent && loginData.isLoggedIn) {
                    this.isLoggedIn = true;
                    this.toggleChannelActions(true);
                    this.toggleAdminBadge(true); // إظهار Admin badge عند تحميل الحالة
                    return true;
                }
            }
        } catch (error) {
            console.warn('لا يمكن تحميل حالة تسجيل الدخول:', error);
        }
        
        // إذا لم تكن هناك حالة محفوظة أو انتهت صلاحيتها
        this.isLoggedIn = false;
        this.toggleChannelActions(false);
        this.toggleAdminBadge(false); // إخفاء Admin badge في الحالة الافتراضية
        return false;
    }

    toggleChannelActions(show) {
        const channelActions = document.querySelectorAll('.channel-actions');
        channelActions.forEach(actions => {
            actions.style.display = show ? 'flex' : 'none';
        });
    }

    // إظهار/إخفاء Admin badge
    toggleAdminBadge(show) {
        const adminBadge = document.getElementById('adminBadge');
        if (adminBadge) {
            adminBadge.style.display = show ? 'flex' : 'none';
        }
    }

    switchAdminTab(tab) {
        console.log(`🔄 محاولة التبديل إلى تبويب: ${tab}`);
        
        // Update active tab
        const allTabs = document.querySelectorAll('.admin-tab');
        console.log(`📊 عدد التبويبات الموجودة: ${allTabs.length}`);
        
        allTabs.forEach(t => t.classList.remove('active'));
        const activeTab = document.querySelector(`[data-tab="${tab}"]`);
        
        if (activeTab) {
            activeTab.classList.add('active');
            console.log(`✅ تم تفعيل التبويب: ${tab}`);
        } else {
            console.warn(`⚠️ لم يتم العثور على التبويب: ${tab}`);
        }

        // Show tab content
        const allContents = document.querySelectorAll('.admin-tab-content');
        console.log(`📊 عدد محتويات التبويبات: ${allContents.length}`);
        
        allContents.forEach(content => {
            content.classList.remove('active');
        });
        
        const activeContent = document.getElementById(`${tab}Tab`);
        if (activeContent) {
            activeContent.classList.add('active');
            console.log(`✅ تم إظهار محتوى التبويب: ${tab}Tab`);
        } else {
            console.warn(`⚠️ لم يتم العثور على محتوى التبويب: ${tab}Tab`);
        }

        // Load categories when switching to categories tab
        if (tab === 'categories') {
            this.renderCategories();
        }
        
        // تحديث معلومات الأمان عند فتح تبويب الأمان
        if (tab === 'security') {
            this.updateSecurityInfo();
        }
        
        // Update category options when switching to add tab
        if (tab === 'add') {
            this.updateChannelCategoryOptions();
        }

        // Ensure all channels are visible when switching to channels tab
        if (tab === 'channels') {
            const adminSearch = document.getElementById('adminSearchInput');
            if (adminSearch) {
                adminSearch.value = '';
            }
            setTimeout(() => this.filterAdminChannels(''), 0);
        }

        // Reset form when switching to add tab (unless we're editing)
        // This should be after updateChannelCategoryOptions to ensure categories are loaded
        if (tab === 'add' && !this.editingChannelId) {
            this.resetAddChannelForm();
        }
    }

    renderAdminChannels() {
        const list = document.getElementById('adminChannelsList');
        list.innerHTML = '';

        this.channels.forEach((channel, index) => {
            const item = document.createElement('div');
            item.className = 'admin-channel-item';
            // Drag & drop disabled
            item.draggable = false;
            item.dataset.channelId = channel.id;
            item.dataset.index = index;
            
            // إنشاء placeholder مصغر للوحة التحكم
            const adminPlaceholder = this.createAdminLogoPlaceholder(channel);
            
            // تحديد حالة القناة
            const isActive = channel.status === 'active';
            const statusClass = isActive ? 'active' : 'inactive';
            const statusIcon = isActive ? 'fas fa-circle' : 'fas fa-circle';
            
            item.innerHTML = `
                <div class="admin-channel-info">
                    <img src="${channel.logo}" alt="${channel.name}" class="admin-channel-logo"
                         onerror="this.src='${adminPlaceholder}'; this.classList.add('admin-placeholder-logo');">
                    <div>
                        <div class="admin-channel-title-row">
                            <h4>${channel.name}</h4>
                            <div class="admin-channel-status-indicator ${statusClass}" title="${isActive ? 'القناة تعمل' : 'القناة لا تعمل'}">
                                <i class="${statusIcon}"></i>
                            </div>
                        </div>
                        <p style="color: var(--text-secondary); font-size: 0.9rem;">${this.getCategoryName(channel.category)} • ${channel.country}</p>
                    </div>
                </div>
                <div class="admin-channel-actions">
                    <div class="move-buttons">
                        <div class="position-controls">
                            <label class="position-label">الموقع:</label>
                            <input type="number" 
                                   class="position-input" 
                                   value="${index + 1}" 
                                   min="1" 
                                   max="${this.channels.length}"
                                   step="1"
                                   inputmode="numeric"
                                   pattern="[0-9]*"
                                   onfocus="this.select()"
                                   onchange="app.moveChannelToPosition(${index}, this.value)"
                                   title="أدخل رقم الموقع الجديد">
                        </div>
                        <div class="arrow-buttons">
                            <button class="move-btn" onclick="app.moveChannelUp(${index})" ${index === 0 ? 'disabled' : ''} title="نقل لأعلى">
                            <i class="fas fa-chevron-up"></i>
                        </button>
                            <button class="move-btn" onclick="app.moveChannelDown(${index})" ${index === this.channels.length - 1 ? 'disabled' : ''} title="نقل لأسفل">
                            <i class="fas fa-chevron-down"></i>
                        </button>
                            <button class="move-btn" onclick="app.moveChannelToTop(${index})" ${index === 0 ? 'disabled' : ''} title="نقل إلى الأعلى">
                                <i class="fas fa-angle-double-up"></i>
                            </button>
                            <button class="move-btn" onclick="app.moveChannelToBottom(${index})" ${index === this.channels.length - 1 ? 'disabled' : ''} title="نقل إلى الأسفل">
                                <i class="fas fa-angle-double-down"></i>
                        </button>
                        </div>
                    </div>
                    <button class="edit-btn" onclick="app.editChannel(${channel.id}, event)">
                        <i class="fas fa-edit"></i> تعديل
                    </button>
                    <button class="delete-btn" onclick="app.deleteChannel(${channel.id}, event)">
                        <i class="fas fa-trash"></i> حذف
                    </button>
                </div>
            `;
            
            // السحب والإفلات معطل
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
            const channelId = parseInt(item.dataset.channelId);
            
            // العثور على رقم القناة
            const channelIndex = this.channels.findIndex(ch => ch.id === channelId);
            const channelNumber = channelIndex + 1;
            
            const shouldShow = name.includes(searchTerm) || 
                              channelNumber.toString().includes(searchTerm);
            item.style.display = shouldShow ? 'flex' : 'none';
        });
    }

    addChannel() {
        // Get form values
        const name = document.getElementById('channelName').value.trim();
        const url = document.getElementById('channelUrl').value.trim();
        const logo = document.getElementById('channelLogo').value.trim();
        const category = document.getElementById('channelCategory').value;
        const country = document.getElementById('channelCountryInput').value.trim();
        
        // Auto-detect URL type
        let type = 'hls'; // default
        if (this.detectedUrlType) {
            type = this.detectedUrlType;
        } else if (this.isYouTubeUrl(url)) {
            type = 'youtube';
        } else if (url.includes('.m3u8')) {
            type = 'hls';
        }

        // Validate required fields (logo is optional)
        console.log('التحقق من البيانات في addChannel:', { name, url, logo, category, country });
        if (!name || !url || !category || !country) {
            this.notifyWarning('يرجى ملء جميع الحقول المطلوبة!');
            console.log('فشل في التحقق من البيانات المطلوبة');
            return;
        }

        // Check if we're editing an existing channel
        if (this.editingChannelId) {
            this.updateChannel(this.editingChannelId);
            return;
        }

        // Get status from form
        const status = document.getElementById('channelStatus').value || 'active';
        
        // Get VPN requirement from form
        const vpn = document.getElementById('channelVpn').value === 'true';
        
        // Add new channel
        const newChannel = {
            id: Math.max(...this.channels.map(c => c.id), 0) + 1, // Generate proper unique ID
            name: name,
            url: url,
            logo: logo || '', // Allow empty logo
            category: category,
            country: country,
            type: type,
            status: status,
            vpn: vpn
        };

        this.channels.push(newChannel);
        this.saveChannelsToStorage();
        this.filteredChannels = [...this.channels]; // Update filtered channels too
        this.renderChannels();
        this.renderAdminChannels();
        this.updateChannelStats(); // تحديث عدد القنوات في الشريط العلوي
        
        this.resetAddChannelForm();
        this.showNotification('success', 'تم إضافة القناة', 'تم إضافة القناة بنجاح وحفظها!');
        
        
        // المزامنة التلقائية مع السحابة
        if (this.remoteStorage.enabled && this.remoteStorage.autoSync) {
            this.syncToRemote().catch(error => {
                console.error('فشل في المزامنة التلقائية بعد إضافة القناة:', error);
                setTimeout(() => {
                    this.notifyWarning('تم إضافة القناة محلياً، لكن فشلت المزامنة التلقائية. يمكنك المحاولة يدوياً من إعدادات المزامنة السحابية.');
                }, 2000);
            });
        }
    }

    resetAddChannelForm() {
        // Clear editing state
        this.editingChannelId = null;
        
        // Clear all form fields manually instead of using reset()
        document.getElementById('channelName').value = '';
        document.getElementById('channelUrl').value = '';
        document.getElementById('channelLogo').value = '';
        document.getElementById('channelCategory').value = '';
        document.getElementById('channelCountryInput').value = '';
        
        // Clear uploaded logo
        removeLogoPreview();
        
        // Hide URL type indicator
        const urlTypeIndicator = document.getElementById('urlTypeIndicator');
        if (urlTypeIndicator) {
            urlTypeIndicator.style.display = 'none';
        }
        
        // Reset detected URL type
        this.detectedUrlType = null;
        
        // Reset status toggle
        this.updateStatusToggleUI('active');
        
        // Reset VPN toggle to default value (true)
        this.updateVpnToggleUI(true);
        
        // Reset button text and class
        const submitBtn = document.querySelector('#addChannelForm button[type="submit"]');
        if (submitBtn) {
            submitBtn.textContent = 'إضافة القناة';
            submitBtn.className = 'add-btn';
        }
        
        // إعادة تعيين زر التعديل إلى حالته الأصلية
        const saveButton = document.querySelector('.save-btn');
        if (saveButton) {
            saveButton.innerHTML = '<i class="fas fa-edit"></i> تعديل';
            saveButton.classList.remove('save-btn');
            saveButton.classList.add('edit-btn');
            saveButton.onclick = function(event) {
                event.stopPropagation();
                // إعادة تعيين وظيفة التعديل الأصلية
                const channelId = this.getAttribute('data-channel-id');
                if (channelId && window.app) {
                    window.app.editChannel(parseInt(channelId), event);
                }
            };
        }
        
        // Reset form title if it exists
        const formTitle = document.querySelector('#addTab h5, #addTab .form-title');
        if (formTitle) {
            formTitle.textContent = 'إضافة قناة جديدة';
        }
        
        // Note: updateChannelCategoryOptions() is called in switchAdminTab() 
        // to ensure proper timing and avoid conflicts
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
        
        // Wait for tab switch to complete
        setTimeout(() => {
            document.getElementById('channelName').value = channel.name;
            document.getElementById('channelUrl').value = channel.url;
            document.getElementById('channelLogo').value = channel.logo;
            document.getElementById('channelCategory').value = channel.category;
            document.getElementById('channelCountryInput').value = channel.country;
            document.getElementById('channelStatus').value = channel.status || 'active';
            
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
            
            // Re-bind status toggle events for the new form
            this.bindStatusToggleEvents();
            this.bindVpnToggleEvents();
            
            // Update status toggle UI after binding events
            setTimeout(() => {
                this.updateStatusToggleUI(channel.status || 'active');
                this.updateVpnToggleUI(channel.vpn || false);
            }, 100);
        }, 300);
        
        // Clear any uploaded logo preview when editing
        removeLogoPreview();
        
        // Auto-detect URL type for editing
        this.detectedUrlType = channel.type || 'hls';
        this.detectUrlType();

        // Update button text to indicate editing mode
        document.querySelector('.add-btn').textContent = 'تحديث القناة';
        
        // تغيير زر التعديل إلى زر الحفظ في وضع التعديل
        const editButton = document.querySelector('.edit-btn');
        if (editButton) {
            editButton.innerHTML = '<i class="fas fa-save"></i> حفظ';
            editButton.classList.remove('edit-btn');
            editButton.classList.add('save-btn');
            editButton.onclick = function(event) {
                event.stopPropagation();
                if (window.app && window.app.editingChannelId) {
                    window.app.updateChannel(window.app.editingChannelId);
                }
            };
        }
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
        const country = document.getElementById('channelCountryInput').value.trim();
        
        // Auto-detect URL type
        let type = 'hls'; // default
        if (this.detectedUrlType) {
            type = this.detectedUrlType;
        } else if (this.isYouTubeUrl(url)) {
            type = 'youtube';
        } else if (url.includes('.m3u8')) {
            type = 'hls';
        }

        // Validate required fields (logo is optional)
        if (!name || !url || !category || !country) {
            this.notifyWarning('يرجى ملء جميع الحقول المطلوبة!');
            return;
        }

        // Get status from form
        const status = document.getElementById('channelStatus').value || 'active';
        
        // Get VPN requirement from form
        const vpn = document.getElementById('channelVpn').value === 'true';
        
        // Update the channel
        this.channels[channelIndex] = {
            ...this.channels[channelIndex],
            name: name,
            url: url,
            logo: logo || '', // Allow empty logo
            category: category,
            country: country,
            type: type,
            status: status,
            vpn: vpn
        };

        // Save and refresh
        this.saveChannelsToStorage();
        this.filteredChannels = [...this.channels]; // Update filtered channels too
        this.renderChannels();
        this.renderAdminChannels();
        
        // Reset editing state and form
        this.resetAddChannelForm();
        
        this.showNotification('success', 'تم تحديث القناة', 'تم تحديث القناة وحفظ التغييرات بنجاح!');
        
        
        // المزامنة التلقائية مع السحابة
        if (this.remoteStorage.enabled && this.remoteStorage.autoSync) {
            this.syncToRemote().catch(error => {
                console.error('فشل في المزامنة التلقائية بعد تحديث القناة:', error);
                setTimeout(() => {
                    this.notifyWarning('تم تحديث القناة محلياً، لكن فشلت المزامنة التلقائية. يمكنك المحاولة يدوياً من إعدادات المزامنة السحابية.');
                }, 2000);
            });
        }
        
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
            
            // Remove from channels array
            this.channels = this.channels.filter(c => c.id !== id);
            this.filteredChannels = [...this.channels]; // Update filtered channels too
            
            // Save to storage
            this.saveChannelsToStorage();
            
            // Re-render channels
            this.renderChannels();
            this.renderAdminChannels();
            this.updateChannelStats(); // تحديث عدد القنوات في الشريط العلوي
            
            // Show success notification
            this.showNotification('success', 'تم حذف القناة', `تم حذف قناة "${channel.name}" بنجاح`);
            
            
            // المزامنة التلقائية مع السحابة
            if (this.remoteStorage.enabled && this.remoteStorage.autoSync) {
                this.syncToRemote().catch(error => {
                    console.error('فشل في المزامنة التلقائية بعد حذف القناة:', error);
                    setTimeout(() => {
                        this.notifyWarning('تم حذف القناة محلياً، لكن فشلت المزامنة التلقائية. يمكنك المحاولة يدوياً من إعدادات المزامنة السحابية.');
                    }, 2000);
                });
            }
        }
    }

    saveChannelsToStorage() {
        try {
            // إضافة وقت آخر تعديل لكل قناة قبل الحفظ
            const channelsWithTimestamp = this.channels.map(channel => ({
                ...channel,
                lastModified: channel.lastModified || new Date().toISOString()
            }));
            
            const channelsData = JSON.stringify(channelsWithTimestamp);
            localStorage.setItem('arabicTVChannels', channelsData);
            console.log('تم حفظ القنوات بنجاح:', this.channels.length, 'قناة');
            console.log('بيانات القنوات المحفوظة:', channelsWithTimestamp);
            
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
                        // إظهار إشعار للمستخدم حول فشل المزامنة التلقائية
                        setTimeout(() => {
                            this.notifyWarning('فشلت المزامنة التلقائية. يمكنك المحاولة يدوياً من إعدادات المزامنة السحابية.');
                        }, 2000);
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
                    // ضمان وجود الطوابع الزمنية للقنوات القديمة
                    this.channels = parsedChannels.map(channel => ({
                        ...channel,
                        lastModified: channel.lastModified || new Date().toISOString()
                    }));
                    console.log('تم تحميل القنوات المحفوظة:', this.channels.length, 'قناة');
                    // تحديث filteredChannels
                    this.filteredChannels = [...this.channels];
                    // تحديث عداد القنوات
                    this.updateSidebarCounts();
                    return;
                }
            }
            
            // إذا لم توجد قنوات محفوظة، ابدأ بقائمة فارغة
            console.log('لا توجد قنوات محفوظة، سيتم البدء بقائمة فارغة');
            this.channels = [];
            this.filteredChannels = [];
            // تحديث عداد القنوات
            this.updateSidebarCounts();
        
        } catch (error) {
            console.error('خطأ في تحميل القنوات المحفوظة:', error);
            console.log('سيتم البدء بقائمة فارغة');
            this.channels = [];
            this.filteredChannels = [];
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
                settings: this.settings,
                categories: this.categories,
                adminPassword: this.adminPassword, // إضافة كلمة المرور للمزامنة السحابية
                lastModified: new Date().toISOString(),
                version: '1.0'
            };

            const success = await this.uploadToRepository(data);
            
            if (success) {
                this.remoteStorage.lastSync = new Date().toISOString();
                this.saveRemoteStorageSettings();
                // تحديث آخر تحديث عند نجاح المزامنة
                this.updateLastUpdateTime();
                this.notifySuccess('تم رفع البيانات إلى المستودع بنجاح!');
                return true;
            } else {
                this.notifyError('فشل في رفع البيانات إلى المستودع');
                return false;
            }
        } catch (error) {
            console.error('خطأ في المزامنة إلى المستودع:', error);
            
            // رسائل خطأ أكثر وضوحاً للمستخدم
            let errorMessage = 'خطأ في المزامنة: ';
            if (error.message.includes('409')) {
                errorMessage += 'تضارب في الإصدارات - تم تحديث الملف من مكان آخر. يرجى المحاولة مرة أخرى.';
            } else if (error.message.includes('401') || error.message.includes('403')) {
                errorMessage += 'مشكلة في الصلاحيات - تحقق من رمز الوصول (Token) وإعدادات المستودع.';
            } else if (error.message.includes('404')) {
                errorMessage += 'المستودع غير موجود - تحقق من اسم المستودع والإعدادات.';
            } else {
                errorMessage += error.message;
            }
            
            this.notifyError(errorMessage);
            return false;
        }
    }

    async syncFromRemote() {
        if (!this.remoteStorage.enabled || !this.remoteStorage.repository || !this.remoteStorage.token) {
            console.log('التخزين السحابي غير مُعدّ، تخطي المزامنة');
            return false;
        }

        try {
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
                    return false;
                }
            } else {
                console.log('لم يتم العثور على بيانات في المستودع');
                this.notifyInfo('لم يتم العثور على بيانات محفوظة في المستودع');
                return false;
            }
        } catch (error) {
            console.error('خطأ في المزامنة من المستودع:', error);
            
            // رسائل خطأ أكثر وضوحاً للمستخدم
            let errorMessage = 'خطأ في تحميل البيانات: ';
            if (error.message.includes('401') || error.message.includes('403')) {
                errorMessage += 'مشكلة في الصلاحيات - تحقق من رمز الوصول (Token) وإعدادات المستودع.';
            } else if (error.message.includes('404')) {
                errorMessage += 'المستودع أو الملف غير موجود - تحقق من اسم المستودع والإعدادات.';
            } else if (error.message.includes('NetworkError') || error.message.includes('fetch')) {
                errorMessage += 'مشكلة في الاتصال بالإنترنت - تحقق من اتصالك وحاول مرة أخرى.';
            } else {
                errorMessage += error.message;
            }
            
            this.notifyError(errorMessage);
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
        
        // محاولة التحديث مع إعادة المحاولة في حالة التضارب
        const maxRetries = 3;
        let lastError = null;
        
        for (let attempt = 0; attempt < maxRetries; attempt++) {
            try {
                // الحصول على SHA الحالي للملف في كل محاولة
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
                        console.log(`تم الحصول على SHA للملف: ${sha.substring(0, 8)}...`);
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

                if (response.ok) {
                    console.log('تم رفع البيانات بنجاح');
                    return true;
                }

                // التعامل مع خطأ 409 (تضارب في الإصدارات)
                if (response.status === 409) {
                    const errorData = await response.json();
                    console.warn(`تضارب في الإصدارات (محاولة ${attempt + 1}/${maxRetries}):`, errorData.message);
                    
                    if (attempt < maxRetries - 1) {
                        // انتظار قصير قبل إعادة المحاولة
                        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
                        continue;
                    } else {
                        lastError = new Error(`فشل في المزامنة بعد ${maxRetries} محاولات بسبب تضارب في الإصدارات. يرجى المحاولة مرة أخرى.`);
                    }
                } else {
                    const error = await response.text();
                    lastError = new Error(`GitHub API Error: ${response.status} - ${error}`);
                    break; // لا نعيد المحاولة للأخطاء الأخرى
                }
            } catch (error) {
                lastError = error;
                if (attempt < maxRetries - 1) {
                    console.warn(`خطأ في المحاولة ${attempt + 1}:`, error.message);
                    await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
                }
            }
        }
        
        throw lastError;
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

    // دمج القنوات بذكاء لحماية التغييرات المحلية
    mergeChannels(localChannels, remoteChannels) {
        const mergedChannels = [...localChannels];
        const localChannelIds = new Set(localChannels.map(ch => ch.id));
        
        // إضافة القنوات الجديدة من السحابة التي لا توجد محلياً
        remoteChannels.forEach(remoteChannel => {
            if (!localChannelIds.has(remoteChannel.id)) {
                mergedChannels.push(remoteChannel);
                console.log('تم إضافة قناة جديدة من السحابة:', remoteChannel.name);
            } else {
                // تحديث القنوات الموجودة إذا كانت السحابة أحدث
                const localChannel = localChannels.find(ch => ch.id === remoteChannel.id);
                if (localChannel && remoteChannel.lastModified && localChannel.lastModified) {
                    const remoteTime = new Date(remoteChannel.lastModified);
                    const localTime = new Date(localChannel.lastModified);
                    
                    if (remoteTime > localTime) {
                        // استبدال القناة المحلية بالسحابية إذا كانت أحدث
                        const index = mergedChannels.findIndex(ch => ch.id === remoteChannel.id);
                        mergedChannels[index] = remoteChannel;
                        console.log('تم تحديث قناة من السحابة:', remoteChannel.name);
                    } else {
                        console.log('القناة المحلية أحدث، تم الاحتفاظ بها:', localChannel.name);
                    }
                }
            }
        });
        
        console.log(`تم دمج القنوات: ${localChannels.length} محلية + ${remoteChannels.length} سحابية = ${mergedChannels.length} إجمالي`);
        return mergedChannels;
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
            settings: { ...this.settings }
        };

        try {
            // Merge channels instead of replacing them completely
            if (remoteData.channels && Array.isArray(remoteData.channels)) {
                this.channels = this.mergeChannels(this.channels, remoteData.channels);
                this.filteredChannels = [...this.channels];
                this.saveChannelsToStorage();
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

            // Update admin password if available
            if (remoteData.adminPassword && remoteData.adminPassword !== this.adminPassword) {
                this.adminPassword = remoteData.adminPassword;
                localStorage.setItem('anon_tv_admin_password', remoteData.adminPassword);
                console.log('تم تحديث كلمة المرور من المستودع السحابي');
                this.notifyInfo('تم تحديث كلمة المرور من السحابة - يمكنك الآن استخدام كلمة المرور الجديدة');
                // تحديث معلومات الأمان
                this.updateSecurityInfo();
            }

            // Re-render everything
            this.renderChannels();
            this.renderAdminChannels();
            
        } catch (error) {
            console.error('خطأ في دمج البيانات، استعادة النسخة الاحتياطية:', error);
            
            // Restore backup
            this.channels = backup.channels;
            this.settings = backup.settings;
            
            throw error;
        }
    }

    async detectConflicts(remoteData) {
        // تحسين آلية كشف التعارضات لحماية التغييرات المحلية
        const localChannelsCount = this.channels.length;
        const remoteChannelsCount = remoteData.channels ? remoteData.channels.length : 0;
        
        // إذا كانت القنوات المحلية أكثر من السحابية، فهذا يعني إضافة قنوات محلياً
        if (localChannelsCount > remoteChannelsCount) {
            const localChannelIds = new Set(this.channels.map(ch => ch.id));
            const remoteChannelIds = new Set(remoteData.channels ? remoteData.channels.map(ch => ch.id) : []);
            
            // حساب عدد القنوات الجديدة المحلية
            const newLocalChannels = localChannelsCount - remoteChannelIds.size;
            
            // إذا كان هناك قنوات جديدة محلية، اعتبر هذا تعارضاً لحمايتها
            if (newLocalChannels > 0) {
                console.log(`تم اكتشاف ${newLocalChannels} قناة جديدة محلية - سيتم حمايتها من الاستبدال`);
                return true;
            }
        }
        
        // فحص التعديلات على القنوات الموجودة
        if (remoteData.channels && this.channels.length > 0) {
            const localChannelIds = new Set(this.channels.map(ch => ch.id));
            const remoteChannelIds = new Set(remoteData.channels.map(ch => ch.id));
            
            // فحص القنوات المشتركة للتعديلات المتضاربة
            for (const localChannel of this.channels) {
                if (remoteChannelIds.has(localChannel.id)) {
                    const remoteChannel = remoteData.channels.find(ch => ch.id === localChannel.id);
                    
                    // إذا كان هناك تعديلات محلية حديثة على قناة موجودة في السحابة
                    if (localChannel.lastModified && remoteChannel.lastModified) {
                        const localTime = new Date(localChannel.lastModified);
                        const remoteTime = new Date(remoteChannel.lastModified);
                        const timeDiff = Math.abs(localTime - remoteTime);
                        
                        // إذا كان التعديل المحلي أحدث من السحابي بساعة أو أقل، اعتبر هذا تعارضاً
                        if (localTime > remoteTime && timeDiff < 3600000) {
                            console.log(`تعارض في القناة ${localChannel.name}: التعديل المحلي أحدث من السحابي`);
                            return true;
                        }
                    }
                }
            }
        }
        
        // فحص الاختلافات الكبيرة في العدد (أكثر من 20% بدلاً من 10%)
        const countDifference = Math.abs(localChannelsCount - remoteChannelsCount);
        const significantDifference = countDifference > Math.max(localChannelsCount, remoteChannelsCount) * 0.2;
        
        const localLastModified = this.getLocalLastModified();
        const remoteLastModified = new Date(remoteData.lastModified || 0);
        const timeDifference = Math.abs(localLastModified - remoteLastModified);
        
        // اعتبار التعارض فقط إذا كان هناك اختلاف كبير وكلاهما تم تعديله مؤخراً
        return significantDifference && timeDifference < 1800000; // 30 دقيقة بدلاً من ساعة
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
                            <p>آخر تعديل: <strong>${this.getLocalLastModified().toLocaleString('ar')}</strong></p>
                        </div>
                        
                        <div class="remote-data">
                            <h4>البيانات السحابية</h4>
                            <p>عدد القنوات: <strong>${remoteData.channels ? remoteData.channels.length : 0}</strong></p>
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
    }

    async smartMerge(remoteData) {
        // Smart merge logic
        const mergedChannels = this.mergeChannels(this.channels, remoteData.channels || []);
        const mergedSettings = { ...this.settings, ...remoteData.settings };

        this.channels = mergedChannels;
        this.filteredChannels = [...this.channels];
        this.settings = mergedSettings;

        if (remoteData.categories && Array.isArray(remoteData.categories)) {
            this.categories = this.mergeCategories(this.categories, remoteData.categories);
        }

        this.saveChannelsToStorage();
        this.saveSettings();
        this.applySettings();
        this.renderChannels();
        this.renderAdminChannels();
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
        this.settings.animationsEnabled = false;
        this.settings.compactMode = true;
        this.settings.highContrast = false;
        this.settings.borderRadius = 'rounded';
        this.settings.showAutoNotifications = false;
        this.settings.autoUpdateEnabled = true; // تفعيل التحديث التلقائي للقنوات
        
        // إعادة تعيين الإشعارات المحفوظة
        localStorage.removeItem('passwordWarningShown');
        
        // Save and apply
        this.saveSettings();
        this.applySettings();
        
        // تحديث زر التحديث التلقائي في الواجهة
        this.updateAutoUpdateButton();
        
        this.notifySuccess('تم إعادة تعيين جميع التخصيصات!');
        
        // تحديث البيانات التلقائي بعد إعادة التعيين
        setTimeout(async () => {
            try {
                this.notifyInfo('جاري تحديث البيانات...', 'تحديث البيانات');
                
                // تحميل البيانات الجديدة من GitHub
                const response = await fetch('https://raw.githubusercontent.com/anon-site/TV-AR/main/channels.json');
                
                if (response.ok) {
                    const data = await response.json();
                    
                    // حفظ البيانات الجديدة محلياً
                    this.channels = data.channels || [];
                    this.saveChannelsToStorage();
                    
                    // تحديث واجهة المستخدم
                    this.filteredChannels = [...this.channels];
                    this.renderChannels();
                    this.updateChannelStats();
                    
                    this.notifySuccess('تم تحديث البيانات بنجاح!', 'تحديث مكتمل');
                    
                } else {
                    throw new Error(`خطأ في جلب البيانات: ${response.status}`);
                }
                
            } catch (error) {
                console.error('خطأ في تحديث البيانات:', error);
                this.notifyWarning('فشل في تحديث البيانات، يمكنك المحاولة يدوياً من زر "تحديث القنوات"');
            }
        }, 1000);
    }

    // Toggle Auto Update Functionality
    toggleAutoUpdate() {
        const autoUpdateEnabled = document.getElementById('autoUpdateEnabled');
        const toggleBtn = document.getElementById('toggleAutoUpdateBtn');
        const btnText = document.getElementById('autoUpdateBtnText');
        
        if (autoUpdateEnabled && toggleBtn && btnText) {
            // Toggle the setting
            autoUpdateEnabled.checked = !autoUpdateEnabled.checked;
            
            // Update button appearance and text
            if (autoUpdateEnabled.checked) {
                toggleBtn.classList.remove('disabled');
                btnText.textContent = 'إلغاء التحديث التلقائي';
                this.notifySuccess('تم تفعيل التحديث التلقائي للقنوات');
            } else {
                toggleBtn.classList.add('disabled');
                btnText.textContent = 'تفعيل التحديث التلقائي';
                this.notifyWarning('تم إلغاء التحديث التلقائي للقنوات');
            }
            
            // Save the setting
            this.settings.autoUpdateEnabled = autoUpdateEnabled.checked;
            this.saveSettings();
            
            console.log('التحديث التلقائي:', autoUpdateEnabled.checked ? 'مفعل' : 'معطل');
        }
    }

    // Check if auto update is enabled
    isAutoUpdateEnabled() {
        return this.settings.autoUpdateEnabled !== false; // Default to true
    }

    // Favorites Management
    loadFavorites() {
        try {
            const savedFavorites = localStorage.getItem('arabicTVFavorites');
            if (savedFavorites) {
                this.favorites = JSON.parse(savedFavorites);
                console.log('تم تحميل المفضلة:', this.favorites.length, 'قناة');
            } else {
                this.favorites = [];
                console.log('لا توجد قنوات مفضلة محفوظة');
            }
        } catch (error) {
            console.error('خطأ في تحميل المفضلة:', error);
            this.favorites = [];
        }
    }

    saveFavorites() {
        try {
            localStorage.setItem('arabicTVFavorites', JSON.stringify(this.favorites));
            console.log('تم حفظ المفضلة:', this.favorites.length, 'قناة');
        } catch (error) {
            console.error('خطأ في حفظ المفضلة:', error);
            this.notifyError('خطأ في حفظ المفضلة');
        }
    }

    toggleFavorite(channelId, event) {
        if (event) {
            event.stopPropagation();
        }

        const channel = this.channels.find(c => c.id === channelId);
        if (!channel) return;

        const index = this.favorites.indexOf(channelId);
        if (index > -1) {
            // Remove from favorites
            this.favorites.splice(index, 1);
            this.notifyInfo(`تم إزالة "${channel.name}" من المفضلة`);
        } else {
            // Add to favorites
            this.favorites.push(channelId);
            this.notifySuccess(`تم إضافة "${channel.name}" إلى المفضلة`);
        }

        this.saveFavorites();
        
        // Update the heart icon
        const heartIcon = event ? event.target.closest('.favorite-btn') : null;
        if (heartIcon) {
            heartIcon.classList.toggle('active');
        }
        
        // If we're viewing favorites, re-render
        if (this.currentCategory === 'favorites') {
            this.filterChannels('favorites');
        }
        
        // Update sidebar count
        this.updateSidebarCounts();
    }

    isFavorite(channelId) {
        return this.favorites.includes(channelId);
    }

    getFavoritesCount() {
        return this.favorites.length;
    }

    // Update auto update button appearance
    updateAutoUpdateButton() {
        const toggleBtn = document.getElementById('toggleAutoUpdateBtn');
        const btnText = document.getElementById('autoUpdateBtnText');
        const autoUpdateEnabled = document.getElementById('autoUpdateEnabled');
        
        if (toggleBtn && btnText && autoUpdateEnabled) {
            if (this.settings.autoUpdateEnabled) {
                toggleBtn.classList.remove('disabled');
                btnText.textContent = 'إلغاء التحديث التلقائي';
            } else {
                toggleBtn.classList.add('disabled');
                btnText.textContent = 'تفعيل التحديث التلقائي';
            }
        }
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
            // First try to sync from remote
            await this.syncFromRemote();
            
            // Then sync to remote
            await this.syncToRemote();
            
            // تحديث آخر تحديث عند نجاح المزامنة اليدوية
            this.updateLastUpdateTime();
            
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
            // Create backup data without sensitive information
            const backupData = {
                version: '1.0',
                timestamp: new Date().toISOString(),
                channels: this.channels,
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

    // وظيفة حذف جميع الكوكيز
    deleteAllCookies() {
        // عرض نافذة تأكيد
        const confirmDelete = confirm(
            'هل أنت متأكد من حذف جميع الكوكيز؟\n\n' +
            'سيتم حذف:\n' +
            '• جميع الكوكيز المحفوظة في المتصفح\n' +
            '• بيانات الجلسة (Session Storage)\n' +
            '• البيانات المحلية (Local Storage)\n\n' +
            'هذا الإجراء لا يمكن التراجع عنه!'
        );

        if (!confirmDelete) {
            return;
        }

        try {
            // حذف جميع الكوكيز
            this.deleteAllCookiesFromBrowser();
            
            // حذف Local Storage
            localStorage.clear();
            
            // حذف Session Storage
            sessionStorage.clear();
            
            // إعادة تعيين رسالة الترحيب ليعاد عرضها
            localStorage.removeItem('welcomeShown');
            
            // إعادة تحميل الصفحة لتطبيق التغييرات
            this.notifySuccess('تم حذف جميع الكوكيز والبيانات المحفوظة بنجاح!', 'تم الحذف');
            
            // تحديث البيانات التلقائي بعد حذف الكوكيز
            setTimeout(async () => {
                try {
                    this.notifyInfo('جاري تحديث البيانات من المصدر الخارجي...', 'تحديث البيانات');
                    
                    // تحميل البيانات الجديدة من GitHub
                    const response = await fetch('https://raw.githubusercontent.com/anon-site/TV-AR/main/channels.json');
                    
                    if (response.ok) {
                        const data = await response.json();
                        
                        // حفظ البيانات الجديدة محلياً
                        this.channels = data.channels || [];
                        this.saveChannelsToStorage();
                        
                        // تحديث واجهة المستخدم
                        this.filteredChannels = [...this.channels];
                        this.renderChannels();
                        this.updateChannelStats();
                        
                        this.notifySuccess('تم تحديث البيانات بنجاح!', 'تحديث مكتمل');
                        
                        // إعادة تحميل الصفحة بعد التحديث
                        setTimeout(() => {
                            window.location.reload();
                        }, 1500);
                        
                    } else {
                        throw new Error(`خطأ في جلب البيانات: ${response.status}`);
                    }
                    
                } catch (error) {
                    console.error('خطأ في تحديث البيانات:', error);
                    this.notifyError('فشل في تحديث البيانات، سيتم إعادة تحميل الصفحة', 'خطأ في التحديث');
                    
                    // إعادة تحميل الصفحة في حالة فشل التحديث
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000);
                }
            }, 1000);
            
        } catch (error) {
            console.error('خطأ في حذف الكوكيز:', error);
            this.notifyError('حدث خطأ أثناء حذف الكوكيز: ' + error.message, 'خطأ');
        }
    }

    // وظيفة مساعدة لحذف الكوكيز من المتصفح
    deleteAllCookiesFromBrowser() {
        // الحصول على جميع الكوكيز
        const cookies = document.cookie.split(";");
        
        // حذف كل كوكي
        for (let cookie of cookies) {
            const eqPos = cookie.indexOf("=");
            const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
            
            // حذف الكوكي للدومين الحالي
            document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
            
            // حذف الكوكي للدومين الحالي مع www
            document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=" + window.location.hostname;
            
            // حذف الكوكي للدومين الحالي بدون www
            const domain = window.location.hostname.replace(/^www\./, '');
            document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=" + domain;
            
            // حذف الكوكي للدومين الحالي مع www
            document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=." + domain;
        }
    }

    // وظائف النافذة الترحيبية
    showWelcomeModal() {
        const modal = document.getElementById('welcomeModal');
        if (modal) {
            modal.classList.add('active');
            // إضافة تأثيرات بصرية
            setTimeout(() => {
                modal.style.opacity = '1';
                modal.style.transform = 'scale(1)';
            }, 10);
        }
    }

    closeWelcomeModal() {
        const modal = document.getElementById('welcomeModal');
        if (modal) {
            modal.classList.remove('active');
            // حفظ أن المستخدم شاهد الرسالة الترحيبية
            localStorage.setItem('welcomeShown', 'true');
        }
    }


    // تسليط الضوء على زر تحديث القنوات
    highlightUpdateButton() {
        // البحث عن زر تحديث القنوات في القائمة الجانبية
        const updateButtons = document.querySelectorAll('[onclick="updateChannels()"]');
        
        updateButtons.forEach(button => {
            // إضافة تأثير تسليط الضوء
            button.style.background = 'linear-gradient(45deg, #ff6b6b, #ff8e8e)';
            button.style.boxShadow = '0 0 20px rgba(255, 107, 107, 0.6)';
            button.style.transform = 'scale(1.05)';
            button.style.transition = 'all 0.3s ease';
            
            // إضافة تأثير نبضة
            button.classList.add('pulse-effect');
            
            // إزالة التأثير بعد 5 ثوانٍ
            setTimeout(() => {
                button.style.background = '';
                button.style.boxShadow = '';
                button.style.transform = '';
                button.classList.remove('pulse-effect');
            }, 5000);
        });
    }

    // فحص ما إذا كان يجب إظهار الرسالة الترحيبية
    shouldShowWelcome() {
        // إظهار الرسالة إذا لم يسبق للمستخدم رؤية الرسالة
        const welcomeShown = localStorage.getItem('welcomeShown');
        const hasChannels = this.channels && this.channels.length > 0;
        
        console.log('فحص الرسالة الترحيبية:', {
            welcomeShown: !!welcomeShown,
            hasChannels: hasChannels,
            channelsCount: this.channels ? this.channels.length : 0,
            shouldShow: !welcomeShown
        });
        
        // إظهار الرسالة الترحيبية للمستخدمين الجدد فقط
        return !welcomeShown;
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
        // البحث في الفئات الديناميكية أولاً
        const foundCategory = this.categories.find(cat => cat.key === category);
        if (foundCategory) {
            return foundCategory.name;
        }
        
        // إذا لم توجد، استخدم القائمة الثابتة كاحتياطي
        const categoryNames = {
            'all': 'جميع القنوات',
            'news': 'الأخبار',
            'entertainment': 'المنوعة',
            'sports': 'الرياضة',
            'religious': 'الدينية',
            'music': 'الموسيقى',
            'movies': 'الأفلام',
            'documentary': 'الوثائقية',
            'diversified': 'متنوعة'
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
        console.log('🔔 إظهار إشعار:', { title, message, type, duration });
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

    // دالة اختبار الإشعارات
    testNotifications() {
        console.log('🧪 اختبار الإشعارات...');
        
        // اختبار إشعار نجاح
        setTimeout(() => {
            this.showNotification('نجح الاختبار!', 'الإشعارات تعمل بشكل صحيح', 'success', 3000);
        }, 500);
        
        // اختبار إشعار تحذير
        setTimeout(() => {
            this.showNotification('تحذير', 'هذا إشعار تحذير للاختبار', 'warning', 3000);
        }, 1500);
        
        // اختبار إشعار خطأ
        setTimeout(() => {
            this.showNotification('خطأ', 'هذا إشعار خطأ للاختبار', 'error', 3000);
        }, 2500);
        
        // اختبار إشعار معلومات
        setTimeout(() => {
            this.showNotification('معلومات', 'هذا إشعار معلومات للاختبار', 'info', 3000);
        }, 3500);
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

    moveChannelToTop(index) {
        if (index > 0) {
            this.moveChannel(index, 0);
            this.notifySuccess(`تم نقل "${this.channels[0].name}" إلى الأعلى`);
        }
    }

    moveChannelToBottom(index) {
        if (index < this.channels.length - 1) {
            this.moveChannel(index, this.channels.length - 1);
            this.notifySuccess(`تم نقل "${this.channels[this.channels.length - 1].name}" إلى الأسفل`);
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

        // مسح حقل البحث لإظهار جميع القنوات
        const adminSearch = document.getElementById('adminSearchInput');
        if (adminSearch) {
            adminSearch.value = '';
        }

        // إعادة رسم القائمة
        this.renderAdminChannels();
        
        // تطبيق الفلتر بعد التأكد من إضافة العناصر إلى DOM
        setTimeout(() => this.filterAdminChannels(''), 10);
    }

    moveChannelToPosition(fromIndex, newPosition) {
        // تحويل الموقع إلى فهرس (الموقع - 1)
        const toIndex = parseInt(newPosition) - 1;
        
        // التحقق من صحة المدخلات
        if (isNaN(toIndex) || toIndex < 0 || toIndex >= this.channels.length) {
            this.notifyError('رقم الموقع غير صحيح. يجب أن يكون بين 1 و ' + this.channels.length);
            // إعادة تعيين القيمة إلى الموقع الحالي
            setTimeout(() => {
                this.renderAdminChannels();
            }, 100);
            return;
        }

        if (fromIndex === toIndex) {
            // لا حاجة للنقل إذا كان الموقع نفسه
            return;
        }

        // حفظ اسم القناة قبل النقل
        const channelName = this.channels[fromIndex].name;
        
        // نقل القناة
        this.moveChannel(fromIndex, toIndex);
        
        // إظهار رسالة نجاح
        this.notifySuccess(`تم نقل قناة "${channelName}" إلى الموقع ${newPosition}`);
        
        // تحديث العرض الرئيسي أيضاً
        this.renderChannels();

        // إظهار زر الحفظ
        this.updateSaveOrderButton();
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
            
            
            // المزامنة التلقائية مع السحابة
            if (this.remoteStorage.enabled && this.remoteStorage.autoSync) {
                this.syncToRemote().catch(error => {
                    console.error('فشل في المزامنة التلقائية بعد حفظ الترتيب:', error);
                    setTimeout(() => {
                        this.notifyWarning('تم حفظ الترتيب محلياً، لكن فشلت المزامنة التلقائية. يمكنك المحاولة يدوياً من إعدادات المزامنة السحابية.');
                    }, 2000);
                });
            }
            
        } catch (error) {
            console.error('خطأ في حفظ ترتيب القنوات:', error);
            this.notifyError('فشل في حفظ ترتيب القنوات');
        }
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



    // Update sidebar counts
    updateSidebarCounts() {
        console.log('بدء تحديث عداد القنوات - عدد القنوات الإجمالي:', this.channels.length);
        
        // Update favorites count
        const favoritesCountElements = document.querySelectorAll('#favoritesCount, #headerFavoritesCount');
        const favoritesCount = this.getFavoritesCount();
        favoritesCountElements.forEach(element => {
            element.textContent = favoritesCount;
        });
        if (favoritesCountElements.length > 0) {
            console.log(`تحديث عداد المفضلة:`, favoritesCount);
        }
        
        // Use dynamic categories instead of hardcoded list
        const categories = this.categories.map(cat => cat.key);
        
        categories.forEach(category => {
            let count = 0;
            if (category === 'all') {
                count = this.channels.length;
            } else {
                count = this.channels.filter(channel => channel.category === category).length;
            }
            
            // Update all count elements with this category (desktop sidebar, mobile categories, etc.)
            // This will update both desktop and mobile since they share the same IDs
            const countElements = document.querySelectorAll(`#${category}Count`);
            countElements.forEach(element => {
                element.textContent = count;
            });
            
            if (countElements.length > 0) {
                console.log(`تحديث عداد ${category}:`, count, '- عدد العناصر:', countElements.length);
            } else {
                console.warn(`لم يتم العثور على عناصر ${category}Count`);
            }
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
        if (loading) {
            loading.style.display = 'none';
        }
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
        const qualityOptions = document.querySelectorAll('.quality-option');
        
        // Always show all quality options
        qualityOptions.forEach(option => {
            option.style.display = 'flex';
        });
        
        // If HLS is available, we can add visual indicators for available qualities
        if (this.hls && this.hls.levels) {
            const levels = this.hls.levels;
            
            qualityOptions.forEach(option => {
                const quality = option.dataset.quality;
                
                if (quality === 'auto') {
                    return; // Auto is always available
                }
                
                const targetHeight = parseInt(quality);
                const hasQuality = levels.some(level => 
                    Math.abs(level.height - targetHeight) <= 50
                );
                
                // Add visual indicator for availability (optional)
                if (hasQuality) {
                    option.classList.add('quality-available');
                } else {
                    option.classList.remove('quality-available');
                }
            });
        }
    }

    // New Navigation Features Implementation
    
    initializeNewFeatures() {
        this.bindNewNavigationEvents();
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


        // Apply search filter
        const searchInput = document.getElementById('searchInput');
        if (searchInput && searchInput.value.trim()) {
            const searchTerm = searchInput.value.toLowerCase().trim();
            filtered = filtered.filter(channel => {
                // العثور على رقم القناة
                const channelIndex = this.channels.findIndex(ch => ch.id === channel.id);
                const channelNumber = channelIndex + 1;
                
                return channel.name.toLowerCase().includes(searchTerm) ||
                       channel.country.toLowerCase().includes(searchTerm) ||
                       channelNumber.toString().includes(searchTerm);
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
    
    // تحديث وقت آخر تحديث
    updateLastUpdateTime() {
        const lastUpdateElement = document.getElementById('lastUpdate');
        if (lastUpdateElement) {
            const now = new Date();
            
            // التاريخ الميلادي بتنسيق dd/mm/yyyy
            const day = String(now.getDate()).padStart(2, '0');
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const year = now.getFullYear();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            
            // عرض التاريخ بتنسيق dd/mm/yyyy    hh:mm:ss مع ألوان مختلفة
            lastUpdateElement.innerHTML = `${day}/${month}/${year}    <span class="time-part">${hours}:${minutes}:${seconds}</span>`;
            
            // حفظ آخر تحديث في التخزين المحلي
            localStorage.setItem('lastUpdateTime', now.toISOString());
        }
    }
    
    // تحميل آخر تحديث محفوظ
    loadLastUpdateTime() {
        const lastUpdateElement = document.getElementById('lastUpdate');
        if (lastUpdateElement) {
            const savedTime = localStorage.getItem('lastUpdateTime');
            if (savedTime) {
                const savedDate = new Date(savedTime);
                
                // التاريخ الميلادي بتنسيق dd/mm/yyyy
                const day = String(savedDate.getDate()).padStart(2, '0');
                const month = String(savedDate.getMonth() + 1).padStart(2, '0');
                const year = savedDate.getFullYear();
                const hours = String(savedDate.getHours()).padStart(2, '0');
                const minutes = String(savedDate.getMinutes()).padStart(2, '0');
                const seconds = String(savedDate.getSeconds()).padStart(2, '0');
                
                // عرض التاريخ المحفوظ بتنسيق dd/mm/yyyy    hh:mm:ss مع ألوان مختلفة
                lastUpdateElement.innerHTML = `${day}/${month}/${year}    <span class="time-part">${hours}:${minutes}:${seconds}</span>`;
            } else {
                // إذا لم يكن هناك تاريخ محفوظ، استخدم التاريخ الحالي
                this.updateLastUpdateTime();
            }
        }
    }
    
    // Initialize footer functionality
    initializeFooter() {
        // Add click handlers for category links in footer
        const footerCategoryLinks = document.querySelectorAll('.footer-links a[data-category]');
        footerCategoryLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const category = link.getAttribute('data-category');
                this.setCategory(category);
                this.notifySuccess(`تم التبديل إلى فئة: ${this.getCategoryName(category)}`);
            });
        });
        
        // Add click handlers for social links
        const socialLinks = document.querySelectorAll('.social-link');
        socialLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const platform = link.getAttribute('title');
                this.notifyInfo(`رابط ${platform} سيتم إضافته قريباً`, 3000);
            });
        });
        
        // Add click handlers for legal links
        const legalLinks = document.querySelectorAll('.legal-link');
        legalLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const linkText = link.textContent;
                this.notifyInfo(`صفحة ${linkText} قيد التطوير`, 3000);
            });
        });
    }
    
    

    // Simple auto-update on page load
    setupAutoUpdate() {
        // Check if auto update is enabled before proceeding
        if (!this.isAutoUpdateEnabled()) {
            console.log('🚫 التحديث التلقائي معطل من قبل المستخدم');
            return;
        }
        
        // Always update channels when page loads
        console.log('🔄 تحديث القنوات تلقائياً عند فتح الموقع...');
        
        setTimeout(() => {
            this.isAutomaticUpdate = true; // Mark as automatic update
            updateChannels();
            this.isAutomaticUpdate = false; // Reset flag
            
            // Simple notification for automatic update will be shown by updateChannels function
        }, 2000);
    }

    // Simple check for updates - check if auto update is enabled first
    async checkForUpdates(isAutomaticCheck = false) {
        try {
            console.log('🔍 فحص التحديثات...');
            
            // Check if auto update is enabled for automatic checks
            if (isAutomaticCheck && !this.isAutoUpdateEnabled()) {
                console.log('🚫 التحديث التلقائي معطل من قبل المستخدم');
                return false;
            }
            
            // Always update channels
            console.log('🔄 تحديث القنوات تلقائياً...');
            await updateChannels();
            return true;

        } catch (error) {
            console.error('خطأ في تحديث القنوات:', error);
            return false;
        }
    }

    // Show update available notification
    showUpdateAvailableNotification(remoteDate) {
        const notification = document.createElement('div');
        notification.className = 'notification update-available';
        notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-icon">
                    <i class="fas fa-download"></i>
                </div>
                <div class="notification-text">
                    <h4>تحديث جديد متاح!</h4>
                    <p>تم العثور على تحديث جديد للقنوات. اضغط هنا لتحديث البيانات.</p>
                    <small>آخر تحديث: ${new Date(remoteDate).toLocaleString('ar-SA')}</small>
                </div>
                <div class="notification-actions">
                    <button class="btn-primary" onclick="updateChannels(); app.closeNotification(this)">
                        <i class="fas fa-sync-alt"></i>
                        تحديث الآن
                    </button>
                    <button class="btn-secondary" onclick="app.closeNotification(this)">
                        <i class="fas fa-times"></i>
                        لاحقاً
                    </button>
                </div>
            </div>
        `;
        
        document.getElementById('notificationsContainer').appendChild(notification);
        
        // إظهار الإشعار مع تأثير
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // إخفاء الإشعار تلقائياً بعد 15 ثانية
        setTimeout(() => {
            if (notification.parentNode) {
                notification.classList.remove('show');
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }
        }, 15000);
    }


    // Enhanced Channel Card Creation (Override existing method)
    createChannelCard(channel) {
        const card = document.createElement('div');
        card.className = 'channel-card';
        
        // إنشاء placeholder محسن للشعار
        const logoPlaceholder = this.createLogoPlaceholder(channel);
        
        
        // تحديد حالة القناة
        const isActive = channel.status === 'active';
        const statusClass = isActive ? 'active' : 'inactive';
        const statusIcon = isActive ? 'fas fa-circle' : 'fas fa-circle';
        
        // العثور على رقم القناة (الفهرس + 1)
        const channelIndex = this.channels.findIndex(ch => ch.id === channel.id);
        const channelNumber = channelIndex + 1;
        
        // Check if channel is favorite
        const isFavorite = this.isFavorite(channel.id);
        
        card.innerHTML = `
            <div class="channel-number">${channelNumber}</div>
            <button class="favorite-btn ${isFavorite ? 'active' : ''}" onclick="app.toggleFavorite(${channel.id}, event)" title="${isFavorite ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}">
                <i class="${isFavorite ? 'fas' : 'far'} fa-heart"></i>
            </button>
            <img src="${channel.logo}" alt="${channel.name}" class="channel-logo" 
                 onerror="this.src='${logoPlaceholder}'; this.classList.add('placeholder-logo');">
            <div class="channel-info">
                <div class="channel-title-row">
                    <h3 class="channel-name">${channel.name}</h3>
                    <div class="channel-status-indicator ${statusClass}" title="${isActive ? 'القناة تعمل' : 'القناة لا تعمل'}">
                        <i class="${statusIcon}"></i>
                    </div>
                </div>
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
            <div class="channel-actions" ${!this.isLoggedIn ? 'style="display: none;"' : ''}>
                <button class="channel-edit-btn" onclick="app.editChannelFromCard(${channel.id}, event)" title="تعديل القناة">
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

    // Edit Channel Function (from channel card)
    editChannelFromCard(channelId, event) {
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
            document.getElementById('channelCountryInput').value = channel.country;
            document.getElementById('channelStatus').value = channel.status || 'active';
            
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
            
            // Update status toggle UI
            setTimeout(() => {
                this.bindStatusToggleEvents();
                this.bindVpnToggleEvents();
                this.updateStatusToggleUI(channel.status || 'active');
                this.updateVpnToggleUI(channel.vpn || false);
            }, 100);
        }, 100);
    }

    // Delete Channel Function
    deleteChannel(channelId, event) {
        event.stopPropagation(); // Prevent triggering the card click
        
        const channel = this.channels.find(c => c.id === channelId);
        if (!channel) return;
        
        // Show confirmation dialog
        if (confirm(`هل أنت متأكد من حذف قناة "${channel.name}"؟\n\nهذا الإجراء لا يمكن التراجع عنه.`)) {
            
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
            this.updateChannelStats(); // تحديث عدد القنوات في الشريط العلوي
            
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
            
            // إيقاف البث عند إخفاء الصفحة لتوفير البطارية والبيانات
            if (document.hidden) {
                console.log('🛑 إخفاء الصفحة - إيقاف البث مؤقتاً');
                this.pauseCurrentVideo();
            } else {
                console.log('👁️ إظهار الصفحة - استئناف البث');
                this.resumeCurrentVideo();
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

    // Setup Channel Bar Events
    setupChannelBarEvents() {
        const videoContainer = document.querySelector('.video-container');
        const channelBar = document.getElementById('channelBar');
        const modal = document.getElementById('videoModal');
        
        if (!videoContainer || !channelBar || !modal) return;

        let isChannelBarVisible = false;

        // Hide channel bar when clicking outside of it (only on desktop)
        modal.addEventListener('click', (e) => {
            // Check if click is outside the channel bar and not on the toggle button
            if (isChannelBarVisible && !channelBar.contains(e.target) && !videoContainer.contains(e.target) && !e.target.closest('.channels-btn')) {
                // Only hide on desktop, keep visible on mobile
                if (window.innerWidth > 768) {
                    hideChannelBar();
                    isChannelBarVisible = false;
                }
            }
        });

        // Auto-show channel bar on mobile when modal opens
        if (window.innerWidth <= 768) {
            setTimeout(() => {
            if (!isChannelBarVisible) {
                showChannelBar();
                isChannelBarVisible = true;
            }
            }, 500);
        }

        // Setup wheel scroll for channel bar
        setupChannelBarWheelScroll();

    }

    // Update active channel in channel bar
    updateActiveChannelInBar(channel) {
        const channelBarContent = document.getElementById('channelBarContent');
        if (!channelBarContent) return;

        // Remove active class from all items
        const allItems = channelBarContent.querySelectorAll('.channel-bar-item');
        allItems.forEach(item => {
            item.classList.remove('active');
        });

        // Add active class to current channel
        const currentItem = channelBarContent.querySelector(`[data-channel-id="${channel.id}"]`);
        if (currentItem) {
            currentItem.classList.add('active');
        }
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
            { key: 'entertainment', name: 'المنوعة', icon: 'fas fa-tv' },
            { key: 'sports', name: 'الرياضة', icon: 'fas fa-futbol' },
            { key: 'religious', name: 'الدينية', icon: 'fas fa-pray' },
            { key: 'music', name: 'الموسيقى', icon: 'fas fa-music' },
            { key: 'movies', name: 'الأفلام', icon: 'fas fa-film' },
            { key: 'documentary', name: 'الوثائقية', icon: 'fas fa-book-open' },
            { key: 'kids', name: 'أطفال', icon: 'fas fa-child' }
        ];
    }

    loadCategories() {
        try {
            const savedCategories = localStorage.getItem('arabicTVCategories');
            if (savedCategories) {
                this.categories = JSON.parse(savedCategories);
                console.log('تم تحميل الفئات:', this.categories.length, 'فئة');
                
                // Check if new categories need to be added
                this.mergeNewCategories();
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

    mergeNewCategories() {
        const defaultCategories = this.getDefaultCategories();
        let hasNewCategories = false;
        
        defaultCategories.forEach(defaultCategory => {
            const existingCategory = this.categories.find(cat => cat.key === defaultCategory.key);
            if (!existingCategory) {
                this.categories.push(defaultCategory);
                hasNewCategories = true;
                console.log('تم إضافة فئة جديدة:', defaultCategory.name);
            }
        });
        
        if (hasNewCategories) {
            this.saveCategories();
            console.log('تم حفظ الفئات المحدثة');
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
        
        // Update category options with a slight delay to ensure DOM is ready
        setTimeout(() => {
            this.updateChannelCategoryOptions();
        }, 100);
        
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
        
        // Update category options with a slight delay to ensure DOM is ready
        setTimeout(() => {
            this.updateChannelCategoryOptions();
        }, 100);
        
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
                `هناك ${channelsUsingCategory.length} قناة تستخدم هذه الفئة. هل تريد حذف الفئة وتحويل القنوات إلى فئة "المنوعة"؟`
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
        
        // Update category options with a slight delay to ensure DOM is ready
        setTimeout(() => {
            this.updateChannelCategoryOptions();
        }, 100);
        
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
            console.log('تحديث قائمة الفئات:', assignableCategories.length, 'فئة متاحة');
            assignableCategories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.key;
                option.textContent = category.name;
                categorySelect.appendChild(option);
                console.log('تم إضافة فئة:', category.name, 'بالمفتاح:', category.key);
            });
        } else {
            console.error('لم يتم العثور على عنصر channelCategory');
        }
    }

    // Show all channels and scroll to top
    showAllChannels() {
        // Close all mobile menus first
        closeAllMobileMenus();
        
        // Filter to show all channels
        this.filterChannels('all');
        
        // Scroll to top of the page
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        // Update mobile bottom navigation active state
        this.updateBottomNavActiveState('home');
        
        console.log('تم عرض جميع القنوات والانتقال للأعلى');
    }

    // Update mobile bottom navigation active state
    updateBottomNavActiveState(activeAction) {
        const bottomNavBtns = document.querySelectorAll('.bottom-nav-btn');
        bottomNavBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.action === activeAction) {
                btn.classList.add('active');
            }
        });
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

// Channel Bar Functions
function showChannelBar() {
    const channelBar = document.getElementById('channelBar');
    const channelsBtn = document.querySelector('.channels-btn');
    
    if (channelBar) {
        channelBar.classList.add('show');
        loadChannelBarContent();
        // Update button state
        if (channelsBtn) {
            channelsBtn.classList.add('active');
        }
        // No auto-hide - will hide only when mouse leaves
    }
}

function hideChannelBar() {
    const channelBar = document.getElementById('channelBar');
    const channelsBtn = document.querySelector('.channels-btn');
    
    if (channelBar) {
        channelBar.classList.remove('show');
        // Update button state
        if (channelsBtn) {
            channelsBtn.classList.remove('active');
        }
    }
}

function toggleChannelBar() {
    const channelBar = document.getElementById('channelBar');
    const channelsBtn = document.querySelector('.channels-btn');
    
    if (channelBar) {
        const isActive = channelBar.classList.contains('show');
        
        if (isActive) {
            hideChannelBar();
            if (channelsBtn) channelsBtn.classList.remove('active');
        } else {
            showChannelBar();
            if (channelsBtn) channelsBtn.classList.add('active');
        }
    }
}

function loadChannelBarContent() {
    const channelBarContent = document.getElementById('channelBarContent');
    const channelCount = document.getElementById('channelBarCount');
    if (!channelBarContent || !app.channels) return;

    // Clear existing content
    channelBarContent.innerHTML = '';

    // إذا كانت هناك قائمة مخصصة من البحث استخدمها، وإلا استخدم الفئة الحالية
    const currentCategory = window.currentPlayerCategoryFilter || app.currentCategory || 'all';
    let channelsToShow = (window.channelBarCustomList && window.channelBarCustomList.length > 0)
        ? window.channelBarCustomList
        : app.channels;

    if (!window.channelBarCustomList && currentCategory !== 'all') {
        channelsToShow = app.channels.filter(channel => channel.category === currentCategory);
    }

    // Update channel count
    if (channelCount) {
        channelCount.textContent = channelsToShow.length;
    }

    // Show all channels (no limit for horizontal scroll)
    channelsToShow.forEach((channel, index) => {
        const channelItem = document.createElement('div');
        channelItem.className = 'channel-bar-item';
        channelItem.dataset.channelId = channel.id;
        
        if (app.currentChannel && channel.id === app.currentChannel.id) {
            channelItem.classList.add('active');
        }

        channelItem.innerHTML = `
            <img src="${channel.logo || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjMzMzIi8+CjxwYXRoIGQ9Ik0yMCAxMEMyNi42MjcgMTAgMzIgMTUuMzczIDMyIDIyQzMyIDI4LjYyNyAyNi42MjcgMzQgMjAgMzRDMTMuMzczIDM0IDggMjguNjI3IDggMjJDMCAxNS4zNzMgMTMuMzczIDEwIDIwIDEwWiIgZmlsbD0iI2ZmZiIvPgo8L3N2Zz4K'}" 
                 alt="${channel.name}" 
                 onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjMzMzIi8+CjxwYXRoIGQ9Ik0yMCAxMEMyNi42MjcgMTAgMzIgMTUuMzczIDMyIDIyQzMyIDI4LjYyNyAyNi42MjcgMzQgMjAgMzRDMTMuMzczIDM0IDggMjguNjI3IDggMjJDMCAxNS4zNzMgMTMuMzczIDEwIDIwIDEwWiIgZmlsbD0iI2ZmZiIvPgo8L3N2Zz4K'">
            <p class="channel-name">${channel.name}</p>
            <p class="channel-category">${getCategoryName(channel.category)}</p>
            ${channel.vpn === true ? '<span class="channel-bar-vpn-badge"><i class="fas fa-shield-alt"></i></span>' : ''}
        `;

        channelItem.addEventListener('click', () => {
            app.playChannel(channel);
            // Don't hide channel bar for better navigation on all devices
            // hideChannelBar();
        });

        channelBarContent.appendChild(channelItem);
    });

    // Setup scroll functionality
    setupChannelBarScroll();
}

function getCategoryName(category) {
    const categoryNames = {
        'all': 'جميع القنوات',
        'favorites': 'المفضلة',
        'news': 'أخبار',
        'entertainment': 'منوعة',
        'sports': 'رياضة',
        'religious': 'دينية',
        'music': 'موسيقى',
        'movies': 'أفلام',
        'documentary': 'وثائقية',
        'kids': 'الأطفال'
    };
    return categoryNames[category] || category;
}

function previousChannel() {
    if (!app.channels || !app.currentChannel) return;

    // استخدم قائمة البحث المخصصة إن وجدت وإلا اعتمد على الفئة
    const currentCategory = window.currentPlayerCategoryFilter || 'all';
    let channelsToNavigate = (window.channelBarCustomList && window.channelBarCustomList.length > 0)
        ? window.channelBarCustomList
        : app.channels;
    
    if (!window.channelBarCustomList && currentCategory !== 'all') {
        channelsToNavigate = app.channels.filter(channel => channel.category === currentCategory);
    }
    
    const currentIndex = channelsToNavigate.findIndex(channel => channel.id === app.currentChannel.id);
    if (currentIndex > 0) {
        const previousChannel = channelsToNavigate[currentIndex - 1];
        app.playChannel(previousChannel);
        // Don't hide channel bar for faster navigation
        // hideChannelBar();
    }
}

function nextChannel() {
    if (!app.channels || !app.currentChannel) return;

    // استخدم قائمة البحث المخصصة إن وجدت وإلا اعتمد على الفئة
    const currentCategory = window.currentPlayerCategoryFilter || 'all';
    let channelsToNavigate = (window.channelBarCustomList && window.channelBarCustomList.length > 0)
        ? window.channelBarCustomList
        : app.channels;
    
    if (!window.channelBarCustomList && currentCategory !== 'all') {
        channelsToNavigate = app.channels.filter(channel => channel.category === currentCategory);
    }
    
    const currentIndex = channelsToNavigate.findIndex(channel => channel.id === app.currentChannel.id);
    if (currentIndex < channelsToNavigate.length - 1) {
        const nextChannel = channelsToNavigate[currentIndex + 1];
        app.playChannel(nextChannel);
        // Don't hide channel bar for faster navigation
        // hideChannelBar();
    }
}

function jumpChannels(steps) {
    if (!app.channels || !app.currentChannel) return;

    // استخدم قائمة البحث المخصصة إن وجدت وإلا اعتمد على الفئة
    const currentCategory = window.currentPlayerCategoryFilter || 'all';
    let channelsToNavigate = (window.channelBarCustomList && window.channelBarCustomList.length > 0)
        ? window.channelBarCustomList
        : app.channels;
    
    if (!window.channelBarCustomList && currentCategory !== 'all') {
        channelsToNavigate = app.channels.filter(channel => channel.category === currentCategory);
    }

    const currentIndex = channelsToNavigate.findIndex(channel => channel.id === app.currentChannel.id);
    const newIndex = currentIndex + steps;
    
    if (newIndex >= 0 && newIndex < channelsToNavigate.length) {
        const targetChannel = channelsToNavigate[newIndex];
        app.playChannel(targetChannel);
    }
}

// Channel Bar Scroll Functions
function setupChannelBarScroll() {
    const scrollContainer = document.getElementById('channelBarScroll');
    const leftIndicator = document.getElementById('scrollLeftIndicator');
    const rightIndicator = document.getElementById('scrollRightIndicator');
    
    if (!scrollContainer) return;

    // Scroll indicators click events
    if (leftIndicator) {
        leftIndicator.addEventListener('click', () => {
            // Optimized scroll amount for smoother desktop experience
            const scrollAmount = window.innerWidth <= 768 ? 120 : 200;
            scrollContainer.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
        });
    }

    if (rightIndicator) {
        rightIndicator.addEventListener('click', () => {
            // Optimized scroll amount for smoother desktop experience
            const scrollAmount = window.innerWidth <= 768 ? 120 : 200;
            scrollContainer.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        });
    }

    // Update scroll indicators visibility
    function updateScrollIndicators() {
        const scrollLeft = scrollContainer.scrollLeft;
        const maxScrollLeft = scrollContainer.scrollWidth - scrollContainer.clientWidth;

        if (leftIndicator) {
            leftIndicator.style.opacity = scrollLeft > 0 ? '1' : '0';
        }
        if (rightIndicator) {
            rightIndicator.style.opacity = scrollLeft < maxScrollLeft ? '1' : '0';
        }
    }

    // Listen for scroll events - optimized with throttling
    let scrollTimeout;
    scrollContainer.addEventListener('scroll', () => {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(updateScrollIndicators, 16); // ~60fps
    });
    
    // Initial check
    updateScrollIndicators();

    // Setup touch/swipe support
    setupChannelBarTouchSupport(scrollContainer);
    
    // Setup mouse drag support
    setupChannelBarMouseDrag(scrollContainer);
}

function setupChannelBarTouchSupport(scrollContainer) {
    let startX = 0;
    let startY = 0;
    let isScrolling = false;
    let isDragging = false;
    let lastScrollLeft = 0;
    let velocity = 0;
    let lastTime = 0;
    let animationId = 0;
    let touchStartTime = 0;
    let isDesktopTouch = false;

    // Detect if this is a desktop touch device (laptop with touchscreen)
    const isDesktop = window.innerWidth > 768;
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    isDesktopTouch = isDesktop && hasTouch;

    scrollContainer.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        isScrolling = false;
        isDragging = false;
        lastScrollLeft = scrollContainer.scrollLeft;
        velocity = 0;
        lastTime = Date.now();
        touchStartTime = Date.now();
        
        // Add visual feedback for desktop touch
        if (isDesktopTouch) {
            scrollContainer.style.cursor = 'grabbing';
            scrollContainer.classList.add('touch-active');
        }
        
        // Cancel any ongoing animation
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = 0;
        }
    }, { passive: true });

    scrollContainer.addEventListener('touchmove', (e) => {
        if (!startX || !startY) return;

        const currentX = e.touches[0].clientX;
        const currentY = e.touches[0].clientY;
        const diffX = Math.abs(currentX - startX);
        const diffY = Math.abs(currentY - startY);

        // More sensitive horizontal scroll detection for desktop touch
        const threshold = isDesktopTouch ? 15 : 20;
        if (diffX > diffY && diffX > threshold) {
            isScrolling = true;
            isDragging = true;
            e.preventDefault();
            
            // Calculate velocity for smooth momentum
            const currentTime = Date.now();
            const timeDiff = currentTime - lastTime;
            if (timeDiff > 0) {
                const scrollDiff = scrollContainer.scrollLeft - lastScrollLeft;
                velocity = scrollDiff / timeDiff;
                lastScrollLeft = scrollContainer.scrollLeft;
                lastTime = currentTime;
            }
        }
    }, { passive: false });

    scrollContainer.addEventListener('touchend', (e) => {
        if (!isScrolling || !startX) return;

        const endX = e.changedTouches[0].clientX;
        const diffX = startX - endX;
        const currentTime = Date.now();
        const timeDiff = currentTime - lastTime;
        const totalTouchTime = currentTime - touchStartTime;

        // Calculate final velocity
        if (timeDiff > 0) {
            const scrollDiff = scrollContainer.scrollLeft - lastScrollLeft;
            velocity = scrollDiff / timeDiff;
        }

        // Enhanced momentum for desktop touch devices
        const isQuickSwipe = totalTouchTime < (isDesktopTouch ? 400 : 300) && Math.abs(diffX) > (isDesktopTouch ? 20 : 30);
        
        if (isQuickSwipe && isDragging && Math.abs(velocity) > 0.1) {
            // Apply enhanced momentum for desktop touch
            const momentumMultiplier = isDesktopTouch ? 0.4 : 0.2;
            applyMomentumScroll(scrollContainer, velocity * momentumMultiplier);
        } else if (Math.abs(diffX) > (isDesktopTouch ? 20 : 30)) {
            // For slow drags, use enhanced scroll amounts for desktop touch
            const scrollAmount = isDesktopTouch ? 200 : (window.innerWidth <= 768 ? 80 : 150);
            if (diffX > 0) {
                scrollContainer.scrollBy({
                    left: scrollAmount,
                    behavior: 'smooth'
                });
            } else {
                scrollContainer.scrollBy({
                    left: -scrollAmount,
                    behavior: 'smooth'
                });
            }
        }

        // Reset state and visual feedback
        startX = 0;
        startY = 0;
        isScrolling = false;
        isDragging = false;
        velocity = 0;
        
        if (isDesktopTouch) {
            scrollContainer.style.cursor = 'grab';
            scrollContainer.classList.remove('touch-active');
        }
    }, { passive: true });

    // Enhanced momentum scrolling function for desktop touch
    function applyMomentumScroll(container, initialVelocity) {
        // Enhanced momentum for desktop touch devices
        const velocityMultiplier = isDesktopTouch ? 0.3 : (window.innerWidth <= 768 ? 0.1 : 0.2);
        let currentVelocity = initialVelocity * velocityMultiplier;
        // Adjusted friction for desktop touch
        const friction = isDesktopTouch ? 0.92 : (window.innerWidth <= 768 ? 0.8 : 0.85);
        const minVelocity = isDesktopTouch ? 0.05 : 0.02; // Adjusted threshold for desktop touch

        function animate() {
            if (Math.abs(currentVelocity) < minVelocity) {
                return; // Stop animation
            }

            container.scrollLeft -= currentVelocity;
            currentVelocity *= friction;
            
            animationId = requestAnimationFrame(animate);
        }

        animationId = requestAnimationFrame(animate);
    }
}

function setupChannelBarMouseDrag(scrollContainer) {
    let isDragging = false;
    let startX = 0;
    let scrollLeft = 0;
    let isDesktopTouch = false;

    // Detect if this is a desktop touch device
    const isDesktop = window.innerWidth > 768;
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    isDesktopTouch = isDesktop && hasTouch;

    scrollContainer.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.pageX - scrollContainer.offsetLeft;
        scrollLeft = scrollContainer.scrollLeft;
        scrollContainer.style.cursor = 'grabbing';
        
        // Add visual feedback for desktop touch
        if (isDesktopTouch) {
            scrollContainer.classList.add('mouse-drag-active');
        }
        
        e.preventDefault();
    });

    scrollContainer.addEventListener('mouseleave', () => {
        isDragging = false;
        scrollContainer.style.cursor = 'grab';
        
        if (isDesktopTouch) {
            scrollContainer.classList.remove('mouse-drag-active');
        }
    });

    scrollContainer.addEventListener('mouseup', () => {
        isDragging = false;
        scrollContainer.style.cursor = 'grab';
        
        if (isDesktopTouch) {
            scrollContainer.classList.remove('mouse-drag-active');
        }
    });

    scrollContainer.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - scrollContainer.offsetLeft;
        // Enhanced speed for desktop touch devices
        const multiplier = isDesktopTouch ? 4 : (window.innerWidth <= 768 ? 1.5 : 3);
        const walk = (x - startX) * multiplier;
        scrollContainer.scrollLeft = scrollLeft - walk;
    });

    // Enhanced hover effects for desktop touch
    if (isDesktopTouch) {
        scrollContainer.addEventListener('mouseenter', () => {
            scrollContainer.style.cursor = 'grab';
        });
        
        scrollContainer.addEventListener('mouseleave', () => {
            if (!isDragging) {
                scrollContainer.style.cursor = 'grab';
            }
        });
    }
}

function scrollToCurrentChannel() {
    const channelBarContent = document.getElementById('channelBarContent');
    const scrollContainer = document.getElementById('channelBarScroll');
    
    if (!channelBarContent || !scrollContainer || !app.currentChannel) return;

    const currentChannelItem = channelBarContent.querySelector(`[data-channel-id="${app.currentChannel.id}"]`);
    if (currentChannelItem) {
        const itemRect = currentChannelItem.getBoundingClientRect();
        const containerRect = scrollContainer.getBoundingClientRect();
        const scrollLeft = scrollContainer.scrollLeft;
        
        // Calculate position to center the current channel - optimized
        const targetScrollLeft = scrollLeft + (itemRect.left - containerRect.left) - (containerRect.width / 2) + (itemRect.width / 2);
        
        // Use requestAnimationFrame for smoother animation
        requestAnimationFrame(() => {
        scrollContainer.scrollTo({
            left: targetScrollLeft,
            behavior: 'smooth'
            });
        });
    }
}

function scrollChannelBarLeft() {
    const scrollContainer = document.getElementById('channelBarScroll');
    if (!scrollContainer) return;
    const step = Math.max(200, Math.floor(scrollContainer.clientWidth * 0.6));
    scrollContainer.scrollBy({ left: -step, behavior: 'smooth' });
}

function scrollChannelBarRight() {
    const scrollContainer = document.getElementById('channelBarScroll');
    if (!scrollContainer) return;
    const step = Math.max(200, Math.floor(scrollContainer.clientWidth * 0.6));
    scrollContainer.scrollBy({ left: step, behavior: 'smooth' });
}

// Mouse wheel horizontal scroll
function setupChannelBarWheelScroll() {
    const scrollContainer = document.getElementById('channelBarScroll');
    if (!scrollContainer) return;

    // Detect if this is a desktop touch device
    const isDesktop = window.innerWidth > 768;
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isDesktopTouch = isDesktop && hasTouch;

    scrollContainer.addEventListener('wheel', (e) => {
        // Always allow horizontal scroll when hovering over the channel bar
        e.preventDefault();
        // Optimized speed for smoother desktop experience
        const multiplier = isDesktopTouch ? 2 : (window.innerWidth <= 768 ? 1 : 1.5);
        scrollContainer.scrollBy({
            left: e.deltaY * multiplier,
            behavior: 'smooth'
        });
    }, { passive: false });

    // Also support shift + wheel for even faster control
    scrollContainer.addEventListener('wheel', (e) => {
        if (e.shiftKey) {
            e.preventDefault();
            // Optimized speed for smoother desktop experience
            const multiplier = isDesktopTouch ? 3 : (window.innerWidth <= 768 ? 2 : 2.5);
            scrollContainer.scrollBy({
                left: e.deltaY * multiplier,
                behavior: 'smooth'
            });
        }
    }, { passive: false });

    // Add visual feedback for wheel scrolling on desktop touch
    if (isDesktopTouch) {
        let wheelTimeout;
        scrollContainer.addEventListener('wheel', () => {
            scrollContainer.classList.add('wheel-scrolling');
            clearTimeout(wheelTimeout);
            wheelTimeout = setTimeout(() => {
                scrollContainer.classList.remove('wheel-scrolling');
            }, 150);
        });
    }
}

function resetChannelForm() {
    // مسح جميع حقول النموذج
    document.getElementById('channelName').value = '';
    document.getElementById('channelUrl').value = '';
    document.getElementById('channelLogo').value = '';
    document.getElementById('channelCategory').value = 'news';
    document.getElementById('channelCountryInput').value = '';
    
    // مسح معاينة الشعار
    const logoPreview = document.getElementById('logoPreview');
    if (logoPreview) {
        logoPreview.style.display = 'none';
    }
    
    // مسح مؤشر نوع الرابط
    const urlTypeIndicator = document.getElementById('urlTypeIndicator');
    if (urlTypeIndicator) {
        urlTypeIndicator.style.display = 'none';
    }
    
    // مسح مساعد الرابط
    const urlHelp = document.getElementById('urlHelp');
    if (urlHelp) {
        urlHelp.style.display = 'block';
    }
    
    // إعادة تعيين حالة التحرير
    if (window.app) {
        window.app.editingChannelId = null;
    }
    
    // تغيير زر التعديل إلى زر الحفظ
    const editButton = document.querySelector('.edit-btn');
    if (editButton) {
        editButton.innerHTML = '<i class="fas fa-save"></i> حفظ';
        editButton.classList.remove('edit-btn');
        editButton.classList.add('save-btn');
        editButton.onclick = function(event) {
            event.stopPropagation();
            if (window.app && window.app.editingChannelId) {
                window.app.updateChannel(window.app.editingChannelId);
            } else {
                // إذا لم تكن في وضع التعديل، أضف قناة جديدة
                if (window.app) {
                    window.app.addChannel();
                }
            }
        };
    }
    
    // تغيير زر الإضافة إلى "تحديث القناة" إذا كنا في وضع التعديل
    const addButton = document.querySelector('.add-btn');
    if (addButton && window.app && window.app.editingChannelId) {
        addButton.textContent = 'تحديث القناة';
    } else if (addButton) {
        addButton.textContent = 'إضافة القناة';
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

// Website Fullscreen Toggle Function
function toggleWebsiteFullscreen() {
    if (!document.fullscreenElement) {
        // Enter fullscreen
        document.documentElement.requestFullscreen().then(() => {
            console.log('تم تفعيل وضع الشاشة الكاملة');
            // Change icon to compress for both desktop and mobile buttons
            const desktopBtn = document.querySelector('.fullscreen-toggle-btn i');
            const mobileBtn = document.querySelector('.mobile-fullscreen-toggle-btn i');
            if (desktopBtn) {
                desktopBtn.className = 'fas fa-compress';
            }
            if (mobileBtn) {
                mobileBtn.className = 'fas fa-compress';
            }
        }).catch(err => {
            console.error('خطأ في تفعيل وضع الشاشة الكاملة:', err);
            app.notifyError('فشل في تفعيل وضع الشاشة الكاملة');
        });
    } else {
        // Exit fullscreen
        document.exitFullscreen().then(() => {
            console.log('تم إلغاء وضع الشاشة الكاملة');
            // Change icon back to expand for both desktop and mobile buttons
            const desktopBtn = document.querySelector('.fullscreen-toggle-btn i');
            const mobileBtn = document.querySelector('.mobile-fullscreen-toggle-btn i');
            if (desktopBtn) {
                desktopBtn.className = 'fas fa-expand';
            }
            if (mobileBtn) {
                mobileBtn.className = 'fas fa-expand';
            }
        }).catch(err => {
            console.error('خطأ في إلغاء وضع الشاشة الكاملة:', err);
            app.notifyError('فشل في إلغاء وضع الشاشة الكاملة');
        });
    }
}

// Listen for fullscreen change events (cross-browser support)
function handleFullscreenChange() {
    const desktopBtn = document.querySelector('.fullscreen-toggle-btn i');
    const mobileBtn = document.querySelector('.mobile-fullscreen-toggle-btn i');
    
    // Check for fullscreen state across different browsers
    const isFullscreen = document.fullscreenElement || 
                       document.webkitFullscreenElement || 
                       document.mozFullScreenElement || 
                       document.msFullscreenElement;
    
    if (isFullscreen) {
        // Entered fullscreen
        if (desktopBtn) {
            desktopBtn.className = 'fas fa-compress';
        }
        if (mobileBtn) {
            mobileBtn.className = 'fas fa-compress';
        }
        console.log('✅ تم الدخول إلى وضع التكبير');
    } else {
        // Exited fullscreen
        if (desktopBtn) {
            desktopBtn.className = 'fas fa-expand';
        }
        if (mobileBtn) {
            mobileBtn.className = 'fas fa-expand';
        }
        console.log('✅ تم الخروج من وضع التكبير');
    }
}

// Add event listeners for all fullscreen change events
document.addEventListener('fullscreenchange', handleFullscreenChange);
document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
document.addEventListener('mozfullscreenchange', handleFullscreenChange);
document.addEventListener('MSFullscreenChange', handleFullscreenChange);

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


// ========================================
// Mobile Bottom Navigation Functions
// ========================================

// Categories Dropdown Functions
function toggleCategoriesDropdown() {
    const dropdown = document.getElementById('categoriesDropdown');
    const overlay = document.getElementById('mobileOverlay');
    
    if (dropdown.classList.contains('active')) {
        closeCategoriesDropdown();
    } else {
        // Close other dropdowns first
        closeSearchPopup();
        closeMoreMenu();
        
        dropdown.classList.add('active');
        overlay.classList.add('active');
        
        // Update category counts
        updateMobileCategoryCounts();
    }
}

function closeCategoriesDropdown() {
    const dropdown = document.getElementById('categoriesDropdown');
    const overlay = document.getElementById('mobileOverlay');
    
    dropdown.classList.remove('active');
    overlay.classList.remove('active');
}

function selectCategory(category) {
    if (window.app) {
        window.app.filterChannels(category);
        
        // Update active category in dropdown
        document.querySelectorAll('.category-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-category="${category}"]`).classList.add('active');
        
        // Update bottom nav active state
        updateBottomNavActiveState('home');
        
        // Close dropdown
        closeAllMobileMenus();
    }
}

// Search Popup Functions
function toggleSearchPopup() {
    const popup = document.getElementById('searchPopup');
    const overlay = document.getElementById('mobileOverlay');
    
    if (popup.classList.contains('active')) {
        closeSearchPopup();
    } else {
        // Close other dropdowns first
        closeCategoriesDropdown();
        closeMoreMenu();
        
        popup.classList.add('active');
        overlay.classList.add('active');
        
        // Focus on search input
        setTimeout(() => {
            const searchInput = document.getElementById('searchPopupInput');
            if (searchInput) {
                searchInput.focus();
            }
        }, 300);
    }
}

function closeSearchPopup() {
    const popup = document.getElementById('searchPopup');
    const overlay = document.getElementById('mobileOverlay');
    
    popup.classList.remove('active');
    overlay.classList.remove('active');
    
    // Clear search results
    const searchResults = document.getElementById('searchResults');
    if (searchResults) {
        searchResults.innerHTML = '';
    }
    
    // Clear search input
    const searchInput = document.getElementById('searchPopupInput');
    if (searchInput) {
        searchInput.value = '';
    }
}

// More Menu Functions
function toggleMoreMenu() {
    const menu = document.getElementById('moreMenu');
    const overlay = document.getElementById('mobileOverlay');
    
    if (menu.classList.contains('active')) {
        closeMoreMenu();
    } else {
        // Close other dropdowns first
        closeCategoriesDropdown();
        closeSearchPopup();
        
        menu.classList.add('active');
        overlay.classList.add('active');
    }
}

function closeMoreMenu() {
    const menu = document.getElementById('moreMenu');
    const overlay = document.getElementById('mobileOverlay');
    
    menu.classList.remove('active');
    overlay.classList.remove('active');
}

// Share site (mobile first) with Web Share API and clipboard fallback
function shareSite() {
    try {
        const shareData = {
            title: document.title || 'NOON TV',
            text: 'شاهد القنوات العربية المباشرة على NOON TV',
            url: window.location.href
        };

        if (navigator.share) {
            navigator.share(shareData).catch(() => {
                // If user cancels share, silently ignore
            }).finally(() => {
                closeMoreMenu();
            });
            return;
        }

        // Fallback: copy URL to clipboard
        const urlToCopy = shareData.url;
        const copyToClipboard = async () => {
            try {
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    await navigator.clipboard.writeText(urlToCopy);
                } else {
                    const tempInput = document.createElement('input');
                    tempInput.value = urlToCopy;
                    document.body.appendChild(tempInput);
                    tempInput.select();
                    document.execCommand('copy');
                    document.body.removeChild(tempInput);
                }
                if (window.app && window.app.notifySuccess) {
                    window.app.notifySuccess('تم نسخ رابط الموقع إلى الحافظة');
                }
            } catch (err) {
                if (window.app && window.app.notifyError) {
                    window.app.notifyError('تعذر مشاركة الرابط. يرجى النسخ يدويًا');
                }
            } finally {
                closeMoreMenu();
            }
        };

        copyToClipboard();
    } catch (e) {
        // As a last resort just close menu
        closeMoreMenu();
    }
}

// Open Telegram link from More menu
function openTelegram() {
    try {
        // Link to NOON TV official Telegram channel
        const telegramUrl = 'https://t.me/noon_tv2';
        window.open(telegramUrl, '_blank', 'noopener,noreferrer');
    } finally {
        closeMoreMenu();
    }
}

// Player Categories Filter Functions
// Reset to 'all' on page load (no localStorage persistence)
let currentPlayerCategoryFilter = 'all';
window.currentPlayerCategoryFilter = 'all';

function togglePlayerCategories() {
    const menu = document.getElementById('playerCategoriesMenu');
    const btn = document.getElementById('playerCategoriesBtn');
    
    if (!menu || !btn) return;
    
    const isOpen = menu.classList.contains('show');
    
    if (isOpen) {
        menu.classList.remove('show');
        btn.classList.remove('open');
    } else {
        // Position the menu correctly on mobile
        if (window.innerWidth <= 768) {
            const btnRect = btn.getBoundingClientRect();
            menu.style.position = 'fixed';
            menu.style.top = (btnRect.bottom + 5) + 'px';
            menu.style.left = btnRect.left + 'px';
            menu.style.right = 'auto';
        }
        
        menu.classList.add('show');
        btn.classList.add('open');
        updatePlayerCategoryCounts();
    }
}

function filterChannelBar(category) {
    // عند اختيار فئة يدوياً، أزل قائمة البحث المخصصة
    window.channelBarCustomList = null;

    // Save the filter globally (only for current session)
    currentPlayerCategoryFilter = category;
    window.currentPlayerCategoryFilter = category;
    
    // Update button text
    const categoryText = document.getElementById('playerCategoryText');
    const categoryNames = {
        'all': 'جميع القنوات',
        'news': 'الأخبار',
        'entertainment': 'المنوعة',
        'sports': 'الرياضة',
        'religious': 'الدينية',
        'music': 'الموسيقى',
        'movies': 'الأفلام',
        'documentary': 'الوثائقية',
        'kids': 'الأطفال'
    };
    
    if (categoryText) {
        categoryText.textContent = categoryNames[category] || 'جميع القنوات';
    }
    
    // Update active state in menu
    const menu = document.getElementById('playerCategoriesMenu');
    if (menu) {
        menu.querySelectorAll('.player-category-option').forEach(option => {
            option.classList.remove('active');
        });
        
        const activeOption = menu.querySelector(`[data-category="${category}"]`);
        if (activeOption) {
            activeOption.classList.add('active');
        }
    }
    
    // Sync with main page category filter
    if (window.app && typeof window.app.filterChannels === 'function') {
        // Only sync if different from current category
        if (window.app.currentCategory !== category) {
            window.app.filterChannels(category);
        }
    }
    
    // Reload channel bar content with filter
    loadChannelBarContentWithFilter(category);
    
    // Close menu
    togglePlayerCategories();
    
    // Show channel bar if hidden
    const channelBar = document.getElementById('channelBar');
    if (channelBar && !channelBar.classList.contains('show')) {
        showChannelBar();
    }
}

function loadChannelBarContentWithFilter(category) {
    const channelBarContent = document.getElementById('channelBarContent');
    const channelCount = document.getElementById('channelBarCount');
    if (!channelBarContent || !app.channels) return;
    
    // Clear existing content
    channelBarContent.innerHTML = '';
    
    // Filter channels by category
    let channelsToShow = app.channels;
    if (category !== 'all') {
        channelsToShow = app.channels.filter(channel => channel.category === category);
    }
    
    // Update channel count
    if (channelCount) {
        channelCount.textContent = channelsToShow.length;
    }
    
    // Render filtered channels
    channelsToShow.forEach((channel) => {
        const channelItem = document.createElement('div');
        channelItem.className = 'channel-bar-item';
        channelItem.dataset.channelId = channel.id;
        
        if (app.currentChannel && channel.id === app.currentChannel.id) {
            channelItem.classList.add('active');
        }
        
        channelItem.innerHTML = `
            <img src="${channel.logo || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjMzMzIi8+CjxwYXRoIGQ9Ik0yMCAxMEMyNi42MjcgMTAgMzIgMTUuMzczIDMyIDIyQzMyIDI4LjYyNyAyNi42MjcgMzQgMjAgMzRDMTMuMzczIDM0IDggMjguNjI3IDggMjJDMCAxNS4zNzMgMTMuMzczIDEwIDIwIDEwWiIgZmlsbD0iI2ZmZiIvPgo8L3N2Zz4K'}" 
                 alt="${channel.name}" 
                 onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjMzMzIi8+CjxwYXRoIGQ9Ik0yMCAxMEMyNi42MjcgMTAgMzIgMTUuMzczIDMyIDIyQzMyIDI4LjYyNyAyNi42MjcgMzQgMjAgMzRDMTMuMzczIDM0IDggMjguNjI3IDggMjJDMCAxNS4zNzMgMTMuMzczIDEwIDIwIDEwWiIgZmlsbD0iI2ZmZiIvPgo8L3N2Zz4K'">
            <p class="channel-name">${channel.name}</p>
            <p class="channel-category">${getCategoryName(channel.category)}</p>
            ${channel.vpn === true ? '<span class="channel-bar-vpn-badge"><i class="fas fa-shield-alt"></i></span>' : ''}
        `;
        
        channelItem.addEventListener('click', () => {
            app.playChannel(channel);
        });
        
        channelBarContent.appendChild(channelItem);
    });
    
    // Setup scroll functionality
    setupChannelBarScroll();
}

function updatePlayerCategoryCounts() {
    if (!app || !app.channels) return;
    
    const categories = {
        'all': app.channels.length,
        'news': app.channels.filter(ch => ch.category === 'news').length,
        'entertainment': app.channels.filter(ch => ch.category === 'entertainment').length,
        'sports': app.channels.filter(ch => ch.category === 'sports').length,
        'religious': app.channels.filter(ch => ch.category === 'religious').length,
        'music': app.channels.filter(ch => ch.category === 'music').length,
        'movies': app.channels.filter(ch => ch.category === 'movies').length,
        'documentary': app.channels.filter(ch => ch.category === 'documentary').length,
        'kids': app.channels.filter(ch => ch.category === 'kids').length
    };
    
    // Update counts in player menu
    Object.keys(categories).forEach(category => {
        const countId = `player${category.charAt(0).toUpperCase() + category.slice(1)}Count`;
        const countElement = document.getElementById(countId);
        if (countElement) {
            countElement.textContent = categories[category];
        }
    });
}

// Close player categories menu when clicking outside
document.addEventListener('click', (e) => {
    const menu = document.getElementById('playerCategoriesMenu');
    const btn = document.getElementById('playerCategoriesBtn');
    
    if (!menu || !btn) return;
    
    if (!btn.contains(e.target) && !menu.contains(e.target)) {
        menu.classList.remove('show');
        btn.classList.remove('open');
    }
});

// Update player category dropdown UI based on current filter
function updatePlayerCategoryDropdown() {
    // Always show 'all' on page load
    const currentFilter = window.currentPlayerCategoryFilter || 'all';
    
    // Update button text
    const categoryText = document.getElementById('playerCategoryText');
    const categoryNames = {
        'all': 'جميع القنوات',
        'news': 'الأخبار',
        'entertainment': 'المنوعة',
        'sports': 'الرياضة',
        'religious': 'الدينية',
        'music': 'الموسيقى',
        'movies': 'الأفلام',
        'documentary': 'الوثائقية',
        'kids': 'الأطفال'
    };
    
    if (categoryText) {
        categoryText.textContent = categoryNames[currentFilter] || 'جميع القنوات';
    }
    
    // Update active state in menu
    const menu = document.getElementById('playerCategoriesMenu');
    if (menu) {
        menu.querySelectorAll('.player-category-option').forEach(option => {
            option.classList.remove('active');
        });
        
        const activeOption = menu.querySelector(`[data-category="${currentFilter}"]`);
        if (activeOption) {
            activeOption.classList.add('active');
        }
    }
    
    // Update counts
    updatePlayerCategoryCounts();
}

// Update player category counts when channels change
if (window.app) {
    const originalRenderChannels = window.app.renderChannels;
    if (originalRenderChannels) {
        window.app.renderChannels = function(...args) {
            const result = originalRenderChannels.apply(this, args);
            updatePlayerCategoryCounts();
            return result;
        };
    }
}

// Copy a special link to enforce cookies reset for visitors
function copyResetCookiesLink() {
    try {
        const url = new URL(window.location.href);
        url.searchParams.set('reset_cookies', '1');
        const link = url.toString();
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(link).then(() => {
                if (window.app && window.app.notifySuccess) {
                    window.app.notifySuccess('تم نسخ رابط فرض حذف الكوكيز');
                }
            });
        } else {
            const temp = document.createElement('input');
            temp.value = link;
            document.body.appendChild(temp);
            temp.select();
            document.execCommand('copy');
            document.body.removeChild(temp);
            if (window.app && window.app.notifySuccess) {
                window.app.notifySuccess('تم نسخ رابط فرض حذف الكوكيز');
            }
        }
    } catch (e) {
        if (window.app && window.app.notifyError) {
            window.app.notifyError('تعذر إنشاء الرابط');
        }
    }
}

// On load: if reset_cookies param present, clear cookies/storage and notify
window.addEventListener('DOMContentLoaded', () => {
    try {
        const params = new URLSearchParams(window.location.search);
        if (params.get('reset_cookies') === '1') {
            // Clear cookies
            document.cookie.split(';').forEach(cookie => {
                const eqPos = cookie.indexOf('=');
                const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
                document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;`;
            });
            // Clear local/session storage
            try { localStorage.clear(); } catch {}
            try { sessionStorage.clear(); } catch {}
            if (window.app && window.app.notifySuccess) {
                window.app.notifySuccess('تم حذف الكوكيز والبيانات المخزنة للجهاز');
            }
            // Remove the parameter from URL without reload
            const url = new URL(window.location.href);
            url.searchParams.delete('reset_cookies');
            window.history.replaceState({}, document.title, url.toString());
            
            // إعادة تحميل الصفحة تلقائياً بعد ثانيتين
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        }
    } catch (e) {
        // ignore
    }
});

// دالة لإغلاق جميع القوائم المفتوحة في الشريط السفلي
function closeAllMobileMenus() {
    closeCategoriesDropdown();
    closeSearchPopup();
    closeMoreMenu();
}

// Bottom Navigation Functions
function updateBottomNavActiveState(activeAction) {
    document.querySelectorAll('.bottom-nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const activeBtn = document.querySelector(`[data-action="${activeAction}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
}

function updateMobileCategoryCounts() {
    if (!window.app) return;
    
    const categories = ['all', 'news', 'entertainment', 'sports', 'religious', 'music', 'movies', 'documentary'];
    
    categories.forEach(category => {
        const count = window.app.getCategoryCount(category);
        const countElement = document.getElementById(`mobile${category.charAt(0).toUpperCase() + category.slice(1)}Count`);
        if (countElement) {
            countElement.textContent = count;
        }
    });
}


// Search functionality for mobile
function setupMobileSearch() {
    const searchInput = document.getElementById('searchPopupInput');
    if (!searchInput) return;
    
    let searchTimeout;
    
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        const query = e.target.value.trim();
        
        if (query.length < 2) {
            document.getElementById('searchResults').innerHTML = '';
            return;
        }
        
        searchTimeout = setTimeout(() => {
            performMobileSearch(query);
        }, 300);
    });
    
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const query = e.target.value.trim();
            if (query.length >= 2) {
                performMobileSearch(query);
            }
        }
    });
}

function performMobileSearch(query) {
    if (!window.app) return;
    
    const results = window.app.channels.filter(channel => {
        // العثور على رقم القناة
        const channelIndex = window.app.channels.findIndex(ch => ch.id === channel.id);
        const channelNumber = channelIndex + 1;
        
        return channel.name.toLowerCase().includes(query.toLowerCase()) ||
               channel.country.toLowerCase().includes(query.toLowerCase()) ||
               channelNumber.toString().includes(query);
    });
    
    const searchResults = document.getElementById('searchResults');
    if (!searchResults) return;
    
    if (results.length === 0) {
        searchResults.innerHTML = '<div class="no-results">لم يتم العثور على نتائج</div>';
        return;
    }
    
    searchResults.innerHTML = `
        <div class="search-results-header">
            <span class="results-count">تم العثور على ${results.length} قناة</span>
        </div>
        ${results.map(channel => {
            console.log('إنشاء عنصر بحث للقناة:', channel.name, 'مع ID:', channel.id);
            // العثور على رقم القناة
            const channelIndex = window.app.channels.findIndex(ch => ch.id === channel.id);
            const channelNumber = channelIndex + 1;
            
            return `
            <div class="search-result-item" onclick="selectChannelFromSearch(${channel.id})">
                <div class="search-result-logo">
                    <img src="${channel.logo || 'https://via.placeholder.com/40x40/333/fff?text=' + channel.name.charAt(0)}" 
                         alt="${channel.name}" onerror="this.src='https://via.placeholder.com/40x40/333/fff?text=' + this.alt.charAt(0)">
                </div>
                <div class="search-result-info">
                    <h4>${channel.name}</h4>
                    <p>${channel.country} • رقم ${channelNumber}</p>
                </div>
            </div>
        `;
        }).join('')}
    `;
}

function selectChannelFromSearch(channelId) {
    console.log('تم استدعاء selectChannelFromSearch مع ID:', channelId);
    if (window.app) {
        // تحويل channelId إلى رقم إذا كان نص
        const id = typeof channelId === 'string' ? parseInt(channelId) : channelId;
        const channel = window.app.channels.find(c => c.id === id);
        console.log('القناة الموجودة:', channel);
        if (channel) {
            window.app.playChannel(channel);
            closeSearchPopup();
        } else {
            console.error('لم يتم العثور على القناة مع ID:', id);
        }
    }
}

// Close dropdowns when clicking overlay
function setupMobileOverlay() {
    const overlay = document.getElementById('mobileOverlay');
    if (overlay) {
        overlay.addEventListener('click', () => {
            closeAllMobileMenus();
        });
    }
}

// Add CSS for search results
function addMobileSearchStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .search-result-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px;
            border-radius: 8px;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }
        
        .search-result-item:hover {
            background: rgba(255, 255, 255, 0.1);
        }
        
        .search-result-logo img {
            width: 40px;
            height: 40px;
            border-radius: 8px;
            object-fit: cover;
        }
        
        .search-result-info h4 {
            margin: 0 0 4px 0;
            font-size: 0.95rem;
            font-weight: 600;
            color: var(--text-primary);
        }
        
        .search-result-info p {
            margin: 0;
            font-size: 0.8rem;
            color: var(--text-secondary);
        }
        
        .no-results {
            text-align: center;
            padding: 20px;
            color: var(--text-secondary);
            font-style: italic;
        }
        
        body[data-theme="light"] .search-result-item:hover {
            background: rgba(59, 130, 246, 0.1);
        }
        
        body[data-theme="light"] .search-result-info h4 {
            color: #1e293b;
        }
        
        body[data-theme="light"] .search-result-info p {
            color: #64748b;
        }
    `;
    document.head.appendChild(style);
}

// Initialize mobile bottom navigation
function initializeMobileBottomNav() {
    // Setup event listeners
    setupMobileSearch();
    setupMobileOverlay();
    addMobileSearchStyles();
    
    // Update category counts when channels are loaded
    if (window.app) {
        updateMobileCategoryCounts();
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new ArabicTVApp();

    // ===== PWA INSTALLATION FUNCTIONALITY =====
    
    // PWA Installation variables
    let deferredPrompt = null;
    let installButton = null;
    
    // Create install button if it doesn't exist
    function createInstallButton() {
        if (document.getElementById('pwa-install-button')) return;
        
        const installBtn = document.createElement('button');
        installBtn.id = 'pwa-install-button';
        installBtn.innerHTML = '<i class="fas fa-download"></i> تثبيت التطبيق';
        installBtn.className = 'pwa-install-btn';
        installBtn.style.cssText = `
            position: fixed;
            bottom: 80px;
            left: 20px;
            background: linear-gradient(135deg, #ff6b35, #ff8c42);
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 25px;
            font-family: 'Cairo', sans-serif;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);
            z-index: 1000;
            transition: all 0.3s ease;
            display: none;
        `;
        
        // Add hover effects
        installBtn.addEventListener('mouseenter', () => {
            installBtn.style.transform = 'translateY(-2px)';
            installBtn.style.boxShadow = '0 6px 20px rgba(255, 107, 53, 0.4)';
        });
        
        installBtn.addEventListener('mouseleave', () => {
            installBtn.style.transform = 'translateY(0)';
            installBtn.style.boxShadow = '0 4px 15px rgba(255, 107, 53, 0.3)';
        });
        
        // Add click handler
        installBtn.addEventListener('click', () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                deferredPrompt.userChoice.then((choiceResult) => {
                    if (choiceResult.outcome === 'accepted') {
                        console.log('User accepted the PWA installation prompt');
                        // Hide button after installation
                        installBtn.style.display = 'none';
                        // Show success message
                        showInstallMessage('تم تثبيت التطبيق بنجاح! يمكنك الوصول إليه من شاشة الرئيسية.', 'success');
                    } else {
                        console.log('User dismissed the PWA installation prompt');
                    }
                    deferredPrompt = null;
                });
            }
        });
        
        document.body.appendChild(installBtn);
        installButton = installBtn;
    }
    
    // Show installation message
    function showInstallMessage(message, type = 'info') {
        const messageDiv = document.createElement('div');
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4caf50' : '#2196f3'};
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            font-family: 'Cairo', sans-serif;
            font-size: 14px;
            z-index: 10000;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            animation: slideIn 0.3s ease;
        `;
        messageDiv.textContent = message;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            messageDiv.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.parentNode.removeChild(messageDiv);
                }
            }, 300);
        }, 3000);
    }
    
    // Listen for beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
        console.log('PWA installation prompt available');
        e.preventDefault();
        deferredPrompt = e;
        
        // Create and show install button
        createInstallButton();
        
        // Show install button after a delay
        setTimeout(() => {
            if (installButton && deferredPrompt) {
                installButton.style.display = 'block';
            }
        }, 3000);
    });
    
    // Listen for appinstalled event
    window.addEventListener('appinstalled', (e) => {
        console.log('PWA was installed');
        deferredPrompt = null;
        
        // Hide install button
        if (installButton) {
            installButton.style.display = 'none';
        }
        
        // Show success message
        showInstallMessage('شكراً لتثبيت تطبيق NOON TV!', 'success');
        
        // Save installation status
        localStorage.setItem('pwa-installed', 'true');
    });
    
    // Check if app is already installed
    if (localStorage.getItem('pwa-installed') === 'true') {
        console.log('PWA is already installed');
    }
    
    // Check if running as standalone PWA
    if (window.matchMedia('(display-mode: standalone)').matches) {
        console.log('Running as standalone PWA');
        document.body.classList.add('pwa-standalone');
    }
    
    // Service Worker messaging for PWA events
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.addEventListener('message', event => {
            if (event.data && event.data.action === 'appinstalled') {
                console.log('Service worker reported app installation');
                showInstallMessage('تم تثبيت التطبيق بنجاح!', 'success');
            }
        });
    }
    
    // Add CSS animations for install messages
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        .pwa-standalone {
            padding-top: env(safe-area-inset-top);
        }
        
        @media (max-width: 768px) {
            #pwa-install-button {
                bottom: 100px !important;
                left: 50% !important;
                transform: translateX(-50%);
            }
        }
    `;
    document.head.appendChild(style);

    // ===== NEW MOBILE BOTTOM NAVIGATION FUNCTIONS =====

    // Show home page
    window.showHomePage = function() {
        // Remove active class from all nav items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Add active class to home button
        document.querySelector('[data-page="home"]').classList.add('active');
        
        // Show all channels
        if (window.app && window.app.filterChannels) {
            window.app.filterChannels('all');
        }
        
        // Close any open menus
        closeAllMenus();
    };

    // Toggle categories dropdown
    window.toggleCategories = function() {
        const dropdown = document.getElementById('categoriesDropdown');
        const moreMenu = document.getElementById('moreMenu');
        
        // Close more menu if open
        moreMenu.classList.remove('active');
        
        // Toggle categories dropdown
        dropdown.classList.toggle('active');
        
        // Update nav item active state
        updateNavActiveState('categories');
    };

    // Close categories dropdown
    window.closeCategories = function() {
        const dropdown = document.getElementById('categoriesDropdown');
        dropdown.classList.remove('active');
    };

    // Open mobile search
    window.openMobileSearch = function() {
        const searchModal = document.getElementById('searchModal');
        const mobileSearchInput = document.getElementById('mobileSearchInput');
        
        // Show search modal
        searchModal.classList.add('active');
        
        // Focus on search input after animation
        setTimeout(() => {
            if (mobileSearchInput) {
                mobileSearchInput.focus();
            }
        }, 300);
        
        // Update nav item active state
        updateNavActiveState('search');
        
        // Close any open menus
        closeAllMenus();
    };

    // Close search modal
    window.closeSearchModal = function() {
        const searchModal = document.getElementById('searchModal');
        searchModal.classList.remove('active');
        
        // Clear search input
        const mobileSearchInput = document.getElementById('mobileSearchInput');
        if (mobileSearchInput) {
            mobileSearchInput.value = '';
        }
        
        // Clear results
        clearSearchResults();
        
        // ملاحظة: لا نقوم بإزالة قائمة البحث المخصصة هنا حتى تبقى الباقة ظاهرة بعد تشغيل القناة على الهاتف
    };

    // Clear search
    window.clearSearch = function() {
        const mobileSearchInput = document.getElementById('mobileSearchInput');
        const clearBtn = document.getElementById('clearSearchBtn');
        
        if (mobileSearchInput) {
            mobileSearchInput.value = '';
            mobileSearchInput.focus();
        }
        
        if (clearBtn) {
            clearBtn.classList.remove('visible');
        }
        
        clearSearchResults();
        hideSuggestions();
        
        // إزالة قائمة البحث المخصصة عند مسح البحث
        window.channelBarCustomList = null;
    };

    // Clear recent searches
    window.clearRecentSearches = function() {
        localStorage.removeItem('recentSearches');
        loadRecentSearches();
    };


    // Toggle more menu (enhanced with overlay)
    window.toggleMoreMenu = function() {
        const moreMenu = document.getElementById('moreMenu');
        const categoriesDropdown = document.getElementById('categoriesDropdown');
        const body = document.body;
        
        // Close categories dropdown if open
        categoriesDropdown.classList.remove('active');
        
        // Toggle more menu
        const isActive = moreMenu.classList.toggle('active');
        
        // Toggle body overflow to prevent scrolling when menu is open
        if (isActive) {
            body.style.overflow = 'hidden';
        } else {
            body.style.overflow = '';
        }
        
        // Update nav item active state
        updateNavActiveState('more');
    };
    
    // Close more menu specifically
    window.closeMoreMenu = function() {
        const moreMenu = document.getElementById('moreMenu');
        const body = document.body;
        
        moreMenu.classList.remove('active');
        body.style.overflow = '';
    };

    // Update nav item active state
    function updateNavActiveState(activePage) {
        // Remove active class from all nav items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Add active class to current page
        const activeItem = document.querySelector(`[data-page="${activePage}"]`);
        if (activeItem) {
            activeItem.classList.add('active');
        }
    }

    // Close all menus
    function closeAllMenus() {
        const moreMenu = document.getElementById('moreMenu');
        const categoriesDropdown = document.getElementById('categoriesDropdown');
        const body = document.body;
        
        moreMenu.classList.remove('active');
        categoriesDropdown.classList.remove('active');
        body.style.overflow = '';
    }

    // Handle category selection
    function selectCategory(category) {
        if (window.app && window.app.filterChannels) {
            window.app.filterChannels(category);
        }
        
        // Update category items active state
        document.querySelectorAll('.category-item').forEach(item => {
            item.classList.remove('active');
        });
        
        const activeItem = document.querySelector(`[data-category="${category}"]`);
        if (activeItem) {
            activeItem.classList.add('active');
        }
        
        // Close categories dropdown
        closeCategories();
        
        // Update nav item active state
        updateNavActiveState('categories');
    }

    // Close menus when clicking outside or on overlay
    document.addEventListener('click', function(event) {
        const bottomNav = document.getElementById('bottomNav');
        const moreMenu = document.getElementById('moreMenu');
        const moreMenuContent = moreMenu.querySelector('.more-menu-content');
        const categoriesDropdown = document.getElementById('categoriesDropdown');
        
        // Close if clicked outside bottom nav
        if (!bottomNav.contains(event.target)) {
            // Check if clicked on more menu overlay (not content)
            if (moreMenu.classList.contains('active') && 
                event.target === moreMenu || 
                (!moreMenuContent.contains(event.target) && moreMenu.contains(event.target))) {
                closeMoreMenu();
            } else {
                closeAllMenus();
            }
        }
    });
    
    // Close more menu when clicking on overlay
    document.getElementById('moreMenu').addEventListener('click', function(event) {
        const moreMenuContent = this.querySelector('.more-menu-content');
        
        // If clicked outside the content (on overlay)
        if (!moreMenuContent.contains(event.target)) {
            closeMoreMenu();
        }
    });
    
    // Auto-close more menu when any item is clicked (with visual feedback)
    document.querySelectorAll('.more-item').forEach(item => {
        item.addEventListener('click', function(e) {
            // Add visual feedback
            this.classList.add('clicked');
            
            // Vibrate on mobile (if supported)
            if (navigator.vibrate) {
                navigator.vibrate(50);
            }
            
            // Close menu after animation
            setTimeout(() => {
                closeMoreMenu();
                // Remove clicked class after closing
                setTimeout(() => {
                    this.classList.remove('clicked');
                }, 300);
            }, 200);
        });
    });

    // Handle category item clicks
    document.addEventListener('click', function(event) {
        if (event.target.closest('.category-item')) {
            const category = event.target.closest('.category-item').dataset.category;
            if (category) {
                selectCategory(category);
            }
        }
    });


    // ===== SIMPLE SEARCH FUNCTIONALITY =====

    // Search functionality variables
    let searchTimeout;
    let currentSearchResults = [];

    // Initialize search functionality (simplified)
    function initializeSearch() {
        const mobileSearchInput = document.getElementById('mobileSearchInput');
        const clearBtn = document.getElementById('clearSearchBtn');

        // Search input events
        if (mobileSearchInput) {
            mobileSearchInput.addEventListener('input', handleSearchInput);
            mobileSearchInput.addEventListener('keydown', handleSearchKeydown);
        }

        // Clear button events
        if (clearBtn) {
            clearBtn.addEventListener('click', clearSearch);
        }

        // Close modal when clicking outside
        const searchModal = document.getElementById('searchModal');
        if (searchModal) {
            searchModal.addEventListener('click', function(e) {
                if (e.target === searchModal) {
                    closeSearchModal();
                }
            });
        }
    }

    // Handle search input (simplified)
    function handleSearchInput(e) {
        const query = e.target.value.trim();
        const clearBtn = document.getElementById('clearSearchBtn');

        // Show/hide clear button
        if (clearBtn) {
            if (query.length > 0) {
                clearBtn.classList.add('visible');
            } else {
                clearBtn.classList.remove('visible');
            }
        }

        // Clear previous timeout
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }

        // Search with delay
        if (query.length >= 1) {
            searchTimeout = setTimeout(() => {
                performSearch(query);
            }, 300);
        } else {
            clearSearchResults();
        }
    }

    // Handle search keydown
    function handleSearchKeydown(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const query = e.target.value.trim();
            if (query.length > 0) {
                performSearch(query);
            }
        } else if (e.key === 'Escape') {
            closeSearchModal();
        }
    }

    // Perform search (simplified)
    function performSearch(query) {
        if (!window.app || !window.app.channels) {
            return;
        }

        const channels = window.app.channels;
        const searchQuery = query.toLowerCase();
        
        const results = channels.filter(channel => {
            const name = channel.name.toLowerCase();
            const category = channel.category.toLowerCase();
            const country = channel.country.toLowerCase();

            // Search in name, category, and country
            return name.includes(searchQuery) || 
                   category.includes(searchQuery) || 
                   country.includes(searchQuery);
        });

        // Sort by name
        results.sort((a, b) => a.name.localeCompare(b.name));

        currentSearchResults = results;
        
        // اربط نتائج البحث الحالية بشريط القنوات ليتم عرضها عند تشغيل أي قناة
        window.channelBarCustomList = [...results];
        
        displaySearchResults(results);
        updateResultsCount(results.length);
    }

    // Display search results (simplified)
    function displaySearchResults(results) {
        const resultsContainer = document.getElementById('mobileSearchResults');
        const noResults = document.getElementById('mobileNoResults');

        if (!resultsContainer) return;

        if (results.length === 0) {
            resultsContainer.innerHTML = '';
            if (noResults) {
                noResults.style.display = 'block';
            }
            return;
        }

        // Hide no results
        if (noResults) {
            noResults.style.display = 'none';
        }

        // Generate results HTML
        const resultsHTML = results.map(channel => `
            <div class="search-result-item" onclick="selectSearchResult(${channel.id})">
                <img src="${channel.logo || 'favicon.svg'}" 
                     alt="${channel.name}" 
                     class="search-result-logo"
                     onerror="this.src='favicon.svg'">
                <div class="search-result-info">
                    <h4>${channel.name}</h4>
                    <p>${channel.country}</p>
                </div>
                <i class="fas fa-play-circle search-result-play"></i>
            </div>
        `).join('');

        resultsContainer.innerHTML = resultsHTML;
    }

    // Select search result and play channel
    window.selectSearchResult = function(channelId) {
        console.log('تم الضغط على قناة بـ ID:', channelId);
        
        if (!window.app || !window.app.channels) {
            console.error('التطبيق أو القنوات غير متاحة');
            return;
        }
        
        // Find channel by ID (convert to number if needed)
        const channel = window.app.channels.find(c => c.id == channelId);
        
        if (!channel) {
            console.error('لم يتم العثور على القناة بـ ID:', channelId);
            return;
        }
        
        console.log('تم العثور على القناة:', channel.name);
        
        // Close search modal first
        closeSearchModal();
        
        // Play the channel using the app's playChannel method
        setTimeout(() => {
            if (window.app && window.app.playChannel) {
                console.log('تشغيل القناة:', channel.name);
                window.app.playChannel(channel);
            } else {
                console.error('دالة playChannel غير متاحة');
            }
        }, 300);
    }

    // Update results count
    function updateResultsCount(count) {
        const resultsCount = document.getElementById('mobileResultsCount');
        if (resultsCount) {
            resultsCount.textContent = count;
        }
    }

    // Clear search results
    function clearSearchResults() {
        const resultsContainer = document.getElementById('mobileSearchResults');
        const noResults = document.getElementById('mobileNoResults');

        if (resultsContainer) {
            resultsContainer.innerHTML = '';
        }

        if (noResults) {
            noResults.style.display = 'none';
        }

        updateResultsCount(0);
    }


    // Initialize search when DOM is loaded
    initializeSearch();
    
    // إضافة حماية من الإعلانات وإعادة التوجيه غير المرغوب فيها
    const blockAdsAndRedirects = function() {
        // منع النوافذ المنبثقة غير المرغوب فيها
        window.addEventListener('beforeunload', function(e) {
            // منع إعادة التوجيه غير المرغوب فيها
            if (window.location.href.includes('elahmad.com') && !window.location.href.includes('noon.tv')) {
                e.preventDefault();
                e.returnValue = '';
                return 'هل تريد مغادرة الموقع؟';
            }
        });
        
        // منع الإعلانات في الصفحة
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) { // Element node
                        // إزالة الإعلانات
                        if (node.className && (
                            node.className.includes('ad') || 
                            node.className.includes('advertisement') ||
                            node.className.includes('banner') ||
                            node.className.includes('popup')
                        )) {
                            node.style.display = 'none';
                            console.log('🚫 تم إخفاء إعلان');
                        }
                        
                        // فحص النصوص للإعلانات
                        if (node.textContent && (
                            node.textContent.includes('إعلان') ||
                            node.textContent.includes('advertisement') ||
                            node.textContent.includes('Please wait 4 seconds')
                        )) {
                            node.style.display = 'none';
                            console.log('🚫 تم إخفاء محتوى إعلاني');
                        }
                    }
                });
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        console.log('🛡️ تم تفعيل حماية من الإعلانات وإعادة التوجيه');
    };
    
    // تفعيل الحماية
    blockAdsAndRedirects();
    
    // Initialize quality menu
    if (window.app && window.app.initQualityMenu) {
        window.app.initQualityMenu();
    }
    
    // ربط أحداث التبويبات الإدارية بعد تحميل الصفحة
    setTimeout(() => {
        if (window.app && window.app.bindAdminTabEvents) {
            window.app.bindAdminTabEvents();
        }
    }, 500);
    
    // Initialize mobile bottom navigation
    initializeMobileBottomNav();
});

// Helper function to validate JSON and provide detailed error information
function validateJSON(jsonString, context = '') {
    try {
        // First, try to clean up common JSON issues
        let cleanedJson = jsonString.trim();
        
        // Remove any BOM characters
        cleanedJson = cleanedJson.replace(/^\uFEFF/, '');
        
        // Try to fix common comma issues
        cleanedJson = cleanedJson.replace(/,(\s*[}\]])/g, '$1');
        
        const parsed = JSON.parse(cleanedJson);
        return { valid: true, data: parsed, error: null };
    } catch (error) {
        let detailedError = {
            message: error.message,
            position: null,
            context: '',
            suggestion: ''
        };
        
        // Extract position if available
        const positionMatch = error.message.match(/position (\d+)/);
        if (positionMatch) {
            detailedError.position = parseInt(positionMatch[1]);
            
            // Get context around the error
            const start = Math.max(0, detailedError.position - 100);
            const end = Math.min(jsonString.length, detailedError.position + 100);
            detailedError.context = jsonString.substring(start, end);
            
            // Try to identify the issue
            const charAtError = jsonString[detailedError.position];
            if (charAtError === "'") {
                detailedError.suggestion = 'يبدو أن هناك اقتباس مفرد بدلاً من اقتباس مزدوج';
            } else if (charAtError === ',') {
                detailedError.suggestion = 'يبدو أن هناك فاصلة زائدة أو مفقودة';
            } else if (charAtError === '{' || charAtError === '}') {
                detailedError.suggestion = 'يبدو أن هناك مشكلة في الأقواس المتعرجة';
            } else if (charAtError === '[' || charAtError === ']') {
                detailedError.suggestion = 'يبدو أن هناك مشكلة في الأقواس المربعة';
            } else if (charAtError === ':') {
                detailedError.suggestion = 'يبدو أن هناك مشكلة في النقطتين';
            } else {
                detailedError.suggestion = 'تحقق من التنسيق حول هذا الموضع';
            }
        }
        
        return { valid: false, data: null, error: detailedError };
    }
}

// Update Channels Function
async function updateChannels() {
    if (!window.app) {
        console.error('التطبيق غير محمل');
        return;
    }

    try {
        console.log('🔄 بدء تحديث القنوات...');
        
        // Show loading notification for users (only if not automatic)
        if (!window.app.isAutomaticUpdate) {
            window.app.notifyInfo('جارٍ تحديث القنوات من الخادم...', 'تحديث القنوات', 3000);
        }
        
        // Fetch channels from GitHub
        const response = await fetch('https://raw.githubusercontent.com/anon-site/TV-AR/main/channels.json');
        
        if (!response.ok) {
            throw new Error(`خطأ في جلب البيانات: ${response.status} ${response.statusText}`);
        }
        
        // Get response text first to debug
        const responseText = await response.text();
        console.log('📥 تم جلب البيانات من GitHub، حجم البيانات:', responseText.length, 'حرف');
        
        // Clean up the response text to handle potential formatting issues
        const cleanedResponseText = responseText.trim();
        
        // Validate JSON before parsing
        const validation = validateJSON(cleanedResponseText, 'GitHub channels data');
        
        if (!validation.valid) {
            console.error('❌ خطأ في تحليل JSON:');
            console.error('الرسالة:', validation.error.message);
            console.error('الموضع:', validation.error.position);
            console.error('السياق:', validation.error.context);
            if (validation.error.suggestion) {
                console.error('الاقتراح:', validation.error.suggestion);
            }
            
            throw new Error(`خطأ في تنسيق JSON: ${validation.error.message}`);
        }
        
        const data = validation.data;
        
        if (!data || typeof data !== 'object') {
            throw new Error('البيانات المستلمة ليست كائن صحيح');
        }
        
        if (!data.channels || !Array.isArray(data.channels)) {
            throw new Error('تنسيق البيانات غير صحيح - لا توجد قنوات في البيانات');
        }
        
        if (data.channels.length === 0) {
            throw new Error('لا توجد قنوات في البيانات المستلمة');
        }
        
        console.log('✅ تم تحليل JSON بنجاح، عدد القنوات:', data.channels.length);
        
        // Create backup of current channels before updating
        const currentChannels = window.app.channels || [];
        if (currentChannels.length > 0) {
            const backupData = {
                channels: currentChannels,
                timestamp: new Date().toISOString(),
                count: currentChannels.length
            };
            localStorage.setItem('channels_backup', JSON.stringify(backupData));
            console.log('💾 تم إنشاء نسخة احتياطية من القنوات الحالية:', currentChannels.length, 'قناة');
        }
        
        // Validate each channel has required fields and ensure VPN property exists
        const invalidChannels = data.channels.filter(channel => 
            !channel.name || !channel.url || !channel.category
        );
        
        if (invalidChannels.length > 0) {
            console.warn('⚠️ تم العثور على قنوات غير صحيحة:', invalidChannels.length);
            console.warn('القنوات غير الصحيحة:', invalidChannels);
        }
        
        // Ensure all channels have VPN property set correctly
        data.channels = data.channels.map(channel => ({
            ...channel,
            vpn: channel.vpn === true || channel.vpn === 'true' || false
        }));
        
        // Update channels in the app
        window.app.channels = data.channels;
        
        // Update filtered channels to match the new channels
        window.app.filteredChannels = [...data.channels];
        
        // Save to localStorage using the app's save method
        window.app.saveChannelsToStorage();
        
        // Apply current filters to the new channels
        window.app.applyAllFilters();
        
        // Update channel statistics
        window.app.updateChannelStats();
        
        // تحديث آخر تحديث سيتم في دالة المزامنة السحابية
        
        // Reload the channels display
        window.app.renderChannels();
        window.app.updateSidebarCounts();
        
        
        
        // المزامنة التلقائية مع السحابة بعد التحديث من GitHub
        if (window.app.remoteStorage.enabled && window.app.remoteStorage.autoSync) {
            console.log('🔄 بدء المزامنة السحابية بعد التحديث من GitHub...');
            window.app.syncToRemote().then(syncSuccess => {
                if (syncSuccess) {
                    console.log('✅ تمت المزامنة السحابية بنجاح');
                    // تحديث آخر تحديث عند نجاح المزامنة السحابية
                    window.app.updateLastUpdateTime();
                    if (!window.app.isAutomaticUpdate) {
                        setTimeout(() => {
                            window.app.notifySuccess('تم تحديث القنوات ومزامنتها مع جميع الأجهزة المتصلة!');
                        }, 1000);
                    } else {
                        // For automatic updates, show only the simple notification
                        setTimeout(() => {
                            window.app.notifyInfo('تم تحديث القنوات تلقائياً', 'تحديث تلقائي', 2000);
                        }, 1000);
                    }
                } else {
                    console.log('⚠️ فشلت المزامنة السحابية');
                    if (!window.app.isAutomaticUpdate) {
                        setTimeout(() => {
                            window.app.notifyWarning('تم تحديث القنوات محلياً، لكن فشلت المزامنة مع السحابة. يمكنك المحاولة يدوياً من إعدادات المزامنة السحابية.');
                        }, 1000);
                    }
                }
            }).catch(syncError => {
                console.error('❌ خطأ في المزامنة السحابية:', syncError);
                if (!window.app.isAutomaticUpdate) {
                    setTimeout(() => {
                        window.app.notifyWarning('تم تحديث القنوات محلياً، لكن فشلت المزامنة مع السحابة. يمكنك المحاولة يدوياً من إعدادات المزامنة السحابية.');
                    }, 1000);
                }
            });
        } else {
            // Show success notification (only if not automatic)
            if (!window.app.isAutomaticUpdate) {
                setTimeout(() => {
                    window.app.notifySuccess(`تم تحديث القنوات بنجاح! تم تحميل ${data.channels.length} قناة جديدة.`, 'تحديث مكتمل', 5000);
                }, 500);
            } else {
                // For automatic updates, show only the simple notification
                setTimeout(() => {
                    window.app.notifyInfo('تم تحديث القنوات تلقائياً', 'تحديث تلقائي', 2000);
                }, 500);
            }
        }
        
        // Log confirmation that data was saved
        console.log('✅ تم حفظ القنوات المحدثة في localStorage بنجاح');
        console.log('✅ تم تحديث القنوات بنجاح:', data.channels.length, 'قناة');
        
    } catch (error) {
        console.error('❌ خطأ في تحديث القنوات:', error);
        
        // Show user-friendly error notification
        let errorMessage = 'فشل في تحديث القنوات';
        let errorTitle = 'خطأ في التحديث';
        
        if (error.message.includes('JSON')) {
            errorMessage = 'خطأ في تنسيق البيانات المستلمة من الخادم';
            errorTitle = 'خطأ في البيانات';
        } else if (error.message.includes('fetch') || error.message.includes('network')) {
            errorMessage = 'مشكلة في الاتصال بالإنترنت. يرجى التحقق من اتصالك والمحاولة مرة أخرى';
            errorTitle = 'مشكلة في الاتصال';
        } else if (error.message.includes('404')) {
            errorMessage = 'لم يتم العثور على ملف القنوات على الخادم';
            errorTitle = 'ملف غير موجود';
        } else if (error.message.includes('403') || error.message.includes('401')) {
            errorMessage = 'لا يمكن الوصول إلى ملف القنوات. قد يكون هناك مشكلة في الصلاحيات';
            errorTitle = 'مشكلة في الصلاحيات';
        } else {
            errorMessage = 'حدث خطأ غير متوقع أثناء تحديث القنوات';
            errorTitle = 'خطأ غير متوقع';
        }
        
        window.app.notifyError(errorMessage, errorTitle, 6000);
        
        // Try to restore backup if available
        const backupData = localStorage.getItem('channels_backup');
        if (backupData) {
            try {
                const backup = JSON.parse(backupData);
                if (backup.channels && backup.channels.length > 0) {
                    console.log('🔄 محاولة استعادة النسخة الاحتياطية...');
                    window.app.channels = backup.channels;
                    window.app.filteredChannels = [...backup.channels];
                    window.app.saveChannelsToStorage();
                    window.app.applyAllFilters();
                    window.app.renderChannels();
                    window.app.updateSidebarCounts();
                    
                    setTimeout(() => {
                        window.app.notifyInfo(
                            `تم استعادة النسخة الاحتياطية (${backup.count} قناة)`,
                            'استعادة النسخة الاحتياطية',
                            5000
                        );
                    }, 3000);
                }
            } catch (backupError) {
                console.error('❌ فشل في استعادة النسخة الاحتياطية:', backupError);
            }
        }
        
        // Show additional help
        setTimeout(() => {
            window.app.notifyInfo(
                'يمكنك المحاولة مرة أخرى أو التحقق من اتصال الإنترنت. إذا استمرت المشكلة، يرجى المحاولة لاحقاً.',
                'مساعدة',
                5000
            );
        }, 2000);
    }
}

// Logo Upload Functions
function handleLogoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
        if (window.app) {
            window.app.notifyWarning('يرجى اختيار ملف صورة صالح!');
        }
        return;
    }
    
    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
        if (window.app) {
            window.app.notifyWarning('حجم الملف كبير جداً! الحد الأقصى 2 ميجابايت');
        }
        return;
    }
    
    // Create FileReader to convert image to base64
    const reader = new FileReader();
    reader.onload = function(e) {
        const base64String = e.target.result;
        showLogoPreview(base64String);
        
        // Put the base64 string in the URL input field
        const urlInput = document.getElementById('channelLogo');
        if (urlInput) {
            urlInput.value = base64String;
        }
    };
    reader.readAsDataURL(file);
}

function showLogoPreview(imageSrc) {
    const preview = document.getElementById('logoPreview');
    const previewImg = document.getElementById('logoPreviewImg');
    
    if (preview && previewImg) {
        previewImg.src = imageSrc;
        preview.style.display = 'inline-block';
        
        // Store the base64 image for later use
        window.uploadedLogoData = imageSrc;
    }
}

function removeLogoPreview() {
    const preview = document.getElementById('logoPreview');
    const fileInput = document.getElementById('logoUpload');
    const urlInput = document.getElementById('channelLogo');
    
    if (preview) {
        preview.style.display = 'none';
    }
    
    if (fileInput) {
        fileInput.value = '';
    }
    
    // Clear the URL input if it contains a base64 string
    if (urlInput && urlInput.value.startsWith('data:image/')) {
        urlInput.value = '';
    }
    
    // Clear stored image data
    window.uploadedLogoData = null;
}

// Initialize logo upload functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const logoUploadInput = document.getElementById('logoUpload');
    if (logoUploadInput) {
        logoUploadInput.addEventListener('change', handleLogoUpload);
    }
});

// Scroll to Top Button Functions
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function setupScrollToTopButton() {
    const scrollBtn = document.getElementById('scrollToTopBtn');
    if (!scrollBtn) {
        console.log('زر الصعود إلى الأعلى غير موجود');
        return;
    }

    console.log('تم إعداد زر الصعود إلى الأعلى');

    // Show/hide button based on scroll position (show when scrolled down 500px)
    function handleScroll() {
        const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
        
        console.log('التمرير الحالي:', scrollPosition);
        
        if (scrollPosition > 500) {
            scrollBtn.classList.add('show');
            console.log('تم إظهار الزر');
        } else {
            scrollBtn.classList.remove('show');
            console.log('تم إخفاء الزر');
        }
    }

    window.addEventListener('scroll', handleScroll);
    
    // Test the function immediately
    handleScroll();
}

// Initialize scroll to top button when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setupScrollToTopButton();
    
    // Setup background audio setting handler
    const backgroundAudioToggle = document.getElementById('backgroundAudio');
    if (backgroundAudioToggle && window.app) {
        backgroundAudioToggle.addEventListener('change', function(e) {
            window.app.settings.backgroundAudio = e.target.checked;
            window.app.saveSettings();
            
            // Apply changes to current video if playing
            const video = document.getElementById('videoPlayer');
            if (video && window.app.currentChannel) {
                if (e.target.checked) {
                    video.setAttribute('playsinline', 'true');
                    video.setAttribute('webkit-playsinline', 'true');
                    video.setAttribute('x5-playsinline', 'true');
                    video.setAttribute('x5-video-player-type', 'h5');
                    video.setAttribute('x5-video-player-fullscreen', 'false');
                    setupMediaSession();
                    console.log('تم تفعيل تشغيل الصوت في الخلفية');
                } else {
                    console.log('تم إلغاء تفعيل تشغيل الصوت في الخلفية');
                }
            }
        });
    }
    
    // Sync player category filter with main category on page load
    setTimeout(() => {
        if (window.app && window.app.currentCategory) {
            window.currentPlayerCategoryFilter = window.app.currentCategory;
            if (typeof updatePlayerCategoryDropdown === 'function') {
                updatePlayerCategoryDropdown();
            }
        }
    }, 500);
});

// Media Session API for background audio support
function setupMediaSession() {
    if (!('mediaSession' in navigator)) {
        console.log('Media Session API غير مدعوم في هذا المتصفح');
        return;
    }

    const video = document.getElementById('videoPlayer');
    if (!video || !app.currentChannel) {
        return;
    }

    const channel = app.currentChannel;
    
    // Set media metadata
    navigator.mediaSession.metadata = new MediaMetadata({
        title: channel.name,
        artist: channel.country || 'قناة فضائية',
        album: 'NOON TV',
        artwork: channel.logo ? [
            { src: channel.logo, sizes: '96x96', type: 'image/png' },
            { src: channel.logo, sizes: '128x128', type: 'image/png' },
            { src: channel.logo, sizes: '192x192', type: 'image/png' },
            { src: channel.logo, sizes: '256x256', type: 'image/png' },
            { src: channel.logo, sizes: '384x384', type: 'image/png' },
            { src: channel.logo, sizes: '512x512', type: 'image/png' }
        ] : [
            { src: 'favicon.svg', sizes: '96x96', type: 'image/svg+xml' }
        ]
    });

    // Set action handlers
    navigator.mediaSession.setActionHandler('play', () => {
        video.play();
    });

    navigator.mediaSession.setActionHandler('pause', () => {
        video.pause();
    });

    navigator.mediaSession.setActionHandler('stop', () => {
        video.pause();
        video.currentTime = 0;
    });

    navigator.mediaSession.setActionHandler('seekbackward', (details) => {
        const skipTime = details.seekOffset || 10;
        video.currentTime = Math.max(video.currentTime - skipTime, 0);
    });

    navigator.mediaSession.setActionHandler('seekforward', (details) => {
        const skipTime = details.seekOffset || 10;
        video.currentTime = Math.min(video.currentTime + skipTime, video.duration || 0);
    });

    navigator.mediaSession.setActionHandler('seekto', (details) => {
        if (details.seekTime !== undefined) {
            video.currentTime = details.seekTime;
        }
    });

    // Update playback state
    navigator.mediaSession.playbackState = video.paused ? 'paused' : 'playing';

    // Listen for video events to update media session
    video.addEventListener('play', () => {
        navigator.mediaSession.playbackState = 'playing';
    });

    video.addEventListener('pause', () => {
        navigator.mediaSession.playbackState = 'paused';
    });

    video.addEventListener('ended', () => {
        navigator.mediaSession.playbackState = 'none';
    });

    console.log('تم إعداد Media Session API لتشغيل الصوت في الخلفية');
}

// Service Worker message handling
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('message', event => {
        const video = document.getElementById('videoPlayer');
        if (!video) return;

        switch (event.data.action) {
            case 'play':
                video.play();
                break;
            case 'pause':
                video.pause();
                break;
        }
    });
}


