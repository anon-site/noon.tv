/**
 * ملف التكوين الشامل لحل مشاكل CORS
 * يحتوي على جميع الحلول المتاحة للروابط الخارجية
 */

const CORS_CONFIG = {
    // إعدادات عامة
    settings: {
        autoDetect: true,
        fallbackEnabled: true,
        timeout: 15000,
        retryAttempts: 3,
        debugMode: false
    },

    // خدمات البروكسي المحلية
    localProxies: [
        {
            name: 'local-proxy',
            url: 'http://localhost:3001/proxy/',
            description: 'خادم البروكسي المحلي',
            enabled: true,
            priority: 1
        }
    ],

    // خدمات CORS الخارجية
    corsServices: [
        {
            name: 'cors-anywhere',
            url: 'https://cors-anywhere.herokuapp.com/',
            method: 'prepend',
            description: 'خدمة CORS مجانية ومفتوحة المصدر',
            enabled: true,
            priority: 2,
            reliability: 0.8
        },
        {
            name: 'allorigins',
            url: 'https://api.allorigins.win/raw?url=',
            method: 'prepend',
            description: 'خدمة CORS بديلة',
            enabled: true,
            priority: 3,
            reliability: 0.7
        },
        {
            name: 'corsproxy',
            url: 'https://corsproxy.io/?',
            method: 'prepend',
            description: 'خدمة CORS سريعة وموثوقة',
            enabled: true,
            priority: 4,
            reliability: 0.9
        },
        {
            name: 'thingproxy',
            url: 'https://thingproxy.freeboard.io/fetch/',
            method: 'prepend',
            description: 'خدمة بروكسي مجانية',
            enabled: true,
            priority: 5,
            reliability: 0.6
        }
    ],

    // خدمات IPTV متخصصة
    iptvServices: [
        {
            name: 'iptv-proxy',
            url: 'https://iptv-proxy.herokuapp.com/proxy/',
            method: 'prepend',
            description: 'خدمة بروكسي متخصصة للـ IPTV',
            enabled: true,
            priority: 1,
            reliability: 0.8
        },
        {
            name: 'stream-proxy',
            url: 'https://stream-proxy.vercel.app/api/proxy?url=',
            method: 'prepend',
            description: 'خدمة بروكسي للبث المباشر',
            enabled: true,
            priority: 2,
            reliability: 0.7
        }
    ],

    // قواعد التحويل
    conversionRules: [
        {
            pattern: /iptvcat\.com/,
            serviceType: 'cors',
            serviceName: 'cors-anywhere',
            description: 'روابط IPTV Cat'
        },
        {
            pattern: /\.m3u8$/,
            serviceType: 'iptv',
            serviceName: 'iptv-proxy',
            description: 'ملفات M3U8'
        },
        {
            pattern: /youtube\.com|youtu\.be/,
            serviceType: 'cors',
            serviceName: 'corsproxy',
            description: 'روابط يوتيوب'
        }
    ],

    // إعدادات التخزين المؤقت
    cache: {
        enabled: true,
        maxAge: 3600000, // ساعة واحدة
        maxSize: 100
    }
};

/**
 * مدير CORS شامل
 */
class ComprehensiveCORSManager {
    constructor(config = CORS_CONFIG) {
        this.config = config;
        this.cache = new Map();
        this.stats = {
            requests: 0,
            successes: 0,
            failures: 0,
            serviceUsage: {}
        };
    }

    /**
     * تحويل الرابط باستخدام أفضل خدمة متاحة
     * @param {string} originalUrl - الرابط الأصلي
     * @param {object} options - خيارات إضافية
     * @returns {Promise<string>} - الرابط المحول
     */
    async convertUrl(originalUrl, options = {}) {
        if (!originalUrl) return originalUrl;
        
        this.stats.requests++;
        
        // التحقق من التخزين المؤقت
        if (this.config.cache.enabled && this.cache.has(originalUrl)) {
            const cached = this.cache.get(originalUrl);
            if (Date.now() - cached.timestamp < this.config.cache.maxAge) {
                console.log('📦 استخدام الرابط من التخزين المؤقت');
                return cached.url;
            }
        }

        // إذا كان الرابط محلياً، لا نحتاج لتحويله
        if (this.isLocalUrl(originalUrl)) {
            return originalUrl;
        }

        // تحديد نوع الخدمة المناسبة
        const serviceType = this.determineServiceType(originalUrl, options);
        const services = this.getServicesByType(serviceType);
        
        // تجربة الخدمات بالترتيب
        for (const service of services) {
            if (!service.enabled) continue;
            
            try {
                const convertedUrl = this.convertWithService(originalUrl, service);
                const isValid = await this.validateUrl(convertedUrl);
                
                if (isValid) {
                    this.stats.successes++;
                    this.stats.serviceUsage[service.name] = (this.stats.serviceUsage[service.name] || 0) + 1;
                    
                    // حفظ في التخزين المؤقت
                    if (this.config.cache.enabled) {
                        this.cache.set(originalUrl, {
                            url: convertedUrl,
                            timestamp: Date.now()
                        });
                    }
                    
                    console.log(`✅ تم تحويل الرابط بنجاح باستخدام ${service.name}`);
                    return convertedUrl;
                }
            } catch (error) {
                console.warn(`⚠️ فشل في استخدام خدمة ${service.name}:`, error.message);
                continue;
            }
        }
        
        this.stats.failures++;
        console.error('❌ فشل في تحويل الرابط باستخدام جميع الخدمات');
        return originalUrl;
    }

    /**
     * تحديد نوع الخدمة المناسبة للرابط
     * @param {string} url - الرابط
     * @param {object} options - خيارات إضافية
     * @returns {string} - نوع الخدمة
     */
    determineServiceType(url, options = {}) {
        // استخدام نوع محدد في الخيارات
        if (options.serviceType) {
            return options.serviceType;
        }

        // تطبيق قواعد التحويل
        for (const rule of this.config.conversionRules) {
            if (rule.pattern.test(url)) {
                return rule.serviceType;
            }
        }

        // افتراضي
        return 'cors';
    }

    /**
     * الحصول على الخدمات حسب النوع
     * @param {string} serviceType - نوع الخدمة
     * @returns {array} - قائمة الخدمات مرتبة حسب الأولوية
     */
    getServicesByType(serviceType) {
        const services = this.config[`${serviceType}Services`] || this.config.corsServices;
        return services.sort((a, b) => a.priority - b.priority);
    }

    /**
     * تحويل الرابط باستخدام خدمة محددة
     * @param {string} originalUrl - الرابط الأصلي
     * @param {object} service - بيانات الخدمة
     * @returns {string} - الرابط المحول
     */
    convertWithService(originalUrl, service) {
        switch (service.method) {
            case 'prepend':
                return `${service.url}${originalUrl}`;
            case 'append':
                return `${originalUrl}${service.url}`;
            case 'wrap':
                return service.url.replace('{url}', originalUrl);
            default:
                return originalUrl;
        }
    }

    /**
     * التحقق من صحة الرابط
     * @param {string} url - الرابط للتحقق
     * @returns {Promise<boolean>}
     */
    async validateUrl(url) {
        try {
            const response = await fetch(url, {
                method: 'HEAD',
                timeout: this.config.settings.timeout
            });
            return response.ok;
        } catch (error) {
            return false;
        }
    }

    /**
     * التحقق من كون الرابط محلياً
     * @param {string} url - الرابط للتحقق
     * @returns {boolean}
     */
    isLocalUrl(url) {
        if (!url) return false;
        
        const localPatterns = [
            /^\/\//,
            /^https?:\/\/localhost/,
            /^https?:\/\/127\.0\.0\.1/,
            /^https?:\/\/192\.168\./,
            /^https?:\/\/10\./,
            /^https?:\/\/172\.(1[6-9]|2[0-9]|3[0-1])\./,
            /^\/[^\/]/,
            /^\.\//,
            /^\.\.\//
        ];

        return localPatterns.some(pattern => pattern.test(url));
    }

    /**
     * الحصول على إحصائيات الاستخدام
     * @returns {object}
     */
    getStats() {
        return {
            ...this.stats,
            successRate: this.stats.requests > 0 ? (this.stats.successes / this.stats.requests) * 100 : 0,
            cacheSize: this.cache.size
        };
    }

    /**
     * مسح التخزين المؤقت
     */
    clearCache() {
        this.cache.clear();
        console.log('🗑️ تم مسح التخزين المؤقت');
    }

    /**
     * تحديث إعدادات الخدمة
     * @param {string} serviceName - اسم الخدمة
     * @param {object} updates - التحديثات
     */
    updateService(serviceName, updates) {
        for (const serviceType of ['corsServices', 'iptvServices', 'localProxies']) {
            const services = this.config[serviceType];
            const service = services.find(s => s.name === serviceName);
            if (service) {
                Object.assign(service, updates);
                console.log(`🔄 تم تحديث خدمة ${serviceName}`);
                return;
            }
        }
        console.warn(`⚠️ لم يتم العثور على خدمة ${serviceName}`);
    }
}

// إنشاء مثيل عام للاستخدام
window.corsManager = new ComprehensiveCORSManager();

// دوال مساعدة للاستخدام السريع
window.convertUrlComprehensive = async function(url, options = {}) {
    return await window.corsManager.convertUrl(url, options);
};

window.getCORSStats = function() {
    return window.corsManager.getStats();
};

window.clearCORSCache = function() {
    window.corsManager.clearCache();
};

console.log('✅ تم تحميل مدير CORS الشامل بنجاح');
console.log('💡 استخدم: convertUrlComprehensive(url, options)');
console.log('💡 استخدم: getCORSStats() للحصول على الإحصائيات');
console.log('💡 استخدم: clearCORSCache() لمسح التخزين المؤقت');
