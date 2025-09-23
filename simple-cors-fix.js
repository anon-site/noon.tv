/**
 * ملف التكوين البسيط لحل مشاكل CORS
 * يمكن استخدامه مباشرة في الموقع
 */

// إعدادات CORS
const CORS_SETTINGS = {
    // الخدمات المتاحة
    services: [
        'https://cors-anywhere.herokuapp.com/',
        'https://api.allorigins.win/raw?url=',
        'https://corsproxy.io/?',
        'https://thingproxy.freeboard.io/fetch/'
    ],
    
    // الخدمة الحالية
    currentService: 0,
    
    // إعدادات عامة
    timeout: 10000,
    retryAttempts: 3
};

/**
 * دالة بسيطة لتحويل الروابط
 * @param {string} url - الرابط الأصلي
 * @returns {string} - الرابط المحول
 */
function convertUrl(url) {
    if (!url) return url;
    
    // إذا كان الرابط محلياً، لا نحتاج لتحويله
    if (isLocalUrl(url)) {
        return url;
    }
    
    // استخدام الخدمة الحالية
    const service = CORS_SETTINGS.services[CORS_SETTINGS.currentService];
    return `${service}${url}`;
}

/**
 * دالة للتبديل إلى خدمة أخرى
 */
function switchService() {
    CORS_SETTINGS.currentService = (CORS_SETTINGS.currentService + 1) % CORS_SETTINGS.services.length;
    console.log(`🔄 تبديل إلى خدمة: ${CORS_SETTINGS.services[CORS_SETTINGS.currentService]}`);
}

/**
 * دالة للتحقق من كون الرابط محلياً
 * @param {string} url - الرابط للتحقق
 * @returns {boolean}
 */
function isLocalUrl(url) {
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
 * دالة لاختبار الرابط
 * @param {string} url - الرابط للاختبار
 * @returns {Promise<boolean>}
 */
async function testUrl(url) {
    try {
        const response = await fetch(url, {
            method: 'HEAD',
            timeout: CORS_SETTINGS.timeout
        });
        return response.ok;
    } catch (error) {
        return false;
    }
}

/**
 * دالة للعثور على أفضل خدمة تعمل
 * @param {string} testUrl - رابط للاختبار
 * @returns {Promise<string|null>}
 */
async function findWorkingService(testUrl) {
    for (let i = 0; i < CORS_SETTINGS.services.length; i++) {
        const service = CORS_SETTINGS.services[i];
        const convertedUrl = `${service}${testUrl}`;
        
        console.log(`🔍 اختبار خدمة ${i + 1}: ${service}`);
        const isWorking = await testUrl(convertedUrl);
        
        if (isWorking) {
            console.log(`✅ الخدمة ${i + 1} تعمل بشكل صحيح`);
            CORS_SETTINGS.currentService = i;
            return service;
        }
    }
    
    console.warn('⚠️ لا توجد خدمة تعمل بشكل صحيح');
    return null;
}

// تصدير الدوال للاستخدام العام
window.convertUrl = convertUrl;
window.switchService = switchService;
window.findWorkingService = findWorkingService;
window.testUrl = testUrl;

// رسالة تأكيد
console.log('✅ تم تحميل مدير CORS البسيط بنجاح');
console.log('💡 استخدم: convertUrl(url) لتحويل الرابط');
console.log('💡 استخدم: switchService() للتبديل بين الخدمات');
console.log('💡 استخدم: findWorkingService(url) للعثور على أفضل خدمة');

// اختبار تلقائي عند التحميل
document.addEventListener('DOMContentLoaded', async function() {
    const testUrl = 'https://list.iptvcat.com/my_list/s/f3290311a06f133de0427abfcbc979b2.m3u8';
    console.log('🔍 اختبار تلقائي للخدمات...');
    await findWorkingService(testUrl);
});
