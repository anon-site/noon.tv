/**
 * Cloud Sync Manager - نظام إدارة المزامنة السحابية الموحد
 * يدعم GitHub و GitLab مع مزامنة شاملة لجميع بيانات الموقع
 */

class CloudSyncManager {
    constructor() {
        this.config = {
            enabled: false,
            provider: 'github', // 'github' | 'gitlab'
            repository: '',
            token: '',
            branch: 'main',
            filename: 'anon-tv-data.json',
            autoSync: true,
            syncInterval: 30000, // 30 seconds
            maxRetries: 3,
            retryDelay: 2000
        };
        
        this.syncStatus = {
            isOnline: navigator.onLine,
            lastSync: null,
            isSyncing: false,
            errorCount: 0,
            lastError: null
        };
        
        this.dataTypes = {
            channels: 'channels',
            favorites: 'favorites', 
            settings: 'settings',
            categories: 'categories',
            adminPassword: 'adminPassword',
            customizations: 'customizations',
            userPreferences: 'userPreferences'
        };
        
        this.init();
    }
    
    /**
     * تهيئة النظام
     */
    init() {
        this.loadConfig();
        this.setupEventListeners();
        this.setupOnlineStatus();
        this.startAutoSync();
        console.log('✅ Cloud Sync Manager initialized');
    }
    
    /**
     * تحميل الإعدادات من localStorage
     */
    loadConfig() {
        try {
            const saved = localStorage.getItem('anonTVCloudSync');
            if (saved) {
                const parsed = JSON.parse(saved);
                this.config = { ...this.config, ...parsed };
                console.log('📥 Cloud sync config loaded:', this.config);
            }
        } catch (error) {
            console.error('❌ Error loading cloud sync config:', error);
        }
    }
    
    /**
     * حفظ الإعدادات في localStorage
     */
    saveConfig() {
        try {
            localStorage.setItem('anonTVCloudSync', JSON.stringify(this.config));
            console.log('💾 Cloud sync config saved');
        } catch (error) {
            console.error('❌ Error saving cloud sync config:', error);
        }
    }
    
    /**
     * إعداد مستمعي الأحداث
     */
    setupEventListeners() {
        // مراقبة تغيير حالة الإنترنت
        window.addEventListener('online', () => {
            this.syncStatus.isOnline = true;
            this.notify('تم استعادة الاتصال بالإنترنت', 'success');
            if (this.config.autoSync) {
                this.syncAll();
            }
        });
        
        window.addEventListener('offline', () => {
            this.syncStatus.isOnline = false;
            this.notify('فقدان الاتصال بالإنترنت', 'warning');
        });
        
        // مراقبة تغييرات البيانات المحلية
        this.setupDataWatchers();
    }
    
    /**
     * إعداد مراقبة البيانات المحلية
     */
    setupDataWatchers() {
        // مراقبة تغييرات القنوات
        const originalSetItem = localStorage.setItem;
        localStorage.setItem = (key, value) => {
            originalSetItem.call(localStorage, key, value);
            
            if (this.config.autoSync && this.config.enabled && this.syncStatus.isOnline) {
                // تأخير المزامنة لتجنب المزامنة المتكررة
                clearTimeout(this.syncTimeout);
                this.syncTimeout = setTimeout(() => {
                    this.syncAll();
                }, 2000);
            }
        };
    }
    
    /**
     * إعداد حالة الاتصال بالإنترنت
     */
    setupOnlineStatus() {
        this.syncStatus.isOnline = navigator.onLine;
        this.updateSyncStatusUI();
    }
    
    /**
     * بدء المزامنة التلقائية
     */
    startAutoSync() {
        if (this.config.autoSync && this.config.enabled) {
            this.autoSyncInterval = setInterval(() => {
                if (this.syncStatus.isOnline && !this.syncStatus.isSyncing) {
                    this.syncAll();
                }
            }, this.config.syncInterval);
            
            console.log('🔄 Auto-sync started');
        }
    }
    
    /**
     * إيقاف المزامنة التلقائية
     */
    stopAutoSync() {
        if (this.autoSyncInterval) {
            clearInterval(this.autoSyncInterval);
            this.autoSyncInterval = null;
            console.log('⏹️ Auto-sync stopped');
        }
    }
    
    /**
     * مزامنة جميع البيانات
     */
    async syncAll() {
        if (!this.config.enabled || !this.syncStatus.isOnline || this.syncStatus.isSyncing) {
            return { success: false, message: 'المزامنة غير متاحة' };
        }
        
        this.syncStatus.isSyncing = true;
        this.updateSyncStatusUI();
        
        try {
            console.log('🔄 Starting full sync...');
            
            // أولاً: محاولة تحميل البيانات من السحابة
            const downloadResult = await this.downloadFromCloud();
            
            if (downloadResult.success) {
                // دمج البيانات المحملة مع البيانات المحلية
                await this.mergeData(downloadResult.data);
                this.syncStatus.lastSync = new Date().toISOString();
                this.syncStatus.errorCount = 0;
                this.updateSyncStatusUI();
                
                console.log('✅ Full sync completed successfully');
                this.notify('تم تحديث البيانات من السحابة', 'success');
                return { success: true, message: 'تم تحديث البيانات من السحابة' };
            }
            
            // إذا لم تكن هناك بيانات جديدة، ارفع البيانات المحلية
            const uploadResult = await this.uploadToCloud();
            
            if (uploadResult.success) {
                this.syncStatus.lastSync = new Date().toISOString();
                this.syncStatus.errorCount = 0;
                this.updateSyncStatusUI();
                
                console.log('✅ Data uploaded to cloud successfully');
                this.notify('تم رفع البيانات إلى السحابة', 'success');
                return { success: true, message: 'تم رفع البيانات إلى السحابة' };
            }
            
            return { success: false, message: 'لم يتم تحديث أي بيانات' };
            
        } catch (error) {
            console.error('❌ Sync error:', error);
            this.syncStatus.errorCount++;
            this.syncStatus.lastError = error.message;
            this.updateSyncStatusUI();
            
            this.notify(`خطأ في المزامنة: ${error.message}`, 'error');
            return { success: false, message: error.message };
            
        } finally {
            this.syncStatus.isSyncing = false;
            this.updateSyncStatusUI();
        }
    }
    
    /**
     * تحميل البيانات من السحابة
     */
    async downloadFromCloud() {
        try {
            const url = this.getDownloadURL();
            const headers = this.getHeaders();
            
            console.log('📥 Downloading data from cloud...');
            
            const response = await fetch(url, { headers });
            
            if (response.status === 404) {
                console.log('📄 No data found in cloud');
                return { success: false, message: 'لا توجد بيانات في السحابة' };
            }
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const fileData = await response.json();
            const content = this.decodeContent(fileData.content);
            const data = JSON.parse(content);
            
            console.log('✅ Data downloaded successfully');
            return { success: true, data };
            
        } catch (error) {
            console.error('❌ Download error:', error);
            throw error;
        }
    }
    
    /**
     * رفع البيانات إلى السحابة
     */
    async uploadToCloud() {
        try {
            const data = this.collectAllData();
            const url = this.getUploadURL();
            const headers = this.getHeaders();
            
            console.log('📤 Uploading data to cloud...');
            
            // الحصول على SHA الحالي للملف
            let sha = null;
            try {
                const getResponse = await fetch(url, { headers });
                if (getResponse.ok) {
                    const fileData = await getResponse.json();
                    sha = fileData.sha;
                }
            } catch (error) {
                console.log('📄 File does not exist, will create new one');
            }
            
            const content = this.encodeContent(JSON.stringify(data, null, 2));
            const commitMessage = this.generateCommitMessage(data);
            
            const body = {
                message: commitMessage,
                content: content,
                branch: this.config.branch
            };
            
            if (sha) {
                body.sha = sha;
            }
            
            const response = await fetch(url, {
                method: 'PUT',
                headers: { ...headers, 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`HTTP ${response.status}: ${errorData.message || response.statusText}`);
            }
            
            const responseData = await response.json();
            console.log('✅ Data uploaded successfully');
            console.log('Commit SHA:', responseData.commit.sha);
            
            return { success: true };
            
        } catch (error) {
            console.error('❌ Upload error:', error);
            throw error;
        }
    }
    
    /**
     * جمع جميع البيانات المحلية
     */
    collectAllData() {
        const data = {
            channels: this.getData('arabicTVChannels', []),
            favorites: this.getData('arabicTVFavorites', []),
            settings: this.getData('arabicTVSettings', {}),
            categories: this.getData('arabicTVCategories', []),
            adminPassword: this.getData('anon_tv_admin_password', ''),
            customizations: this.getData('arabicTVCustomizations', {}),
            userPreferences: this.getData('arabicTVUserPreferences', {}),
            lastModified: new Date().toISOString(),
            version: '2.0.0',
            syncInfo: {
                clientId: this.getClientId(),
                lastSync: this.syncStatus.lastSync,
                errorCount: this.syncStatus.errorCount
            }
        };
        
        console.log('📊 Collected data:', {
            channels: data.channels.length,
            favorites: data.favorites.length,
            settings: Object.keys(data.settings).length,
            categories: data.categories.length
        });
        
        return data;
    }
    
    /**
     * دمج البيانات المحملة مع البيانات المحلية
     */
    async mergeData(cloudData) {
        try {
            console.log('🔄 Merging cloud data with local data...');
            
            // دمج القنوات
            if (cloudData.channels && Array.isArray(cloudData.channels)) {
                const localChannels = this.getData('arabicTVChannels', []);
                const mergedChannels = this.mergeChannels(localChannels, cloudData.channels);
                this.setData('arabicTVChannels', mergedChannels);
            }
            
            // دمج المفضلة
            if (cloudData.favorites && Array.isArray(cloudData.favorites)) {
                const localFavorites = this.getData('arabicTVFavorites', []);
                const mergedFavorites = this.mergeFavorites(localFavorites, cloudData.favorites);
                this.setData('arabicTVFavorites', mergedFavorites);
            }
            
            // دمج الإعدادات
            if (cloudData.settings && typeof cloudData.settings === 'object') {
                const localSettings = this.getData('arabicTVSettings', {});
                const mergedSettings = { ...localSettings, ...cloudData.settings };
                this.setData('arabicTVSettings', mergedSettings);
            }
            
            // دمج الفئات
            if (cloudData.categories && Array.isArray(cloudData.categories)) {
                const localCategories = this.getData('arabicTVCategories', []);
                const mergedCategories = this.mergeCategories(localCategories, cloudData.categories);
                this.setData('arabicTVCategories', mergedCategories);
            }
            
            // دمج كلمة المرور الإدارية
            if (cloudData.adminPassword && cloudData.adminPassword !== this.getData('anon_tv_admin_password', '')) {
                this.setData('anon_tv_admin_password', cloudData.adminPassword);
                console.log('🔐 Admin password updated from cloud');
            }
            
            // دمج التخصيصات
            if (cloudData.customizations && typeof cloudData.customizations === 'object') {
                const localCustomizations = this.getData('arabicTVCustomizations', {});
                const mergedCustomizations = { ...localCustomizations, ...cloudData.customizations };
                this.setData('arabicTVCustomizations', mergedCustomizations);
            }
            
            // دمج تفضيلات المستخدم
            if (cloudData.userPreferences && typeof cloudData.userPreferences === 'object') {
                const localPreferences = this.getData('arabicTVUserPreferences', {});
                const mergedPreferences = { ...localPreferences, ...cloudData.userPreferences };
                this.setData('arabicTVUserPreferences', mergedPreferences);
            }
            
            console.log('✅ Data merge completed successfully');
            
        } catch (error) {
            console.error('❌ Error merging data:', error);
            throw error;
        }
    }
    
    /**
     * دمج القنوات
     */
    mergeChannels(localChannels, cloudChannels) {
        const merged = [...localChannels];
        const localUrls = new Set(localChannels.map(ch => ch.url));
        
        // إضافة القنوات الجديدة من السحابة
        cloudChannels.forEach(cloudChannel => {
            if (!localUrls.has(cloudChannel.url)) {
                merged.push(cloudChannel);
            }
        });
        
        return merged;
    }
    
    /**
     * دمج المفضلة
     */
    mergeFavorites(localFavorites, cloudFavorites) {
        const merged = [...localFavorites];
        const localSet = new Set(localFavorites);
        
        cloudFavorites.forEach(favorite => {
            if (!localSet.has(favorite)) {
                merged.push(favorite);
            }
        });
        
        return merged;
    }
    
    /**
     * دمج الفئات
     */
    mergeCategories(localCategories, cloudCategories) {
        const merged = [...localCategories];
        const localKeys = new Set(localCategories.map(cat => cat.key));
        
        cloudCategories.forEach(cloudCategory => {
            if (!localKeys.has(cloudCategory.key)) {
                merged.push(cloudCategory);
            }
        });
        
        return merged;
    }
    
    /**
     * الحصول على URL التحميل
     */
    getDownloadURL() {
        if (this.config.provider === 'github') {
            return `https://api.github.com/repos/${this.config.repository}/contents/${this.config.filename}?ref=${this.config.branch}`;
        } else if (this.config.provider === 'gitlab') {
            const encodedPath = encodeURIComponent(this.config.filename);
            return `https://gitlab.com/api/v4/projects/${encodeURIComponent(this.config.repository)}/repository/files/${encodedPath}?ref=${this.config.branch}`;
        }
        throw new Error('Unsupported provider');
    }
    
    /**
     * الحصول على URL الرفع
     */
    getUploadURL() {
        if (this.config.provider === 'github') {
            return `https://api.github.com/repos/${this.config.repository}/contents/${this.config.filename}`;
        } else if (this.config.provider === 'gitlab') {
            const encodedPath = encodeURIComponent(this.config.filename);
            return `https://gitlab.com/api/v4/projects/${encodeURIComponent(this.config.repository)}/repository/files/${encodedPath}`;
        }
        throw new Error('Unsupported provider');
    }
    
    /**
     * الحصول على Headers
     */
    getHeaders() {
        if (this.config.provider === 'github') {
            return {
                'Authorization': `Bearer ${this.config.token}`,
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'ANON-TV-Sync/2.0'
            };
        } else if (this.config.provider === 'gitlab') {
            return {
                'PRIVATE-TOKEN': this.config.token
            };
        }
        throw new Error('Unsupported provider');
    }
    
    /**
     * ترميز المحتوى
     */
    encodeContent(content) {
        return btoa(unescape(encodeURIComponent(content)));
    }
    
    /**
     * فك ترميز المحتوى
     */
    decodeContent(content) {
        return decodeURIComponent(escape(atob(content)));
    }
    
    /**
     * إنشاء رسالة التزام
     */
    generateCommitMessage(data) {
        const timestamp = new Date().toLocaleString('ar');
        const channelCount = data.channels ? data.channels.length : 0;
        const clientId = data.syncInfo ? data.syncInfo.clientId : 'unknown';
        
        return `تحديث بيانات ANON TV - ${channelCount} قناة - ${clientId} - ${timestamp}`;
    }
    
    /**
     * الحصول على معرف العميل
     */
    getClientId() {
        let clientId = localStorage.getItem('anonTVClientId');
        if (!clientId) {
            clientId = 'client_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('anonTVClientId', clientId);
        }
        return clientId;
    }
    
    /**
     * الحصول على البيانات من localStorage
     */
    getData(key, defaultValue) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : defaultValue;
        } catch (error) {
            console.error(`❌ Error getting data for key ${key}:`, error);
            return defaultValue;
        }
    }
    
    /**
     * حفظ البيانات في localStorage
     */
    setData(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error(`❌ Error setting data for key ${key}:`, error);
        }
    }
    
    /**
     * تحديث واجهة حالة المزامنة
     */
    updateSyncStatusUI() {
        try {
            const statusElement = document.getElementById('syncStatusText');
            const timeElement = document.getElementById('lastSyncTime');
            const onlineIndicator = document.getElementById('onlineIndicator');
            
            if (statusElement) {
                if (this.syncStatus.isSyncing) {
                    statusElement.textContent = 'جاري المزامنة...';
                    statusElement.className = 'syncing';
                } else if (this.syncStatus.errorCount > 0) {
                    statusElement.textContent = `خطأ (${this.syncStatus.errorCount})`;
                    statusElement.className = 'error';
                } else {
                    statusElement.textContent = this.syncStatus.lastSync ? 'مكتملة' : 'لم يتم';
                    statusElement.className = this.syncStatus.lastSync ? 'success' : 'pending';
                }
            }
            
            if (timeElement) {
                timeElement.textContent = this.syncStatus.lastSync ? 
                    new Date(this.syncStatus.lastSync).toLocaleString('ar') : 'لم يتم';
            }
            
            if (onlineIndicator) {
                onlineIndicator.className = this.syncStatus.isOnline ? 'online' : 'offline';
                onlineIndicator.textContent = this.syncStatus.isOnline ? 'متصل' : 'غير متصل';
            }
            
        } catch (error) {
            console.error('❌ Error updating sync status UI:', error);
        }
    }
    
    /**
     * إظهار إشعار
     */
    notify(message, type = 'info') {
        try {
            if (window.app && window.app.notify) {
                window.app.notify(message, type);
            } else {
                console.log(`📢 ${type.toUpperCase()}: ${message}`);
            }
        } catch (error) {
            console.error('❌ Error showing notification:', error);
        }
    }
    
    /**
     * اختبار الاتصال
     */
    async testConnection() {
        try {
            const url = this.getDownloadURL();
            const headers = this.getHeaders();
            
            console.log('🔍 Testing connection...');
            
            const response = await fetch(url, { headers });
            
            if (response.ok) {
                console.log('✅ Connection test successful');
                this.notify('تم الاتصال بالمستودع بنجاح!', 'success');
                return true;
            } else {
                console.log(`❌ Connection test failed: ${response.status}`);
                this.notify(`فشل الاتصال: ${response.status}`, 'error');
                return false;
            }
            
        } catch (error) {
            console.error('❌ Connection test error:', error);
            this.notify(`خطأ في الاتصال: ${error.message}`, 'error');
            return false;
        }
    }
    
    /**
     * تحديث الإعدادات
     */
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        this.saveConfig();
        
        // إعادة تشغيل المزامنة التلقائية إذا تم تغيير الإعدادات
        if (newConfig.autoSync !== undefined || newConfig.enabled !== undefined) {
            this.stopAutoSync();
            if (this.config.enabled && this.config.autoSync) {
                this.startAutoSync();
            }
        }
        
        console.log('⚙️ Config updated:', this.config);
    }
    
    /**
     * الحصول على حالة المزامنة
     */
    getStatus() {
        return {
            ...this.syncStatus,
            config: this.config
        };
    }
}

// إنشاء مثيل عام للمدير
window.cloudSyncManager = new CloudSyncManager();

// تصدير للاستخدام في الوحدات الأخرى
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CloudSyncManager;
}
