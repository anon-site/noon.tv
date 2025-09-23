/**
 * حلول CORS للروابط الخارجية
 * هذا الملف يحتوي على حلول مختلفة لحل مشكلة CORS مع GitHub Pages
 */

class CORSProxyManager {
    constructor() {
        this.proxyServices = [
            {
                name: 'cors-anywhere',
                url: 'https://cors-anywhere.herokuapp.com/',
                description: 'خدمة CORS مجانية ومفتوحة المصدر'
            },
            {
                name: 'allorigins',
                url: 'https://api.allorigins.win/raw?url=',
                description: 'خدمة CORS بديلة'
            },
            {
                name: 'corsproxy',
                url: 'https://corsproxy.io/?',
                description: 'خدمة CORS سريعة وموثوقة'
            },
            {
                name: 'thingproxy',
                url: 'https://thingproxy.freeboard.io/fetch/',
                description: 'خدمة بروكسي مجانية'
            }
        ];
        
        this.currentProxyIndex = 0;
        this.fallbackEnabled = true;
    }

    /**
     * تحويل الرابط لاستخدام خدمة CORS
     * @param {string} originalUrl - الرابط الأصلي
     * @param {string} proxyService - اسم خدمة البروكسي (اختياري)
     * @returns {string} - الرابط المحول
     */
    convertUrl(originalUrl, proxyService = null) {
        if (!originalUrl) return originalUrl;
        
        // إذا كان الرابط محلياً، لا نحتاج لتحويله
        if (this.isLocalUrl(originalUrl)) {
            return originalUrl;
        }

        // استخدام خدمة محددة أو التبديل التلقائي
        const service = proxyService ? 
            this.proxyServices.find(s => s.name === proxyService) : 
            this.proxyServices[this.currentProxyIndex];

        if (!service) {
            console.warn('⚠️ خدمة البروكسي غير موجودة، استخدام الرابط الأصلي');
            return originalUrl;
        }

        // تحويل الرابط حسب نوع الخدمة
        let convertedUrl;
        switch (service.name) {
            case 'cors-anywhere':
                convertedUrl = `${service.url}${originalUrl}`;
                break;
            case 'allorigins':
                convertedUrl = `${service.url}${encodeURIComponent(originalUrl)}`;
                break;
            case 'corsproxy':
                convertedUrl = `${service.url}${originalUrl}`;
                break;
            case 'thingproxy':
                convertedUrl = `${service.url}${originalUrl}`;
                break;
            default:
                convertedUrl = originalUrl;
        }

        console.log(`🔄 تحويل الرابط: ${originalUrl} -> ${convertedUrl}`);
        return convertedUrl;
    }

    /**
     * التحقق من كون الرابط محلياً
     * @param {string} url - الرابط للتحقق
     * @returns {boolean}
     */
    isLocalUrl(url) {
        if (!url) return false;
        
        const localPatterns = [
            /^\/\//,  // //example.com
            /^https?:\/\/localhost/,  // localhost
            /^https?:\/\/127\.0\.0\.1/,  // 127.0.0.1
            /^https?:\/\/192\.168\./,  // Local network
            /^https?:\/\/10\./,  // Local network
            /^https?:\/\/172\.(1[6-9]|2[0-9]|3[0-1])\./,  // Local network
            /^\/[^\/]/,  // Relative path
            /^\.\//,  // ./path
            /^\.\.\//  // ../path
        ];

        return localPatterns.some(pattern => pattern.test(url));
    }

    /**
     * تبديل إلى خدمة بروكسي أخرى
     */
    switchToNextProxy() {
        this.currentProxyIndex = (this.currentProxyIndex + 1) % this.proxyServices.length;
        console.log(`🔄 تبديل إلى خدمة البروكسي: ${this.proxyServices[this.currentProxyIndex].name}`);
    }

    /**
     * الحصول على معلومات الخدمة الحالية
     * @returns {object}
     */
    getCurrentProxyInfo() {
        return this.proxyServices[this.currentProxyIndex];
    }

    /**
     * الحصول على جميع خدمات البروكسي
     * @returns {array}
     */
    getAllProxyServices() {
        return this.proxyServices;
    }

    /**
     * اختبار خدمة البروكسي
     * @param {string} testUrl - رابط للاختبار
     * @param {string} proxyService - اسم خدمة البروكسي
     * @returns {Promise<boolean>}
     */
    async testProxyService(testUrl, proxyService) {
        try {
            const convertedUrl = this.convertUrl(testUrl, proxyService);
            const response = await fetch(convertedUrl, { 
                method: 'HEAD',
                timeout: 10000 
            });
            
            return response.ok;
        } catch (error) {
            console.error(`❌ فشل اختبار خدمة ${proxyService}:`, error.message);
            return false;
        }
    }

    /**
     * العثور على أفضل خدمة بروكسي تعمل
     * @param {string} testUrl - رابط للاختبار
     * @returns {Promise<string|null>}
     */
    async findWorkingProxy(testUrl) {
        for (const service of this.proxyServices) {
            console.log(`🔍 اختبار خدمة: ${service.name}`);
            const isWorking = await this.testProxyService(testUrl, service.name);
            
            if (isWorking) {
                console.log(`✅ خدمة ${service.name} تعمل بشكل صحيح`);
                return service.name;
            }
        }
        
        console.warn('⚠️ لا توجد خدمة بروكسي تعمل');
        return null;
    }
}

// إنشاء مثيل عام للاستخدام
window.corsProxyManager = new CORSProxyManager();

// دالة مساعدة للاستخدام السريع
window.convertToProxyUrl = function(originalUrl, proxyService = null) {
    return window.corsProxyManager.convertUrl(originalUrl, proxyService);
};

// دالة لاختبار جميع الخدمات
window.testAllProxies = async function(testUrl) {
    const results = {};
    
    for (const service of window.corsProxyManager.getAllProxyServices()) {
        console.log(`🔍 اختبار ${service.name}...`);
        const isWorking = await window.corsProxyManager.testProxyService(testUrl, service.name);
        results[service.name] = isWorking;
    }
    
    console.log('📊 نتائج اختبار الخدمات:', results);
    return results;
};

console.log('✅ تم تحميل مدير CORS Proxy بنجاح');
console.log('💡 استخدم: convertToProxyUrl(url) لتحويل الرابط');
console.log('💡 استخدم: testAllProxies(url) لاختبار جميع الخدمات');
