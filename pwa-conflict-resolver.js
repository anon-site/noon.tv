/**
 * PWA Conflict Resolver for ANON TV
 * حل مشكلة تعارض PWA لتطبيق ANON TV
 * 
 * كيفية الاستخدام:
 * 1. افتح Developer Tools (F12)
 * 2. اذهب إلى تبويب Console
 * 3. انسخ والصق هذا الكود
 * 4. اضغط Enter
 */

console.log('🔧 بدء حل مشكلة تعارض PWA...');

async function resolvePWAConflict() {
    if (!('serviceWorker' in navigator)) {
        console.error('❌ Service Worker غير مدعوم في هذا المتصفح');
        alert('Service Worker غير مدعوم في هذا المتصفح');
        return;
    }

    try {
        console.log('🔍 البحث عن Service Workers المسجلة...');
        const registrations = await navigator.serviceWorker.getRegistrations();
        let conflictsFound = false;
        
        console.log(`📋 تم العثور على ${registrations.length} Service Worker مسجل`);
        
        for (const registration of registrations) {
            console.log(`🔍 فحص: ${registration.scope}`);
            
            // Check for any conflicting registrations from the same domain
            if (registration.scope.includes('anon-site.github.io') && 
                !registration.scope.includes('TV-AR')) {
                console.log('⚠️ تم العثور على تعارض:', registration.scope);
                await registration.unregister();
                console.log('✅ تم إلغاء تسجيل Service Worker المتعارض');
                conflictsFound = true;
            }
            
            // Also check for old ANON TV registrations
            if (registration.scope.includes('anon-tv') && 
                !registration.scope.includes('anon-tv-ar')) {
                console.log('⚠️ تم العثور على إصدار قديم:', registration.scope);
                await registration.unregister();
                console.log('✅ تم إلغاء تسجيل الإصدار القديم');
                conflictsFound = true;
            }
        }
        
        if (conflictsFound) {
            console.log('🗑️ مسح الـ Caches المتعارضة...');
            // Clear all conflicting caches
            const cacheNames = await caches.keys();
            let deletedCaches = 0;
            
            for (const cacheName of cacheNames) {
                // Remove old caches that don't match our new naming
                if ((cacheName.includes('anon-tv') && !cacheName.includes('anon-tv-ar')) ||
                    (cacheName.includes('anon-site') && !cacheName.includes('TV-AR'))) {
                    await caches.delete(cacheName);
                    console.log(`🗑️ تم حذف cache: ${cacheName}`);
                    deletedCaches++;
                }
            }
            
            console.log(`✅ تم حذف ${deletedCaches} cache متعارض`);
            
            // Show success message
            console.log('🎉 تم حل التعارض بنجاح!');
            alert('تم حل التعارض بنجاح!\n\nيمكنك الآن تثبيت تطبيق ANON TV.\nسيتم إعادة تحميل الصفحة خلال 3 ثوان...');
            
            // Reload page to ensure clean state
            setTimeout(() => {
                window.location.reload();
            }, 3000);
            
        } else {
            console.log('✅ لا توجد تعارضات');
            alert('لا توجد تطبيقات متعارضة.\nالتطبيق جاهز للتثبيت!');
        }
        
    } catch (error) {
        console.error('❌ فشل في حل التعارض:', error);
        alert('فشل في حل التعارض.\nالخطأ: ' + error.message + '\n\nحاول مرة أخرى أو اتصل بالدعم الفني.');
    }
}

// تشغيل الحل تلقائياً
resolvePWAConflict();

// إضافة معلومات إضافية للمطور
console.log(`
📱 معلومات PWA:
- User Agent: ${navigator.userAgent}
- Service Worker Support: ${'serviceWorker' in navigator}
- Cache API Support: ${'caches' in window}
- Current URL: ${window.location.href}
- Display Mode: ${window.matchMedia('(display-mode: standalone)').matches ? 'Standalone' : 'Browser'}
`);

// دالة مساعدة لفحص حالة PWA
function checkPWAStatus() {
    console.log('🔍 فحص حالة PWA...');
    
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(registrations => {
            console.log(`📋 Service Workers مسجلة: ${registrations.length}`);
            registrations.forEach((reg, index) => {
                console.log(`  ${index + 1}. ${reg.scope}`);
            });
        });
    }
    
    if ('caches' in window) {
        caches.keys().then(cacheNames => {
            console.log(`🗄️ Caches متاحة: ${cacheNames.length}`);
            cacheNames.forEach((name, index) => {
                console.log(`  ${index + 1}. ${name}`);
            });
        });
    }
}

// تشغيل فحص الحالة
setTimeout(checkPWAStatus, 1000);
