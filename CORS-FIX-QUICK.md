# حل سريع لمشكلة CORS ⚡

## المشكلة
```
❌ الرابط https://shls-live-enc.edgenextcdn.net/...
✅ يعمل على localhost
❌ لا يعمل على GitHub Pages حتى مع VPN
```

## السبب
**CORS (Cross-Origin Resource Sharing)** - السيرفر `edgenextcdn.net` لا يسمح بالوصول من نطاقات مختلفة.

---

## الحل الموصى به (5 دقائق) 🎯

### الخطوة 1: إنشاء CloudFlare Worker

1. اذهب إلى: **https://dash.cloudflare.com/sign-up** (مجاني)
2. اضغط: **Workers & Pages** → **Create Worker**
3. احذف الكود الموجود
4. انسخ كود من ملف `cloudflare-worker.js`
5. الصقه في المحرر
6. اضغط **Deploy**
7. **انسخ الرابط** (مثال: `https://my-proxy.username.workers.dev`)

### الخطوة 2: تعديل الكود

افتح `script.js` وأضف في **بداية الملف** (بعد `class ArabicTVApp {`):

```javascript
// CORS Proxy Configuration - أضف رابط الـ Worker الخاص بك
const CORS_PROXY = 'https://YOUR-WORKER-NAME.YOUR-SUBDOMAIN.workers.dev';

// دالة مساعدة
function getCORSProxiedUrl(url) {
  // فقط للروابط من edgenextcdn.net
  if (url.includes('edgenextcdn.net')) {
    return `${CORS_PROXY}/?url=${encodeURIComponent(url)}`;
  }
  return url;
}
```

### الخطوة 3: تعديل دالة loadShlsVideo

ابحث عن السطر (تقريباً سطر **2428**):
```javascript
this.hls.loadSource(streamUrl);
```

**غيّره إلى:**
```javascript
const proxiedUrl = getCORSProxiedUrl(streamUrl);
console.log('🔄 Using CORS Proxy:', proxiedUrl);
this.hls.loadSource(proxiedUrl);
```

### الخطوة 4: الاختبار

افتح **Console** في المتصفح (F12) واكتب:

```javascript
// استبدل YOUR-WORKER بالرابط الخاص بك
fetch('https://YOUR-WORKER.workers.dev/?url=https://shls-live-enc.edgenextcdn.net/out/v1/f6d718e841f8442f8374de47f18c93a7/index_1.m3u8')
  .then(r => r.text())
  .then(data => console.log('✅ نجح!', data.substring(0, 100)))
  .catch(e => console.error('❌ فشل:', e));
```

إذا ظهر `✅ نجح!` مع محتوى M3U8 → **تم بنجاح!** 🎉

### الخطوة 5: Deploy

```powershell
# Commit التغييرات
git add .
git commit -m "Fix: Add CORS proxy for SHLS streams"
git push origin main

# انتظر دقيقة واختبر على GitHub Pages
```

---

## اختبار سريع على localhost

```powershell
# في PowerShell، شغل سيرفر محلي
python -m http.server 8000

# افتح في المتصفح
Start-Process "http://localhost:8000"

# جرب تشغيل قناة من نوع SHLS
# يجب أن تعمل بنفس الطريقة على localhost و GitHub Pages
```

---

## التحقق من أن Worker يعمل

### في CloudFlare Dashboard:

1. اذهب لـ **Workers & Pages**
2. اضغط على الـ Worker الخاص بك
3. تحقق من **Metrics** → يجب أن ترى **Requests**

### في المتصفح:

افتح الرابط مباشرة:
```
https://YOUR-WORKER.workers.dev/?url=https://shls-live-enc.edgenextcdn.net/out/v1/f6d718e841f8442f8374de47f18c93a7/index_1.m3u8
```

يجب أن يظهر لك محتوى M3U8:
```
#EXTM3U
#EXT-X-VERSION:3
#EXT-X-TARGETDURATION:6
...
```

---

## الأسئلة الشائعة

### ❓ كم يكلف؟
**مجاني 100%** - CloudFlare يعطيك 100,000 طلب يومياً مجاناً.

### ❓ هل سيبطئ البث؟
**لا** - CloudFlare لديها CDN عالمي سريع جداً، قد يكون أسرع من الوصول المباشر!

### ❓ ماذا لو لم يعمل؟
تحقق من:
1. ✅ رابط Worker صحيح (انتهى بـ `.workers.dev`)
2. ✅ Worker تم Deploy بنجاح
3. ✅ استبدلت `YOUR-WORKER` برابطك الحقيقي
4. ✅ الكود في `script.js` تم حفظه

### ❓ هل يمكن استخدام حل آخر؟
نعم، انظر `CORS-SOLUTION.md` لحلول أخرى (PHP, Netlify, etc.)

---

## ملخص

```
✅ قبل: localhost يعمل، GitHub Pages لا يعمل
✅ بعد: localhost و GitHub Pages يعملان معاً
✅ التكلفة: $0 (مجاني)
✅ الوقت: 5 دقائق
✅ السرعة: سريع جداً (CDN عالمي)
```

---

## الدعم

للمزيد من التفاصيل:
- 📖 **CORS-SOLUTION.md** - دليل شامل
- 📖 **WARP.md** - توثيق كامل للمشروع
- 🐙 **cloudflare-worker.js** - كود الـ Worker
- 🐘 **cors-proxy.php** - بديل PHP

**النتيجة:** روابط SHLS تعمل على GitHub Pages تماماً كما تعمل على localhost! 🎉
