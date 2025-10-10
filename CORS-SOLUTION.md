# حل مشكلة CORS مع SHLS Streams

## المشكلة

الروابط من نوع `https://shls-live-enc.edgenextcdn.net/...` تعمل بشكل طبيعي على localhost ولكن **لا تعمل على GitHub Pages** بسبب CORS (Cross-Origin Resource Sharing).

### لماذا تحدث المشكلة؟

1. **localhost أقل صرامة**: المتصفحات تسمح بطلبات CORS على localhost
2. **GitHub Pages (HTTPS)**: عندما يكون موقعك على `https://username.github.io`، السيرفر `shls-live-enc.edgenextcdn.net` يرفض الطلبات من نطاق مختلف
3. **قيود الأمان**: المتصفح يمنع JavaScript من قراءة محتوى من نطاق مختلف

## الحلول المتاحة

### ✅ الحل 1: CloudFlare Worker (الأفضل - مجاني وسريع)

**المميزات:**
- مجاني 100,000 طلب يومياً
- سريع جداً (CDN عالمي)
- موثوق وآمن
- لا يحتاج استضافة خاصة

**خطوات التثبيت:**

1. **إنشاء حساب CloudFlare** (إذا لم يكن لديك):
   - اذهب إلى: https://dash.cloudflare.com/sign-up
   - سجل حساب مجاني

2. **إنشاء Worker جديد**:
   - اذهب إلى: https://dash.cloudflare.com/ → Workers & Pages
   - اضغط "Create Worker"
   - احذف الكود الافتراضي

3. **نسخ كود الـ Worker**:
   - افتح ملف `cloudflare-worker.js`
   - انسخ المحتوى كاملاً
   - الصقه في CloudFlare Worker Editor

4. **Deploy & Test**:
   - اضغط "Deploy"
   - انسخ رابط الـ Worker (مثال: `https://my-cors-proxy.username.workers.dev`)

5. **تعديل كود التطبيق**:
   ```javascript
   // في script.js، ابحث عن دالة loadShlsVideo أو loadShlsVideoForGitHub
   // أضف رابط الـ Worker الخاص بك:
   
   const CLOUDFLARE_WORKER = 'https://my-cors-proxy.username.workers.dev';
   
   // استخدمه لتحويل الرابط:
   const proxiedUrl = `${CLOUDFLARE_WORKER}/?url=${encodeURIComponent(streamUrl)}`;
   ```

6. **اختبار**:
   ```javascript
   // اختبر الرابط في Console:
   fetch('https://my-cors-proxy.username.workers.dev/?url=https://shls-live-enc.edgenextcdn.net/out/v1/f6d718e841f8442f8374de47f18c93a7/index_1.m3u8')
     .then(r => r.text())
     .then(console.log)
   ```

---

### ✅ الحل 2: استضافة PHP (إذا كان لديك سيرفر)

**المميزات:**
- تحكم كامل
- بدون حدود على الطلبات
- خصوصية أفضل

**متطلبات:**
- سيرفر يدعم PHP (مثل: Hostinger, 000webhost, InfinityFree)

**خطوات التثبيت:**

1. **رفع ملف PHP**:
   - ارفع ملف `cors-proxy.php` إلى سيرفرك
   - مثال: `https://yourdomain.com/cors-proxy.php`

2. **اختبار**:
   ```bash
   # في PowerShell:
   curl "https://yourdomain.com/cors-proxy.php?url=https://shls-live-enc.edgenextcdn.net/out/v1/f6d718e841f8442f8374de47f18c93a7/index_1.m3u8"
   ```

3. **تعديل كود التطبيق**:
   ```javascript
   const PHP_PROXY = 'https://yourdomain.com/cors-proxy.php';
   const proxiedUrl = `${PHP_PROXY}?url=${encodeURIComponent(streamUrl)}`;
   ```

---

### ✅ الحل 3: Netlify Function (بديل لـ CloudFlare)

**المميزات:**
- مجاني 125,000 طلب شهرياً
- يدعم Serverless Functions

**خطوات التثبيت:**

1. **إنشاء مجلد functions**:
   ```bash
   mkdir netlify/functions
   ```

2. **إنشاء ملف `cors-proxy.js`**:
   ```javascript
   exports.handler = async (event) => {
     const url = event.queryStringParameters.url;
     
     if (!url) {
       return {
         statusCode: 400,
         body: JSON.stringify({ error: 'Missing url parameter' })
       };
     }
     
     try {
       const response = await fetch(url, {
         headers: {
           'Accept': 'application/vnd.apple.mpegurl, */*',
           'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
         }
       });
       
       const content = await response.text();
       
       return {
         statusCode: 200,
         headers: {
           'Access-Control-Allow-Origin': '*',
           'Content-Type': 'application/vnd.apple.mpegurl'
         },
         body: content
       };
     } catch (error) {
       return {
         statusCode: 500,
         body: JSON.stringify({ error: error.message })
       };
     }
   };
   ```

3. **Deploy على Netlify**:
   ```bash
   # إذا كنت تستخدم Netlify CLI:
   netlify deploy --prod
   ```

---

### ⚠️ الحل 4: استخدام Proxy عام (غير موصى به)

**Proxies المجانية المتاحة:**
```javascript
const PUBLIC_PROXIES = [
  'https://api.allorigins.win/raw?url=',
  'https://corsproxy.io/?',
  'https://proxy.cors.sh/',
];
```

**المشاكل:**
- غير موثوقة (قد تتوقف)
- بطيئة
- محدودة
- مشاكل أمنية محتملة

**الاستخدام** (فقط للاختبار):
```javascript
const streamUrl = 'https://shls-live-enc.edgenextcdn.net/out/v1/.../index_1.m3u8';
const proxiedUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(streamUrl)}`;
```

---

## التطبيق في الكود الحالي

### خيار 1: تعديل `script.js` لاستخدام CloudFlare Worker

```javascript
// أضف في بداية ملف script.js (بعد class ArabicTVApp)

// CORS Proxy Configuration
const CORS_PROXY_CONFIG = {
  enabled: true,
  provider: 'cloudflare', // 'cloudflare', 'php', 'netlify'
  cloudflare: 'https://YOUR-WORKER.YOUR-SUBDOMAIN.workers.dev',
  php: 'https://yourdomain.com/cors-proxy.php',
  netlify: 'https://yoursite.netlify.app/.netlify/functions/cors-proxy'
};

// دالة مساعدة للحصول على رابط Proxy
function getCORSProxiedUrl(url) {
  if (!CORS_PROXY_CONFIG.enabled) {
    return url;
  }
  
  const proxy = CORS_PROXY_CONFIG[CORS_PROXY_CONFIG.provider];
  if (!proxy) {
    console.error('CORS proxy not configured');
    return url;
  }
  
  // CloudFlare & Netlify use ?url= parameter
  if (CORS_PROXY_CONFIG.provider === 'cloudflare' || 
      CORS_PROXY_CONFIG.provider === 'netlify') {
    return `${proxy}?url=${encodeURIComponent(url)}`;
  }
  
  // PHP uses ?url= parameter
  if (CORS_PROXY_CONFIG.provider === 'php') {
    return `${proxy}?url=${encodeURIComponent(url)}`;
  }
  
  return url;
}
```

### خيار 2: تعديل دالة `loadShlsVideo`

```javascript
// في دالة loadShlsVideo (حوالي سطر 2244)

async loadShlsVideo(url) {
  // ... existing code ...
  
  // استخدام CORS Proxy
  const proxiedUrl = getCORSProxiedUrl(url);
  console.log('🔄 استخدام CORS Proxy:', proxiedUrl);
  
  // استخدم proxiedUrl بدلاً من url
  this.hls.loadSource(proxiedUrl);
  
  // ... rest of code ...
}
```

---

## الاختبار

### اختبار من Console

```javascript
// افتح Console في المتصفح (F12)

// 1. اختبار CloudFlare Worker
fetch('https://YOUR-WORKER.workers.dev/?url=https://shls-live-enc.edgenextcdn.net/out/v1/f6d718e841f8442f8374de47f18c93a7/index_1.m3u8')
  .then(r => r.text())
  .then(data => {
    console.log('✅ نجح:', data.substring(0, 200));
  })
  .catch(e => {
    console.error('❌ فشل:', e);
  });

// 2. اختبار الرابط الأصلي (سيفشل على GitHub Pages)
fetch('https://shls-live-enc.edgenextcdn.net/out/v1/f6d718e841f8442f8374de47f18c93a7/index_1.m3u8')
  .then(r => r.text())
  .then(data => {
    console.log('✅ نجح بدون proxy:', data.substring(0, 200));
  })
  .catch(e => {
    console.error('❌ CORS Error (متوقع):', e);
  });
```

---

## الأمان

### ⚠️ ملاحظات أمنية مهمة:

1. **تحديد Hosts المسموحة**: في `cloudflare-worker.js` و `cors-proxy.php`، تم تحديد فقط `edgenextcdn.net` لمنع إساءة الاستخدام

2. **Rate Limiting**: CloudFlare Worker يطبق حدود تلقائية (100K طلب/يوم مجاناً)

3. **لا تشارك رابط الـ Proxy**: احتفظ برابط الـ Worker/PHP خاصاً

4. **مراقبة الاستخدام**: راقب logs في CloudFlare Dashboard

---

## الأسئلة الشائعة

### ❓ لماذا يعمل على localhost ولا يعمل على GitHub Pages؟

المتصفحات أقل صرامة مع localhost. عند الرفع على HTTPS (GitHub Pages)، قيود CORS تصبح فعالة.

### ❓ هل يمكن حل المشكلة بدون proxy؟

لا، إلا إذا كان السيرفر `edgenextcdn.net` يضيف header `Access-Control-Allow-Origin: *` (وهو لا يفعل).

### ❓ ما هو أفضل حل؟

**CloudFlare Worker** هو الأفضل للأسباب التالية:
- مجاني (100K طلب/يوم)
- سريع جداً (CDN)
- موثوق
- سهل الإعداد

### ❓ هل يعمل مع VPN؟

نعم، لكن الـ Proxy نفسه يجب أن يدعم الوصول للرابط. إذا كان الرابط محظور جغرافياً، استخدم VPN على السيرفر/Worker.

---

## التوثيق الإضافي

- [CloudFlare Workers Docs](https://developers.cloudflare.com/workers/)
- [MDN: CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [HLS.js Configuration](https://github.com/video-dev/hls.js/blob/master/docs/API.md)

---

## الخلاصة

1. ✅ **استخدم CloudFlare Worker** (الحل الموصى به)
2. ✅ ارفع `cloudflare-worker.js` على CloudFlare
3. ✅ عدّل `CORS_PROXY_CONFIG` في `script.js`
4. ✅ اختبر من Console
5. ✅ Deploy على GitHub Pages

**بعد التطبيق، الروابط من `shls-live-enc.edgenextcdn.net` ستعمل على GitHub Pages بنفس جودة localhost!**
