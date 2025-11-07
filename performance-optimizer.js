/**
 * Performance Optimizer for NOON TV
 * Handles lazy loading, intersection observers, and performance enhancements
 */

// Lazy Loading للمودالات الكبيرة
class ModalLazyLoader {
    constructor() {
        this.loadedModals = new Set();
    }

    /**
     * تحميل محتوى المودال بشكل كسول
     */
    loadModal(modalId) {
        if (this.loadedModals.has(modalId)) {
            return Promise.resolve();
        }

        return new Promise((resolve) => {
            // تحميل المودال هنا
            const modal = document.getElementById(modalId);
            if (modal) {
                // تحسين العرض
                modal.style.willChange = 'transform, opacity';
                this.loadedModals.add(modalId);
            }
            resolve();
        });
    }
}

// Intersection Observer لتحميل الصور بشكل كسول
class ImageLazyLoader {
    constructor() {
        this.observer = null;
        this.init();
    }

    init() {
        if ('IntersectionObserver' in window) {
            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.loadImage(entry.target);
                        this.observer.unobserve(entry.target);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.01
            });
        }
    }

    loadImage(img) {
        const src = img.dataset.src || img.src;
        if (src) {
            const tempImg = new Image();
            tempImg.onload = () => {
                img.src = src;
                img.classList.add('loaded');
            };
            tempImg.onerror = () => {
                img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3C/svg%3E';
            };
            tempImg.src = src;
        }
    }

    observe(element) {
        if (this.observer && element) {
            this.observer.observe(element);
        }
    }
}

// تحسين أداء التمرير
class ScrollPerformanceOptimizer {
    constructor() {
        this.ticking = false;
        this.lastScrollY = 0;
    }

    /**
     * استخدام requestAnimationFrame لتحسين أداء التمرير
     */
    optimizeScroll(callback) {
        if (!this.ticking) {
            window.requestAnimationFrame(() => {
                callback(this.lastScrollY);
                this.ticking = false;
            });
            this.ticking = true;
        }
    }

    init(callback) {
        window.addEventListener('scroll', () => {
            this.lastScrollY = window.scrollY;
            this.optimizeScroll(callback);
        }, { passive: true });
    }
}

// تحسين أداء الرسوم المتحركة
class AnimationOptimizer {
    /**
     * استخدام will-change بشكل ذكي
     */
    static optimizeElement(element, properties = ['transform', 'opacity']) {
        if (element && element.style) {
            element.style.willChange = properties.join(', ');
            
            // إزالة will-change بعد انتهاء الرسوم المتحركة
            setTimeout(() => {
                element.style.willChange = 'auto';
            }, 1000);
        }
    }

    /**
     * تقليل الرسوم المتحركة على الأجهزة الضعيفة
     */
    static shouldReduceMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
               navigator.hardwareConcurrency <= 2 || // أجهزة ذات معالجات ضعيفة
               navigator.deviceMemory <= 2; // أجهزة ذات ذاكرة قليلة
    }

    /**
     * تطبيق الرسوم المتحركة المناسبة
     */
    static applyAnimation(element, animationClass) {
        if (this.shouldReduceMotion()) {
            // تطبيق رسوم متحركة مبسطة
            element.style.transition = 'none';
        } else {
            element.classList.add(animationClass);
        }
    }
}

// Cache للموارد
class ResourceCache {
    constructor() {
        this.cache = new Map();
        this.maxSize = 50;
    }

    set(key, value) {
        if (this.cache.size >= this.maxSize) {
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }
        this.cache.set(key, {
            value,
            timestamp: Date.now()
        });
    }

    get(key, maxAge = 300000) { // 5 دقائق افتراضياً
        const item = this.cache.get(key);
        if (!item) return null;
        
        if (Date.now() - item.timestamp > maxAge) {
            this.cache.delete(key);
            return null;
        }
        
        return item.value;
    }

    clear() {
        this.cache.clear();
    }
}

// Debounce function للبحث والتصفية
function debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function للأحداث المتكررة
function throttle(func, limit = 100) {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// تحسين أداء DOM
class DOMOptimizer {
    /**
     * استخدام DocumentFragment لإضافة عناصر متعددة
     */
    static createFragment(htmlString) {
        const template = document.createElement('template');
        template.innerHTML = htmlString.trim();
        return template.content;
    }

    /**
     * إضافة عناصر بكفاءة
     */
    static appendMultiple(container, elements) {
        const fragment = document.createDocumentFragment();
        elements.forEach(el => fragment.appendChild(el));
        container.appendChild(fragment);
    }

    /**
     * تحديث محتوى بدون إعادة تحميل كاملة
     */
    static updateContent(element, content) {
        if (element.textContent !== content) {
            element.textContent = content;
        }
    }
}

// كشف نوع الجهاز والأداء
class DeviceDetector {
    static getDeviceInfo() {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const isLowEnd = this.isLowEndDevice();
        
        return {
            isMobile,
            isLowEnd,
            cores: navigator.hardwareConcurrency || 1,
            memory: navigator.deviceMemory || 1,
            connection: this.getConnectionInfo()
        };
    }

    static isLowEndDevice() {
        // اكتشاف الأجهزة الضعيفة
        const cores = navigator.hardwareConcurrency || 1;
        const memory = navigator.deviceMemory || 1;
        
        return cores <= 2 || memory <= 2;
    }

    static getConnectionInfo() {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        if (connection) {
            return {
                effectiveType: connection.effectiveType,
                downlink: connection.downlink,
                rtt: connection.rtt,
                saveData: connection.saveData
            };
        }
        return null;
    }

    static shouldOptimizeForPerformance() {
        const deviceInfo = this.getDeviceInfo();
        return deviceInfo.isLowEnd || 
               (deviceInfo.connection && deviceInfo.connection.saveData) ||
               (deviceInfo.connection && deviceInfo.connection.effectiveType === 'slow-2g') ||
               (deviceInfo.connection && deviceInfo.connection.effectiveType === '2g');
    }
}

// تصدير للاستخدام العالمي
if (typeof window !== 'undefined') {
    window.PerformanceOptimizer = {
        ModalLazyLoader,
        ImageLazyLoader,
        ScrollPerformanceOptimizer,
        AnimationOptimizer,
        ResourceCache,
        DOMOptimizer,
        DeviceDetector,
        debounce,
        throttle
    };

    // تطبيق التحسينات التلقائية
    document.addEventListener('DOMContentLoaded', () => {
        // تحسين الصور
        const imageLazyLoader = new ImageLazyLoader();
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageLazyLoader.observe(img);
        });

        // تقليل الرسوم المتحركة على الأجهزة الضعيفة
        if (DeviceDetector.shouldOptimizeForPerformance()) {
            document.body.classList.add('low-performance-mode');
            console.log('🔧 تم تفعيل وضع الأداء المنخفض تلقائياً');
        }
    });
}
