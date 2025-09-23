# تعليمات سريعة لحل مشكلة CORS

## المشكلة
روابط `iptvcat.com` لا تعمل على GitHub Pages بسبب CORS

## الحل السريع

### 1. للتطوير المحلي:
```bash
# تثبيت وتشغيل خادم البروكسي
npm install
npm start
```

### 2. للإنتاج (GitHub Pages):
أضف هذا الكود إلى `index.html` قبل `</body>`:

```html
<script src="comprehensive-cors-manager.js"></script>
<script>
// تحويل جميع الروابط تلقائياً
document.addEventListener('DOMContentLoaded', async function() {
    // تحويل روابط القنوات
    const videoElements = document.querySelectorAll('video source');
    for (const source of videoElements) {
        if (source.src && !source.src.startsWith('http://localhost')) {
            source.src = await convertUrlComprehensive(source.src);
        }
    }
    
    // تحويل روابط الصور
    const imgElements = document.querySelectorAll('img');
    for (const img of imgElements) {
        if (img.src && img.src.includes('iptvcat.com')) {
            img.src = await convertUrlComprehensive(img.src);
        }
    }
});
</script>
```

### 3. تعديل script.js:
استبدل:
```javascript
const response = await fetch('channels.json');
```

بـ:
```javascript
const response = await fetch(await convertUrlComprehensive('channels.json'));
```

## اختبار الحل:
```javascript
// في وحدة التحكم
const testUrl = 'https://list.iptvcat.com/my_list/s/f3290311a06f133de0427abfcbc979b2.m3u8';
const convertedUrl = await convertUrlComprehensive(testUrl);
console.log('الرابط المحول:', convertedUrl);
```

## إذا لم يعمل:
1. جرب خدمة أخرى: `convertUrlComprehensive(url, {serviceType: 'iptv'})`
2. تحقق من الإحصائيات: `getCORSStats()`
3. مسح التخزين المؤقت: `clearCORSCache()`
