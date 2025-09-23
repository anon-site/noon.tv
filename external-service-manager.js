/**
 * حلول بديلة للروابط الخارجية
 * استخدام خدمات خارجية متخصصة لحل مشاكل CORS
 */

class ExternalServiceManager {
    constructor() {
        this.services = {
            // خدمات CORS العامة
            cors: [
                {
                    name: 'cors-anywhere',
                    url: 'https://cors-anywhere.herokuapp.com/',
                    method: 'prepend',
                    description: 'خدمة CORS مجانية ومفتوحة المصدر'
                },
                {
                    name: 'allorigins',
                    url: 'https://api.allorigins.win/raw?url=',
                    method: 'prepend',
                    description: 'خدمة CORS بديلة'
                },
                {
                    name: 'corsproxy',
                    url: 'https://corsproxy.io/?',
                    method: 'prepend',
                    description: 'خدمة CORS سريعة وموثوقة'
                }
            ],
            
            // خدمات IPTV متخصصة
            iptv: [
                {
                    name: 'iptv-proxy',
                    url: 'https://iptv-proxy.herokuapp.com/proxy/',
                    method: 'prepend',
                    description: 'خدمة بروكسي متخصصة للـ IPTV'
                },
                {
                    name: 'stream-proxy',
                    url: 'https://stream-proxy.vercel.app/api/proxy?url=',
                    method: 'prepend',
                    description: 'خدمة بروكسي للبث المباشر'
                }
            ],
            
            // خدمات تحويل الروابط
            converter: [
                {
                    name: 'url-converter',
                    url: 'https://url-converter-api.herokuapp.com/convert?url=',
                    method: 'prepend',
                    description: 'خدمة تحويل الروابط'
                }
            ]
        };
        
        this.currentService = 'cors-anywhere';
        this.serviceType = 'cors';
    }

    /**
     * تحويل الرابط باستخدام خدمة خارجية
     * @param {string} originalUrl - الرابط الأصلي
     * @param {string} serviceType - نوع الخدمة (cors, iptv, converter)
     * @param {string} serviceName - اسم الخدمة المحددة
     * @returns {string} - الرابط المحول
     */
    convertUrl(originalUrl, serviceType = 'cors', serviceName = null) {
        if (!originalUrl) return originalUrl;
        
        // إذا كان الرابط محلياً، لا نحتاج لتحويله
        if (this.isLocalUrl(originalUrl)) {
            return originalUrl;
        }

        const services = this.services[serviceType] || this.services.cors;
        const service = serviceName ? 
            services.find(s => s.name === serviceName) : 
            services[0];

        if (!service) {
            console.warn('⚠️ الخدمة غير موجودة، استخدام الرابط الأصلي');
            return originalUrl;
        }

        let convertedUrl;
        switch (service.method) {
            case 'prepend':
                convertedUrl = `${service.url}${originalUrl}`;
                break;
            case 'append':
                convertedUrl = `${originalUrl}${service.url}`;
                break;
            case 'wrap':
                convertedUrl = service.url.replace('{url}', originalUrl);
                break;
            default:
                convertedUrl = originalUrl;
        }

        console.log(`🔄 تحويل الرابط باستخدام ${service.name}: ${originalUrl} -> ${convertedUrl}`);
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
     * اختبار خدمة خارجية
     * @param {string} testUrl - رابط للاختبار
     * @param {string} serviceType - نوع الخدمة
     * @param {string} serviceName - اسم الخدمة
     * @returns {Promise<object>}
     */
    async testService(testUrl, serviceType = 'cors', serviceName = null) {
        const services = this.services[serviceType] || this.services.cors;
        const service = serviceName ? 
            services.find(s => s.name === serviceName) : 
            services[0];

        if (!service) {
            return { success: false, error: 'Service not found' };
        }

        try {
            const convertedUrl = this.convertUrl(testUrl, serviceType, serviceName);
            const startTime = Date.now();
            
            const response = await fetch(convertedUrl, { 
                method: 'HEAD',
                timeout: 15000 
            });
            
            const endTime = Date.now();
            const responseTime = endTime - startTime;
            
            return {
                success: response.ok,
                status: response.status,
                responseTime: responseTime,
                service: service.name,
                convertedUrl: convertedUrl
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                service: service.name
            };
        }
    }

    /**
     * العثور على أفضل خدمة تعمل
     * @param {string} testUrl - رابط للاختبار
     * @param {string} serviceType - نوع الخدمة
     * @returns {Promise<object|null>}
     */
    async findBestService(testUrl, serviceType = 'cors') {
        const services = this.services[serviceType] || this.services.cors;
        const results = [];

        for (const service of services) {
            console.log(`🔍 اختبار خدمة: ${service.name}`);
            const result = await this.testService(testUrl, serviceType, service.name);
            results.push(result);
            
            if (result.success) {
                console.log(`✅ خدمة ${service.name} تعمل بشكل صحيح (${result.responseTime}ms)`);
                return {
                    service: service,
                    result: result
                };
            }
        }
        
        console.warn('⚠️ لا توجد خدمة تعمل بشكل صحيح');
        return null;
    }

    /**
     * الحصول على جميع الخدمات المتاحة
     * @returns {object}
     */
    getAllServices() {
        return this.services;
    }

    /**
     * الحصول على خدمات نوع محدد
     * @param {string} serviceType - نوع الخدمة
     * @returns {array}
     */
    getServicesByType(serviceType) {
        return this.services[serviceType] || [];
    }

    /**
     * إضافة خدمة جديدة
     * @param {string} serviceType - نوع الخدمة
     * @param {object} service - بيانات الخدمة
     */
    addService(serviceType, service) {
        if (!this.services[serviceType]) {
            this.services[serviceType] = [];
        }
        this.services[serviceType].push(service);
    }

    /**
     * تحويل جميع الروابط في قائمة القنوات
     * @param {array} channels - قائمة القنوات
     * @param {string} serviceType - نوع الخدمة
     * @param {string} serviceName - اسم الخدمة
     * @returns {array} - قائمة القنوات مع الروابط المحولة
     */
    convertChannelsUrls(channels, serviceType = 'cors', serviceName = null) {
        if (!Array.isArray(channels)) return channels;
        
        return channels.map(channel => {
            if (channel.url) {
                return {
                    ...channel,
                    url: this.convertUrl(channel.url, serviceType, serviceName),
                    originalUrl: channel.url
                };
            }
            return channel;
        });
    }
}

// إنشاء مثيل عام للاستخدام
window.externalServiceManager = new ExternalServiceManager();

// دوال مساعدة للاستخدام السريع
window.convertUrlWithService = function(url, serviceType = 'cors', serviceName = null) {
    return window.externalServiceManager.convertUrl(url, serviceType, serviceName);
};

window.testAllServices = async function(testUrl, serviceType = 'cors') {
    const results = [];
    const services = window.externalServiceManager.getServicesByType(serviceType);
    
    for (const service of services) {
        console.log(`🔍 اختبار ${service.name}...`);
        const result = await window.externalServiceManager.testService(testUrl, serviceType, service.name);
        results.push({ service: service.name, ...result });
    }
    
    console.log('📊 نتائج اختبار الخدمات:', results);
    return results;
};

window.findBestServiceForUrl = async function(testUrl, serviceType = 'cors') {
    return await window.externalServiceManager.findBestService(testUrl, serviceType);
};

console.log('✅ تم تحميل مدير الخدمات الخارجية بنجاح');
console.log('💡 استخدم: convertUrlWithService(url, serviceType, serviceName)');
console.log('💡 استخدم: testAllServices(url, serviceType)');
console.log('💡 استخدم: findBestServiceForUrl(url, serviceType)');
