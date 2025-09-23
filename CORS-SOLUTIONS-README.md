# حلول مشاكل CORS للروابط الخارجية

هذا المجلد يحتوي على حلول شاملة لحل مشكلة CORS مع الروابط الخارجية مثل `iptvcat.com` عند استخدام GitHub Pages.

## المشكلة

عند تشغيل الموقع على GitHub Pages، لا تعمل الروابط الخارجية مثل:
- `https://list.iptvcat.com/my_list/s/f3290311a06f133de0427abfcbc979b2.m3u8`

السبب: GitHub Pages لا يدعم CORS للروابط الخارجية، بينما تعمل محلياً لأن المتصفح يمكنه الوصول إليها مباشرة.

## الحلول المتاحة

### 1. خادم البروكسي المحلي (الأفضل للتطوير)

**الملفات:**
- `proxy-server.js` - خادم البروكسي
- `package.json` - تبعيات المشروع

**التثبيت والتشغيل:**
```bash
# تثبيت التبعيات
npm install

# تشغيل الخادم
npm start

# أو للتطوير مع إعادة التشغيل التلقائي
npm run dev
```

**الاستخدام:**
```javascript
// تحويل الرابط
const originalUrl = 'https://list.iptvcat.com/my_list/s/f3290311a06f133de0427abfcbc979b2.m3u8';
const proxyUrl = `http://localhost:3001/proxy/${originalUrl}`;

// استخدام الرابط المحول
videoElement.src = proxyUrl;
```

**المميزات:**
- ✅ سريع وموثوق
- ✅ تحكم كامل
- ✅ لا يعتمد على خدمات خارجية
- ✅ مناسب للتطوير والاختبار

**العيوب:**
- ❌ يتطلب تشغيل خادم محلي
- ❌ لا يعمل في الإنتاج بدون خادم

### 2. خدمات CORS الخارجية

**الملفات:**
- `cors-proxy-manager.js` - مدير خدمات CORS
- `external-service-manager.js` - مدير الخدمات الخارجية

**الاستخدام:**
```javascript
// تحميل الملف
<script src="cors-proxy-manager.js"></script>

// تحويل الرابط
const originalUrl = 'https://list.iptvcat.com/my_list/s/f3290311a06f133de0427abfcbc979b2.m3u8';
const proxyUrl = convertToProxyUrl(originalUrl);

// استخدام الرابط المحول
videoElement.src = proxyUrl;
```

**الخدمات المتاحة:**
- `cors-anywhere` - خدمة CORS مجانية
- `allorigins` - خدمة CORS بديلة
- `corsproxy` - خدمة CORS سريعة
- `thingproxy` - خدمة بروكسي مجانية

**المميزات:**
- ✅ لا يتطلب خادم محلي
- ✅ يعمل في الإنتاج
- ✅ متعدد الخدمات للتبديل التلقائي

**العيوب:**
- ❌ يعتمد على خدمات خارجية
- ❌ قد تكون بطيئة أو غير متاحة
- ❌ قيود على الاستخدام

### 3. الحل الشامل

**الملفات:**
- `comprehensive-cors-manager.js` - مدير CORS شامل

**الاستخدام:**
```javascript
// تحميل الملف
<script src="comprehensive-cors-manager.js"></script>

// تحويل الرابط مع خيارات متقدمة
const originalUrl = 'https://list.iptvcat.com/my_list/s/f3290311a06f133de0427abfcbc979b2.m3u8';
const proxyUrl = await convertUrlComprehensive(originalUrl, {
    serviceType: 'cors', // أو 'iptv'
    timeout: 10000
});

// استخدام الرابط المحول
videoElement.src = proxyUrl;
```

**المميزات:**
- ✅ يجمع جميع الحلول
- ✅ تبديل تلقائي بين الخدمات
- ✅ تخزين مؤقت للأداء
- ✅ إحصائيات الاستخدام
- ✅ قواعد تحويل ذكية

## التكامل مع الموقع الحالي

### الطريقة الأولى: تعديل بسيط

```javascript
// في script.js، استبدل هذا:
const response = await fetch('channels.json');

// بهذا:
const response = await fetch(await convertUrlComprehensive('channels.json'));
```

### الطريقة الثانية: تعديل شامل

```javascript
// إضافة في بداية script.js
<script src="comprehensive-cors-manager.js"></script>

// تعديل دالة تحميل القنوات
async function loadChannels() {
    try {
        const channelsUrl = await convertUrlComprehensive('channels.json');
        const response = await fetch(channelsUrl);
        const data = await response.json();
        
        // تحويل روابط القنوات
        data.channels = await Promise.all(
            data.channels.map(async (channel) => ({
                ...channel,
                url: await convertUrlComprehensive(channel.url)
            }))
        );
        
        return data;
    } catch (error) {
        console.error('خطأ في تحميل القنوات:', error);
        return { channels: [] };
    }
}
```

## التوصيات

### للتطوير المحلي:
1. استخدم **خادم البروكسي المحلي** (`proxy-server.js`)
2. شغل الخادم على `http://localhost:3001`
3. استخدم الروابط المحولة في التطبيق

### للإنتاج (GitHub Pages):
1. استخدم **الحل الشامل** (`comprehensive-cors-manager.js`)
2. أضف الملف إلى موقعك
3. استخدم `convertUrlComprehensive()` لتحويل الروابط

### للاستخدام المختلط:
1. استخدم **الحل الشامل** مع إعدادات ذكية
2. جرب الخادم المحلي أولاً
3. انتقل للخدمات الخارجية إذا فشل المحلي

## استكشاف الأخطاء

### مشاكل شائعة:

1. **الخدمة الخارجية لا تعمل:**
   ```javascript
   // اختبار جميع الخدمات
   const results = await testAllServices('https://example.com');
   console.log(results);
   ```

2. **الرابط لا يزال لا يعمل:**
   ```javascript
   // التحقق من الإحصائيات
   const stats = getCORSStats();
   console.log(stats);
   ```

3. **مشاكل الأداء:**
   ```javascript
   // مسح التخزين المؤقت
   clearCORSCache();
   ```

## الدعم

إذا واجهت مشاكل:
1. تحقق من وحدة التحكم للأخطاء
2. استخدم `getCORSStats()` لمراجعة الإحصائيات
3. جرب خدمات مختلفة باستخدام `testAllServices()`

## الترخيص

جميع الحلول متاحة تحت رخصة MIT ويمكن استخدامها بحرية.
