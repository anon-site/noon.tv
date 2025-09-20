# أيقونات التطبيق - ANON TV

هذا المجلد يحتوي على جميع أيقونات التطبيق المطلوبة لدعم التثبيت على مختلف الأجهزة والأنظمة.

## الأيقونات المطلوبة

### أيقونات PWA الأساسية
- `icon-72x72.png` - أيقونة 72x72 بكسل
- `icon-96x96.png` - أيقونة 96x96 بكسل  
- `icon-128x128.png` - أيقونة 128x128 بكسل
- `icon-144x144.png` - أيقونة 144x144 بكسل
- `icon-152x152.png` - أيقونة 152x152 بكسل
- `icon-192x192.png` - أيقونة 192x192 بكسل (maskable)
- `icon-384x384.png` - أيقونة 384x384 بكسل
- `icon-512x512.png` - أيقونة 512x512 بكسل (maskable)

### أيقونات Apple Touch
- `apple-touch-icon-57x57.png` - أيقونة Apple 57x57
- `apple-touch-icon-60x60.png` - أيقونة Apple 60x60
- `apple-touch-icon-72x72.png` - أيقونة Apple 72x72
- `apple-touch-icon-76x76.png` - أيقونة Apple 76x76
- `apple-touch-icon-114x114.png` - أيقونة Apple 114x114
- `apple-touch-icon-120x120.png` - أيقونة Apple 120x120
- `apple-touch-icon-144x144.png` - أيقونة Apple 144x144
- `apple-touch-icon-152x152.png` - أيقونة Apple 152x152
- `apple-touch-icon-180x180.png` - أيقونة Apple 180x180

### أيقونات Android
- `android-chrome-192x192.png` - أيقونة Android 192x192
- `android-chrome-512x512.png` - أيقونة Android 512x512

### أيقونات Windows
- `ms-icon-70x70.png` - أيقونة Windows 70x70
- `ms-icon-150x150.png` - أيقونة Windows 150x150
- `ms-icon-310x150.png` - أيقونة Windows 310x150
- `ms-icon-310x310.png` - أيقونة Windows 310x310

### أيقونات Safari
- `safari-pinned-tab.svg` - أيقونة Safari المثبتة

### أيقونات الاختصارات
- `shortcut-home.png` - أيقونة اختصار الرئيسية
- `shortcut-news.png` - أيقونة اختصار الأخبار
- `shortcut-sports.png` - أيقونة اختصار الرياضة
- `shortcut-favorites.png` - أيقونة اختصار المفضلة

### أيقونات الإجراءات
- `action-explore.png` - أيقونة استكشاف
- `action-close.png` - أيقونة إغلاق

## كيفية إنشاء الأيقونات

### الطريقة الأولى: استخدام أدوات الإنترنت
1. اذهب إلى [PWA Builder](https://www.pwabuilder.com/imageGenerator)
2. ارفع أيقونة أساسية (512x512 بكسل)
3. حمل جميع الأيقونات المطلوبة

### الطريقة الثانية: استخدام أدوات محلية
1. استخدم برامج مثل GIMP أو Photoshop
2. أنشئ أيقونة أساسية بحجم 512x512 بكسل
3. قم بتغيير حجمها للأحجام المطلوبة
4. احفظها بصيغة PNG

### الطريقة الثالثة: استخدام سكريبت تلقائي
```bash
# يمكنك استخدام ImageMagick لإنشاء جميع الأحجام تلقائياً
convert favicon.svg -resize 72x72 icons/icon-72x72.png
convert favicon.svg -resize 96x96 icons/icon-96x96.png
convert favicon.svg -resize 128x128 icons/icon-128x128.png
convert favicon.svg -resize 144x144 icons/icon-144x144.png
convert favicon.svg -resize 152x152 icons/icon-152x152.png
convert favicon.svg -resize 192x192 icons/icon-192x192.png
convert favicon.svg -resize 384x384 icons/icon-384x384.png
convert favicon.svg -resize 512x512 icons/icon-512x512.png
```

## ملاحظات مهمة

1. **الأيقونات Maskable**: الأيقونات 192x192 و 512x512 يجب أن تكون maskable، أي تحتوي على padding إضافي حول المحتوى الرئيسي
2. **جودة الأيقونات**: استخدم دقة عالية (300 DPI) للحصول على أفضل جودة
3. **التصميم**: تأكد من أن الأيقونة واضحة ومقروءة في جميع الأحجام
4. **الألوان**: استخدم ألوان متناسقة مع هوية التطبيق

## اختبار التثبيت

بعد إضافة جميع الأيقونات، يمكنك اختبار التثبيت من خلال:

1. فتح التطبيق في المتصفح
2. البحث عن أيقونة التثبيت في شريط العنوان
3. أو استخدام زر التثبيت المخصص في التطبيق
4. اختبار التثبيت على أجهزة مختلفة (Android, iOS, Desktop)
