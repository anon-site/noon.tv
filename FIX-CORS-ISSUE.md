# حل مشكلة عدم عمل القنوات على GitHub Pages

## 🔴 المشكلة
القناة تعمل محلياً (على الكمبيوتر) لكنها لا تعمل عند نشرها على GitHub Pages.

## 🔍 السبب
المشكلة هي **CORS (Cross-Origin Resource Sharing)** - السيرفر الذي يستضيف القناة (edgenextcdn.net) لا يسمح بالوصول له من نطاقات أخرى مثل GitHub Pages.

## ✅ الحل الموصى به: استخدام Cloudflare Worker

### الخطوات:

#### 1️⃣ إنشاء Cloudflare Worker (مجاني)

1. اذهب إلى: https://dash.cloudflare.com/
2. إذا لم يكن لديك حساب، قم بإنشاء حساب مجاني
3. من القائمة الجانبية اختر **Workers & Pages**
4. اضغط على **Create Application**
5. اختر **Create Worker**
6. احذف الكود الموجود وانسخ محتوى ملف `cloudflare-worker.js`
7. اضغط **Deploy**
8. انسخ رابط الـ Worker الخاص بك (مثل: `https://your-worker.your-subdomain.workers.dev`)

#### 2️⃣ تحديث الكود في المشروع

افتح ملف `script.js` وابحث عن السطر:

```javascript
const CLOUDFLARE_WORKER_URL = 'https://your-worker.workers.dev'; // غيّر هذا الرابط!
```

واستبدل `https://your-worker.workers.dev` برابط الـ Worker الخاص بك.

#### 3️⃣ رفع التحديثات إلى GitHub

```bash
git add script.js
git commit -m "Fix CORS issue with Cloudflare Worker"
git push
```

### ✨ المميزات:
- ✅ **مجاني**: 100,000 طلب يومياً
- ✅ **سريع جداً**: CDN عالمي من Cloudflare
- ✅ **موثوق**: يعمل 24/7
- ✅ **آمن**: تحكم كامل في الوكيل الخاص بك

---

## 🆕 حل بديل: استخدام Netlify Functions

إذا كنت تفضل Netlify بدلاً من Cloudflare:

### 1. انشر موقعك على Netlify بدلاً من GitHub Pages

### 2. أنشئ مجلد `netlify/functions` وأضف ملف `proxy.js`:

```javascript
exports.handler = async function(event, context) {
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
        'Accept': 'application/vnd.apple.mpegurl, application/x-mpegurl, */*',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const data = await response.text();

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': response.headers.get('content-type')
      },
      body: data
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
```

### 3. استخدم الرابط: `https://your-site.netlify.app/.netlify/functions/proxy?url=STREAM_URL`

---

## 🔧 حل مؤقت: استخدام VPN

إذا لم تستطع إعداد Cloudflare Worker الآن، أخبر المستخدمين باستخدام VPN:
- **Chrome**: [Urban VPN](https://chromewebstore.google.com/detail/urban-vpn-proxy/eppiocemhmnlbhjplcgkofciiegomcon)
- **Android**: [Urban VPN](https://play.google.com/store/apps/details?id=com.urbanvpn.android)

---

## 📝 ملاحظات مهمة

1. **لا تشارك رابط Cloudflare Worker الخاص بك علنياً** - يمكن استخدامه بشكل غير قانوني
2. **راقب استهلاك الـ Worker** من لوحة التحكم Cloudflare
3. **للأمان الأفضل**: أضف قيود على النطاقات المسموحة في كود الـ Worker

---

## ❓ الأسئلة الشائعة

**س: هل Cloudflare Worker مجاني؟**
ج: نعم، يوفر 100,000 طلب يومياً مجاناً.

**س: هل يمكنني استخدام أكثر من Worker؟**
ج: نعم، يمكنك إنشاء عدة Workers للتوزيع.

**س: لماذا لا تعمل القناة بدون Worker؟**
ج: لأن السيرفر المصدر يمنع طلبات CORS من نطاقات أخرى.

---

## 🎯 التحقق من الحل

بعد تطبيق الخطوات:
1. افتح موقعك على GitHub Pages
2. افتح Developer Tools (F12)
3. اختر Console
4. شغّل القناة
5. يجب أن ترى: ✅ "نجح التحميل مع وكيل GitHub"
